import React, { useState } from 'react';
import { Users, Globe, MapPin, Clock, Search, Filter, Eye, Trash2, UserCheck, UserX, ChevronRight, Film } from 'lucide-react';
import { motion } from 'framer-motion';
import TimelineView from '../../components/TimelineView';
import { useAdminData } from '../../hooks/useAdminData';
import { useTimeline } from '../../hooks/useTimeline';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import Modal from '../../components/Modal';

const AdminDashboard: React.FC = () => {
  const { users, worlds, loading, toggleUserStatus, deleteWorld } = useAdminData();
  const { admin, logout } = useAdminAuth();
  const [selectedWorldId, setSelectedWorldId] = useState<string | null>(null);
  const [showTimelineModal, setShowTimelineModal] = useState(false);
  const { events: timelineEvents, loading: timelineLoading } = useTimeline(selectedWorldId || undefined);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [activeTab, setActiveTab] = useState<'users' | 'worlds' | 'timeline'>('users');

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.full_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterType === 'active') return matchesSearch && !user.is_admin;
    if (filterType === 'admin') return matchesSearch && user.is_admin;
    return matchesSearch;
  });

  const filteredWorlds = worlds.filter(world =>
    world.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    world.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    world.user_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalStats = {
    users: users.length,
    worlds: worlds.length,
    characters: users.reduce((sum, user) => sum + user.character_count, 0),
    events: users.reduce((sum, user) => sum + user.event_count, 0)
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Admin Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-navbar px-8 py-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-heading gradient-text-red">
              Admin Dashboard
            </h1>
            <p className="text-caption text-white/60">
              Moscownpur Management Portal
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3 px-4 py-2 glass-card rounded-xl">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-caption text-white/80">
                {admin?.full_name} ({admin?.role})
              </span>
            </div>
            <button
              onClick={logout}
              className="px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl smooth-transition"
            >
              Logout
            </button>
          </div>
        </div>
      </motion.header>

      <div className="p-8">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Stats Overview */}
          <motion.div variants={itemVariants}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { name: 'Total Users', value: totalStats.users, icon: Users, color: 'blue' },
                { name: 'Total Worlds', value: totalStats.worlds, icon: Globe, color: 'purple' },
                { name: 'Total Characters', value: totalStats.characters, icon: Users, color: 'green' },
                { name: 'Total Events', value: totalStats.events, icon: Clock, color: 'orange' }
              ].map((stat) => (
                <motion.div
                  key={stat.name}
                  whileHover={{ scale: 1.02, y: -4 }}
                  className="glass-card rounded-2xl p-6 hover:soft-glow smooth-transition"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-caption text-white/60 mb-2">{stat.name}</p>
                      <p className="text-heading gradient-text-cosmic">{stat.value}</p>
                    </div>
                    <div className="p-3 glass-card rounded-xl">
                      <stat.icon className="w-6 h-6 text-white/80" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Tab Navigation */}
          <motion.div variants={itemVariants}>
            <div className="flex space-x-1 glass-card rounded-2xl p-2 w-fit flex-wrap">
              <button
                onClick={() => setActiveTab('users')}
                className={`px-6 py-3 rounded-xl smooth-transition ${
                  activeTab === 'users'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white soft-glow-blue'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                User Management
              </button>
              <button
                onClick={() => setActiveTab('worlds')}
                className={`px-6 py-3 rounded-xl smooth-transition ${
                  activeTab === 'worlds'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white soft-glow-purple'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                World Overview
              </button>
              <button
                onClick={() => setActiveTab('timeline')}
                className={`px-6 py-3 rounded-xl smooth-transition ${
                  activeTab === 'timeline'
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white soft-glow-orange'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                Timeline Overview
              </button>
            </div>
          </motion.div>

          {/* Search and Filters */}
          <motion.div variants={itemVariants}>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
                <input
                  type="text"
                  placeholder={`Search ${activeTab}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-14 pr-4 py-4 glass-card rounded-2xl focus:outline-none focus:soft-glow smooth-transition text-white placeholder-white/40"
                />
              </div>
              {activeTab === 'users' && (
                <div className="relative">
                  <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="pl-14 pr-8 py-4 glass-card rounded-2xl focus:outline-none focus:soft-glow smooth-transition text-white bg-transparent"
                  >
                    <option value="all">All Users</option>
                    <option value="active">Regular Users</option>
                    <option value="admin">Admin Users</option>
                  </select>
                </div>
              )}
            </div>
          </motion.div>

          {/* Content */}
          {loading ? (
            <div className="flex items-center justify-center py-32">
              <div className="animate-spin rounded-full h-16 w-16 border-2 border-white/20 border-t-white/80"></div>
            </div>
          ) : (
            <motion.div variants={itemVariants}>
              {activeTab === 'timeline' ? (
                <div className="space-y-6">
                  <div className="glass-card rounded-3xl p-8">
                    <div className="text-center mb-8">
                      <h2 className="text-subheading gradient-text-orange mb-4">
                        Global Timeline Overview
                      </h2>
                      <p className="text-body text-white/60">
                        View timeline events and scenes across all worlds
                      </p>
                    </div>
                    
                    {selectedWorldId ? (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h3 className="text-subheading text-white">
                            Timeline for: {worlds.find(w => w.id === selectedWorldId)?.name}
                          </h3>
                          <button
                            onClick={() => {
                              setSelectedWorldId(null);
                              setShowTimelineModal(false);
                            }}
                            className="px-4 py-2 text-white/60 hover:text-white hover:glass-card rounded-xl smooth-transition"
                          >
                            ← Back to Worlds
                          </button>
                        </div>
                        
                        {timelineLoading ? (
                          <div className="flex items-center justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-2 border-white/20 border-t-white/80"></div>
                          </div>
                        ) : (
                          <TimelineView
                            events={timelineEvents}
                            showActions={false}
                          />
                        )}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {worlds.map((world) => (
                          <motion.div
                            key={world.id}
                            whileHover={{ scale: 1.02, y: -4 }}
                            className="glass-card rounded-2xl p-6 cursor-pointer hover:soft-glow smooth-transition"
                            onClick={() => setSelectedWorldId(world.id)}
                          >
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center space-x-3">
                                <div className="p-3 glass-card rounded-xl">
                                  <Globe className="w-6 h-6 text-white/80" />
                                </div>
                                <div>
                                  <h3 className="text-subheading gradient-text-orange">{world.name}</h3>
                                  <p className="text-caption text-white/60">by @{world.user_name}</p>
                                </div>
                              </div>
                              <ChevronRight className="w-5 h-5 text-white/40" />
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex justify-between text-caption">
                                <span className="text-white/60">Events:</span>
                                <span className="text-orange-400">{world.event_count}</span>
                              </div>
                              <div className="flex justify-between text-caption">
                                <span className="text-white/60">Characters:</span>
                                <span className="text-blue-400">{world.character_count}</span>
                              </div>
                              <div className="flex justify-between text-caption">
                                <span className="text-white/60">Regions:</span>
                                <span className="text-green-400">{world.region_count}</span>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : activeTab === 'users' ? (
                <div className="glass-card rounded-3xl overflow-hidden">
                  <div className="p-6 border-b border-white/5">
                    <h2 className="text-subheading gradient-text-blue">
                      User Management ({filteredUsers.length})
                    </h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="border-b border-white/5">
                        <tr>
                          <th className="text-left p-6 text-caption text-white/60 font-medium">User</th>
                          <th className="text-left p-6 text-caption text-white/60 font-medium">Email</th>
                          <th className="text-left p-6 text-caption text-white/60 font-medium">Joined</th>
                          <th className="text-left p-6 text-caption text-white/60 font-medium">Content</th>
                          <th className="text-left p-6 text-caption text-white/60 font-medium">Status</th>
                          <th className="text-left p-6 text-caption text-white/60 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map((user) => (
                          <motion.tr
                            key={user.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="border-b border-white/5 hover:bg-white/2 smooth-transition"
                          >
                            <td className="p-6">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 glass-card rounded-full flex items-center justify-center">
                                  <Users className="w-5 h-5 text-white/80" />
                                </div>
                                <div>
                                  <p className="text-body text-white font-medium">{user.full_name}</p>
                                  <p className="text-caption text-white/60">@{user.username}</p>
                                </div>
                              </div>
                            </td>
                            <td className="p-6 text-body text-white/80">{user.email}</td>
                            <td className="p-6 text-caption text-white/60">
                              {new Date(user.created_at).toLocaleDateString()}
                            </td>
                            <td className="p-6">
                              <div className="flex space-x-4 text-caption text-white/60">
                                <span>{user.world_count}W</span>
                                <span>{user.character_count}C</span>
                                <span>{user.region_count}R</span>
                                <span>{user.event_count}E</span>
                              </div>
                            </td>
                            <td className="p-6">
                              <span className={`px-3 py-1 rounded-full text-caption font-medium ${
                                user.is_admin 
                                  ? 'bg-red-500/20 text-red-300' 
                                  : 'bg-green-500/20 text-green-300'
                              }`}>
                                {user.is_admin ? 'Admin' : 'User'}
                              </span>
                            </td>
                            <td className="p-6">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => toggleUserStatus(user.id, !user.is_admin)}
                                  className="p-2 text-white/60 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg smooth-transition"
                                  title={user.is_admin ? 'Remove Admin' : 'Make Admin'}
                                >
                                  {user.is_admin ? <UserX size={16} /> : <UserCheck size={16} />}
                                </button>
                                <button className="p-2 text-white/60 hover:text-green-400 hover:bg-green-500/10 rounded-lg smooth-transition">
                                  <Eye size={16} />
                                </button>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredWorlds.map((world, index) => (
                    <motion.div
                      key={world.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02, y: -4 }}
                      className="glass-card rounded-2xl p-6 hover:soft-glow smooth-transition"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="p-3 glass-card rounded-xl">
                            <Globe className="w-6 h-6 text-white/80" />
                          </div>
                          <div>
                            <h3 className="text-subheading gradient-text-purple">{world.name}</h3>
                            <p className="text-caption text-white/60">{world.type}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this world?')) {
                              deleteWorld(world.id);
                            }
                          }}
                          className="p-2 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-lg smooth-transition"
                        >
                          <Trash2 size={16} />
                        </button>
                        <button
                          onClick={() => setSelectedWorldId(world.id)}
                          className="p-2 text-white/40 hover:text-orange-400 hover:bg-orange-500/10 rounded-lg smooth-transition"
                          title="View Timeline"
                        >
                          <Film size={16} />
                        </button>
                      </div>
                      
                      <p className="text-body text-white/60 mb-4 line-clamp-2">
                        {world.description}
                      </p>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-caption text-white/60">
                          <span>Created by: @{world.user_name}</span>
                          <span>{new Date(world.created_at).toLocaleDateString()}</span>
                        </div>
                        
                        <div className="flex justify-between text-caption">
                          <span className="text-blue-400">{world.character_count} Characters</span>
                          <span className="text-green-400">{world.region_count} Regions</span>
                          <span className="text-orange-400">{world.event_count} Events</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;