import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Users, MapPin, Clock, BookOpen, ArrowRight, Star, Zap, Globe, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import Footer from '../../components/Footer';
import PublicHeader from '../../components/PublicHeader';
import logoImage from '/logo.jpg';

// Custom Logo component for features
const LogoIcon: React.FC<{ className?: string }> = ({ className }) => (
  <img src={logoImage} alt="Moscownpur Logo" className={className || "w-40 h-40"} />
);

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
        <div className="min-h-screen bg-background text-foreground overflow-hidden dark">
          {/* Background Effects */}
          <div className="fixed inset-0 bg-background" />
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10"
      >
        {/* Header */}
        <motion.div variants={itemVariants}>
          <PublicHeader />
        </motion.div>

        {/* Maintenance Banner */}
        <motion.div 
          variants={itemVariants}
          className="relative overflow-hidden"
        >
          <div className="bg-gradient-to-r from-orange-500 via-red-500 to-purple-600 p-4 text-center text-white font-semibold relative">
            {/* Animated gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
            
            {/* Moving gradient effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400/30 via-yellow-400/30 to-red-400/30 animate-pulse" 
                 style={{
                   backgroundSize: '200% 100%',
                   animation: 'gradientMove 3s ease-in-out infinite'
                 }}>
            </div>
            
            {/* Content */}
            <div className="relative z-10 flex items-center justify-center gap-3">
              <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
              <span className="text-lg">🚧 This site is under maintenance - We'll be back soon! 🚧</span>
              <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
            </div>
          </div>
        </motion.div>

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
              <h2 className="text-6xl md:text-8xl font-bold mb-6 leading-tight">
                <span className="gradient-text-cosmic">Create Your Own</span>
                <br />
                <span className="text-foreground">Fictional Cinematic Universe</span>
              </h2>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
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
                  className="px-10 py-5 glass-card text-foreground/90 hover:text-foreground text-lg font-semibold rounded-2xl hover:soft-glow smooth-transition"
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
                  <stat.icon className="w-8 h-8 text-foreground/80 mx-auto mb-3" />
                  <div className="text-2xl font-bold gradient-text-cosmic mb-1">
                    {stat.value}
                  </div>
                  <div className="text-muted-foreground text-sm">
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
                    Moscownpur was born from the frustration of scattered notes, inconsistent lore, 
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
                        <BookOpen className="w-6 h-6" />
                      </div>
                                        <div>
                    <h5 className="text-white font-semibold">Unified Workspace</h5>
                    <p className="text-white/60 text-sm">All your creative elements in one place</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h5 className="text-white font-semibold">Character Relationships</h5>
                    <p className="text-white/60 text-sm">Track complex character interactions</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h5 className="text-white font-semibold">Timeline Management</h5>
                    <p className="text-white/60 text-sm">Chronicle events across your universe</p>
                  </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Comprehensive Content Section for SEO */}
        <motion.section 
          variants={itemVariants}
          className="px-8 py-20"
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold gradient-text-cosmic mb-6">
                Create Your Own Fictional Cinematic Universe
              </h2>
              <p className="text-xl text-white/70 max-w-3xl mx-auto">
                MosCownpur is the ultimate platform for worldbuilders, storytellers, and creators who want to build immersive fictional universes. 
                Whether you're writing a novel, creating a game world, or developing a cinematic universe, our comprehensive tools help you bring your vision to life.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
              <div className="space-y-8">
                <div className="glass-card rounded-2xl p-8">
                  <h3 className="text-2xl font-bold text-white mb-4">World Building Excellence</h3>
                  <p className="text-white/80 leading-relaxed mb-4">
                    Create detailed fictional universes with our advanced world building tools. Design complex societies, 
                    establish unique physics and magic systems, and craft rich cultural backgrounds that make your universe feel alive and authentic.
                  </p>
                  <ul className="space-y-2 text-white/70">
                    <li>• Geographic mapping and region design</li>
                    <li>• Cultural and societal development</li>
                    <li>• Magic system and technology creation</li>
                    <li>• Historical timeline and lore management</li>
                  </ul>
                </div>

                <div className="glass-card rounded-2xl p-8">
                  <h3 className="text-2xl font-bold text-white mb-4">Character Development & Management</h3>
                  <p className="text-white/80 leading-relaxed mb-4">
                    Develop compelling characters with rich backstories, complex relationships, and detailed personality traits. 
                    Track character arcs, relationships, and development throughout your story.
                  </p>
                  <ul className="space-y-2 text-white/70">
                    <li>• Character profile creation and management</li>
                    <li>• Relationship mapping and family trees</li>
                    <li>• Character arc tracking and development</li>
                    <li>• Personality and motivation analysis</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-8">
                <div className="glass-card rounded-2xl p-8">
                  <h3 className="text-2xl font-bold text-white mb-4">Timeline & Event Management</h3>
                  <p className="text-white/80 leading-relaxed mb-4">
                    Chronicle the history of your fictional universe with our comprehensive timeline tools. 
                    Track major events, character milestones, and world-changing moments that shape your narrative.
                  </p>
                  <ul className="space-y-2 text-white/70">
                    <li>• Interactive timeline creation</li>
                    <li>• Event categorization and tagging</li>
                    <li>• Character involvement tracking</li>
                    <li>• Historical impact analysis</li>
                  </ul>
                </div>

                <div className="glass-card rounded-2xl p-8">
                  <h3 className="text-2xl font-bold text-white mb-4">Story Creation & Organization</h3>
                  <p className="text-white/80 leading-relaxed mb-4">
                    Write and organize your stories with our intuitive story management system. 
                    Break down your narrative into chapters, scenes, and plot points while maintaining consistency across your universe.
                  </p>
                  <ul className="space-y-2 text-white/70">
                    <li>• Chapter and scene organization</li>
                    <li>• Plot point tracking and development</li>
                    <li>• Story consistency checking</li>
                    <li>• Collaborative writing features</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-12 text-center">
              <h3 className="text-3xl font-bold text-white mb-6">Why Choose MosCownpur for Your Fictional Universe?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <h5 className="text-xl font-semibold text-white mb-3">Professional Tools</h5>
                  <p className="text-white/70">
                    Built by creators for creators, our platform provides professional-grade tools that scale with your creative vision.
                  </p>
                </div>
                <div>
                  <h5 className="text-xl font-semibold text-white mb-3">Seamless Integration</h5>
                  <p className="text-white/70">
                    All your world building, character development, and storytelling tools work together in one unified platform.
                  </p>
                </div>
                <div>
                  <h5 className="text-xl font-semibold text-white mb-3">Community Support</h5>
                  <p className="text-white/70">
                    Join a community of passionate creators, share your worlds, and get inspired by fellow worldbuilders.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Demo Section */}
        <motion.section 
          variants={itemVariants}
          className="px-8 py-20"
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold gradient-text-cosmic mb-6">
                Try It Out
              </h2>
              <p className="text-xl text-white/70 max-w-2xl mx-auto">
                Experience our powerful dialogue system firsthand with our interactive demo
              </p>
            </div>
            
            <div className="glass-card rounded-2xl p-12 text-center">
              <div className="max-w-3xl mx-auto">
                <h3 className="text-3xl font-bold text-white mb-6">Dialogue System Demo</h3>
                <p className="text-white/80 leading-relaxed mb-8">
                  See how our advanced dialogue system handles different types of storytelling elements: 
                  character speech, narration, internal thoughts, and even musical elements. 
                  Experience the power of our sequence management and character integration.
                </p>
                <Link to="/dialogue-demo">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-10 py-5 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-lg font-semibold rounded-2xl hover:shadow-lg transition-all duration-300 flex items-center gap-3 mx-auto"
                  >
                    <MessageSquare size={24} />
                    Try the Demo
                    <ArrowRight size={20} />
                  </motion.button>
                </Link>
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
                    className="px-10 py-5 glass-card text-foreground/90 hover:text-foreground text-lg font-semibold rounded-2xl hover:soft-glow smooth-transition"
                  >
                    Sign In
                  </motion.button>
                </Link>
              </div>
            </div>
          </div>
        </motion.section>

        {/* SEO-Optimized Footer */}
        <Footer />
      </motion.div>
    </div>
  );
};

export default Landing;