import React, { useState } from 'react';
import { Plus, MapPin, Edit, Trash2, Search, Sparkles, Zap, Globe, Users, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import RegionForm from '../components/RegionForm';
import Modal from '../components/Modal';
import { useRegions } from '../hooks/useRegions';
import { useWorlds } from '../hooks/useWorlds';
import { Region } from '../types';
import toast from 'react-hot-toast';

const RegionManagement: React.FC = () => {
  const { regions, loading, createRegion, updateRegion, deleteRegion } = useRegions();
  const { worlds } = useWorlds();
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingRegion, setEditingRegion] = useState<Region | null>(null);
  const [filterType, setFilterType] = useState('all');

  const filteredRegions = regions.filter(region => {
    const matchesSearch = region.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         region.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         region.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === 'all' || region.type === filterType;
    
    return matchesSearch && matchesFilter;
  });

  const handleCreateRegion = async (regionData: any) => {
    try {
      await createRegion(regionData);
      setShowForm(false);
    } catch (error) {
      console.error('Error creating region:', error);
    }
  };

  const handleUpdateRegion = async (regionData: any) => {
    if (!editingRegion) return;
    
    try {
      await updateRegion(editingRegion.id, regionData);
      setEditingRegion(null);
      setShowForm(false);
    } catch (error) {
      console.error('Error updating region:', error);
    }
  };

  const handleDeleteRegion = async (regionId: string) => {
    if (window.confirm('Are you sure you want to delete this region? This action cannot be undone.')) {
      try {
        await deleteRegion(regionId);
      } catch (error) {
        console.error('Error deleting region:', error);
      }
    }
  };

  const regionTypes = ['Continent', 'Country', 'City', 'Village', 'Realm', 'Planet', 'Dimension'];

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-body">Loading regions...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-display gradient-text-cosmic flex items-center gap-3">
                <Globe size={40} />
                Region Management
              </h1>
              <p className="text-body text-gray-400 mt-2">
                Design the geography and cultures of your worlds
              </p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 glass-card-cosmic text-white rounded-xl font-semibold hover:soft-glow-cosmic smooth-transition flex items-center gap-2"
            >
              <Plus size={20} />
              Create Region
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="glass-card p-6 rounded-xl">
              <div className="flex items-center gap-3">
                <MapPin className="text-blue-500" size={24} />
                <div>
                  <p className="text-subheading font-semibold">{regions.length}</p>
                  <p className="text-body text-gray-400">Total Regions</p>
                </div>
              </div>
            </div>
            <div className="glass-card p-6 rounded-xl">
              <div className="flex items-center gap-3">
                <Globe className="text-green-500" size={24} />
                <div>
                  <p className="text-subheading font-semibold">{worlds.length}</p>
                  <p className="text-body text-gray-400">Connected Worlds</p>
                </div>
              </div>
            </div>
            <div className="glass-card p-6 rounded-xl">
              <div className="flex items-center gap-3">
                <Sparkles className="text-purple-500" size={24} />
                <div>
                  <p className="text-subheading font-semibold">{regionTypes.length}</p>
                  <p className="text-body text-gray-400">Region Types</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 space-y-4"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search regions by name, type, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 glass-card rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-3 glass-card rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              {regionTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Regions Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {filteredRegions.length === 0 ? (
            <div className="text-center py-16">
              <MapPin className="mx-auto text-gray-600 mb-4" size={64} />
              <h3 className="text-heading text-gray-400 mb-2">
                {searchTerm || filterType !== 'all' ? 'No regions found' : 'No regions yet'}
              </h3>
              <p className="text-body text-gray-500 mb-6">
                {searchTerm || filterType !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'Create your first region to get started'
                }
              </p>
              {!searchTerm && filterType === 'all' && (
                <button
                  onClick={() => setShowForm(true)}
                  className="px-6 py-3 glass-card-cosmic text-white rounded-xl font-semibold hover:soft-glow-cosmic smooth-transition"
                >
                  Create Your First Region
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {filteredRegions.map((region, index) => (
                  <motion.div
                    key={region.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                    className="glass-card rounded-xl overflow-hidden hover:soft-glow smooth-transition"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 glass-card-cosmic rounded-lg">
                            <MapPin className="text-blue-400" size={20} />
                          </div>
                          <div>
                            <h3 className="text-subheading font-semibold text-white">
                              {region.name}
                            </h3>
                            <span className="text-sm text-blue-400 font-medium">
                              {region.type}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingRegion(region);
                              setShowForm(true);
                            }}
                            className="p-2 text-gray-400 hover:text-blue-400 hover:soft-glow smooth-transition rounded-lg"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteRegion(region.id)}
                            className="p-2 text-gray-400 hover:text-red-400 hover:soft-glow smooth-transition rounded-lg"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        {region.description && (
                          <div>
                            <p className="text-body text-gray-300 line-clamp-3">
                              {region.description}
                            </p>
                          </div>
                        )}
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          {region.climate && (
                            <div>
                              <span className="text-gray-500">Climate:</span>
                              <p className="text-white font-medium">{region.climate}</p>
                            </div>
                          )}
                          {region.culture && (
                            <div>
                              <span className="text-gray-500">Culture:</span>
                              <p className="text-white font-medium line-clamp-1">{region.culture}</p>
                            </div>
                          )}
                        </div>
                        
                        {region.language && region.language.length > 0 && (
                          <div>
                            <span className="text-gray-500 text-sm">Languages:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {region.language.slice(0, 3).map((lang, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 glass-card rounded-full text-xs text-blue-300"
                                >
                                  {lang}
                                </span>
                              ))}
                              {region.language.length > 3 && (
                                <span className="px-2 py-1 glass-card rounded-full text-xs text-gray-400">
                                  +{region.language.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Calendar size={12} />
                          <span>
                            Created {new Date(region.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingRegion(null);
        }}
        title={editingRegion ? 'Edit Region' : 'Create New Region'}
      >
        <RegionForm
          region={editingRegion}
          onSubmit={editingRegion ? handleUpdateRegion : handleCreateRegion}
          onCancel={() => {
            setShowForm(false);
            setEditingRegion(null);
          }}
        />
      </Modal>
    </div>
  );
};

export default RegionManagement;