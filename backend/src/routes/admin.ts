import { Router } from 'express';
import { supabase } from '../index';
import { authenticateUser, requireAdmin, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// Apply authentication and admin role to all admin routes
router.use(authenticateUser);
router.use(requireAdmin);

// Get all users
router.get('/users', async (req: AuthenticatedRequest, res): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({
      success: true,
      data: data || []
    });
  } catch (error) {
    console.error('Users fetch error:', error);
    res.status(500).json({
      error: 'Failed to fetch users',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get analytics data
router.get('/analytics', async (req: AuthenticatedRequest, res): Promise<void> => {
  try {
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
});

export default router;

