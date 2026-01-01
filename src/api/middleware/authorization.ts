import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth';

interface ResourceOwnershipParams {
  resourceId: string;
  resourceType: 'world' | 'chapter' | 'character' | 'event' | 'scene' | 'dialogue';
}

export const authorizeResourceOwnership = (resourceType: string) => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required',
          code: 'AUTH_REQUIRED'
        });
      }

      const resourceId = req.params.id;
      if (!resourceId) {
        return res.status(400).json({
          success: false,
          error: 'Resource ID required',
          code: 'RESOURCE_ID_REQUIRED'
        });
      }

      // Skip ownership check for admin users
      if (req.user.is_admin) {
        return next();
      }

      // Check if user owns the resource
      const hasOwnership = await checkResourceOwnership(
        req.user.id,
        resourceId,
        resourceType
      );

      if (!hasOwnership) {
        return res.status(403).json({
          success: false,
          error: 'Access denied - you do not own this resource',
          code: 'ACCESS_DENIED'
        });
      }

      next();
    } catch (error) {
      console.error('Authorization error:', error);
      return res.status(500).json({
        success: false,
        error: 'Authorization error',
        code: 'AUTHORIZATION_ERROR'
      });
    }
  };
};

async function checkResourceOwnership(
  userId: string,
  resourceId: string,
  resourceType: string
): Promise<boolean> {
  try {
      // Import Supabase here to avoid circular dependencies
      const { supabase } = await import('../lib/supabase');
    
    if (!supabase) {
      return false;
    }

    let tableName: string;
    let userIdColumn: string;

    switch (resourceType) {
      case 'world':
        tableName = 'worlds';
        userIdColumn = 'user_id';
        break;
      case 'chapter':
        tableName = 'chapters';
        userIdColumn = 'user_id';
        break;
      case 'character':
        tableName = 'characters';
        userIdColumn = 'user_id';
        break;
      case 'event':
        tableName = 'events';
        userIdColumn = 'user_id';
        break;
      case 'scene':
        tableName = 'scenes';
        userIdColumn = 'user_id';
        break;
      case 'dialogue':
        tableName = 'dialogues';
        userIdColumn = 'user_id';
        break;
      default:
        return false;
    }

    const { data, error } = await supabase
      .from(tableName)
      .select('user_id')
      .eq('id', resourceId)
      .single();

    if (error || !data) {
      return false;
    }

    return data.user_id === userId;
  } catch (error) {
    console.error('Error checking resource ownership:', error);
    return false;
  }
}

export const requireAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required',
      code: 'AUTH_REQUIRED'
    });
  }

  if (!req.user.is_admin) {
    return res.status(403).json({
      success: false,
      error: 'Admin access required',
      code: 'ADMIN_REQUIRED'
    });
  }

  next();
};