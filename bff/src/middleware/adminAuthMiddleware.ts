import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './authMiddleware';

export const adminAuthMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user || !req.user.is_admin) {
    return res.status(403).json({
      success: false,
      error: 'Forbidden: Admin access required',
      code: 'ADMIN_REQUIRED'
    });
  }
  next();
};