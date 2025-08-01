/*
  # Create regions table

  1. New Tables
    - `regions`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `world_id` (uuid, foreign key)
      - `type` (text, not null)
      - `culture` (text)
      - `politics` (text)
      - `religion` (text)
      - `language` (text array)
      - `map_reference` (text)
      - `history` (text)
      - `notable_inhabitants` (text array)
      - `important_events` (text array)
      - `climate` (text)
      - `resources` (text array)
      - `description` (text)
      - `created_by` (text, not null)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `regions` table
    - Add policies for authenticated users
*/

CREATE TABLE IF NOT EXISTS regions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  world_id uuid REFERENCES worlds(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('Continent', 'Country', 'City', 'Village', 'Realm', 'Planet', 'Dimension')),
  culture text DEFAULT '',
  politics text DEFAULT '',
  religion text DEFAULT '',
  language text[] DEFAULT '{}',
  map_reference text DEFAULT '',
  history text DEFAULT '',
  notable_inhabitants text[] DEFAULT '{}',
  important_events text[] DEFAULT '{}',
  climate text DEFAULT '',
  resources text[] DEFAULT '{}',
  description text DEFAULT '',
  created_by text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE regions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view regions in accessible worlds"
  ON regions
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create regions"
  ON regions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = created_by);

CREATE POLICY "Users can update their own regions"
  ON regions
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = created_by)
  WITH CHECK (auth.uid()::text = created_by);

CREATE POLICY "Users can delete their own regions"
  ON regions
  FOR DELETE
  TO authenticated
  USING (auth.uid()::text = created_by);

-- Create updated_at trigger
CREATE TRIGGER update_regions_updated_at
  BEFORE UPDATE ON regions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();