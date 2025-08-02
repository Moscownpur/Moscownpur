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
        // Mock data for demo mode
        const mockUsers: UserStatistics[] = [
          {
            id: '1',
            username: 'alice_writer',
            email: 'alice@example.com',
            full_name: 'Alice Johnson',
            created_at: '2024-01-15T10:30:00Z',
            is_admin: false,
            world_count: 3,
            character_count: 12,
            region_count: 8,
            event_count: 25
          },
          {
            id: '2',
            username: 'bob_creator',
            email: 'bob@example.com',
            full_name: 'Bob Smith',
            created_at: '2024-01-20T14:20:00Z',
            is_admin: false,
            world_count: 2,
            character_count: 8,
            region_count: 5,
            event_count: 18
          },
          {
            id: '3',
            username: 'carol_dm',
            email: 'carol@example.com',
            full_name: 'Carol Davis',
            created_at: '2024-02-01T09:15:00Z',
            is_admin: false,
            world_count: 5,
            character_count: 20,
            region_count: 15,
            event_count: 42
          }
        ];
        setUsers(mockUsers);
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
        // Mock data for demo mode
        const mockWorlds: WorldWithDetails[] = [
          {
            id: '1',
            name: 'Aethermoor',
            type: 'Magical Realm',
            description: 'A mystical realm where magic flows through crystalline formations',
            created_by: '1',
            created_at: '2024-01-15T10:30:00Z',
            user_name: 'alice_writer',
            character_count: 5,
            region_count: 3,
            event_count: 12
          },
          {
            id: '2',
            name: 'Neo-Tokyo 2387',
            type: 'Timeline Variant',
            description: 'A cyberpunk metropolis where neon lights pierce through perpetual rain',
            created_by: '2',
            created_at: '2024-01-20T14:20:00Z',
            user_name: 'bob_creator',
            character_count: 4,
            region_count: 2,
            event_count: 8
          },
          {
            id: '3',
            name: 'Dragonspire Kingdoms',
            type: 'Universe',
            description: 'An epic fantasy universe with warring kingdoms and ancient dragons',
            created_by: '3',
            created_at: '2024-02-01T09:15:00Z',
            user_name: 'carol_dm',
            character_count: 8,
            region_count: 6,
            event_count: 20
          }
        ];
        setWorlds(mockWorlds);
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
        // Mock toggle for demo mode
        setUsers(prev => prev.map(user => 
          user.id === userId 
            ? { ...user, is_admin: !user.is_admin }
            : user
        ));
        toast.success(`User ${isActive ? 'activated' : 'deactivated'} successfully! (Demo Mode)`);
        return;
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
        // Mock deletion for demo mode
        setWorlds(prev => prev.filter(w => w.id !== worldId));
        toast.success('World deleted successfully! (Demo Mode)');
        return;
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