import { Request, Response } from 'express';
import { supabase } from '../index';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role?: string;
    resourceUserIdField?: string;
  };
}

// Middleware to authenticate users via Supabase JWT
export const authenticateUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: () => void
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'No valid authorization header'
      });
      return;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    // Verify the JWT token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid or expired token'
      });
      return;
    }

    // Add user info to request
    req.user = {
      id: user.id,
      email: user.email || '',
      role: user.user_metadata?.role || 'user'
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({
      error: 'Authentication Error',
      message: 'Failed to authenticate user'
    });
  }
};

// Middleware to check admin role
export const requireAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: () => void
): void => {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json({
      error: 'Forbidden',
      message: 'Admin access required'
    });
    return;
  }
  next();
};

// Middleware to validate user owns resource
export const validateUserOwnership = (resourceUserIdField: string = 'user_id') => {
  return (req: AuthenticatedRequest, res: Response, next: () => void): void => {
    if (!req.user) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'User not authenticated'
      });
      return;
    }

    // This will be used in route handlers to check ownership
    req.user = { ...req.user, resourceUserIdField };
    next();
  };
};
