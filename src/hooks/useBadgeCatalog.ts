import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Database } from '../lib/supabase';

type BadgeCatalog = Database['public']['Tables']['badge_catalog']['Row'];

interface UseBadgeCatalogResult {
  badges: BadgeCatalog[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useBadgeCatalog = (): UseBadgeCatalogResult => {
  const [badges, setBadges] = useState<BadgeCatalog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBadges = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('badge_catalog')
        .select('*')
        .eq('is_active', true)
        .order('rarity', { ascending: false })
        .order('points', { ascending: false });

      if (fetchError) {
        setError(fetchError.message);
        return;
      }

      setBadges(data || []);
    } catch (err) {
      console.error('Error fetching badges:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBadges();
  }, []);

  return {
    badges,
    loading,
    error,
    refetch: fetchBadges
  };
};

export const useBadgesByCategory = (category: string) => {
  const [badges, setBadges] = useState<BadgeCatalog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBadges = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase.rpc('get_badges_by_category', {
        badge_category: category
      });

      if (fetchError) {
        setError(fetchError.message);
        return;
      }

      setBadges(data || []);
    } catch (err) {
      console.error('Error fetching badges by category:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (category) {
      fetchBadges();
    }
  }, [category]);

  return {
    badges,
    loading,
    error,
    refetch: fetchBadges
  };
};

export const useBadgesByRarity = (rarity: string) => {
  const [badges, setBadges] = useState<BadgeCatalog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBadges = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase.rpc('get_badges_by_rarity', {
        badge_rarity: rarity
      });

      if (fetchError) {
        setError(fetchError.message);
        return;
      }

      setBadges(data || []);
    } catch (err) {
      console.error('Error fetching badges by rarity:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (rarity) {
      fetchBadges();
    }
  }, [rarity]);

  return {
    badges,
    loading,
    error,
    refetch: fetchBadges
  };
};

export const useSearchBadges = (searchTerm: string) => {
  const [badges, setBadges] = useState<BadgeCatalog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchBadges = async () => {
    if (!searchTerm.trim()) {
      setBadges([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: searchError } = await supabase.rpc('search_badges', {
        search_term: searchTerm
      });

      if (searchError) {
        setError(searchError.message);
        return;
      }

      setBadges(data || []);
    } catch (err) {
      console.error('Error searching badges:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchBadges();
    }, 300); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  return {
    badges,
    loading,
    error,
    search: searchBadges
  };
};
