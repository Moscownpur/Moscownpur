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

    const { world_id } = req.query;

    if (!world_id) {
      throw new AppError('world_id is required', 400, 'WORLD_ID_REQUIRED');
    }

    const { data, error } = await supabase
      .from('chapters')
      .select('*')
      .eq('user_id', req.user.id)
      .eq('world_id', world_id)
      .order('created_at', { ascending: false });

    if (error) {
      throw new AppError(`Failed to fetch chapters: ${error.message}`, 500, 'FETCH_CHAPTERS_ERROR');
    }

    res.json({
      success: true,
      data: data || []
    });
  } catch (error: any) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Failed to fetch chapters', 500, 'FETCH_CHAPTERS_ERROR');
  }
});

router.post('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      throw new AppError('User not authenticated', 401, 'NOT_AUTHENTICATED');
    }

    const { name, description, world_id } = req.body;

    if (!name || !world_id) {
      throw new AppError('Chapter name and world_id are required', 400, 'NAME_AND_WORLD_ID_REQUIRED');
    }

    const chapter = {
      name,
      description,
      world_id,
      user_id: req.user.id
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
  } catch (error: any) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Failed to create chapter', 500, 'CREATE_CHAPTER_ERROR');
  }
});

export { router as chapterRouter };
