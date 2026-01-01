import { Router, Request, Response } from 'express';
import { serverConfig } from '../config/env';
import { authService } from '../lib/auth';
import { AppError } from '../middleware/errorHandler';

const router = Router();

// Login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError('Email and password are required', 400, 'MISSING_CREDENTIALS');
    }

    const user = await authService.login({ email, password });
    
    // Generate JWT token
    const jwt = await import('jsonwebtoken');
    const token = jwt.default.sign(
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
  } catch (error: any) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Login failed', 401, 'LOGIN_FAILED');
  }
});

// Signup
router.post('/signup', async (req: Request, res: Response) => {
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
  } catch (error: any) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Signup failed', 400, 'SIGNUP_FAILED');
  }
});

// Get current user
router.get('/me', async (req: Request, res: Response) => {
  try {
    // This would typically use middleware to extract token from request
    // For now, we'll return a basic response
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      throw new AppError('No token provided', 401, 'NO_TOKEN');
    }

    // Verify and decode token
    const jwt = await import('jsonwebtoken');
    const decoded = jwt.default.verify(token, serverConfig.jwtSecret) as any;
    
    // Get user data from service
    const user = await authService.getUserById(decoded.userId);
    
    if (!user) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }

    res.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        is_admin: user.is_admin,
        created_at: user.created_at
      }
    });
  } catch (error: any) {
    if (error.name === 'JsonWebTokenError') {
      throw new AppError('Invalid token', 401, 'INVALID_TOKEN');
    }
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Failed to get user', 500, 'GET_USER_FAILED');
  }
});

// Logout
router.post('/logout', async (req: Request, res: Response) => {
  try {
    await authService.logout();
    
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error: any) {
    throw new AppError('Logout failed', 500, 'LOGOUT_FAILED');
  }
});

export { authRoutes as authRouter };
export const authRoutes = router;