import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Home, Sparkles, BookOpen, CreditCard, PenSquare, Info, Globe } from 'lucide-react';
import logoImage from '/logo.jpg';

const PublicHeader: React.FC = () => {
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

  const navigationLinks = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Features', href: '/features', icon: Sparkles },
    { name: 'Guide', href: '/world-building-guide', icon: BookOpen },
    { name: 'Pricing', href: '/pricing', icon: CreditCard },
    { name: 'Blog', href: '/blog', icon: PenSquare },
    { name: 'About', href: '/about', icon: Info },
    { name: 'Moscowvitz', href: '/wiki/moscowvitz', icon: Globe },
  ];

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="glass-navbar px-4 md:px-8 py-4 fixed top-0 left-0 right-0 z-50"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="">
            <img src={logoImage} alt="Moscownpur Logo" className="w-12 h-12 rounded-lg shadow-lg" />
          </div>
          <h1 className="text-lg font-bold gradient-text-cosmic text-white">
            Moscownpur
          </h1>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {navigationLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              onClick={closeMobileMenu}
              className={location.pathname === link.href ? 'active' : ''}
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 text-white/80 hover:text-blue-400 smooth-transition"
              >
                {link.name}
              </motion.button>
            </Link>
          ))}
          <Link to="/login" className={location.pathname === '/login' ? 'active' : ''}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 text-white/80 hover:text-blue-400 smooth-transition"
            >
              Sign In
            </motion.button>
          </Link>
          <Link to="/signup" className={location.pathname === '/signup' ? 'active' : ''}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 text-purple-500 hover:text-blue-400 smooth-transition"
            >
              Get Started
            </motion.button>
          </Link>
          <Link to="/admin/login" className={location.pathname === '/admin/login' ? 'active' : ''}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 text-red-400 hover:text-blue-400 smooth-transition"
            >
              Admin
            </motion.button>
          </Link>
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
              {navigationLinks.map((link, index) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                >
                  <Link to={link.href} onClick={closeMobileMenu} className={location.pathname === link.href ? 'active' : ''}>
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full flex items-center justify-start space-x-3 p-2.5 rounded-xl bg-black/70 hover:bg-white/20 hover:text-blue-400 hover:shadow-lg hover:shadow-white/30 smooth-transition text-white font-bold"
                    >
                      <link.icon size={18} className="text-white/80" />
                      <span className="text-base font-bold">{link.name}</span>
                    </motion.button>
                  </Link>
                </motion.div>
              ))}
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
    </motion.header>
  );
};

export default PublicHeader;