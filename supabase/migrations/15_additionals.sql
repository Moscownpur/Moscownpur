-- 15th Migration: Create Remaining Tables (Memories, Cultural Elements, Validation Rules, Dependencies)
-- Step 1: Create the culture enum type
CREATE TYPE culture_enum AS ENUM ('indian', 'russian');

-- Step 2: Create the impact_level enum type
CREATE TYPE impact_level_enum AS ENUM ('critical', 'moderate', 'cosmetic');

-- Step 3: Create memories table
CREATE TABLE IF NOT EXISTS public.memories (
    memory_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    character_id UUID NOT NULL REFERENCES public.characters(character_id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    acquired_in UUID REFERENCES public.scenes(scene_id) ON DELETE SET NULL,
    inheritance_path UUID[],
    relevance_score FLOAT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 4: Create cultural_elements table
CREATE TABLE IF NOT EXISTS public.cultural_elements (
    element_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    culture culture_enum NOT NULL,
    name VARCHAR(255) NOT NULL,
    attributes JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 5: Create validation_rules table
CREATE TABLE IF NOT EXISTS public.validation_rules (
    rule_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    world_id UUID NOT NULL REFERENCES public.worlds(world_id) ON DELETE CASCADE,
    condition TEXT NOT NULL,
    error_message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 6: Create dependencies table
CREATE TABLE IF NOT EXISTS public.dependencies (
    dependency_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_type VARCHAR(50) NOT NULL,
    source_id UUID NOT NULL,
    target_type VARCHAR(50) NOT NULL,
    target_id UUID NOT NULL,
    impact_level impact_level_enum NOT NULL DEFAULT 'moderate',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 7: Create indexes
-- For memories
CREATE INDEX IF NOT EXISTS memories_character_id_idx ON public.memories(character_id);
CREATE INDEX IF NOT EXISTS memories_acquired_in_idx ON public.memories(acquired_in);
CREATE INDEX IF NOT EXISTS memories_relevance_score_idx ON public.memories(relevance_score);

-- For cultural_elements
CREATE INDEX IF NOT EXISTS cultural_elements_culture_idx ON public.cultural_elements(culture);
CREATE INDEX IF NOT EXISTS cultural_elements_name_idx ON public.cultural_elements(name);
CREATE INDEX IF NOT EXISTS cultural_elements_attributes_idx ON public.cultural_elements USING GIN(attributes);

-- For validation_rules
CREATE INDEX IF NOT EXISTS validation_rules_world_id_idx ON public.validation_rules(world_id);

-- For dependencies
CREATE INDEX IF NOT EXISTS dependencies_source_idx ON public.dependencies(source_type, source_id);
CREATE INDEX IF NOT EXISTS dependencies_target_idx ON public.dependencies(target_type, target_id);
CREATE INDEX IF NOT EXISTS dependencies_impact_level_idx ON public.dependencies(impact_level);

-- Step 8: Enable Row Level Security and create policies for each table

-- Memories table policies
ALTER TABLE public.memories ENABLE ROW LEVEL SECURITY;

CREATE POLICY memories_select_policy ON public.memories
    FOR SELECT USING (true);

CREATE POLICY memories_insert_policy ON public.memories
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.characters c
            JOIN public.worlds w ON c.world_id = w.world_id
            WHERE c.character_id = memories.character_id
            AND w.user_id = auth.uid()
        )
        AND
        (
            memories.acquired_in IS NULL OR
            EXISTS (
                SELECT 1 FROM public.scenes s
                JOIN public.events e ON s.event_id = e.event_id
                JOIN public.chapters c ON e.chapter_id = c.chapter_id
                JOIN public.worlds w ON c.world_id = w.world_id
                WHERE s.scene_id = memories.acquired_in
                AND w.user_id = auth.uid()
            )
        )
    );

CREATE POLICY memories_update_policy ON public.memories
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.characters c
            JOIN public.worlds w ON c.world_id = w.world_id
            WHERE c.character_id = memories.character_id
            AND w.user_id = auth.uid()
        )
    );

CREATE POLICY memories_delete_policy ON public.memories
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.characters c
            JOIN public.worlds w ON c.world_id = w.world_id
            WHERE c.character_id = memories.character_id
            AND w.user_id = auth.uid()
        )
    );

-- Cultural elements table policies
ALTER TABLE public.cultural_elements ENABLE ROW LEVEL SECURITY;

CREATE POLICY cultural_elements_select_policy ON public.cultural_elements
    FOR SELECT USING (true);

CREATE POLICY cultural_elements_insert_policy ON public.cultural_elements
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY cultural_elements_update_policy ON public.cultural_elements
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY cultural_elements_delete_policy ON public.cultural_elements
    FOR DELETE USING (auth.role() = 'authenticated');

-- Validation rules table policies
ALTER TABLE public.validation_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY validation_rules_select_policy ON public.validation_rules
    FOR SELECT USING (true);

CREATE POLICY validation_rules_insert_policy ON public.validation_rules
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.worlds w
            WHERE w.world_id = validation_rules.world_id
            AND w.user_id = auth.uid()
        )
    );

CREATE POLICY validation_rules_update_policy ON public.validation_rules
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.worlds w
            WHERE w.world_id = validation_rules.world_id
            AND w.user_id = auth.uid()
        )
    );

CREATE POLICY validation_rules_delete_policy ON public.validation_rules
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.worlds w
            WHERE w.world_id = validation_rules.world_id
            AND w.user_id = auth.uid()
        )
    );

-- Dependencies table policies
ALTER TABLE public.dependencies ENABLE ROW LEVEL SECURITY;

CREATE POLICY dependencies_select_policy ON public.dependencies
    FOR SELECT USING (true);

CREATE POLICY dependencies_insert_policy ON public.dependencies
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY dependencies_update_policy ON public.dependencies
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY dependencies_delete_policy ON public.dependencies
    FOR DELETE USING (auth.role() = 'authenticated');

-- Step 9: Add comments for documentation
COMMENT ON TABLE public.memories IS 'Stores character memories and knowledge, including where they were acquired.';
COMMENT ON TABLE public.cultural_elements IS 'Stores cultural reference elements for Indian and Russian cultures.';
COMMENT ON TABLE public.validation_rules IS 'Stores validation rules for story worlds to ensure consistency.';
COMMENT ON TABLE public.dependencies IS 'Stores dependencies between different content elements in story worlds.';

-- Step 10: Create trigger functions for updated_at
CREATE OR REPLACE FUNCTION update_memories_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_cultural_elements_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_validation_rules_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_dependencies_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 11: Create triggers for updated_at
CREATE TRIGGER update_memories_updated_at
    BEFORE UPDATE ON public.memories
    FOR EACH ROW
    EXECUTE FUNCTION update_memories_updated_at();

CREATE TRIGGER update_cultural_elements_updated_at
    BEFORE UPDATE ON public.cultural_elements
    FOR EACH ROW
    EXECUTE FUNCTION update_cultural_elements_updated_at();

CREATE TRIGGER update_validation_rules_updated_at
    BEFORE UPDATE ON public.validation_rules
    FOR EACH ROW
    EXECUTE FUNCTION update_validation_rules_updated_at();

CREATE TRIGGER update_dependencies_updated_at
    BEFORE UPDATE ON public.dependencies
    FOR EACH ROW
    EXECUTE FUNCTION update_dependencies_updated_at();