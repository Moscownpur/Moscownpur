-- 9th Migration: Create Events Table
-- Step 1: Create the events table
CREATE TABLE IF NOT EXISTS public.events (
    event_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chapter_id UUID NOT NULL REFERENCES public.chapters(chapter_id) ON DELETE CASCADE,
    story_time TIMESTAMPTZ NOT NULL,
    title VARCHAR(255) NOT NULL,
    context JSONB,
    timeline_version INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 2: Create indexes for better performance
CREATE INDEX IF NOT EXISTS events_chapter_id_idx ON public.events(chapter_id);
CREATE INDEX IF NOT EXISTS events_story_time_idx ON public.events(story_time);

-- Step 3: Enable Row Level Security
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Step 4: Create policies
-- Policy: Anyone can view events
CREATE POLICY events_select_policy ON public.events
    FOR SELECT USING (true);

-- Policy: Users can create events for chapters in worlds they own
CREATE POLICY events_insert_policy ON public.events
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.chapters c
            JOIN public.worlds w ON c.world_id = w.world_id
            WHERE c.chapter_id = events.chapter_id
            AND w.user_id = auth.uid()
        )
    );

-- Policy: Users can update events for chapters in worlds they own
CREATE POLICY events_update_policy ON public.events
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.chapters c
            JOIN public.worlds w ON c.world_id = w.world_id
            WHERE c.chapter_id = events.chapter_id
            AND w.user_id = auth.uid()
        )
    );

-- Policy: Users can delete events for chapters in worlds they own
CREATE POLICY events_delete_policy ON public.events
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.chapters c
            JOIN public.worlds w ON c.world_id = w.world_id
            WHERE c.chapter_id = events.chapter_id
            AND w.user_id = auth.uid()
        )
    );

-- Step 5: Add comment for documentation
COMMENT ON TABLE public.events IS 'Stores events within chapters. Events represent in-universe happenings.';

-- Step 6: Create trigger function for updated_at
CREATE OR REPLACE FUNCTION update_events_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 7: Create trigger for updated_at
CREATE TRIGGER update_events_updated_at
    BEFORE UPDATE ON public.events
    FOR EACH ROW
    EXECUTE FUNCTION update_events_updated_at();