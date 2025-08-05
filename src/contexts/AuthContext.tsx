import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, AuthUser, LoginCredentials, SignupCredentials } from '../lib/auth';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: AuthUser | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (credentials: SignupCredentials) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
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
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      setLoading(true);
      const user = await authService.login(credentials);
      setUser(user);
      toast.success(`Welcome back, ${user.full_name}! ✨`);
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

  const signup = async (credentials: SignupCredentials) => {
    try {
      setLoading(true);
      const user = await authService.signup(credentials);
      setUser(user);
      toast.success(`Welcome to Moscownpur, ${user.full_name}! 🌟`);
      // Redirect to dashboard after successful signup
      window.location.href = '/dashboard';
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Signup failed';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    toast.success('Logged out successfully');
    // Redirect to landing page after logout
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      signup,
      logout,
      isAuthenticated: !!user,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};