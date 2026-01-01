import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import LoadingSpinner from './LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const [supabaseAuthenticated, setSupabaseAuthenticated] = useState(false);
  const [checkingSupabase, setCheckingSupabase] = useState(true);

  useEffect(() => {
    const checkSupabaseAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSupabaseAuthenticated(!!session);
      } catch (error) {
        setSupabaseAuthenticated(false);
      } finally {
        setCheckingSupabase(false);
      }
    };

    checkSupabaseAuth();
  }, []);

  // Show loading spinner while checking authentication
  if (loading || checkingSupabase) {
    return <LoadingSpinner />;
  }

  // Check both authentication systems
  const isAuth = isAuthenticated || supabaseAuthenticated;

  // If not authenticated, redirect to home page with login
  if (!isAuth) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // If authenticated, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
