-- Refactor invite code system to use separate invite_codes table
-- This migration removes invite_code from profiles and uses the invite_codes table

-- First, let's check if there are any existing invite_connections
DO $$
DECLARE
  connection_count integer;
BEGIN
  SELECT COUNT(*) INTO connection_count FROM public.invite_connections;
  RAISE NOTICE 'Found % existing invite connections', connection_count;
  
  IF connection_count > 0 THEN
    RAISE NOTICE 'Note: Existing invite connections will be preserved';
  END IF;
END $$;

-- Remove the invite_code column from profiles table since we're using invite_codes table
ALTER TABLE public.profiles DROP COLUMN IF EXISTS invite_code;

-- Drop the index on invite_code since it's no longer needed
DROP INDEX IF EXISTS profiles_invite_code_unique_idx;

-- Update the create_invitation function to not require invite_code
CREATE OR REPLACE FUNCTION public.create_invitation(target_user_id uuid)
RETURNS uuid AS $$
DECLARE
  new_invitation_id uuid;
BEGIN
  -- Check if target user exists
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = target_user_id) THEN
    RAISE EXCEPTION 'Target user not found';
  END IF;
  
  -- Check if invitation already exists
  IF EXISTS (
    SELECT 1 FROM public.invite_connections 
    WHERE inviter_user_id = auth.uid() AND invitee_user_id = target_user_id
  ) THEN
    RAISE EXCEPTION 'Invitation already exists';
  END IF;
  
  -- Create the invitation
  INSERT INTO public.invite_connections (
    inviter_user_id, 
    invitee_user_id
  )
  VALUES (
    auth.uid(),
    target_user_id
  )
  RETURNING id INTO new_invitation_id;
  
  RETURN new_invitation_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create invite code for user (using invite_codes table)
CREATE OR REPLACE FUNCTION public.create_invite_code(target_user_id uuid)
RETURNS uuid AS $$
DECLARE
  new_code_id uuid;
BEGIN
  -- Check if user already has an invite code
  IF EXISTS (SELECT 1 FROM public.invite_codes WHERE user_id = target_user_id) THEN
    RAISE EXCEPTION 'User already has an invite code';
  END IF;
  
  -- Create new invite code
  INSERT INTO public.invite_codes (user_id)
  VALUES (target_user_id)
  RETURNING id INTO new_code_id;
  
  RETURN new_code_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's invite code
CREATE OR REPLACE FUNCTION public.get_user_invite_code(target_user_id uuid)
RETURNS uuid AS $$
DECLARE
  invite_code uuid;
BEGIN
  SELECT code INTO invite_code
  FROM public.invite_codes
  WHERE user_id = target_user_id;
  
  RETURN invite_code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user by invite code
CREATE OR REPLACE FUNCTION public.get_user_by_invite_code(invite_code_param uuid)
RETURNS TABLE (
  id uuid,
  username text,
  display_name text,
  full_name text,
  avatar_url text
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.username,
    p.display_name,
    p.full_name,
    p.avatar_url
  FROM public.profiles p
  JOIN public.invite_codes ic ON p.id = ic.user_id
  WHERE ic.code = invite_code_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create invitation using invite code
CREATE OR REPLACE FUNCTION public.create_invitation_by_code(invite_code_param uuid)
RETURNS uuid AS $$
DECLARE
  target_user_id uuid;
  new_invitation_id uuid;
BEGIN
  -- Get user ID by invite code
  SELECT ic.user_id INTO target_user_id
  FROM public.invite_codes ic
  WHERE ic.code = invite_code_param;
  
  -- Check if user exists
  IF target_user_id IS NULL THEN
    RAISE EXCEPTION 'Invalid invite code';
  END IF;
  
  -- Check if trying to invite yourself
  IF target_user_id = auth.uid() THEN
    RAISE EXCEPTION 'Cannot invite yourself';
  END IF;
  
  -- Check if invitation already exists
  IF EXISTS (
    SELECT 1 FROM public.invite_connections 
    WHERE inviter_user_id = auth.uid() AND invitee_user_id = target_user_id
  ) THEN
    RAISE EXCEPTION 'Invitation already exists';
  END IF;
  
  -- Create the invitation
  INSERT INTO public.invite_connections (
    inviter_user_id, 
    invitee_user_id
  )
  VALUES (
    auth.uid(),
    target_user_id
  )
  RETURNING id INTO new_invitation_id;
  
  RETURN new_invitation_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create invite codes for all existing users
DO $$
DECLARE
  user_record RECORD;
  users_created integer := 0;
BEGIN
  FOR user_record IN 
    SELECT id FROM public.profiles
  LOOP
    -- Create invite code for user if they don't have one
    INSERT INTO public.invite_codes (user_id)
    SELECT user_record.id
    WHERE NOT EXISTS (
      SELECT 1 FROM public.invite_codes WHERE user_id = user_record.id
    );
    
    users_created := users_created + 1;
  END LOOP;
  
  RAISE NOTICE 'Created invite codes for % users', users_created;
END $$;

-- Update the handle_new_user function to create invite codes for new users
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
  
  -- Create profile
  INSERT INTO public.profiles (
    id, 
    email, 
    full_name, 
    username, 
    display_name,
    xp_score,
    followers_count,
    following_count,
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
    0
  );
  
  -- Create invite code for new user
  INSERT INTO public.invite_codes (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION public.create_invite_code(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_invite_code(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_by_invite_code(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_invitation_by_code(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_invitation(uuid) TO authenticated;
