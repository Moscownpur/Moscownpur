import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.json({
    message: 'Test endpoint working!',
    timestamp: new Date().toISOString(),
    method: req.method,
    headers: {
      authorization: req.headers.authorization ? 'Present' : 'Missing'
    }
  });
}
