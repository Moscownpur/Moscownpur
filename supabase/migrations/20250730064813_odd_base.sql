/*
  # Create timeline_events table

  1. New Tables
    - `timeline_events`
      - `id` (uuid, primary key)
      - `title` (text, not null)
      - `date` (text, not null)
      - `era` (text)
      - `location` (text)
      - `involved_characters` (text array)
      - `description` (text)
      - `type` (text, not null)
      - `consequences` (text)
      - `world_id` (uuid, foreign key)
      - `created_by` (text, not null)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `timeline_events` table
    - Add policies for authenticated users
*/

CREATE TABLE IF NOT EXISTS timeline_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  date text NOT NULL,
  era text DEFAULT '',
  location text DEFAULT '',
  involved_characters text[] DEFAULT '{}',
  description text DEFAULT '',
  type text NOT NULL CHECK (type IN ('Birth', 'Death', 'War', 'Marriage', 'Political', 'Mystical', 'Invention', 'Encounter', 'Vision', 'Betrayal', 'Coronation')),
  consequences text DEFAULT '',
  world_id uuid REFERENCES worlds(id) ON DELETE CASCADE,
  created_by text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE timeline_events ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view timeline events in accessible worlds"
  ON timeline_events
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create timeline events"
  ON timeline_events
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = created_by);

CREATE POLICY "Users can update their own timeline events"
  ON timeline_events
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = created_by)
  WITH CHECK (auth.uid()::text = created_by);

CREATE POLICY "Users can delete their own timeline events"
  ON timeline_events
  FOR DELETE
  TO authenticated
  USING (auth.uid()::text = created_by);

-- Create updated_at trigger
CREATE TRIGGER update_timeline_events_updated_at
  BEFORE UPDATE ON timeline_events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();