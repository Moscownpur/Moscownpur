import React from 'react';
import { Moon, Sun, User, LogOut, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  return (
    <nav className="glass-navbar px-8 py-4">
      <div className="flex items-center justify-between">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-heading gradient-text-cosmic"
        >
          Moscownpur
        </motion.h1>
        
        <div className="flex items-center space-x-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className="p-3 rounded-xl glass-card hover:soft-glow smooth-transition text-white/80 hover:text-white"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </motion.button>
          
          <div className="flex items-center space-x-4">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-3 px-4 py-2 glass-card rounded-xl"
            >
              <User size={16} className="text-white/80" />
              <div className="flex flex-col">
                <span className="text-caption font-medium text-white">
                  {user?.full_name || user?.username}
                </span>
                <span className="text-xs text-white/60">
                  @{user?.username}
                </span>
              </div>
            </motion.div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={logout}
              className="p-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 smooth-transition"
            >
              <LogOut size={18} />
            </motion.button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;