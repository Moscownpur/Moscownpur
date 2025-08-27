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

      // Fetch events from the events table
      let query = supabase
        .from('events')
        .select('event_id, chapter_id, story_time, title, context, timeline_version, created_at, updated_at');

      if (worldId) {
        // We need to join with chapters to filter by world_id
        query = supabase
          .from('events')
          .select(`
            event_id, 
            chapter_id, 
            story_time, 
            title, 
            context, 
            timeline_version, 
            created_at, 
            updated_at,
            chapters!inner(world_id)
          `)
          .eq('chapters.world_id', worldId);
      }

      const { data, error } = await query.order('story_time', { ascending: true });

      if (error) throw error;

      // Map database fields to UI fields
      const mappedEvents = (data || []).map(event => ({
        id: event.event_id,
        title: event.title,
        date: event.story_time,
        era: '',
        location: '',
        involved_characters: [],
        description: '',
        type: 'Encounter' as const,
        consequences: '',
        world_id: worldId || '',
        chapter_id: event.chapter_id,
        created_by: user?.id || '',
        created_at: event.created_at,
        updated_at: event.updated_at,
        scene_count: 0,
        scenes: []
      }));

      setEvents(mappedEvents);
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
        .select('scene_id, event_id, narration, background_image_url, transitions, cultural_tags, validation_status, created_at, updated_at');

      if (eventId) {
        query = query.eq('event_id', eventId);
      } else if (worldId) {
        // We need to join with events and chapters to filter by world_id
        query = supabase
          .from('scenes')
          .select(`
            scene_id, 
            event_id, 
            narration, 
            background_image_url, 
            transitions, 
            cultural_tags, 
            validation_status, 
            created_at, 
            updated_at,
            events!inner(
              chapters!inner(world_id)
            )
          `)
          .eq('events.chapters.world_id', worldId);
      }

      const { data, error } = await query.order('created_at', { ascending: true });

      if (error) throw error;

      // Map database fields to UI fields
      const mappedScenes = (data || []).map(scene => ({
        id: scene.scene_id,
        title: scene.narration?.substring(0, 50) + '...' || 'Untitled Scene',
        description: scene.narration || '',
        dialogue: '',
        event_id: scene.event_id,
        region_id: null,
        world_id: worldId || '',
        scene_order: 0,
        ai_image_prompt: '',
        created_by: user?.id || '',
        created_at: scene.created_at,
        updated_at: scene.updated_at
      }));

      setScenes(mappedScenes);
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
          event_id: sceneData.event_id,
          narration: sceneData.description,
          background_image_url: sceneData.ai_image_prompt,
          transitions: {},
          cultural_tags: [],
          validation_status: {}
        }])
        .select('scene_id, event_id, narration, background_image_url, transitions, cultural_tags, validation_status, created_at, updated_at')
        .single();

      if (error) throw error;

      const mappedScene = {
        id: data.scene_id,
        title: data.narration?.substring(0, 50) + '...' || 'Untitled Scene',
        description: data.narration || '',
        dialogue: '',
        event_id: data.event_id,
        region_id: null,
        world_id: worldId || '',
        scene_order: 0,
        ai_image_prompt: data.background_image_url || '',
        created_by: user?.id || '',
        created_at: data.created_at,
        updated_at: data.updated_at
      };

      await fetchScenes();
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
      if (updates.description !== undefined) updateData.narration = updates.description;
      if (updates.ai_image_prompt !== undefined) updateData.background_image_url = updates.ai_image_prompt;

      const { data, error } = await supabase
        .from('scenes')
        .update(updateData)
        .eq('scene_id', id)
        .select('scene_id, event_id, narration, background_image_url, transitions, cultural_tags, validation_status, created_at, updated_at')
        .single();

      if (error) throw error;

      const mappedScene = {
        id: data.scene_id,
        title: data.narration?.substring(0, 50) + '...' || 'Untitled Scene',
        description: data.narration || '',
        dialogue: '',
        event_id: data.event_id,
        region_id: null,
        world_id: worldId || '',
        scene_order: 0,
        ai_image_prompt: data.background_image_url || '',
        created_by: user?.id || '',
        created_at: data.created_at,
        updated_at: data.updated_at
      };

      await fetchScenes();
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

      // Note: scene_characters table doesn't exist in new schema
      // This functionality might need to be handled differently
      toast.info('Character scene assignment not implemented in new schema');
      return null;
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

      // Note: scene_characters table doesn't exist in new schema
      toast.info('Character scene removal not implemented in new schema');
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