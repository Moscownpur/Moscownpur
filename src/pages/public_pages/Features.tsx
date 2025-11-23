import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import PublicHeader from '../../components/PublicHeader';
import PublicPageBackground from '../../components/PublicPageBackground';
import Footer from '../../components/Footer';
import {
  Globe,
  Users,
  Clock,
  Book,
  Map,
  Pencil,
  Lightbulb,
  Layers,
  Star,
  Zap,
  Shield,
  Cloud
} from 'lucide-react';

const Features: React.FC = () => {
  const features = [
    {
      icon: <Globe className="text-orange-500" size={40} />,
      title: "World Building Tools",
      description: "Create immersive fictional worlds with our comprehensive world building platform. Design landscapes, cultures, and histories that bring your universe to life.",
      category: "Core"
    },
    {
      icon: <Users className="text-red-500" size={40} />,
      title: "Character Management",
      description: "Develop complex characters with detailed profiles, relationships, and character arcs. Track character development across your entire story universe.",
      category: "Core"
    },
    {
      icon: <Clock className="text-yellow-500" size={40} />,
      title: "Timeline Tracking",
      description: "Organize your story's timeline with precision. Track major events, character milestones, and historical developments across your fictional universe.",
      category: "Core"
    },
    {
      icon: <Book className="text-amber-500" size={40} />,
      title: "Chapter Organization",
      description: "Structure your narrative with our chapter and scene management tools. Organize story elements for better storytelling and plot development.",
      category: "Core"
    },
    {
      icon: <Map className="text-orange-400" size={40} />,
      title: "Region Mapping",
      description: "Create detailed maps and locations within your fictional universe. Design regions, cities, and landmarks that enhance your world building.",
      category: "Advanced"
    },
    {
      icon: <Pencil className="text-red-400" size={40} />,
      title: "Creative Writing",
      description: "Enhance your creative writing process with specialized tools for story development, dialogue creation, and narrative planning.",
      category: "Advanced"
    },
    {
      icon: <Lightbulb className="text-yellow-400" size={40} />,
      title: "AI Assistance",
      description: "Leverage artificial intelligence to enhance your storytelling. Get suggestions for plot development, character interactions, and world building ideas.",
      category: "Premium"
    },
    {
      icon: <Layers className="text-amber-400" size={40} />,
      title: "Multi-Universe",
      description: "Manage multiple fictional universes simultaneously. Create interconnected worlds or separate story universes with ease.",
      category: "Premium"
    }
  ];

  const benefits = [
    {
      icon: <Star className="text-yellow-500" size={30} />,
      title: "Professional Quality",
      description: "Create publication-ready content with our professional-grade tools and features."
    },
    {
      icon: <Zap className="text-orange-500" size={30} />,
      title: "Lightning Fast",
      description: "Optimized performance ensures smooth operation even with complex world building projects."
    },
    {
      icon: <Shield className="text-red-500" size={30} />,
      title: "Secure & Private",
      description: "Your creative work is protected with enterprise-grade security and privacy controls."
    },
    {
      icon: <Cloud className="text-amber-500" size={30} />,
      title: "Cloud Sync",
      description: "Access your fictional universes from anywhere with automatic cloud synchronization."
    }
  ];

  return (
    <>
      <Helmet>
        <title>Features - World Building & Universe Management Tools | MosCownpur</title>
        <meta name="description" content="Discover powerful features for world building, character management, timeline tracking, and creative writing." />
      </Helmet>

      <div className="min-h-screen bg-background text-foreground overflow-hidden transition-colors duration-500">
        <PublicPageBackground />
        <PublicHeader />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative z-10">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-20"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 borel-regular">
              Powerful Features for <br />
              <span className="gradient-text-cosmic borel-regular">Universe Creation</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
              Everything you need to build, manage, and explore fictional universes.
              From world building to character development, our comprehensive platform
              empowers creators to bring their stories to life.
            </p>

            <div className="flex justify-center gap-3 flex-wrap">
              {["World Building", "Character Management", "Timeline Tracking", "Creative Writing", "AI Assistance"].map((tag, i) => (
                <motion.span
                  key={tag}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card px-5 py-2 rounded-full text-sm font-medium hover:bg-primary/10 transition-colors cursor-default"
                >
                  {tag}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -5 }}
                className="glass-card rounded-2xl p-8 hover:border-primary/30 transition-all duration-300"
              >
                <div className="flex items-start mb-6">
                  <div className="p-3 bg-secondary/50 rounded-xl mr-4">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 nerko-one-regular">{feature.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${feature.category === 'Core' ? 'bg-blue-500/10 text-blue-500' :
                        feature.category === 'Advanced' ? 'bg-orange-500/10 text-orange-500' :
                          'bg-purple-500/10 text-purple-500'
                      }`}>
                      {feature.category}
                    </span>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Benefits Section */}
          <div className="mb-24">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-4xl font-bold text-center mb-16 borel-regular"
            >
              Why Choose <span className="gradient-text-cosmic">MosCownpur?</span>
            </motion.h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center p-6"
                >
                  <div className="mb-6 inline-flex p-4 glass-card rounded-full">
                    {benefit.icon}
                  </div>
                  <h5 className="text-xl font-bold mb-3 nerko-one-regular">{benefit.title}</h5>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="glass-card rounded-3xl p-12 md:p-16 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-transparent to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10">
                <h3 className="text-3xl md:text-4xl font-bold mb-6 borel-regular">Ready to Start Building Your Universe?</h3>
                <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                  Join thousands of creators who trust MosCownpur for their world building needs.
                </p>
                <div className="flex justify-center gap-6 flex-wrap">
                  <a href="/signup" className="px-8 py-4 bg-primary text-primary-foreground font-bold rounded-xl shadow-lg hover:shadow-primary/25 transition-all hover:-translate-y-1">
                    Get Started Free
                  </a>
                  <a href="/" className="px-8 py-4 glass-card font-bold rounded-xl hover:bg-secondary/50 transition-all hover:-translate-y-1">
                    Learn More
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default Features;

