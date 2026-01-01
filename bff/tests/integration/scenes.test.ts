import request from 'supertest';
import { AuthenticatedRequest } from '../../src/middleware/authMiddleware';
import { AppError } from '../../src/middleware/errorHandler';
import { app } from '../../src/index';

// Mock auth middleware
jest.mock('../../src/middleware/authMiddleware', () => ({
  authMiddleware: jest.fn((req: AuthenticatedRequest, res, next) => {
    req.user = { id: 'test-user-id', email: 'test@example.com', is_admin: false };
    next();
  })
}));

// Mock Supabase
const mockSceneData = [
  { id: 'scene1', name: 'Scene 1', description: 'Desc 1', user_id: 'test-user-id', chapter_id: 'chap1' },
  { id: 'scene2', name: 'Scene 2', description: 'Desc 2', user_id: 'test-user-id', chapter_id: 'chap1' },
];

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn((tableName: string) => {
      if (tableName === 'scenes') {
        return {
          select: jest.fn().mockResolvedValue({ data: mockSceneData, error: null }),
          insert: jest.fn().mockResolvedValue({ data: { id: 'new-scene', ...mockSceneData[0] }, error: null }),
          eq: jest.fn().mockReturnThis(),
          order: jest.fn().mockReturnThis(),
          single: jest.fn().mockReturnThis(),
        };
      }
      return {};
    }),
  }))
}));

describe('Scene API Routes', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch all scenes for a given chapter for the authenticated user', async () => {
    const res = await request(app).get('/api/scenes?chapter_id=chap1');
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual(mockSceneData);
  });

  it('should return 400 if chapter_id is missing when fetching scenes', async () => {
    const res = await request(app).get('/api/scenes');
    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
    expect(res.body.code).toEqual('CHAPTER_ID_REQUIRED');
  });

  it('should create a new scene', async () => {
    const newScene = { name: 'New Scene', description: 'New Desc', chapter_id: 'chap1' };
    const createdScene = { id: 'new-scene-id', ...newScene, user_id: 'test-user-id' };

    const res = await request(app)
      .post('/api/scenes')
      .send(newScene);

    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual(createdScene);
  });

  it('should return 400 if scene name or chapter_id is missing during creation', async () => {
    const res = await request(app)
      .post('/api/scenes')
      .send({ description: 'New Desc' });

    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
    expect(res.body.code).toEqual('NAME_AND_CHAPTER_ID_REQUIRED');
  });

  it('should return 401 if user is not authenticated for fetching scenes', async () => {
    const authMiddleware = await import('../../src/middleware/authMiddleware');
    (authMiddleware.authMiddleware as jest.Mock).mockImplementationOnce((req, res, next) => {
      req.user = undefined;
      next();
    });

    const res = await request(app).get('/api/scenes?chapter_id=chap1');
    expect(res.statusCode).toEqual(401);
    expect(res.body.success).toBe(false);
    expect(res.body.code).toEqual('NOT_AUTHENTICATED');
  });
});