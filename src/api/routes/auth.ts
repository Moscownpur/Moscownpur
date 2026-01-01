import { Router } from 'express';
import authController from '../controllers/authController';

const router = Router();

// Login
router.post('/login', authController.login);

// Signup
router.post('/signup', authController.signup);

// Logout
router.post('/logout', authController.logout);

// Get current user (protected)
router.get('/me', authController.getCurrentUser);

// Refresh token
router.post('/refresh', authController.refreshToken);

export default router;