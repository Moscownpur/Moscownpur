import { Router, Request, Response } from 'express';
import { supabase } from '../lib/supabase';
import { AppError } from '../middleware/errorHandler';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

const router = Router();

router.get('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      throw new AppError('User not authenticated', 401, 'NOT_AUTHENTICATED');
    }

    const { chapter_id } = req.query;

    if (!chapter_id) {
      throw new AppError('chapter_id is required', 400, 'CHAPTER_ID_REQUIRED');
    }

    const { data, error } = await supabase
      .from('scenes')
      .select('*')
      .eq('user_id', req.user.id)
      .eq('chapter_id', chapter_id)
      .order('created_at', { ascending: false });

    if (error) {
      throw new AppError(`Failed to fetch scenes: ${error.message}`, 500, 'FETCH_SCENES_ERROR');
    }

    res.json({
      success: true,
      data: data || []
    });
  } catch (error: any) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Failed to fetch scenes', 500, 'FETCH_SCENES_ERROR');
  }
});

router.post('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      throw new AppError('User not authenticated', 401, 'NOT_AUTHENTICATED');
    }

    const { name, description, chapter_id } = req.body;

    if (!name || !chapter_id) {
      throw new AppError('Scene name and chapter_id are required', 400, 'NAME_AND_CHAPTER_ID_REQUIRED');
    }

    const scene = {
      name,
      description,
      chapter_id,
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
  } catch (error: any) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Failed to create scene', 500, 'CREATE_SCENE_ERROR');
  }
});

export { router as sceneRouter };
