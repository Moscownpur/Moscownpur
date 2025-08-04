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
        .select('*');

      if (worldId) {
        query = query.eq('world_id', worldId);
      } else {
        query = query.eq('created_by', user?.id);
      }

      const { data, error } = await query.order('order_index', { ascending: true });

      if (error) throw error;
      setChapters(data || []);
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
          ...chapterData,
          created_by: user?.id,
          order_index: chapterData.order_index || chapters.length + 1
        }])
        .select()
        .single();

      if (error) throw error;
      
      setChapters(prev => [...prev, data]);
      toast.success('Chapter created successfully! 📖');
      return data;
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

      const { data, error } = await supabase
        .from('chapters')
        .update(updates)
        .eq('id', id)
        .eq('created_by', user?.id)
        .select()
        .single();

      if (error) throw error;
      
      setChapters(prev => prev.map(chapter => chapter.id === id ? data : chapter));
      toast.success('Chapter updated! ✨');
      return data;
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
        .eq('id', id)
        .eq('created_by', user?.id);

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

      // Update order_index for each chapter
      const updates = newOrder.map((chapter, index) => ({
        id: chapter.id,
        order_index: index + 1
      }));

      // Batch update all chapters
      const { error } = await supabase
        .from('chapters')
        .upsert(updates, { onConflict: 'id' });

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
        .from('timeline_events')
        .update({ chapter_id: chapterId })
        .eq('id', eventId)
        .eq('created_by', user?.id);

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