-- 13th Migration: Create Dialogues Table
-- Step 1: Create the delivery_type enum type
CREATE TYPE delivery_type_enum AS ENUM ('speech_bubble', 'narration', 'thought', 'song');

-- Step 2: Create the dialogues table
CREATE TABLE IF NOT EXISTS public.dialogues (
    dialogue_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scene_id UUID NOT NULL REFERENCES public.scenes(scene_id) ON DELETE CASCADE,
    character_id UUID REFERENCES public.characters(character_id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    delivery_type delivery_type_enum DEFAULT 'speech_bubble',
    sequence INTEGER NOT NULL,
    sentiment_score FLOAT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 3: Create indexes for better performance
CREATE INDEX IF NOT EXISTS dialogues_scene_id_idx ON public.dialogues(scene_id);
CREATE INDEX IF NOT EXISTS dialogues_character_id_idx ON public.dialogues(character_id);
CREATE INDEX IF NOT EXISTS dialogues_sequence_idx ON public.dialogues(sequence);
CREATE INDEX IF NOT EXISTS dialogues_sentiment_score_idx ON public.dialogues(sentiment_score);

-- Step 4: Enable Row Level Security
ALTER TABLE public.dialogues ENABLE ROW LEVEL SECURITY;

-- Step 5: Create policies
-- Policy: Anyone can view dialogues
CREATE POLICY dialogues_select_policy ON public.dialogues
    FOR SELECT USING (true);

-- Policy: Users can create dialogues for scenes in worlds they own
CREATE POLICY dialogues_insert_policy ON public.dialogues
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.scenes s
            JOIN public.events e ON s.event_id = e.event_id
            JOIN public.chapters c ON e.chapter_id = c.chapter_id
            JOIN public.worlds w ON c.world_id = w.world_id
            WHERE s.scene_id = dialogues.scene_id
            AND w.user_id = auth.uid()
        )
        AND
        (
            dialogues.character_id IS NULL OR
            EXISTS (
                SELECT 1 FROM public.characters ch
                JOIN public.worlds w ON ch.world_id = w.world_id
                WHERE ch.character_id = dialogues.character_id
                AND w.user_id = auth.uid()
            )
        )
    );

-- Policy: Users can update dialogues for scenes in worlds they own
CREATE POLICY dialogues_update_policy ON public.dialogues
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.scenes s
            JOIN public.events e ON s.event_id = e.event_id
            JOIN public.chapters c ON e.chapter_id = c.chapter_id
            JOIN public.worlds w ON c.world_id = w.world_id
            WHERE s.scene_id = dialogues.scene_id
            AND w.user_id = auth.uid()
        )
        AND
        (
            dialogues.character_id IS NULL OR
            EXISTS (
                SELECT 1 FROM public.characters ch
                JOIN public.worlds w ON ch.world_id = w.world_id
                WHERE ch.character_id = dialogues.character_id
                AND w.user_id = auth.uid()
            )
        )
    );

-- Policy: Users can delete dialogues for scenes in worlds they own
CREATE POLICY dialogues_delete_policy ON public.dialogues
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.scenes s
            JOIN public.events e ON s.event_id = e.event_id
            JOIN public.chapters c ON e.chapter_id = c.chapter_id
            JOIN public.worlds w ON c.world_id = w.world_id
            WHERE s.scene_id = dialogues.scene_id
            AND w.user_id = auth.uid()
        )
        AND
        (
            dialogues.character_id IS NULL OR
            EXISTS (
                SELECT 1 FROM public.characters ch
                JOIN public.worlds w ON ch.world_id = w.world_id
                WHERE ch.character_id = dialogues.character_id
                AND w.user_id = auth.uid()
            )
        )
    );

-- Step 6: Add comment for documentation
COMMENT ON TABLE public.dialogues IS 'Stores dialogue lines in scenes, including narration and character speech.';

-- Step 7: Create trigger function for updated_at
CREATE OR REPLACE FUNCTION update_dialogues_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 8: Create trigger for updated_at
CREATE TRIGGER update_dialogues_updated_at
    BEFORE UPDATE ON public.dialogues
    FOR EACH ROW
    EXECUTE FUNCTION update_dialogues_updated_at();