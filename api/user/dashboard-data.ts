import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  console.error('Available env vars:', Object.keys(process.env).filter(k => k.includes('SUPABASE')));
  console.error('SUPABASE_URL:', !!supabaseUrl);
  console.error('SUPABASE_ANON_KEY:', !!supabaseKey);
}

// Create Supabase client only if we have the required variables
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check if Supabase is configured
    if (!supabase) {
      return res.status(500).json({
        error: 'Server Configuration Error',
        message: 'Supabase not configured. Please check environment variables.'
      });
    }

    // Get authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'No valid authorization header'
      });
    }

    const token = authHeader.substring(7);
    
    // Verify the token with Supabase
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid or expired token'
      });
    }

    console.log('Authenticated user:', user.id, user.email);

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
      .eq('user_id', user.id)
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
}
