-- 14th Migration: Create Relationships Table
-- Step 1: Create the relationship_type enum type
CREATE TYPE relationship_type_enum AS ENUM ('family', 'friendship', 'rivalry', 'romantic', 'professional');

-- Step 2: Create the relationships table
CREATE TABLE IF NOT EXISTS public.relationships (
    relationship_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    character_a UUID NOT NULL REFERENCES public.characters(character_id) ON DELETE CASCADE,
    character_b UUID NOT NULL REFERENCES public.characters(character_id) ON DELETE CASCADE,
    type relationship_type_enum NOT NULL,
    strength FLOAT NOT NULL DEFAULT 0.5 CHECK (strength >= 0 AND strength <= 1),
    history JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Ensure character_a is always less than character_b to prevent duplicate relationships
    CONSTRAINT character_order CHECK (character_a < character_b),
    
    -- Ensure only one relationship between any two characters
    CONSTRAINT unique_relationship UNIQUE (character_a, character_b)
);

-- Step 3: Create indexes for better performance
CREATE INDEX IF NOT EXISTS relationships_character_a_idx ON public.relationships(character_a);
CREATE INDEX IF NOT EXISTS relationships_character_b_idx ON public.relationships(character_b);
CREATE INDEX IF NOT EXISTS relationships_type_idx ON public.relationships(type);
CREATE INDEX IF NOT EXISTS relationships_strength_idx ON public.relationships(strength);

-- Step 4: Enable Row Level Security
ALTER TABLE public.relationships ENABLE ROW LEVEL SECURITY;

-- Step 5: Create policies
-- Policy: Anyone can view relationships
CREATE POLICY relationships_select_policy ON public.relationships
    FOR SELECT USING (true);

-- Policy: Users can create relationships for characters in worlds they own
CREATE POLICY relationships_insert_policy ON public.relationships
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.characters c1
            JOIN public.worlds w1 ON c1.world_id = w1.world_id
            WHERE c1.character_id = relationships.character_a
            AND w1.user_id = auth.uid()
        )
        AND
        EXISTS (
            SELECT 1 FROM public.characters c2
            JOIN public.worlds w2 ON c2.world_id = w2.world_id
            WHERE c2.character_id = relationships.character_b
            AND w2.user_id = auth.uid()
        )
        AND
        -- Ensure both characters are from the same world
        (SELECT c1.world_id FROM public.characters c1 WHERE c1.character_id = relationships.character_a) =
        (SELECT c2.world_id FROM public.characters c2 WHERE c2.character_id = relationships.character_b)
    );

-- Policy: Users can update relationships for characters in worlds they own
CREATE POLICY relationships_update_policy ON public.relationships
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.characters c1
            JOIN public.worlds w1 ON c1.world_id = w1.world_id
            WHERE c1.character_id = relationships.character_a
            AND w1.user_id = auth.uid()
        )
        AND
        EXISTS (
            SELECT 1 FROM public.characters c2
            JOIN public.worlds w2 ON c2.world_id = w2.world_id
            WHERE c2.character_id = relationships.character_b
            AND w2.user_id = auth.uid()
        )
        AND
        -- Ensure both characters are from the same world
        (SELECT c1.world_id FROM public.characters c1 WHERE c1.character_id = relationships.character_a) =
        (SELECT c2.world_id FROM public.characters c2 WHERE c2.character_id = relationships.character_b)
    );

-- Policy: Users can delete relationships for characters in worlds they own
CREATE POLICY relationships_delete_policy ON public.relationships
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.characters c1
            JOIN public.worlds w1 ON c1.world_id = w1.world_id
            WHERE c1.character_id = relationships.character_a
            AND w1.user_id = auth.uid()
        )
        AND
        EXISTS (
            SELECT 1 FROM public.characters c2
            JOIN public.worlds w2 ON c2.world_id = w2.world_id
            WHERE c2.character_id = relationships.character_b
            AND w2.user_id = auth.uid()
        )
        AND
        -- Ensure both characters are from the same world
        (SELECT c1.world_id FROM public.characters c1 WHERE c1.character_id = relationships.character_a) =
        (SELECT c2.world_id FROM public.characters c2 WHERE c2.character_id = relationships.character_b)
    );

-- Step 6: Add comment for documentation
COMMENT ON TABLE public.relationships IS 'Stores relationships between characters, including type, strength, and history.';

-- Step 7: Create trigger function for updated_at
CREATE OR REPLACE FUNCTION update_relationships_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 8: Create trigger for updated_at
CREATE TRIGGER update_relationships_updated_at
    BEFORE UPDATE ON public.relationships
    FOR EACH ROW
    EXECUTE FUNCTION update_relationships_updated_at();