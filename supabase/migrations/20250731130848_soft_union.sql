/*
  # Create authentication users table

  1. New Tables
    - `auth_users`
      - `id` (uuid, primary key)
      - `username` (text, unique)
      - `email` (text, unique)
      - `password_hash` (text)
      - `full_name` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `auth_users` table
    - Add policy for users to read their own data
    - Add policy for users to update their own data
    - Add policy for public signup (insert)

  3. Functions
    - Create trigger function for updating timestamps
    - Create trigger for auto-updating updated_at column
*/

-- Create auth_users table
CREATE TABLE IF NOT EXISTS auth_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  full_name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE auth_users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own data"
  ON auth_users
  FOR SELECT
  TO authenticated
  USING (id = (current_setting('app.current_user_id'))::uuid);

CREATE POLICY "Users can update own data"
  ON auth_users
  FOR UPDATE
  TO authenticated
  USING (id = (current_setting('app.current_user_id'))::uuid)
  WITH CHECK (id = (current_setting('app.current_user_id'))::uuid);

CREATE POLICY "Allow public signup"
  ON auth_users
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_auth_users_updated_at
  BEFORE UPDATE ON auth_users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();