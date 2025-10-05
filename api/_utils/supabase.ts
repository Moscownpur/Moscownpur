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

// Helper to authenticate user from Supabase session
export const authenticateUser = async (req: any): Promise<AuthenticatedRequest['user'] | null> => {
  try {
    // Get session from Authorization header (Bearer token)
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);
    
    // Verify the session with Supabase
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error || !session) {
      // Try to get user directly with the token
      const { data: { user }, error: userError } = await supabase.auth.getUser(token);
      
      if (userError || !user) {
        return null;
      }

      return {
        id: user.id,
        email: user.email || '',
        role: user.user_metadata?.role || 'user'
      };
    }

    if (!session.user) {
      return null;
    }

    return {
      id: session.user.id,
      email: session.user.email || '',
      role: session.user.user_metadata?.role || 'user'
    };
  } catch (error) {
    console.error('Auth error:', error);
    return null;
  }
};
