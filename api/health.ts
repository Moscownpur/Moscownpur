import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Moscowvitz BFF API'
  });
}
