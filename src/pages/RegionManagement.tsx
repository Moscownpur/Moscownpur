import React, { useState } from 'react';
import { Plus, MapPin, Edit, Trash2, Search } from 'lucide-react';

interface Region {
  id: string;
  name: string;
  type: string;
  climate: string;
  culture: string;
  politics: string;
  history: string;
  language: string;
  worldId: string;
  createdAt: string;
}

const RegionManagement: React.FC = () => {
  const [regions] = useState<Region[]>([
    {
      id: '1',
      name: 'Crystal Peaks',
      type: 'Mountain Range',
      climate: 'Alpine',
      culture: 'Mystic Scholars',
      politics: 'Council of Elders',
      history: 'Ancient seat of magical learning',
      language: 'Ethereal',
      worldId: '1',
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'Neon District',
      type: 'Urban Zone',
      climate: 'Controlled',
      culture: 'Corporate Elite',
      politics: 'Megacorp Controlled',
      history: 'Built after the great collapse',
      language: 'Neo-English',
      worldId: '2',
      createdAt: '2024-01-12'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  const filteredRegions = regions.filter(region =>
    region.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    region.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Region Management
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Design the geography and cultures of your worlds
          </p>
        </div>
        <button className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:from-green-600 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl">
          <Plus size={20} />
          <span>Create Region</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search regions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-slate-900 dark:text-white"
        />
      </div>

      {/* Regions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRegions.map((region) => (
          <div
            key={region.id}
            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-all duration-200"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-8 h-8 text-green-500" />
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                      {region.name}
                    </h3>
                    <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                      {region.type}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 text-slate-600 dark:text-slate-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors">
                    <Edit size={16} />
                  </button>
                  <button className="p-2 text-slate-600 dark:text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400">Climate:</span>
                    <p className="text-slate-900 dark:text-white font-medium">{region.climate}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400">Language:</span>
                    <p className="text-slate-900 dark:text-white font-medium">{region.language}</p>
                  </div>
                </div>
                
                <div>
                  <span className="text-slate-500 dark:text-slate-400 text-sm">Culture:</span>
                  <p className="text-slate-900 dark:text-white text-sm">{region.culture}</p>
                </div>
                
                <div>
                  <span className="text-slate-500 dark:text-slate-400 text-sm">Politics:</span>
                  <p className="text-slate-900 dark:text-white text-sm">{region.politics}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RegionManagement;