export interface Dialogue {
  dialogue_id: string;
  scene_id: string;
  character_id?: string;
  content: string;
  delivery_type: DeliveryType;
  sequence: number;
  sentiment_score?: number;
  created_at: string;
  updated_at: string;
}

export type DeliveryType = 'speech_bubble' | 'narration' | 'thought' | 'song';

export interface DialogueCreate {
  scene_id: string;
  character_id?: string;
  content: string;
  delivery_type: DeliveryType;
  sequence: number;
  sentiment_score?: number;
}

export interface DialogueUpdate {
  dialogue_id: string;
  scene_id?: string;
  character_id?: string;
  content?: string;
  delivery_type?: DeliveryType;
  sequence?: number;
  sentiment_score?: number;
}

export interface DialogueFilters {
  delivery_type?: DeliveryType;
  character_id?: string;
  sequence_min?: number;
  sequence_max?: number;
  sentiment_min?: number;
  sentiment_max?: number;
  created_after?: string;
  created_before?: string;
}

export interface DialogueStats {
  total_count: number;
  by_type: Record<DeliveryType, number>;
  by_character: Record<string, number>;
  average_sentiment: number;
  sequence_range: {
    min: number;
    max: number;
  };
}

export interface DialogueWithCharacter extends Dialogue {
  character?: {
    character_id: string;
    name: string;
    traits?: any;
  };
}

export interface DialogueWithScene extends Dialogue {
  scene?: {
    scene_id: string;
    title: string;
    event_id: string;
  };
}

export interface DialogueWithFullContext extends Dialogue {
  character?: {
    character_id: string;
    name: string;
    traits?: any;
  };
  scene?: {
    scene_id: string;
    title: string;
    event_id: string;
  };
  event?: {
    event_id: string;
    title: string;
    chapter_id: string;
  };
  chapter?: {
    chapter_id: string;
    title: string;
    world_id: string;
  };
  world?: {
    world_id: string;
    name: string;
  };
}

// Constants for delivery types
export const DELIVERY_TYPES: Record<DeliveryType, { label: string; icon: string; color: string }> = {
  speech_bubble: {
    label: 'Speech Bubble',
    icon: '💬',
    color: 'blue'
  },
  narration: {
    label: 'Narration',
    icon: '📝',
    color: 'gray'
  },
  thought: {
    label: 'Thought',
    icon: '💭',
    color: 'purple'
  },
  song: {
    label: 'Song',
    icon: '🎵',
    color: 'green'
  }
};

// Helper functions
export const getDeliveryTypeInfo = (type: DeliveryType) => {
  return DELIVERY_TYPES[type];
};

export const isValidDeliveryType = (type: string): type is DeliveryType => {
  return Object.keys(DELIVERY_TYPES).includes(type);
};

export const getSentimentColor = (score?: number): string => {
  if (!score) return 'text-gray-500';
  if (score > 0.3) return 'text-green-600';
  if (score < -0.3) return 'text-red-600';
  return 'text-yellow-600';
};

export const getSentimentLabel = (score?: number): string => {
  if (!score) return 'Neutral';
  if (score > 0.3) return 'Positive';
  if (score < -0.3) return 'Negative';
  return 'Neutral';
};
