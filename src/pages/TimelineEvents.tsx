import React, { useState } from 'react';
import { Plus, Clock, Search, Filter, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import TimelineView from '../components/TimelineView';
import Modal from '../components/Modal';
import { useTimeline } from '../hooks/useTimeline';
import { useWorlds } from '../hooks/useWorlds';

const TimelineEvents: React.FC = () => {
  const { events, loading, refetch } = useTimeline();
  const { worlds } = useWorlds();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [selectedWorld, setSelectedWorld] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const eventTypes = ['Birth', 'Death', 'War', 'Marriage', 'Political', 'Mystical', 'Invention', 'Encounter', 'Vision', 'Betrayal', 'Coronation'];

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = !filterType || event.type === filterType;
    const matchesWorld = !selectedWorld || event.world_id === selectedWorld;
    return matchesSearch && matchesFilter && matchesWorld;
  });

  const handleEventClick = (eventId: string) => {
    console.log('Event clicked:', eventId);
    // TODO: Open event details modal
  };

  const handleSceneClick = (sceneId: string) => {
    console.log('Scene clicked:', sceneId);
    // TODO: Open scene details modal
  };

  const handleEditEvent = (eventId: string) => {
    console.log('Edit event:', eventId);
    // TODO: Open edit event modal
  };

  const handleDeleteEvent = (eventId: string) => {
    if (confirm('Are you sure you want to delete this event? This will also delete all associated scenes.')) {
      console.log('Delete event:', eventId);
      // TODO: Implement delete functionality
    }
  };

  const handleCreateScene = (eventId: string) => {
    console.log('Create scene for event:', eventId);
    // TODO: Open create scene modal
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
            Timeline Events
          </h1>
          <p className="text-subheading text-white/60">
            Chronicle the history and key moments of your worlds
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold hover:scale-105 smooth-transition soft-glow-orange flex items-center space-x-3"
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
        className="flex flex-col lg:flex-row gap-4"
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
        
        <div className="flex gap-4">
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="pl-14 pr-8 py-4 glass-card rounded-2xl focus:outline-none focus:soft-glow smooth-transition text-white bg-transparent min-w-[150px]"
            >
              <option value="">All Types</option>
              {eventTypes.map(type => (
                <option key={type} value={type} className="bg-black">{type}</option>
              ))}
            </select>
          </div>
          
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
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
        </div>
      </motion.div>

      {/* Timeline */}
      {loading ? (
        <div className="flex items-center justify-center py-32">
          <div className="animate-spin rounded-full h-16 w-16 border-2 border-white/20 border-t-white/80"></div>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <TimelineView
            events={filteredEvents}
            onEventClick={handleEventClick}
            onSceneClick={handleSceneClick}
            onEditEvent={handleEditEvent}
            onDeleteEvent={handleDeleteEvent}
            onCreateScene={handleCreateScene}
            showActions={true}
          />
        </motion.div>
      )}

      {/* Create Event Modal */}
      <Modal 
        isOpen={showCreateModal} 
        onClose={() => setShowCreateModal(false)}
        title="Create Timeline Event"
      >
        <div className="text-center py-8">
          <p className="text-white/60">Event creation form coming soon...</p>
        </div>
      </Modal>
    </motion.div>
  );
};

export default TimelineEvents;