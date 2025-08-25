-- 7th Migration: Create Worlds Table with User Ownership
-- Step 1: Create the timeline_mode enum type
CREATE TYPE timeline_mode_enum AS ENUM ('linear', 'branching', 'cyclical');

-- Step 2: Create the worlds table with owner reference
CREATE TABLE IF NOT EXISTS public.worlds (
    world_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    settings JSONB,
    timeline_mode timeline_mode_enum DEFAULT 'linear',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    current_timeline_version INTEGER DEFAULT 1
);

-- Step 3: Create indexes for better performance
CREATE INDEX IF NOT EXISTS worlds_name_idx ON public.worlds(name);
CREATE INDEX IF NOT EXISTS worlds_user_id_idx ON public.worlds(user_id);
CREATE INDEX IF NOT EXISTS worlds_settings_idx ON public.worlds USING GIN(settings);

-- Step 4: Enable Row Level Security
ALTER TABLE public.worlds ENABLE ROW LEVEL SECURITY;

-- Step 5: Create policies
-- Policy: Anyone can view worlds (for collaboration and inspiration)
CREATE POLICY worlds_select_policy ON public.worlds
    FOR SELECT USING (true);

-- Policy: Authenticated users can create their own worlds
CREATE POLICY worlds_insert_policy ON public.worlds
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own worlds
CREATE POLICY worlds_update_policy ON public.worlds
    FOR UPDATE USING (auth.uid() = user_id);

-- Policy: Users can delete their own worlds
CREATE POLICY worlds_delete_policy ON public.worlds
    FOR DELETE USING (auth.uid() = user_id);

-- Step 6: Add comment for documentation
COMMENT ON TABLE public.worlds IS 'Stores story worlds with different timeline modes. Users own their worlds, but they are visible to all for collaboration.';