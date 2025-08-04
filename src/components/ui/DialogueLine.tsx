import React, { useState } from 'react';
import { Edit2, Trash2, MessageSquare, Type } from 'lucide-react';
import { SceneLineWithCharacter } from '../../types';
import { motion } from 'framer-motion';

interface DialogueLineProps {
  line: SceneLineWithCharacter;
  onEdit: (id: string, text: string) => void;
  onDelete: (id: string) => void;
  isEditing?: boolean;
  onEditComplete?: () => void;
}

const DialogueLine: React.FC<DialogueLineProps> = ({
  line,
  onEdit,
  onDelete,
  isEditing = false,
  onEditComplete
}) => {
  const [editText, setEditText] = useState(line.text);
  const [isHovered, setIsHovered] = useState(false);

  const getRoleColor = (role?: string) => {
    switch (role) {
      case 'protagonist':
        return 'text-green-400 border-green-400/20 bg-green-400/10';
      case 'antagonist':
        return 'text-red-400 border-red-400/20 bg-red-400/10';
      case 'ally':
        return 'text-blue-400 border-blue-400/20 bg-blue-400/10';
      case 'enemy':
        return 'text-orange-400 border-orange-400/20 bg-orange-400/10';
      default:
        return 'text-yellow-400 border-yellow-400/20 bg-yellow-400/10';
    }
  };

  const handleSave = () => {
    if (editText.trim() !== line.text) {
      onEdit(line.id, editText.trim());
    }
    onEditComplete?.();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === 'Escape') {
      setEditText(line.text);
      onEditComplete?.();
    }
  };

  if (isEditing) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-xl p-4 mb-3"
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            {line.type === 'character' ? (
              <MessageSquare className="w-5 h-5 text-blue-400" />
            ) : (
              <Type className="w-5 h-5 text-purple-400" />
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium text-white/80">
                {line.display_name}
              </span>
              {line.type === 'character' && line.character_role && (
                <span className={`px-2 py-1 text-xs rounded-full border ${getRoleColor(line.character_role)}`}>
                  {line.character_role}
                </span>
              )}
            </div>
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={handleKeyPress}
              onBlur={handleSave}
              className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white placeholder-white/50 focus:outline-none focus:border-purple-500/50 resize-none"
              rows={Math.max(2, editText.split('\n').length)}
              autoFocus
            />
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ scale: 1.01 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="glass-card rounded-xl p-4 mb-3 group hover:soft-glow smooth-transition"
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          {line.type === 'character' ? (
            <MessageSquare className="w-5 h-5 text-blue-400" />
          ) : (
            <Type className="w-5 h-5 text-purple-400" />
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-white/80">
                {line.type === 'character' ? `@${line.display_name}` : line.display_name}
              </span>
              {line.type === 'character' && line.character_role && (
                <span className={`px-2 py-1 text-xs rounded-full border ${getRoleColor(line.character_role)}`}>
                  {line.character_role}
                </span>
              )}
            </div>
            <div className={`flex items-center gap-2 opacity-0 group-hover:opacity-100 smooth-transition ${isHovered ? 'opacity-100' : ''}`}>
              <button
                onClick={() => onEdit(line.id, line.text)}
                className="p-1 text-white/60 hover:text-white hover:bg-white/10 rounded smooth-transition"
                title="Edit line"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(line.id)}
                className="p-1 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded smooth-transition"
                title="Delete line"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className={`${line.type === 'narration' ? 'italic text-white/70' : 'text-white'}`}>
            {line.text.split('\n').map((paragraph, index) => (
              <p key={index} className={index > 0 ? 'mt-2' : ''}>
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DialogueLine; 