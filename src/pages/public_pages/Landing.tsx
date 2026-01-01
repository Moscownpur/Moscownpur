import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Users, MapPin, Clock, BookOpen, ArrowRight, Star, Zap, Globe, MessageSquare, Layers, Feather } from 'lucide-react';
import { motion } from 'framer-motion';
import Footer from '../../components/Footer';
import PublicHeader from '../../components/PublicHeader';
import logoImage from '/logo-v2.png';

// Custom Logo component for features removed as it was unused

const Landing: React.FC = () => {
  const features = [
    {
      icon: Globe,
      title: 'Create Worlds',
      description: 'Build immersive universes with detailed lore, physics, and mythology',
      gradient: 'from-orange-500 to-red-500',
      delay: 0.1
    },
    {
      icon: Users,
      title: 'Develop Characters',
      description: 'Craft compelling characters with rich backstories and relationships',
      gradient: 'from-yellow-500 to-orange-500',
      delay: 0.2
    },
    {
      icon: MapPin,
      title: 'Design Regions',
      description: 'Map out continents, cities, and realms with cultural depth',
      gradient: 'from-red-500 to-pink-500',
      delay: 0.3
    },
    {
      icon: Clock,
      title: 'Chronicle Events',
      description: 'Document historical moments and timeline-shaping events',
      gradient: 'from-orange-400 to-yellow-400',
      delay: 0.4
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
    <div className="min-h-screen bg-background text-foreground overflow-hidden transition-colors duration-500">
      {/* Dynamic Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-orange-500/5 dark:from-background dark:via-background dark:to-orange-500/10 transition-colors duration-500" />
        <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-orange-500/5 to-transparent dark:from-orange-500/10 blur-3xl" />

        {/* Animated Orbs - Firey Theme */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 right-20 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear", delay: 2 }}
          className="absolute bottom-20 left-20 w-96 h-96 bg-red-500/10 rounded-full blur-3xl"
        />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10"
      >
        <PublicHeader />

        {/* Hero Section */}
        <section className="px-6 pt-20 pb-32 md:pt-32 md:pb-40 relative">
          <div className="max-w-7xl mx-auto text-center relative z-10">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="mb-8 relative inline-block"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -top-20 -right-20 text-primary/20 hidden md:block"
              >
                <Globe size={120} />
              </motion.div>

              <h2 className="text-5xl md:text-7xl lg:text-8xl mb-6 leading-tight tracking-tight font-bungee">
                <span className="gradient-text-cosmic font-bungee">Create Your Own</span>
                <br />
                <span className="text-foreground font-bungee">Cinematic Universe</span>
              </h2>
            </motion.div>

            <motion.p
              variants={itemVariants}
              className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-12"
            >
              The ultimate platform for worldbuilders, storytellers, and creators.
              Design universes, craft characters, and chronicle epic tales.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20"
            >
              <Link to="/signup">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-primary text-primary-foreground text-lg font-semibold rounded-2xl shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all flex items-center gap-3"
                >
                  <Sparkles size={20} />
                  Start Creating
                  <ArrowRight size={20} />
                </motion.button>
              </Link>
              <Link to="/login">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 glass-card text-foreground font-semibold rounded-2xl hover:bg-accent/50 transition-all"
                >
                  Sign In
                </motion.button>
              </Link>
            </motion.div>

            {/* Stats Grid */}
            <motion.div
              variants={containerVariants}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto"
            >
              {[
                { label: 'Worlds Created', value: '10K+', icon: Globe, color: 'text-orange-500' },
                { label: 'Active Creators', value: '2.5K+', icon: Users, color: 'text-red-500' },
                { label: 'Characters Born', value: '50K+', icon: Star, color: 'text-yellow-500' },
                { label: 'Stories Told', value: '15K+', icon: BookOpen, color: 'text-amber-500' }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                  className="glass-card p-6 rounded-2xl text-center hover:border-primary/30 transition-colors"
                >
                  <stat.icon className={`w-8 h-8 mx-auto mb-3 ${stat.color}`} />
                  <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="px-6 py-24 bg-secondary/30 relative overflow-hidden">
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-16">
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-primary font-semibold borel-regular tracking-wider uppercase text-sm"
              >
                Powerful Tools
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="font-bungee text-4xl md:text-5xl font-bold mt-3 mb-6"
              >
                Everything You Need
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="nerko-one-regular text-xl text-muted-foreground max-w-2xl mx-auto"
              >
                Comprehensive tools designed for creators who want to build immersive,
                detailed fictional universes.
              </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: feature.delay }}
                  whileHover={{ y: -8 }}
                  className="glass-card p-8 rounded-3xl group hover:border-primary/30 transition-all duration-300"
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-bungee text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="nerko-one-regular text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* About Section with Glassmorphism */}
        <section className="px-6 py-24 relative">
          <div className="max-w-7xl mx-auto">
            <div className="glass-card rounded-[2.5rem] p-8 md:p-16 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-primary/5 to-transparent -z-10" />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div className="space-y-8">
                  <div>
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight font-bungee">
                      Reimagine <br />
                      <span className="gradient-text-cosmic font-bungee">Storytelling</span>
                    </h2>
                    <p className="nerko-one-regular text-lg text-muted-foreground leading-relaxed">
                      Moscownpur was born from the frustration of scattered notes and inconsistent lore.
                      We provide a centralized workspace where your imagination can run wild without losing track of the details.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {[
                      { icon: Zap, text: "Intuitive Design for seamless creation", color: "text-yellow-500" },
                      { icon: Layers, text: "Unified Workspace for all your assets", color: "text-orange-500" },
                      { icon: Star, text: "Powerful Features for deep worldbuilding", color: "text-red-500" }
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 + i * 0.1 }}
                        className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
                      >
                        <item.icon className={`w-6 h-6 ${item.color}`} />
                        <span className="font-medium text-foreground">{item.text}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-orange-500/20 blur-3xl rounded-full" />
                  <div className="relative grid gap-6">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="glass-card p-6 rounded-2xl border-l-4 border-l-orange-500"
                    >
                      <h4 className="font-bold text-lg mb-2">Unified Workspace</h4>
                      <p className="text-sm text-muted-foreground">Keep your characters, locations, and timelines in perfect sync.</p>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="glass-card p-6 rounded-2xl border-l-4 border-l-red-500 ml-8"
                    >
                      <h4 className="font-bold text-lg mb-2">Character Relationships</h4>
                      <p className="text-sm text-muted-foreground">Visualize complex webs of interactions and family trees.</p>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="glass-card p-6 rounded-2xl border-l-4 border-l-yellow-500"
                    >
                      <h4 className="font-bold text-lg mb-2">Timeline Management</h4>
                      <p className="text-sm text-muted-foreground">Never lose track of when events happen in your universe.</p>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Demo CTA */}
        <section className="px-6 py-24">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="glass-card rounded-[2rem] p-12 md:p-20 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10">
                <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-8">
                  <Feather className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6 font-bungee">Experience the Magic</h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
                  Try our advanced dialogue system firsthand. See how we handle character speech,
                  narration, and internal thoughts in a seamless interface.
                </p>

                <Link to="/dialogue-demo">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-10 py-5 gradient-bg-cosmic text-white text-lg font-bold rounded-2xl shadow-xl shadow-primary/30 hover:shadow-primary/50 transition-all flex items-center gap-3 mx-auto"
                  >
                    <MessageSquare size={24} />
                    Try the Demo
                    <ArrowRight size={20} />
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-6 pb-32">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 font-bungee">
              Ready to build your <span className="gradient-text-cosmic font-bungee">Masterpiece?</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              Join thousands of creators who are already bringing their fictional universes to life.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link to="/signup">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-5 bg-foreground text-background text-lg font-bold rounded-2xl hover:bg-foreground/90 transition-all flex items-center gap-3"
                >
                  <Sparkles size={20} />
                  Start Building Now
                </motion.button>
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </motion.div>
    </div>
  );
};

export default Landing;