/*
  # Create characters table

  1. New Tables
    - `characters`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `aliases` (text array)
      - `gender` (text)
      - `birth_date` (text)
      - `age` (integer)
      - `origin` (text)
      - `current_location` (text)
      - `species` (text)
      - `race` (text)
      - `caste_or_class` (text)
      - `religion` (text)
      - `languages` (text array)
      - `physical_appearance` (jsonb)
      - `personality` (jsonb)
      - `skills_and_abilities` (text array)
      - `profession` (text)
      - `affiliations` (text array)
      - `relationships` (jsonb array)
      - `notable_events` (text array)
      - `arc_summary` (text)
      - `status` (text)
      - `world_id` (uuid, foreign key)
      - `created_by` (text, not null)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `characters` table
    - Add policies for authenticated users
*/

CREATE TABLE IF NOT EXISTS characters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  aliases text[] DEFAULT '{}',
  gender text DEFAULT '',
  birth_date text DEFAULT '',
  age integer DEFAULT 0,
  origin text DEFAULT '',
  current_location text DEFAULT '',
  species text DEFAULT '',
  race text DEFAULT '',
  caste_or_class text DEFAULT '',
  religion text DEFAULT '',
  languages text[] DEFAULT '{}',
  physical_appearance jsonb DEFAULT '{}',
  personality jsonb DEFAULT '{}',
  skills_and_abilities text[] DEFAULT '{}',
  profession text DEFAULT '',
  affiliations text[] DEFAULT '{}',
  relationships jsonb[] DEFAULT '{}',
  notable_events text[] DEFAULT '{}',
  arc_summary text DEFAULT '',
  status text DEFAULT 'Alive' CHECK (status IN ('Alive', 'Dead', 'Unknown', 'Ascended')),
  world_id uuid REFERENCES worlds(id) ON DELETE CASCADE,
  created_by text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view characters in accessible worlds"
  ON characters
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create characters"
  ON characters
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = created_by);

CREATE POLICY "Users can update their own characters"
  ON characters
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = created_by)
  WITH CHECK (auth.uid()::text = created_by);

CREATE POLICY "Users can delete their own characters"
  ON characters
  FOR DELETE
  TO authenticated
  USING (auth.uid()::text = created_by);

-- Create updated_at trigger
CREATE TRIGGER update_characters_updated_at
  BEFORE UPDATE ON characters
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();