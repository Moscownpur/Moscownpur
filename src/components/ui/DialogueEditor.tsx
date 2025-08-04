import React, { useState } from 'react';
import { Plus, MessageSquare, Type, Users, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, Reorder } from 'framer-motion';
import { SceneLineWithCharacter, Character } from '../../types';
import { useSceneLines } from '../../hooks/useSceneLines';
import DialogueLine from './DialogueLine';
import NeonButton from './NeonButton';

interface DialogueEditorProps {
  sceneId: string;
  characters: Character[];
  onClose?: () => void;
}

const DialogueEditor: React.FC<DialogueEditorProps> = ({
  sceneId,
  characters,
  onClose
}) => {
  const { lines, loading, addCharacterLine, addNarrationLine, updateLine, deleteLine, reorderLines } = useSceneLines(sceneId);
  const [editingLineId, setEditingLineId] = useState<string | null>(null);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [narrationText, setNarrationText] = useState('');
  const [selectedCharacter, setSelectedCharacter] = useState<string>('');
  const [characterText, setCharacterText] = useState('');

  const handleAddCharacterLine = async () => {
    if (selectedCharacter && characterText.trim()) {
      await addCharacterLine(selectedCharacter, characterText.trim());
      setCharacterText('');
      setSelectedCharacter('');
      setShowAddMenu(false);
    }
  };

  const handleAddNarrationLine = async () => {
    if (narrationText.trim()) {
      await addNarrationLine(narrationText.trim());
      setNarrationText('');
      setShowAddMenu(false);
    }
  };

  const handleEditLine = async (id: string, text: string) => {
    await updateLine(id, { text });
    setEditingLineId(null);
  };

  const handleDeleteLine = async (id: string) => {
    await deleteLine(id);
  };

  const handleReorder = async (newOrder: SceneLineWithCharacter[]) => {
    await reorderLines(newOrder);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-white/20 border-t-white/80"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-heading gradient-text-cosmic mb-2">
            Scene Dialogue
          </h3>
          <p className="text-body text-white/60">
            Script character conversations and scene descriptions
          </p>
        </div>
        <div className="flex items-center gap-3">
          <NeonButton
            onClick={() => setShowAddMenu(!showAddMenu)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Line
            {showAddMenu ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </NeonButton>
          {onClose && (
            <button
              onClick={onClose}
              className="px-4 py-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg smooth-transition"
            >
              Close
            </button>
          )}
        </div>
      </div>

      {/* Add Line Menu */}
      {showAddMenu && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="glass-card rounded-xl p-6 space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Character Dialogue */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-400" />
                <h4 className="text-subheading text-white">Character Dialogue</h4>
              </div>
              <select
                value={selectedCharacter}
                onChange={(e) => setSelectedCharacter(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500/50"
              >
                <option value="">Select a character...</option>
                {characters.map((character) => (
                  <option key={character.id} value={character.id}>
                    {character.name}
                  </option>
                ))}
              </select>
              <textarea
                value={characterText}
                onChange={(e) => setCharacterText(e.target.value)}
                placeholder="Enter character dialogue..."
                className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white placeholder-white/50 focus:outline-none focus:border-blue-500/50 resize-none"
                rows={3}
              />
              <button
                onClick={handleAddCharacterLine}
                disabled={!selectedCharacter || !characterText.trim()}
                className="w-full px-4 py-2 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-lg hover:bg-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed smooth-transition"
              >
                Add Character Line
              </button>
            </div>

            {/* Narration */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Type className="w-5 h-5 text-purple-400" />
                <h4 className="text-subheading text-white">Scene Narration</h4>
              </div>
              <textarea
                value={narrationText}
                onChange={(e) => setNarrationText(e.target.value)}
                placeholder="Enter scene description, mood, or transition..."
                className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white placeholder-white/50 focus:outline-none focus:border-purple-500/50 resize-none"
                rows={5}
              />
              <button
                onClick={handleAddNarrationLine}
                disabled={!narrationText.trim()}
                className="w-full px-4 py-2 bg-purple-500/20 border border-purple-500/30 text-purple-400 rounded-lg hover:bg-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed smooth-transition"
              >
                Add Narration
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Dialogue Lines */}
      <div className="space-y-4">
        {lines.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card rounded-xl p-12 text-center"
          >
            <MessageSquare className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <h4 className="text-subheading text-white mb-2">
              No dialogue yet
            </h4>
            <p className="text-body text-white/60 mb-6">
              Start building your scene by adding character dialogue and narration
            </p>
            <button
              onClick={() => setShowAddMenu(true)}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:scale-105 smooth-transition soft-glow-purple"
            >
              Add First Line
            </button>
          </motion.div>
        ) : (
          <Reorder.Group
            axis="y"
            values={lines}
            onReorder={handleReorder}
            className="space-y-3"
          >
            {lines.map((line) => (
              <Reorder.Item
                key={line.id}
                value={line}
                className="cursor-move"
              >
                <DialogueLine
                  line={line}
                  onEdit={handleEditLine}
                  onDelete={handleDeleteLine}
                  isEditing={editingLineId === line.id}
                  onEditComplete={() => setEditingLineId(null)}
                />
              </Reorder.Item>
            ))}
          </Reorder.Group>
        )}
      </div>

      {/* Character Info */}
      {characters.length > 0 && (
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-white/60" />
            <h4 className="text-subheading text-white">Scene Characters</h4>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {characters.map((character) => (
              <div
                key={character.id}
                className="p-3 glass-card rounded-lg text-center hover:soft-glow smooth-transition cursor-pointer"
                onClick={() => {
                  setSelectedCharacter(character.id);
                  setShowAddMenu(true);
                }}
              >
                <div className="text-sm font-medium text-white mb-1">
                  {character.name}
                </div>
                <div className="text-xs text-white/60">
                  {character.species}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default DialogueEditor; 