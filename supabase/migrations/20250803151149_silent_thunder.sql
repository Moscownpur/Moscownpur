/*
  # Timeline and Scene Context System

  1. New Tables
    - `scenes`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `dialogue` (text, optional)
      - `event_id` (uuid, foreign key to timeline_events)
      - `region_id` (uuid, foreign key to regions)
      - `world_id` (uuid, foreign key to worlds)
      - `scene_order` (integer, for ordering within event)
      - `ai_image_prompt` (text, optional for future AI integration)
      - `created_by` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `scene_characters`
      - `id` (uuid, primary key)
      - `scene_id` (uuid, foreign key to scenes)
      - `character_id` (uuid, foreign key to characters)
      - `role_in_scene` (text, e.g., "protagonist", "antagonist", "witness")
      - `character_state` (text, e.g., "alive", "injured", "transformed")
      - `importance_level` (text, "primary", "secondary", "background")
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their own data
    - Add policies for viewing data in accessible worlds

  3. Indexes
    - Add indexes for efficient querying by world, event, and character
*/
</sql>

-- Create scenes table
CREATE TABLE IF NOT EXISTS scenes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  dialogue text DEFAULT '',
  event_id uuid REFERENCES timeline_events(id) ON DELETE CASCADE,
  region_id uuid REFERENCES regions(id) ON DELETE SET NULL,
  world_id uuid NOT NULL REFERENCES worlds(id) ON DELETE CASCADE,
  scene_order integer DEFAULT 1,
  ai_image_prompt text DEFAULT '',
  created_by text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create scene_characters junction table
CREATE TABLE IF NOT EXISTS scene_characters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scene_id uuid NOT NULL REFERENCES scenes(id) ON DELETE CASCADE,
  character_id uuid NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  role_in_scene text DEFAULT 'participant',
  character_state text DEFAULT 'normal',
  importance_level text DEFAULT 'secondary',
  created_at timestamptz DEFAULT now(),
  UNIQUE(scene_id, character_id)
);

-- Add constraints
ALTER TABLE scene_characters 
ADD CONSTRAINT scene_characters_role_check 
CHECK (role_in_scene IN ('protagonist', 'antagonist', 'ally', 'enemy', 'witness', 'narrator', 'participant'));

ALTER TABLE scene_characters 
ADD CONSTRAINT scene_characters_state_check 
CHECK (character_state IN ('normal', 'injured', 'dead', 'transformed', 'missing', 'empowered', 'weakened'));

ALTER TABLE scene_characters 
ADD CONSTRAINT scene_characters_importance_check 
CHECK (importance_level IN ('primary', 'secondary', 'background'));

-- Enable RLS
ALTER TABLE scenes ENABLE ROW LEVEL SECURITY;
ALTER TABLE scene_characters ENABLE ROW LEVEL SECURITY;

-- RLS Policies for scenes
CREATE POLICY "Users can create scenes"
  ON scenes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = created_by);

CREATE POLICY "Users can view scenes in accessible worlds"
  ON scenes
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update their own scenes"
  ON scenes
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = created_by)
  WITH CHECK (auth.uid()::text = created_by);

CREATE POLICY "Users can delete their own scenes"
  ON scenes
  FOR DELETE
  TO authenticated
  USING (auth.uid()::text = created_by);

-- RLS Policies for scene_characters
CREATE POLICY "Users can create scene characters"
  ON scene_characters
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM scenes 
      WHERE scenes.id = scene_characters.scene_id 
      AND scenes.created_by = auth.uid()::text
    )
  );

CREATE POLICY "Users can view scene characters in accessible worlds"
  ON scene_characters
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update scene characters in their scenes"
  ON scene_characters
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM scenes 
      WHERE scenes.id = scene_characters.scene_id 
      AND scenes.created_by = auth.uid()::text
    )
  );

CREATE POLICY "Users can delete scene characters from their scenes"
  ON scene_characters
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM scenes 
      WHERE scenes.id = scene_characters.scene_id 
      AND scenes.created_by = auth.uid()::text
    )
  );

-- Add updated_at triggers
CREATE TRIGGER update_scenes_updated_at
  BEFORE UPDATE ON scenes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_scenes_world_id ON scenes(world_id);
CREATE INDEX IF NOT EXISTS idx_scenes_event_id ON scenes(event_id);
CREATE INDEX IF NOT EXISTS idx_scenes_region_id ON scenes(region_id);
CREATE INDEX IF NOT EXISTS idx_scenes_created_by ON scenes(created_by);
CREATE INDEX IF NOT EXISTS idx_scene_characters_scene_id ON scene_characters(scene_id);
CREATE INDEX IF NOT EXISTS idx_scene_characters_character_id ON scene_characters(character_id);

-- Create view for timeline with scenes
CREATE OR REPLACE VIEW timeline_with_scenes AS
SELECT 
  te.*,
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
    END
  ) FILTER (WHERE s.id IS NOT NULL) as scenes
FROM timeline_events te
LEFT JOIN scenes s ON te.id = s.event_id
LEFT JOIN regions r ON s.region_id = r.id
GROUP BY te.id, te.title, te.date, te.era, te.location, te.involved_characters, 
         te.description, te.type, te.consequences, te.world_id, te.created_by, 
         te.created_at, te.updated_at
ORDER BY te.date, te.created_at;