import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { Database } from '../../../lib/supabase';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface UserStats {
  worlds_count: number;
  characters_count: number;
  scenes_count: number;
  events_count: number;
  dialogues_count: number;
  badge_xp_rewards: number;
  calculated_xp: number;
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

      // First get user's worlds to find characters and scenes
      const { data: userWorlds, error: worldsError } = await supabase
        .from('worlds')
        .select('world_id')
        .eq('user_id', profileData.id);

      if (worldsError) {
        console.error('Error fetching worlds:', worldsError);
        setStats({
          worlds_count: 0,
          characters_count: 0,
          scenes_count: 0,
          events_count: 0
        });
        return;
      }

      const worldIds = userWorlds?.map(w => w.world_id) || [];

      // Get chapters in user's worlds
      const { data: userChapters, error: chaptersError } = worldIds.length > 0 ? await supabase
        .from('chapters')
        .select('chapter_id')
        .in('world_id', worldIds) : { data: [], error: null };

      if (chaptersError) {
        console.error('Error fetching chapters:', chaptersError);
      }

      const chapterIds = userChapters?.map(c => c.chapter_id) || [];

      // Get events in user's chapters
      const { data: userEvents, error: eventsError } = chapterIds.length > 0 ? await supabase
        .from('events')
        .select('event_id')
        .in('chapter_id', chapterIds) : { data: [], error: null };

      if (eventsError) {
        console.error('Error fetching events:', eventsError);
      }

      const eventIds = userEvents?.map(e => e.event_id) || [];

      // Fetch user statistics
      const [worldsResult, charactersResult, scenesResult, eventsResult, dialoguesResult] = await Promise.all([
        supabase
          .from('worlds')
          .select('world_id', { count: 'exact' })
          .eq('user_id', profileData.id),
        worldIds.length > 0 ? supabase
          .from('characters')
          .select('character_id', { count: 'exact' })
          .in('world_id', worldIds) : Promise.resolve({ count: 0 }),
        eventIds.length > 0 ? supabase
          .from('scenes')
          .select('scene_id', { count: 'exact' })
          .in('event_id', eventIds) : Promise.resolve({ count: 0 }),
        supabase
          .from('events')
          .select('event_id', { count: 'exact' })
          .in('chapter_id', chapterIds),
        eventIds.length > 0 ? supabase
          .from('dialogues')
          .select('dialogue_id', { count: 'exact' })
          .in('scene_id', eventIds) : Promise.resolve({ count: 0 })
      ]);

      // Fetch user's badges to get XP rewards
      const { data: userBadges, error: badgesError } = await supabase
        .from('user_badges')
        .select(`
          badge_catalog!inner(
            xp_reward
          )
        `)
        .eq('user_id', profileData.id);

      if (badgesError) {
        console.error('Error fetching user badges:', badgesError);
      }

      // Calculate total badge XP rewards
      const badgeXPRewards = userBadges?.reduce((total, userBadge) => {
        return total + (userBadge.badge_catalog?.xp_reward || 0);
      }, 0) || 0;

      // Calculate XP using weighted formula
      const worldsCount = worldsResult.count || 0;
      const charactersCount = charactersResult.count || 0;
      const scenesCount = scenesResult.count || 0;
      const eventsCount = eventsResult.count || 0;
      const dialoguesCount = dialoguesResult.count || 0;
      const inviteCount = profileData.invite_count || 0;
      
      // XP Formula: Badge XP Rewards + 100*Worlds + 200*Characters + 50*Scenes + 25*Events + 500*Invites + 10*Dialogues + 1000 (default)
      const calculatedXP = 
        badgeXPRewards + // Badge XP rewards from earned badges
        (worldsCount * 100) +
        (charactersCount * 200) +
        (scenesCount * 50) +
        (eventsCount * 25) +
        (inviteCount * 500) +
        (dialoguesCount * 10) +
        1000; // Default XP

      setStats({
        worlds_count: worldsCount,
        characters_count: charactersCount,
        scenes_count: scenesCount,
        events_count: eventsCount,
        dialogues_count: dialoguesCount,
        badge_xp_rewards: badgeXPRewards,
        calculated_xp: calculatedXP
      });

    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Reset state when username changes
    setProfile(null);
    setStats(null);
    setError(null);
    setLoading(true);
    
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

