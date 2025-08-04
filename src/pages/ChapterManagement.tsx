import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, BookOpen, Edit2, Trash2, Search, Globe, GripVertical, Users, Calendar } from 'lucide-react';
import { motion, Reorder } from 'framer-motion';
import { useChapters } from '../hooks/useChapters';
import { useWorlds } from '../hooks/useWorlds';
import { Chapter } from '../types';
import Modal from '../components/Modal';
import toast from 'react-hot-toast';

const ChapterManagement: React.FC = () => {
  const { chapters, loading, createChapter, updateChapter, deleteChapter, reorderChapters } = useChapters();
  const { worlds } = useWorlds();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWorld, setSelectedWorld] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    world_id: ''
  });

  const filteredChapters = chapters.filter(chapter => {
    const matchesSearch = chapter.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         chapter.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesWorld = !selectedWorld || chapter.world_id === selectedWorld;
    return matchesSearch && matchesWorld;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.world_id) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      if (editingChapter) {
        await updateChapter(editingChapter.id, {
          title: formData.title,
          description: formData.description,
          world_id: formData.world_id
        });
      } else {
        await createChapter({
          title: formData.title,
          description: formData.description,
          world_id: formData.world_id,
          order_index: chapters.length + 1,
          created_by: ''
        });
      }
      
      setShowCreateModal(false);
      setEditingChapter(null);
      setFormData({
        title: '',
        description: '',
        world_id: ''
      });
    } catch (error) {
      console.error('Error saving chapter:', error);
    }
  };

  const handleEdit = (chapter: Chapter) => {
    setEditingChapter(chapter);
    setFormData({
      title: chapter.title,
      description: chapter.description,
      world_id: chapter.world_id
    });
    setShowCreateModal(true);
  };

  const handleDelete = async (chapter: Chapter) => {
    if (window.confirm(`Are you sure you want to delete "${chapter.title}"?`)) {
      await deleteChapter(chapter.id);
    }
  };

  const handleReorder = async (newOrder: Chapter[]) => {
    await reorderChapters(newOrder);
  };

  const getWorldName = (worldId: string) => {
    return worlds.find(w => w.id === worldId)?.name || 'Unknown World';
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
            Chapter Management
          </h1>
          <p className="text-subheading text-white/60">
            Organize your story into chapters for better structure
          </p>
        </div>
        <button
          onClick={() => {
            setEditingChapter(null);
            setFormData({ title: '', description: '', world_id: '' });
            setShowCreateModal(true);
          }}
          className="px-8 py-4 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-xl font-semibold hover:scale-105 smooth-transition soft-glow-orange flex items-center space-x-3"
        >
          <BookOpen size={20} />
          <span className="text-body">Create Chapter</span>
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
            placeholder="Search chapters..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-4 py-4 glass-card rounded-2xl focus:outline-none focus:soft-glow smooth-transition text-white placeholder-white/40 text-body"
          />
        </div>
        
        <div className="relative">
          <Globe className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
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

      {/* Chapters List */}
      {loading ? (
        <div className="flex items-center justify-center py-32">
          <div className="animate-spin rounded-full h-16 w-16 border-2 border-white/20 border-t-white/80"></div>
        </div>
      ) : filteredChapters.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-32"
        >
          <div className="w-24 h-24 glass-card rounded-3xl flex items-center justify-center mx-auto mb-8">
            <BookOpen className="w-12 h-12 text-white/60" />
          </div>
          <h3 className="text-heading gradient-text-cosmic mb-6">
            No chapters found!
          </h3>
          <p className="text-body text-white/60 mb-10">
            {searchTerm ? 'Try a different search term' : 'Create your first chapter to organize your story'}
          </p>
          <button
            onClick={() => {
              setEditingChapter(null);
              setFormData({ title: '', description: '', world_id: '' });
              setShowCreateModal(true);
            }}
            className="px-8 py-4 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-xl font-semibold hover:scale-105 smooth-transition soft-glow-orange flex items-center gap-3 mx-auto"
          >
            <BookOpen size={20} />
            <span>Create Your First Chapter</span>
          </button>
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <Reorder.Group
            axis="y"
            values={filteredChapters}
            onReorder={handleReorder}
            className="space-y-4"
          >
            {filteredChapters.map((chapter, index) => (
              <Reorder.Item
                key={chapter.id}
                value={chapter}
                className="cursor-move"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.01, y: -2 }}
                  className="glass-card rounded-2xl p-6 group smooth-transition hover:soft-glow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 glass-card rounded-xl group-hover:soft-glow smooth-transition">
                        <GripVertical className="w-6 h-6 text-white/60" />
                      </div>
                      <div>
                        <h3 className="text-subheading gradient-text-orange group-hover:gradient-text-sunset smooth-transition">
                          {chapter.title}
                        </h3>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-caption text-white/60 font-medium">
                            Chapter {chapter.order_index}
                          </span>
                          <div className="flex items-center space-x-1 text-caption text-white/40">
                            <Globe className="w-3 h-3" />
                            <span>{getWorldName(chapter.world_id)}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-caption text-white/40">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(chapter.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleEdit(chapter)}
                        className="p-3 text-white/40 hover:text-white hover:glass-card rounded-xl smooth-transition"
                      >
                        <Edit2 size={18} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDelete(chapter)}
                        className="p-3 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-xl smooth-transition"
                      >
                        <Trash2 size={18} />
                      </motion.button>
                    </div>
                  </div>
                  
                  {chapter.description && (
                    <div className="mt-4 pt-4 border-t border-white/5">
                      <p className="text-body text-white/70 line-clamp-2">
                        {chapter.description}
                      </p>
                    </div>
                  )}
                </motion.div>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        </motion.div>
      )}

      {/* Create/Edit Chapter Modal */}
      <Modal 
        isOpen={showCreateModal} 
        onClose={() => {
          setShowCreateModal(false);
          setEditingChapter(null);
        }}
        title={editingChapter ? "Edit Chapter" : "Create New Chapter"}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Chapter Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white placeholder-white/50 focus:outline-none focus:border-orange-500/50"
              placeholder="Enter chapter title..."
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white placeholder-white/50 focus:outline-none focus:border-orange-500/50 resize-none"
              placeholder="Describe the chapter..."
              rows={3}
            />
          </div>

          {/* World Selection */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              World *
            </label>
            <select
              value={formData.world_id}
              onChange={(e) => setFormData(prev => ({ ...prev, world_id: e.target.value }))}
              className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-orange-500/50"
              required
            >
              <option value="">Select a world...</option>
              {worlds.map(world => (
                <option key={world.id} value={world.id} className="bg-black">
                  {world.name}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setShowCreateModal(false);
                setEditingChapter(null);
              }}
              className="px-6 py-3 text-white/60 hover:text-white hover:bg-white/10 rounded-lg smooth-transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-lg font-semibold hover:scale-105 smooth-transition soft-glow-orange"
            >
              {editingChapter ? 'Update Chapter' : 'Create Chapter'}
            </button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
};

export default ChapterManagement; 