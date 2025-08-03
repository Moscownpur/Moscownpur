import React from 'react';
import { useParams } from 'react-router-dom';
import { Globe, Users, MapPin, Clock, BookOpen } from 'lucide-react';

const WorldDetails: React.FC = () => {
  const { id } = useParams();

  // TODO: Fetch world data from API using the id parameter
  const world = null;

  if (!world) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            World not found
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            The requested world could not be loaded.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="p-8">
          <div className="flex items-center space-x-4 mb-6">
            <Globe className="w-12 h-12 text-purple-500" />
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {world.name}
              </h1>
              <span className="text-lg text-purple-600 dark:text-purple-400 font-medium">
                {world.type} World
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                  Description
                </h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {world.description}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                  Creation Myth
                </h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {world.creationMyth}
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                  Governing Laws
                </h3>
                <div className="flex flex-wrap gap-2">
                  {world.governingLaws.map((law, index) => (
                    <span
                      key={index}
                      className="px-3 py-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-700 dark:text-purple-300 rounded-lg font-medium"
                    >
                      {law}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                  Dominant Species
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  {world.dominantSpecies}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { name: 'Characters', value: 8, icon: Users, color: 'from-blue-500 to-blue-600' },
          { name: 'Regions', value: 5, icon: MapPin, color: 'from-green-500 to-green-600' },
          { name: 'Events', value: 12, icon: Clock, color: 'from-yellow-500 to-yellow-600' },
          { name: 'Stories', value: 4, icon: BookOpen, color: 'from-pink-500 to-pink-600' },
        ].map((stat) => (
          <div
            key={stat.name}
            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200 dark:border-slate-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">
                  {stat.name}
                </p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
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
    </div>
  );
};

export default WorldDetails;