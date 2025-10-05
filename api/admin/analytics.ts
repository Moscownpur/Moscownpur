import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase, authenticateUser } from '../_utils/supabase';

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

    // Check admin role
    if (user.role !== 'admin') {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Admin access required'
      });
    }

    // Get total counts
    const [
      { count: totalUsers },
      { count: totalWorlds },
      { count: totalCharacters },
      { count: totalDialogues }
    ] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('worlds').select('*', { count: 'exact', head: true }),
      supabase.from('characters').select('*', { count: 'exact', head: true }),
      supabase.from('dialogues').select('*', { count: 'exact', head: true })
    ]);

    // Get recent activity
    const { data: recentWorlds } = await supabase
      .from('worlds')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    res.json({
      success: true,
      data: {
        totals: {
          users: totalUsers || 0,
          worlds: totalWorlds || 0,
          characters: totalCharacters || 0,
          dialogues: totalDialogues || 0
        },
        recentActivity: {
          worlds: recentWorlds || []
        }
      }
    });
  } catch (error) {
    console.error('Analytics fetch error:', error);
    res.status(500).json({
      error: 'Failed to fetch analytics',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
