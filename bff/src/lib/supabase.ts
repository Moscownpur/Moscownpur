import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

// Check if environment variables are available
const isSupabaseConfigured = supabaseUrl && supabaseAnonKey;

// Create a mock client for development when Supabase is not configured
const createMockClient = (): SupabaseClient => {
  return {
    auth: {
      signUp: async () => ({ data: { user: null }, error: { message: 'Supabase not configured' } }),
      signInWithPassword: async () => ({ data: { user: null }, error: { message: 'Supabase not configured' } }),
      signOut: async () => ({ error: null }),
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      getUser: async () => ({ data: { user: null }, error: null }),
    },
    from: () => ({
      select: () => ({ data: [], error: { message: 'Supabase not configured' } }),
      insert: () => ({ data: null, error: { message: 'Supabase not configured' } }),
      update: () => ({ data: null, error: { message: 'Supabase not configured' } }),
      delete: () => ({ data: null, error: { message: 'Supabase not configured' } }),
      eq: () => ({ data: [], error: { message: 'Supabase not configured' } }),
      single: () => ({ data: null, error: { message: 'Supabase not configured' } }),
      order: () => ({ data: [], error: { message: 'Supabase not configured' } }),
      limit: () => ({ data: [], error: { message: 'Supabase not configured' } }),
    }),
  } as any;
};

// Create Supabase client or mock client
export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : createMockClient();