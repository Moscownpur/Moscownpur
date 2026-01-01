import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { supabase } from '../lib/supabase';

interface Scene {
  id?: string;
  title: string;
  description?: string;
  chapter_id?: string;
  scene_order?: number;
  user_id: string;
  created_at?: string;
  updated_at?: string;
}

class SceneController {
  async getScenes(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        throw new AppError('User not authenticated', 401, 'NOT_AUTHENTICATED');
      }

      const { chapter_id } = req.query;

      let query = supabase
        .from('scenes')
        .select('*')
        .eq('user_id', req.user.id);

      if (chapter_id) {
        query = query.eq('chapter_id', chapter_id);
      }

      const { data, error } = await query.order('scene_order', { ascending: true });

      if (error) {
        throw new AppError(`Failed to fetch scenes: ${error.message}`, 500, 'FETCH_SCENES_ERROR');
      }

      res.json({
        success: true,
        data: data || []
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to fetch scenes', 500, 'FETCH_SCENES_ERROR');
    }
  }

  async createScene(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        throw new AppError('User not authenticated', 401, 'NOT_AUTHENTICATED');
      }

      const { title, description, chapter_id, scene_order } = req.body;

      if (!title) {
        throw new AppError('Title is required', 400, 'TITLE_REQUIRED');
      }

      const scene: Omit<Scene, 'id' | 'created_at' | 'updated_at'> = {
        title,
        description,
        chapter_id,
        scene_order: scene_order || 1,
        user_id: req.user.id
      };

      const { data, error } = await supabase
        .from('scenes')
        .insert(scene)
        .select()
        .single();

      if (error) {
        throw new AppError(`Failed to create scene: ${error.message}`, 500, 'CREATE_SCENE_ERROR');
      }

      res.status(201).json({
        success: true,
        data
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to create scene', 500, 'CREATE_SCENE_ERROR');
    }
  }

  // Other methods would follow the same pattern
}

export default new SceneController();