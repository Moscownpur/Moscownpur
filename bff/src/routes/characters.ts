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

    const { data, error } = await supabase
      .from('characters')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      throw new AppError(`Failed to fetch characters: ${error.message}`, 500, 'FETCH_CHARACTERS_ERROR');
    }

    res.json({
      success: true,
      data: data || []
    });
  } catch (error: any) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Failed to fetch characters', 500, 'FETCH_CHARACTERS_ERROR');
  }
});

router.post('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      throw new AppError('User not authenticated', 401, 'NOT_AUTHENTICATED');
    }

    const { name, description, world_id } = req.body;

    if (!name) {
      throw new AppError('Character name is required', 400, 'NAME_REQUIRED');
    }

    const character = {
      name,
      description,
      world_id,
      user_id: req.user.id
    };

    const { data, error } = await supabase
      .from('characters')
      .insert(character)
      .select()
      .single();

    if (error) {
      throw new AppError(`Failed to create character: ${error.message}`, 500, 'CREATE_CHARACTER_ERROR');
    }

    res.status(201).json({
      success: true,
      data
    });
  } catch (error: any) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Failed to create character', 500, 'CREATE_CHARACTER_ERROR');
  }
});

export { router as charactersRouter };
