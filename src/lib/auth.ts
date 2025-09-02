import { supabase } from './supabase';
import { User } from '@supabase/supabase-js';

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
      localStorage.setItem('auth_user', JSON.stringify(authUser));
      
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

      // Always return requiresConfirmation: true to force login after signup
      // Don't store any user data during signup
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
      localStorage.removeItem('auth_user');
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
        localStorage.removeItem('auth_user');
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
      localStorage.setItem('auth_user', JSON.stringify(authUser));
      
      return authUser;
    } catch (error) {
      console.error('Get current user error:', error);
      this.currentUser = null;
      localStorage.removeItem('auth_user');
      return null;
    }
  }

  async isAuthenticated(): Promise<boolean> {
    const user = await this.getCurrentUser();
    return user !== null;
  }

  async isAdmin(): Promise<boolean> {
    const user = await this.getCurrentUser();
    return user?.is_admin || false;
  }

  // Listen to auth state changes
  onAuthStateChange(callback: (user: AuthUser | null) => void) {
    if (!supabase) return () => {};

    return supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        // Get user role information
        const { data: userRole } = await supabase
          .from('user_roles')
          .select('is_admin')
          .eq('user_id', session.user.id)
          .single();

        const authUser: AuthUser = {
          id: session.user.id,
          email: session.user.email!,
          full_name: session.user.user_metadata?.full_name,
          created_at: session.user.created_at,
          is_admin: userRole?.is_admin || false
        };

        this.currentUser = authUser;
        localStorage.setItem('auth_user', JSON.stringify(authUser));
        callback(authUser);
      } else if (event === 'SIGNED_OUT') {
        this.currentUser = null;
        localStorage.removeItem('auth_user');
        callback(null);
      }
    });
  }
}

export const authService = new AuthService();