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
const mockDialogueData = [
  { id: 'diag1', content: 'Dialogue 1', user_id: 'test-user-id', scene_id: 'scene1', character_id: 'char1' },
  { id: 'diag2', content: 'Dialogue 2', user_id: 'test-user-id', scene_id: 'scene1', character_id: 'char2' },
];

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn((tableName: string) => {
      if (tableName === 'dialogues') {
        return {
          select: jest.fn().mockResolvedValue({ data: mockDialogueData, error: null }),
          insert: jest.fn().mockResolvedValue({ data: { id: 'new-diag', ...mockDialogueData[0] }, error: null }),
          eq: jest.fn().mockReturnThis(),
          order: jest.fn().mockReturnThis(),
          single: jest.fn().mockReturnThis(),
        };
      }
      return {};
    }),
  }))
}));

describe('Dialogue API Routes', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch all dialogues for a given scene for the authenticated user', async () => {
    const res = await request(app).get('/api/dialogues?scene_id=scene1');
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual(mockDialogueData);
  });

  it('should return 400 if scene_id is missing when fetching dialogues', async () => {
    const res = await request(app).get('/api/dialogues');
    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
    expect(res.body.code).toEqual('SCENE_ID_REQUIRED');
  });

  it('should create a new dialogue', async () => {
    const newDialogue = { content: 'New Dialogue', scene_id: 'scene1', character_id: 'char1' };
    const createdDialogue = { id: 'new-diag-id', ...newDialogue, user_id: 'test-user-id' };

    const res = await request(app)
      .post('/api/dialogues')
      .send(newDialogue);

    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual(createdDialogue);
  });

  it('should return 400 if character_id, scene_id, or content is missing during creation', async () => {
    const res = await request(app)
      .post('/api/dialogues')
      .send({ scene_id: 'scene1', character_id: 'char1' }); // Missing content

    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
    expect(res.body.code).toEqual('DIALOGUE_FIELDS_REQUIRED');
  });

  it('should return 401 if user is not authenticated for fetching dialogues', async () => {
    const authMiddleware = await import('../../src/middleware/authMiddleware');
    (authMiddleware.authMiddleware as jest.Mock).mockImplementationOnce((req, res, next) => {
      req.user = undefined;
      next();
    });

    const res = await request(app).get('/api/dialogues?scene_id=scene1');
    expect(res.statusCode).toEqual(401);
    expect(res.body.success).toBe(false);
    expect(res.body.code).toEqual('NOT_AUTHENTICATED');
  });
});
