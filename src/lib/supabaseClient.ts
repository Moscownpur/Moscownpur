import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if environment variables are available
const isSupabaseConfigured = supabaseUrl && supabaseKey;

// Create a mock client for development when Supabase is not configured
const createMockClient = (): SupabaseClient => {
  return {
    auth: {
      signUp: async () => ({ data: { user: null }, error: { message: 'Supabase not configured' } }),
      signInWithPassword: async () => ({ data: { user: null }, error: { message: 'Supabase not configured' } }),
      signOut: async () => ({ error: null }),
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
    from: () => ({
      select: () => ({ data: [], error: { message: 'Supabase not configured' } }),
      insert: () => ({ data: null, error: { message: 'Supabase not configured' } }),
      update: () => ({ data: null, error: { message: 'Supabase not configured' } }),
      delete: () => ({ data: null, error: { message: 'Supabase not configured' } }),
    }),
  } as any;
};

// Create the Supabase client with auth configuration or mock client
const supabaseClient = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    })
  : createMockClient();

// Export the client for direct use
export { supabaseClient };

// For backward compatibility
export const getSupabaseClient = async (): Promise<SupabaseClient> => {
  return supabaseClient;
};

// Lazy load Supabase only when needed
export const lazySupabase = async () => {
  const { createClient } = await import('@supabase/supabase-js');
  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  });
}; 