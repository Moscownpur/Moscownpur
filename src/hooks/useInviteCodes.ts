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

export const useInviteCode = (profileUserId?: string) => {
  const { user } = useAuth();
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInviteCode = async (targetUserId: string) => {
    if (!targetUserId) {
      setError('User ID is required');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase.rpc('get_user_invite_code', {
        target_user_id: targetUserId
      });

      if (fetchError) {
        setError(fetchError.message);
        setInviteCode(null);
        return;
      }

      // The function returns a single UUID directly, not an array
      if (data) {
        setInviteCode(data);
      } else {
        setInviteCode(null);
        setError('No invite code found.');
      }
    } catch (err) {
      console.error('Error fetching invite code:', err);
      setError('An unexpected error occurred');
      setInviteCode(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Reset state when profile user ID changes
    setInviteCode(null);
    setError(null);
    setLoading(true);
    
    if (profileUserId) {
      fetchInviteCode(profileUserId);
    }
  }, [profileUserId]);

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
