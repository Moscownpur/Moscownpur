import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { TimelineEventWithScenes, Scene, SceneCharacter } from '../types';
import toast from 'react-hot-toast';

export const useTimeline = (worldId?: string) => {
  const [events, setEvents] = useState<TimelineEventWithScenes[]>([]);
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchTimelineEvents = async () => {
    try {
      if (!supabase) {
        setEvents([]);
        setLoading(false);
        return;
      }

      let query = supabase
        .from('timeline_with_scenes')
        .select('*');

      if (worldId) {
        query = query.eq('world_id', worldId);
      } else {
        query = query.eq('created_by', user?.id);
      }

      const { data, error } = await query.order('date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching timeline events:', error);
      toast.error('Failed to load timeline events');
    } finally {
      setLoading(false);
    }
  };

  const fetchScenes = async (eventId?: string) => {
    try {
      if (!supabase) {
        setScenes([]);
        return;
      }

      let query = supabase
        .from('scenes')
        .select(`
          *,
          regions(name),
          scene_characters(
            *,
            characters(name)
          )
        `);

      if (eventId) {
        query = query.eq('event_id', eventId);
      } else if (worldId) {
        query = query.eq('world_id', worldId);
      } else {
        query = query.eq('created_by', user?.id);
      }

      const { data, error } = await query.order('scene_order', { ascending: true });

      if (error) throw error;
      setScenes(data || []);
    } catch (error) {
      console.error('Error fetching scenes:', error);
      toast.error('Failed to load scenes');
    }
  };

  const createScene = async (sceneData: Omit<Scene, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      if (!supabase) {
        throw new Error('Database connection not available');
      }

      const { data, error } = await supabase
        .from('scenes')
        .insert([{
          ...sceneData,
          created_by: user?.id
        }])
        .select()
        .single();

      if (error) throw error;
      
      await fetchScenes();
      toast.success('Scene created successfully! 🎬');
      return data;
    } catch (error) {
      console.error('Error creating scene:', error);
      toast.error('Failed to create scene');
      throw error;
    }
  };

  const updateScene = async (id: string, updates: Partial<Scene>) => {
    try {
      if (!supabase) {
        throw new Error('Database connection not available');
      }

      const { data, error } = await supabase
        .from('scenes')
        .update(updates)
        .eq('id', id)
        .eq('created_by', user?.id)
        .select()
        .single();

      if (error) throw error;
      
      await fetchScenes();
      toast.success('Scene updated! ✨');
      return data;
    } catch (error) {
      console.error('Error updating scene:', error);
      toast.error('Failed to update scene');
      throw error;
    }
  };

  const deleteScene = async (id: string) => {
    try {
      if (!supabase) {
        throw new Error('Database connection not available');
      }
      
      const { error } = await supabase
        .from('scenes')
        .delete()
        .eq('id', id)
        .eq('created_by', user?.id);

      if (error) throw error;
      
      await fetchScenes();
      toast.success('Scene deleted 🗑️');
    } catch (error) {
      console.error('Error deleting scene:', error);
      toast.error('Failed to delete scene');
      throw error;
    }
  };

  const addCharacterToScene = async (sceneId: string, characterData: Omit<SceneCharacter, 'id' | 'created_at'>) => {
    try {
      if (!supabase) {
        throw new Error('Database connection not available');
      }

      const { data, error } = await supabase
        .from('scene_characters')
        .insert([characterData])
        .select()
        .single();

      if (error) throw error;
      
      await fetchScenes();
      toast.success('Character added to scene! 👤');
      return data;
    } catch (error) {
      console.error('Error adding character to scene:', error);
      toast.error('Failed to add character to scene');
      throw error;
    }
  };

  const removeCharacterFromScene = async (sceneId: string, characterId: string) => {
    try {
      if (!supabase) {
        throw new Error('Database connection not available');
      }
      
      const { error } = await supabase
        .from('scene_characters')
        .delete()
        .eq('scene_id', sceneId)
        .eq('character_id', characterId);

      if (error) throw error;
      
      await fetchScenes();
      toast.success('Character removed from scene');
    } catch (error) {
      console.error('Error removing character from scene:', error);
      toast.error('Failed to remove character from scene');
      throw error;
    }
  };

  useEffect(() => {
    if (user) {
      fetchTimelineEvents();
      fetchScenes();
    }
  }, [user, worldId]);

  return {
    events,
    scenes,
    loading,
    createScene,
    updateScene,
    deleteScene,
    addCharacterToScene,
    removeCharacterFromScene,
    refetch: () => {
      fetchTimelineEvents();
      fetchScenes();
    }
  };
};