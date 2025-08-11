/*
  # AI Memory Engine System

  1. New Tables
    - `entity_summaries` - Stores context memory for characters, regions, etc.
    - `memory_tags` - Smart tagging system for memory organization
    - `ai_chat_logs` - Character simulator chat history
    - `context_templates` - Prompt templates for different AI tasks

  2. Features
    - Memory versioning with rollback capability
    - Smart tagging and filtering
    - Context builder for LLM prompts
    - Character simulator with memory-backed responses
    - Memory visualization and management

  3. Security
    - RLS enabled on all tables
    - User-based access control
    - Admin override capabilities
*/

-- Create entity_summaries table
CREATE TABLE IF NOT EXISTS entity_summaries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type text NOT NULL CHECK (entity_type IN ('character', 'region', 'world', 'timeline_event', 'scene')),
  entity_id uuid NOT NULL,
  summary_text text NOT NULL,
  memory_type text NOT NULL DEFAULT 'hard' CHECK (memory_type IN ('hard', 'soft', 'ephemeral')),
  version integer NOT NULL DEFAULT 1,
  is_current boolean NOT NULL DEFAULT true,
  tags text[] DEFAULT '{}',
  last_used_in_scene uuid REFERENCES scenes(id) ON DELETE SET NULL,
  editable boolean NOT NULL DEFAULT true,
  used_recently boolean NOT NULL DEFAULT false,
  relevance_score float DEFAULT 0.0,
  created_by text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Ensure only one current summary per entity
  UNIQUE(entity_type, entity_id, is_current)
);

-- Create memory_tags table for smart tagging
CREATE TABLE IF NOT EXISTS memory_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  category text NOT NULL CHECK (category IN ('emotion', 'plot', 'lore', 'relationship', 'location', 'temporal')),
  color text DEFAULT '#3B82F6',
  description text DEFAULT '',
  created_by text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create ai_chat_logs table for character simulator
CREATE TABLE IF NOT EXISTS ai_chat_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id uuid REFERENCES characters(id) ON DELETE CASCADE,
  world_id uuid NOT NULL REFERENCES worlds(id) ON DELETE CASCADE,
  user_message text NOT NULL,
  ai_response text NOT NULL,
  context_memories_used text[] DEFAULT '{}',
  scene_context text DEFAULT '',
  emotion_detected text DEFAULT '',
  memory_impact text DEFAULT '',
  created_by text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create context_templates table for prompt generation
CREATE TABLE IF NOT EXISTS context_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  template_type text NOT NULL CHECK (template_type IN ('scene_continuation', 'character_chat', 'plot_development', 'world_building', 'dialogue_generation')),
  prompt_template text NOT NULL,
  variables text[] DEFAULT '{}',
  description text DEFAULT '',
  is_active boolean NOT NULL DEFAULT true,
  created_by text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create memory_visualizations table for tracking memory usage
CREATE TABLE IF NOT EXISTS memory_visualizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type text NOT NULL,
  entity_id uuid NOT NULL,
  memory_id uuid REFERENCES entity_summaries(id) ON DELETE CASCADE,
  visualization_type text NOT NULL CHECK (visualization_type IN ('active', 'pinned', 'faded', 'highlighted')),
  position_x integer DEFAULT 0,
  position_y integer DEFAULT 0,
  z_index integer DEFAULT 0,
  created_by text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE entity_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE memory_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_chat_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE context_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE memory_visualizations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for entity_summaries
CREATE POLICY "Users can view summaries in accessible worlds"
  ON entity_summaries
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create summaries for their entities"
  ON entity_summaries
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = created_by);

CREATE POLICY "Users can update their own summaries"
  ON entity_summaries
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = created_by)
  WITH CHECK (auth.uid()::text = created_by);

CREATE POLICY "Users can delete their own summaries"
  ON entity_summaries
  FOR DELETE
  TO authenticated
  USING (auth.uid()::text = created_by);

-- RLS Policies for memory_tags
CREATE POLICY "Users can view all memory tags"
  ON memory_tags
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create memory tags"
  ON memory_tags
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = created_by);

CREATE POLICY "Users can update their own memory tags"
  ON memory_tags
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = created_by)
  WITH CHECK (auth.uid()::text = created_by);

-- RLS Policies for ai_chat_logs
CREATE POLICY "Users can view their own chat logs"
  ON ai_chat_logs
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = created_by);

CREATE POLICY "Users can create chat logs"
  ON ai_chat_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = created_by);

-- RLS Policies for context_templates
CREATE POLICY "Users can view all context templates"
  ON context_templates
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create context templates"
  ON context_templates
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = created_by);

CREATE POLICY "Users can update their own context templates"
  ON context_templates
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = created_by)
  WITH CHECK (auth.uid()::text = created_by);

-- RLS Policies for memory_visualizations
CREATE POLICY "Users can manage their own memory visualizations"
  ON memory_visualizations
  FOR ALL
  TO authenticated
  USING (auth.uid()::text = created_by)
  WITH CHECK (auth.uid()::text = created_by);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_entity_summaries_entity ON entity_summaries(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_entity_summaries_memory_type ON entity_summaries(memory_type);
CREATE INDEX IF NOT EXISTS idx_entity_summaries_tags ON entity_summaries USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_entity_summaries_relevance ON entity_summaries(relevance_score DESC);
CREATE INDEX IF NOT EXISTS idx_ai_chat_logs_character ON ai_chat_logs(character_id);
CREATE INDEX IF NOT EXISTS idx_ai_chat_logs_world ON ai_chat_logs(world_id);
CREATE INDEX IF NOT EXISTS idx_memory_visualizations_entity ON memory_visualizations(entity_type, entity_id);

-- Create updated_at triggers
CREATE TRIGGER update_entity_summaries_updated_at
  BEFORE UPDATE ON entity_summaries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_memory_tags_updated_at
  BEFORE UPDATE ON memory_tags
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_context_templates_updated_at
  BEFORE UPDATE ON context_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default memory tags
INSERT INTO memory_tags (name, category, color, description, created_by) VALUES
  ('[emotion:joy]', 'emotion', '#10B981', 'Positive emotions and happiness', 'system'),
  ('[emotion:sadness]', 'emotion', '#3B82F6', 'Sadness and melancholy', 'system'),
  ('[emotion:anger]', 'emotion', '#EF4444', 'Anger and rage', 'system'),
  ('[emotion:fear]', 'emotion', '#8B5CF6', 'Fear and anxiety', 'system'),
  ('[plot:conflict]', 'plot', '#F59E0B', 'Story conflicts and tensions', 'system'),
  ('[plot:resolution]', 'plot', '#10B981', 'Story resolutions and conclusions', 'system'),
  ('[plot:twist]', 'plot', '#8B5CF6', 'Plot twists and surprises', 'system'),
  ('[lore:history]', 'lore', '#6B7280', 'Historical background and lore', 'system'),
  ('[lore:magic]', 'lore', '#8B5CF6', 'Magical systems and abilities', 'system'),
  ('[lore:technology]', 'lore', '#3B82F6', 'Technological elements', 'system'),
  ('[relationship:romance]', 'relationship', '#EC4899', 'Romantic relationships', 'system'),
  ('[relationship:friendship]', 'relationship', '#10B981', 'Friendships and alliances', 'system'),
  ('[relationship:rivalry]', 'relationship', '#F59E0B', 'Rivalries and conflicts', 'system'),
  ('[location:home]', 'location', '#10B981', 'Home locations and bases', 'system'),
  ('[location:dangerous]', 'location', '#EF4444', 'Dangerous or hostile areas', 'system'),
  ('[temporal:past]', 'temporal', '#6B7280', 'Past events and memories', 'system'),
  ('[temporal:present]', 'temporal', '#3B82F6', 'Current events and situations', 'system'),
  ('[temporal:future]', 'temporal', '#8B5CF6', 'Future plans and prophecies', 'system')
ON CONFLICT (name) DO NOTHING;

-- Insert default context templates
INSERT INTO context_templates (name, template_type, prompt_template, variables, description, created_by) VALUES
  (
    'Scene Continuation',
    'scene_continuation',
    'Continue the scene based on the following context:

World Context: {world_context}
Character Context: {character_context}
Scene Context: {scene_context}
Previous Dialogue: {previous_dialogue}

Memory Context:
{memory_context}

Please continue the scene naturally, maintaining character consistency and advancing the plot.',
    ARRAY['world_context', 'character_context', 'scene_context', 'previous_dialogue', 'memory_context'],
    'Template for continuing scenes with memory context',
    'system'
  ),
  (
    'Character Chat',
    'character_chat',
    'You are {character_name}, a character in this fictional world. Respond to the user as this character would, based on your personality and memories.

Character Background: {character_background}
Current Situation: {current_situation}
User Message: {user_message}

Active Memories:
{active_memories}

Respond in character, drawing from your memories and personality.',
    ARRAY['character_name', 'character_background', 'current_situation', 'user_message', 'active_memories'],
    'Template for character chat interactions',
    'system'
  ),
  (
    'Plot Development',
    'plot_development',
    'Suggest plot developments based on the current story context:

World State: {world_state}
Character Arcs: {character_arcs}
Recent Events: {recent_events}
Story Themes: {story_themes}

Memory Context:
{memory_context}

Provide 3-5 plot development suggestions that build on existing story elements.',
    ARRAY['world_state', 'character_arcs', 'recent_events', 'story_themes', 'memory_context'],
    'Template for plot development suggestions',
    'system'
  )
ON CONFLICT (name) DO NOTHING;

-- Create view for memory analytics
CREATE OR REPLACE VIEW memory_analytics AS
SELECT 
  es.entity_type,
  es.entity_id,
  COUNT(*) as total_memories,
  COUNT(*) FILTER (WHERE es.is_current = true) as current_memories,
  COUNT(*) FILTER (WHERE es.memory_type = 'hard') as hard_memories,
  COUNT(*) FILTER (WHERE es.memory_type = 'soft') as soft_memories,
  COUNT(*) FILTER (WHERE es.memory_type = 'ephemeral') as ephemeral_memories,
  AVG(es.relevance_score) as avg_relevance,
  MAX(es.updated_at) as last_updated
FROM entity_summaries es
GROUP BY es.entity_type, es.entity_id;

-- Create function to update memory relevance scores
CREATE OR REPLACE FUNCTION update_memory_relevance()
RETURNS TRIGGER AS $$
BEGIN
  -- Update relevance based on usage patterns
  NEW.relevance_score = CASE 
    WHEN NEW.used_recently = true THEN 1.0
    WHEN NEW.last_used_in_scene IS NOT NULL THEN 0.7
    WHEN NEW.memory_type = 'hard' THEN 0.5
    WHEN NEW.memory_type = 'soft' THEN 0.3
    ELSE 0.1
  END;
  
  -- Add bonus for tags
  IF array_length(NEW.tags, 1) > 0 THEN
    NEW.relevance_score = NEW.relevance_score + (array_length(NEW.tags, 1) * 0.1);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic relevance scoring
CREATE TRIGGER update_memory_relevance_trigger
  BEFORE INSERT OR UPDATE ON entity_summaries
  FOR EACH ROW
  EXECUTE FUNCTION update_memory_relevance();

-- Create function to ensure only one current summary per entity
CREATE OR REPLACE FUNCTION ensure_single_current_summary()
RETURNS TRIGGER AS $$
BEGIN
  -- If this is a new current summary, deactivate others
  IF NEW.is_current = true THEN
    UPDATE entity_summaries 
    SET is_current = false 
    WHERE entity_type = NEW.entity_type 
      AND entity_id = NEW.entity_id 
      AND id != NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to enforce single current summary
CREATE TRIGGER ensure_single_current_summary_trigger
  BEFORE INSERT OR UPDATE ON entity_summaries
  FOR EACH ROW
  EXECUTE FUNCTION ensure_single_current_summary(); 