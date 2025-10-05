import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase, authenticateUser } from '../_utils/supabase';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow GET requests
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

    // Single optimized query to get all user data
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
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({
      success: true,
      data: {
        worlds: data || [],
        totalWorlds: data?.length || 0,
        totalChapters: data?.reduce((acc, world) => acc + (world.chapters?.length || 0), 0) || 0,
        totalCharacters: data?.reduce((acc, world) => acc + (world.characters?.length || 0), 0) || 0
      }
    });
  } catch (error) {
    console.error('Dashboard data error:', error);
    res.status(500).json({
      error: 'Failed to fetch dashboard data',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
