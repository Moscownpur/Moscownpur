/*
  # Scene Dialogue & Narration System

  This migration adds a structured dialogue and narration system to scenes,
  allowing creators to script character conversations and scene descriptions
  in a comic/screenplay style format.

  1. New Table: scene_lines
    - Stores both character dialogue and narration lines
    - Maintains order through order_index
    - Links to characters when applicable
    - Supports custom display names for narration

  2. Integration
    - Extends existing scene system
    - Works with scene_characters for role consistency
    - Maintains RLS security model
*/

-- Create scene_lines table
CREATE TABLE IF NOT EXISTS scene_lines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scene_id uuid NOT NULL REFERENCES scenes(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('character', 'narration')),
  character_id uuid REFERENCES characters(id) ON DELETE SET NULL,
  display_name text NOT NULL,
  text text NOT NULL,
  order_index integer NOT NULL DEFAULT 1,
  created_by text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Ensure character_id is provided for character type lines
  CONSTRAINT scene_lines_character_required 
    CHECK (type != 'character' OR character_id IS NOT NULL),
  
  -- Ensure unique order within scene
  UNIQUE(scene_id, order_index)
);

-- Enable RLS
ALTER TABLE scene_lines ENABLE ROW LEVEL SECURITY;

-- RLS Policies for scene_lines
CREATE POLICY "Users can create scene lines in their scenes"
  ON scene_lines
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM scenes 
      WHERE scenes.id = scene_lines.scene_id 
      AND scenes.created_by = auth.uid()::text
    )
    AND auth.uid()::text = created_by
  );

CREATE POLICY "Users can view scene lines in accessible worlds"
  ON scene_lines
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update scene lines in their scenes"
  ON scene_lines
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM scenes 
      WHERE scenes.id = scene_lines.scene_id 
      AND scenes.created_by = auth.uid()::text
    )
    AND auth.uid()::text = created_by
  );

CREATE POLICY "Users can delete scene lines from their scenes"
  ON scene_lines
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM scenes 
      WHERE scenes.id = scene_lines.scene_id 
      AND scenes.created_by = auth.uid()::text
    )
    AND auth.uid()::text = created_by
  );

-- Add updated_at trigger
CREATE TRIGGER update_scene_lines_updated_at
  BEFORE UPDATE ON scene_lines
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_scene_lines_scene_id ON scene_lines(scene_id);
CREATE INDEX IF NOT EXISTS idx_scene_lines_character_id ON scene_lines(character_id);
CREATE INDEX IF NOT EXISTS idx_scene_lines_type ON scene_lines(type);
CREATE INDEX IF NOT EXISTS idx_scene_lines_order ON scene_lines(scene_id, order_index);
CREATE INDEX IF NOT EXISTS idx_scene_lines_created_by ON scene_lines(created_by);

-- Create view for scenes with dialogue lines
CREATE OR REPLACE VIEW scenes_with_dialogue AS
SELECT 
  s.*,
  COUNT(sl.id) as line_count,
  ARRAY_AGG(
    CASE WHEN sl.id IS NOT NULL THEN
      json_build_object(
        'id', sl.id,
        'type', sl.type,
        'character_id', sl.character_id,
        'display_name', sl.display_name,
        'text', sl.text,
        'order_index', sl.order_index,
        'character_name', c.name,
        'character_role', sc.role_in_scene
      )
    END
  ) FILTER (WHERE sl.id IS NOT NULL) ORDER BY sl.order_index as dialogue_lines
FROM scenes s
LEFT JOIN scene_lines sl ON s.id = sl.scene_id
LEFT JOIN characters c ON sl.character_id = c.id
LEFT JOIN scene_characters sc ON s.id = sc.scene_id AND sl.character_id = sc.character_id
GROUP BY s.id, s.title, s.description, s.dialogue, s.event_id, s.region_id, 
         s.world_id, s.scene_order, s.ai_image_prompt, s.created_by, 
         s.created_at, s.updated_at
ORDER BY s.scene_order, s.created_at;

-- Function to reorder scene lines when order_index changes
CREATE OR REPLACE FUNCTION reorder_scene_lines()
RETURNS TRIGGER AS $$
BEGIN
  -- If order_index is being updated, ensure no conflicts
  IF TG_OP = 'UPDATE' AND OLD.order_index != NEW.order_index THEN
    -- Update other lines in the same scene to make room
    UPDATE scene_lines 
    SET order_index = order_index + 1
    WHERE scene_id = NEW.scene_id 
    AND order_index >= NEW.order_index 
    AND id != NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to handle reordering
CREATE TRIGGER trigger_reorder_scene_lines
  BEFORE INSERT OR UPDATE ON scene_lines
  FOR EACH ROW
  EXECUTE FUNCTION reorder_scene_lines();

-- Function to get next order_index for a scene
CREATE OR REPLACE FUNCTION get_next_scene_line_order(scene_uuid uuid)
RETURNS integer AS $$
BEGIN
  RETURN COALESCE(
    (SELECT MAX(order_index) + 1 FROM scene_lines WHERE scene_id = scene_uuid),
    1
  );
END;
$$ LANGUAGE plpgsql; 