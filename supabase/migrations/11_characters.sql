-- 11th Migration: Create Characters Table
-- Step 1: Create the characters table
CREATE TABLE IF NOT EXISTS public.characters (
    character_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    world_id UUID NOT NULL REFERENCES public.worlds(world_id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    origin_story JSONB,
    traits JSONB,
    knowledge_base UUID[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 2: Create indexes for better performance
CREATE INDEX IF NOT EXISTS characters_world_id_idx ON public.characters(world_id);
CREATE INDEX IF NOT EXISTS characters_name_idx ON public.characters(name);
CREATE INDEX IF NOT EXISTS characters_traits_idx ON public.characters USING GIN(traits);

-- Step 3: Enable Row Level Security
ALTER TABLE public.characters ENABLE ROW LEVEL SECURITY;

-- Step 4: Create policies
-- Policy: Anyone can view characters
CREATE POLICY characters_select_policy ON public.characters
    FOR SELECT USING (true);

-- Policy: Users can create characters for worlds they own
CREATE POLICY characters_insert_policy ON public.characters
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.worlds w
            WHERE w.world_id = characters.world_id
            AND w.user_id = auth.uid()
        )
    );

-- Policy: Users can update characters for worlds they own
CREATE POLICY characters_update_policy ON public.characters
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.worlds w
            WHERE w.world_id = characters.world_id
            AND w.user_id = auth.uid()
        )
    );

-- Policy: Users can delete characters for worlds they own
CREATE POLICY characters_delete_policy ON public.characters
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.worlds w
            WHERE w.world_id = characters.world_id
            AND w.user_id = auth.uid()
        )
    );

-- Step 5: Add comment for documentation
COMMENT ON TABLE public.characters IS 'Stores characters within story worlds. Characters have traits, origin stories, and knowledge bases.';

-- Step 6: Create trigger function for updated_at
CREATE OR REPLACE FUNCTION update_characters_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 7: Create trigger for updated_at
CREATE TRIGGER update_characters_updated_at
    BEFORE UPDATE ON public.characters
    FOR EACH ROW
    EXECUTE FUNCTION update_characters_updated_at();