import { Router, Request, Response } from 'express';
import { supabase } from '../lib/supabase';
import { AppError } from '../middleware/errorHandler';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0',
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
      if (supabase) {
        const { error } = await supabase.from('worlds').select('count').limit(1);
        health.services.database = error ? 'unhealthy' : 'healthy';
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