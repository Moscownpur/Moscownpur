import React, { useState } from 'react';
import { motion } from 'framer-motion';
import NeonButton from './ui/NeonButton';
import { World } from '../types';

interface WorldFormProps {
  world?: World | null;
  onSubmit: (world: any) => void;
  onCancel: () => void;
}

const worldTypes = ['Universe', 'Planet', 'Magical Realm', 'Timeline Variant'];
const themes = ['mystical', 'dark', 'bright', 'cyberpunk', 'medieval', 'futuristic', 'natural', 'industrial', 'ethereal', 'cosmic'];
const timeLaws = ['Linear', 'Non-linear', 'Cyclical'];
const magicLaws = ['Enabled', 'Disabled', 'Rare', 'Scientific'];
const deathLaws = ['Permanent', 'Rebirth', 'Cyclical', 'Undefined'];

const WorldForm: React.FC<WorldFormProps> = ({ world, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: world?.name || '',
    type: world?.type || '',
    description: world?.description || '',
    creation_myth: world?.creation_myth || '',
    governing_laws: world?.governing_laws || {
      time: 'Linear',
      magic: 'Enabled',
      death: 'Permanent',
      technology_level: ''
    },
    dominant_species: world?.dominant_species || [],
    visual_style: world?.visual_style || '',
    theme: world?.theme || 'mystical',
    created_by: 'user-id' // This would come from auth context
  });

  const [newSpecies, setNewSpecies] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const addSpecies = () => {
    if (newSpecies.trim() && !formData.dominant_species.includes(newSpecies.trim())) {
      setFormData(prev => ({
        ...prev,
        dominant_species: [...prev.dominant_species, newSpecies.trim()]
      }));
      setNewSpecies('');
    }
  };

  const removeSpecies = (species: string) => {
    setFormData(prev => ({
      ...prev,
      dominant_species: prev.dominant_species.filter(s => s !== species)
    }));
  };

  return (
    <motion.form 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit} 
      className="space-y-8"
    >
      {/* Basic Info */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-6"
      >
        <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-2">
          ✨ Basic Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
              🌍 World Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-3 bg-white/10 dark:bg-slate-700/50 backdrop-blur-xl border border-white/20 dark:border-slate-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-slate-900 dark:text-white shadow-lg"
              placeholder="Enter your world's name..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
              🎭 World Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
              className="w-full px-4 py-3 bg-white/10 dark:bg-slate-700/50 backdrop-blur-xl border border-white/20 dark:border-slate-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-slate-900 dark:text-white shadow-lg"
              required
            >
              <option value="">Select type...</option>
              {worldTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
            📝 Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={3}
            className="w-full px-4 py-3 bg-white/10 dark:bg-slate-700/50 backdrop-blur-xl border border-white/20 dark:border-slate-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-slate-900 dark:text-white shadow-lg resize-none"
            placeholder="Describe your world..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
            🌟 Creation Myth
          </label>
          <textarea
            value={formData.creation_myth}
            onChange={(e) => setFormData(prev => ({ ...prev, creation_myth: e.target.value }))}
            rows={3}
            className="w-full px-4 py-3 bg-white/10 dark:bg-slate-700/50 backdrop-blur-xl border border-white/20 dark:border-slate-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-slate-900 dark:text-white shadow-lg resize-none"
            placeholder="How was this world created? Tell its origin story..."
          />
        </div>
      </motion.div>

      {/* Governing Laws */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-6"
      >
        <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-2">
          ⚖️ Governing Laws
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
              ⏰ Time
            </label>
            <select
              value={formData.governing_laws.time}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                governing_laws: { ...prev.governing_laws, time: e.target.value }
              }))}
              className="w-full px-4 py-3 bg-white/10 dark:bg-slate-700/50 backdrop-blur-xl border border-white/20 dark:border-slate-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-900 dark:text-white shadow-lg"
            >
              {timeLaws.map(law => (
                <option key={law} value={law}>{law}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
              ✨ Magic
            </label>
            <select
              value={formData.governing_laws.magic}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                governing_laws: { ...prev.governing_laws, magic: e.target.value }
              }))}
              className="w-full px-4 py-3 bg-white/10 dark:bg-slate-700/50 backdrop-blur-xl border border-white/20 dark:border-slate-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-900 dark:text-white shadow-lg"
            >
              {magicLaws.map(law => (
                <option key={law} value={law}>{law}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
              💀 Death
            </label>
            <select
              value={formData.governing_laws.death}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                governing_laws: { ...prev.governing_laws, death: e.target.value }
              }))}
              className="w-full px-4 py-3 bg-white/10 dark:bg-slate-700/50 backdrop-blur-xl border border-white/20 dark:border-slate-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-900 dark:text-white shadow-lg"
            >
              {deathLaws.map(law => (
                <option key={law} value={law}>{law}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
            🔧 Technology Level
          </label>
          <input
            type="text"
            value={formData.governing_laws.technology_level}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              governing_laws: { ...prev.governing_laws, technology_level: e.target.value }
            }))}
            className="w-full px-4 py-3 bg-white/10 dark:bg-slate-700/50 backdrop-blur-xl border border-white/20 dark:border-slate-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-900 dark:text-white shadow-lg"
            placeholder="e.g., Medieval, Modern, Futuristic, Stone Age..."
          />
        </div>
      </motion.div>

      {/* Species & Styling */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-6"
      >
        <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-2">
          🎨 Species & Styling
        </h3>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
            👥 Dominant Species
          </label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={newSpecies}
              onChange={(e) => setNewSpecies(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSpecies())}
              className="flex-1 px-4 py-3 bg-white/10 dark:bg-slate-700/50 backdrop-blur-xl border border-white/20 dark:border-slate-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-900 dark:text-white shadow-lg"
              placeholder="Add a species..."
            />
            <NeonButton
              type="button"
              onClick={addSpecies}
              variant="secondary"
              size="sm"
            >
              Add
            </NeonButton>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.dominant_species.map((species, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="px-3 py-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium flex items-center gap-2 cursor-pointer hover:shadow-lg transition-all duration-200"
                onClick={() => removeSpecies(species)}
              >
                {species}
                <span className="text-xs opacity-60 hover:opacity-100">✕</span>
              </motion.span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
              🎭 Visual Style
            </label>
            <input
              type="text"
              value={formData.visual_style}
              onChange={(e) => setFormData(prev => ({ ...prev, visual_style: e.target.value }))}
              className="w-full px-4 py-3 bg-white/10 dark:bg-slate-700/50 backdrop-blur-xl border border-white/20 dark:border-slate-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-900 dark:text-white shadow-lg"
              placeholder="e.g., Gothic, Minimalist, Baroque..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
              🌈 Theme
            </label>
            <select
              value={formData.theme}
              onChange={(e) => setFormData(prev => ({ ...prev, theme: e.target.value }))}
              className="w-full px-4 py-3 bg-white/10 dark:bg-slate-700/50 backdrop-blur-xl border border-white/20 dark:border-slate-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-900 dark:text-white shadow-lg"
            >
              {themes.map(theme => (
                <option key={theme} value={theme}>{theme}</option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex justify-end space-x-4 pt-8 border-t border-white/10"
      >
        <NeonButton
          type="button"
          onClick={onCancel}
          variant="secondary"
        >
          Cancel
        </NeonButton>
        <NeonButton
          type="submit"
          variant="primary"
        >
          <div className="flex items-center gap-2">
            <span>{world ? '✨ Update World' : '🌟 Create World'}</span>
          </div>
        </NeonButton>
      </motion.div>
    </motion.form>
  );
};

export default WorldForm;