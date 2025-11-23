import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Home, Sparkles, BookOpen, CreditCard, PenSquare, Info, Globe, Flame, Monitor, Key, Sun, Moon } from 'lucide-react';
import logoImage from '/logo-v2.png';
import { useResponsive } from '../hooks/useResponsive';
import { useTheme } from '../contexts/ThemeContext';

const PublicHeader: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const { isDesktop } = useResponsive(1200);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

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

  // Sticky header effect
  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current) {
        const sticky = headerRef.current.offsetTop;
        if (window.pageYOffset > sticky) {
          setIsSticky(true);
        } else {
          setIsSticky(false);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      id="public-header"
      ref={headerRef}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`glass-navbar px-4 md:px-8 py-4 z-50 transition-all duration-300 ${isSticky
        ? 'fixed top-0 left-0 right-0'
        : 'relative'
        }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <h1 className="nerko-one-regular text-base sm:text-lg md:text-xl font-bold gradient-text-cosmic">
            Moscownpur
          </h1>
        </Link>

        {/* Desktop Navigation */}
        <div className={`${isDesktop ? 'flex' : 'hidden'} items-center space-x-6`}>
          {navigationLinks.map((link) => {
            // Standardized styling for all buttons
            const isActionButton = ['Sign In', 'Get Started', 'Admin'].includes(link.name);
            const buttonClass = isActionButton
              ? 'px-4 py-2 text-foreground hover:text-primary smooth-transition font-medium'
              : 'px-4 py-2 text-foreground/80 hover:text-foreground smooth-transition font-medium';

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

          {/* Theme Toggle */}
          <motion.button
            whileHover={{ scale: 1.1, rotate: 15 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-white/10 text-foreground/80 hover:text-foreground transition-colors"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </motion.button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className={`${!isDesktop ? 'flex' : 'hidden'} items-center gap-4`}>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-white/10 text-foreground/80"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-xl bg-black/5 text-foreground font-medium shadow-sm hover:shadow-md smooth-transition dark:bg-white/10 dark:text-white"
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
      </div>

      {/* Mobile Menu Sidebar */}
      <AnimatePresence>
        {!isDesktop && isMobileMenuOpen && (
          <>
            {/* Backdrop with blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
              onClick={closeMobileMenu}
            />

            {/* Sidebar */}
            <motion.div
              ref={mobileMenuRef}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 h-screen w-72 bg-background backdrop-blur-2xl p-6 z-[110] shadow-2xl border-l border-border"
              style={{ backgroundColor: 'var(--background)' }}
            >
              <button
                onClick={closeMobileMenu}
                className="absolute top-4 right-4 text-foreground/60 hover:text-foreground transition-colors"
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
              <div className="mt-12 space-y-2">
                {navigationLinks.map((link, index) => {
                  const isActionButton = ['Sign In', 'Get Started', 'Admin'].includes(link.name);
                  const buttonClass = isActionButton
                    ? 'w-full flex items-center justify-start space-x-3 p-2.5 rounded-xl text-foreground hover:bg-accent font-bold'
                    : 'w-full flex items-center justify-start space-x-3 p-2.5 rounded-xl text-foreground/80 hover:bg-accent hover:text-foreground font-bold';

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
                          {link.icon && <link.icon size={18} className="text-foreground/60" />}
                          <span className="text-base font-bold">{link.name}</span>
                        </motion.button>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Global Styles for Active Tab */}
      <style>
        {`
          .active button {
            color: #818cf8 !important; /* Primary color for active tab */
          }
        `}
      </style>
    </motion.header>
  );
};

export default PublicHeader;