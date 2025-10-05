import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface AuthenticatedRequest {
  user?: {
    id: string;
    email: string;
    role?: string;
  };
}

// Helper to authenticate user from request
export const authenticateUser = async (req: any): Promise<AuthenticatedRequest['user'] | null> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email || '',
      role: user.user_metadata?.role || 'user'
    };
  } catch (error) {
    console.error('Auth error:', error);
    return null;
  }
};
