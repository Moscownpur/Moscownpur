-- Create simple invite_codes table
-- This migration creates a separate table for invite codes using UUIDs

-- Create invite_codes table
CREATE TABLE IF NOT EXISTS public.invite_codes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  code uuid DEFAULT gen_random_uuid() UNIQUE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS invite_codes_user_id_idx 
ON public.invite_codes(user_id);

CREATE INDEX IF NOT EXISTS invite_codes_code_idx 
ON public.invite_codes(code);

-- Enable RLS
ALTER TABLE public.invite_codes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can view their own invite codes
CREATE POLICY "Users can view own invite codes" ON public.invite_codes
    FOR SELECT USING (auth.uid() = user_id);

-- Users can create their own invite codes
CREATE POLICY "Users can create own invite codes" ON public.invite_codes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Public can view invite codes (for validation)
CREATE POLICY "Public can view invite codes" ON public.invite_codes
    FOR SELECT USING (true);

-- Admins can manage all invite codes
CREATE POLICY "Admins can manage all invite codes" ON public.invite_codes
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = auth.uid() AND is_admin = true
        )
    );

-- Create trigger for updated_at
CREATE TRIGGER update_invite_codes_updated_at 
    BEFORE UPDATE ON public.invite_codes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to create invite code for user
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

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION public.create_invite_code(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_by_invite_code(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_invite_code(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_invitation_by_code(uuid) TO authenticated;
