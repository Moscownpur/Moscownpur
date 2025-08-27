export interface World {
  id: string;
  name: string;
  type: 'Universe' | 'Planet' | 'Magical Realm' | 'Timeline Variant';
  description: string;
  creation_myth: string;
  governing_laws: {
    time: 'Linear' | 'Non-linear' | 'Cyclical';
    magic: 'Enabled' | 'Disabled' | 'Rare' | 'Scientific';
    death: 'Permanent' | 'Rebirth' | 'Cyclical' | 'Undefined';
    technology_level: string;
  };
  dominant_species: string[];
  visual_style: string;
  theme: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Character {
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
  physical_appearance: {
    height: string;
    eye_color: string;
    hair_color: string;
    build: string;
    distinguishing_marks: string[];
  };
  personality: {
    traits: string[];
    strengths: string[];
    weaknesses: string[];
    flaws: string[];
    fears: string[];
  };
  skills_and_abilities: string[];
  profession: string;
  affiliations: string[];
  relationships: Array<{
    character_id: string;
    relationship_type: string;
    status: string;
    notes: string;
  }>;
  notable_events: string[];
  arc_summary: string;
  status: 'Alive' | 'Dead' | 'Unknown' | 'Ascended';
  world_id: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Region {
  id: string;
  name: string;
  world_id: string;
  type: 'Continent' | 'Country' | 'City' | 'Village' | 'Realm' | 'Planet' | 'Dimension';
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
}

export interface TimelineEvent {
  id: string;
  title: string;
  date: string;
  era: string;
  location: string;
  involved_characters: string[];
  description: string;
  type: 'Birth' | 'Death' | 'War' | 'Marriage' | 'Political' | 'Mystical' | 'Invention' | 'Encounter' | 'Vision' | 'Betrayal' | 'Coronation';
  consequences: string;
  world_id: string;
  chapter_id?: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Scene {
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
}

export interface SceneCharacter {
  id: string;
  scene_id: string;
  character_id: string;
  role_in_scene: 'protagonist' | 'antagonist' | 'ally' | 'enemy' | 'witness' | 'narrator' | 'participant';
  character_state: 'normal' | 'injured' | 'dead' | 'transformed' | 'missing' | 'empowered' | 'weakened';
  importance_level: 'primary' | 'secondary' | 'background';
  created_at: string;
}

export interface SceneLine {
  id: string;
  scene_id: string;
  type: 'character' | 'narration';
  character_id: string | null;
  display_name: string;
  text: string;
  order_index: number;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface SceneLineWithCharacter extends SceneLine {
  character_name?: string;
  character_role?: string;
}

export interface SceneWithDialogue extends Scene {
  line_count: number;
  dialogue_lines: SceneLineWithCharacter[];
}

export interface Chapter {
  id: string;
  world_id: string;
  title: string;
  description?: string;
  order_index: number;
  template_type?: string;
  status?: 'draft' | 'published' | 'archived';
  timeline_version?: number;
  created_at: string;
  updated_at: string;
}

export interface TimelineEventWithScenes extends TimelineEvent {
  scene_count: number;
  scenes: Array<{
    id: string;
    title: string;
    description: string;
    scene_order: number;
    region_name: string | null;
  }>;
}

export interface TimelineEventWithChapters extends TimelineEvent {
  chapter_id?: string;
  chapter_title?: string;
  chapter_order?: number;
  scene_count: number;
  scenes: Array<{
    id: string;
    title: string;
    description: string;
    scene_order: number;
    region_name: string | null;
  }>;
}