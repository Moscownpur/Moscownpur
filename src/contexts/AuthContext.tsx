import React, { createContext, useContext, useState, useEffect } from 'react';
import { bffClient, User, SignupResult } from '../lib/bffClient';
import toast from 'react-hot-toast';

interface LoginCredentials {
  email: string;
  password: string;
}

interface SignupCredentials {
  email: string;
  password: string;
  full_name?: string;
}

interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (credentials: SignupCredentials) => Promise<SignupResult>;
  logout: () => Promise<void>;
  validateToken: () => Promise<boolean>;
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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Only set up the token if it exists, but don't validate immediately
    const token = localStorage.getItem('auth_token');
    if (token) {
      bffClient.setToken(token);
    }
    setInitialized(true);
  }, []);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      setLoading(true);
      
      const response = await bffClient.login(credentials.email, credentials.password);
      
      if (response.success && response.data?.token) {
        bffClient.setToken(response.data.token);
        setUser(response.data.user);
        localStorage.setItem('auth_token', response.data.token);
        toast.success(`Welcome back, ${response.data.user.full_name || response.data.user.email}!`);
      }
    } catch (error: any) {
      const message = error.response?.data?.error || error.message || 'Login failed';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (credentials: SignupCredentials): Promise<SignupResult> => {
    try {
      setLoading(true);
      
      const response = await bffClient.signup(credentials.email, credentials.password, credentials.full_name);
      
      if (response.success) {
        toast.success('Please check your email to confirm your account.');
      }
      
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.error || error.message || 'Signup failed';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const validateToken = async (): Promise<boolean> => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      return false;
    }

    try {
      setLoading(true);
      const response = await bffClient.getCurrentUser();
      if (response.success && response.data) {
        setUser(response.data);
        return true;
      } else {
        localStorage.removeItem('auth_token');
        bffClient.setToken(null);
        setUser(null);
        return false;
      }
    } catch (error) {
      console.error('Token validation error:', error);
      localStorage.removeItem('auth_token');
      bffClient.setToken(null);
      setUser(null);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setLoading(true);
      
      await bffClient.logout();
      setUser(null);
      localStorage.removeItem('auth_token');
      bffClient.setToken(null);
      
      toast.success('Logged out successfully');
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error('Logout failed');
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    login,
    signup,
    logout,
    validateToken,
    isAuthenticated: !!user,
    isAdmin: user?.is_admin || false,
    loading: loading || !initialized
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};