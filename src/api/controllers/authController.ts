import { Request, Response } from 'express';
import { authService } from '../lib/auth';
import { AppError } from '../middleware/errorHandler';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest } from '../middleware/auth';

class AuthController {
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new AppError('Email and password are required', 400, 'MISSING_CREDENTIALS');
      }

      const user = await authService.login({ email, password });
      
      // Import config to get JWT secret
      const { serverConfig } = await import('../config/env');
      
      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        serverConfig.jwtSecret,
        { expiresIn: '7d' }
      );

      res.json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            full_name: user.full_name,
            is_admin: user.is_admin,
            created_at: user.created_at
          },
          token
        }
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Login failed', 401, 'LOGIN_FAILED');
    }
  }

  async signup(req: Request, res: Response) {
    try {
      const { email, password, full_name } = req.body;

      if (!email || !password) {
        throw new AppError('Email and password are required', 400, 'MISSING_CREDENTIALS');
      }

      const result = await authService.signup({ email, password, full_name });

      res.status(201).json({
        success: true,
        data: result
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Signup failed', 400, 'SIGNUP_FAILED');
    }
  }

  async logout(req: Request, res: Response) {
    try {
      await authService.logout();
      
      res.json({
        success: true,
        message: 'Logged out successfully'
      });
    } catch (error) {
      throw new AppError('Logout failed', 500, 'LOGOUT_FAILED');
    }
  }

  async getCurrentUser(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        throw new AppError('Not authenticated', 401, 'NOT_AUTHENTICATED');
      }

      const user = await authService.getCurrentUser();

      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to get current user', 500, 'GET_USER_FAILED');
    }
  }

  async refreshToken(req: Request, res: Response) {
    try {
      const { token } = req.body;

      if (!token) {
        throw new AppError('Token is required', 400, 'TOKEN_REQUIRED');
      }

      // Import config to get JWT secret
      const { serverConfig } = await import('../config/env');
      
      const decoded = jwt.verify(token, serverConfig.jwtSecret) as any;
      
      // Get fresh user data
      const user = await authService.getCurrentUser();
      
      if (!user || user.id !== decoded.userId) {
        throw new AppError('Invalid token', 401, 'TOKEN_INVALID');
      }

      // Generate new token
      const newToken = jwt.sign(
        { userId: user.id, email: user.email },
        serverConfig.jwtSecret,
        { expiresIn: '7d' }
      );

      res.json({
        success: true,
        data: {
          token: newToken,
          user: {
            id: user.id,
            email: user.email,
            full_name: user.full_name,
            is_admin: user.is_admin,
            created_at: user.created_at
          }
        }
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Token refresh failed', 401, 'TOKEN_REFRESH_FAILED');
    }
  }
}

export default new AuthController();