// AI Memory Engine Types

export interface EntitySummary {
  id: string;
  entity_type: 'character' | 'region' | 'world' | 'timeline_event' | 'scene';
  entity_id: string;
  summary_text: string;
  memory_type: 'hard' | 'soft' | 'ephemeral';
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
}

export interface MemoryTag {
  id: string;
  name: string;
  category: 'emotion' | 'plot' | 'lore' | 'relationship' | 'location' | 'temporal';
  color: string;
  description: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface AIChatLog {
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
}

export interface ContextTemplate {
  id: string;
  name: string;
  template_type: 'scene_continuation' | 'character_chat' | 'plot_development' | 'world_building' | 'dialogue_generation';
  prompt_template: string;
  variables: string[];
  description: string;
  is_active: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface MemoryVisualization {
  id: string;
  entity_type: string;
  entity_id: string;
  memory_id: string;
  visualization_type: 'active' | 'pinned' | 'faded' | 'highlighted';
  position_x: number;
  position_y: number;
  z_index: number;
  created_by: string;
  created_at: string;
}

export interface MemoryAnalytics {
  entity_type: string;
  entity_id: string;
  total_memories: number;
  current_memories: number;
  hard_memories: number;
  soft_memories: number;
  ephemeral_memories: number;
  avg_relevance: number;
  last_updated: string;
}

// AI Context Builder Types
export interface ContextBuilder {
  world_context: string;
  character_context: string;
  scene_context: string;
  memory_context: string;
  active_memories: EntitySummary[];
  relevant_tags: MemoryTag[];
}

export interface PromptVariables {
  world_context?: string;
  character_context?: string;
  scene_context?: string;
  previous_dialogue?: string;
  memory_context?: string;
  character_name?: string;
  character_background?: string;
  current_situation?: string;
  user_message?: string;
  active_memories?: string;
  world_state?: string;
  character_arcs?: string;
  recent_events?: string;
  story_themes?: string;
}

// AI Response Types
export interface AIResponse {
  text: string;
  memories_used: string[];
  emotion_detected?: string;
  confidence_score?: number;
  suggested_actions?: string[];
}

export interface CharacterChatResponse extends AIResponse {
  character_name: string;
  character_state: string;
  relationship_impact?: string;
}

export interface SceneContinuationResponse extends AIResponse {
  scene_suggestions: string[];
  character_actions: string[];
  plot_developments: string[];
}

// Memory Management Types
export interface MemoryFilter {
  entity_type?: string;
  memory_type?: 'hard' | 'soft' | 'ephemeral';
  tags?: string[];
  min_relevance?: number;
  used_recently?: boolean;
  editable?: boolean;
}

export interface MemoryUpdate {
  summary_text?: string;
  memory_type?: 'hard' | 'soft' | 'ephemeral';
  tags?: string[];
  editable?: boolean;
  used_recently?: boolean;
}

// AI Integration Types
export interface AIIntegrationConfig {
  model: string;
  temperature: number;
  max_tokens: number;
  memory_context_length: number;
  enable_memory_learning: boolean;
  auto_tag_memories: boolean;
}

export interface MemoryLearningResult {
  new_memories: EntitySummary[];
  updated_memories: EntitySummary[];
  memory_connections: Array<{
    source_memory: string;
    target_memory: string;
    connection_strength: number;
    connection_type: string;
  }>;
}

// Visualization Types
export interface MemoryNode {
  id: string;
  type: 'memory' | 'entity' | 'tag';
  label: string;
  data: EntitySummary | MemoryTag;
  position: { x: number; y: number };
  connections: string[];
  relevance: number;
  is_active: boolean;
}

export interface MemoryGraph {
  nodes: MemoryNode[];
  edges: Array<{
    source: string;
    target: string;
    weight: number;
    type: string;
  }>;
  metadata: {
    total_memories: number;
    active_memories: number;
    avg_relevance: number;
    last_updated: string;
  };
} 