import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Plus, X } from 'lucide-react';
import { Character } from '../types';
import { useWorlds } from '../hooks/useWorlds';

interface CharacterFormProps {
  character?: Character | null;
  onSubmit: (character: any) => void;
  onCancel: () => void;
}

const CharacterForm: React.FC<CharacterFormProps> = ({ character, onSubmit, onCancel }) => {
  const { worlds, loading: worldsLoading } = useWorlds();
  const [formData, setFormData] = useState({
    name: character?.name || '',
    world_id: character?.world_id || '',
    aliases: character?.aliases || [],
    gender: character?.gender || '',
    birth_date: character?.birth_date || '',
    age: character?.age || 0,
    origin: character?.origin || '',
    current_location: character?.current_location || '',
    species: character?.species || '',
    race: character?.race || '',
    caste_or_class: character?.caste_or_class || '',
    religion: character?.religion || '',
    profession: character?.profession || '',
    status: (character?.status as 'Alive' | 'Dead' | 'Unknown' | 'Ascended') || 'Alive',
    arc_summary: character?.arc_summary || '',
    languages: character?.languages || [],
    skills_and_abilities: character?.skills_and_abilities || [],
    affiliations: character?.affiliations || [],
    notable_events: character?.notable_events || [],
    physical_appearance: character?.physical_appearance || {
      height: '',
      eye_color: '',
      hair_color: '',
      build: '',
      distinguishing_marks: []
    },
    personality: character?.personality || {
      traits: [],
      strengths: [],
      weaknesses: [],
      flaws: [],
      fears: []
    },
    relationships: character?.relationships || [],
    created_by: 'user-id'
  });

  const [newAlias, setNewAlias] = useState('');
  const [newLanguage, setNewLanguage] = useState('');
  const [newSkill, setNewSkill] = useState('');
  const [newAffiliation, setNewAffiliation] = useState('');
  const [newEvent, setNewEvent] = useState('');
  const [newMark, setNewMark] = useState('');
  const [newTrait, setNewTrait] = useState('');
  const [newStrength, setNewStrength] = useState('');
  const [newWeakness, setNewWeakness] = useState('');
  const [newFlaw, setNewFlaw] = useState('');
  const [newFear, setNewFear] = useState('');

  // Relationship management
  const [newRelationship, setNewRelationship] = useState({
    character_id: '',
    relationship_type: '',
    status: 'Active',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const addAlias = () => {
    if (newAlias.trim() && !formData.aliases.includes(newAlias.trim())) {
      setFormData(prev => ({
        ...prev,
        aliases: [...prev.aliases, newAlias.trim()]
      }));
      setNewAlias('');
    }
  };

  const removeAlias = (alias: string) => {
    setFormData(prev => ({
      ...prev,
      aliases: prev.aliases.filter(a => a !== alias)
    }));
  };

  const addLanguage = () => {
    if (newLanguage.trim() && !formData.languages.includes(newLanguage.trim())) {
      setFormData(prev => ({
        ...prev,
        languages: [...prev.languages, newLanguage.trim()]
      }));
      setNewLanguage('');
    }
  };

  const removeLanguage = (language: string) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.filter(l => l !== language)
    }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills_and_abilities.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills_and_abilities: [...prev.skills_and_abilities, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills_and_abilities: prev.skills_and_abilities.filter(s => s !== skill)
    }));
  };

  const addAffiliation = () => {
    if (newAffiliation.trim() && !formData.affiliations.includes(newAffiliation.trim())) {
      setFormData(prev => ({
        ...prev,
        affiliations: [...prev.affiliations, newAffiliation.trim()]
      }));
      setNewAffiliation('');
    }
  };

  const removeAffiliation = (affiliation: string) => {
    setFormData(prev => ({
      ...prev,
      affiliations: prev.affiliations.filter(a => a !== affiliation)
    }));
  };

  const addEvent = () => {
    if (newEvent.trim() && !formData.notable_events.includes(newEvent.trim())) {
      setFormData(prev => ({
        ...prev,
        notable_events: [...prev.notable_events, newEvent.trim()]
      }));
      setNewEvent('');
    }
  };

  const removeEvent = (event: string) => {
    setFormData(prev => ({
      ...prev,
      notable_events: prev.notable_events.filter(e => e !== event)
    }));
  };

  const addMark = () => {
    if (newMark.trim() && !formData.physical_appearance.distinguishing_marks.includes(newMark.trim())) {
      setFormData(prev => ({
        ...prev,
        physical_appearance: {
          ...prev.physical_appearance,
          distinguishing_marks: [...prev.physical_appearance.distinguishing_marks, newMark.trim()]
        }
      }));
      setNewMark('');
    }
  };

  const removeMark = (mark: string) => {
    setFormData(prev => ({
      ...prev,
      physical_appearance: {
        ...prev.physical_appearance,
        distinguishing_marks: prev.physical_appearance.distinguishing_marks.filter(m => m !== mark)
      }
    }));
  };

  const addTrait = () => {
    if (newTrait.trim() && !formData.personality.traits.includes(newTrait.trim())) {
      setFormData(prev => ({
        ...prev,
        personality: {
          ...prev.personality,
          traits: [...prev.personality.traits, newTrait.trim()]
        }
      }));
      setNewTrait('');
    }
  };

  const removeTrait = (trait: string) => {
    setFormData(prev => ({
      ...prev,
      personality: {
        ...prev.personality,
        traits: prev.personality.traits.filter(t => t !== trait)
      }
    }));
  };

  const addStrength = () => {
    if (newStrength.trim() && !formData.personality.strengths.includes(newStrength.trim())) {
      setFormData(prev => ({
        ...prev,
        personality: {
          ...prev.personality,
          strengths: [...prev.personality.strengths, newStrength.trim()]
        }
      }));
      setNewStrength('');
    }
  };

  const removeStrength = (strength: string) => {
    setFormData(prev => ({
      ...prev,
      personality: {
        ...prev.personality,
        strengths: prev.personality.strengths.filter(s => s !== strength)
      }
    }));
  };

  const addWeakness = () => {
    if (newWeakness.trim() && !formData.personality.weaknesses.includes(newWeakness.trim())) {
      setFormData(prev => ({
        ...prev,
        personality: {
          ...prev.personality,
          weaknesses: [...prev.personality.weaknesses, newWeakness.trim()]
        }
      }));
      setNewWeakness('');
    }
  };

  const removeWeakness = (weakness: string) => {
    setFormData(prev => ({
      ...prev,
      personality: {
        ...prev.personality,
        weaknesses: prev.personality.weaknesses.filter(w => w !== weakness)
      }
    }));
  };

  const addFlaw = () => {
    if (newFlaw.trim() && !formData.personality.flaws.includes(newFlaw.trim())) {
      setFormData(prev => ({
        ...prev,
        personality: {
          ...prev.personality,
          flaws: [...prev.personality.flaws, newFlaw.trim()]
        }
      }));
      setNewFlaw('');
    }
  };

  const removeFlaw = (flaw: string) => {
    setFormData(prev => ({
      ...prev,
      personality: {
        ...prev.personality,
        flaws: prev.personality.flaws.filter(f => f !== flaw)
      }
    }));
  };

  const addFear = () => {
    if (newFear.trim() && !formData.personality.fears.includes(newFear.trim())) {
      setFormData(prev => ({
        ...prev,
        personality: {
          ...prev.personality,
          fears: [...prev.personality.fears, newFear.trim()]
        }
      }));
      setNewFear('');
    }
  };

  const removeFear = (fear: string) => {
    setFormData(prev => ({
      ...prev,
      personality: {
        ...prev.personality,
        fears: prev.personality.fears.filter(f => f !== fear)
      }
    }));
  };

  const addRelationship = () => {
    if (newRelationship.character_id.trim() && newRelationship.relationship_type.trim()) {
      const relationship = {
        character_id: newRelationship.character_id.trim(),
        relationship_type: newRelationship.relationship_type.trim(),
        status: newRelationship.status,
        notes: newRelationship.notes.trim()
      };

      setFormData(prev => ({
        ...prev,
        relationships: [...prev.relationships, relationship]
      }));

      setNewRelationship({
        character_id: '',
        relationship_type: '',
        status: 'Active',
        notes: ''
      });
    }
  };

  const removeRelationship = (index: number) => {
    setFormData(prev => ({
      ...prev,
      relationships: prev.relationships.filter((_, i) => i !== index)
    }));
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-subheading gradient-text-cosmic flex items-center gap-2">
          <Users size={20} />
          Basic Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-body font-medium mb-2">Character Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-3 glass-card rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter character name"
              required
            />
          </div>

          <div>
            <label className="block text-body font-medium mb-2">Gender</label>
            <input
              type="text"
              value={formData.gender}
              onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
              className="w-full px-4 py-3 glass-card rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Character gender"
            />
          </div>
        </div>

        <div>
          <label className="block text-body font-medium mb-2">World *</label>
          <select
            value={formData.world_id}
            onChange={(e) => setFormData(prev => ({ ...prev, world_id: e.target.value }))}
            className="w-full px-4 py-3 glass-card rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={worldsLoading}
            required
          >
            <option value="">Select a world</option>
            {worlds.map(world => (
              <option key={world.id} value={world.id}>{world.name}</option>
            ))}
          </select>
          {worlds.length === 0 && !worldsLoading && (
            <p className="text-sm text-yellow-400 mt-1">No worlds available. Create a world first.</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-body font-medium mb-2">Age</label>
            <input
              type="number"
              value={formData.age}
              onChange={(e) => setFormData(prev => ({ ...prev, age: parseInt(e.target.value) || 0 }))}
              className="w-full px-4 py-3 glass-card rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Age"
              min="0"
            />
          </div>

          <div>
            <label className="block text-body font-medium mb-2">Species</label>
            <input
              type="text"
              value={formData.species}
              onChange={(e) => setFormData(prev => ({ ...prev, species: e.target.value }))}
              className="w-full px-4 py-3 glass-card rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Character species"
            />
          </div>

          <div>
            <label className="block text-body font-medium mb-2">Race</label>
            <input
              type="text"
              value={formData.race}
              onChange={(e) => setFormData(prev => ({ ...prev, race: e.target.value }))}
              className="w-full px-4 py-3 glass-card rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Character race"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-body font-medium mb-2">Origin</label>
            <input
              type="text"
              value={formData.origin}
              onChange={(e) => setFormData(prev => ({ ...prev, origin: e.target.value }))}
              className="w-full px-4 py-3 glass-card rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Place of origin"
            />
          </div>

          <div>
            <label className="block text-body font-medium mb-2">Current Location</label>
            <input
              type="text"
              value={formData.current_location}
              onChange={(e) => setFormData(prev => ({ ...prev, current_location: e.target.value }))}
              className="w-full px-4 py-3 glass-card rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Current whereabouts"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-body font-medium mb-2">Profession</label>
            <input
              type="text"
              value={formData.profession}
              onChange={(e) => setFormData(prev => ({ ...prev, profession: e.target.value }))}
              className="w-full px-4 py-3 glass-card rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Occupation"
            />
          </div>

          <div>
            <label className="block text-body font-medium mb-2">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
              className="w-full px-4 py-3 glass-card rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Alive">Alive</option>
              <option value="Dead">Dead</option>
              <option value="Unknown">Unknown</option>
              <option value="Ascended">Ascended</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-body font-medium mb-2">Birth Date</label>
          <input
            type="text"
            value={formData.birth_date}
            onChange={(e) => setFormData(prev => ({ ...prev, birth_date: e.target.value }))}
            className="w-full px-4 py-3 glass-card rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Birth date or period"
          />
        </div>

        <div>
          <label className="block text-body font-medium mb-2">Arc Summary</label>
          <textarea
            value={formData.arc_summary}
            onChange={(e) => setFormData(prev => ({ ...prev, arc_summary: e.target.value }))}
            className="w-full px-4 py-3 glass-card rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Character's story arc..."
            rows={3}
          />
        </div>
      </div>

      {/* Aliases */}
      <div className="space-y-4">
        <h3 className="text-subheading gradient-text-cosmic">Aliases</h3>
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={newAlias}
              onChange={(e) => setNewAlias(e.target.value)}
              className="flex-1 px-4 py-2 glass-card rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add an alias..."
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAlias())}
            />
            <button
              type="button"
              onClick={addAlias}
              className="px-4 py-2 glass-card-cosmic rounded-lg text-white hover:soft-glow-cosmic smooth-transition"
            >
              <Plus size={16} />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.aliases.map((alias, index) => (
              <span
                key={index}
                className="flex items-center gap-2 px-3 py-1 glass-card rounded-full text-sm"
              >
                {alias}
                <button
                  type="button"
                  onClick={() => removeAlias(alias)}
                  className="text-red-400 hover:text-red-300"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Physical Appearance */}
      <div className="space-y-4">
        <h3 className="text-subheading gradient-text-cosmic">Physical Appearance</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-body font-medium mb-2">Height</label>
            <input
              type="text"
              value={formData.physical_appearance.height}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                physical_appearance: { ...prev.physical_appearance, height: e.target.value }
              }))}
              className="w-full px-4 py-3 glass-card rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Height"
            />
          </div>
          <div>
            <label className="block text-body font-medium mb-2">Build</label>
            <input
              type="text"
              value={formData.physical_appearance.build}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                physical_appearance: { ...prev.physical_appearance, build: e.target.value }
              }))}
              className="w-full px-4 py-3 glass-card rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Body build"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-body font-medium mb-2">Eye Color</label>
            <input
              type="text"
              value={formData.physical_appearance.eye_color}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                physical_appearance: { ...prev.physical_appearance, eye_color: e.target.value }
              }))}
              className="w-full px-4 py-3 glass-card rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Eye color"
            />
          </div>
          <div>
            <label className="block text-body font-medium mb-2">Hair Color</label>
            <input
              type="text"
              value={formData.physical_appearance.hair_color}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                physical_appearance: { ...prev.physical_appearance, hair_color: e.target.value }
              }))}
              className="w-full px-4 py-3 glass-card rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Hair color"
            />
          </div>
        </div>

        {/* Distinguishing Marks */}
        <div className="space-y-3">
          <label className="block text-body font-medium mb-2">Distinguishing Marks</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newMark}
              onChange={(e) => setNewMark(e.target.value)}
              className="flex-1 px-4 py-2 glass-card rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add a distinguishing mark..."
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addMark())}
            />
            <button
              type="button"
              onClick={addMark}
              className="px-4 py-2 glass-card-cosmic rounded-lg text-white hover:soft-glow-cosmic smooth-transition"
            >
              <Plus size={16} />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.physical_appearance.distinguishing_marks.map((mark, index) => (
              <span
                key={index}
                className="flex items-center gap-2 px-3 py-1 glass-card rounded-full text-sm"
              >
                {mark}
                <button
                  type="button"
                  onClick={() => removeMark(mark)}
                  className="text-red-400 hover:text-red-300"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Personality */}
      <div className="space-y-4">
        <h3 className="text-subheading gradient-text-cosmic">Personality</h3>

        {/* Traits */}
        <div className="space-y-3">
          <label className="block text-body font-medium mb-2">Traits</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newTrait}
              onChange={(e) => setNewTrait(e.target.value)}
              className="flex-1 px-4 py-2 glass-card rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add a personality trait..."
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTrait())}
            />
            <button
              type="button"
              onClick={addTrait}
              className="px-4 py-2 glass-card-cosmic rounded-lg text-white hover:soft-glow-cosmic smooth-transition"
            >
              <Plus size={16} />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.personality.traits.map((trait, index) => (
              <span
                key={index}
                className="flex items-center gap-2 px-3 py-1 glass-card rounded-full text-sm"
              >
                {trait}
                <button
                  type="button"
                  onClick={() => removeTrait(trait)}
                  className="text-red-400 hover:text-red-300"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Strengths */}
        <div className="space-y-3">
          <label className="block text-body font-medium mb-2">Strengths</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newStrength}
              onChange={(e) => setNewStrength(e.target.value)}
              className="flex-1 px-4 py-2 glass-card rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add a strength..."
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addStrength())}
            />
            <button
              type="button"
              onClick={addStrength}
              className="px-4 py-2 glass-card-cosmic rounded-lg text-white hover:soft-glow-cosmic smooth-transition"
            >
              <Plus size={16} />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.personality.strengths.map((strength, index) => (
              <span
                key={index}
                className="flex items-center gap-2 px-3 py-1 glass-card rounded-full text-sm"
              >
                {strength}
                <button
                  type="button"
                  onClick={() => removeStrength(strength)}
                  className="text-red-400 hover:text-red-300"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Weaknesses */}
        <div className="space-y-3">
          <label className="block text-body font-medium mb-2">Weaknesses</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newWeakness}
              onChange={(e) => setNewWeakness(e.target.value)}
              className="flex-1 px-4 py-2 glass-card rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add a weakness..."
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addWeakness())}
            />
            <button
              type="button"
              onClick={addWeakness}
              className="px-4 py-2 glass-card-cosmic rounded-lg text-white hover:soft-glow-cosmic smooth-transition"
            >
              <Plus size={16} />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.personality.weaknesses.map((weakness, index) => (
              <span
                key={index}
                className="flex items-center gap-2 px-3 py-1 glass-card rounded-full text-sm"
              >
                {weakness}
                <button
                  type="button"
                  onClick={() => removeWeakness(weakness)}
                  className="text-red-400 hover:text-red-300"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Flaws */}
        <div className="space-y-3">
          <label className="block text-body font-medium mb-2">Flaws</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newFlaw}
              onChange={(e) => setNewFlaw(e.target.value)}
              className="flex-1 px-4 py-2 glass-card rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add a flaw..."
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFlaw())}
            />
            <button
              type="button"
              onClick={addFlaw}
              className="px-4 py-2 glass-card-cosmic rounded-lg text-white hover:soft-glow-cosmic smooth-transition"
            >
              <Plus size={16} />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.personality.flaws.map((flaw, index) => (
              <span
                key={index}
                className="flex items-center gap-2 px-3 py-1 glass-card rounded-full text-sm"
              >
                {flaw}
                <button
                  type="button"
                  onClick={() => removeFlaw(flaw)}
                  className="text-red-400 hover:text-red-300"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Fears */}
        <div className="space-y-3">
          <label className="block text-body font-medium mb-2">Fears</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newFear}
              onChange={(e) => setNewFear(e.target.value)}
              className="flex-1 px-4 py-2 glass-card rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add a fear..."
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFear())}
            />
            <button
              type="button"
              onClick={addFear}
              className="px-4 py-2 glass-card-cosmic rounded-lg text-white hover:soft-glow-cosmic smooth-transition"
            >
              <Plus size={16} />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.personality.fears.map((fear, index) => (
              <span
                key={index}
                className="flex items-center gap-2 px-3 py-1 glass-card rounded-full text-sm"
              >
                {fear}
                <button
                  type="button"
                  onClick={() => removeFear(fear)}
                  className="text-red-400 hover:text-red-300"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Skills and Languages */}
      <div className="space-y-4">
        <h3 className="text-subheading gradient-text-cosmic">Skills & Languages</h3>

        {/* Languages */}
        <div className="space-y-3">
          <label className="block text-body font-medium mb-2">Languages</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newLanguage}
              onChange={(e) => setNewLanguage(e.target.value)}
              className="flex-1 px-4 py-2 glass-card rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add a language..."
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addLanguage())}
            />
            <button
              type="button"
              onClick={addLanguage}
              className="px-4 py-2 glass-card-cosmic rounded-lg text-white hover:soft-glow-cosmic smooth-transition"
            >
              <Plus size={16} />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.languages.map((language, index) => (
              <span
                key={index}
                className="flex items-center gap-2 px-3 py-1 glass-card rounded-full text-sm"
              >
                {language}
                <button
                  type="button"
                  onClick={() => removeLanguage(language)}
                  className="text-red-400 hover:text-red-300"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div className="space-y-3">
          <label className="block text-body font-medium mb-2">Skills & Abilities</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              className="flex-1 px-4 py-2 glass-card rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add a skill or ability..."
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
            />
            <button
              type="button"
              onClick={addSkill}
              className="px-4 py-2 glass-card-cosmic rounded-lg text-white hover:soft-glow-cosmic smooth-transition"
            >
              <Plus size={16} />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.skills_and_abilities.map((skill, index) => (
              <span
                key={index}
                className="flex items-center gap-2 px-3 py-1 glass-card rounded-full text-sm"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="text-red-400 hover:text-red-300"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Affiliations and Events */}
      <div className="space-y-4">
        <h3 className="text-subheading gradient-text-cosmic">Affiliations & Events</h3>

        {/* Affiliations */}
        <div className="space-y-3">
          <label className="block text-body font-medium mb-2">Affiliations</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newAffiliation}
              onChange={(e) => setNewAffiliation(e.target.value)}
              className="flex-1 px-4 py-2 glass-card rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add an affiliation..."
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAffiliation())}
            />
            <button
              type="button"
              onClick={addAffiliation}
              className="px-4 py-2 glass-card-cosmic rounded-lg text-white hover:soft-glow-cosmic smooth-transition"
            >
              <Plus size={16} />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.affiliations.map((affiliation, index) => (
              <span
                key={index}
                className="flex items-center gap-2 px-3 py-1 glass-card rounded-full text-sm"
              >
                {affiliation}
                <button
                  type="button"
                  onClick={() => removeAffiliation(affiliation)}
                  className="text-red-400 hover:text-red-300"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Notable Events */}
        <div className="space-y-3">
          <label className="block text-body font-medium mb-2">Notable Events</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newEvent}
              onChange={(e) => setNewEvent(e.target.value)}
              className="flex-1 px-4 py-2 glass-card rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add a notable event..."
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addEvent())}
            />
            <button
              type="button"
              onClick={addEvent}
              className="px-4 py-2 glass-card-cosmic rounded-lg text-white hover:soft-glow-cosmic smooth-transition"
            >
              <Plus size={16} />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.notable_events.map((event, index) => (
              <span
                key={index}
                className="flex items-center gap-2 px-3 py-1 glass-card rounded-full text-sm"
              >
                {event}
                <button
                  type="button"
                  onClick={() => removeEvent(event)}
                  className="text-red-400 hover:text-red-300"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Relationships */}
      <div className="space-y-4">
        <h3 className="text-subheading gradient-text-cosmic">Relationships</h3>
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <input
              type="text"
              value={newRelationship.character_id}
              onChange={(e) => setNewRelationship(prev => ({ ...prev, character_id: e.target.value }))}
              className="px-4 py-2 glass-card rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Character ID"
            />
            <input
              type="text"
              value={newRelationship.relationship_type}
              onChange={(e) => setNewRelationship(prev => ({ ...prev, relationship_type: e.target.value }))}
              className="px-4 py-2 glass-card rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Relationship type"
            />
            <button
              type="button"
              onClick={addRelationship}
              className="px-4 py-2 glass-card-cosmic rounded-lg text-white hover:soft-glow-cosmic smooth-transition"
            >
              <Plus size={16} />
            </button>
          </div>
          <input
            type="text"
            value={newRelationship.notes}
            onChange={(e) => setNewRelationship(prev => ({ ...prev, notes: e.target.value }))}
            className="w-full px-4 py-2 glass-card rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Relationship notes (optional)"
          />
          <div className="space-y-2">
            {formData.relationships.map((relationship, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 glass-card rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white">{relationship.character_id}</span>
                    <span className="text-blue-400">•</span>
                    <span className="text-purple-300">{relationship.relationship_type}</span>
                    <span className="text-green-400">•</span>
                    <span className="text-yellow-300">{relationship.status}</span>
                  </div>
                  {relationship.notes && (
                    <p className="text-sm text-gray-400 mt-1">{relationship.notes}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removeRelationship(index)}
                  className="text-red-400 hover:text-red-300 ml-2"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-4 pt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 glass-card text-white rounded-xl hover:soft-glow smooth-transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-3 glass-card-cosmic text-white rounded-xl font-semibold hover:soft-glow-cosmic smooth-transition"
        >
          {character ? 'Update Character' : 'Create Character'}
        </button>
      </div>
    </motion.form>
  );
};

export default CharacterForm;
