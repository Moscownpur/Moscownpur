import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Scene } from '../types';
import toast from 'react-hot-toast';

export const useScenes = (eventId?: string) => {
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchScenes = async () => {
    try {
      if (!supabase) {
        setScenes([]);
        setLoading(false);
        return;
      }

      let query = supabase
        .from('scenes')
        .select('scene_id, event_id, title, narration, background_image_url, transitions, cultural_tags, validation_status, created_at, updated_at');

      if (eventId) {
        query = query.eq('event_id', eventId);
      }

      const { data, error } = await query.order('created_at', { ascending: true });

      if (error) throw error;

      // Map database fields to UI fields
      const mappedScenes = (data || []).map(scene => ({
        id: scene.scene_id,
        title: scene.title || 'Untitled Scene',
        description: scene.narration || '',
        dialogue: '',
        event_id: scene.event_id,
        region_id: null,
        world_id: '',
        scene_order: 0,
        ai_image_prompt: scene.background_image_url || '',
        created_by: user?.id || '',
        created_at: scene.created_at,
        updated_at: scene.updated_at
      }));

      setScenes(mappedScenes);
    } catch (error) {
      console.error('Error fetching scenes:', error);
      toast.error('Failed to load scenes');
    } finally {
      setLoading(false);
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
          event_id: sceneData.event_id,
          title: sceneData.title || 'Untitled Scene',
          narration: sceneData.description,
          background_image_url: sceneData.ai_image_prompt,
          transitions: {},
          cultural_tags: [],
          validation_status: {}
        }])
        .select('scene_id, event_id, title, narration, background_image_url, transitions, cultural_tags, validation_status, created_at, updated_at')
        .single();

      if (error) throw error;

      const mappedScene = {
        id: data.scene_id,
        title: data.title || 'Untitled Scene',
        description: data.narration || '',
        dialogue: '',
        event_id: data.event_id,
        region_id: null,
        world_id: sceneData.world_id,
        scene_order: 0,
        ai_image_prompt: data.background_image_url || '',
        created_by: user?.id || '',
        created_at: data.created_at,
        updated_at: data.updated_at
      };

      setScenes(prev => [...prev, mappedScene]);
      toast.success('Scene created successfully! 🎬');
      return mappedScene;
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

      const updateData: any = {};
      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.description !== undefined) updateData.narration = updates.description;
      if (updates.ai_image_prompt !== undefined) updateData.background_image_url = updates.ai_image_prompt;

      const { data, error } = await supabase
        .from('scenes')
        .update(updateData)
        .eq('scene_id', id)
        .select('scene_id, event_id, title, narration, background_image_url, transitions, cultural_tags, validation_status, created_at, updated_at')
        .single();

      if (error) throw error;

      const mappedScene = {
        id: data.scene_id,
        title: data.title || 'Untitled Scene',
        description: data.narration || '',
        dialogue: '',
        event_id: data.event_id,
        region_id: null,
        world_id: '',
        scene_order: 0,
        ai_image_prompt: data.background_image_url || '',
        created_by: user?.id || '',
        created_at: data.created_at,
        updated_at: data.updated_at
      };

      setScenes(prev => prev.map(scene => scene.id === id ? mappedScene : scene));
      toast.success('Scene updated! ✨');
      return mappedScene;
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
        .eq('scene_id', id);

      if (error) throw error;

      setScenes(prev => prev.filter(scene => scene.id !== id));
      toast.success('Scene deleted 🗑️');
    } catch (error) {
      console.error('Error deleting scene:', error);
      toast.error('Failed to delete scene');
      throw error;
    }
  };

  useEffect(() => {
    if (user) {
      fetchScenes();
    }
  }, [user, eventId]);

  return {
    scenes,
    loading,
    createScene,
    updateScene,
    deleteScene,
    refetch: fetchScenes
  };
};
