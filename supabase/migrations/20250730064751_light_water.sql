/*
  # Create worlds table

  1. New Tables
    - `worlds`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `type` (text, not null)
      - `description` (text, not null)
      - `creation_myth` (text, not null)
      - `governing_laws` (jsonb, not null)
      - `dominant_species` (text array, not null)
      - `visual_style` (text, not null)
      - `theme` (text, not null)
      - `created_by` (text, not null)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `worlds` table
    - Add policy for authenticated users to manage their own worlds
*/

CREATE TABLE IF NOT EXISTS worlds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('Universe', 'Planet', 'Magical Realm', 'Timeline Variant')),
  description text NOT NULL,
  creation_myth text NOT NULL,
  governing_laws jsonb NOT NULL,
  dominant_species text[] NOT NULL DEFAULT '{}',
  visual_style text NOT NULL,
  theme text NOT NULL,
  created_by text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE worlds ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view all worlds"
  ON worlds
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create worlds"
  ON worlds
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = created_by);

CREATE POLICY "Users can update their own worlds"
  ON worlds
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = created_by)
  WITH CHECK (auth.uid()::text = created_by);

CREATE POLICY "Users can delete their own worlds"
  ON worlds
  FOR DELETE
  TO authenticated
  USING (auth.uid()::text = created_by);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_worlds_updated_at
  BEFORE UPDATE ON worlds
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();