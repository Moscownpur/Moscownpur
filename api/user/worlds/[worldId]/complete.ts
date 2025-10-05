import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase, authenticateUser } from '../../../_utils/supabase';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Authenticate user
    const user = await authenticateUser(req);
    if (!user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'No valid authorization header'
      });
    }

    const { worldId } = req.query;

    if (!worldId || typeof worldId !== 'string') {
      return res.status(400).json({
        error: 'Invalid world ID',
        message: 'World ID is required'
      });
    }

    // Verify user owns this world
    const { data: worldCheck, error: worldError } = await supabase
      .from('worlds')
      .select('world_id')
      .eq('world_id', worldId)
      .eq('user_id', user.id)
      .single();

    if (worldError || !worldCheck) {
      return res.status(404).json({
        error: 'World not found',
        message: 'World not found or access denied'
      });
    }

    // Get complete world data
    const { data, error } = await supabase
      .from('worlds')
      .select(`
        *,
        chapters(
          *,
          events(
            *,
            scenes(
              *,
              dialogues(*)
            )
          )
        ),
        characters(*)
      `)
      .eq('world_id', worldId)
      .single();

    if (error) throw error;

    res.json({
      success: true,
      data: data
    });
  } catch (error) {
    console.error('Complete world data error:', error);
    res.status(500).json({
      error: 'Failed to fetch complete world data',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
