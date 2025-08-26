import React, { createContext, useContext, useState, useEffect } from 'react';
import { adminAuthService, AdminUser, AdminLoginCredentials } from '../lib/adminAuth';
import toast from 'react-hot-toast';

interface AdminAuthContextType {
  admin: AdminUser | null;
  login: (credentials: AdminLoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing admin session on mount
    const checkAdminAuth = async () => {
      try {
        const currentAdmin = await adminAuthService.getCurrentAdmin();
        setAdmin(currentAdmin);
      } catch (error) {
        console.error('Admin auth check error:', error);
        setAdmin(null);
      } finally {
        setLoading(false);
      }
    };

    checkAdminAuth();
  }, []);

  const login = async (credentials: AdminLoginCredentials) => {
    try {
      setLoading(true);
      const admin = await adminAuthService.login(credentials);
      setAdmin(admin);
      toast.success(`Welcome back, ${admin.full_name || admin.email}! 🔐`);
      // Redirect to admin dashboard after successful login
      window.location.href = '/admin/dashboard';
    } catch (error) {
      console.error('Admin login error details:', error);
      const message = error instanceof Error ? error.message : 'Admin login failed';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await adminAuthService.logout();
      setAdmin(null);
      toast.success('Admin logged out successfully');
      // Redirect to admin login page after logout
      window.location.href = '/admin/login';
    } catch (error) {
      console.error('Admin logout error:', error);
      toast.error('Admin logout failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminAuthContext.Provider value={{
      admin,
      login,
      logout,
      isAuthenticated: !!admin,
      isAdmin: admin?.is_admin || false,
      loading
    }}>
      {children}
    </AdminAuthContext.Provider>
  );
};