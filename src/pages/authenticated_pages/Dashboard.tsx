import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Globe, Users, MapPin, Clock, BookOpen, Plus, Sparkles, Zap, Heart, Film, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import GlowCard from '../../components/ui/GlowCard';
import NeonButton from '../../components/ui/NeonButton';
import FloatingEmoji from '../../components/ui/FloatingEmoji';
import { useWorlds } from '../../hooks/useWorlds';
import { useChapters } from '../../hooks/useChapters';
import { useCharacters } from '../../hooks/useCharacters';
import { useTimeline } from '../../hooks/useTimeline';
import { useDialogues } from '../../hooks/useDialogues';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { worlds, loading } = useWorlds();
  const { chapters } = useChapters();
  const { characters } = useCharacters();
  const { scenes } = useTimeline();
  const [dialogueCount, setDialogueCount] = useState(0);

  useEffect(() => {
    const fetchDialogueCount = async () => {
      try {
        // First get user's worlds
        const { data: worldsData, error: worldsError } = await supabase
          .from('worlds')
          .select('world_id')
          .eq('user_id', user?.id);

        if (worldsError || !worldsData || worldsData.length === 0) {
          setDialogueCount(0);
          return;
        }

        const userWorldIds = worldsData.map(w => w.world_id);

        // Get chapters in user's worlds
        const { data: chaptersData, error: chaptersError } = await supabase
          .from('chapters')
          .select('chapter_id')
          .in('world_id', userWorldIds);

        if (chaptersError || !chaptersData || chaptersData.length === 0) {
          setDialogueCount(0);
          return;
        }

        const userChapterIds = chaptersData.map(c => c.chapter_id);

        // Get events in user's chapters
        const { data: eventsData, error: eventsError } = await supabase
          .from('events')
          .select('event_id')
          .in('chapter_id', userChapterIds);

        if (eventsError || !eventsData || eventsData.length === 0) {
          setDialogueCount(0);
          return;
        }

        const userEventIds = eventsData.map(e => e.event_id);

        // Get scenes in user's events
        const { data: scenesData, error: scenesError } = await supabase
          .from('scenes')
          .select('scene_id')
          .in('event_id', userEventIds);

        if (scenesError || !scenesData || scenesData.length === 0) {
          setDialogueCount(0);
          return;
        }

        const userSceneIds = scenesData.map(s => s.scene_id);

        // Count dialogues in user's scenes
        const { count, error: countError } = await supabase
          .from('dialogues')
          .select('*', { count: 'exact', head: true })
          .in('scene_id', userSceneIds);
        
        if (!countError && count !== null) {
          setDialogueCount(count);
        }
      } catch (error) {
        console.error('Error fetching dialogue count:', error);
      }
    };

    if (user) {
      fetchDialogueCount();
    }
  }, [user]);

  const stats = [
    { name: 'Worlds', value: worlds.length, icon: Globe, color: 'purple', emoji: '🌍' },
    { name: 'Chapters', value: chapters.length, icon: BookOpen, color: 'blue', emoji: '📖' },
    { name: 'Characters', value: characters.length, icon: Users, color: 'green', emoji: '👥' },
    { name: 'Scenes', value: scenes.length, icon: Film, color: 'orange', emoji: '🎬' },
    { name: 'Dialogues', value: dialogueCount, icon: MessageSquare, color: 'cyan', emoji: '💬' },
  ];

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

  const quickActions = [
    { name: 'Add World', icon: Globe, gradient: 'gradient-text-purple', path: '/dashboard/worlds' },
    { name: 'Add Chapter', icon: BookOpen, gradient: 'gradient-text-blue', path: '/dashboard/chapters' },
    { name: 'Add Character', icon: Users, gradient: 'gradient-text-green', path: '/dashboard/characters' },
    { name: 'Add Scene', icon: Film, gradient: 'gradient-text-orange', path: '/dashboard/scenes' },
    { name: 'Manage Dialogues', icon: MessageSquare, gradient: 'gradient-text-cyan', path: '/dashboard/dialogues' },
  ];

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <motion.div variants={itemVariants} className="relative">
        <div className="flex items-center justify-between">
          <div className="relative">
            <h1 className="text-display gradient-text-cosmic mb-4">
              Welcome to Your Universe
            </h1>
            <p className="text-subheading text-white/60">
              Where stories come alive and worlds are born
            </p>
          </div>
          <Link to="/dashboard/worlds">
            <button className="px-8 py-4 glass-card-cosmic text-white rounded-xl font-semibold hover:scale-105 smooth-transition soft-glow-orange flex items-center space-x-3">
              <Sparkles size={20} />
              <span className="text-body">Create World</span>
            </button>
          </Link>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div 
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8"
      >
        {stats.map((stat) => (
          <motion.div
            key={stat.name}
            whileHover={{ scale: 1.02, y: -4 }}
            className="glass-card rounded-2xl p-8 group smooth-transition hover:soft-glow"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-white/60 text-caption font-medium mb-2">
                  {stat.name}
                </p>
                <p className="text-heading gradient-text-cosmic">
                  {stat.value}
                </p>
              </div>
              <div className="p-4 rounded-2xl glass-card group-hover:soft-glow smooth-transition">
                <stat.icon className="w-7 h-7 text-white/80" />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Recent Worlds */}
      <motion.div variants={itemVariants}>
        <div className="glass-card rounded-3xl overflow-hidden">
          <div className="p-8 border-b border-white/5">
            <div className="flex items-center justify-between">
              <h2 className="text-heading gradient-text-cosmic">
                Your Worlds
              </h2>
              <div className="flex items-center gap-2 text-caption text-white/40">
                <Heart className="w-4 h-4 text-pink-400" />
                <span>Crafted with passion</span>
              </div>
            </div>
          </div>
          <div className="p-8">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-2 border-white/20 border-t-white/80"></div>
              </div>
            ) : worlds.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-20 h-20 glass-card rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Globe className="w-10 h-10 text-white/60" />
                </div>
                <h3 className="text-subheading text-white mb-4">
                  No worlds yet!
                </h3>
                <p className="text-body text-white/60 mb-8">
                  Time to create your first universe and let your imagination run wild
                </p>
                <Link to="/dashboard/worlds">
                  <button className="px-6 py-3 glass-card-cosmic text-white rounded-xl font-semibold hover:scale-105 smooth-transition soft-glow-orange flex items-center gap-3">
                    <Zap size={18} />
                    <span>Start Creating</span>
                  </button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {worlds.slice(0, 6).map((world, index) => (
                  <motion.div
                    key={world.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -4 }}
                  >
                    <Link to={`/worlds/${world.id}`}>
                      <div className="glass-card rounded-2xl p-6 group smooth-transition hover:soft-glow">
                        <div className="flex items-start justify-between mb-4">
                          <h3 className="text-subheading gradient-text-purple group-hover:gradient-text-pink smooth-transition">
                            {world.name}
                          </h3>
                          <span className="px-3 py-1 text-caption font-medium glass-card text-white/80 rounded-full">
                            {world.type}
                          </span>
                        </div>
                        <p className="text-body text-white/60 mb-4 line-clamp-2">
                          {world.description}
                        </p>
                        <div className="flex items-center justify-between text-caption text-white/40">
                          <div className="flex space-x-4">
                            <span>{world.theme}</span>
                          </div>
                          <span>{new Date(world.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {quickActions.map((action) => (
            <Link key={action.name} to={action.path}>
              <motion.div 
                whileHover={{ scale: 1.02, y: -4 }}
                className="glass-card rounded-2xl p-6 text-center group smooth-transition hover:soft-glow"
              >
                <div className="flex flex-col items-center space-y-4">
                  <div className="p-4 glass-card rounded-2xl group-hover:soft-glow smooth-transition">
                    <action.icon className="w-8 h-8 text-white/80" />
                  </div>
                  <span className={`text-body font-medium ${action.gradient}`}>
                    {action.name}
                  </span>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;