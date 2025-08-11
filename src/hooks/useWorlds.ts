import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { World } from '../types';
import toast from 'react-hot-toast';

export const useWorlds = () => {
  const [worlds, setWorlds] = useState<World[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchWorlds = async () => {
    try {
      if (!supabase) {
        // No Supabase connection - show empty state
        setWorlds([]);
        setLoading(false);
        return;
      }
      
      const { data, error } = await supabase
        .from('worlds')
        .select('*')
        .eq('created_by', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setWorlds(data || []);
    } catch (error) {
      console.error('Error fetching worlds:', error);
      toast.error('Failed to load worlds');
    } finally {
      setLoading(false);
    }
  };

  const createWorld = async (worldData: Omit<World, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      if (!supabase) {
        throw new Error('Database connection not available');
      }

      const { data, error } = await supabase
        .from('worlds')
        .insert([{
          ...worldData,
          created_by: user?.id,
          governing_laws: worldData.governing_laws,
          dominant_species: worldData.dominant_species
        }])
        .select()
        .single();

      if (error) throw error;
      
      setWorlds(prev => [data, ...prev]);
      toast.success('World created successfully! ✨');
      return data;
    } catch (error) {
      console.error('Error creating world:', error);
      toast.error('Failed to create world');
      throw error;
    }
  };

  const updateWorld = async (id: string, updates: Partial<World>) => {
    try {
      if (!supabase) {
        throw new Error('Database connection not available');
      }

      const { data, error } = await supabase
        .from('worlds')
        .update(updates)
        .eq('id', id)
        .eq('created_by', user?.id)
        .select()
        .single();

      if (error) throw error;
      
      setWorlds(prev => prev.map(w => w.id === id ? data : w));
      toast.success('World updated! 🌟');
      return data;
    } catch (error) {
      console.error('Error updating world:', error);
      toast.error('Failed to update world');
      throw error;
    }
  };

  const deleteWorld = async (id: string) => {
    try {
      if (!supabase) {
        throw new Error('Database connection not available');
      }
      
      const { error } = await supabase
        .from('worlds')
        .delete()
        .eq('id', id)
        .eq('created_by', user?.id);

      if (error) throw error;
      
      setWorlds(prev => prev.filter(w => w.id !== id));
      toast.success('World deleted 🗑️');
    } catch (error) {
      console.error('Error deleting world:', error);
      toast.error('Failed to delete world');
      throw error;
    }
  };

  useEffect(() => {
    if (user) {
      fetchWorlds();
    }
  }, [user]);

  return {
    worlds,
    loading,
    createWorld,
    updateWorld,
    deleteWorld,
    refetch: fetchWorlds
  };
};