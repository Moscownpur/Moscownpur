import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface InviteConnection {
  id: string;
  inviter_user_id: string;
  invitee_user_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  updated_at: string;
  inviter_username: string;
  inviter_display_name: string;
  invitee_username: string;
  invitee_display_name: string;
}

interface UseInviteConnectionsResult {
  invitations: InviteConnection[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useInviteConnections = (userId?: string) => {
  const { user } = useAuth();
  const [invitations, setInvitations] = useState<InviteConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const targetUserId = userId || user?.id;

  const fetchInvitations = async () => {
    if (!targetUserId) {
      setError('User ID is required');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase.rpc('get_user_invitations', {
        target_user_id: targetUserId
      });

      if (fetchError) {
        setError(fetchError.message);
        return;
      }

      setInvitations(data || []);
    } catch (err) {
      console.error('Error fetching invitations:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (targetUserId) {
      fetchInvitations();
    }
  }, [targetUserId]);

  return {
    invitations,
    loading,
    error,
    refetch: fetchInvitations
  };
};

export const useCreateInvitation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createInvitation = async (targetUserId: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: createError } = await supabase.rpc('create_invitation', {
        target_user_id: targetUserId
      });

      if (createError) {
        setError(createError.message);
        return null;
      }

      return data;
    } catch (err) {
      console.error('Error creating invitation:', err);
      setError('An unexpected error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createInvitationByCode = async (inviteCode: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: createError } = await supabase.rpc('create_invitation_by_code', {
        invite_code_param: inviteCode
      });

      if (createError) {
        setError(createError.message);
        return null;
      }

      return data;
    } catch (err) {
      console.error('Error creating invitation by code:', err);
      setError('An unexpected error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    createInvitation,
    createInvitationByCode,
    loading,
    error
  };
};

export const useAcceptInvitation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const acceptInvitation = async (invitationId: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: acceptError } = await supabase.rpc('accept_invitation', {
        invitation_id: invitationId
      });

      if (acceptError) {
        setError(acceptError.message);
        return false;
      }

      return data;
    } catch (err) {
      console.error('Error accepting invitation:', err);
      setError('An unexpected error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    acceptInvitation,
    loading,
    error
  };
};

export const useRejectInvitation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const rejectInvitation = async (invitationId: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: rejectError } = await supabase.rpc('reject_invitation', {
        invitation_id: invitationId
      });

      if (rejectError) {
        setError(rejectError.message);
        return false;
      }

      return data;
    } catch (err) {
      console.error('Error rejecting invitation:', err);
      setError('An unexpected error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    rejectInvitation,
    loading,
    error
  };
};
