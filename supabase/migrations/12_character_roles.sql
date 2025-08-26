-- 12th Migration: Create Character Roles Table
-- Step 1: Create the character_roles table
CREATE TABLE IF NOT EXISTS public.character_roles (
    role_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scene_id UUID NOT NULL REFERENCES public.scenes(scene_id) ON DELETE CASCADE,
    character_id UUID NOT NULL REFERENCES public.characters(character_id) ON DELETE CASCADE,
    emotional_state JSONB,
    relationships JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Ensure a character can only appear once in a scene
    CONSTRAINT unique_character_per_scene UNIQUE (scene_id, character_id)
);

-- Step 2: Create indexes for better performance
CREATE INDEX IF NOT EXISTS character_roles_scene_id_idx ON public.character_roles(scene_id);
CREATE INDEX IF NOT EXISTS character_roles_character_id_idx ON public.character_roles(character_id);
CREATE INDEX IF NOT EXISTS character_roles_emotional_state_idx ON public.character_roles USING GIN(emotional_state);

-- Step 3: Enable Row Level Security
ALTER TABLE public.character_roles ENABLE ROW LEVEL SECURITY;

-- Step 4: Create policies
-- Policy: Anyone can view character roles
CREATE POLICY character_roles_select_policy ON public.character_roles
    FOR SELECT USING (true);

-- Policy: Users can create character roles for scenes in worlds they own
CREATE POLICY character_roles_insert_policy ON public.character_roles
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.scenes s
            JOIN public.events e ON s.event_id = e.event_id
            JOIN public.chapters c ON e.chapter_id = c.chapter_id
            JOIN public.worlds w ON c.world_id = w.world_id
            WHERE s.scene_id = character_roles.scene_id
            AND w.user_id = auth.uid()
        )
        AND
        EXISTS (
            SELECT 1 FROM public.characters ch
            JOIN public.worlds w ON ch.world_id = w.world_id
            WHERE ch.character_id = character_roles.character_id
            AND w.user_id = auth.uid()
        )
    );

-- Policy: Users can update character roles for scenes in worlds they own
CREATE POLICY character_roles_update_policy ON public.character_roles
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.scenes s
            JOIN public.events e ON s.event_id = e.event_id
            JOIN public.chapters c ON e.chapter_id = c.chapter_id
            JOIN public.worlds w ON c.world_id = w.world_id
            WHERE s.scene_id = character_roles.scene_id
            AND w.user_id = auth.uid()
        )
        AND
        EXISTS (
            SELECT 1 FROM public.characters ch
            JOIN public.worlds w ON ch.world_id = w.world_id
            WHERE ch.character_id = character_roles.character_id
            AND w.user_id = auth.uid()
        )
    );

-- Policy: Users can delete character roles for scenes in worlds they own
CREATE POLICY character_roles_delete_policy ON public.character_roles
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.scenes s
            JOIN public.events e ON s.event_id = e.event_id
            JOIN public.chapters c ON e.chapter_id = c.chapter_id
            JOIN public.worlds w ON c.world_id = w.world_id
            WHERE s.scene_id = character_roles.scene_id
            AND w.user_id = auth.uid()
        )
        AND
        EXISTS (
            SELECT 1 FROM public.characters ch
            JOIN public.worlds w ON ch.world_id = w.world_id
            WHERE ch.character_id = character_roles.character_id
            AND w.user_id = auth.uid()
        )
    );

-- Step 5: Add comment for documentation
COMMENT ON TABLE public.character_roles IS 'Tracks character appearances in scenes, including emotional state and relationships at that moment.';

-- Step 6: Create trigger function for updated_at
CREATE OR REPLACE FUNCTION update_character_roles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 7: Create trigger for updated_at
CREATE TRIGGER update_character_roles_updated_at
    BEFORE UPDATE ON public.character_roles
    FOR EACH ROW
    EXECUTE FUNCTION update_character_roles_updated_at();