import React, { useState, useEffect } from 'react';
import { X, Plus, Save, Edit3 } from 'lucide-react';
import toast from 'react-hot-toast';

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

interface Scene {
  scene_id: string;
  title: string;
  event_id: string;
}

interface Event {
  event_id: string;
  title: string;
  chapter_id: string;
}

interface Chapter {
  chapter_id: string;
  title: string;
  world_id: string;
}

interface World {
  world_id: string;
  name: string;
}

interface DialogueFormProps {
  sceneId: string;
  characters: Character[];
  scenes: Scene[];
  events: Event[];
  chapters: Chapter[];
  worlds: World[];
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
  scenes,
  events,
  chapters,
  worlds,
  existingDialogues,
  onSave,
  onUpdate,
  onCancel,
  editingDialogue,
  isOpen
}) => {
  const [content, setContent] = useState('');
  const [selectedSceneId, setSelectedSceneId] = useState<string>(sceneId);
  const [characterId, setCharacterId] = useState<string>('');
  const [deliveryType, setDeliveryType] = useState<'speech_bubble' | 'narration' | 'thought' | 'song'>('speech_bubble');
  const [sequence, setSequence] = useState(1);

  useEffect(() => {
    if (editingDialogue) {
      setContent(editingDialogue.content);
      setSelectedSceneId(editingDialogue.scene_id);
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
      setSelectedSceneId(sceneId);
      setCharacterId('');
      setDeliveryType('speech_bubble');
    }
  }, [editingDialogue, existingDialogues, sceneId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast.error('Please enter dialogue content');
      return;
    }
    
    if (!selectedSceneId) {
      toast.error('No scene selected. Please select a scene first.');
      return;
    }

    const dialogueData = {
      scene_id: selectedSceneId,
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
    setSelectedSceneId(sceneId);
    setCharacterId('');
    setDeliveryType('speech_bubble');
    setSequence(1);
    onCancel();
  };



  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[9999] backdrop-blur-sm">
      <div className="glass-card rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto border border-white/20">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-xl font-semibold text-white">
            {editingDialogue ? 'Edit Dialogue' : 'Add New Dialogue'}
          </h2>
          <button
            onClick={handleCancel}
            className="text-white/60 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Scene Selection */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Scene *
            </label>
            <select
              value={selectedSceneId}
              onChange={(e) => setSelectedSceneId(e.target.value)}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="" className="bg-gray-800 text-white">Select a scene...</option>
              {scenes.map((scene) => {
                // Find the event, chapter, and world for this scene
                const event = events.find(e => e.event_id === scene.event_id);
                const chapter = event ? chapters.find(c => c.chapter_id === event.chapter_id) : null;
                const world = chapter ? worlds.find(w => w.world_id === chapter.world_id) : null;
                
                const context = world && chapter && event 
                  ? `(${world.name} → ${chapter.title} → ${event.title})`
                  : '';
                
                return (
                  <option 
                    key={scene.scene_id} 
                    value={scene.scene_id} 
                    className="bg-gray-800 text-white"
                  >
                    {scene.title} {context}
                  </option>
                );
              })}
            </select>
            <p className="text-xs text-white/60 mt-1">
              Choose the scene where this dialogue will appear
            </p>
            
            {/* Warning if changing scene during edit */}
            {editingDialogue && selectedSceneId !== editingDialogue.scene_id && (
              <div className="mt-2 p-2 bg-yellow-500/20 border border-yellow-500/40 rounded-lg">
                <p className="text-yellow-400 text-xs">
                  ⚠️ Changing the scene may affect dialogue permissions and context
                </p>
              </div>
            )}
          </div>
          
          {/* Character Selection */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Character (Optional for narration)
            </label>
            <select
              value={characterId}
              onChange={(e) => setCharacterId(e.target.value)}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="" className="bg-gray-800 text-white">No character (Narration)</option>
              {characters.map((character) => (
                <option key={character.character_id} value={character.character_id} className="bg-gray-800 text-white">
                  {character.name}
                </option>
              ))}
            </select>
          </div>

          {/* Delivery Type */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
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
                      ? 'border-blue-500 bg-blue-500/20 text-blue-400'
                      : 'border-white/20 bg-white/5 hover:border-white/40 text-white/80 hover:text-white'
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
            <label className="block text-sm font-medium text-white mb-2">
              Sequence Number
            </label>
            <input
              type="number"
              value={sequence}
              onChange={(e) => setSequence(parseInt(e.target.value) || 1)}
              min="1"
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-white/60 mt-1">
              This determines the order of dialogues in the scene
            </p>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Dialogue Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              placeholder="Enter the dialogue, narration, thought, or song lyrics..."
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
              required
            />
            <p className="text-xs text-white/60 mt-1">
              {content.length} characters
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-white/80 bg-white/10 rounded-lg hover:bg-white/20 transition-colors border border-white/20"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:scale-105 transition-all duration-300 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!content.trim() || !sceneId}
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
