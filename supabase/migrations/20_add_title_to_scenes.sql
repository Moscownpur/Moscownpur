-- 16th Migration: Add title column to scenes table
-- Step 1: Add title column to scenes table
ALTER TABLE public.scenes 
ADD COLUMN title VARCHAR(255);

-- Step 2: Update existing scenes to have a title based on their narration
UPDATE public.scenes 
SET title = CASE 
    WHEN narration IS NULL OR narration = '' THEN 'Untitled Scene'
    WHEN LENGTH(narration) <= 50 THEN narration
    ELSE LEFT(narration, 50) || '...'
END;

-- Step 3: Make title column NOT NULL after populating it
ALTER TABLE public.scenes 
ALTER COLUMN title SET NOT NULL;

-- Step 4: Add index for better performance on title searches
CREATE INDEX IF NOT EXISTS scenes_title_idx ON public.scenes(title);

-- Step 5: Add comment for documentation
COMMENT ON COLUMN public.scenes.title IS 'The title of the scene, separate from the narration content';

-- Step 6: Update the trigger function to handle the new title column
-- (The existing trigger will continue to work as it updates updated_at)
