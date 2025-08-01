import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase;

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'https://your-project-id.supabase.co' || supabaseAnonKey === 'your-anon-key-here') {
  console.warn('Supabase not configured. Using mock data mode.');
  // Create a mock client that won't cause errors
  supabase = null;
} else {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export { supabase };

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
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['timeline_events']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['timeline_events']['Insert']>;
      };
    };
  };
};