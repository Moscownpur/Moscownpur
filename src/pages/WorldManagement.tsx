import React, { useState } from 'react';
import { Plus, Globe, Edit, Trash2, Search, Sparkles, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import GlowCard from '../components/ui/GlowCard';
import NeonButton from '../components/ui/NeonButton';
import FloatingEmoji from '../components/ui/FloatingEmoji';
import WorldForm from '../components/WorldForm';
import Modal from '../components/Modal';
import { useWorlds } from '../hooks/useWorlds';
import { World } from '../types';

const WorldManagement: React.FC = () => {
  const { worlds, loading, createWorld, updateWorld, deleteWorld } = useWorlds();

  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingWorld, setEditingWorld] = useState<World | null>(null);

  const filteredWorlds = worlds.filter(world =>
    world.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    world.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateWorld = async (worldData: Omit<World, 'id' | 'created_at' | 'updated_at'>) => {
    await createWorld(worldData);
    setShowForm(false);
  };

  const handleUpdateWorld = async (worldData: Partial<World>) => {
    if (editingWorld) {
      await updateWorld(editingWorld.id, worldData);
      setEditingWorld(null);
      setShowForm(false);
    }
  };

  const handleDeleteWorld = async (id: string) => {
    if (confirm('Are you sure you want to delete this world? This action cannot be undone! 💔')) {
      await deleteWorld(id);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center justify-between"
      >
        <div className="relative">
          <h1 className="text-display gradient-text-cosmic mb-4">
            World Management
          </h1>
          <p className="text-subheading text-white/60">
            Create and manage your fictional universes
          </p>
        </div>
        <button
          onClick={() => {
            setEditingWorld(null);
            setShowForm(true);
          }}
                      className="px-8 py-4 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-xl font-semibold hover:scale-105 smooth-transition soft-glow-orange flex items-center space-x-3"
        >
          <Sparkles size={20} />
          <span className="text-body">Create World</span>
        </button>
      </motion.div>

      {/* Search */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative"
      >
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
        <input
          type="text"
          placeholder="Search worlds..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-14 pr-4 py-4 glass-card rounded-2xl focus:outline-none focus:soft-glow smooth-transition text-white placeholder-white/40 text-body"
        />
      </motion.div>

      {/* Worlds Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-32">
          <div className="animate-spin rounded-full h-16 w-16 border-2 border-white/20 border-t-white/80"></div>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredWorlds.map((world, index) => (
            <motion.div
              key={world.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -4 }}
            >
              <div className="glass-card rounded-2xl p-8 group smooth-transition hover:soft-glow">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 glass-card rounded-2xl group-hover:soft-glow smooth-transition">
                      <Globe className="w-7 h-7 text-white/80" />
                    </div>
                    <div>
                      <h3 className="text-subheading gradient-text-orange group-hover:gradient-text-sunset smooth-transition">
                        {world.name}
                      </h3>
                      <span className="text-caption text-white/60 font-medium">
                        {world.type}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        setEditingWorld(world);
                        setShowForm(true);
                      }}
                      className="p-3 text-white/40 hover:text-white hover:glass-card rounded-xl smooth-transition"
                    >
                      <Edit size={18} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDeleteWorld(world.id)}
                      className="p-3 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-xl smooth-transition"
                    >
                      <Trash2 size={18} />
                    </motion.button>
                  </div>
                </div>
                
                <p className="text-body text-white/60 mb-6 line-clamp-3">
                  {world.description}
                </p>
                
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-1">
                    {world.dominant_species?.map((species, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 glass-card text-white/70 text-caption rounded-full"
                      >
                        {species}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-caption text-white/40 pt-4 border-t border-white/5">
                    <span className="gradient-text-cosmic">
                      {world.theme}
                    </span>
                    <span>{new Date(world.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {filteredWorlds.length === 0 && !loading && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-32"
        >
          <div className="w-24 h-24 glass-card rounded-3xl flex items-center justify-center mx-auto mb-8">
            <Globe className="w-12 h-12 text-white/60" />
          </div>
          <h3 className="text-heading gradient-text-cosmic mb-6">
            No worlds found!
          </h3>
          <p className="text-body text-white/60 mb-10">
            {searchTerm ? 'Try a different search term' : 'Time to create your first universe'}
          </p>
          <button
            onClick={() => {
              setEditingWorld(null);
              setShowForm(true);
            }}
                          className="px-8 py-4 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-xl font-semibold hover:scale-105 smooth-transition soft-glow-orange flex items-center gap-3 mx-auto"
          >
            <Zap size={20} />
            <span>Create Your First World</span>
          </button>
        </motion.div>
      )}

      {/* World Form Modal */}
      <Modal 
        isOpen={showForm} 
        onClose={() => {
          setShowForm(false);
          setEditingWorld(null);
        }}
        title={editingWorld ? 'Edit World' : 'Create New World'}
      >
        <WorldForm
          world={editingWorld}
          onSubmit={editingWorld ? handleUpdateWorld : handleCreateWorld}
          onCancel={() => {
            setShowForm(false);
            setEditingWorld(null);
          }}
        />
      </Modal>
    </motion.div>
  );
};

export default WorldManagement;