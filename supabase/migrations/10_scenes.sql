-- 10th Migration: Create Scenes Table
-- Step 1: Create the scenes table
CREATE TABLE IF NOT EXISTS public.scenes (
    scene_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES public.events(event_id) ON DELETE CASCADE,
    narration TEXT,
    background_image_url TEXT,
    transitions JSONB,
    cultural_tags UUID[],
    validation_status JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 2: Create indexes for better performance
CREATE INDEX IF NOT EXISTS scenes_event_id_idx ON public.scenes(event_id);
CREATE INDEX IF NOT EXISTS scenes_cultural_tags_idx ON public.scenes USING GIN(cultural_tags);

-- Step 3: Enable Row Level Security
ALTER TABLE public.scenes ENABLE ROW LEVEL SECURITY;

-- Step 4: Create policies
-- Policy: Anyone can view scenes
CREATE POLICY scenes_select_policy ON public.scenes
    FOR SELECT USING (true);

-- Policy: Users can create scenes for events in worlds they own
CREATE POLICY scenes_insert_policy ON public.scenes
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.events e
            JOIN public.chapters c ON e.chapter_id = c.chapter_id
            JOIN public.worlds w ON c.world_id = w.world_id
            WHERE e.event_id = scenes.event_id
            AND w.user_id = auth.uid()
        )
    );

-- Policy: Users can update scenes for events in worlds they own
CREATE POLICY scenes_update_policy ON public.scenes
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.events e
            JOIN public.chapters c ON e.chapter_id = c.chapter_id
            JOIN public.worlds w ON c.world_id = w.world_id
            WHERE e.event_id = scenes.event_id
            AND w.user_id = auth.uid()
        )
    );

-- Policy: Users can delete scenes for events in worlds they own
CREATE POLICY scenes_delete_policy ON public.scenes
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.events e
            JOIN public.chapters c ON e.chapter_id = c.chapter_id
            JOIN public.worlds w ON c.world_id = w.world_id
            WHERE e.event_id = scenes.event_id
            AND w.user_id = auth.uid()
        )
    );

-- Step 5: Add comment for documentation
COMMENT ON TABLE public.scenes IS 'Stores scenes within events. Scenes contain the actual content of the story.';

-- Step 6: Create trigger function for updated_at
CREATE OR REPLACE FUNCTION update_scenes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 7: Create trigger for updated_at
CREATE TRIGGER update_scenes_updated_at
    BEFORE UPDATE ON public.scenes
    FOR EACH ROW
    EXECUTE FUNCTION update_scenes_updated_at();