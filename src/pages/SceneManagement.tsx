import React, { useState } from 'react';
import { Plus, Film, Edit, Trash2, Search, Users, MapPin, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTimeline } from '../hooks/useTimeline';
import { useWorlds } from '../hooks/useWorlds';
import Modal from '../components/Modal';

const SceneManagement: React.FC = () => {
  const { scenes, loading, refetch } = useTimeline();
  const { worlds } = useWorlds();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWorld, setSelectedWorld] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredScenes = scenes.filter(scene => {
    const matchesSearch = scene.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         scene.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesWorld = !selectedWorld || scene.world_id === selectedWorld;
    return matchesSearch && matchesWorld;
  });

  const getRoleColor = (role: string) => {
    const colors = {
      'protagonist': 'text-green-400 bg-green-500/20',
      'antagonist': 'text-red-400 bg-red-500/20',
      'ally': 'text-blue-400 bg-blue-500/20',
      'enemy': 'text-orange-400 bg-orange-500/20',
      'witness': 'text-gray-400 bg-gray-500/20',
      'narrator': 'text-purple-400 bg-purple-500/20',
      'participant': 'text-white bg-white/10'
    };
    return colors[role as keyof typeof colors] || 'text-white bg-white/10';
  };

  const getStateColor = (state: string) => {
    const colors = {
      'normal': 'text-green-400',
      'injured': 'text-yellow-400',
      'dead': 'text-red-400',
      'transformed': 'text-purple-400',
      'missing': 'text-gray-400',
      'empowered': 'text-blue-400',
      'weakened': 'text-orange-400'
    };
    return colors[state as keyof typeof colors] || 'text-white';
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-display gradient-text-cosmic mb-4">
            Scene Management
          </h1>
          <p className="text-subheading text-white/60">
            Craft detailed scenes with character interactions and context
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:scale-105 smooth-transition soft-glow-purple flex items-center space-x-3"
        >
          <Film size={20} />
          <span className="text-body">Create Scene</span>
        </button>
      </motion.div>

      {/* Filters */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col lg:flex-row gap-4"
      >
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
          <input
            type="text"
            placeholder="Search scenes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-4 py-4 glass-card rounded-2xl focus:outline-none focus:soft-glow smooth-transition text-white placeholder-white/40 text-body"
          />
        </div>
        
        <div className="relative">
          <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
          <select
            value={selectedWorld}
            onChange={(e) => setSelectedWorld(e.target.value)}
            className="pl-14 pr-8 py-4 glass-card rounded-2xl focus:outline-none focus:soft-glow smooth-transition text-white bg-transparent min-w-[180px]"
          >
            <option value="">All Worlds</option>
            {worlds.map(world => (
              <option key={world.id} value={world.id} className="bg-black">{world.name}</option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Scenes Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-32">
          <div className="animate-spin rounded-full h-16 w-16 border-2 border-white/20 border-t-white/80"></div>
        </div>
      ) : filteredScenes.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-32"
        >
          <div className="w-24 h-24 glass-card rounded-3xl flex items-center justify-center mx-auto mb-8">
            <Film className="w-12 h-12 text-white/60" />
          </div>
          <h3 className="text-heading gradient-text-cosmic mb-6">
            No scenes found!
          </h3>
          <p className="text-body text-white/60 mb-10">
            {searchTerm ? 'Try a different search term' : 'Create your first scene to bring your events to life'}
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:scale-105 smooth-transition soft-glow-blue flex items-center gap-3 mx-auto"
          >
            <Film size={20} />
            <span>Create Your First Scene</span>
          </button>
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {filteredScenes.map((scene, index) => (
            <Link to={`/dashboard/scenes/${scene.id}`}>
              <motion.div
                key={scene.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -4 }}
                className="glass-card rounded-2xl p-8 group smooth-transition hover:soft-glow cursor-pointer"
              >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-3 glass-card rounded-2xl group-hover:soft-glow smooth-transition">
                    <Film className="w-7 h-7 text-white/80" />
                  </div>
                  <div>
                    <h3 className="text-subheading gradient-text-purple group-hover:gradient-text-pink smooth-transition">
                      {scene.title}
                    </h3>
                    <span className="text-caption text-white/60 font-medium">
                      Scene {scene.scene_order}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Link to={`/dashboard/scenes/${scene.id}`}>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-3 text-white/40 hover:text-white hover:glass-card rounded-xl smooth-transition"
                    >
                      <Edit size={18} />
                    </motion.button>
                  </Link>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-3 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-xl smooth-transition"
                  >
                    <Trash2 size={18} />
                  </motion.button>
                </div>
              </div>
              
              <div className="space-y-4">
                <p className="text-body text-white/70 line-clamp-3">
                  {scene.description}
                </p>
                
                {scene.dialogue && (
                  <div className="glass-card rounded-xl p-4">
                    <p className="text-caption text-white/60 mb-2">Dialogue:</p>
                    <p className="text-body text-white/80 italic line-clamp-2">
                      "{scene.dialogue}"
                    </p>
                  </div>
                )}
                
                {/* Scene Characters */}
                {(scene as any).scene_characters && (scene as any).scene_characters.length > 0 && (
                  <div>
                    <p className="text-caption text-white/60 mb-3 flex items-center gap-2">
                      <Users size={14} />
                      Characters in Scene:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {(scene as any).scene_characters.map((sc: any, idx: number) => (
                        <div
                          key={idx}
                          className={`px-3 py-2 rounded-full text-caption font-medium ${getRoleColor(sc.role_in_scene)}`}
                        >
                          <span className="font-semibold">{sc.characters?.name}</span>
                          <span className="mx-2">•</span>
                          <span className={getStateColor(sc.character_state)}>{sc.character_state}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-between text-caption text-white/40 pt-4 border-t border-white/5">
                  <div className="flex items-center gap-4">
                    {(scene as any).regions?.name && (
                      <div className="flex items-center gap-1">
                        <MapPin size={12} />
                        <span>{(scene as any).regions.name}</span>
                      </div>
                    )}
                  </div>
                  <span>{new Date(scene.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </motion.div>
            </Link>
          ))}
        </motion.div>
      )}

      {/* Create Scene Modal */}
      <Modal 
        isOpen={showCreateModal} 
        onClose={() => setShowCreateModal(false)}
        title="Create New Scene"
      >
        <div className="text-center py-8">
          <p className="text-white/60">Scene creation form coming soon...</p>
        </div>
      </Modal>
    </motion.div>
  );
};

export default SceneManagement;