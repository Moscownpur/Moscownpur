import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.json({
    message: 'Moscowvitz BFF API',
    version: '1.0.0',
    status: 'Live',
    baseUrl: 'https://www.moscownpur.in',
    endpoints: {
      public: {
        health: {
          url: '/api/health',
          method: 'GET',
          description: 'Health check endpoint',
          auth: false
        },
        test: {
          url: '/api/test',
          method: 'GET', 
          description: 'Test endpoint for basic functionality',
          auth: false
        }
      },
      authenticated: {
        'dashboard-data': {
          url: '/api/user/dashboard-data',
          method: 'GET',
          description: 'Optimized dashboard data with worlds, chapters, characters',
          auth: true,
          requires: 'Bearer token in Authorization header'
        }
      }
    },
    authentication: {
      type: 'Bearer Token',
      header: 'Authorization: Bearer YOUR_JWT_TOKEN',
      note: 'Get token from Supabase session in your React app'
    },
    examples: {
      health_check: 'curl https://www.moscownpur.in/api/health',
      authenticated_request: 'curl -H "Authorization: Bearer YOUR_TOKEN" https://www.moscownpur.in/api/user/dashboard-data'
    },
    documentation: {
      readme: '/api/README.md',
      github: 'https://github.com/Moscownpur/Moscownpur',
      support: 'Check Vercel logs for debugging'
    }
  });
}

