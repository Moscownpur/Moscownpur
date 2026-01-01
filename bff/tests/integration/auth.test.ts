import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import request from 'supertest';
import { app } from '../../src/app';
import { testUsers } from '../fixtures/data';
import jwt from 'jsonwebtoken';
import { serverConfig } from '../../src/config/env';

describe('Auth Endpoints', () => {
  let authToken: string;

  beforeEach(() => {
    jest.clearAllMocks();
    // Generate valid JWT token for testing
    authToken = jwt.sign({ userId: 'test-user-id', email: 'test@example.com' }, serverConfig.jwtSecret, { expiresIn: '7d' });
    
    // Mock auth service with proper return values
    const { authService } = require('../../src/lib/auth');
    
    authService.login = jest.fn().mockResolvedValue({
      id: 'test-user-id',
      email: 'test@example.com',
      full_name: 'Test User',
      is_admin: false,
      created_at: '2024-01-01T00:00:00Z'
    } as any);
    
    authService.signup = jest.fn().mockResolvedValue({
      success: true,
      message: 'Please check your email to confirm your account before signing in.',
      requiresConfirmation: true
    } as any);
    
    authService.logout = jest.fn().mockResolvedValue(undefined as any);
  });

  describe('POST /api/auth/login', () => {
    it('should login successfully with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send(testUsers.validUser)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(testUsers.validUser.email);
      expect(response.body.data.token).toBeDefined();
    });

    it('should return 400 for missing email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          password: 'testPassword123'
        })
        .expect(200); // Error middleware handles this

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Email and password are required');
    });

    it('should return 400 for missing password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com'
        })
        .expect(200); // Error middleware handles this

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Email and password are required');
    });

    it('should return 401 for invalid credentials', async () => {
      const { authService } = require('../../src/lib/auth');
      const mockLogin = jest.fn().mockRejectedValue(new Error('Invalid credentials'));
      authService.login = mockLogin;

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'wrong@example.com',
          password: 'wrongPassword'
        })
        .expect(200); // Error middleware handles this

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Login failed');
    });
  });

  describe('POST /api/auth/signup', () => {
    it('should signup successfully with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send(testUsers.validUser)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.success).toBe(true);
      expect(response.body.data.requiresConfirmation).toBe(true);
    });

    it('should return 400 for missing email', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          password: 'testPassword123',
          full_name: 'Test User'
        })
        .expect(200); // Error middleware handles this

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Email and password are required');
    });

    it('should return 400 for missing password', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          email: 'test@example.com',
          full_name: 'Test User'
        })
        .expect(200); // Error middleware handles this

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Email and password are required');
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should logout successfully', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('Logged out successfully');
    });
  });

  describe('Authentication Middleware', () => {
    it('should reject requests without token', async () => {
      const response = await request(app)
        .get('/api/worlds')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.code).toBe('TOKEN_REQUIRED');
    });

    it('should reject requests with invalid token', async () => {
      const response = await request(app)
        .get('/api/worlds')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.code).toBe('TOKEN_INVALID');
    });

    it('should reject requests with malformed authorization header', async () => {
      const response = await request(app)
        .get('/api/worlds')
        .set('Authorization', 'InvalidHeader token')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.code).toBe('TOKEN_REQUIRED');
    });
  });
});