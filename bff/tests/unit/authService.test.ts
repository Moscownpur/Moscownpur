import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import jwt from 'jsonwebtoken';
import { serverConfig } from '../../src/config/env';

describe('JWT Token Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('JWT Token Generation', () => {
    it('should generate valid JWT token', () => {
      const payload = {
        userId: 'test-user-id',
        email: 'test@example.com'
      };

      const token = jwt.sign(payload, serverConfig.jwtSecret, { expiresIn: '7d' });
      
      const decoded = jwt.verify(token, serverConfig.jwtSecret) as any;
      
      expect(decoded.userId).toBe(payload.userId);
      expect(decoded.email).toBe(payload.email);
      expect(decoded.exp).toBeDefined();
    });

    it('should verify JWT token correctly', () => {
      const payload = {
        userId: 'test-user-id',
        email: 'test@example.com'
      };

      const token = jwt.sign(payload, serverConfig.jwtSecret, { expiresIn: '7d' });
      
      const decoded = jwt.verify(token, serverConfig.jwtSecret) as any;
      
      expect(decoded.userId).toBe(payload.userId);
      expect(decoded.email).toBe(payload.email);
    });

    it('should reject invalid JWT token', () => {
      const invalidToken = 'invalid.jwt.token';
      
      expect(() => {
        jwt.verify(invalidToken, serverConfig.jwtSecret);
      }).toThrow();
    });
  });
});