import React, { useState } from 'react';
import { Plus, MessageSquare, Filter, SortAsc, SortDesc } from 'lucide-react';
import DialogueComponent from './DialogueComponent';
import DialogueForm from './DialogueForm';

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

interface DialogueListProps {
  sceneId: string;
  dialogues: Dialogue[];
  characters: Character[];
  onAddDialogue: (dialogue: Omit<Dialogue, 'dialogue_id' | 'created_at' | 'updated_at'>) => void;
  onUpdateDialogue: (dialogue: Dialogue) => void;
  onDeleteDialogue: (dialogueId: string) => void;
  isEditable?: boolean;
}

const DialogueList: React.FC<DialogueListProps> = ({
  sceneId,
  dialogues,
  characters,
  onAddDialogue,
  onUpdateDialogue,
  onDeleteDialogue,
  isEditable = false
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDialogue, setEditingDialogue] = useState<Dialogue | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Filter dialogues by type
  const filteredDialogues = dialogues.filter(dialogue => {
    if (filterType === 'all') return true;
    return dialogue.delivery_type === filterType;
  });

  // Sort dialogues by sequence
  const sortedDialogues = [...filteredDialogues].sort((a, b) => {
    if (sortOrder === 'asc') {
      return a.sequence - b.sequence;
    } else {
      return b.sequence - a.sequence;
    }
  });

  const handleEdit = (dialogue: Dialogue) => {
    setEditingDialogue(dialogue);
    setIsFormOpen(true);
  };

  const handleDelete = (dialogueId: string) => {
    if (window.confirm('Are you sure you want to delete this dialogue?')) {
      onDeleteDialogue(dialogueId);
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingDialogue(null);
  };

  const handleSave = (dialogueData: Omit<Dialogue, 'dialogue_id' | 'created_at' | 'updated_at'>) => {
    if (editingDialogue) {
      onUpdateDialogue({
        ...editingDialogue,
        ...dialogueData
      });
    } else {
      onAddDialogue(dialogueData);
    }
    handleFormClose();
  };

  const getCharacterById = (characterId?: string) => {
    if (!characterId) return undefined;
    return characters.find(char => char.character_id === characterId);
  };

  const getDeliveryTypeCount = (type: string) => {
    return dialogues.filter(d => d.delivery_type === type).length;
  };

  return (
    <div className="space-y-6">
      {/* Header with Stats and Controls */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <MessageSquare className="w-5 h-5 mr-2 text-blue-600" />
              Scene Dialogues
            </h3>
            <p className="text-sm text-gray-600">
              {dialogues.length} total dialogue{dialogues.length !== 1 ? 's' : ''}
            </p>
          </div>
          
          {isEditable && (
            <button
              onClick={() => setIsFormOpen(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Dialogue</span>
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{getDeliveryTypeCount('speech_bubble')}</div>
            <div className="text-sm text-blue-800">Speech</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-600">{getDeliveryTypeCount('narration')}</div>
            <div className="text-sm text-gray-800">Narration</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{getDeliveryTypeCount('thought')}</div>
            <div className="text-sm text-purple-800">Thoughts</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{getDeliveryTypeCount('song')}</div>
            <div className="text-sm text-green-800">Songs</div>
          </div>
        </div>

        {/* Filters and Sort */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="speech_bubble">Speech</option>
              <option value="narration">Narration</option>
              <option value="thought">Thoughts</option>
              <option value="song">Songs</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              {sortOrder === 'asc' ? (
                <SortAsc className="w-4 h-4" />
              ) : (
                <SortDesc className="w-4 h-4" />
              )}
              <span>Sequence {sortOrder === 'asc' ? '↑' : '↓'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Dialogues List */}
      {sortedDialogues.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
          <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No dialogues yet</h3>
          <p className="text-gray-500 mb-4">
            {filterType === 'all' 
              ? 'Start building your scene by adding the first dialogue.'
              : `No ${filterType.replace('_', ' ')} dialogues found.`
            }
          </p>
          {isEditable && filterType === 'all' && (
            <button
              onClick={() => setIsFormOpen(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Add First Dialogue
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {sortedDialogues.map((dialogue) => (
            <DialogueComponent
              key={dialogue.dialogue_id}
              dialogue={dialogue}
              character={getCharacterById(dialogue.character_id)}
              onEdit={isEditable ? handleEdit : undefined}
              onDelete={isEditable ? handleDelete : undefined}
              isEditable={isEditable}
            />
          ))}
        </div>
      )}

      {/* Dialogue Form Modal */}
      <DialogueForm
        sceneId={sceneId}
        characters={characters}
        existingDialogues={dialogues}
        onSave={handleSave}
        onUpdate={handleSave}
        onCancel={handleFormClose}
        editingDialogue={editingDialogue}
        isOpen={isFormOpen}
      />
    </div>
  );
};

export default DialogueList;
