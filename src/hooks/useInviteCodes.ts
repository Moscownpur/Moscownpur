import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface UserProfile {
  id: string;
  username: string;
  display_name: string;
  full_name: string;
  avatar_url: string;
}

export const useInviteCode = () => {
  const { user } = useAuth();
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInviteCode = async () => {
    if (!user?.id) {
      setError('User not authenticated');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase.rpc('get_user_invite_code', {
        target_user_id: user.id
      });

      if (fetchError) {
        setError(fetchError.message);
        return;
      }

      setInviteCode(data);
    } catch (err) {
      console.error('Error fetching invite code:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchInviteCode();
    }
  }, [user?.id]);

  return {
    inviteCode,
    loading,
    error,
    refetch: fetchInviteCode
  };
};


export const useGetUserByInviteCode = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getUserByInviteCode = async (inviteCode: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase.rpc('get_user_by_invite_code', {
        invite_code_param: inviteCode
      });

      if (fetchError) {
        setError(fetchError.message);
        return null;
      }

      if (data && data.length > 0) {
        setUserProfile(data[0]);
        return data[0];
      } else {
        setError('User not found with this invite code');
        return null;
      }
    } catch (err) {
      console.error('Error fetching user by invite code:', err);
      setError('An unexpected error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    userProfile,
    loading,
    error,
    getUserByInviteCode
  };
};
