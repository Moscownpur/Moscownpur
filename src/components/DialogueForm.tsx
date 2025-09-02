import React, { useState, useEffect } from 'react';
import { X, Plus, Save, Edit3 } from 'lucide-react';

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

interface DialogueFormProps {
  sceneId: string;
  characters: Character[];
  existingDialogues: Dialogue[];
  onSave: (dialogue: Omit<Dialogue, 'dialogue_id' | 'created_at' | 'updated_at'>) => void;
  onUpdate?: (dialogue: Dialogue) => void;
  onCancel: () => void;
  editingDialogue?: Dialogue | null;
  isOpen: boolean;
}

const DialogueForm: React.FC<DialogueFormProps> = ({
  sceneId,
  characters,
  existingDialogues,
  onSave,
  onUpdate,
  onCancel,
  editingDialogue,
  isOpen
}) => {
  const [content, setContent] = useState('');
  const [characterId, setCharacterId] = useState<string>('');
  const [deliveryType, setDeliveryType] = useState<'speech_bubble' | 'narration' | 'thought' | 'song'>('speech_bubble');
  const [sequence, setSequence] = useState(1);

  useEffect(() => {
    if (editingDialogue) {
      setContent(editingDialogue.content);
      setCharacterId(editingDialogue.character_id || '');
      setDeliveryType(editingDialogue.delivery_type);
      setSequence(editingDialogue.sequence);
    } else {
      // Auto-calculate next sequence number
      const maxSequence = existingDialogues.length > 0 
        ? Math.max(...existingDialogues.map(d => d.sequence))
        : 0;
      setSequence(maxSequence + 1);
      setContent('');
      setCharacterId('');
      setDeliveryType('speech_bubble');
    }
  }, [editingDialogue, existingDialogues]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) return;

    const dialogueData = {
      scene_id: sceneId,
      character_id: characterId || undefined,
      content: content.trim(),
      delivery_type: deliveryType,
      sequence,
      sentiment_score: undefined // Will be calculated by AI later
    };

    if (editingDialogue && onUpdate) {
      onUpdate({
        ...editingDialogue,
        ...dialogueData
      });
    } else {
      onSave(dialogueData);
    }

    // Reset form
    setContent('');
    setCharacterId('');
    setDeliveryType('speech_bubble');
    setSequence(existingDialogues.length + 1);
  };

  const handleCancel = () => {
    setContent('');
    setCharacterId('');
    setDeliveryType('speech_bubble');
    setSequence(1);
    onCancel();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            {editingDialogue ? 'Edit Dialogue' : 'Add New Dialogue'}
          </h2>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Character Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Character (Optional for narration)
            </label>
            <select
              value={characterId}
              onChange={(e) => setCharacterId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">No character (Narration)</option>
              {characters.map((character) => (
                <option key={character.character_id} value={character.character_id}>
                  {character.name}
                </option>
              ))}
            </select>
          </div>

          {/* Delivery Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Delivery Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'speech_bubble', label: 'Speech Bubble', icon: '💬' },
                { value: 'narration', label: 'Narration', icon: '📝' },
                { value: 'thought', label: 'Thought', icon: '💭' },
                { value: 'song', label: 'Song', icon: '🎵' }
              ].map((type) => (
                <label
                  key={type.value}
                  className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                    deliveryType === type.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <input
                    type="radio"
                    name="deliveryType"
                    value={type.value}
                    checked={deliveryType === type.value}
                    onChange={(e) => setDeliveryType(e.target.value as any)}
                    className="sr-only"
                  />
                  <span className="text-2xl mr-3">{type.icon}</span>
                  <span className="text-sm font-medium">{type.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Sequence */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sequence Number
            </label>
            <input
              type="number"
              value={sequence}
              onChange={(e) => setSequence(parseInt(e.target.value) || 1)}
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              This determines the order of dialogues in the scene
            </p>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dialogue Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              placeholder="Enter the dialogue, narration, thought, or song lyrics..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              {content.length} characters
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
              disabled={!content.trim()}
            >
              {editingDialogue ? (
                <>
                  <Edit3 className="w-4 h-4" />
                  <span>Update Dialogue</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Add Dialogue</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DialogueForm;
