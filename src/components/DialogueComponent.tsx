import React from 'react';
import { Heart, MessageCircle, Music, Type } from 'lucide-react';

interface Dialogue {
  dialogue_id: string;
  scene_id: string;
  character_id?: string;
  content: string;
  delivery_type: 'speech_bubble' | 'narration' | 'thought' | 'song';
  sequence: number;
  sentiment_score?: number;
  created_at: string;
  updated_at: string;
}

interface Character {
  character_id: string;
  name: string;
  traits?: any;
}

interface DialogueComponentProps {
  dialogue: Dialogue;
  character?: Character;
  onEdit?: (dialogue: Dialogue) => void;
  onDelete?: (dialogueId: string) => void;
  isEditable?: boolean;
}

const DialogueComponent: React.FC<DialogueComponentProps> = ({
  dialogue,
  character,
  onEdit,
  onDelete,
  isEditable = false
}) => {
  const getDeliveryTypeIcon = (type: string) => {
    switch (type) {
      case 'speech_bubble':
        return <MessageCircle className="w-4 h-4" />;
      case 'narration':
        return <Type className="w-4 h-4" />;
      case 'thought':
        return <Heart className="w-4 h-4" />;
      case 'song':
        return <Music className="w-4 h-4" />;
      default:
        return <MessageCircle className="w-4 h-4" />;
    }
  };

  const getDeliveryTypeColor = (type: string) => {
    switch (type) {
      case 'speech_bubble':
        return 'bg-blue-100 border-blue-300 text-blue-800';
      case 'narration':
        return 'bg-gray-100 border-gray-300 text-gray-800';
      case 'thought':
        return 'bg-purple-100 border-purple-300 text-purple-800';
      case 'song':
        return 'bg-green-100 border-green-300 text-green-800';
      default:
        return 'bg-blue-100 border-blue-300 text-blue-800';
    }
  };

  const getSentimentColor = (score?: number) => {
    if (!score) return 'text-gray-500';
    if (score > 0.3) return 'text-green-600';
    if (score < -0.3) return 'text-red-600';
    return 'text-yellow-600';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4 border-l-4 border-blue-500">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-full ${getDeliveryTypeColor(dialogue.delivery_type)}`}>
            {getDeliveryTypeIcon(dialogue.delivery_type)}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              {character && (
                <span className="font-semibold text-gray-800">{character.name}</span>
              )}
              <span className="text-sm text-gray-500">#{dialogue.sequence}</span>
            </div>
            <div className="text-xs text-gray-400 capitalize">
              {dialogue.delivery_type.replace('_', ' ')}
            </div>
          </div>
        </div>
        
        {isEditable && (
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit?.(dialogue)}
              className="text-blue-600 hover:text-blue-800 text-sm px-2 py-1 rounded hover:bg-blue-50"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete?.(dialogue.dialogue_id)}
              className="text-red-600 hover:text-red-800 text-sm px-2 py-1 rounded hover:bg-red-50"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      <div className="mb-3">
        <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
          {dialogue.content}
        </p>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center space-x-4">
          {dialogue.sentiment_score !== undefined && (
            <span className={`${getSentimentColor(dialogue.sentiment_score)}`}>
              Sentiment: {dialogue.sentiment_score.toFixed(2)}
            </span>
          )}
          <span>Created: {new Date(dialogue.created_at).toLocaleDateString()}</span>
        </div>
        
        {dialogue.updated_at !== dialogue.created_at && (
          <span>Updated: {new Date(dialogue.updated_at).toLocaleDateString()}</span>
        )}
      </div>
    </div>
  );
};

export default DialogueComponent;
