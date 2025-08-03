import React, { useState } from 'react';
import { Clock, MapPin, Users, Eye, Edit, Trash2, Plus, ChevronDown, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TimelineEventWithScenes } from '../types';

interface TimelineViewProps {
  events: TimelineEventWithScenes[];
  onEventClick?: (eventId: string) => void;
  onSceneClick?: (sceneId: string) => void;
  onEditEvent?: (eventId: string) => void;
  onDeleteEvent?: (eventId: string) => void;
  onCreateScene?: (eventId: string) => void;
  showActions?: boolean;
}

const TimelineView: React.FC<TimelineViewProps> = ({
  events,
  onEventClick,
  onSceneClick,
  onEditEvent,
  onDeleteEvent,
  onCreateScene,
  showActions = true
}) => {
  const [expandedEvents, setExpandedEvents] = useState<Set<string>>(new Set());

  const toggleEventExpansion = (eventId: string) => {
    const newExpanded = new Set(expandedEvents);
    if (newExpanded.has(eventId)) {
      newExpanded.delete(eventId);
    } else {
      newExpanded.add(eventId);
    }
    setExpandedEvents(newExpanded);
  };

  const getEventTypeColor = (type: string) => {
    const colors = {
      'Birth': 'from-green-500 to-emerald-500',
      'Death': 'from-red-500 to-pink-500',
      'War': 'from-red-600 to-orange-600',
      'Marriage': 'from-pink-500 to-rose-500',
      'Political': 'from-blue-500 to-indigo-500',
      'Mystical': 'from-purple-500 to-violet-500',
      'Invention': 'from-yellow-500 to-orange-500',
      'Encounter': 'from-cyan-500 to-blue-500',
      'Vision': 'from-indigo-500 to-purple-500',
      'Betrayal': 'from-red-500 to-red-600',
      'Coronation': 'from-yellow-500 to-yellow-600'
    };
    return colors[type as keyof typeof colors] || 'from-gray-500 to-gray-600';
  };

  const getRoleColor = (role: string) => {
    const colors = {
      'protagonist': 'text-green-400',
      'antagonist': 'text-red-400',
      'ally': 'text-blue-400',
      'enemy': 'text-orange-400',
      'witness': 'text-gray-400',
      'narrator': 'text-purple-400',
      'participant': 'text-white'
    };
    return colors[role as keyof typeof colors] || 'text-white';
  };

  if (events.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-20 h-20 glass-card rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Clock className="w-10 h-10 text-white/60" />
        </div>
        <h3 className="text-subheading text-white mb-4">
          No timeline events yet!
        </h3>
        <p className="text-body text-white/60">
          Create your first timeline event to start building your story
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Timeline Line */}
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 via-blue-500 to-pink-500 opacity-30"></div>
      
      <div className="space-y-8">
        {events.map((event, index) => {
          const isExpanded = expandedEvents.has(event.id);
          
          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative flex items-start space-x-6"
            >
              {/* Timeline Node */}
              <motion.div 
                whileHover={{ scale: 1.1 }}
                className={`flex-shrink-0 w-16 h-16 bg-gradient-to-r ${getEventTypeColor(event.type)} rounded-full flex items-center justify-center shadow-lg soft-glow cursor-pointer`}
                onClick={() => onEventClick?.(event.id)}
              >
                <Clock className="w-8 h-8 text-white" />
              </motion.div>
              
              {/* Event Content */}
              <div className="flex-1 glass-card rounded-2xl overflow-hidden hover:soft-glow smooth-transition">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <h3 className="text-subheading gradient-text-cosmic">
                          {event.title}
                        </h3>
                        <button
                          onClick={() => toggleEventExpansion(event.id)}
                          className="p-2 text-white/60 hover:text-white hover:glass-card rounded-lg smooth-transition"
                        >
                          {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                        </button>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-caption text-white/60 mb-3">
                        <span className="font-medium">{event.date}</span>
                        <span className={`px-3 py-1 bg-gradient-to-r ${getEventTypeColor(event.type)} text-white rounded-full font-medium`}>
                          {event.type}
                        </span>
                        {event.location && (
                          <div className="flex items-center gap-1">
                            <MapPin size={14} />
                            <span>{event.location}</span>
                          </div>
                        )}
                        <span className="text-blue-400">{event.scene_count} scenes</span>
                      </div>
                      
                      <p className="text-body text-white/80 mb-4">
                        {event.description}
                      </p>
                      
                      {event.involved_characters && event.involved_characters.length > 0 && (
                        <div className="flex items-center gap-2 mb-4">
                          <Users size={16} className="text-white/60" />
                          <div className="flex flex-wrap gap-2">
                            {event.involved_characters.map((character, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1 glass-card text-white/80 rounded-full text-caption"
                              >
                                {character}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {showActions && (
                      <div className="flex space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => onCreateScene?.(event.id)}
                          className="p-3 text-white/60 hover:text-green-400 hover:bg-green-500/10 rounded-xl smooth-transition"
                          title="Add Scene"
                        >
                          <Plus size={18} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => onEventClick?.(event.id)}
                          className="p-3 text-white/60 hover:text-blue-400 hover:bg-blue-500/10 rounded-xl smooth-transition"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => onEditEvent?.(event.id)}
                          className="p-3 text-white/60 hover:text-white hover:glass-card rounded-xl smooth-transition"
                          title="Edit Event"
                        >
                          <Edit size={18} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => onDeleteEvent?.(event.id)}
                          className="p-3 text-white/60 hover:text-red-400 hover:bg-red-500/10 rounded-xl smooth-transition"
                          title="Delete Event"
                        >
                          <Trash2 size={18} />
                        </motion.button>
                      </div>
                    )}
                  </div>
                  
                  {/* Scenes Expansion */}
                  <AnimatePresence>
                    {isExpanded && event.scenes && event.scenes.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-t border-white/10 pt-4 mt-4"
                      >
                        <h4 className="text-body font-semibold text-white/90 mb-3 flex items-center gap-2">
                          <span>Scenes ({event.scenes.length})</span>
                        </h4>
                        <div className="space-y-3">
                          {event.scenes
                            .sort((a, b) => a.scene_order - b.scene_order)
                            .map((scene) => (
                              <motion.div
                                key={scene.id}
                                whileHover={{ scale: 1.01, x: 4 }}
                                className="glass-card rounded-xl p-4 cursor-pointer hover:soft-glow smooth-transition"
                                onClick={() => onSceneClick?.(scene.id)}
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <h5 className="text-body font-medium text-white mb-2">
                                      {scene.title}
                                    </h5>
                                    <p className="text-caption text-white/70 mb-2 line-clamp-2">
                                      {scene.description}
                                    </p>
                                    {scene.region_name && (
                                      <div className="flex items-center gap-1 text-caption text-white/60">
                                        <MapPin size={12} />
                                        <span>{scene.region_name}</span>
                                      </div>
                                    )}
                                  </div>
                                  <span className="text-caption text-white/40 ml-4">
                                    Scene {scene.scene_order}
                                  </span>
                                </div>
                              </motion.div>
                            ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default TimelineView;