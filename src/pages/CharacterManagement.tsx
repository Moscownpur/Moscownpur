import React, { useState } from 'react';
import { Plus, Users, Edit, Trash2, Search, Eye } from 'lucide-react';

interface Character {
  id: string;
  name: string;
  species: string;
  age: number;
  occupation: string;
  personality: string[];
  appearance: string;
  worldId: string;
  relationshipCount: number;
  eventCount: number;
  createdAt: string;
}

const CharacterManagement: React.FC = () => {
  const [characters] = useState<Character[]>([]);

  const [searchTerm, setSearchTerm] = useState('');

  const filteredCharacters = characters.filter(character =>
    character.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    character.species.toLowerCase().includes(searchTerm.toLowerCase()) ||
    character.occupation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Character Management
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Bring your world to life with compelling characters
          </p>
        </div>
        <button className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl">
          <Plus size={20} />
          <span>Create Character</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search characters..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
        />
      </div>

      {/* Characters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCharacters.map((character) => (
          <div
            key={character.id}
            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-all duration-200"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Users className="w-8 h-8 text-blue-500" />
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                      {character.name}
                    </h3>
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="text-blue-600 dark:text-blue-400 font-medium">
                        {character.species}
                      </span>
                      <span className="text-slate-500">•</span>
                      <span className="text-slate-600 dark:text-slate-400">
                        Age {character.age}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                    <Eye size={16} />
                  </button>
                  <button className="p-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                    <Edit size={16} />
                  </button>
                  <button className="p-2 text-slate-600 dark:text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <span className="text-slate-500 dark:text-slate-400 text-sm">Occupation:</span>
                  <p className="text-slate-900 dark:text-white font-medium">{character.occupation}</p>
                </div>
                
                <div>
                  <span className="text-slate-500 dark:text-slate-400 text-sm">Personality:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {character.personality.map((trait, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full"
                      >
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-600">
                  <span>{character.relationshipCount} relationships</span>
                  <span>{character.eventCount} events</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CharacterManagement;