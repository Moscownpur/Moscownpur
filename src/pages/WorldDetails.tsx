import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Globe, Users, MapPin, Clock, BookOpen, ArrowLeft } from 'lucide-react';
import { useWorlds } from '../hooks/useWorlds';
import { useChapters } from '../hooks/useChapters';
import { useCharacters } from '../hooks/useCharacters';
import { useTimeline } from '../hooks/useTimeline';
import { World } from '../types';

const WorldDetails: React.FC = () => {
  const { id } = useParams();
  const { worlds, loading } = useWorlds();
  const { chapters } = useChapters(id);
  const { characters } = useCharacters();
  const { events, scenes } = useTimeline(id);
  
  const [world, setWorld] = useState<World | null>(null);

  useEffect(() => {
    if (id && worlds.length > 0) {
      const foundWorld = worlds.find(w => w.id === id);
      setWorld(foundWorld || null);
    }
  }, [id, worlds]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="animate-spin rounded-full h-16 w-16 border-2 border-white/20 border-t-white/80"></div>
      </div>
    );
  }

  if (!world) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            World not found
          </h2>
          <p className="text-white/60 mb-6">
            The requested world could not be loaded.
          </p>
          <Link
            to="/worlds"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:scale-105 transition-transform"
          >
            <ArrowLeft size={16} />
            Back to Worlds
          </Link>
        </div>
      </div>
    );
  }

  // Filter characters and events for this world
  const worldCharacters = characters.filter(char => char.world_id === id);
  const worldEvents = events.filter(event => event.world_id === id);
  const worldScenes = scenes.filter(scene => scene.world_id === id);

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <Link
        to="/worlds"
        className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Worlds
      </Link>

      <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden">
        <div className="p-8">
          <div className="flex items-center space-x-4 mb-6">
            <Globe className="w-12 h-12 text-purple-500" />
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {world.name}
              </h1>
              <span className="text-lg text-purple-400 font-medium">
                {world.type} World
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  Description
                </h3>
                <p className="text-white/60 leading-relaxed">
                  {world.description || 'No description available.'}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  Creation Myth
                </h3>
                <p className="text-white/60 leading-relaxed">
                  {world.creation_myth || 'No creation myth available.'}
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  Governing Laws
                </h3>
                <div className="space-y-2">
                  {world.governing_laws && (
                    <>
                      <div className="flex items-center gap-2">
                        <span className="text-white/40 text-sm">Time:</span>
                        <span className="px-3 py-1 bg-gradient-to-r from-purple-900/30 to-pink-900/30 text-purple-300 rounded-lg font-medium">
                          {world.governing_laws.time}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-white/40 text-sm">Magic:</span>
                        <span className="px-3 py-1 bg-gradient-to-r from-purple-900/30 to-pink-900/30 text-purple-300 rounded-lg font-medium">
                          {world.governing_laws.magic}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-white/40 text-sm">Death:</span>
                        <span className="px-3 py-1 bg-gradient-to-r from-purple-900/30 to-pink-900/30 text-purple-300 rounded-lg font-medium">
                          {world.governing_laws.death}
                        </span>
                      </div>
                      {world.governing_laws.technology_level && (
                        <div className="flex items-center gap-2">
                          <span className="text-white/40 text-sm">Technology:</span>
                          <span className="px-3 py-1 bg-gradient-to-r from-purple-900/30 to-pink-900/30 text-purple-300 rounded-lg font-medium">
                            {world.governing_laws.technology_level}
                          </span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  Dominant Species
                </h3>
                <div className="flex flex-wrap gap-2">
                  {world.dominant_species && world.dominant_species.length > 0 ? (
                    world.dominant_species.map((species, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gradient-to-r from-purple-900/30 to-pink-900/30 text-purple-300 rounded-lg font-medium"
                      >
                        {species}
                      </span>
                    ))
                  ) : (
                    <span className="text-white/40">No species defined</span>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  Visual Style & Theme
                </h3>
                <div className="space-y-2">
                  {world.visual_style && (
                    <div className="flex items-center gap-2">
                      <span className="text-white/40 text-sm">Style:</span>
                      <span className="px-3 py-1 bg-gradient-to-r from-purple-900/30 to-pink-900/30 text-purple-300 rounded-lg font-medium">
                        {world.visual_style}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="text-white/40 text-sm">Theme:</span>
                    <span className="px-3 py-1 bg-gradient-to-r from-purple-900/30 to-pink-900/30 text-purple-300 rounded-lg font-medium">
                      {world.theme}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { name: 'Characters', value: worldCharacters.length, icon: Users, color: 'from-blue-500 to-blue-600' },
          { name: 'Chapters', value: chapters.length, icon: BookOpen, color: 'from-green-500 to-green-600' },
          { name: 'Events', value: worldEvents.length, icon: Clock, color: 'from-yellow-500 to-yellow-600' },
          { name: 'Scenes', value: worldScenes.length, icon: MapPin, color: 'from-pink-500 to-pink-600' },
        ].map((stat) => (
          <div
            key={stat.name}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm font-medium">
                  {stat.name}
                </p>
                <p className="text-3xl font-bold text-white mt-1">
                  {stat.value}
                </p>
              </div>
              <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.color}`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to={`/worlds/${id}/chapters`}
          className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-colors"
        >
          <BookOpen className="w-8 h-8 text-purple-400 mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Manage Chapters</h3>
          <p className="text-white/60">Create and organize story chapters</p>
        </Link>
        
        <Link
          to={`/worlds/${id}/characters`}
          className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-colors"
        >
          <Users className="w-8 h-8 text-blue-400 mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Manage Characters</h3>
          <p className="text-white/60">Create and develop characters</p>
        </Link>
        
        <Link
          to={`/worlds/${id}/timeline`}
          className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-colors"
        >
          <Clock className="w-8 h-8 text-yellow-400 mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">View Timeline</h3>
          <p className="text-white/60">Explore world events and scenes</p>
        </Link>
      </div>
    </div>
  );
};

export default WorldDetails;