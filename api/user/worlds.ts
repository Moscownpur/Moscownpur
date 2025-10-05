import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase, authenticateUser } from '../_utils/supabase';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Authenticate user
  const user = await authenticateUser(req);
  if (!user) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'No valid authorization header'
    });
  }

  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('worlds')
        .select('*')
        .eq('user_id', user.id)
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
  } else if (req.method === 'POST') {
    try {
      const worldData = {
        ...req.body,
        user_id: user.id,
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
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
