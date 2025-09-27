import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Sidebar from './Sidebar';
import { useResponsive } from '../hooks/useResponsive';
import logoImage from '/logo.jpg';

const Layout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isDesktop } = useResponsive(1200);

  // Close sidebar when switching to desktop
  useEffect(() => {
    if (isDesktop) {
      setIsSidebarOpen(false);
    }
  }, [isDesktop]);

  return (
    <div className="flex h-screen bg-black overflow-hidden">
      {/* Desktop Sidebar */}
      {isDesktop && (
        <div>
          <Sidebar />
        </div>
      )}

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {!isDesktop && isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setIsSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed left-0 top-0 h-full w-72 z-50"
            >
              <Sidebar />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Minimal Header */}
        <motion.header 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="glass-navbar px-4 md:px-8 py-4 flex items-center justify-between"
        >
          <div className="flex items-center space-x-2">
            <img src={logoImage} alt="Moscownpur Logo" className="w-12 h-12 rounded-lg shadow-lg" />
            <h1 className="text-lg font-bold gradient-text-cosmic text-white">
              Moscownpur
            </h1>
          </div>

          {/* Mobile Hamburger Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`${!isDesktop ? 'block' : 'hidden'} p-2 rounded-xl bg-black/40 text-white font-medium shadow-lg hover:shadow-xl hover:shadow-white/10 smooth-transition`}
            aria-label={isSidebarOpen ? 'Close menu' : 'Open menu'}
          >
            <motion.div
              animate={{ rotate: isSidebarOpen ? 45 : 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.div>
          </motion.button>
        </motion.header>

        <main className="flex-1 overflow-y-auto p-4" style={{ paddingRight: isDesktop ? '2rem' : '1rem', paddingLeft: isDesktop ? '2rem' : '1rem' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;