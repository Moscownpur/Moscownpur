import React, { useState } from 'react';
import { Plus, BookOpen, Edit, Trash2, Search, FileText } from 'lucide-react';

interface Story {
  id: string;
  title: string;
  content: string;
  linkedCharacters: string[];
  linkedEvents: string[];
  worldId: string;
  createdAt: string;
  lastModified: string;
}

const StoryScenes: React.FC = () => {
  const [stories] = useState<Story[]>([
    {
      id: '1',
      title: 'The Crystal\'s Whisper',
      content: 'The ancient crystal hummed with an otherworldly melody as Lyralei approached...',
      linkedCharacters: ['Lyralei Starweaver'],
      linkedEvents: ['The Great Convergence'],
      worldId: '1',
      createdAt: '2024-01-15',
      lastModified: '2024-01-16'
    },
    {
      id: '2',
      title: 'Neon Shadows',
      content: 'Marcus\'s fingers danced across the holographic interface, his cybernetic implants glowing...',
      linkedCharacters: ['Marcus Chen'],
      linkedEvents: ['Corporate Uprising'],
      worldId: '2',
      createdAt: '2024-01-12',
      lastModified: '2024-01-14'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  const filteredStories = stories.filter(story =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    story.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text text-transparent">
            Stories & Scenes
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Write and organize your world's narratives
          </p>
        </div>
        <button className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-lg hover:from-pink-600 hover:to-red-600 transition-all duration-200 shadow-lg hover:shadow-xl">
          <Plus size={20} />
          <span>New Story</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search stories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-slate-900 dark:text-white"
        />
      </div>

      {/* Stories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStories.map((story) => (
          <div
            key={story.id}
            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-all duration-200"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <BookOpen className="w-8 h-8 text-pink-500" />
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                      {story.title}
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
                      <FileText size={14} />
                      <span>{story.content.length} characters</span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 text-slate-600 dark:text-slate-400 hover:text-pink-600 hover:bg-pink-50 dark:hover:bg-pink-900/20 rounded-lg transition-colors">
                    <Edit size={16} />
                  </button>
                  <button className="p-2 text-slate-600 dark:text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <div className="space-y-3">
                <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-3">
                  {story.content}
                </p>
                
                {story.linkedCharacters.length > 0 && (
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 text-xs">Characters:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {story.linkedCharacters.map((character, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gradient-to-r from-pink-100 to-red-100 dark:from-pink-900/30 dark:to-red-900/30 text-pink-700 dark:text-pink-300 text-xs rounded-full"
                        >
                          {character}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-600">
                  Last modified {new Date(story.lastModified).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoryScenes;