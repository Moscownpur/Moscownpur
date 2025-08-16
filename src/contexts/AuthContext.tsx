import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, AuthUser, LoginCredentials, SignupCredentials, SignupResult } from '../lib/auth';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: AuthUser | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (credentials: SignupCredentials) => Promise<SignupResult>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const checkAuth = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Auth check error:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Set up auth state change listener
    const unsubscribe = authService.onAuthStateChange((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => {
      if (unsubscribe) {
        unsubscribe.data.subscription.unsubscribe();
      }
    };
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      setLoading(true);
      const user = await authService.login(credentials);
      setUser(user);
      toast.success(`Welcome back, ${user.full_name || user.email}! ✨`);
      // Redirect to dashboard after successful login
      window.location.href = '/dashboard';
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (credentials: SignupCredentials): Promise<SignupResult> => {
    try {
      setLoading(true);
      const result = await authService.signup(credentials);
      
      if (result.requiresConfirmation) {
        // Show confirmation message and redirect to login
        toast.success(result.message);
        // Redirect to login page after successful signup
        window.location.href = '/login';
      } else {
        // User was automatically logged in
        setUser({
          id: 'temp', // This will be updated by the auth state change
          email: credentials.email,
          full_name: credentials.full_name,
          created_at: new Date().toISOString(),
          is_admin: false
        });
        toast.success(`Welcome to Moscownpur, ${credentials.full_name || credentials.email}! 🌟`);
        // Redirect to dashboard after successful signup
        window.location.href = '/dashboard';
      }
      
      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Signup failed';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await authService.logout();
      setUser(null);
      toast.success('Logged out successfully');
      // Redirect to landing page after logout
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      signup,
      logout,
      isAuthenticated: !!user,
      isAdmin: user?.is_admin || false,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};