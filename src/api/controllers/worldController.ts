import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { supabase } from '../lib/supabase';

interface World {
  id?: string;
  name: string;
  description?: string;
  user_id: string;
  created_at?: string;
  updated_at?: string;
}

class WorldController {
  async getWorlds(req: AuthenticatedRequest, res: Response) {
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
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to fetch worlds', 500, 'FETCH_WORLDS_ERROR');
    }
  }

  async getWorld(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        throw new AppError('User not authenticated', 401, 'NOT_AUTHENTICATED');
      }

      const { id } = req.params;

      const { data, error } = await supabase
        .from('worlds')
        .select('*')
        .eq('id', id)
        .eq('user_id', req.user.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          throw new AppError('World not found', 404, 'WORLD_NOT_FOUND');
        }
        throw new AppError(`Failed to fetch world: ${error.message}`, 500, 'FETCH_WORLD_ERROR');
      }

      res.json({
        success: true,
        data
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to fetch world', 500, 'FETCH_WORLD_ERROR');
    }
  }

  async createWorld(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        throw new AppError('User not authenticated', 401, 'NOT_AUTHENTICATED');
      }

      const { name, description } = req.body;

      if (!name) {
        throw new AppError('World name is required', 400, 'NAME_REQUIRED');
      }

      const world: Omit<World, 'id' | 'created_at' | 'updated_at'> = {
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
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to create world', 500, 'CREATE_WORLD_ERROR');
    }
  }

  async updateWorld(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        throw new AppError('User not authenticated', 401, 'NOT_AUTHENTICATED');
      }

      const { id } = req.params;
      const { name, description } = req.body;

      if (!name) {
        throw new AppError('World name is required', 400, 'NAME_REQUIRED');
      }

      const { data, error } = await supabase
        .from('worlds')
        .update({ name, description, updated_at: new Date().toISOString() })
        .eq('id', id)
        .eq('user_id', req.user.id)
        .select()
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          throw new AppError('World not found', 404, 'WORLD_NOT_FOUND');
        }
        throw new AppError(`Failed to update world: ${error.message}`, 500, 'UPDATE_WORLD_ERROR');
      }

      res.json({
        success: true,
        data
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to update world', 500, 'UPDATE_WORLD_ERROR');
    }
  }

  async deleteWorld(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        throw new AppError('User not authenticated', 401, 'NOT_AUTHENTICATED');
      }

      const { id } = req.params;

      const { error } = await supabase
        .from('worlds')
        .delete()
        .eq('id', id)
        .eq('user_id', req.user.id);

      if (error) {
        throw new AppError(`Failed to delete world: ${error.message}`, 500, 'DELETE_WORLD_ERROR');
      }

      res.json({
        success: true,
        message: 'World deleted successfully'
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to delete world', 500, 'DELETE_WORLD_ERROR');
    }
  }
}

export default new WorldController();