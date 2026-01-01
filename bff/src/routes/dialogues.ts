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

    const { scene_id } = req.query;

    if (!scene_id) {
      throw new AppError('scene_id is required', 400, 'SCENE_ID_REQUIRED');
    }

    const { data, error } = await supabase
      .from('dialogues')
      .select('*')
      .eq('user_id', req.user.id)
      .eq('scene_id', scene_id)
      .order('created_at', { ascending: false });

    if (error) {
      throw new AppError(`Failed to fetch dialogues: ${error.message}`, 500, 'FETCH_DIALOGUES_ERROR');
    }

    res.json({
      success: true,
      data: data || []
    });
  } catch (error: any) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Failed to fetch dialogues', 500, 'FETCH_DIALOGUES_ERROR');
  }
});

router.post('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      throw new AppError('User not authenticated', 401, 'NOT_AUTHENTICATED');
    }

    const { character_id, scene_id, content } = req.body;

    if (!character_id || !scene_id || !content) {
      throw new AppError('Character ID, scene ID, and content are required', 400, 'DIALOGUE_FIELDS_REQUIRED');
    }

    const dialogue = {
      character_id,
      scene_id,
      content,
      user_id: req.user.id
    };

    const { data, error } = await supabase
      .from('dialogues')
      .insert(dialogue)
      .select()
      .single();

    if (error) {
      throw new AppError(`Failed to create dialogue: ${error.message}`, 500, 'CREATE_DIALOGUE_ERROR');
    }

    res.status(201).json({
      success: true,
      data
    });
  } catch (error: any) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Failed to create dialogue', 500, 'CREATE_DIALOGUE_ERROR');
  }
});

export { router as dialogueRouter };
