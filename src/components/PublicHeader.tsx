import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Home, Sparkles, BookOpen, CreditCard, PenSquare, Info, Globe, Flame, Monitor, Key } from 'lucide-react';
import logoImage from '/logo.jpg';
import { useResponsive } from '../hooks/useResponsive';

const PublicHeader: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isDesktop } = useResponsive(1200);
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

  // Close mobile menu when switching to desktop
  useEffect(() => {
    if (isDesktop) {
      setIsMobileMenuOpen(false);
    }
  }, [isDesktop]);

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
    { name: 'Sign In', href: '/login', icon: Key },
    { name: 'Get Started', href: '/signup', icon: Flame },
    { name: 'Admin', href: '/admin/login', icon: Monitor },
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
        <div className={`${isDesktop ? 'flex' : 'hidden'} items-center space-x-6`}>
          {navigationLinks.map((link) => {
            // Different styling for action buttons
            const isActionButton = ['Sign In', 'Get Started', 'Admin'].includes(link.name);
            const buttonClass = isActionButton 
              ? link.name === 'Get Started' 
                ? 'px-4 py-2 text-green-500 smooth-transition'
                : link.name === 'Admin'
                ? 'px-4 py-2 text-red-400 smooth-transition'
                : 'px-4 py-2 text-blue-400  smooth-transition'
              : 'px-4 py-2 text-white/80 smooth-transition';

            return (
              <Link
                key={link.name}
                to={link.href}
                onClick={closeMobileMenu}
                className={location.pathname === link.href ? 'active' : ''}
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={buttonClass}
                >
                  {link.name}
                </motion.button>
              </Link>
            );
          })}
        </div>

        {/* Mobile Hamburger Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={`${!isDesktop ? 'block' : 'hidden'} p-2 rounded-xl bg-black/40 text-white font-medium shadow-lg hover:shadow-xl hover:shadow-white/10 smooth-transition`}
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
        {!isDesktop && isMobileMenuOpen && (
          <motion.div
            ref={mobileMenuRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-screen w-64 bg-black/95 backdrop-blur-xl p-6 z-60 shadow-2xl shadow-black/50"
          >
            <button
              onClick={closeMobileMenu}
              className="absolute top-4 right-4 text-white hover:text-gray-300"
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
            <div className="mt-12 space-y-2">
              {navigationLinks.map((link, index) => {
                const isActionButton = ['Sign In', 'Get Started', 'Admin'].includes(link.name);
                const buttonClass = isActionButton 
                  ? link.name === 'Get Started' 
                    ? 'w-full flex items-center justify-start space-x-3 p-2.5 rounded-xl text-green-500 font-bold'
                    : link.name === 'Admin'
                    ? 'w-full flex items-center justify-start space-x-3 p-2.5 rounded-xl text-red-400 font-semibold'
                    : 'w-full flex items-center justify-start space-x-3 p-2.5 rounded-xl text-blue-400 font-semibold'
                  : 'w-full flex items-center justify-start space-x-3 p-2.5 rounded-xl bg-black/70 text-white font-bold';

                return (
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
                        className={buttonClass}
                      >
                        {link.icon && <link.icon size={18} className="text-white/80" />}
                        <span className="text-base font-bold">{link.name}</span>
                      </motion.button>
                    </Link>
                  </motion.div>
                );
              })}
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