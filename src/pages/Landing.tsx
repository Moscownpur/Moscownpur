import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Sparkles, Users, MapPin, Clock, BookOpen, ArrowRight, Star, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const Landing: React.FC = () => {
  const features = [
    {
      icon: Globe,
      title: 'Create Worlds',
      description: 'Build immersive universes with detailed lore, physics, and mythology',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: Users,
      title: 'Develop Characters',
      description: 'Craft compelling characters with rich backstories and relationships',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: MapPin,
      title: 'Design Regions',
      description: 'Map out continents, cities, and realms with cultural depth',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: Clock,
      title: 'Chronicle Events',
      description: 'Document historical moments and timeline-shaping events',
      gradient: 'from-orange-500 to-red-500'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]" />
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10"
      >
        {/* Header */}
        <motion.header 
          variants={itemVariants}
          className="glass-navbar px-8 py-6"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 glass-card rounded-xl soft-glow">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold gradient-text-cosmic">
                eWorld Creator
              </h1>
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

        {/* Hero Section */}
        <motion.section 
          variants={itemVariants}
          className="px-8 py-20"
        >
          <div className="max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="mb-8"
            >
              <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight">
                <span className="gradient-text-cosmic">Create</span>
                <br />
                <span className="text-white">Infinite Worlds</span>
              </h1>
              <p className="text-xl md:text-2xl text-white/70 max-w-3xl mx-auto leading-relaxed">
                The ultimate platform for worldbuilders, storytellers, and creators. 
                Design universes, craft characters, and chronicle epic tales.
              </p>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16"
            >
              <Link to="/signup">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-5 glass-card-cosmic text-white text-lg font-semibold rounded-2xl soft-glow-orange smooth-transition flex items-center gap-3"
                >
                  <Sparkles size={24} />
                  Start Creating
                  <ArrowRight size={20} />
                </motion.button>
              </Link>
              <Link to="/login">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-5 glass-card text-white/90 hover:text-white text-lg font-semibold rounded-2xl hover:soft-glow smooth-transition"
                >
                  Sign In
                </motion.button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
            >
              {[
                { label: 'Worlds Created', value: '10K+', icon: Globe },
                { label: 'Active Creators', value: '2.5K+', icon: Users },
                { label: 'Characters Born', value: '50K+', icon: Star },
                { label: 'Stories Told', value: '15K+', icon: BookOpen }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  whileHover={{ scale: 1.05, y: -4 }}
                  className="glass-card rounded-2xl p-6 text-center hover:soft-glow smooth-transition"
                >
                  <stat.icon className="w-8 h-8 text-white/80 mx-auto mb-3" />
                  <div className="text-2xl font-bold gradient-text-cosmic mb-1">
                    {stat.value}
                  </div>
                  <div className="text-white/60 text-sm">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* Features Section */}
        <motion.section 
          variants={itemVariants}
          className="px-8 py-20"
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold gradient-text-cosmic mb-6">
                Everything You Need
              </h2>
              <p className="text-xl text-white/70 max-w-2xl mx-auto">
                Powerful tools designed for creators who want to build immersive, 
                detailed fictional universes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -4 }}
                  className="glass-card rounded-2xl p-8 hover:soft-glow smooth-transition"
                >
                  <div className={`p-4 rounded-2xl bg-gradient-to-r ${feature.gradient} mb-6 w-fit`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-white/70 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* About Our Idea Section */}
        <motion.section 
          variants={itemVariants}
          className="px-8 py-20"
        >
          <div className="max-w-7xl mx-auto">
            <div className="glass-card rounded-3xl p-12 md:p-16">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold gradient-text-cosmic mb-6">
                  About Our Idea
                </h2>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <p className="text-lg text-white/80 leading-relaxed">
                    We believe every creator deserves powerful tools to bring their imagination to life. 
                    eWorld Creator was born from the frustration of scattered notes, inconsistent lore, 
                    and the challenge of maintaining complex fictional universes.
                  </p>
                  <p className="text-lg text-white/80 leading-relaxed">
                    Our platform provides a centralized, intuitive workspace where writers, game masters, 
                    and worldbuilders can craft detailed universes with interconnected characters, 
                    rich histories, and immersive storytelling.
                  </p>
                  <div className="flex items-center gap-4 pt-4">
                    <div className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-yellow-400" />
                      <span className="text-white/90 font-medium">Intuitive Design</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-purple-400" />
                      <span className="text-white/90 font-medium">Powerful Features</span>
                    </div>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="glass-card rounded-2xl p-8 space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                        <Globe className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold">Unified Workspace</h4>
                        <p className="text-white/60 text-sm">All your creative elements in one place</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold">Character Relationships</h4>
                        <p className="text-white/60 text-sm">Track complex character interactions</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
                        <Clock className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold">Timeline Management</h4>
                        <p className="text-white/60 text-sm">Chronicle events across your universe</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section 
          variants={itemVariants}
          className="px-8 py-20"
        >
          <div className="max-w-4xl mx-auto text-center">
            <div className="glass-card rounded-3xl p-12 md:p-16">
              <h2 className="text-4xl md:text-5xl font-bold gradient-text-cosmic mb-6">
                Ready to Create?
              </h2>
              <p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto">
                Join thousands of creators who are already building incredible worlds. 
                Start your journey today.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link to="/signup">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-10 py-5 glass-card-cosmic text-white text-lg font-semibold rounded-2xl soft-glow-orange smooth-transition flex items-center gap-3"
                  >
                    <Sparkles size={24} />
                    Create Your First World
                  </motion.button>
                </Link>
                <Link to="/login">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-10 py-5 glass-card text-white/90 hover:text-white text-lg font-semibold rounded-2xl hover:soft-glow smooth-transition"
                  >
                    Sign In
                  </motion.button>
                </Link>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Footer */}
        <motion.footer 
          variants={itemVariants}
          className="px-8 py-12 border-t border-white/5"
        >
          <div className="max-w-7xl mx-auto text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="p-2 glass-card rounded-xl">
                <Globe className="w-6 h-6 text-white/80" />
              </div>
              <span className="text-xl font-bold gradient-text-cosmic">
                eWorld Creator
              </span>
            </div>
            <p className="text-white/60">
              Empowering creators to build infinite worlds
            </p>
          </div>
        </motion.footer>
      </motion.div>
    </div>
  );
};

export default Landing;