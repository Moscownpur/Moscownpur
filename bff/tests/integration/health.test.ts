import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import request from 'supertest';
import { app } from '../../src/app';
import jwt from 'jsonwebtoken';
import { serverConfig } from '../../src/config/env';

describe('Health Endpoint', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock supabase health check
    const { supabase } = require('../../src/lib/supabase');
    const mockFrom = jest.fn().mockReturnValue({
      select: jest.fn().mockReturnValue({
        limit: jest.fn().mockResolvedValue({
          data: [],
          error: null
        })
      })
    });
    supabase.from = mockFrom;
  });

  describe('GET /api/health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBeDefined();
      expect(response.body.data.timestamp).toBeDefined();
      expect(response.body.data.uptime).toBeDefined();
      expect(response.body.data.version).toBeDefined();
      expect(response.body.data.environment).toBeDefined();
      expect(response.body.data.services).toBeDefined();
    });

    it('should include service status', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.body.data.services).toHaveProperty('database');
      expect(response.body.data.services).toHaveProperty('jwt');
      expect(response.body.data.services).toHaveProperty('cors');
    });

    it('should return correct environment info', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.body.data.environment).toBe('test');
      expect(response.body.data.services.jwt).toBe('available');
      expect(response.body.data.services.cors).toBe('enabled');
    });
  });
});