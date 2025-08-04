import { supabase } from './supabase';
import bcrypt from 'bcryptjs';

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  full_name: string;
  created_at: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface SignupCredentials {
  username: string;
  email: string;
  password: string;
  full_name: string;
}

class AuthService {
  private currentUser: AuthUser | null = null;

  async login(credentials: LoginCredentials): Promise<AuthUser> {
    if (!supabase) {
      throw new Error('Database connection not available');
    }

    try {
      // Fetch user by username
      const { data: users, error: fetchError } = await supabase
        .from('auth_users')
        .select('*')
        .eq('username', credentials.username)
        .limit(1);

      if (fetchError) throw fetchError;
      if (!users || users.length === 0) {
        throw new Error('Invalid username or password');
      }

      const user = users[0];

      // Verify password
      const isValidPassword = await bcrypt.compare(credentials.password, user.password_hash);
      if (!isValidPassword) {
        throw new Error('Invalid username or password');
      }

      // Create auth user object (without password hash)
      const authUser: AuthUser = {
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        created_at: user.created_at
      };

      this.currentUser = authUser;
      localStorage.setItem('auth_user', JSON.stringify(authUser));
      
      return authUser;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async signup(credentials: SignupCredentials): Promise<AuthUser> {
    if (!supabase) {
      throw new Error('Database connection not available');
    }

    try {
      // Hash password
      const saltRounds = 12;
      const password_hash = await bcrypt.hash(credentials.password, saltRounds);

      // Create user
      const { data, error } = await supabase
        .from('auth_users')
        .insert([{
          username: credentials.username,
          email: credentials.email,
          password_hash,
          full_name: credentials.full_name
        }])
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          throw new Error('Username or email already exists');
        }
        throw error;
      }

      // Create auth user object (without password hash)
      const authUser: AuthUser = {
        id: data.id,
        username: data.username,
        email: data.email,
        full_name: data.full_name,
        created_at: data.created_at
      };

      this.currentUser = authUser;
      localStorage.setItem('auth_user', JSON.stringify(authUser));
      
      return authUser;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  }

  logout(): void {
    this.currentUser = null;
    localStorage.removeItem('auth_user');
  }

  getCurrentUser(): AuthUser | null {
    if (this.currentUser) {
      return this.currentUser;
    }

    // Try to restore from localStorage
    const stored = localStorage.getItem('auth_user');
    if (stored) {
      try {
        this.currentUser = JSON.parse(stored);
        return this.currentUser;
      } catch {
        localStorage.removeItem('auth_user');
      }
    }

    return null;
  }

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }
}

export const authService = new AuthService();