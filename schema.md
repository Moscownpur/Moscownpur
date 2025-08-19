# Database Schema Documentation

## Overview
This document describes the database schema for the Moscownpur storytelling application. The database uses PostgreSQL with Supabase and includes Row-Level Security (RLS) for data protection.

## Tables

### Core Story Management

#### `worlds`
The main table for fictional universes and worlds.

| Column | Type | Description | Constraints |
|--------|------|-------------|-------------|
| `id` | UUID | Primary key | `gen_random_uuid()` |
| `name` | TEXT | World name | NOT NULL |
| `type` | TEXT | World type | NOT NULL, ENUM: 'Universe', 'Planet', 'Magical Realm', 'Timeline Variant' |
| `description` | TEXT | World description | NOT NULL |
| `creation_myth` | TEXT | Origin story | NOT NULL |
| `governing_laws` | JSONB | World rules (time, magic, death, technology) | NOT NULL |
| `dominant_species` | TEXT[] | Array of species | NOT NULL, DEFAULT: '{}' |
| `visual_style` | TEXT | Visual aesthetic | NOT NULL |
| `theme` | TEXT | World theme | NOT NULL |
| `created_by` | TEXT | User ID who created | NOT NULL |
| `created_at` | TIMESTAMPTZ | Creation timestamp | DEFAULT: `now()` |
| `updated_at` | TIMESTAMPTZ | Last update timestamp | DEFAULT: `now()` |

**Relationships:**
- Referenced by: `regions`, `timeline_events`, `scenes`, `chapters`, `ai_chat_logs`

#### `regions`
Geographic areas within worlds.

| Column | Type | Description | Constraints |
|--------|------|-------------|-------------|
| `id` | UUID | Primary key | `gen_random_uuid()` |
| `name` | TEXT | Region name | NOT NULL |
| `world_id` | UUID | Foreign key to worlds | REFERENCES `worlds.id` |
| `type` | TEXT | Region type | NOT NULL, ENUM: 'Continent', 'Country', 'City', 'Village', 'Realm', 'Planet', 'Dimension' |
| `culture` | TEXT | Cultural description | DEFAULT: '' |
| `politics` | TEXT | Political system | DEFAULT: '' |
| `religion` | TEXT | Religious beliefs | DEFAULT: '' |
| `language` | TEXT[] | Languages spoken | DEFAULT: '{}' |
| `map_reference` | TEXT | Map coordinates/location | DEFAULT: '' |
| `history` | TEXT | Historical background | DEFAULT: '' |
| `notable_inhabitants` | TEXT[] | Important people | DEFAULT: '{}' |
| `important_events` | TEXT[] | Key historical events | DEFAULT: '{}' |
| `climate` | TEXT | Climate description | DEFAULT: '' |
| `resources` | TEXT[] | Available resources | DEFAULT: '{}' |
| `description` | TEXT | General description | DEFAULT: '' |
| `created_by` | TEXT | User ID who created | NOT NULL |
| `created_at` | TIMESTAMPTZ | Creation timestamp | DEFAULT: `now()` |
| `updated_at` | TIMESTAMPTZ | Last update timestamp | DEFAULT: `now()` |

**Relationships:**
- References: `worlds`
- Referenced by: `scenes`

#### `characters`
Characters in the story.

| Column | Type | Description | Constraints |
|--------|------|-------------|-------------|
| `id` | UUID | Primary key | `gen_random_uuid()` |
| `name` | TEXT | Character name | NOT NULL |
| `aliases` | TEXT[] | Alternative names | DEFAULT: '{}' |
| `gender` | TEXT | Character gender | DEFAULT: '' |
| `birth_date` | TEXT | Birth date/period | DEFAULT: '' |
| `age` | INTEGER | Character age | DEFAULT: 0 |
| `origin` | TEXT | Place of origin | DEFAULT: '' |
| `current_location` | TEXT | Current whereabouts | DEFAULT: '' |
| `species` | TEXT | Character species | DEFAULT: '' |
| `race` | TEXT | Character race | DEFAULT: '' |
| `caste_or_class` | TEXT | Social class | DEFAULT: '' |
| `religion` | TEXT | Religious beliefs | DEFAULT: '' |
| `languages` | TEXT[] | Languages known | DEFAULT: '{}' |
| `physical_appearance` | JSONB | Physical traits | DEFAULT: '{}' |
| `personality` | JSONB | Personality traits | DEFAULT: '{}' |
| `skills_and_abilities` | TEXT[] | Skills and powers | DEFAULT: '{}' |
| `profession` | TEXT | Occupation | DEFAULT: '' |
| `affiliations` | TEXT[] | Groups/organizations | DEFAULT: '{}' |
| `relationships` | JSONB[] | Character relationships | DEFAULT: '{}' |
| `notable_events` | TEXT[] | Important life events | DEFAULT: '{}' |
| `arc_summary` | TEXT | Character development | DEFAULT: '' |
| `status` | TEXT | Current status | DEFAULT: 'Alive', ENUM: 'Alive', 'Dead', 'Unknown', 'Ascended' |
| `world_id` | UUID | Foreign key to worlds | REFERENCES `worlds.id` |
| `created_by` | TEXT | User ID who created | NOT NULL |
| `created_at` | TIMESTAMPTZ | Creation timestamp | DEFAULT: `now()` |
| `updated_at` | TIMESTAMPTZ | Last update timestamp | DEFAULT: `now()` |

**Relationships:**
- References: `worlds`
- Referenced by: `scene_characters`, `scene_lines`, `ai_chat_logs`

#### `timeline_events`
Historical events in the world.

| Column | Type | Description | Constraints |
|--------|------|-------------|-------------|
| `id` | UUID | Primary key | `gen_random_uuid()` |
| `title` | TEXT | Event title | NOT NULL |
| `date` | TEXT | Event date/period | NOT NULL |
| `era` | TEXT | Historical era | DEFAULT: '' |
| `location` | TEXT | Event location | DEFAULT: '' |
| `involved_characters` | TEXT[] | Characters involved | DEFAULT: '{}' |
| `description` | TEXT | Event description | DEFAULT: '' |
| `type` | TEXT | Event type | NOT NULL, ENUM: 'Birth', 'Death', 'War', 'Marriage', 'Political', 'Mystical', 'Invention', 'Encounter', 'Vision', 'Betrayal', 'Coronation' |
| `consequences` | TEXT | Event consequences | DEFAULT: '' |
| `world_id` | UUID | Foreign key to worlds | REFERENCES `worlds.id` |
| `chapter_id` | UUID | Foreign key to chapters | REFERENCES `chapters.id` |
| `created_by` | TEXT | User ID who created | NOT NULL |
| `created_at` | TIMESTAMPTZ | Creation timestamp | DEFAULT: `now()` |
| `updated_at` | TIMESTAMPTZ | Last update timestamp | DEFAULT: `now()` |

**Relationships:**
- References: `worlds`, `chapters`
- Referenced by: `scenes`

#### `scenes`
Story scenes and chapters.

| Column | Type | Description | Constraints |
|--------|------|-------------|-------------|
| `id` | UUID | Primary key | `gen_random_uuid()` |
| `title` | TEXT | Scene title | NOT NULL |
| `description` | TEXT | Scene description | DEFAULT: '' |
| `dialogue` | TEXT | Scene dialogue | DEFAULT: '' |
| `event_id` | UUID | Foreign key to timeline_events | REFERENCES `timeline_events.id` |
| `region_id` | UUID | Foreign key to regions | REFERENCES `regions.id` |
| `world_id` | UUID | Foreign key to worlds | REFERENCES `worlds.id` |
| `scene_order` | INTEGER | Scene sequence | DEFAULT: 1 |
| `ai_image_prompt` | TEXT | AI image generation prompt | DEFAULT: '' |
| `created_by` | TEXT | User ID who created | NOT NULL |
| `created_at` | TIMESTAMPTZ | Creation timestamp | DEFAULT: `now()` |
| `updated_at` | TIMESTAMPTZ | Last update timestamp | DEFAULT: `now()` |

**Relationships:**
- References: `timeline_events`, `regions`, `worlds`
- Referenced by: `scene_characters`, `scene_lines`, `entity_summaries`

#### `chapters`
Story chapters.

| Column | Type | Description | Constraints |
|--------|------|-------------|-------------|
| `id` | UUID | Primary key | `gen_random_uuid()` |
| `world_id` | UUID | Foreign key to worlds | REFERENCES `worlds.id` |
| `title` | TEXT | Chapter title | NOT NULL |
| `description` | TEXT | Chapter description | DEFAULT: '' |
| `order_index` | INTEGER | Chapter sequence | DEFAULT: 1 |
| `created_by` | TEXT | User ID who created | NOT NULL |
| `created_at` | TIMESTAMPTZ | Creation timestamp | DEFAULT: `now()` |
| `updated_at` | TIMESTAMPTZ | Last update timestamp | DEFAULT: `now()` |

**Relationships:**
- References: `worlds`
- Referenced by: `timeline_events`

### Scene & Dialogue Management

#### `scene_lines`
Individual lines of dialogue or narration.

| Column | Type | Description | Constraints |
|--------|------|-------------|-------------|
| `id` | UUID | Primary key | `gen_random_uuid()` |
| `scene_id` | UUID | Foreign key to scenes | REFERENCES `scenes.id` |
| `type` | TEXT | Line type | NOT NULL, ENUM: 'character', 'narration' |
| `character_id` | UUID | Foreign key to characters | REFERENCES `characters.id` |
| `display_name` | TEXT | Character display name | NOT NULL |
| `text` | TEXT | Line content | NOT NULL |
| `order_index` | INTEGER | Line sequence | DEFAULT: 1 |
| `created_by` | TEXT | User ID who created | NOT NULL |
| `created_at` | TIMESTAMPTZ | Creation timestamp | DEFAULT: `now()` |
| `updated_at` | TIMESTAMPTZ | Last update timestamp | DEFAULT: `now()` |

**Relationships:**
- References: `scenes`, `characters`

#### `scene_characters`
Characters participating in scenes.

| Column | Type | Description | Constraints |
|--------|------|-------------|-------------|
| `id` | UUID | Primary key | `gen_random_uuid()` |
| `scene_id` | UUID | Foreign key to scenes | REFERENCES `scenes.id` |
| `character_id` | UUID | Foreign key to characters | REFERENCES `characters.id` |
| `role_in_scene` | TEXT | Character role | DEFAULT: 'participant', ENUM: 'protagonist', 'antagonist', 'ally', 'enemy', 'witness', 'narrator', 'participant' |
| `character_state` | TEXT | Character condition | DEFAULT: 'normal', ENUM: 'normal', 'injured', 'dead', 'transformed', 'missing', 'empowered', 'weakened' |
| `importance_level` | TEXT | Character importance | DEFAULT: 'secondary', ENUM: 'primary', 'secondary', 'background' |
| `created_at` | TIMESTAMPTZ | Creation timestamp | DEFAULT: `now()` |

**Relationships:**
- References: `scenes`, `characters`

### AI & Memory System

#### `ai_chat_logs`
AI conversation history.

| Column | Type | Description | Constraints |
|--------|------|-------------|-------------|
| `id` | UUID | Primary key | `gen_random_uuid()` |
| `character_id` | UUID | Foreign key to characters | REFERENCES `characters.id` |
| `world_id` | UUID | Foreign key to worlds | REFERENCES `worlds.id` |
| `user_message` | TEXT | User's message | NOT NULL |
| `ai_response` | TEXT | AI's response | NOT NULL |
| `context_memories_used` | TEXT[] | Memories referenced | DEFAULT: '{}' |
| `scene_context` | TEXT | Scene context | DEFAULT: '' |
| `emotion_detected` | TEXT | Detected emotion | DEFAULT: '' |
| `memory_impact` | TEXT | Memory impact | DEFAULT: '' |
| `created_by` | TEXT | User ID who created | NOT NULL |
| `created_at` | TIMESTAMPTZ | Creation timestamp | DEFAULT: `now()` |

**Relationships:**
- References: `characters`, `worlds`

#### `entity_summaries`
AI memory summaries of entities.

| Column | Type | Description | Constraints |
|--------|------|-------------|-------------|
| `id` | UUID | Primary key | `gen_random_uuid()` |
| `entity_type` | TEXT | Entity type | NOT NULL, ENUM: 'character', 'region', 'world', 'timeline_event', 'scene' |
| `entity_id` | UUID | Entity ID | NOT NULL |
| `summary_text` | TEXT | Memory summary | NOT NULL |
| `memory_type` | TEXT | Memory type | DEFAULT: 'hard', ENUM: 'hard', 'soft', 'ephemeral' |
| `version` | INTEGER | Summary version | DEFAULT: 1 |
| `is_current` | BOOLEAN | Current version flag | DEFAULT: true |
| `tags` | TEXT[] | Memory tags | DEFAULT: '{}' |
| `last_used_in_scene` | UUID | Last scene used | REFERENCES `scenes.id` |
| `editable` | BOOLEAN | Editable flag | DEFAULT: true |
| `used_recently` | BOOLEAN | Recently used flag | DEFAULT: false |
| `relevance_score` | FLOAT8 | Relevance score | DEFAULT: 0.0 |
| `created_by` | TEXT | User ID who created | NOT NULL |
| `created_at` | TIMESTAMPTZ | Creation timestamp | DEFAULT: `now()` |
| `updated_at` | TIMESTAMPTZ | Last update timestamp | DEFAULT: `now()` |

**Relationships:**
- References: `scenes`
- Referenced by: `memory_visualizations`

#### `memory_visualizations`
Memory display settings.

| Column | Type | Description | Constraints |
|--------|------|-------------|-------------|
| `id` | UUID | Primary key | `gen_random_uuid()` |
| `entity_type` | TEXT | Entity type | NOT NULL |
| `entity_id` | UUID | Entity ID | NOT NULL |
| `memory_id` | UUID | Foreign key to entity_summaries | REFERENCES `entity_summaries.id` |
| `visualization_type` | TEXT | Display type | NOT NULL, ENUM: 'active', 'pinned', 'faded', 'highlighted' |
| `position_x` | INTEGER | X position | DEFAULT: 0 |
| `position_y` | INTEGER | Y position | DEFAULT: 0 |
| `z_index` | INTEGER | Z-index | DEFAULT: 0 |
| `created_by` | TEXT | User ID who created | NOT NULL |
| `created_at` | TIMESTAMPTZ | Creation timestamp | DEFAULT: `now()` |

**Relationships:**
- References: `entity_summaries`

#### `memory_tags`
Memory categorization tags.

| Column | Type | Description | Constraints |
|--------|------|-------------|-------------|
| `id` | UUID | Primary key | `gen_random_uuid()` |
| `name` | TEXT | Tag name | NOT NULL, UNIQUE |
| `category` | TEXT | Tag category | NOT NULL, ENUM: 'emotion', 'plot', 'lore', 'relationship', 'location', 'temporal' |
| `color` | TEXT | Tag color | DEFAULT: '#3B82F6' |
| `description` | TEXT | Tag description | DEFAULT: '' |
| `created_by` | TEXT | User ID who created | NOT NULL |
| `created_at` | TIMESTAMPTZ | Creation timestamp | DEFAULT: `now()` |
| `updated_at` | TIMESTAMPTZ | Last update timestamp | DEFAULT: `now()` |

#### `context_templates`
AI prompt templates.

| Column | Type | Description | Constraints |
|--------|------|-------------|-------------|
| `id` | UUID | Primary key | `gen_random_uuid()` |
| `name` | TEXT | Template name | NOT NULL, UNIQUE |
| `template_type` | TEXT | Template type | NOT NULL, ENUM: 'scene_continuation', 'character_chat', 'plot_development', 'world_building', 'dialogue_generation' |
| `prompt_template` | TEXT | Template content | NOT NULL |
| `variables` | TEXT[] | Template variables | DEFAULT: '{}' |
| `description` | TEXT | Template description | DEFAULT: '' |
| `is_active` | BOOLEAN | Active flag | DEFAULT: true |
| `created_by` | TEXT | User ID who created | NOT NULL |
| `created_at` | TIMESTAMPTZ | Creation timestamp | DEFAULT: `now()` |
| `updated_at` | TIMESTAMPTZ | Last update timestamp | DEFAULT: `now()` |

### Authentication

#### `user_roles`
User role management linked to Supabase auth.users.

| Column | Type | Description | Constraints |
|--------|------|-------------|-------------|
| `id` | UUID | Primary key, references auth.users(id) | REFERENCES `auth.users(id)` ON DELETE CASCADE |
| `is_admin` | BOOLEAN | Admin flag | NOT NULL, DEFAULT: false |
| `created_at` | TIMESTAMPTZ | Creation timestamp | DEFAULT: `now()` |

**Relationships:**
- References: `auth.users` (Supabase built-in authentication table)

**RLS Policies:**
- Users can only view their own role
- Users can update their own role (but not is_admin field)
- Only admins can insert/delete user roles
- Automatic user_roles entry creation via trigger on auth.users insert

## Row-Level Security (RLS)

Most tables have RLS enabled for data protection:

- **Enabled tables**: All tables except `user_roles` (which has its own specific policies)
- **Policy pattern**: Users can only access data they created (`created_by` field)
- **Admin access**: Admin users have broader access through separate policies
- **Authentication**: Uses Supabase's built-in `auth.users` table with `user_roles` for role management

## Data Relationships

### Core Hierarchy
```
worlds
├── regions
├── characters
├── timeline_events
│   └── scenes
│       ├── scene_lines
│       └── scene_characters
└── chapters
    └── timeline_events
```

### AI System
```
ai_chat_logs
├── characters
└── worlds

entity_summaries
├── scenes
└── memory_visualizations

memory_tags (standalone)
context_templates (standalone)
```

## Usage Notes

1. **UUIDs**: All primary keys use UUIDs for security and scalability
2. **Timestamps**: All tables include `created_at` and `updated_at` timestamps
3. **Arrays**: PostgreSQL arrays are used for flexible data storage (tags, lists)
4. **JSONB**: Complex data structures stored as JSONB for flexibility
5. **Foreign Keys**: Proper relationships maintained with foreign key constraints
6. **Enums**: Check constraints ensure data integrity for categorical fields

## Current Data Status

- **Worlds**: 2 active worlds
- **Memory Tags**: 18 tags across 6 categories
- **Context Templates**: 3 active templates
- **Users**: Migrated to Supabase auth.users with user_roles
- **Other tables**: Ready for content creation
