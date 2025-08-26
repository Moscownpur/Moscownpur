import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { World } from '../types';
import toast from 'react-hot-toast';

export const useWorlds = () => {
  const [worlds, setWorlds] = useState<World[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const mapDbWorldToUi = (row: any): World => {
    const settings = row.settings || {};
    return {
      id: row.world_id,
      name: row.name,
      type: settings.type || 'Universe',
      description: settings.description || '',
      creation_myth: settings.creation_myth || '',
      governing_laws: settings.governing_laws || {
        time: 'Linear',
        magic: 'Enabled',
        death: 'Permanent',
        technology_level: ''
      },
      dominant_species: settings.dominant_species || [],
      visual_style: settings.visual_style || '',
      theme: settings.theme || 'mystical',
      created_by: row.user_id,
      created_at: row.created_at,
      updated_at: row.created_at
    } as World;
  };

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
        .select('world_id, user_id, name, settings, timeline_mode, created_at')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setWorlds((data || []).map(mapDbWorldToUi));
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

      const settings = {
        type: worldData.type,
        description: worldData.description,
        creation_myth: worldData.creation_myth,
        governing_laws: worldData.governing_laws,
        dominant_species: worldData.dominant_species,
        visual_style: worldData.visual_style,
        theme: worldData.theme,
      };

      const { data, error } = await supabase
        .from('worlds')
        .insert([{ name: worldData.name, user_id: user?.id, settings, timeline_mode: 'linear' }])
        .select('world_id, user_id, name, settings, timeline_mode, created_at')
        .single();

      if (error) throw error;
      
      setWorlds(prev => [mapDbWorldToUi(data), ...prev]);
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

      const settingsUpdate: any = {};
      if (updates.type !== undefined) settingsUpdate.type = updates.type;
      if (updates.description !== undefined) settingsUpdate.description = updates.description;
      if (updates.creation_myth !== undefined) settingsUpdate.creation_myth = updates.creation_myth;
      if (updates.governing_laws !== undefined) settingsUpdate.governing_laws = updates.governing_laws as any;
      if (updates.dominant_species !== undefined) settingsUpdate.dominant_species = updates.dominant_species as any;
      if (updates.visual_style !== undefined) settingsUpdate.visual_style = updates.visual_style;
      if (updates.theme !== undefined) settingsUpdate.theme = updates.theme;

      const { data, error } = await supabase
        .from('worlds')
        .update({
          name: updates.name,
          settings: Object.keys(settingsUpdate).length ? settingsUpdate : undefined,
        })
        .eq('world_id', id)
        .eq('user_id', user?.id)
        .select('world_id, user_id, name, settings, timeline_mode, created_at')
        .single();

      if (error) throw error;
      
      setWorlds(prev => prev.map(w => w.id === id ? mapDbWorldToUi(data) : w));
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
        .eq('world_id', id)
        .eq('user_id', user?.id);

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