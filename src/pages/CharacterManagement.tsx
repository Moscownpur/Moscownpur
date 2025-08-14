import React, { useState } from 'react';
import { Plus, Users, Edit, Trash2, Search, Sparkles, Zap, Globe, Heart, Calendar, Eye, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CharacterForm from '../components/CharacterForm';
import Modal from '../components/Modal';
import { useCharacters } from '../hooks/useCharacters';
import { useWorlds } from '../hooks/useWorlds';
import { Character } from '../types';
import toast from 'react-hot-toast';

const CharacterManagement: React.FC = () => {
  const { characters, loading, createCharacter, updateCharacter, deleteCharacter } = useCharacters();
  const { worlds } = useWorlds();
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSpecies, setFilterSpecies] = useState('all');

  const filteredCharacters = characters.filter(character => {
    const matchesSearch = character.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         character.species?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         character.profession?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         character.aliases?.some(alias => alias.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = filterStatus === 'all' || character.status === filterStatus;
    const matchesSpecies = filterSpecies === 'all' || character.species === filterSpecies;
    
    return matchesSearch && matchesStatus && matchesSpecies;
  });

  const handleCreateCharacter = async (characterData: any) => {
    try {
      await createCharacter(characterData);
      setShowForm(false);
    } catch (error) {
      console.error('Error creating character:', error);
    }
  };

  const handleUpdateCharacter = async (characterData: any) => {
    if (!editingCharacter) return;
    
    try {
      await updateCharacter(editingCharacter.id, characterData);
      setEditingCharacter(null);
      setShowForm(false);
    } catch (error) {
      console.error('Error updating character:', error);
    }
  };

  const handleDeleteCharacter = async (characterId: string) => {
    if (window.confirm('Are you sure you want to delete this character? This action cannot be undone.')) {
      try {
        await deleteCharacter(characterId);
      } catch (error) {
        console.error('Error deleting character:', error);
      }
    }
  };

  const statusOptions = ['Alive', 'Dead', 'Unknown', 'Ascended'];
  const speciesOptions = Array.from(new Set(characters.map(c => c.species).filter(Boolean)));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Alive': return 'text-green-400';
      case 'Dead': return 'text-red-400';
      case 'Unknown': return 'text-yellow-400';
      case 'Ascended': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-body">Loading characters...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-display gradient-text-cosmic flex items-center gap-3">
                <Users size={40} />
                Character Management
              </h1>
              <p className="text-body text-gray-400 mt-2">
                Create and manage the inhabitants of your worlds
              </p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 glass-card-cosmic text-white rounded-xl font-semibold hover:soft-glow-cosmic smooth-transition flex items-center gap-2"
            >
              <Plus size={20} />
              Create Character
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="glass-card p-6 rounded-xl">
              <div className="flex items-center gap-3">
                <Users className="text-blue-500" size={24} />
                <div>
                  <p className="text-subheading font-semibold">{characters.length}</p>
                  <p className="text-body text-gray-400">Total Characters</p>
                </div>
              </div>
            </div>
            <div className="glass-card p-6 rounded-xl">
              <div className="flex items-center gap-3">
                <Heart className="text-green-500" size={24} />
                <div>
                  <p className="text-subheading font-semibold">
                    {characters.filter(c => c.status === 'Alive').length}
                  </p>
                  <p className="text-body text-gray-400">Alive</p>
                </div>
              </div>
            </div>
            <div className="glass-card p-6 rounded-xl">
              <div className="flex items-center gap-3">
                <Globe className="text-purple-500" size={24} />
                <div>
                  <p className="text-subheading font-semibold">{worlds.length}</p>
                  <p className="text-body text-gray-400">Connected Worlds</p>
                </div>
              </div>
            </div>
            <div className="glass-card p-6 rounded-xl">
              <div className="flex items-center gap-3">
                <Sparkles className="text-orange-500" size={24} />
                <div>
                  <p className="text-subheading font-semibold">{speciesOptions.length}</p>
                  <p className="text-body text-gray-400">Unique Species</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 space-y-4"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search characters by name, species, profession, or aliases..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 glass-card rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 glass-card rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              {statusOptions.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            <select
              value={filterSpecies}
              onChange={(e) => setFilterSpecies(e.target.value)}
              className="px-4 py-3 glass-card rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Species</option>
              {speciesOptions.map(species => (
                <option key={species} value={species}>{species}</option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Characters Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {filteredCharacters.length === 0 ? (
            <div className="text-center py-16">
              <Users className="mx-auto text-gray-600 mb-4" size={64} />
              <h3 className="text-heading text-gray-400 mb-2">
                {searchTerm || filterStatus !== 'all' || filterSpecies !== 'all' ? 'No characters found' : 'No characters yet'}
              </h3>
              <p className="text-body text-gray-500 mb-6">
                {searchTerm || filterStatus !== 'all' || filterSpecies !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Create your first character to get started'
                }
              </p>
              {!searchTerm && filterStatus === 'all' && filterSpecies === 'all' && (
                <button
                  onClick={() => setShowForm(true)}
                  className="px-6 py-3 glass-card-cosmic text-white rounded-xl font-semibold hover:soft-glow-cosmic smooth-transition"
                >
                  Create Your First Character
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {filteredCharacters.map((character, index) => (
                  <motion.div
                    key={character.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                    className="glass-card rounded-xl overflow-hidden hover:soft-glow smooth-transition"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 glass-card-cosmic rounded-lg">
                            <Users className="text-blue-400" size={20} />
                          </div>
                          <div>
                            <h3 className="text-subheading font-semibold text-white">
                              {character.name}
                            </h3>
                            <div className="flex items-center gap-2">
                              {character.species && (
                                <span className="text-sm text-blue-400 font-medium">
                                  {character.species}
                                </span>
                              )}
                              <span className={`text-sm font-medium ${getStatusColor(character.status)}`}>
                                {character.status}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingCharacter(character);
                              setShowForm(true);
                            }}
                            className="p-2 text-gray-400 hover:text-blue-400 hover:soft-glow smooth-transition rounded-lg"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteCharacter(character.id)}
                            className="p-2 text-gray-400 hover:text-red-400 hover:soft-glow smooth-transition rounded-lg"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        {/* Basic Info */}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          {character.age > 0 && (
                            <div>
                              <span className="text-gray-500">Age:</span>
                              <p className="text-white font-medium">{character.age}</p>
                            </div>
                          )}
                          {character.profession && (
                            <div>
                              <span className="text-gray-500">Profession:</span>
                              <p className="text-white font-medium line-clamp-1">{character.profession}</p>
                            </div>
                          )}
                        </div>

                        {/* Origin and Location */}
                        {(character.origin || character.current_location) && (
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            {character.origin && (
                              <div>
                                <span className="text-gray-500">Origin:</span>
                                <p className="text-white font-medium line-clamp-1">{character.origin}</p>
                              </div>
                            )}
                            {character.current_location && (
                              <div>
                                <span className="text-gray-500">Location:</span>
                                <p className="text-white font-medium line-clamp-1">{character.current_location}</p>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Aliases */}
                        {character.aliases && character.aliases.length > 0 && (
                          <div>
                            <span className="text-gray-500 text-sm">Aliases:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {character.aliases.slice(0, 2).map((alias, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 glass-card rounded-full text-xs text-purple-300"
                                >
                                  {alias}
                                </span>
                              ))}
                              {character.aliases.length > 2 && (
                                <span className="px-2 py-1 glass-card rounded-full text-xs text-gray-400">
                                  +{character.aliases.length - 2} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Skills */}
                        {character.skills_and_abilities && character.skills_and_abilities.length > 0 && (
                          <div>
                            <span className="text-gray-500 text-sm">Skills:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {character.skills_and_abilities.slice(0, 2).map((skill, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 glass-card rounded-full text-xs text-green-300"
                                >
                                  {skill}
                                </span>
                              ))}
                              {character.skills_and_abilities.length > 2 && (
                                <span className="px-2 py-1 glass-card rounded-full text-xs text-gray-400">
                                  +{character.skills_and_abilities.length - 2} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Personality Traits */}
                        {character.personality?.traits && character.personality.traits.length > 0 && (
                          <div>
                            <span className="text-gray-500 text-sm">Traits:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {character.personality.traits.slice(0, 2).map((trait, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 glass-card rounded-full text-xs text-orange-300"
                                >
                                  {trait}
                                </span>
                              ))}
                              {character.personality.traits.length > 2 && (
                                <span className="px-2 py-1 glass-card rounded-full text-xs text-gray-400">
                                  +{character.personality.traits.length - 2} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Arc Summary */}
                        {character.arc_summary && (
                          <div>
                            <p className="text-body text-gray-300 line-clamp-2 text-sm">
                              {character.arc_summary}
                            </p>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Calendar size={12} />
                          <span>
                            Created {new Date(character.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingCharacter(null);
        }}
        title={editingCharacter ? 'Edit Character' : 'Create New Character'}
      >
        <CharacterForm
          character={editingCharacter}
          onSubmit={editingCharacter ? handleUpdateCharacter : handleCreateCharacter}
          onCancel={() => {
            setShowForm(false);
            setEditingCharacter(null);
          }}
        />
      </Modal>
    </div>
  );
};

export default CharacterManagement;