import React, { useState } from 'react';
import { Plus, Clock, Edit, Trash2, Search, Calendar, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEvents } from '../../hooks/useEvents';
import { useChapters } from '../../hooks/useChapters';
import { TimelineEvent, Chapter } from '../../types';
import Modal from '../../components/Modal';
import toast from 'react-hot-toast';

const EventManagement: React.FC = () => {
  const { events, loading, createEvent, updateEvent, deleteEvent } = useEvents();
  const { chapters, loading: chaptersLoading } = useChapters();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<TimelineEvent | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'Encounter' as 'Encounter' | 'Birth' | 'Death' | 'War' | 'Marriage' | 'Political' | 'Mystical' | 'Invention' | 'Vision' | 'Betrayal' | 'Coronation',
    date: '',
    era: '',
    location: '',
    consequences: '',
    chapter_id: ''
  });

  const eventTypes = ['Birth', 'Death', 'War', 'Marriage', 'Political', 'Mystical', 'Invention', 'Encounter', 'Vision', 'Betrayal', 'Coronation'];

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesChapter = !selectedChapter || event.chapter_id === selectedChapter;
    return matchesSearch && matchesChapter;
  });

  // Debug logging
  console.log('Chapters loaded:', chapters.length, chapters);
  console.log('Events loaded:', events.length, events);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.chapter_id) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      if (editingEvent) {
        await updateEvent(editingEvent.id, {
          title: formData.title,
          description: formData.description,
          type: formData.type,
          date: formData.date,
          era: formData.era,
          location: formData.location,
          consequences: formData.consequences,
          chapter_id: formData.chapter_id
        });
      } else {
        await createEvent({
          title: formData.title,
          description: formData.description,
          type: formData.type,
          date: formData.date || '',
          era: formData.era,
          location: formData.location,
          consequences: formData.consequences,
          chapter_id: formData.chapter_id,
          world_id: '',
          involved_characters: [],
          created_by: ''
        });
      }
      
      setShowCreateModal(false);
      setEditingEvent(null);
      setFormData({
        title: '',
        description: '',
        type: 'Encounter',
        date: '',
        era: '',
        location: '',
        consequences: '',
        chapter_id: ''
      });
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  const handleEdit = (event: TimelineEvent) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      type: event.type,
      date: event.date,
      era: event.era,
      location: event.location,
      consequences: event.consequences,
      chapter_id: event.chapter_id
    });
    setShowCreateModal(true);
  };

  const handleDelete = async (event: TimelineEvent) => {
    if (window.confirm(`Are you sure you want to delete "${event.title}"?`)) {
      await deleteEvent(event.id);
    }
  };

  const getChapterName = (chapterId: string | null | undefined) => {
    if (!chapterId) return 'Unknown Chapter';
    return chapters.find(c => c.id === chapterId)?.title || 'Unknown Chapter';
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'Birth': 'text-green-400',
      'Death': 'text-red-400',
      'War': 'text-orange-400',
      'Marriage': 'text-pink-400',
      'Political': 'text-blue-400',
      'Mystical': 'text-purple-400',
      'Invention': 'text-yellow-400',
      'Encounter': 'text-cyan-400',
      'Vision': 'text-indigo-400',
      'Betrayal': 'text-red-500',
      'Coronation': 'text-yellow-500'
    };
    return colors[type] || 'text-gray-400';
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
            Event Management
          </h1>
          <p className="text-subheading text-white/60">
            Create and manage timeline events
          </p>
        </div>
        <button
          onClick={() => {
            setEditingEvent(null);
            setShowCreateModal(true);
          }}
          className="px-8 py-4 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-xl font-semibold hover:scale-105 smooth-transition soft-glow-orange flex items-center space-x-3"
        >
          <Plus size={20} />
          <span className="text-body">Create Event</span>
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
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-4 py-4 glass-card rounded-2xl focus:outline-none focus:soft-glow smooth-transition text-white placeholder-white/40 text-body"
          />
        </div>
        <select
          value={selectedChapter}
          onChange={(e) => setSelectedChapter(e.target.value)}
          className="px-4 py-4 glass-card rounded-2xl focus:outline-none focus:soft-glow smooth-transition text-white bg-transparent border border-white/20"
        >
          <option value="">All Chapters</option>
          {chapters.map(chapter => (
            <option key={chapter.id} value={chapter.id} className="bg-black">
              {chapter.title}
            </option>
          ))}
        </select>
      </motion.div>

      {/* Events Grid */}
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
          {filteredEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -4 }}
              className="glass-card rounded-2xl p-8 group smooth-transition hover:soft-glow"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-3 glass-card rounded-2xl group-hover:soft-glow smooth-transition">
                    <Clock className="w-7 h-7 text-white/80" />
                  </div>
                  <div>
                    <h3 className="text-subheading gradient-text-orange group-hover:gradient-text-sunset smooth-transition">
                      {event.title}
                    </h3>
                    <span className={`text-caption font-medium ${getTypeColor(event.type)}`}>
                      {event.type}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleEdit(event)}
                    className="p-3 text-white/40 hover:text-white hover:glass-card rounded-xl smooth-transition"
                  >
                    <Edit size={18} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDelete(event)}
                    className="p-3 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-xl smooth-transition"
                  >
                    <Trash2 size={18} />
                  </motion.button>
                </div>
              </div>
              
              <p className="text-body text-white/60 mb-6 line-clamp-3">
                {event.description}
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-caption text-white/60">
                  <BookOpen size={14} />
                  <span>{getChapterName(event.chapter_id)}</span>
                </div>
                                 {event.date && event.date.trim() !== '' && (
                   <div className="flex items-center gap-2 text-caption text-white/60">
                     <Calendar size={14} />
                     <span>{new Date(event.date).toLocaleDateString()}</span>
                   </div>
                 )}
                {event.location && (
                  <div className="flex items-center gap-2 text-caption text-white/60">
                    <span>📍 {event.location}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-caption text-white/40 pt-4 border-t border-white/5">
                  <span className="gradient-text-cosmic">
                    {event.era || 'No era specified'}
                  </span>
                  <span>{new Date(event.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {filteredEvents.length === 0 && !loading && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-32"
        >
          <div className="w-24 h-24 glass-card rounded-3xl flex items-center justify-center mx-auto mb-8">
            <Clock className="w-12 h-12 text-white/60" />
          </div>
          <h3 className="text-heading gradient-text-cosmic mb-6">
            No events found!
          </h3>
          <p className="text-body text-white/60 mb-10">
            {searchTerm ? 'Try a different search term' : 'Time to create your first timeline event'}
          </p>
          <button
            onClick={() => {
              setEditingEvent(null);
              setShowCreateModal(true);
            }}
            className="px-8 py-4 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-xl font-semibold hover:scale-105 smooth-transition soft-glow-orange flex items-center gap-3 mx-auto"
          >
            <Plus size={20} />
            <span>Create Your First Event</span>
          </button>
        </motion.div>
      )}

      {/* Event Form Modal */}
      <Modal 
        isOpen={showCreateModal} 
        onClose={() => {
          setShowCreateModal(false);
          setEditingEvent(null);
        }}
        title={editingEvent ? 'Edit Event' : 'Create New Event'}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Event Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-3 glass-card rounded-xl focus:outline-none focus:soft-glow text-white placeholder-white/40"
              placeholder="Enter event title..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-4 py-3 glass-card rounded-xl focus:outline-none focus:soft-glow text-white placeholder-white/40"
              placeholder="Describe the event..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Event Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                className="w-full px-4 py-3 glass-card rounded-xl focus:outline-none focus:soft-glow text-white bg-transparent"
              >
                {eventTypes.map(type => (
                  <option key={type} value={type} className="bg-black">
                    {type}
                  </option>
                ))}
              </select>
            </div>

                         <div>
               <label className="block text-sm font-medium text-white/80 mb-2">
                 Date (optional - will use current time if not set)
               </label>
               <input
                 type="datetime-local"
                 value={formData.date}
                 onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                 className="w-full px-4 py-3 glass-card rounded-xl focus:outline-none focus:soft-glow text-white"
               />
               <p className="text-xs text-white/50 mt-1">
                 Leave empty to use the current date and time
               </p>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Era
              </label>
              <input
                type="text"
                value={formData.era}
                onChange={(e) => setFormData(prev => ({ ...prev, era: e.target.value }))}
                className="w-full px-4 py-3 glass-card rounded-xl focus:outline-none focus:soft-glow text-white placeholder-white/40"
                placeholder="e.g., Ancient, Medieval, Modern..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                className="w-full px-4 py-3 glass-card rounded-xl focus:outline-none focus:soft-glow text-white placeholder-white/40"
                placeholder="Where did this happen?"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Chapter *
            </label>
            <select
              value={formData.chapter_id}
              onChange={(e) => setFormData(prev => ({ ...prev, chapter_id: e.target.value }))}
              className="w-full px-4 py-3 glass-card rounded-xl focus:outline-none focus:soft-glow text-white bg-transparent"
              required
            >
              <option value="">Select a chapter...</option>
              {chapters.map(chapter => (
                <option key={chapter.id} value={chapter.id} className="bg-black">
                  {chapter.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Consequences
            </label>
            <textarea
              value={formData.consequences}
              onChange={(e) => setFormData(prev => ({ ...prev, consequences: e.target.value }))}
              className="w-full px-4 py-3 glass-card rounded-xl focus:outline-none focus:soft-glow text-white placeholder-white/40"
              placeholder="What were the consequences of this event?"
              rows={2}
            />
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-white/10">
            <button
              type="button"
              onClick={() => {
                setShowCreateModal(false);
                setEditingEvent(null);
              }}
              className="px-6 py-3 glass-card rounded-xl text-white hover:soft-glow transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-xl font-semibold hover:scale-105 transition-transform"
            >
              {editingEvent ? 'Update Event' : 'Create Event'}
            </button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
};

export default EventManagement;
