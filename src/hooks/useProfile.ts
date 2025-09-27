import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Database } from '../lib/supabase';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface UserStats {
  worlds_count: number;
  characters_count: number;
  scenes_count: number;
  events_count: number;
}

interface UseProfileResult {
  profile: Profile | null;
  stats: UserStats | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useProfile = (username: string): UseProfileResult => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    if (!username) {
      setError('Username is required');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch profile by username (case-insensitive)
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .ilike('username', username)
        .single();

      if (profileError) {
        if (profileError.code === 'PGRST116') {
          setError('User not found');
        } else if (profileError.code === 'PGRST301') {
          setError('Multiple profiles found with this username');
        } else if (profileError.message?.includes('406')) {
          setError('Profile access denied. Please try again later.');
        } else {
          setError(`Failed to load profile: ${profileError.message || 'Unknown error'}`);
        }
        setLoading(false);
        return;
      }

      setProfile(profileData);

      // Fetch user statistics
      const [worldsResult, charactersResult, scenesResult, eventsResult] = await Promise.all([
        supabase
          .from('worlds')
          .select('world_id', { count: 'exact' })
          .eq('user_id', profileData.id),
        supabase
          .from('characters')
          .select('character_id', { count: 'exact' })
          .eq('created_by', profileData.id),
        supabase
          .from('scenes')
          .select('scene_id', { count: 'exact' })
          .eq('created_by', profileData.id),
        supabase
          .from('timeline_events')
          .select('id', { count: 'exact' })
          .eq('created_by', profileData.id)
      ]);

      setStats({
        worlds_count: worldsResult.count || 0,
        characters_count: charactersResult.count || 0,
        scenes_count: scenesResult.count || 0,
        events_count: eventsResult.count || 0
      });

    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [username]);

  return {
    profile,
    stats,
    loading,
    error,
    refetch: fetchProfile
  };
};

export const useProfileByUsername = (username: string) => {
  return useProfile(username);
};

export const useUpdateUsername = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateUsername = async (newUsername: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: updateError } = await supabase.rpc('update_username', {
        user_id: (await supabase.auth.getUser()).data.user?.id,
        new_username: newUsername
      });

      if (updateError) {
        setError(updateError.message);
        return false;
      }

      return true;
    } catch (err) {
      console.error('Error updating username:', err);
      setError('An unexpected error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    updateUsername,
    loading,
    error
  };
};

