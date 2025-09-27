-- Fix dialogue RLS policies to allow normal CREATE and UPDATE operations
-- The current policies are too complex and causing permission errors

-- Drop existing policies
DROP POLICY IF EXISTS dialogues_select_policy ON public.dialogues;
DROP POLICY IF EXISTS dialogues_insert_policy ON public.dialogues;
DROP POLICY IF EXISTS dialogues_update_policy ON public.dialogues;
DROP POLICY IF EXISTS dialogues_delete_policy ON public.dialogues;

-- Create simplified policies

-- Policy: Users can view dialogues in scenes from worlds they own
CREATE POLICY dialogues_select_policy ON public.dialogues
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.scenes s
            JOIN public.events e ON s.event_id = e.event_id
            JOIN public.chapters c ON e.chapter_id = c.chapter_id
            JOIN public.worlds w ON c.world_id = w.world_id
            WHERE s.scene_id = dialogues.scene_id
            AND w.user_id = auth.uid()
        )
    );

-- Policy: Users can create dialogues in scenes from worlds they own
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

-- Policy: Users can update dialogues in scenes from worlds they own
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
    ) WITH CHECK (
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

-- Policy: Users can delete dialogues in scenes from worlds they own
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
    );

-- Update table comment
COMMENT ON TABLE public.dialogues IS 'Stores dialogue lines in scenes. Users can manage dialogues in their own worlds.';
