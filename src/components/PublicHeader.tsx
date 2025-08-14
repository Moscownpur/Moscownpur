import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ogImage from '/og-image.png';

const PublicHeader: React.FC = () => {
  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="glass-navbar px-8 py-6"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-3">
          <div className="">
            <img src={ogImage} alt="Moscownpur Logo" className="w-20 h-20" />
          </div>
          <h1 className="text-2xl font-bold gradient-text-cosmic">
            Moscownpur
          </h1>
        </Link>
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/features">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 text-white/80 hover:text-white smooth-transition"
            >
              Features
            </motion.button>
          </Link>
          <Link to="/world-building-guide">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 text-white/80 hover:text-white smooth-transition"
            >
              Guide
            </motion.button>
          </Link>
          <Link to="/pricing">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 text-white/80 hover:text-white smooth-transition"
            >
              Pricing
            </motion.button>
          </Link>
          <Link to="/blog">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 text-white/80 hover:text-white smooth-transition"
            >
              Blog
            </motion.button>
          </Link>
          <Link to="/about">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 text-white/80 hover:text-white smooth-transition"
            >
              About
            </motion.button>
          </Link>
        </div>
        <div className="flex items-center space-x-4">
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
      </div>
    </motion.header>
  );
};

export default PublicHeader;
