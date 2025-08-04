/*
  # Chapter Support System (Phase 1)

  This migration adds chapter management functionality to help users structure
  long stories by grouping timeline events under chapters.

  1. New Table: chapters
    - Stores chapter information with ordering
    - Links to worlds for organization
    - Supports drag-and-drop reordering

  2. Timeline Events Enhancement
    - Adds chapter_id to timeline_events table
    - Links events to chapters for story structure
    - Maintains backward compatibility

  3. Integration
    - Works with existing world and timeline systems
    - Maintains RLS security model
    - Supports future export functionality
*/

-- Create chapters table
CREATE TABLE IF NOT EXISTS chapters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  world_id uuid NOT NULL REFERENCES worlds(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text DEFAULT '',
  order_index integer NOT NULL DEFAULT 1,
  created_by text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Ensure unique order within world
  UNIQUE(world_id, order_index)
);

-- Add chapter_id to timeline_events table
ALTER TABLE timeline_events 
ADD COLUMN IF NOT EXISTS chapter_id uuid REFERENCES chapters(id) ON DELETE SET NULL;

-- Enable RLS
ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;

-- RLS Policies for chapters
CREATE POLICY "Users can create chapters in their worlds"
  ON chapters
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM worlds 
      WHERE worlds.id = chapters.world_id 
      AND worlds.created_by = auth.uid()::text
    )
    AND auth.uid()::text = created_by
  );

CREATE POLICY "Users can view chapters in accessible worlds"
  ON chapters
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update chapters in their worlds"
  ON chapters
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM worlds 
      WHERE worlds.id = chapters.world_id 
      AND worlds.created_by = auth.uid()::text
    )
    AND auth.uid()::text = created_by
  );

CREATE POLICY "Users can delete chapters from their worlds"
  ON chapters
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM worlds 
      WHERE worlds.id = chapters.world_id 
      AND worlds.created_by = auth.uid()::text
    )
    AND auth.uid()::text = created_by
  );

-- Add updated_at trigger
CREATE TRIGGER update_chapters_updated_at
  BEFORE UPDATE ON chapters
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_chapters_world_id ON chapters(world_id);
CREATE INDEX IF NOT EXISTS idx_chapters_order ON chapters(world_id, order_index);
CREATE INDEX IF NOT EXISTS idx_chapters_created_by ON chapters(created_by);
CREATE INDEX IF NOT EXISTS idx_timeline_events_chapter_id ON timeline_events(chapter_id);

-- Create view for timeline with chapters
CREATE OR REPLACE VIEW timeline_with_chapters AS
SELECT 
  te.id,
  te.title,
  te.date,
  te.era,
  te.location,
  te.involved_characters,
  te.description,
  te.type,
  te.consequences,
  te.world_id,
  te.chapter_id,
  te.created_by,
  te.created_at,
  te.updated_at,
  c.id as chapter_table_id,
  c.title as chapter_title,
  c.order_index as chapter_order,
  COUNT(s.id) as scene_count,
  ARRAY_AGG(
    CASE WHEN s.id IS NOT NULL THEN
      json_build_object(
        'id', s.id,
        'title', s.title,
        'description', s.description,
        'scene_order', s.scene_order,
        'region_name', r.name
      )
    END ORDER BY s.scene_order
  ) FILTER (WHERE s.id IS NOT NULL) as scenes
FROM timeline_events te
LEFT JOIN chapters c ON te.chapter_id = c.id
LEFT JOIN scenes s ON te.id = s.event_id
LEFT JOIN regions r ON s.region_id = r.id
GROUP BY te.id, te.title, te.date, te.era, te.location, te.involved_characters, 
         te.description, te.type, te.consequences, te.world_id, te.chapter_id,
         te.created_by, te.created_at, te.updated_at, c.id, c.title, c.order_index
ORDER BY c.order_index, te.date, te.created_at;

-- Function to reorder chapters when order_index changes
CREATE OR REPLACE FUNCTION reorder_chapters()
RETURNS TRIGGER AS $$
BEGIN
  -- If order_index is being updated, ensure no conflicts
  IF TG_OP = 'UPDATE' AND OLD.order_index != NEW.order_index THEN
    -- Update other chapters in the same world to make room
    UPDATE chapters 
    SET order_index = order_index + 1
    WHERE world_id = NEW.world_id 
    AND order_index >= NEW.order_index 
    AND id != NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to handle reordering
CREATE TRIGGER trigger_reorder_chapters
  BEFORE INSERT OR UPDATE ON chapters
  FOR EACH ROW
  EXECUTE FUNCTION reorder_chapters();

-- Function to get next order_index for a chapter
CREATE OR REPLACE FUNCTION get_next_chapter_order(world_uuid uuid)
RETURNS integer AS $$
BEGIN
  RETURN COALESCE(
    (SELECT MAX(order_index) + 1 FROM chapters WHERE world_id = world_uuid),
    1
  );
END;
$$ LANGUAGE plpgsql; 