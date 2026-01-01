import { supabase } from '../lib/supabase';

export interface AuthUser {
  id: string;
  email: string;
  full_name?: string;
  created_at: string;
  is_admin?: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  email: string;
  password: string;
  full_name?: string;
}

export interface SignupResult {
  success: boolean;
  message: string;
  requiresConfirmation?: boolean;
}

class AuthService {
  private currentUser: AuthUser | null = null;

  async login(credentials: LoginCredentials): Promise<AuthUser> {
    if (!supabase) {
      throw new Error('Database connection not available');
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) throw error;
      if (!data.user) {
        throw new Error('Login failed');
      }

      // Get user role information
      const { data: userRole, error: roleError } = await supabase
        .from('user_roles')
        .select('is_admin')
        .eq('user_id', data.user.id)
        .single();

      if (roleError && roleError.code !== 'PGRST116') {
        console.warn('Could not fetch user role:', roleError);
      }

      const authUser: AuthUser = {
        id: data.user.id,
        email: data.user.email!,
        full_name: data.user.user_metadata?.full_name,
        created_at: data.user.created_at,
        is_admin: userRole?.is_admin || false
      };

      this.currentUser = authUser;
      
      return authUser;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async signup(credentials: SignupCredentials): Promise<SignupResult> {
    if (!supabase) {
      throw new Error('Database connection not available');
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            full_name: credentials.full_name
          }
        }
      });

      if (error) throw error;
      if (!data.user) {
        throw new Error('Signup failed');
      }

      return {
        success: true,
        message: 'Please check your email to confirm your account before signing in.',
        requiresConfirmation: true
      };
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    if (!supabase) {
      throw new Error('Database connection not available');
    }

    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.currentUser = null;
    }
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    if (!supabase) {
      return null;
    }

    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error || !user) {
        this.currentUser = null;
        return null;
      }

      // Get user role information
      const { data: userRole, error: roleError } = await supabase
        .from('user_roles')
        .select('is_admin')
        .eq('user_id', user.id)
        .single();

      if (roleError && roleError.code !== 'PGRST116') {
        console.warn('Could not fetch user role:', roleError);
      }

      const authUser: AuthUser = {
        id: user.id,
        email: user.email!,
        full_name: user.user_metadata?.full_name,
        created_at: user.created_at,
        is_admin: userRole?.is_admin || false
      };

      this.currentUser = authUser;
      
      return authUser;
    } catch (error) {
      console.error('Get current user error:', error);
      this.currentUser = null;
      return null;
    }
  }

  async getUserById(userId: string): Promise<AuthUser | null> {
    if (!supabase) {
      return null;
    }

    try {
      const { data: user, error } = await supabase.auth.admin.getUserById(userId);
      
      if (error || !user.user) {
        return null;
      }

      // Get user role information
      const { data: userRole, error: roleError } = await supabase
        .from('user_roles')
        .select('is_admin')
        .eq('user_id', userId)
        .single();

      if (roleError && roleError.code !== 'PGRST116') {
        console.warn('Could not fetch user role:', roleError);
      }

      const authUser: AuthUser = {
        id: user.user.id,
        email: user.user.email!,
        full_name: user.user.user_metadata?.full_name,
        created_at: user.user.created_at,
        is_admin: userRole?.is_admin || false
      };

      return authUser;
    } catch (error) {
      console.error('Get user by ID error:', error);
      return null;
    }
  }
}

export const authService = new AuthService();