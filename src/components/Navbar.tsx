import React, { useState, useRef, useEffect } from 'react';
import { Moon, Sun, User, LogOut, Menu, X, PanelLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

interface NavbarProps {
  onMenuToggle?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuToggle }) => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close mobile menu when window is resized to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMobileMenu();
  };

  const handleThemeToggle = () => {
    toggleTheme();
    closeMobileMenu();
  };

  return (
    <nav className="glass-navbar px-4 md:px-8 py-4 relative">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Mobile Sidebar Toggle */}
          {onMenuToggle && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onMenuToggle}
              className="md:hidden p-2 rounded-xl glass-card hover:soft-glow smooth-transition text-white/80 hover:text-white"
            >
              <PanelLeft size={20} />
            </motion.button>
          )}
          
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-heading gradient-text-cosmic"
          >
            Moscownpur
          </motion.h1>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
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

        {/* Mobile Hamburger Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-3 rounded-xl glass-card hover:soft-glow smooth-transition text-white/80 hover:text-white"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </motion.button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            ref={mobileMenuRef}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden absolute top-full left-0 right-0 mt-2 mx-4 glass-card rounded-xl overflow-hidden z-50"
          >
            <div className="p-4 space-y-3">
              {/* Theme Toggle */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleThemeToggle}
                className="w-full flex items-center justify-center space-x-3 p-4 rounded-xl bg-black/40 border-2 border-white/20 hover:bg-white/20 hover:border-white/40 smooth-transition text-white font-medium shadow-lg"
              >
                {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                <span className="text-sm font-semibold">
                  {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                </span>
              </motion.button>

              {/* User Info */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center space-x-3 p-4 rounded-xl bg-black/40 border-2 border-white/20 shadow-lg"
              >
                <div className="p-2 rounded-lg bg-white/10">
                  <User size={16} className="text-white" />
                </div>
                <div className="flex flex-col flex-1">
                  <span className="text-caption font-semibold text-white">
                    {user?.full_name || user?.username}
                  </span>
                  <span className="text-xs text-white/70">
                    @{user?.username}
                  </span>
                </div>
              </motion.div>
              
              {/* Logout Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogout}
                className="w-full flex items-center justify-center space-x-3 p-4 rounded-xl bg-red-500/30 border-2 border-red-400/50 text-red-100 hover:text-white hover:bg-red-500/40 hover:border-red-400/70 smooth-transition font-medium shadow-lg"
              >
                <LogOut size={18} />
                <span className="text-sm font-semibold">Logout</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;