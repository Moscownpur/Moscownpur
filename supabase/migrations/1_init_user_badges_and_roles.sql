-- init migration
-- Drop existing tables if they exist (to start fresh)
DROP TABLE IF EXISTS public.user_badges CASCADE;
DROP TABLE IF EXISTS public.user_roles CASCADE;

-- Create badges table
CREATE TABLE public.badges (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  badge_name text NOT NULL,
  awarded_at timestamptz DEFAULT now(),
  CONSTRAINT badges_pkey PRIMARY KEY (id),
  CONSTRAINT badges_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create index for better performance on user_id queries
CREATE INDEX IF NOT EXISTS badges_user_id_idx ON public.badges(user_id);

-- Create user_roles table (keeping original name for consistency)
CREATE TABLE public.user_roles (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  is_admin boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT user_roles_pkey PRIMARY KEY (id),
  CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  CONSTRAINT user_roles_user_id_unique UNIQUE (user_id)
);

-- Create index for user_id in user_roles
CREATE INDEX IF NOT EXISTS user_roles_user_id_idx ON public.user_roles(user_id);

-- Optional: Create a function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for user_roles updated_at
CREATE TRIGGER update_user_roles_updated_at 
    BEFORE UPDATE ON public.user_roles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
