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
      .from('worlds')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      throw new AppError(`Failed to fetch worlds: ${error.message}`, 500, 'FETCH_WORLDS_ERROR');
    }

    res.json({
      success: true,
      data: data || []
    });
  } catch (error: any) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Failed to fetch worlds', 500, 'FETCH_WORLDS_ERROR');
  }
});

router.post('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      throw new AppError('User not authenticated', 401, 'NOT_AUTHENTICATED');
    }

    const { name, description } = req.body;

    if (!name) {
      throw new AppError('World name is required', 400, 'NAME_REQUIRED');
    }

    const world = {
      name,
      description,
      user_id: req.user.id
    };

    const { data, error } = await supabase
      .from('worlds')
      .insert(world)
      .select()
      .single();

    if (error) {
      throw new AppError(`Failed to create world: ${error.message}`, 500, 'CREATE_WORLD_ERROR');
    }

    res.status(201).json({
      success: true,
      data
    });
  } catch (error: any) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Failed to create world', 500, 'CREATE_WORLD_ERROR');
  }
});

export { worldRouter as worlds };
export const worldRouter = router;