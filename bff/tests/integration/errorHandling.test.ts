import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import request from 'supertest';
import { app } from '../../src/app';
import { jwtPayload } from '../fixtures/data';
import jwt from 'jsonwebtoken';
import { serverConfig } from '../../src/config/env';

describe('Error Handling', () => {
  let authToken: string;

  beforeEach(() => {
    jest.clearAllMocks();
    authToken = jwt.sign(jwtPayload, serverConfig.jwtSecret, { expiresIn: '7d' });
  });

  describe('404 Not Found', () => {
    it('should return 404 for unknown route', async () => {
      const response = await request(app)
        .get('/api/unknown-endpoint')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Route not found');
      expect(response.body.path).toContain('/api/unknown-endpoint');
    });
  });

  describe('Validation Errors', () => {
    it('should handle missing required fields', async () => {
      const response = await request(app)
        .post('/api/worlds')
        .set('Authorization', `Bearer ${authToken}`)
        .send({})
        .expect(200); // Error middleware handles this

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('World name is required');
    });
  });

  describe('Authentication Errors', () => {
    it('should handle expired JWT token', async () => {
      // Create expired token
      const expiredToken = jwt.sign(
        jwtPayload, 
        serverConfig.jwtSecret, 
        { expiresIn: '-1s' } // Expired immediately
      );

      const response = await request(app)
        .get('/api/worlds')
        .set('Authorization', `Bearer ${expiredToken}`)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.code).toBe('TOKEN_EXPIRED');
    });

    it('should handle malformed JWT token', async () => {
      const response = await request(app)
        .get('/api/worlds')
        .set('Authorization', 'Bearer malformed.jwt.token')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.code).toBe('TOKEN_INVALID');
    });
  });

  describe('CORS Headers', () => {
    it('should include CORS headers', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.headers['access-control-allow-origin']).toBeDefined();
      expect(response.headers['access-control-allow-credentials']).toBeDefined();
    });
  });

  describe('Security Headers', () => {
    it('should include security headers', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.headers['x-frame-options']).toBeDefined();
      expect(response.headers['x-content-type-options']).toBeDefined();
      expect(response.headers['x-xss-protection']).toBeDefined();
    });
  });
});