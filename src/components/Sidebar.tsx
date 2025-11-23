import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Home,
  Globe,
  MapPin,
  Users,
  Clock,
  BookOpen,
  Film,
  FileText,
  Bot,
  Calendar,
  MessageSquare,
  Moon,
  Sun,
  User,
  LogOut,
  Settings,
  Layers
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Worlds', href: '/dashboard/worlds', icon: Globe },
  { name: 'Chapters', href: '/dashboard/chapters', icon: BookOpen },
  { name: 'Characters', href: '/dashboard/characters', icon: Users },
  { name: 'Events', href: '/dashboard/events', icon: Clock },
  { name: 'Scenes', href: '/dashboard/scenes', icon: Film },
  { name: 'Story Editor', href: '/dashboard/story-editor', icon: Layers },
  { name: 'Dialogues', href: '/dashboard/dialogues', icon: MessageSquare },
  { name: 'Timeline', href: '/dashboard/timeline', icon: Calendar },
];

const Sidebar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  return (
    <div className="w-72 glass-sidebar flex flex-col h-full">
      {/* Top Bar Items */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-heading gradient-text-cosmic"
          >
            Moscownpur
          </motion.h1>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className="p-3 rounded-xl glass-card hover:soft-glow smooth-transition text-white/80 hover:text-white"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </motion.button>
        </div>

        {/* User Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center space-x-3 px-4 py-2 glass-card rounded-xl">
            <User size={16} className="text-white/80" />
            <div className="flex flex-col">
              <span className="text-caption font-medium text-white">
                {user?.full_name || user?.username}
              </span>
              <span className="text-xs text-white/60">
                @{user?.username}
              </span>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={logout}
            className="p-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 smooth-transition"
          >
            <LogOut size={18} />
          </motion.button>
        </motion.div>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-6">
        <nav className="space-y-3">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `flex items-center space-x-4 px-5 py-4 rounded-xl smooth-transition group ${isActive
                  ? 'glass-card soft-glow text-white'
                  : 'text-white/60 hover:text-white hover:glass-card'
                }`
              }
            >
              <item.icon size={20} className="group-hover:scale-110 smooth-transition" />
              <span className="font-medium text-body">{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;