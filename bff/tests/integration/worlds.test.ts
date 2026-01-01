import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import request from 'supertest';
import { app } from '../../src/app';
import { testWorlds, jwtPayload } from '../fixtures/data';
import jwt from 'jsonwebtoken';
import { serverConfig } from '../../src/config/env';
import { AuthenticatedRequest } from '../../src/middleware/authMiddleware';

describe('Worlds Endpoints', () => {
  let authToken: string;

  // Mock authMiddleware to provide a default authenticated non-admin user
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mock('../../src/middleware/authMiddleware', () => ({
      authMiddleware: jest.fn((req: AuthenticatedRequest, res, next) => {
        req.user = { id: 'test-user-id', email: 'test@example.com', is_admin: false };
        next();
      })
    }));
    // Generate valid JWT token for testing
    authToken = jwt.sign(jwtPayload, serverConfig.jwtSecret, { expiresIn: '7d' });
    
    // Reset all mock functions with proper return values
    const { supabase } = require('../../src/lib/supabase');
    
    // Mock worlds GET request
    const mockFromSelect = jest.fn().mockReturnValue({
      eq: jest.fn().mockReturnValue({
        order: jest.fn().mockResolvedValue({
          data: [
            {
              id: 'world-1',
              name: 'Test World',
              description: 'A test world',
              user_id: 'test-user-id',
              created_at: '2024-01-01T00:00:00Z'
            }
          ],
          error: null
        })
      })
    });
    
    // Mock worlds POST request
    const mockFromInsert = jest.fn().mockReturnValue({
      select: jest.fn().mockReturnValue({
        single: jest.fn().mockResolvedValue({
          data: {
            id: 'new-world-id',
            name: testWorlds.validWorld.name,
            description: testWorlds.validWorld.description,
            user_id: 'test-user-id',
            created_at: '2024-01-01T00:00:00Z'
          },
          error: null
        })
      })
    });
    
    // Mock worlds PUT request
    const mockFromUpdate = jest.fn().mockReturnValue({
      update: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            select: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: {
                  id: 'world-1',
                  name: 'Updated World',
                  description: 'Updated description',
                  user_id: 'test-user-id',
                  created_at: '2024-01-01T00:00:00Z',
                  updated_at: '2024-01-02T00:00:00Z'
                },
                error: null
              })
            })
          })
        })
      })
    });
    
    // Mock worlds DELETE request
    const mockFromDelete = jest.fn().mockReturnValue({
      delete: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({
            data: null,
            error: null
          })
        })
      })
    });
    
    // Override based on method call chain
    supabase.from = jest.fn((table: string) => {
      switch (table) {
        case 'worlds':
          return {
            select: mockFromSelect,
            insert: mockFromInsert,
            update: mockFromUpdate,
            delete: mockFromDelete,
            eq: jest.fn(),
            single: jest.fn(),
            order: jest.fn(),
            limit: jest.fn()
          };
        default:
          return {
            select: jest.fn(),
            insert: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            eq: jest.fn(),
            single: jest.fn(),
            order: jest.fn(),
            limit: jest.fn()
          };
      }
    });
  });

  describe('GET /api/worlds', () => {
    it('should fetch user worlds with valid token', async () => {
      const response = await request(app)
        .get('/api/worlds')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].name).toBe('Test World');
    });

    it('should reject request without token', async () => {
      // Temporarily unmock authMiddleware to test token absence
      jest.unmock('../../src/middleware/authMiddleware'); 
      const response = await request(app)
        .get('/api/worlds')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.code).toBe('TOKEN_REQUIRED');
    });

    it('should reject request with invalid token', async () => {
      // Temporarily unmock authMiddleware to test token invalidity
      jest.unmock('../../src/middleware/authMiddleware');
      const response = await request(app)
        .get('/api/worlds')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.code).toBe('TOKEN_INVALID');
    });

    it('should reject non-admin user from accessing worlds route', async () => {
      // The default mock for authMiddleware in beforeEach already sets is_admin: false
      const response = await request(app)
        .get('/api/worlds')
        .set('Authorization', `Bearer ${authToken}`) // Provide a token to pass authMiddleware
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Forbidden: Admin access required');
      expect(response.body.code).toBe('ADMIN_REQUIRED');
    });

    it('should allow admin user to access worlds route', async () => {
      // Temporarily mock authMiddleware to set is_admin: true for this test
      jest.spyOn(require('../../src/middleware/authMiddleware'), 'authMiddleware').mockImplementationOnce((req: AuthenticatedRequest, res, next) => {
        req.user = { id: 'test-user-id', email: 'test@example.com', is_admin: true };
        next();
      });

      const response = await request(app)
        .get('/api/worlds')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].name).toBe('Test World');
    });
  });

  describe('POST /api/worlds', () => {
    it('should create world with valid data', async () => {
      const response = await request(app)
        .post('/api/worlds')
        .set('Authorization', `Bearer ${authToken}`)
        .send(testWorlds.validWorld)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(testWorlds.validWorld.name);
      expect(response.body.data.description).toBe(testWorlds.validWorld.description);
    });

    it('should reject creation without name', async () => {
      const response = await request(app)
        .post('/api/worlds')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ description: 'Missing name' })
        .expect(200); // Error middleware handles this

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('World name is required');
    });

    it('should reject creation without token', async () => {
      const response = await request(app)
        .post('/api/worlds')
        .send(testWorlds.validWorld)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.code).toBe('TOKEN_REQUIRED');
    });
  });

  describe('PUT /api/worlds/:id', () => {
    it('should update world with valid data', async () => {
      const response = await request(app)
        .put('/api/worlds/world-1')
        .set('Authorization', `Bearer ${authToken}`)
        .send(testWorlds.updatedWorld)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(testWorlds.updatedWorld.name);
    });

    it('should reject update without name', async () => {
      const response = await request(app)
        .put('/api/worlds/world-1')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ description: 'Missing name' })
        .expect(200); // Error middleware handles this

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('World name is required');
    });
  });

  describe('DELETE /api/worlds/:id', () => {
    it('should delete world with valid token', async () => {
      const response = await request(app)
        .delete('/api/worlds/world-1')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('deleted successfully');
    });

    it('should reject delete without token', async () => {
      const response = await request(app)
        .delete('/api/worlds/world-1')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.code).toBe('TOKEN_REQUIRED');
    });
  });
});