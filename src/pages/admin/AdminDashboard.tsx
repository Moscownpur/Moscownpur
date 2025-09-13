import React, { useState } from 'react';
import { Users, Search, Filter, Eye, Trash2, Edit2, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAdminData } from '../../hooks/useAdminData';
import { useAdminAuth } from '../../contexts/AdminAuthContext';

const AdminDashboard: React.FC = () => {
  const { users, loading, toggleUserStatus } = useAdminData();
  const { admin, logout } = useAdminAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [activeTab, setActiveTab] = useState<'users' | 'blogs'>('users');
  const [blogs, setBlogs] = useState<any[]>([]);
  const [blogForm, setBlogForm] = useState<{ id?: string; title: string; category: string; tags: string; body: string }>({ title: '', category: '', tags: '', body: '' });
  const [blogLoading, setBlogLoading] = useState(false);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.full_name && user.full_name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (filterType === 'active') return matchesSearch && !user.is_admin;
    if (filterType === 'admin') return matchesSearch && user.is_admin;
    return matchesSearch;
  });

  const totalStats = {
    users: users.length,
    blogs: blogs.length
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
        type: "spring" as const,
        stiffness: 100
      }
    }
  };

  // Blog CRUD helpers
  const loadBlogs = async () => {
    setBlogLoading(true);
    const { supabaseClient } = await import('../../lib/supabaseClient');
    const { data } = await supabaseClient
      .from('blogs')
      .select('id, title, category, tags, body, created_at')
      .order('created_at', { ascending: false });
    setBlogs(data || []);
    setBlogLoading(false);
  };

  const submitBlog = async () => {
    const { supabaseClient } = await import('../../lib/supabaseClient');
    const payload = {
      title: blogForm.title,
      category: blogForm.category || null,
      tags: blogForm.tags || null,
      body: blogForm.body,
      author_id: admin?.id || null,
    };
    if (blogForm.id) {
      await supabaseClient.from('blogs').update(payload).eq('id', blogForm.id);
    } else {
      await supabaseClient.from('blogs').insert(payload);
    }
    setBlogForm({ title: '', category: '', tags: '', body: '' });
    await loadBlogs();
  };

  const editBlog = (b: any) => {
    setBlogForm({ id: b.id, title: b.title || '', category: b.category || '', tags: b.tags || '', body: b.body || '' });
  };

  const deleteBlog = async (id: string) => {
    if (!confirm('Delete this blog post?')) return;
    const { supabaseClient } = await import('../../lib/supabaseClient');
    await supabaseClient.from('blogs').delete().eq('id', id);
    await loadBlogs();
  };

  React.useEffect(() => {
    if (activeTab === 'blogs') loadBlogs();
  }, [activeTab]);

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
                {admin?.full_name || admin?.email} (Admin)
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { name: 'Total Users', value: totalStats.users, icon: Users, color: 'blue' },
                { name: 'Total Blogs', value: totalStats.blogs, icon: FileText, color: 'purple' }
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
                onClick={() => setActiveTab('blogs')}
                className={`px-6 py-3 rounded-xl smooth-transition ${
                  activeTab === 'blogs'
                    ? 'bg-gradient-to-r from-pink-500 to-red-500 text-white soft-glow-red'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                Blog Management
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
              {activeTab === 'users' ? (
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
                          <th className="text-left p-6 text-caption text-white/60 font-medium">Type</th>
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
                                  <p className="text-body text-white font-medium">
                                    {user.full_name || 'No Name'}
                                  </p>
                                  <p className="text-caption text-white/60">{user.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="p-6 text-body text-white/80">{user.email}</td>
                            <td className="p-6 text-caption text-white/60">
                              {new Date(user.created_at).toLocaleDateString()}
                            </td>
                            <td className="p-6">
                              <div className="text-caption text-white/60">
                                <span>User</span>
                              </div>
                            </td>
                            <td className="p-6">
                              <div className="flex items-center space-x-3">
                                <span className={`px-3 py-1 rounded-full text-caption font-medium ${
                                  user.is_admin 
                                    ? 'bg-red-500/20 text-red-300' 
                                    : 'bg-green-500/20 text-green-300'
                                }`}>
                                  {user.is_admin ? 'Admin' : 'User'}
                                </span>
                                <button
                                  onClick={() => toggleUserStatus(user.id, !user.is_admin)}
                                  className={`px-3 py-1 rounded-lg text-caption font-medium smooth-transition ${
                                    user.is_admin
                                      ? 'bg-orange-500/20 text-orange-300 hover:bg-orange-500/30'
                                      : 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30'
                                  }`}
                                  title={user.is_admin ? 'Remove Admin Access' : 'Grant Admin Access'}
                                >
                                  {user.is_admin ? 'Remove Admin' : 'Make Admin'}
                                </button>
                              </div>
                            </td>
                            <td className="p-6">
                              <div className="flex space-x-2">
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
                <div className="space-y-6">
                  <div className="glass-card rounded-3xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-subheading gradient-text-red">Create / Edit Blog Post</h2>
                      <button
                        onClick={() => setBlogForm({ title: '', category: '', tags: '', body: '' })}
                        className="px-3 py-2 glass-card rounded-xl text-white/80 hover:text-white"
                      >
                        New
                      </button>
                    </div>
                    <div className="grid gap-4">
                      <input
                        value={blogForm.title}
                        onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                        placeholder="Title"
                        className="w-full px-4 py-3 glass-card rounded-xl text-white placeholder-white/40"
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          value={blogForm.category}
                          onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })}
                          placeholder="Category"
                          className="w-full px-4 py-3 glass-card rounded-xl text-white placeholder-white/40"
                        />
                        <input
                          value={blogForm.tags}
                          onChange={(e) => setBlogForm({ ...blogForm, tags: e.target.value })}
                          placeholder="Tags (comma separated)"
                          className="w-full px-4 py-3 glass-card rounded-xl text-white placeholder-white/40"
                        />
                      </div>
                      <textarea
                        value={blogForm.body}
                        onChange={(e) => setBlogForm({ ...blogForm, body: e.target.value })}
                        placeholder="Body"
                        rows={10}
                        className="w-full px-4 py-3 glass-card rounded-xl text-white placeholder-white/40"
                      />
                      <div className="flex justify-end">
                        <button onClick={submitBlog} className="glass-card-cosmic px-6 py-3 rounded-xl font-semibold">
                          {blogForm.id ? 'Update Post' : 'Publish Post'}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="glass-card rounded-3xl overflow-hidden">
                    <div className="p-6 border-b border-white/5 flex items-center justify-between">
                      <h2 className="text-subheading gradient-text-red">All Blog Posts ({blogs.length})</h2>
                      <button onClick={loadBlogs} className="px-4 py-2 glass-card rounded-xl">Refresh</button>
                    </div>
                    {blogLoading ? (
                      <div className="p-6">Loading...</div>
                    ) : (
                      <div className="divide-y divide-white/5">
                        {blogs.map((b) => (
                          <div key={b.id} className="p-6 flex items-start justify-between">
                            <div>
                              <h3 className="text-body font-semibold">{b.title}</h3>
                              <p className="text-caption text-white/60">{new Date(b.created_at).toLocaleString()} • {b.category || 'General'}</p>
                            </div>
                            <div className="flex gap-2">
                              <button onClick={() => editBlog(b)} className="p-2 glass-card rounded-lg" title="Edit">
                                <Edit2 size={16} />
                              </button>
                              <button onClick={() => deleteBlog(b.id)} className="p-2 glass-card rounded-lg" title="Delete">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
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