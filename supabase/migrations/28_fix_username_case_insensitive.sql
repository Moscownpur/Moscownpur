-- Fix username case-insensitive handling
-- This migration updates the username system to be case-insensitive

-- Drop the existing unique index
DROP INDEX IF EXISTS profiles_username_unique_idx;

-- Create new case-insensitive unique index
CREATE UNIQUE INDEX profiles_username_unique_idx 
ON public.profiles(LOWER(username)) 
WHERE username IS NOT NULL;

-- Update the handle_new_user function to generate lowercase usernames
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  base_username text;
  final_username text;
  counter integer := 0;
BEGIN
  -- Generate base username from email or full name (always lowercase)
  base_username := LOWER(COALESCE(
    REGEXP_REPLACE(
      COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', SPLIT_PART(NEW.email, '@', 1)),
      '[^a-zA-Z0-9_-]', '', 'g'
    ),
    'user'
  ));
  
  -- Ensure base username meets minimum length
  IF length(base_username) < 3 THEN
    base_username := base_username || '123';
  END IF;
  
  -- Truncate to max length
  base_username := LEFT(base_username, 27);
  
  -- Find unique username (case-insensitive check)
  final_username := base_username;
  WHILE EXISTS (SELECT 1 FROM public.profiles WHERE LOWER(username) = LOWER(final_username)) LOOP
    counter := counter + 1;
    final_username := base_username || counter::text;
    
    -- Prevent infinite loop
    IF counter > 9999 THEN
      final_username := base_username || EXTRACT(EPOCH FROM NOW())::bigint;
      EXIT;
    END IF;
  END LOOP;
  
  INSERT INTO public.profiles (id, email, full_name, username)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    final_username
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update the update_username function to check uniqueness case-insensitively
CREATE OR REPLACE FUNCTION public.update_username(
  user_id uuid,
  new_username text
)
RETURNS boolean AS $$
DECLARE
  username_exists boolean;
BEGIN
  -- Validate username format
  IF new_username IS NULL OR length(new_username) < 3 OR length(new_username) > 30 THEN
    RAISE EXCEPTION 'Username must be between 3 and 30 characters';
  END IF;
  
  IF new_username !~ '^[a-zA-Z0-9_-]+$' THEN
    RAISE EXCEPTION 'Username can only contain letters, numbers, underscores, and hyphens';
  END IF;
  
  -- Check if username already exists (case-insensitive)
  SELECT EXISTS(SELECT 1 FROM public.profiles WHERE LOWER(username) = LOWER(new_username) AND id != user_id) 
  INTO username_exists;
  
  IF username_exists THEN
    RAISE EXCEPTION 'Username already taken';
  END IF;
  
  -- Update the username (store in lowercase for consistency)
  UPDATE public.profiles 
  SET username = LOWER(new_username), updated_at = now()
  WHERE id = user_id;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.update_username(uuid, text) TO authenticated;
