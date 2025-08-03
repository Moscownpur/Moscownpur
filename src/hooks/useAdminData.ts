import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import toast from 'react-hot-toast';

export interface UserStatistics {
  id: string;
  username: string;
  email: string;
  full_name: string;
  created_at: string;
  is_admin: boolean;
  world_count: number;
  character_count: number;
  region_count: number;
  event_count: number;
}

export interface WorldWithDetails {
  id: string;
  name: string;
  type: string;
  description: string;
  created_by: string;
  created_at: string;
  user_name: string;
  character_count: number;
  region_count: number;
  event_count: number;
}

export const useAdminData = () => {
  const [users, setUsers] = useState<UserStatistics[]>([]);
  const [worlds, setWorlds] = useState<WorldWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const { admin } = useAdminAuth();

  const fetchUsers = async () => {
    try {
      if (!supabase) {
        setUsers([]);
        return;
      }

      const { data, error } = await supabase
        .from('user_statistics')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    }
  };

  const fetchWorlds = async () => {
    try {
      if (!supabase) {
        setWorlds([]);
        return;
      }

      const { data, error } = await supabase
        .from('worlds')
        .select(`
          *,
          auth_users!worlds_created_by_fkey(username),
          characters(count),
          regions(count),
          timeline_events(count)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const worldsWithDetails = data?.map(world => ({
        ...world,
        user_name: world.auth_users?.username || 'Unknown',
        character_count: world.characters?.length || 0,
        region_count: world.regions?.length || 0,
        event_count: world.timeline_events?.length || 0
      })) || [];

      setWorlds(worldsWithDetails);
    } catch (error) {
      console.error('Error fetching worlds:', error);
      toast.error('Failed to load worlds');
    }
  };

  const toggleUserStatus = async (userId: string, isActive: boolean) => {
    try {
      if (!supabase) {
        throw new Error('Database connection not available');
      }

      const { error } = await supabase
        .from('auth_users')
        .update({ is_admin: isActive })
        .eq('id', userId);

      if (error) throw error;
      
      await fetchUsers(); // Refresh data
      toast.success(`User ${isActive ? 'activated' : 'deactivated'} successfully!`);
    } catch (error) {
      console.error('Error toggling user status:', error);
      toast.error('Failed to update user status');
    }
  };

  const deleteWorld = async (worldId: string) => {
    try {
      if (!supabase) {
        throw new Error('Database connection not available');
      }

      const { error } = await supabase
        .from('worlds')
        .delete()
        .eq('id', worldId);

      if (error) throw error;
      
      await fetchWorlds(); // Refresh data
      toast.success('World deleted successfully!');
    } catch (error) {
      console.error('Error deleting world:', error);
      toast.error('Failed to delete world');
    }
  };

  useEffect(() => {
    if (admin) {
      Promise.all([fetchUsers(), fetchWorlds()]).finally(() => {
        setLoading(false);
      });
    }
  }, [admin]);

  return {
    users,
    worlds,
    loading,
    toggleUserStatus,
    deleteWorld,
    refetch: () => Promise.all([fetchUsers(), fetchWorlds()])
  };
};