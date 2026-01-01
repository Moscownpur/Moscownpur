// Test data fixtures
export const testUsers = {
  validUser: {
    email: 'test@example.com',
    password: 'testPassword123',
    full_name: 'Test User'
  },
  adminUser: {
    email: 'admin@example.com',
    password: 'adminPassword123',
    full_name: 'Admin User'
  },
  invalidUser: {
    email: 'invalid-email',
    password: '123'
  }
};

export const testWorlds = {
  validWorld: {
    name: 'Test World',
    description: 'A test world for unit testing'
  },
  invalidWorld: {
    description: 'Missing name'
  },
  updatedWorld: {
    name: 'Updated Test World',
    description: 'Updated description'
  }
};

export const testChapters = {
  validChapter: {
    title: 'Test Chapter',
    description: 'A test chapter',
    world_id: 'test-world-id',
    chapter_number: 1
  },
  invalidChapter: {
    description: 'Missing title'
  }
};

export const mockAuthResponse = {
  data: {
    user: {
      id: 'test-user-id',
      email: 'test@example.com',
      user_metadata: {
        full_name: 'Test User'
      },
      created_at: '2024-01-01T00:00:00Z'
    }
  },
  error: null
};

export const mockUserRole = {
  data: {
    is_admin: false
  },
  error: null
};

export const mockAdminRole = {
  data: {
    is_admin: true
  },
  error: null
};

export const mockWorldResponse = {
  data: [
    {
      id: 'test-world-id',
      name: 'Test World',
      description: 'A test world',
      user_id: 'test-user-id',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    }
  ],
  error: null
};

export const jwtPayload = {
  userId: 'test-user-id',
  email: 'test@example.com'
};