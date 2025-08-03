import { supabase } from './supabase';
import bcrypt from 'bcryptjs';

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  full_name: string;
  role: 'admin' | 'super_admin';
  is_active: boolean;
  created_at: string;
}

export interface AdminLoginCredentials {
  username: string;
  password: string;
}

class AdminAuthService {
  private currentAdmin: AdminUser | null = null;

  async login(credentials: AdminLoginCredentials): Promise<AdminUser> {
    if (!supabase) {
      throw new Error('Database connection not available');
    }

    try {
      // Fetch admin by username
      const { data: admins, error: fetchError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('username', credentials.username)
        .eq('is_active', true)
        .limit(1);

      if (fetchError) throw fetchError;
      if (!admins || admins.length === 0) {
        throw new Error('Invalid admin credentials');
      }

      const admin = admins[0];

      // Verify password
      const isValidPassword = await bcrypt.compare(credentials.password, admin.password_hash);
      if (!isValidPassword) {
        throw new Error('Invalid admin credentials');
      }

      // Create admin user object (without password hash)
      const adminUser: AdminUser = {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        full_name: admin.full_name,
        role: admin.role,
        is_active: admin.is_active,
        created_at: admin.created_at
      };

      this.currentAdmin = adminUser;
      localStorage.setItem('admin_user', JSON.stringify(adminUser));
      
      return adminUser;
    } catch (error) {
      console.error('Admin login error:', error);
      throw error;
    }
  }

  logout(): void {
    this.currentAdmin = null;
    localStorage.removeItem('admin_user');
  }

  getCurrentAdmin(): AdminUser | null {
    if (this.currentAdmin) {
      return this.currentAdmin;
    }

    // Try to restore from localStorage
    const stored = localStorage.getItem('admin_user');
    if (stored) {
      try {
        this.currentAdmin = JSON.parse(stored);
        return this.currentAdmin;
      } catch {
        localStorage.removeItem('admin_user');
      }
    }

    return null;
  }

  isAuthenticated(): boolean {
    return this.getCurrentAdmin() !== null;
  }
}

export const adminAuthService = new AdminAuthService();