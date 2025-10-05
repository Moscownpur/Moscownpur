import React, { useState, useEffect } from 'react';
import { Plus, Clock, Search, Filter, Calendar, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import TimelineView from '../../components/TimelineView';
import Modal from '../../components/Modal';
import { useTimeline } from '../../hooks/useTimeline';
import { useWorlds } from '../../hooks/useWorlds';
import { useChapters } from '../../hooks/useChapters';
import { TimelineEventWithChapters, Chapter } from '../../types';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const TimelineEvents: React.FC = () => {
  const { events, loading, refetch } = useTimeline();
  const { worlds } = useWorlds();
  const { chapters, assignEventToChapter } = useChapters();
  const { user } = useAuth();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [selectedWorld, setSelectedWorld] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [eventsWithChapters, setEventsWithChapters] = useState<TimelineEventWithChapters[]>([]);

  const eventTypes = ['Birth', 'Death', 'War', 'Marriage', 'Political', 'Mystical', 'Invention', 'Encounter', 'Vision', 'Betrayal', 'Coronation'];

  // Fetch events with chapters
  useEffect(() => {
    const fetchEventsWithChapters = async () => {
      if (!supabase || !user) return;

      try {
        // Fetch events and join with chapters
        const { data, error } = await supabase
          .from('events')
          .select(`
            event_id,
            chapter_id,
            story_time,
            title,
            context,
            timeline_version,
            created_at,
            updated_at,
            chapters!inner(
              chapter_id,
              title,
              chapter_order,
              world_id
            )
          `)
          .order('story_time', { ascending: true });

        if (error) throw error;
        
        // Map to TimelineEventWithChapters format
        const mappedEvents = (data || []).map(event => ({
          id: event.event_id,
          title: event.title,
          date: event.story_time,
          era: '',
          location: '',
          involved_characters: [],
          description: '',
          type: 'Encounter' as const,
          consequences: '',
          world_id: event.chapters.world_id,
          chapter_id: event.chapter_id,
          created_by: user.id,
          created_at: event.created_at,
          updated_at: event.updated_at,
          chapter_title: event.chapters.title,
          chapter_order: event.chapters.chapter_order,
          scene_count: 0,
          scenes: []
        }));
        
        setEventsWithChapters(mappedEvents);
      } catch (error) {
        console.error('Error fetching events with chapters:', error);
      }
    };

    fetchEventsWithChapters();
  }, [user]);

  const filteredEvents = eventsWithChapters.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = !filterType || event.type === filterType;
    const matchesWorld = !selectedWorld || event.world_id === selectedWorld;
    return matchesSearch && matchesFilter && matchesWorld;
  });

  // Group events by chapter
  const groupedEvents = filteredEvents.reduce((groups, event) => {
    const chapterKey = event.chapter_id || 'unassigned';
    if (!groups[chapterKey]) {
      groups[chapterKey] = {
        chapter: event.chapter_id ? chapters.find(c => c.id === event.chapter_id) : null,
        events: []
      };
    }
    groups[chapterKey].events.push(event);
    return groups;
  }, {} as Record<string, { chapter: Chapter | null; events: TimelineEventWithChapters[] }>);

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

  const handleAssignToChapter = async (eventId: string, chapterId: string | null) => {
    try {
      await assignEventToChapter(eventId, chapterId);
      // Refresh the events list
      refetch();
    } catch (error) {
      console.error('Error assigning event to chapter:', error);
    }
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
          <h1 className="text-display gradient-text-sunset mb-4">
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

      {/* Timeline with Chapters */}
      {loading ? (
        <div className="flex items-center justify-center py-32">
          <div className="animate-spin rounded-full h-16 w-16 border-2 border-white/20 border-t-white/80"></div>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-8"
        >
          {Object.entries(groupedEvents).map(([chapterKey, group]) => (
            <div key={chapterKey} className="space-y-4">
              {/* Chapter Heading */}
              {group.chapter ? (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center space-x-4"
                >
                  <div className="p-3 glass-card rounded-xl">
                    <BookOpen className="w-6 h-6 text-orange-400" />
                  </div>
                  <div>
                    <h2 className="text-heading gradient-text-orange">
                      {group.chapter.title}
                    </h2>
                    <p className="text-body text-white/60">
                      Chapter {group.chapter.order_index} • {group.events.length} events
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center space-x-4"
                >
                  <div className="p-3 glass-card rounded-xl">
                    <Clock className="w-6 h-6 text-white/60" />
                  </div>
                  <div>
                    <h2 className="text-heading text-white/60">
                      Unassigned Events
                    </h2>
                    <p className="text-body text-white/40">
                      {group.events.length} events not assigned to any chapter
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Events in Chapter */}
              <div className="space-y-4 ml-16">
                {group.events.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="glass-card rounded-2xl p-6 group hover:soft-glow smooth-transition"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <h3 className="text-subheading gradient-text-orange group-hover:gradient-text-sunset smooth-transition">
                            {event.title}
                          </h3>
                          <span className="px-3 py-1 text-caption font-medium glass-card text-white/80 rounded-full">
                            {event.type}
                          </span>
                          <span className="text-caption text-white/60">
                            {new Date(event.date).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-body text-white/70 mb-4 line-clamp-2">
                          {event.description}
                        </p>
                        {event.scenes && event.scenes.length > 0 && (
                          <div className="flex items-center space-x-2 text-caption text-white/40">
                            <span>📽️ {event.scenes.length} scenes</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Chapter Assignment Dropdown */}
                      <div className="flex items-center space-x-2">
                        <select
                          value={event.chapter_id || ''}
                          onChange={(e) => handleAssignToChapter(event.id, e.target.value || null)}
                          className="px-3 py-2 text-sm bg-black/20 border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500/50"
                        >
                          <option value="">No Chapter</option>
                          {chapters
                            .filter(chapter => chapter.world_id === event.world_id)
                            .map(chapter => (
                              <option key={chapter.id} value={chapter.id}>
                                {chapter.title}
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
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