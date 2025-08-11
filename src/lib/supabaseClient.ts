import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create the Supabase client
const supabaseClient = createClient(supabaseUrl, supabaseKey);

// Export the client for direct use
export { supabaseClient };

// For backward compatibility
export const getSupabaseClient = async (): Promise<SupabaseClient> => {
  return supabaseClient;
};

// Lazy load Supabase only when needed
export const lazySupabase = async () => {
  const { createClient } = await import('@supabase/supabase-js');
  return createClient(supabaseUrl, supabaseKey);
}; 