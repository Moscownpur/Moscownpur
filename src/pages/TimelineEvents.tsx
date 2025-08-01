import React, { useState } from 'react';
import { Plus, Clock, Filter, Search, Calendar } from 'lucide-react';

interface TimelineEvent {
  id: string;
  title: string;
  type: string;
  description: string;
  date: string;
  involvedCharacters: string[];
  region: string;
  worldId: string;
  createdAt: string;
}

const TimelineEvents: React.FC = () => {
  const [events] = useState<TimelineEvent[]>([
    {
      id: '1',
      title: 'The Great Convergence',
      type: 'War',
      description: 'The final battle between the Crystal Mages and the Shadow Lords',
      date: '1247-03-15',
      involvedCharacters: ['Lyralei Starweaver', 'Theron Shadowbane'],
      region: 'Crystal Peaks',
      worldId: '1',
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      title: 'Corporate Uprising',
      type: 'Rebellion',
      description: 'Hackers infiltrate the central AI system',
      date: '2387-08-23',
      involvedCharacters: ['Marcus Chen', 'Nova Blackstone'],
      region: 'Neon District',
      worldId: '2',
      createdAt: '2024-01-12'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');

  const eventTypes = ['War', 'Rebellion', 'Marriage', 'Betrayal', 'Discovery', 'Death', 'Birth', 'Prophecy'];

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = !filterType || event.type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
            Timeline Events
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Chronicle the history of your worlds
          </p>
        </div>
        <button className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl">
          <Plus size={20} />
          <span>Create Event</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-slate-900 dark:text-white"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="pl-12 pr-8 py-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-slate-900 dark:text-white"
          >
            <option value="">All Types</option>
            {eventTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-yellow-500 to-orange-500"></div>
        <div className="space-y-8">
          {filteredEvents.map((event, index) => (
            <div key={event.id} className="relative flex items-start space-x-6">
              <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                <Clock className="w-8 h-8 text-white" />
              </div>
              
              <div className="flex-1 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-slate-200 dark:border-slate-700 p-6 hover:shadow-lg transition-all duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                      {event.title}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-slate-600 dark:text-slate-400">
                      <div className="flex items-center space-x-1">
                        <Calendar size={16} />
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                      </div>
                      <span className="px-2 py-1 bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 text-yellow-700 dark:text-yellow-300 rounded-full font-medium">
                        {event.type}
                      </span>
                      <span>{event.region}</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-slate-700 dark:text-slate-300 mb-4">
                  {event.description}
                </p>
                
                <div>
                  <span className="text-sm text-slate-500 dark:text-slate-400">Involved Characters:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {event.involvedCharacters.map((character, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full text-sm"
                      >
                        {character}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimelineEvents;