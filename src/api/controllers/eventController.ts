import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { supabase } from '../lib/supabase';

interface Event {
  id?: string;
  title: string;
  description?: string;
  world_id?: string;
  chapter_id?: string;
  timeline_order?: number;
  user_id: string;
  created_at?: string;
  updated_at?: string;
}

class EventController {
  async getEvents(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        throw new AppError('User not authenticated', 401, 'NOT_AUTHENTICATED');
      }

      const { world_id, chapter_id } = req.query;

      let query = supabase
        .from('events')
        .select('*')
        .eq('user_id', req.user.id);

      if (world_id) {
        query = query.eq('world_id', world_id);
      }
      if (chapter_id) {
        query = query.eq('chapter_id', chapter_id);
      }

      const { data, error } = await query.order('timeline_order', { ascending: true });

      if (error) {
        throw new AppError(`Failed to fetch events: ${error.message}`, 500, 'FETCH_EVENTS_ERROR');
      }

      res.json({
        success: true,
        data: data || []
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to fetch events', 500, 'FETCH_EVENTS_ERROR');
    }
  }

  async createEvent(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        throw new AppError('User not authenticated', 401, 'NOT_AUTHENTICATED');
      }

      const { title, description, world_id, chapter_id, timeline_order } = req.body;

      if (!title) {
        throw new AppError('Title is required', 400, 'TITLE_REQUIRED');
      }

      const event: Omit<Event, 'id' | 'created_at' | 'updated_at'> = {
        title,
        description,
        world_id,
        chapter_id,
        timeline_order: timeline_order || 1,
        user_id: req.user.id
      };

      const { data, error } = await supabase
        .from('events')
        .insert(event)
        .select()
        .single();

      if (error) {
        throw new AppError(`Failed to create event: ${error.message}`, 500, 'CREATE_EVENT_ERROR');
      }

      res.status(201).json({
        success: true,
        data
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to create event', 500, 'CREATE_EVENT_ERROR');
    }
  }

  // Other methods would follow the same pattern
}

export default new EventController();