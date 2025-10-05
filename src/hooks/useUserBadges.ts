import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../contexts/AuthContext';

interface UserBadge {
  badge_id: string;
  category: string;
  rarity: string | null;
  name: string;
  description: string;
  points: number;
  xp_reward: number;
  earned_at: string;
}

interface UseUserBadgesResult {
  badges: UserBadge[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useUserBadges = (userId?: string) => {
  const { user } = useAuth();
  const [badges, setBadges] = useState<UserBadge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const targetUserId = userId || user?.id;

  const fetchUserBadges = async () => {
    if (!targetUserId) {
      setError('User ID is required');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase.rpc('get_user_badges', {
        target_user_id: targetUserId
      });

      if (fetchError) {
        setError(fetchError.message);
        return;
      }

      setBadges(data || []);
    } catch (err) {
      console.error('Error fetching user badges:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Reset state when target user ID changes
    setBadges([]);
    setError(null);
    setLoading(true);
    
    if (targetUserId) {
      fetchUserBadges();
    }
  }, [targetUserId]);

  return {
    badges,
    loading,
    error,
    refetch: fetchUserBadges
  };
};

export const useCheckUserBadge = (badgeName: string, badgeCategory?: string) => {
  const { user } = useAuth();
  const [hasBadge, setHasBadge] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkBadge = async () => {
    if (!user?.id) {
      setError('User not authenticated');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: checkError } = await supabase.rpc('user_has_badge', {
        target_user_id: user.id,
        badge_name: badgeName,
        badge_category: badgeCategory || null
      });

      if (checkError) {
        setError(checkError.message);
        return;
      }

      setHasBadge(data || false);
    } catch (err) {
      console.error('Error checking user badge:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id && badgeName) {
      checkBadge();
    }
  }, [user?.id, badgeName, badgeCategory]);

  return {
    hasBadge,
    loading,
    error,
    refetch: checkBadge
  };
};

export const useAwardBadge = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const awardBadge = async (userId: string, badgeName: string, badgeCategory?: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: awardError } = await supabase.rpc('award_badge_to_user', {
        target_user_id: userId,
        badge_name: badgeName,
        badge_category: badgeCategory || null
      });

      if (awardError) {
        setError(awardError.message);
        return false;
      }

      return data;
    } catch (err) {
      console.error('Error awarding badge:', err);
      setError('An unexpected error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    awardBadge,
    loading,
    error
  };
};
