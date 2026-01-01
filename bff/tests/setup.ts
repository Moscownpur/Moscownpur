// Test setup file
import { beforeAll, afterAll, jest } from '@jest/globals';

// Mock environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.BFF_PORT = '3003';
process.env.FRONTEND_URL = 'http://localhost:5173';

// Create Supabase mock
const mockSupabaseClient = {
  auth: {
    signInWithPassword: jest.fn(),
    signUp: jest.fn(),
    signOut: jest.fn(),
    getUser: jest.fn(),
    onAuthStateChange: jest.fn()
  },
  from: jest.fn().mockReturnValue({
    select: jest.fn() as any,
    insert: jest.fn() as any,
    update: jest.fn() as any,
    delete: jest.fn() as any,
    eq: jest.fn() as any,
    single: jest.fn() as any,
    order: jest.fn() as any,
    limit: jest.fn() as any
  })
} as any;

// Mock Supabase module
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => mockSupabaseClient)
}));

// Global test timeout
beforeAll(() => {
  jest.setTimeout(10000);
});

// Cleanup after tests
afterAll(() => {
  jest.clearAllMocks();
});