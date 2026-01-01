import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { supabase } from '../lib/supabase';

interface Dialogue {
  id?: string;
  title: string;
  content?: string;
  scene_id?: string;
  character_id?: string;
  dialogue_type?: 'dialogue' | 'narration';
  order_in_scene?: number;
  user_id: string;
  created_at?: string;
  updated_at?: string;
}

class DialogueController {
  async getDialogues(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        throw new AppError('User not authenticated', 401, 'NOT_AUTHENTICATED');
      }

      const { scene_id, character_id } = req.query;

      let query = supabase
        .from('dialogues')
        .select('*')
        .eq('user_id', req.user.id);

      if (scene_id) {
        query = query.eq('scene_id', scene_id);
      }
      if (character_id) {
        query = query.eq('character_id', character_id);
      }

      const { data, error } = await query.order('order_in_scene', { ascending: true });

      if (error) {
        throw new AppError(`Failed to fetch dialogues: ${error.message}`, 500, 'FETCH_DIALOGUES_ERROR');
      }

      res.json({
        success: true,
        data: data || []
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to fetch dialogues', 500, 'FETCH_DIALOGUES_ERROR');
    }
  }

  async createDialogue(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        throw new AppError('User not authenticated', 401, 'NOT_AUTHENTICATED');
      }

      const { title, content, scene_id, character_id, dialogue_type, order_in_scene } = req.body;

      if (!title) {
        throw new AppError('Title is required', 400, 'TITLE_REQUIRED');
      }

      const dialogue: Omit<Dialogue, 'id' | 'created_at' | 'updated_at'> = {
        title,
        content,
        scene_id,
        character_id,
        dialogue_type: dialogue_type || 'dialogue',
        order_in_scene: order_in_scene || 1,
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
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to create dialogue', 500, 'CREATE_DIALOGUE_ERROR');
    }
  }

  // Other methods would follow the same pattern
}

export default new DialogueController();