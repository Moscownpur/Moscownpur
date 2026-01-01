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
const mockChapterData = [
  { id: 'chap1', name: 'Chapter 1', description: 'Desc 1', user_id: 'test-user-id', world_id: 'world1' },
  { id: 'chap2', name: 'Chapter 2', description: 'Desc 2', user_id: 'test-user-id', world_id: 'world1' },
];

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn((tableName: string) => {
      if (tableName === 'chapters') {
        return {
          select: jest.fn().mockResolvedValue({ data: mockChapterData, error: null }),
          insert: jest.fn().mockResolvedValue({ data: { id: 'new-chap', ...mockChapterData[0] }, error: null }),
          eq: jest.fn().mockReturnThis(),
          order: jest.fn().mockReturnThis(),
          single: jest.fn().mockReturnThis(),
        };
      }
      return {};
    }),
  }))
}));

describe('Chapter API Routes', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch all chapters for a given world for the authenticated user', async () => {
    const res = await request(app).get('/api/chapters?world_id=world1');
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual(mockChapterData);
  });

  it('should return 400 if world_id is missing when fetching chapters', async () => {
    const res = await request(app).get('/api/chapters');
    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
    expect(res.body.code).toEqual('WORLD_ID_REQUIRED');
  });

  it('should create a new chapter', async () => {
    const newChapter = { name: 'New Chapter', description: 'New Desc', world_id: 'world1' };
    const createdChapter = { id: 'new-chap-id', ...newChapter, user_id: 'test-user-id' };

    const res = await request(app)
      .post('/api/chapters')
      .send(newChapter);

    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual(createdChapter);
  });

  it('should return 400 if chapter name or world_id is missing during creation', async () => {
    const res = await request(app)
      .post('/api/chapters')
      .send({ description: 'New Desc' });

    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
    expect(res.body.code).toEqual('NAME_AND_WORLD_ID_REQUIRED');
  });

  it('should return 401 if user is not authenticated for fetching chapters', async () => {
    const authMiddleware = await import('../../src/middleware/authMiddleware');
    (authMiddleware.authMiddleware as jest.Mock).mockImplementationOnce((req, res, next) => {
      req.user = undefined;
      next();
    });

    const res = await request(app).get('/api/chapters?world_id=world1');
    expect(res.statusCode).toEqual(401);
    expect(res.body.success).toBe(false);
    expect(res.body.code).toEqual('NOT_AUTHENTICATED');
  });
});