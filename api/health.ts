import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from './_utils/supabase';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const startTime = Date.now();
  let databaseStatus = 'healthy';
  let databaseError = null;

  try {
    // Test database connectivity
    const { error } = await supabase.from('profiles').select('id').limit(1);
    if (error) {
      databaseStatus = 'unhealthy';
      databaseError = error.message;
    }
  } catch (error) {
    databaseStatus = 'unhealthy';
    databaseError = error instanceof Error ? error.message : 'Unknown database error';
  }

  const uptime = (Date.now() - startTime) / 1000;
  const overallStatus = databaseStatus === 'healthy' ? 'healthy' : 'degraded';

  const response = {
    success: databaseStatus === 'healthy',
    data: {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      uptime: uptime,
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      services: {
        database: databaseStatus,
        jwt: 'available',
        cors: 'enabled'
      },
      errors: databaseError ? {
        database: databaseError
      } : null
    }
  };

  res.status(databaseStatus === 'healthy' ? 200 : 503).json(response);
}
