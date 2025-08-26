-- 8th Migration: Create Chapters Table (Fixed)
-- Step 1: Create the chapter_status enum type
CREATE TYPE chapter_status_enum AS ENUM ('draft', 'published');

-- Step 2: Create the chapters table
CREATE TABLE IF NOT EXISTS public.chapters (
    chapter_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    world_id UUID NOT NULL REFERENCES public.worlds(world_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    chapter_order INTEGER NOT NULL,
    template_type VARCHAR(100),
    status chapter_status_enum DEFAULT 'draft',
    timeline_version INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 3: Create indexes for better performance
CREATE INDEX IF NOT EXISTS chapters_world_id_idx ON public.chapters(world_id);
CREATE INDEX IF NOT EXISTS chapters_order_idx ON public.chapters(chapter_order);  -- Updated index name
CREATE INDEX IF NOT EXISTS chapters_status_idx ON public.chapters(status);

-- Step 4: Enable Row Level Security
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;

-- Step 5: Create policies
-- Policy: Anyone can view chapters
CREATE POLICY chapters_select_policy ON public.chapters
    FOR SELECT USING (true);

-- Policy: Users can create chapters for worlds they own
CREATE POLICY chapters_insert_policy ON public.chapters
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.worlds w
            WHERE w.world_id = chapters.world_id
            AND w.user_id = auth.uid()
        )
    );

-- Policy: Users can update chapters for worlds they own
CREATE POLICY chapters_update_policy ON public.chapters
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.worlds w
            WHERE w.world_id = chapters.world_id
            AND w.user_id = auth.uid()
        )
    );

-- Policy: Users can delete chapters for worlds they own
CREATE POLICY chapters_delete_policy ON public.chapters
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.worlds w
            WHERE w.world_id = chapters.world_id
            AND w.user_id = auth.uid()
        )
    );

-- Step 6: Add comment for documentation
COMMENT ON TABLE public.chapters IS 'Stores chapters within story worlds. Chapters are owned by the world creator.';

-- Step 7: Create trigger function for updated_at
CREATE OR REPLACE FUNCTION update_chapters_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 8: Create trigger for updated_at
CREATE TRIGGER update_chapters_updated_at
    BEFORE UPDATE ON public.chapters
    FOR EACH ROW
    EXECUTE FUNCTION update_chapters_updated_at();