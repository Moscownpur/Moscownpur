import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import toast from 'react-hot-toast';

export interface UserStatistics {
  id: string;
  email: string;
  full_name?: string;
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
  user_email: string;
  user_full_name?: string;
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

      // Get user roles (this should work with RLS policies for admins)
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('*');

      if (rolesError) {
        console.error('Error fetching user roles:', rolesError);
        toast.error('Failed to load users');
        setUsers([]);
        return;
      }

      // Get user statistics from content tables
      const { data: worldStats, error: worldError } = await supabase
        .from('worlds')
        .select('created_by')
        .order('created_at', { ascending: false });

      const { data: characterStats, error: charError } = await supabase
        .from('characters')
        .select('created_by');

      const { data: regionStats, error: regionError } = await supabase
        .from('regions')
        .select('created_by');

      const { data: eventStats, error: eventError } = await supabase
        .from('timeline_events')
        .select('created_by');

      if (worldError || charError || regionError || eventError) {
        console.error('Error fetching statistics:', { worldError, charError, regionError, eventError });
      }

      // Create user statistics from user_roles
      const userStats: UserStatistics[] = userRoles.map(role => {
        const worldCount = worldStats?.filter(w => w.created_by === role.id).length || 0;
        const characterCount = characterStats?.filter(c => c.created_by === role.id).length || 0;
        const regionCount = regionStats?.filter(r => r.created_by === role.id).length || 0;
        const eventCount = eventStats?.filter(e => e.created_by === role.id).length || 0;

        return {
          id: role.id,
          email: `user-${role.id.slice(0, 8)}@example.com`, // Placeholder since we can't get email
          full_name: undefined,
          created_at: role.created_at,
          is_admin: role.is_admin,
          world_count: worldCount,
          character_count: characterCount,
          region_count: regionCount,
          event_count: eventCount
        };
      });

      setUsers(userStats);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
      setUsers([]);
    }
  };

  const fetchWorlds = async () => {
    try {
      if (!supabase) {
        setWorlds([]);
        return;
      }

      // Get worlds with counts
      const { data: worldData, error: worldError } = await supabase
        .from('worlds')
        .select(`
          *,
          characters(count),
          regions(count),
          timeline_events(count)
        `)
        .order('created_at', { ascending: false });

      if (worldError) throw worldError;

      const worldsWithDetails: WorldWithDetails[] = worldData?.map(world => {
        return {
          ...world,
          user_email: `user-${world.created_by.slice(0, 8)}@example.com`, // Placeholder
          user_full_name: undefined,
          character_count: world.characters?.[0]?.count || 0,
          region_count: world.regions?.[0]?.count || 0,
          event_count: world.timeline_events?.[0]?.count || 0
        };
      }) || [];

      setWorlds(worldsWithDetails);
    } catch (error) {
      console.error('Error fetching worlds:', error);
      toast.error('Failed to load worlds');
      setWorlds([]);
    }
  };

  const toggleUserStatus = async (userId: string, makeAdmin: boolean) => {
    try {
      if (!supabase) {
        throw new Error('Database connection not available');
      }

      const { error } = await supabase
        .from('user_roles')
        .upsert({ 
          id: userId, 
          is_admin: makeAdmin 
        });

      if (error) throw error;
      
      await fetchUsers(); // Refresh data
      toast.success(`User ${makeAdmin ? 'promoted to admin' : 'removed from admin'} successfully!`);
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