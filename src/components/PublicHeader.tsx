import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Home, Sparkles, BookOpen, CreditCard, PenSquare, Info, Globe, Flame, Monitor, Key } from 'lucide-react';
import { useResponsive } from '../hooks/useResponsive';
import ThemeSwitcher from './ThemeSwitcher';
import DarkModeToggle from './DarkModeToggle';
import DynamicLogo from './DynamicLogo';

const PublicHeader: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
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

  // Scroll detection for dynamic styling (combining both approaches)
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  // Premium Link Styles (inspired by temp/navbar.jsx)
  const linkClasses = (path: string) => `
    relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-full
    ${isActive(path)
      ? "text-black bg-white"  // Active state: Pill shape
      : "text-gray-400 hover:text-white hover:bg-white/10" // Inactive: Ghost hover
    }
  `;

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
    <>
      {/* 
       Floating Navbar Container 
       - Combines sticky positioning with floating design from temp/navbar.jsx
      */}
      <nav
        className={`fixed left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-in-out box-border
            ${scrolled
            ? "top-4 w-[95%] md:w-[90%] max-w-6xl rounded-full bg-black/80 backdrop-blur-xl shadow-[0_0_30px_-5px_var(--primary)]"
            : "top-0 w-full max-w-[100vw] backdrop-blur-xl border-b border-transparent py-2"
          }
        `}
      >
        {/* Glowing Gradient Border */}
        {scrolled && (
          <div className="absolute inset-0 rounded-full p-[1px] -z-10 bg-gradient-to-r from-white/20 via-[var(--primary)] to-white/20">
            <div className="w-full h-full bg-black/90 rounded-full backdrop-blur-xl"></div>
          </div>
        )}

        <div className={`px-6 ${scrolled ? "py-3" : "py-4"} flex justify-between items-center transition-all duration-500 relative`}>

          {/* --- BRAND (updated with logo animation) --- */}
          <Link to="/" className="flex items-center gap-3 group">
            {scrolled ? <DynamicLogo scrolled={scrolled} /> : ''}
            <span className={`font-bungee tracking-wide gradient-text-cosmic transition-all duration-500 ${scrolled ? "text-xl" : "text-2xl"}`}>
              Moscownpur
            </span>
          </Link>

          {/* --- DESKTOP NAVIGATION (Centered) --- */}
          <div className="hidden md:flex items-center gap-2 bg-black/20 p-1 rounded-full border border-white/5 backdrop-blur-md">
            {navigationLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={linkClasses(link.href)}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* --- ACTIONS --- */}
          <div className="hidden md:flex items-center gap-4">
            <ThemeSwitcher />
            <DarkModeToggle />
          </div>

          {/* --- MOBILE TOGGLE --- */}
          <div className="md:hidden flex items-center gap-4">
            <ThemeSwitcher />
            <DarkModeToggle />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </motion.button>
          </div>

        </div>

        {/* --- MOBILE MENU OVERLAY --- */}
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
                onClick={() => setIsMobileMenuOpen(false)}
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
                  onClick={() => setIsMobileMenuOpen(false)}
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
                        <Link to={link.href} onClick={() => setIsMobileMenuOpen(false)} className={location.pathname === link.href ? 'active' : ''}>
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
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/10">
                  <span className="text-gray-400 text-sm">Theme</span>
                  <div className="flex items-center gap-4">
                    <ThemeSwitcher />
                    <DarkModeToggle />
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Global Styles for Active Tab */}
        <style>
          {`
            .active button {
              color: var(--primary) !important; /* Primary color for active tab */
            }
          `}
        </style>
      </nav>
    </>
  );
};

export default PublicHeader;