-- 39th Migration: Create Character Relationships Table
-- Step 1: Create the character_relationships table
CREATE TABLE IF NOT EXISTS public.character_relationships (
    relationship_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    character_id UUID NOT NULL REFERENCES public.characters(character_id) ON DELETE CASCADE,
    related_character_id UUID NOT NULL REFERENCES public.characters(character_id) ON DELETE CASCADE,
    relationship_type VARCHAR(100) NOT NULL CHECK (relationship_type IN (
        'family_parent', 'family_child', 'family_sibling', 'family_spouse', 'family_relative',
        'friend_best', 'friend_close', 'friend_casual', 'friend_ally',
        'enemy_rival', 'enemy_archenemy', 'enemy_opponent',
        'romantic_interest', 'romantic_partner', 'romantic_ex',
        'professional_mentor', 'professional_student', 'professional_colleague', 'professional_boss', 'professional_subordinate',
        'acquaintance', 'stranger', 'neighbor'
    )),
    relationship_strength INTEGER DEFAULT 5 CHECK (relationship_strength >= 1 AND relationship_strength <= 10),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'ended', 'suspended')),
    description TEXT,
    history JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Ensure a character can't have a relationship with themselves
    CONSTRAINT character_relationships_no_self_reference CHECK (character_id != related_character_id),
    
    -- Ensure unique relationships (prevent duplicate entries)
    CONSTRAINT character_relationships_unique UNIQUE (character_id, related_character_id, relationship_type)
);

-- Step 2: Create indexes for better performance
CREATE INDEX IF NOT EXISTS character_relationships_character_id_idx ON public.character_relationships(character_id);
CREATE INDEX IF NOT EXISTS character_relationships_related_character_id_idx ON public.character_relationships(related_character_id);
CREATE INDEX IF NOT EXISTS character_relationships_type_idx ON public.character_relationships(relationship_type);
CREATE INDEX IF NOT EXISTS character_relationships_strength_idx ON public.character_relationships(relationship_strength);
CREATE INDEX IF NOT EXISTS character_relationships_status_idx ON public.character_relationships(status);

-- Step 3: Enable Row Level Security
ALTER TABLE public.character_relationships ENABLE ROW LEVEL SECURITY;

-- Step 4: Create policies
-- Policy: Anyone can view character relationships
CREATE POLICY character_relationships_select_policy ON public.character_relationships
    FOR SELECT USING (true);

-- Policy: Users can create relationships for characters in worlds they own
CREATE POLICY character_relationships_insert_policy ON public.character_relationships
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.characters c1
            WHERE c1.character_id = character_relationships.character_id
            AND EXISTS (
                SELECT 1 FROM public.worlds w
                WHERE w.world_id = c1.world_id
                AND w.user_id = auth.uid()
            )
        )
        AND EXISTS (
            SELECT 1 FROM public.characters c2
            WHERE c2.character_id = character_relationships.related_character_id
            AND EXISTS (
                SELECT 1 FROM public.worlds w
                WHERE w.world_id = c2.world_id
                AND w.user_id = auth.uid()
            )
        )
    );

-- Policy: Users can update relationships for characters in worlds they own
CREATE POLICY character_relationships_update_policy ON public.character_relationships
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.characters c1
            WHERE c1.character_id = character_relationships.character_id
            AND EXISTS (
                SELECT 1 FROM public.worlds w
                WHERE w.world_id = c1.world_id
                AND w.user_id = auth.uid()
            )
        )
        AND EXISTS (
            SELECT 1 FROM public.characters c2
            WHERE c2.character_id = character_relationships.related_character_id
            AND EXISTS (
                SELECT 1 FROM public.worlds w
                WHERE w.world_id = c2.world_id
                AND w.user_id = auth.uid()
            )
        )
    );

-- Policy: Users can delete relationships for characters in worlds they own
CREATE POLICY character_relationships_delete_policy ON public.character_relationships
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.characters c1
            WHERE c1.character_id = character_relationships.character_id
            AND EXISTS (
                SELECT 1 FROM public.worlds w
                WHERE w.world_id = c1.world_id
                AND w.user_id = auth.uid()
            )
        )
        AND EXISTS (
            SELECT 1 FROM public.characters c2
            WHERE c2.character_id = character_relationships.related_character_id
            AND EXISTS (
                SELECT 1 FROM public.worlds w
                WHERE w.world_id = c2.world_id
                AND w.user_id = auth.uid()
            )
        )
    );

-- Step 5: Add comment for documentation
COMMENT ON TABLE public.character_relationships IS 'Stores relationships between characters in story worlds. Each relationship has a type, strength, status, and historical context.';

-- Step 6: Create trigger function for updated_at
CREATE OR REPLACE FUNCTION update_character_relationships_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 7: Create trigger for updated_at
CREATE TRIGGER update_character_relationships_updated_at
    BEFORE UPDATE ON public.character_relationships
    FOR EACH ROW
    EXECUTE FUNCTION update_character_relationships_updated_at();

-- Step 8: Create view for character relationships with character names
CREATE OR REPLACE VIEW public.character_relationships_view AS
SELECT 
    cr.relationship_id,
    cr.character_id,
    c1.name as character_name,
    cr.related_character_id,
    c2.name as related_character_name,
    cr.relationship_type,
    cr.relationship_strength,
    cr.status,
    cr.description,
    cr.history,
    cr.created_at,
    cr.updated_at
FROM public.character_relationships cr
JOIN public.characters c1 ON cr.character_id = c1.character_id
JOIN public.characters c2 ON cr.related_character_id = c2.character_id;

-- Step 9: Create function to get all relationships for a character
CREATE OR REPLACE FUNCTION public.get_character_relationships(p_character_id UUID)
RETURNS TABLE (
    relationship_id UUID,
    related_character_id UUID,
    related_character_name VARCHAR,
    relationship_type VARCHAR,
    relationship_strength INTEGER,
    status VARCHAR,
    description TEXT,
    history JSONB,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        cr.relationship_id,
        cr.related_character_id,
        c.name as related_character_name,
        cr.relationship_type,
        cr.relationship_strength,
        cr.status,
        cr.description,
        cr.history,
        cr.created_at,
        cr.updated_at
    FROM public.character_relationships cr
    JOIN public.characters c ON cr.related_character_id = c.character_id
    WHERE cr.character_id = p_character_id
    ORDER BY cr.relationship_strength DESC, cr.relationship_type;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;