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
  created_by: string;
  created_at: string;
  updated_at: string;
}