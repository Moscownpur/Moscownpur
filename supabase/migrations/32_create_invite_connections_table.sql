-- Create invite_connections table for tracking user invitations
-- This migration creates a table to manage invitation relationships between users

-- Create invite_connections table
CREATE TABLE IF NOT EXISTS public.invite_connections (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  inviter_user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  invitee_user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  invite_code varchar(20) NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(inviter_user_id, invitee_user_id)
);

-- Add constraints for the invite_connections table
-- Status must be one of the valid values
ALTER TABLE public.invite_connections 
ADD CONSTRAINT invite_connections_status_check 
CHECK (status IN ('pending', 'accepted', 'rejected'));

-- Invite code should not be empty
ALTER TABLE public.invite_connections 
ADD CONSTRAINT invite_connections_invite_code_not_empty 
CHECK (length(trim(invite_code)) > 0);

-- Invite code should be reasonable length
ALTER TABLE public.invite_connections 
ADD CONSTRAINT invite_connections_invite_code_length 
CHECK (length(invite_code) <= 20);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS invite_connections_inviter_user_id_idx 
ON public.invite_connections(inviter_user_id);

CREATE INDEX IF NOT EXISTS invite_connections_invitee_user_id_idx 
ON public.invite_connections(invitee_user_id);

CREATE INDEX IF NOT EXISTS invite_connections_invite_code_idx 
ON public.invite_connections(invite_code);

CREATE INDEX IF NOT EXISTS invite_connections_status_idx 
ON public.invite_connections(status);

CREATE INDEX IF NOT EXISTS invite_connections_created_at_idx 
ON public.invite_connections(created_at DESC);

-- Create trigger for updated_at
CREATE TRIGGER update_invite_connections_updated_at 
    BEFORE UPDATE ON public.invite_connections
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE public.invite_connections ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can view invitations they sent or received
CREATE POLICY "Users can view own invitations" ON public.invite_connections
    FOR SELECT USING (
        auth.uid() = inviter_user_id OR auth.uid() = invitee_user_id
    );

-- Users can create invitations
CREATE POLICY "Users can create invitations" ON public.invite_connections
    FOR INSERT WITH CHECK (auth.uid() = inviter_user_id);

-- Users can update invitations they sent or received
CREATE POLICY "Users can update own invitations" ON public.invite_connections
    FOR UPDATE USING (
        auth.uid() = inviter_user_id OR auth.uid() = invitee_user_id
    );

-- Admins can view all invitations
CREATE POLICY "Admins can view all invitations" ON public.invite_connections
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = auth.uid() AND is_admin = true
        )
    );

-- Admins can manage all invitations
CREATE POLICY "Admins can manage all invitations" ON public.invite_connections
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = auth.uid() AND is_admin = true
        )
    );

-- Function to create an invitation
CREATE OR REPLACE FUNCTION public.create_invitation(
  target_user_id uuid,
  target_invite_code varchar(20)
)
RETURNS uuid AS $$
DECLARE
  new_invitation_id uuid;
  inviter_invite_code varchar(20);
BEGIN
  -- Get the inviter's invite code
  SELECT invite_code INTO inviter_invite_code
  FROM public.profiles 
  WHERE id = auth.uid();
  
  -- Check if inviter has an invite code
  IF inviter_invite_code IS NULL THEN
    RAISE EXCEPTION 'You must have an invite code to send invitations';
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
    invitee_user_id, 
    invite_code
  )
  VALUES (
    auth.uid(),
    target_user_id,
    target_invite_code
  )
  RETURNING id INTO new_invitation_id;
  
  RETURN new_invitation_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to accept an invitation
CREATE OR REPLACE FUNCTION public.accept_invitation(invitation_id uuid)
RETURNS boolean AS $$
DECLARE
  invitation_record RECORD;
BEGIN
  -- Get the invitation details
  SELECT * INTO invitation_record
  FROM public.invite_connections
  WHERE id = invitation_id AND invitee_user_id = auth.uid();
  
  -- Check if invitation exists and belongs to current user
  IF invitation_record IS NULL THEN
    RAISE EXCEPTION 'Invitation not found or not authorized';
  END IF;
  
  -- Check if invitation is still pending
  IF invitation_record.status != 'pending' THEN
    RAISE EXCEPTION 'Invitation is no longer pending';
  END IF;
  
  -- Update the invitation status
  UPDATE public.invite_connections 
  SET status = 'accepted', updated_at = now()
  WHERE id = invitation_id;
  
  -- Update inviter's invite count
  UPDATE public.profiles 
  SET invite_count = invite_count + 1, updated_at = now()
  WHERE id = invitation_record.inviter_user_id;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to reject an invitation
CREATE OR REPLACE FUNCTION public.reject_invitation(invitation_id uuid)
RETURNS boolean AS $$
DECLARE
  invitation_record RECORD;
BEGIN
  -- Get the invitation details
  SELECT * INTO invitation_record
  FROM public.invite_connections
  WHERE id = invitation_id AND invitee_user_id = auth.uid();
  
  -- Check if invitation exists and belongs to current user
  IF invitation_record IS NULL THEN
    RAISE EXCEPTION 'Invitation not found or not authorized';
  END IF;
  
  -- Check if invitation is still pending
  IF invitation_record.status != 'pending' THEN
    RAISE EXCEPTION 'Invitation is no longer pending';
  END IF;
  
  -- Update the invitation status
  UPDATE public.invite_connections 
  SET status = 'rejected', updated_at = now()
  WHERE id = invitation_id;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's invitations
CREATE OR REPLACE FUNCTION public.get_user_invitations(target_user_id uuid)
RETURNS TABLE (
  id uuid,
  inviter_user_id uuid,
  invitee_user_id uuid,
  invite_code varchar(20),
  status text,
  created_at timestamptz,
  updated_at timestamptz,
  inviter_username text,
  inviter_display_name text,
  invitee_username text,
  invitee_display_name text
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ic.id,
    ic.inviter_user_id,
    ic.invitee_user_id,
    ic.invite_code,
    ic.status,
    ic.created_at,
    ic.updated_at,
    inviter.username as inviter_username,
    COALESCE(inviter.display_name, inviter.full_name) as inviter_display_name,
    invitee.username as invitee_username,
    COALESCE(invitee.display_name, invitee.full_name) as invitee_display_name
  FROM public.invite_connections ic
  JOIN public.profiles inviter ON ic.inviter_user_id = inviter.id
  JOIN public.profiles invitee ON ic.invitee_user_id = invitee.id
  WHERE ic.inviter_user_id = target_user_id OR ic.invitee_user_id = target_user_id
  ORDER BY ic.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION public.create_invitation(uuid, varchar) TO authenticated;
GRANT EXECUTE ON FUNCTION public.accept_invitation(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.reject_invitation(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_invitations(uuid) TO authenticated;
