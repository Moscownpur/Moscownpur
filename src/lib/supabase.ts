import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

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
    },
    from: () => ({
      select: () => ({ data: [], error: { message: 'Supabase not configured' } }),
      insert: () => ({ data: null, error: { message: 'Supabase not configured' } }),
      update: () => ({ data: null, error: { message: 'Supabase not configured' } }),
      delete: () => ({ data: null, error: { message: 'Supabase not configured' } }),
    }),
  } as any;
};

// Create the Supabase client or mock client
const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createMockClient();

// Export the client for direct use
export { supabase };

// For backward compatibility, export a function that returns the client
export const getSupabase = async (): Promise<SupabaseClient> => {
  return supabase;
};

export type Database = {
  public: {
    Tables: {
      worlds: {
        Row: {
          id: string;
          name: string;
          type: string;
          description: string;
          creation_myth: string;
          governing_laws: any;
          dominant_species: string[];
          visual_style: string;
          theme: string;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['worlds']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['worlds']['Insert']>;
      };
      characters: {
        Row: {
          id: string;
          name: string;
          aliases: string[];
          gender: string;
          birth_date: string;
          age: number;
          origin: string;
          current_location: string;
          species: string;
          race: string;
          caste_or_class: string;
          religion: string;
          languages: string[];
          physical_appearance: any;
          personality: any;
          skills_and_abilities: string[];
          profession: string;
          affiliations: string[];
          relationships: any[];
          notable_events: string[];
          arc_summary: string;
          status: string;
          world_id: string;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['characters']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['characters']['Insert']>;
      };
      regions: {
        Row: {
          id: string;
          name: string;
          world_id: string;
          type: string;
          culture: string;
          politics: string;
          religion: string;
          language: string[];
          map_reference: string;
          history: string;
          notable_inhabitants: string[];
          important_events: string[];
          climate: string;
          resources: string[];
          description: string;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['regions']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['regions']['Insert']>;
      };
      timeline_events: {
        Row: {
          id: string;
          title: string;
          date: string;
          era: string;
          location: string;
          involved_characters: string[];
          description: string;
          type: string;
          consequences: string;
          world_id: string;
          chapter_id: string | null;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['timeline_events']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['timeline_events']['Insert']>;
      };
      chapters: {
        Row: {
          id: string;
          world_id: string;
          title: string;
          description: string;
          order_index: number;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['chapters']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['chapters']['Insert']>;
      };
      scenes: {
        Row: {
          id: string;
          title: string;
          description: string;
          dialogue: string;
          event_id: string;
          region_id: string | null;
          world_id: string;
          scene_order: number;
          ai_image_prompt: string;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['scenes']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['scenes']['Insert']>;
      };
      scene_characters: {
        Row: {
          id: string;
          scene_id: string;
          character_id: string;
          role_in_scene: string;
          character_state: string;
          importance_level: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['scene_characters']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['scene_characters']['Insert']>;
      };
      scene_lines: {
        Row: {
          id: string;
          scene_id: string;
          type: string;
          character_id: string | null;
          display_name: string;
          text: string;
          order_index: number;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['scene_lines']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['scene_lines']['Insert']>;
      };
      user_roles: {
        Row: {
          id: string;
          is_admin: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['user_roles']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['user_roles']['Insert']>;
      };
      ai_chat_logs: {
        Row: {
          id: string;
          character_id: string;
          world_id: string;
          user_message: string;
          ai_response: string;
          context_memories_used: string[];
          scene_context: string;
          emotion_detected: string;
          memory_impact: string;
          created_by: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['ai_chat_logs']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['ai_chat_logs']['Insert']>;
      };
      entity_summaries: {
        Row: {
          id: string;
          entity_type: string;
          entity_id: string;
          summary_text: string;
          memory_type: string;
          version: number;
          is_current: boolean;
          tags: string[];
          last_used_in_scene: string | null;
          editable: boolean;
          used_recently: boolean;
          relevance_score: number;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['entity_summaries']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['entity_summaries']['Insert']>;
      };
      memory_visualizations: {
        Row: {
          id: string;
          entity_type: string;
          entity_id: string;
          memory_id: string;
          visualization_type: string;
          position_x: number;
          position_y: number;
          z_index: number;
          created_by: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['memory_visualizations']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['memory_visualizations']['Insert']>;
      };
      memory_tags: {
        Row: {
          id: string;
          name: string;
          category: string;
          color: string;
          description: string;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['memory_tags']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['memory_tags']['Insert']>;
      };
      context_templates: {
        Row: {
          id: string;
          name: string;
          template_type: string;
          prompt_template: string;
          variables: string[];
          description: string;
          is_active: boolean;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['context_templates']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['context_templates']['Insert']>;
      };
      profiles: {
        Row: {
          id: string;
          email: string | null;
          full_name: string | null;
          username: string | null;
          avatar_url: string | null;
          tagline: string | null;
          bio: string | null;
          display_name: string | null;
          xp_score: number;
          followers_count: number;
          following_count: number;
          invite_code: string | null;
          invite_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      badge_catalog: {
        Row: {
          id: string;
          category: string;
          rarity: string | null;
          name: string;
          description: string;
          points: number;
          xp_reward: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['badge_catalog']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['badge_catalog']['Insert']>;
      };
      user_badges: {
        Row: {
          id: string;
          user_id: string;
          badge_id: string;
          earned_at: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['user_badges']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['user_badges']['Insert']>;
      };
      invite_connections: {
        Row: {
          id: string;
          inviter_user_id: string;
          invitee_user_id: string;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['invite_connections']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['invite_connections']['Insert']>;
      };
      invite_codes: {
        Row: {
          id: string;
          user_id: string;
          code: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['invite_codes']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['invite_codes']['Insert']>;
      };
    };
  };
};