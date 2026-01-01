import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { supabase } from '../lib/supabase';

interface Chapter {
  id?: string;
  title: string;
  description?: string;
  world_id: string;
  user_id: string;
  chapter_number?: number;
  created_at?: string;
  updated_at?: string;
}

class ChapterController {
  async getChapters(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        throw new AppError('User not authenticated', 401, 'NOT_AUTHENTICATED');
      }

      const { world_id } = req.query;

      let query = supabase
        .from('chapters')
        .select('*')
        .eq('user_id', req.user.id);

      if (world_id) {
        query = query.eq('world_id', world_id);
      }

      const { data, error } = await query.order('chapter_number', { ascending: true });

      if (error) {
        throw new AppError(`Failed to fetch chapters: ${error.message}`, 500, 'FETCH_CHAPTERS_ERROR');
      }

      res.json({
        success: true,
        data: data || []
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to fetch chapters', 500, 'FETCH_CHAPTERS_ERROR');
    }
  }

  async getChapter(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        throw new AppError('User not authenticated', 401, 'NOT_AUTHENTICATED');
      }

      const { id } = req.params;

      const { data, error } = await supabase
        .from('chapters')
        .select('*')
        .eq('id', id)
        .eq('user_id', req.user.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          throw new AppError('Chapter not found', 404, 'CHAPTER_NOT_FOUND');
        }
        throw new AppError(`Failed to fetch chapter: ${error.message}`, 500, 'FETCH_CHAPTER_ERROR');
      }

      res.json({
        success: true,
        data
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to fetch chapter', 500, 'FETCH_CHAPTER_ERROR');
    }
  }

  async createChapter(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        throw new AppError('User not authenticated', 401, 'NOT_AUTHENTICATED');
      }

      const { title, description, world_id, chapter_number } = req.body;

      if (!title || !world_id) {
        throw new AppError('Title and world_id are required', 400, 'REQUIRED_FIELDS');
      }

      const chapter: Omit<Chapter, 'id' | 'created_at' | 'updated_at'> = {
        title,
        description,
        world_id,
        user_id: req.user.id,
        chapter_number: chapter_number || 1
      };

      const { data, error } = await supabase
        .from('chapters')
        .insert(chapter)
        .select()
        .single();

      if (error) {
        throw new AppError(`Failed to create chapter: ${error.message}`, 500, 'CREATE_CHAPTER_ERROR');
      }

      res.status(201).json({
        success: true,
        data
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to create chapter', 500, 'CREATE_CHAPTER_ERROR');
    }
  }

  async updateChapter(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        throw new AppError('User not authenticated', 401, 'NOT_AUTHENTICATED');
      }

      const { id } = req.params;
      const { title, description, chapter_number } = req.body;

      if (!title) {
        throw new AppError('Title is required', 400, 'TITLE_REQUIRED');
      }

      const { data, error } = await supabase
        .from('chapters')
        .update({ 
          title, 
          description, 
          chapter_number, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', id)
        .eq('user_id', req.user.id)
        .select()
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          throw new AppError('Chapter not found', 404, 'CHAPTER_NOT_FOUND');
        }
        throw new AppError(`Failed to update chapter: ${error.message}`, 500, 'UPDATE_CHAPTER_ERROR');
      }

      res.json({
        success: true,
        data
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to update chapter', 500, 'UPDATE_CHAPTER_ERROR');
    }
  }

  async deleteChapter(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        throw new AppError('User not authenticated', 401, 'NOT_AUTHENTICATED');
      }

      const { id } = req.params;

      const { error } = await supabase
        .from('chapters')
        .delete()
        .eq('id', id)
        .eq('user_id', req.user.id);

      if (error) {
        throw new AppError(`Failed to delete chapter: ${error.message}`, 500, 'DELETE_CHAPTER_ERROR');
      }

      res.json({
        success: true,
        message: 'Chapter deleted successfully'
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to delete chapter', 500, 'DELETE_CHAPTER_ERROR');
    }
  }
}

export default new ChapterController();