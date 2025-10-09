-- Prevent self-invites and ensure proper constraints
-- This migration adds constraints to prevent users from inviting themselves

-- Add check constraint to prevent self-invites
ALTER TABLE public.invite_connections 
ADD CONSTRAINT invite_connections_no_self_invite 
CHECK (inviter_user_id != invitee_user_id);

-- Verify the existing unique constraint is in place
-- (This should already exist from migration 32, but let's ensure it's there)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'invite_connections_inviter_user_id_invitee_user_id_key'
  ) THEN
    ALTER TABLE public.invite_connections 
    ADD CONSTRAINT invite_connections_inviter_user_id_invitee_user_id_key 
    UNIQUE (inviter_user_id, invitee_user_id);
  END IF;
END $$;

-- Update the create_invitation_by_code function to include the self-invite check
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

-- Update the create_invitation function to include the self-invite check
CREATE OR REPLACE FUNCTION public.create_invitation(target_user_id uuid)
RETURNS uuid AS $$
DECLARE
  new_invitation_id uuid;
BEGIN
  -- Check if trying to invite yourself
  IF target_user_id = auth.uid() THEN
    RAISE EXCEPTION 'Cannot invite yourself';
  END IF;
  
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

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION public.create_invitation_by_code(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_invitation(uuid) TO authenticated;
