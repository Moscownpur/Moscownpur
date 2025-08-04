/*
  # Admin System Setup

  1. New Tables
    - `admin_users` - Admin authentication and roles
    - Add admin role tracking to existing auth_users
  
  2. Security
    - Enable RLS on admin_users table
    - Add policies for admin access only
    - Create admin role management
  
  3. Functions
    - Admin authentication helpers
    - User management functions
*/

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  full_name text NOT NULL,
  role text DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add admin role to existing auth_users
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'auth_users' AND column_name = 'is_admin'
  ) THEN
    ALTER TABLE auth_users ADD COLUMN is_admin boolean DEFAULT false;
  END IF;
END $$;

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Admin policies
CREATE POLICY "Admins can read all admin data"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au 
      WHERE au.id::text = current_setting('app.current_admin_id', true)
      AND au.is_active = true
    )
  );

CREATE POLICY "Allow admin login"
  ON admin_users
  FOR SELECT
  TO anon
  USING (true);

-- Create admin user (default: admin/admin123)
INSERT INTO admin_users (username, email, password_hash, full_name, role)
VALUES (
  'admin',
  'admin@eworld.com',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBMY9f7yb3N7dO', -- admin123
  'System Administrator',
  'super_admin'
) ON CONFLICT (username) DO NOTHING;

-- Update trigger for admin_users
CREATE TRIGGER update_admin_users_updated_at
  BEFORE UPDATE ON admin_users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create view for user statistics
CREATE OR REPLACE VIEW user_statistics AS
SELECT 
  u.id,
  u.username,
  u.email,
  u.full_name,
  u.created_at,
  u.is_admin,
  COUNT(DISTINCT w.id) as world_count,
  COUNT(DISTINCT c.id) as character_count,
  COUNT(DISTINCT r.id) as region_count,
  COUNT(DISTINCT te.id) as event_count
FROM auth_users u
LEFT JOIN worlds w ON w.created_by = u.id::text
LEFT JOIN characters c ON c.created_by = u.id::text
LEFT JOIN regions r ON r.created_by = u.id::text
LEFT JOIN timeline_events te ON te.created_by = u.id::text
GROUP BY u.id, u.username, u.email, u.full_name, u.created_at, u.is_admin;