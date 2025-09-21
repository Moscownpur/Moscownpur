import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import logoImage from '/logo.jpg';

const PublicHeader: React.FC = () => {
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
  const navigationLinks = [
    { name: 'Features', href: '/features' },
    { name: 'Guide', href: '/world-building-guide' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Blog', href: '/blog' },
    { name: 'About', href: '/about' },
    { name: 'Moscowvitz', href: '/wiki/moscowvitz' },
  ];

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="glass-navbar px-4 md:px-8 py-4 md:py-6 relative"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 md:space-x-3">
          <div className="">
            <img src={logoImage} alt="Moscownpur Logo" className="w-12 h-12 md:w-20 md:h-20" />
          </div>
          <h1 className="text-lg md:text-2xl font-bold gradient-text-cosmic">
            Moscownpur
          </h1>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {navigationLinks.map((link) => (
            <Link key={link.name} to={link.href}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 text-white/80 hover:text-white smooth-transition"
              >
                {link.name}
              </motion.button>
            </Link>
          ))}
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <Link to="/login">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 glass-card text-white/80 hover:text-white rounded-xl smooth-transition hover:soft-glow"
            >
              Sign In
            </motion.button>
          </Link>
          <Link to="/signup">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 glass-card-cosmic text-white rounded-xl font-semibold soft-glow-cosmic smooth-transition"
            >
              Get Started
            </motion.button>
          </Link>
          <Link to="/admin/login">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl smooth-transition text-caption"
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
          className="md:hidden p-2 rounded-xl glass-card hover:soft-glow smooth-transition text-white/80 hover:text-white"
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
              {/* Navigation Links */}
              {navigationLinks.map((link, index) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link to={link.href} onClick={closeMobileMenu}>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center justify-center p-4 rounded-xl bg-black/40 border-2 border-white/20 hover:bg-white/20 hover:border-white/40 smooth-transition text-white font-medium shadow-lg"
                    >
                      <span className="text-sm font-semibold">{link.name}</span>
                    </motion.button>
                  </Link>
                </motion.div>
              ))}

              {/* Divider */}
              <div className="border-t-2 border-white/20 my-4"></div>

              {/* Auth Buttons */}
              <div className="space-y-3">
                <Link to="/login" onClick={closeMobileMenu}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center p-4 rounded-xl bg-black/40 border-2 border-white/20 hover:bg-white/20 hover:border-white/40 smooth-transition text-white font-medium shadow-lg"
                  >
                    <span className="text-sm font-semibold">Sign In</span>
                  </motion.button>
                </Link>
                <Link to="/signup" onClick={closeMobileMenu}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center p-4 rounded-xl bg-gradient-to-r from-purple-500/40 to-pink-500/40 border-2 border-purple-400/60 text-white font-semibold hover:from-purple-500/60 hover:to-pink-500/60 hover:border-purple-400/80 smooth-transition shadow-lg"
                  >
                    <span className="text-sm font-bold">Get Started</span>
                  </motion.button>
                </Link>
                <Link to="/admin/login" onClick={closeMobileMenu}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center p-4 rounded-xl bg-red-500/30 border-2 border-red-400/50 text-red-100 hover:text-white hover:bg-red-500/40 hover:border-red-400/70 smooth-transition font-medium shadow-lg"
                  >
                    <span className="text-sm font-semibold">Admin</span>
                  </motion.button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default PublicHeader;
