import React, { useState, useRef, useEffect } from 'react';
import { Moon, Sun, User, LogOut, Menu, X, PanelLeft, Home } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { Link, useLocation } from 'react-router-dom';

interface NavbarProps {
  onMenuToggle?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuToggle }) => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, [isMobileMenuOpen]);

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
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="glass-navbar px-4 md:px-8 py-4 fixed top-0 left-0 right-0 z-50"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {onMenuToggle && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onMenuToggle}
              className="md:hidden p-2 rounded-xl bg-black/40 text-white font-medium shadow-lg hover:shadow-xl hover:shadow-white/10 smooth-transition"
            >
              <PanelLeft size={20} className="text-white" />
            </motion.button>
          )}
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-heading gradient-text-cosmic text-white font-bold"
          >
            Moscownpur
          </motion.h1>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleThemeToggle}
            className="p-3 rounded-xl glass-card hover:text-blue-400 smooth-transition text-white/80"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </motion.button>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-3 px-4 py-2 glass-card rounded-xl hover:text-blue-400 smooth-transition"
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
            onClick={handleLogout}
            className="p-3 rounded-xl text-red-400 hover:text-blue-400 smooth-transition"
          >
            <LogOut size={18} />
          </motion.button>
        </div>

        {/* Mobile Hamburger Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 rounded-xl bg-black/40 text-white font-medium shadow-lg hover:shadow-xl hover:shadow-white/10 smooth-transition"
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          <motion.div
            animate={{ rotate: isMobileMenuOpen ? 45 : 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.div>
        </motion.button>
      </div>

      {/* Mobile Menu Sidebar */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            ref={mobileMenuRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="md:hidden fixed top-0 right-0 h-screen w-64 bg-black/95 backdrop-blur-xl p-6 z-60 shadow-2xl shadow-black/50"
          >
            <button
              onClick={closeMobileMenu}
              className="absolute top-4 right-4 text-white hover:text-gray-300"
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
            <div className="mt-12 space-y-2">
              <Link to="/" onClick={closeMobileMenu} className={location.pathname === '/' ? 'active' : ''}>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full flex items-center justify-start space-x-3 p-2.5 rounded-xl bg-black/70 hover:bg-white/20 hover:text-blue-400 hover:shadow-lg hover:shadow-white/30 smooth-transition text-white font-bold"
                >
                  <Home size={18} className="text-white/80" />
                  <span className="text-base font-bold">Home</span>
                </motion.button>
              </Link>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleThemeToggle}
                className="w-full flex items-center justify-start space-x-3 p-2.5 rounded-xl bg-black/50 hover:bg-white/20 hover:text-blue-400 hover:shadow-lg hover:shadow-white/20 smooth-transition text-white font-semibold"
              >
                <motion.div
                  whileHover={{ rotate: 180, scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                >
                  {theme === 'light' ? <Moon size={18} className="text-white/80" /> : <Sun size={18} className="text-white/80" />}
                </motion.div>
                <span className="text-base font-semibold">{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
              </motion.button>
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                whileHover={{ scale: 1.02, y: -1 }}
                className="flex items-center space-x-3 p-2.5 rounded-xl bg-black/50 hover:bg-white/20 hover:text-blue-400 hover:shadow-lg hover:shadow-white/20 smooth-transition cursor-pointer"
              >
                <motion.div 
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 smooth-transition"
                  whileHover={{ scale: 1.1 }}
                >
                  <User size={16} className="text-white" />
                </motion.div>
                <div className="flex flex-col flex-1">
                  <span className="text-base font-semibold text-white hover:text-blue-400">
                    {user?.full_name || user?.username}
                  </span>
                  <span className="text-sm text-white/70 hover:text-blue-400">
                    @{user?.username}
                  </span>
                </div>
              </motion.div>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="w-full flex items-center justify-start space-x-3 p-2.5 rounded-xl bg-red-500/50 text-red-100 hover:bg-red-500/60 hover:text-blue-400 hover:shadow-lg hover:shadow-red-500/30 smooth-transition"
              >
                <LogOut size={18} className="text-white/80" />
                <span className="text-base font-semibold">Logout</span>
              </motion.button>
              <Link to="/login" onClick={closeMobileMenu} className={location.pathname === '/login' ? 'active' : ''}>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full flex items-center justify-start p-2.5 rounded-xl bg-black/50 hover:bg-white/20 hover:text-blue-400 hover:shadow-lg hover:shadow-white/20 smooth-transition text-white font-semibold"
                >
                  <span className="text-base font-semibold">Sign In</span>
                </motion.button>
              </Link>
              <Link to="/signup" onClick={closeMobileMenu} className={location.pathname === '/signup' ? 'active' : ''}>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full flex items-center justify-start p-2.5 rounded-xl hover:bg-purple-500/20 hover:text-blue-400 hover:shadow-lg hover:shadow-purple-500/30 smooth-transition text-purple-500 font-bold"
                >
                  <span className="text-base font-bold">Get Started</span>
                </motion.button>
              </Link>
              <Link to="/admin/login" onClick={closeMobileMenu} className={location.pathname === '/admin/login' ? 'active' : ''}>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full flex items-center justify-start p-2.5 rounded-xl hover:bg-red-500/20 hover:text-blue-400 hover:shadow-lg hover:shadow-red-500/30 smooth-transition text-red-400 font-semibold"
                >
                  <span className="text-base font-semibold">Admin</span>
                </motion.button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Styles for Active Tab */}
      <style>
        {`
          .active button {
            color: #ff8c42 !important; /* Orange color for active tab */
          }
        `}
      </style>
    </motion.nav>
  );
};

export default Navbar;