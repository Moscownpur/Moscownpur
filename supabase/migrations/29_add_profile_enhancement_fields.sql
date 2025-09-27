-- Add enhanced profile fields for better user profiles
-- This migration adds additional fields to the profiles table for enhanced user profiles

-- Add new profile fields
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS tagline text,
ADD COLUMN IF NOT EXISTS bio text,
ADD COLUMN IF NOT EXISTS display_name text,
ADD COLUMN IF NOT EXISTS xp_score integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS followers_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS following_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS invite_code text,
ADD COLUMN IF NOT EXISTS invite_count integer DEFAULT 0;

-- Add constraints for the new fields
-- Tagline should be short (max 300 characters)
ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_tagline_length_check 
CHECK (tagline IS NULL OR length(tagline) <= 300);

-- Bio should be reasonable length (max 2000 characters)
ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_bio_length_check 
CHECK (bio IS NULL OR length(bio) <= 2000);

-- Display name should be reasonable length (max 50 characters)
ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_display_name_length_check 
CHECK (display_name IS NULL OR length(display_name) <= 50);

-- XP score should be non-negative
ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_xp_score_positive_check 
CHECK (xp_score >= 0);

-- Followers count should be non-negative
ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_followers_count_positive_check 
CHECK (followers_count >= 0);

-- Following count should be non-negative
ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_following_count_positive_check 
CHECK (following_count >= 0);

-- Invite count should be non-negative
ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_invite_count_positive_check 
CHECK (invite_count >= 0);

-- Invite code should be unique and follow hex format
ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_invite_code_format_check 
CHECK (invite_code IS NULL OR invite_code ~ '^[0-9a-fA-F]{8,16}$');

-- Create unique index for invite codes
CREATE UNIQUE INDEX IF NOT EXISTS profiles_invite_code_unique_idx 
ON public.profiles(invite_code) 
WHERE invite_code IS NOT NULL;

-- Create index for XP score for leaderboard queries
CREATE INDEX IF NOT EXISTS profiles_xp_score_idx 
ON public.profiles(xp_score DESC) 
WHERE xp_score > 0;

-- Create index for followers count for popular users queries
CREATE INDEX IF NOT EXISTS profiles_followers_count_idx 
ON public.profiles(followers_count DESC) 
WHERE followers_count > 0;

-- Update the handle_new_user function to generate invite codes
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  base_username text;
  final_username text;
  counter integer := 0;
  new_invite_code text;
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
  
  -- Generate unique invite code (8-character hex)
  new_invite_code := LOWER(SUBSTRING(MD5(RANDOM()::text || EXTRACT(EPOCH FROM NOW())::text), 1, 8));
  WHILE EXISTS (SELECT 1 FROM public.profiles WHERE invite_code = new_invite_code) LOOP
    new_invite_code := LOWER(SUBSTRING(MD5(RANDOM()::text || EXTRACT(EPOCH FROM NOW())::text), 1, 8));
  END LOOP;
  
  INSERT INTO public.profiles (
    id, 
    email, 
    full_name, 
    username, 
    display_name,
    xp_score,
    followers_count,
    following_count,
    invite_code,
    invite_count
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    final_username,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    0,
    0,
    0,
    new_invite_code,
    0
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to generate a new invite code for existing users
CREATE OR REPLACE FUNCTION public.generate_invite_code(user_id uuid)
RETURNS text AS $$
DECLARE
  new_invite_code text;
BEGIN
  -- Generate unique invite code (8-character hex)
  new_invite_code := LOWER(SUBSTRING(MD5(RANDOM()::text || EXTRACT(EPOCH FROM NOW())::text), 1, 8));
  WHILE EXISTS (SELECT 1 FROM public.profiles WHERE invite_code = new_invite_code AND id != user_id) LOOP
    new_invite_code := LOWER(SUBSTRING(MD5(RANDOM()::text || EXTRACT(EPOCH FROM NOW())::text), 1, 8));
  END LOOP;
  
  -- Update the user's invite code
  UPDATE public.profiles 
  SET invite_code = new_invite_code, updated_at = now()
  WHERE id = user_id;
  
  RETURN new_invite_code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update XP score
CREATE OR REPLACE FUNCTION public.update_xp_score(user_id uuid, xp_delta integer)
RETURNS boolean AS $$
BEGIN
  -- Validate XP delta
  IF xp_delta = 0 THEN
    RETURN false;
  END IF;
  
  -- Update XP score (ensure it doesn't go below 0)
  UPDATE public.profiles 
  SET xp_score = GREATEST(xp_score + xp_delta, 0), updated_at = now()
  WHERE id = user_id;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update follower/following counts
CREATE OR REPLACE FUNCTION public.update_follow_counts(
  user_id uuid, 
  followers_delta integer DEFAULT 0, 
  following_delta integer DEFAULT 0
)
RETURNS boolean AS $$
BEGIN
  -- Update follower and following counts (ensure they don't go below 0)
  UPDATE public.profiles 
  SET 
    followers_count = GREATEST(followers_count + followers_delta, 0),
    following_count = GREATEST(following_count + following_delta, 0),
    updated_at = now()
  WHERE id = user_id;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment invite count
CREATE OR REPLACE FUNCTION public.increment_invite_count(user_id uuid)
RETURNS boolean AS $$
BEGIN
  UPDATE public.profiles 
  SET invite_count = invite_count + 1, updated_at = now()
  WHERE id = user_id;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION public.generate_invite_code(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_xp_score(uuid, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_follow_counts(uuid, integer, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.increment_invite_count(uuid) TO authenticated;
