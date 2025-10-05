import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.json({
    message: 'Moscowvitz BFF API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      user: {
        'dashboard-data': '/api/user/dashboard-data',
        'worlds': '/api/user/worlds',
        'worlds-complete': '/api/user/worlds/[worldId]/complete'
      },
      admin: {
        'users': '/api/admin/users',
        'analytics': '/api/admin/analytics'
      }
    },
    documentation: {
      authentication: 'All endpoints require Bearer token in Authorization header',
      user_endpoints: 'Require user authentication',
      admin_endpoints: 'Require admin role'
    }
  });
}
