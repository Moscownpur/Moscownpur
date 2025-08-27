import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { TimelineEvent } from '../types';
import toast from 'react-hot-toast';

export const useEvents = (chapterId?: string) => {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchEvents = async () => {
    try {
      if (!supabase) {
        setEvents([]);
        setLoading(false);
        return;
      }

      let query = supabase
        .from('events')
        .select('event_id, chapter_id, story_time, title, context, timeline_version, created_at, updated_at');

      if (chapterId) {
        query = query.eq('chapter_id', chapterId);
      }

      const { data, error } = await query.order('story_time', { ascending: true });

      if (error) throw error;

      // Map database fields to UI fields
      const mappedEvents = (data || []).map(event => ({
        id: event.event_id,
        title: event.title,
        date: event.story_time || '',
        era: event.context?.era || '',
        location: event.context?.location || '',
        involved_characters: event.context?.involved_characters || [],
        description: event.context?.description || '',
        type: event.context?.type || 'Encounter' as const,
        consequences: event.context?.consequences || '',
        world_id: '',
        chapter_id: event.chapter_id,
        created_by: user?.id || '',
        created_at: event.created_at,
        updated_at: event.updated_at
      }));

      setEvents(mappedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const createEvent = async (eventData: Omit<TimelineEvent, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      if (!supabase) {
        throw new Error('Database connection not available');
      }

      const context = {
        description: eventData.description,
        type: eventData.type,
        consequences: eventData.consequences,
        era: eventData.era,
        location: eventData.location,
        involved_characters: eventData.involved_characters
      };

      // Use current timestamp if no date is provided
      const storyTime = eventData.date ? eventData.date : new Date().toISOString();

      const { data, error } = await supabase
        .from('events')
        .insert([{
          chapter_id: eventData.chapter_id,
          story_time: storyTime,
          title: eventData.title,
          context,
          timeline_version: 1
        }])
        .select('event_id, chapter_id, story_time, title, context, timeline_version, created_at, updated_at')
        .single();

      if (error) throw error;

      const mappedEvent = {
        id: data.event_id,
        title: data.title,
        date: data.story_time || '',
        era: data.context?.era || '',
        location: data.context?.location || '',
        involved_characters: data.context?.involved_characters || [],
        description: data.context?.description || '',
        type: data.context?.type || 'Encounter' as const,
        consequences: data.context?.consequences || '',
        world_id: eventData.world_id,
        chapter_id: data.chapter_id,
        created_by: user?.id || '',
        created_at: data.created_at,
        updated_at: data.updated_at
      };

      setEvents(prev => [...prev, mappedEvent]);
      toast.success('Event created successfully! ⏰');
      return mappedEvent;
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error('Failed to create event');
      throw error;
    }
  };

  const updateEvent = async (id: string, updates: Partial<TimelineEvent>) => {
    try {
      if (!supabase) {
        throw new Error('Database connection not available');
      }

      const updateData: any = {};
      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.date !== undefined) {
        // Use current timestamp if no date is provided
        updateData.story_time = updates.date ? updates.date : new Date().toISOString();
      }
      if (updates.chapter_id !== undefined) updateData.chapter_id = updates.chapter_id;

      // Update context if any context fields are provided
      if (updates.description !== undefined || updates.type !== undefined || updates.consequences !== undefined || 
          updates.era !== undefined || updates.location !== undefined || updates.involved_characters !== undefined) {
        updateData.context = {
          description: updates.description,
          type: updates.type,
          consequences: updates.consequences,
          era: updates.era,
          location: updates.location,
          involved_characters: updates.involved_characters
        };
      }

      const { data, error } = await supabase
        .from('events')
        .update(updateData)
        .eq('event_id', id)
        .select('event_id, chapter_id, story_time, title, context, timeline_version, created_at, updated_at')
        .single();

      if (error) throw error;

      const mappedEvent = {
        id: data.event_id,
        title: data.title,
        date: data.story_time || '',
        era: data.context?.era || '',
        location: data.context?.location || '',
        involved_characters: data.context?.involved_characters || [],
        description: data.context?.description || '',
        type: data.context?.type || 'Encounter' as const,
        consequences: data.context?.consequences || '',
        world_id: '',
        chapter_id: data.chapter_id,
        created_by: user?.id || '',
        created_at: data.created_at,
        updated_at: data.updated_at
      };

      setEvents(prev => prev.map(event => event.id === id ? mappedEvent : event));
      toast.success('Event updated! ✨');
      return mappedEvent;
    } catch (error) {
      console.error('Error updating event:', error);
      toast.error('Failed to update event');
      throw error;
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      if (!supabase) {
        throw new Error('Database connection not available');
      }

      const { error } = await supabase
        .from('events')
        .delete()
        .eq('event_id', id);

      if (error) throw error;

      setEvents(prev => prev.filter(event => event.id !== id));
      toast.success('Event deleted 🗑️');
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Failed to delete event');
      throw error;
    }
  };

  useEffect(() => {
    if (user) {
      fetchEvents();
    }
  }, [user, chapterId]);

  return {
    events,
    loading,
    createEvent,
    updateEvent,
    deleteEvent,
    refetch: fetchEvents
  };
};
