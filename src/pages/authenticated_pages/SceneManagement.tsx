import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Film, Edit, Trash2, Search, Users, MapPin, Clock, Globe, Calendar, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { useScenes } from '../../hooks/useScenes';
import { useEvents } from '../../hooks/useEvents';
import { useChapters } from '../../hooks/useChapters';
import Modal from '../../components/Modal';
import { Scene, TimelineEvent } from '../../types';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const SceneManagement: React.FC = () => {
  const { scenes, loading, refetch, createScene, updateScene, deleteScene } = useScenes();
  const { events } = useEvents();
  const { chapters } = useChapters();
  const { user } = useAuth();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEvent, setSelectedEvent] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingScene, setEditingScene] = useState<Scene | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_id: '',
    ai_image_prompt: ''
  });

  const filteredScenes = scenes.filter(scene => {
    const matchesSearch = scene.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         scene.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEvent = !selectedEvent || scene.event_id === selectedEvent;
    return matchesSearch && matchesEvent;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim() || !formData.event_id) {
      toast.error('Please fill in all required fields (Title, Description, and Event)');
      return;
    }

    try {
      if (editingScene) {
        await updateScene(editingScene.id, {
          title: formData.title,
          description: formData.description,
          ai_image_prompt: formData.ai_image_prompt
        });
      } else {
        await createScene({
          title: formData.title,
          description: formData.description,
          event_id: formData.event_id,
          region_id: null,
          world_id: '',
          scene_order: 0,
          ai_image_prompt: formData.ai_image_prompt,
          dialogue: '',
          created_by: user?.id || ''
        });
      }
      
      setShowCreateModal(false);
      setEditingScene(null);
      setFormData({
        title: '',
        description: '',
        event_id: '',
        ai_image_prompt: ''
      });
    } catch (error) {
      console.error('Error saving scene:', error);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleEdit = (scene: Scene) => {
    setEditingScene(scene);
    setFormData({
      title: scene.title,
      description: scene.description,
      event_id: scene.event_id,
      ai_image_prompt: scene.ai_image_prompt
    });
    setShowCreateModal(true);
  };

  const handleDelete = async (scene: Scene) => {
    if (window.confirm(`Are you sure you want to delete "${scene.title}"?`)) {
      await deleteScene(scene.id);
    }
  };

  const getEventName = (eventId: string) => {
    return events.find(e => e.id === eventId)?.title || 'Unknown Event';
  };

  const getChapterName = (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    if (!event) return 'Unknown Chapter';
    return chapters.find(c => c.id === event.chapter_id)?.title || 'Unknown Chapter';
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
        <div className="relative">
          <h1 className="text-display gradient-text-cosmic mb-4">
            Scene Management
          </h1>
          <p className="text-subheading text-white/60">
            Create and manage story scenes
          </p>
        </div>
        <button
          onClick={() => {
            setEditingScene(null);
            setShowCreateModal(true);
          }}
          className="px-8 py-4 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-xl font-semibold hover:scale-105 smooth-transition soft-glow-orange flex items-center space-x-3"
        >
          <Plus size={20} />
          <span className="text-body">Create Scene</span>
        </button>
      </motion.div>

      {/* Filters */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col md:flex-row gap-4"
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
        <select
          value={selectedEvent}
          onChange={(e) => setSelectedEvent(e.target.value)}
          className="px-4 py-4 glass-card rounded-2xl focus:outline-none focus:soft-glow smooth-transition text-white bg-transparent border border-white/20"
        >
          <option value="">All Events</option>
          {events.map(event => (
            <option key={event.id} value={event.id} className="bg-black">
              {event.title}
            </option>
          ))}
        </select>
      </motion.div>

      {/* Scenes Grid */}
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
          {filteredScenes.map((scene, index) => (
            <motion.div
              key={scene.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -4 }}
              className="glass-card rounded-2xl p-8 group smooth-transition hover:soft-glow"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-3 glass-card rounded-2xl group-hover:soft-glow smooth-transition">
                    <Film className="w-7 h-7 text-white/80" />
                  </div>
                  <div>
                    <h3 className="text-subheading gradient-text-orange group-hover:gradient-text-sunset smooth-transition">
                      {scene.title}
                    </h3>
                    <span className="text-caption text-white/60 font-medium">
                      Scene
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleEdit(scene)}
                    className="p-3 text-white/40 hover:text-white hover:glass-card rounded-xl smooth-transition"
                  >
                    <Edit size={18} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDelete(scene)}
                    className="p-3 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-xl smooth-transition"
                  >
                    <Trash2 size={18} />
                  </motion.button>
                </div>
              </div>
              
              <p className="text-body text-white/60 mb-6 line-clamp-3">
                {scene.description}
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-caption text-white/60">
                  <Clock size={14} />
                  <span>{getEventName(scene.event_id)}</span>
                </div>
                <div className="flex items-center gap-2 text-caption text-white/60">
                  <BookOpen size={14} />
                  <span>{getChapterName(scene.event_id)}</span>
                </div>
                {scene.ai_image_prompt && (
                  <div className="flex items-center gap-2 text-caption text-white/60">
                    <span>🎨 AI Image Prompt Available</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-caption text-white/40 pt-4 border-t border-white/5">
                  <span className="gradient-text-cosmic">
                    Scene
                  </span>
                  <span>{new Date(scene.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {filteredScenes.length === 0 && !loading && (
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
            {searchTerm ? 'Try a different search term' : 'Time to create your first scene'}
          </p>
          <button
            onClick={() => {
              setEditingScene(null);
              setShowCreateModal(true);
            }}
            className="px-8 py-4 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-xl font-semibold hover:scale-105 smooth-transition soft-glow-orange flex items-center gap-3 mx-auto"
          >
            <Plus size={20} />
            <span>Create Your First Scene</span>
          </button>
        </motion.div>
      )}

      {/* Scene Form Modal */}
      <Modal 
        isOpen={showCreateModal} 
        onClose={() => {
          setShowCreateModal(false);
          setEditingScene(null);
        }}
        title={editingScene ? 'Edit Scene' : 'Create New Scene'}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Scene Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="w-full px-4 py-3 glass-card rounded-xl focus:outline-none focus:soft-glow text-white placeholder-white/40"
              placeholder="Enter scene title..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Scene Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="w-full px-4 py-3 glass-card rounded-xl focus:outline-none focus:soft-glow text-white placeholder-white/40"
              placeholder="Describe the scene..."
              rows={4}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Event *
            </label>
            <select
              value={formData.event_id}
              onChange={(e) => handleInputChange('event_id', e.target.value)}
              className="w-full px-4 py-3 glass-card rounded-xl focus:outline-none focus:soft-glow text-white bg-transparent"
              required
            >
              <option value="">Select an event...</option>
              {events.map(event => (
                <option key={event.id} value={event.id} className="bg-black">
                  {event.title} - {getChapterName(event.id)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              AI Image Prompt
            </label>
            <textarea
              value={formData.ai_image_prompt}
              onChange={(e) => handleInputChange('ai_image_prompt', e.target.value)}
              className="w-full px-4 py-3 glass-card rounded-xl focus:outline-none focus:soft-glow text-white placeholder-white/40"
              placeholder="Describe the visual style for AI image generation..."
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-white/10">
            <button
              type="button"
              onClick={() => {
                setShowCreateModal(false);
                setEditingScene(null);
              }}
              className="px-6 py-3 glass-card rounded-xl text-white hover:soft-glow transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-xl font-semibold hover:scale-105 transition-transform"
            >
              {editingScene ? 'Update Scene' : 'Create Scene'}
            </button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
};

export default SceneManagement;