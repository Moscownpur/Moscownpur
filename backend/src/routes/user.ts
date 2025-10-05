import { Router } from 'express';
import { supabase } from '../index';
import { authenticateUser, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// Apply authentication to all user routes
router.use(authenticateUser);

// Get user's dashboard data (optimized single query)
router.get('/dashboard-data', async (req: AuthenticatedRequest, res): Promise<void> => {
  try {
    const userId = req.user!.id;

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
      .eq('user_id', userId)
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
});

// Get user's worlds
router.get('/worlds', async (req: AuthenticatedRequest, res): Promise<void> => {
  try {
    const userId = req.user!.id;

    const { data, error } = await supabase
      .from('worlds')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({
      success: true,
      data: data || []
    });
  } catch (error) {
    console.error('Worlds fetch error:', error);
    res.status(500).json({
      error: 'Failed to fetch worlds',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get complete world data (with all related entities)
router.get('/worlds/:worldId/complete', async (req: AuthenticatedRequest, res): Promise<void> => {
  try {
    const { worldId } = req.params;
    const userId = req.user!.id;

    // Verify user owns this world
    const { data: worldCheck, error: worldError } = await supabase
      .from('worlds')
      .select('world_id')
      .eq('world_id', worldId)
      .eq('user_id', userId)
      .single();

    if (worldError || !worldCheck) {
      res.status(404).json({
        error: 'World not found',
        message: 'World not found or access denied'
      });
      return;
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
});

// Create new world
router.post('/worlds', async (req: AuthenticatedRequest, res): Promise<void> => {
  try {
    const userId = req.user!.id;
    const worldData = {
      ...req.body,
      user_id: userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('worlds')
      .insert(worldData)
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      data: data
    });
  } catch (error) {
    console.error('World creation error:', error);
    res.status(500).json({
      error: 'Failed to create world',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
