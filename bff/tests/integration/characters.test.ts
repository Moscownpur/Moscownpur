import request from 'supertest';
import { AuthenticatedRequest } from '../../src/middleware/authMiddleware';
import { AppError } from '../../src/middleware/errorHandler';
import { app } from '../../src/index'; // Import the actual app instance

// Mock auth middleware
jest.mock('../../src/middleware/authMiddleware', () => ({
  authMiddleware: jest.fn((req: AuthenticatedRequest, res, next) => {
    req.user = { id: 'test-user-id', email: 'test@example.com', is_admin: false };
    next();
  })
}));

// Mock Supabase
const mockCharacterData = [
  { id: 'char1', name: 'Character 1', description: 'Desc 1', user_id: 'test-user-id', world_id: 'world1' },
  { id: 'char2', name: 'Character 2', description: 'Desc 2', user_id: 'test-user-id', world_id: 'world1' },
];

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn((tableName: string) => {
      if (tableName === 'characters') {
        return {
          select: jest.fn().mockResolvedValue({ data: mockCharacterData, error: null }),
          insert: jest.fn().mockResolvedValue({ data: { id: 'new-char', ...mockCharacterData[0] }, error: null }),
          eq: jest.fn().mockReturnThis(),
          order: jest.fn().mockReturnThis(),
          single: jest.fn().mockReturnThis(),
        };
      }
      return {};
    }),
  }))
}));


describe('Character API Routes', () => {
  // Use the directly imported app instance
  // No need for `let app: any;` or `beforeAll` block to assign it
  // The 'app' variable is now directly available from the import.

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch all characters for the authenticated user', async () => {
    // This mock needs to be adjusted as mockSupabase is no longer directly available
    // and should interact with the jest.mock('@supabase/supabase-js') setup.
    // For now, it might still work if the mock is general enough.
    // However, for precise control, we might need to adjust the jest.mock setup
    // or use a helper function that returns the mock client with specific data.
    const res = await request(app).get('/api/characters');
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual(mockCharacterData);
  });

  it('should create a new character', async () => {
    const newCharacter = { name: 'New Character', description: 'New Desc', world_id: 'world1' };
    const createdCharacter = { id: 'new-char-id', ...newCharacter, user_id: 'test-user-id' };

    // This mock needs to be adjusted as mockSupabase is no longer directly available
    const res = await request(app)
      .post('/api/characters')
      .send(newCharacter);

    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual(createdCharacter);
  });

  it('should return 400 if character name is missing during creation', async () => {
    const res = await request(app)
      .post('/api/characters')
      .send({ description: 'New Desc', world_id: 'world1' });

    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
    expect(res.body.code).toEqual('NAME_REQUIRED');
  });

  it('should return 401 if user is not authenticated for fetching characters', async () => {
    // Temporarily disable authMiddleware mock to simulate unauthenticated access
    const authMiddleware = await import('../../src/middleware/authMiddleware');
    (authMiddleware.authMiddleware as jest.Mock).mockImplementationOnce((req, res, next) => {
      req.user = undefined;
      next();
    });

    const res = await request(app).get('/api/characters');
    expect(res.statusCode).toEqual(401);
    expect(res.body.success).toBe(false);
    expect(res.body.code).toEqual('NOT_AUTHENTICATED');
  });
});