import { supabase } from './supabase';

export interface AdminUser {
  id: string;
  email: string;
  full_name?: string;
  is_admin: boolean;
  created_at: string;
}

export interface AdminLoginCredentials {
  email: string;
  password: string;
}

class AdminAuthService {
  private currentAdmin: AdminUser | null = null;

  async login(credentials: AdminLoginCredentials): Promise<AdminUser> {
    if (!supabase) {
      throw new Error('Database connection not available');
    }

    try {
      // First, authenticate with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) throw error;
      if (!data.user) {
        throw new Error('Login failed');
      }

      // Check if user is an admin
      const { data: userRole, error: roleError } = await supabase
        .from('user_roles')
        .select('is_admin')
        .eq('user_id', data.user.id)
        .single();

      if (roleError) {
        throw new Error('Could not verify admin status');
      }

      if (!userRole?.is_admin) {
        // Sign out the user since they're not an admin
        await supabase.auth.signOut();
        throw new Error('Access denied. Admin privileges required.');
      }

      const adminUser: AdminUser = {
        id: data.user.id,
        email: data.user.email!,
        full_name: data.user.user_metadata?.full_name,
        is_admin: userRole.is_admin,
        created_at: data.user.created_at
      };

      this.currentAdmin = adminUser;
      localStorage.setItem('admin_user', JSON.stringify(adminUser));
      
      return adminUser;
    } catch (error) {
      console.error('Admin login error:', error);
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
      console.error('Admin logout error:', error);
    } finally {
      this.currentAdmin = null;
      localStorage.removeItem('admin_user');
    }
  }

  async getCurrentAdmin(): Promise<AdminUser | null> {
    if (!supabase) {
      return null;
    }

    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error || !user) {
        this.currentAdmin = null;
        localStorage.removeItem('admin_user');
        return null;
      }

      // Check if user is an admin
      const { data: userRole, error: roleError } = await supabase
        .from('user_roles')
        .select('is_admin')
        .eq('user_id', user.id)
        .single();

      if (roleError || !userRole?.is_admin) {
        this.currentAdmin = null;
        localStorage.removeItem('admin_user');
        return null;
      }

      const adminUser: AdminUser = {
        id: user.id,
        email: user.email!,
        full_name: user.user_metadata?.full_name,
        is_admin: userRole.is_admin,
        created_at: user.created_at
      };

      this.currentAdmin = adminUser;
      localStorage.setItem('admin_user', JSON.stringify(adminUser));
      
      return adminUser;
    } catch (error) {
      console.error('Get current admin error:', error);
      this.currentAdmin = null;
      localStorage.removeItem('admin_user');
      return null;
    }
  }

  async isAuthenticated(): Promise<boolean> {
    const admin = await this.getCurrentAdmin();
    return admin !== null;
  }

  async isAdmin(): Promise<boolean> {
    const admin = await this.getCurrentAdmin();
    return admin?.is_admin || false;
  }
}

export const adminAuthService = new AdminAuthService();