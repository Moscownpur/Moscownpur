import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Chapter } from '../types';
import toast from 'react-hot-toast';

export const useChapters = (worldId?: string) => {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchChapters = async () => {
    try {
      if (!supabase) {
        setChapters([]);
        setLoading(false);
        return;
      }
      
      let query = supabase
        .from('chapters')
        .select('chapter_id, world_id, title, chapter_order, template_type, status, timeline_version, created_at, updated_at');

      if (worldId) {
        // Verify the world belongs to the user before fetching chapters
        const { data: worldCheck, error: worldError } = await supabase
          .from('worlds')
          .select('world_id')
          .eq('world_id', worldId)
          .eq('user_id', user?.id)
          .single();
        
        if (worldError || !worldCheck) {
          console.error('World not found or access denied');
          setChapters([]);
          setLoading(false);
          return;
        }
        
        query = query.eq('world_id', worldId);
      } else {
        // If no worldId specified, only fetch chapters from user's worlds
        query = supabase
          .from('chapters')
          .select(`
            chapter_id, 
            world_id, 
            title, 
            chapter_order, 
            template_type, 
            status, 
            timeline_version, 
            created_at, 
            updated_at,
            worlds!inner(user_id)
          `)
          .eq('worlds.user_id', user?.id);
      }

      const { data, error } = await query.order('chapter_order', { ascending: true });

      if (error) throw error;
      
      // Map database fields to UI fields
      const mappedChapters = (data || []).map(chapter => ({
        id: chapter.chapter_id,
        world_id: chapter.world_id,
        title: chapter.title,
        description: '', // Default empty description
        order_index: chapter.chapter_order,
        template_type: chapter.template_type,
        status: chapter.status,
        timeline_version: chapter.timeline_version,
        created_at: chapter.created_at,
        updated_at: chapter.updated_at
      }));
      
      setChapters(mappedChapters);
    } catch (error) {
      console.error('Error fetching chapters:', error);
      toast.error('Failed to load chapters');
    } finally {
      setLoading(false);
    }
  };

  const createChapter = async (chapterData: Omit<Chapter, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      if (!supabase) {
        throw new Error('Database connection not available');
      }

      const { data, error } = await supabase
        .from('chapters')
        .insert([{
          world_id: chapterData.world_id,
          title: chapterData.title,
          chapter_order: chapterData.order_index || chapters.length + 1,
          template_type: chapterData.template_type,
          status: chapterData.status || 'draft',
          timeline_version: chapterData.timeline_version || 1
        }])
        .select('chapter_id, world_id, title, chapter_order, template_type, status, timeline_version, created_at, updated_at')
        .single();

      if (error) throw error;
      
      const mappedChapter = {
        id: data.chapter_id,
        world_id: data.world_id,
        title: data.title,
        description: '', // Default empty description
        order_index: data.chapter_order,
        template_type: data.template_type,
        status: data.status,
        timeline_version: data.timeline_version,
        created_at: data.created_at,
        updated_at: data.updated_at
      };
      
      setChapters(prev => [...prev, mappedChapter]);
      toast.success('Chapter created successfully! 📖');
      return mappedChapter;
    } catch (error) {
      console.error('Error creating chapter:', error);
      toast.error('Failed to create chapter');
      throw error;
    }
  };

  const updateChapter = async (id: string, updates: Partial<Chapter>) => {
    try {
      if (!supabase) {
        throw new Error('Database connection not available');
      }

      const updateData: any = {};
      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.order_index !== undefined) updateData.chapter_order = updates.order_index;
      if (updates.template_type !== undefined) updateData.template_type = updates.template_type;
      if (updates.status !== undefined) updateData.status = updates.status;
      if (updates.timeline_version !== undefined) updateData.timeline_version = updates.timeline_version;

      const { data, error } = await supabase
        .from('chapters')
        .update(updateData)
        .eq('chapter_id', id)
        .select('chapter_id, world_id, title, chapter_order, template_type, status, timeline_version, created_at, updated_at')
        .single();

      if (error) throw error;
      
      const mappedChapter = {
        id: data.chapter_id,
        world_id: data.world_id,
        title: data.title,
        description: '', // Default empty description
        order_index: data.chapter_order,
        template_type: data.template_type,
        status: data.status,
        timeline_version: data.timeline_version,
        created_at: data.created_at,
        updated_at: data.updated_at
      };
      
      setChapters(prev => prev.map(chapter => chapter.id === id ? mappedChapter : chapter));
      toast.success('Chapter updated! ✨');
      return mappedChapter;
    } catch (error) {
      console.error('Error updating chapter:', error);
      toast.error('Failed to update chapter');
      throw error;
    }
  };

  const deleteChapter = async (id: string) => {
    try {
      if (!supabase) {
        throw new Error('Database connection not available');
      }
      
      const { error } = await supabase
        .from('chapters')
        .delete()
        .eq('chapter_id', id);

      if (error) throw error;
      
      setChapters(prev => prev.filter(chapter => chapter.id !== id));
      toast.success('Chapter deleted 📚');
    } catch (error) {
      console.error('Error deleting chapter:', error);
      toast.error('Failed to delete chapter');
      throw error;
    }
  };

  const reorderChapters = async (newOrder: Chapter[]) => {
    try {
      if (!supabase) {
        throw new Error('Database connection not available');
      }

      // Update chapter_order for each chapter
      const updates = newOrder.map((chapter, index) => ({
        chapter_id: chapter.id,
        chapter_order: index + 1
      }));

      // Batch update all chapters
      const { error } = await supabase
        .from('chapters')
        .upsert(updates, { onConflict: 'chapter_id' });

      if (error) throw error;
      
      setChapters(newOrder);
      toast.success('Chapter order updated! 📝');
    } catch (error) {
      console.error('Error reordering chapters:', error);
      toast.error('Failed to reorder chapters');
      throw error;
    }
  };

  const assignEventToChapter = async (eventId: string, chapterId: string | null) => {
    try {
      if (!supabase) {
        throw new Error('Database connection not available');
      }

      const { error } = await supabase
        .from('events')
        .update({ chapter_id: chapterId })
        .eq('event_id', eventId);

      if (error) throw error;
      
      toast.success(chapterId ? 'Event assigned to chapter! 📖' : 'Event unassigned from chapter');
    } catch (error) {
      console.error('Error assigning event to chapter:', error);
      toast.error('Failed to assign event to chapter');
      throw error;
    }
  };

  useEffect(() => {
    if (user) {
      fetchChapters();
    }
  }, [user, worldId]);

  return {
    chapters,
    loading,
    createChapter,
    updateChapter,
    deleteChapter,
    reorderChapters,
    assignEventToChapter,
    refetch: fetchChapters
  };
}; 