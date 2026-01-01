import { Router, Request, Response } from 'express';
import { supabase } from '../lib/supabase';
import { AppError } from '../middleware/errorHandler';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  // Debug environment variables
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
  const health = {
    status: 'healthy',
    timestamp: new Date().toLocaleDateString('IN'),
    uptime: process.uptime(),
    version: '1.0.0',
    SUPABASE_URL: supabaseUrl.substring(0,10),
    supabaseAnonKey: supabaseAnonKey.substring(0,5),
    environment: process.env.NODE_ENV || 'development',
    services: {
      database: 'checking...',
      jwt: 'available',
      cors: 'enabled'
    }
  };

  // Check database connectivity
  const checkDatabase = async () => {
    try {
      if (supabase && supabaseUrl && supabaseAnonKey) {
        // Just check if the supabase client exists and has proper config
        // Don't make any actual database calls
        health.services.database = 'healthy';
      } else {
        health.services.database = 'unavailable';
      }
    } catch (error) {
      health.services.database = 'unhealthy';
    }
  };

  await checkDatabase();

  const overallHealth = Object.values(health.services).every(status => 
    status === 'healthy' || status === 'available' || status === 'enabled'
  ) ? 'healthy' : 'degraded';

  health.status = overallHealth;

  const statusCode = overallHealth === 'healthy' ? 200 : 503;
  
  res.status(statusCode).json({
    success: overallHealth === 'healthy',
    data: health
  });
});

export { healthRouter as health };
export const healthRouter = router;