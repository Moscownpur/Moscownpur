import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { supabase } from '../lib/supabase';

interface Character {
  id?: string;
  name: string;
  description?: string;
  world_id: string;
  user_id: string;
  created_at?: string;
  updated_at?: string;
}

class CharacterController {
  async getCharacters(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        throw new AppError('User not authenticated', 401, 'NOT_AUTHENTICATED');
      }

      const { world_id } = req.query;

      let query = supabase
        .from('characters')
        .select('*')
        .eq('user_id', req.user.id);

      if (world_id) {
        query = query.eq('world_id', world_id);
      }

      const { data, error } = await query.order('name', { ascending: true });

      if (error) {
        throw new AppError(`Failed to fetch characters: ${error.message}`, 500, 'FETCH_CHARACTERS_ERROR');
      }

      res.json({
        success: true,
        data: data || []
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to fetch characters', 500, 'FETCH_CHARACTERS_ERROR');
    }
  }

  async createCharacter(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        throw new AppError('User not authenticated', 401, 'NOT_AUTHENTICATED');
      }

      const { name, description, world_id } = req.body;

      if (!name || !world_id) {
        throw new AppError('Name and world_id are required', 400, 'REQUIRED_FIELDS');
      }

      const character: Omit<Character, 'id' | 'created_at' | 'updated_at'> = {
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
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to create character', 500, 'CREATE_CHARACTER_ERROR');
    }
  }

  // Other methods (getCharacter, updateCharacter, deleteCharacter) would follow the same pattern
}

export default new CharacterController();