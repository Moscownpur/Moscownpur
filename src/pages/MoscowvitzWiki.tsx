import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, Users, Clock, BookOpen, Star, Zap, Globe, MessageSquare, Info, Scroll, Palette, UserCircle, Images, Lightbulb } from 'lucide-react';
import PublicHeader from '../components/PublicHeader';
import Footer from '../components/Footer';

/**
 * Moscowvitz Wiki Page Component
 * 
 * A comprehensive wiki-style page dedicated to Moscowvitz, the official mascot of Moscownpur.
 * This page includes detailed information about the character's lore, appearance, traits,
 * and role within the platform ecosystem.
 */
const MoscowvitzWiki: React.FC = () => {
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
        type: "spring" as const,
        stiffness: 100
      }
    }
  };

  const features = [
    {
      icon: Info,
      title: 'Introduction & Summary',
      description: 'Learn about Moscowvitz\'s role as the mystical guide and companion in the realm of fictional universe creation.',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: Scroll,
      title: 'Lore & History',
      description: 'Discover the origin story, cultural context, and creation narrative of our beloved mascot.',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Palette,
      title: 'Appearance & Design',
      description: 'Explore the mystical design and distinctive features that make Moscowvitz unique.',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: UserCircle,
      title: 'Traits & Role',
      description: 'Understand the personality traits and platform functions that define Moscowvitz.',
      gradient: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <>
      {/* SEO and Meta Tags */}
      <Helmet>
        <title>Moscowvitz - Official Mascot Wiki | Moscownpur</title>
        <meta 
          name="description" 
          content="Discover Moscowvitz, the beloved mascot of Moscownpur. Learn about the character's origin, appearance, personality traits, and role in the fictional universe management platform." 
        />
        <meta 
          name="keywords" 
          content="Moscowvitz, Moscownpur mascot, fictional character, world building, creative writing, universe management, character lore, mascot wiki" 
        />
        <meta property="og:title" content="Moscowvitz - Official Mascot Wiki | Moscownpur" />
        <meta property="og:description" content="Discover Moscowvitz, the beloved mascot of Moscownpur. Learn about the character's origin, appearance, personality traits, and role in the platform." />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://www.moscownpur.in/Moscowvitz.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Moscowvitz - Official Mascot Wiki | Moscownpur" />
        <meta name="twitter:description" content="Discover Moscowvitz, the beloved mascot of Moscownpur. Learn about the character's origin, appearance, personality traits, and role in the platform." />
        <meta name="twitter:image" content="https://www.moscownpur.in/Moscowvitz.png" />
        <link rel="canonical" href="https://www.moscownpur.in/wiki/moscowvitz" />
      </Helmet>

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
          <motion.div variants={itemVariants}>
            <PublicHeader />
          </motion.div>

          {/* Hero Section */}
          <motion.section 
            variants={itemVariants}
            className="px-8 py-20"
          >
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="text-center lg:text-left">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className="mb-8"
                  >
                    <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight">
                      <span className="gradient-text-cosmic">Moscowvitz</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-white/70 max-w-3xl leading-relaxed mb-6">
                      The Official Mascot of Moscownpur
                    </p>
                    <p className="text-lg text-white/80 leading-relaxed mb-8">
                      A mystical guide and companion in the realm of fictional universe creation, 
                      Moscowvitz embodies the spirit of creativity, wisdom, and endless imagination.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                      <span className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white font-semibold">
                        🎭 Fictional Character
                      </span>
                      <span className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full text-white font-semibold">
                        🦉 Mystical Guide
                      </span>
                    </div>
                  </motion.div>
                </div>
                
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="relative"
                  >
                    <div className="glass-card rounded-3xl p-8 shadow-2xl">
                      <img 
                        src="/Moscowvitz.png" 
                        alt="Moscowvitz - The mystical mascot of Moscownpur, a wise owl-like creature with shimmering feathers and an inspiring aura"
                        className="w-full max-w-md mx-auto"
                      />
                    </div>
                    {/* Floating elements around the image */}
                    <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
                    <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full animate-pulse delay-1000"></div>
                    <div className="absolute top-1/2 -left-8 w-4 h-4 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full animate-pulse delay-500"></div>
                  </motion.div>
                </div>
              </div>
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
                  Discover Moscowvitz
                </h2>
                <p className="text-xl text-white/70 max-w-2xl mx-auto">
                  Explore the comprehensive details about our beloved mascot and learn 
                  about the character that guides creators in their universe-building journey.
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

          {/* Introduction & Summary Section */}
          <motion.section 
            variants={itemVariants}
            className="px-8 py-20"
          >
            <div className="max-w-7xl mx-auto">
              <div className="glass-card rounded-3xl p-12 md:p-16">
                <div className="text-center mb-12">
                  <h2 className="text-4xl md:text-5xl font-bold gradient-text-cosmic mb-6">
                    Introduction & Summary
                  </h2>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div className="space-y-6">
                  <h2 className="text-2xl md:text-3xl font-semibold">Who is Moscowvitz?</h2>
                      <p className="text-lg text-white/80 leading-relaxed">
                      Long ago, a young dreamer got bored in class and made a wish to a magical portal. That wish created Moscowvitz, a guide who helps people explore their imagination and tell amazing stories.
                      </p>
                      <p className="text-lg text-white/80 leading-relaxed"> 
                      Moscowvitz is the enigmatic and beloved mascot of Moscownpur, serving as both a guide and inspiration for creators building their fictional universes.
                      Born from the collective imagination of the platform's creators, Moscowvitz 
                      represents the bridge between reality and the infinite possibilities of 
                      creative storytelling.
                    </p>
                    <p className="text-lg text-white/80 leading-relaxed">
                      This mystical character embodies the core values of Moscownpur: creativity, 
                      collaboration, and the endless pursuit of bringing imaginative worlds to life. 
                      Moscowvitz serves as a constant companion to users, offering wisdom, encouragement, 
                      and gentle guidance throughout their creative journey.
                    </p>
                    <div className="flex items-center gap-4 pt-4">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-yellow-400" />
                        <span className="text-white/90 font-medium">Creative Inspiration</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-purple-400" />
                        <span className="text-white/90 font-medium">Wise Guidance</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <div className="glass-card rounded-2xl p-8 space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                          <BookOpen className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h5 className="text-white font-semibold">Storytelling Companion</h5>
                          <p className="text-white/60 text-sm">Guides creators through their narrative journey</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl">
                          <Users className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h5 className="text-white font-semibold">Community Ambassador</h5>
                          <p className="text-white/60 text-sm">Represents platform values and fosters belonging</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
                          <Clock className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h5 className="text-white font-semibold">Progress Celebrator</h5>
                          <p className="text-white/60 text-sm">Acknowledges user achievements and milestones</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Lore & History Section */}
          <motion.section 
            variants={itemVariants}
            className="px-8 py-20"
          >
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold gradient-text-cosmic mb-6">
                  Lore & History
                </h2>
                <p className="text-xl text-white/70 max-w-2xl mx-auto">
                  The fascinating origin story and cultural context behind Moscowvitz's creation
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="glass-card rounded-2xl p-8">
                  <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg">
                      <Scroll className="w-6 h-6 text-white" />
                    </div>
                    Origin Story
                  </h3>
                  <p className="text-white/80 leading-relaxed">
                    Moscowvitz was conceived during the early development of Moscownpur, when the 
                    founders realized they needed a symbol that could represent the platform's 
                    mission of democratizing creative storytelling. The character emerged from 
                    countless brainstorming sessions, drawing inspiration from various mythological 
                    figures, literary guides, and the collective unconscious of creative minds.
                  </p>
                </div>

                <div className="glass-card rounded-2xl p-8">
                  <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                      <Globe className="w-6 h-6 text-white" />
                    </div>
                    Cultural Context
                  </h3>
                  <p className="text-white/80 leading-relaxed">
                    The name "Moscowvitz" is a playful combination of "Moscow" (representing the 
                    platform's global reach) and a suffix that suggests wisdom and guidance. 
                    The character draws from multiple cultural traditions of wise guides and 
                    mystical companions, from the Greek muses to the Norse ravens of Odin, 
                    creating a universal symbol of creative inspiration.
                  </p>
                </div>

                <div className="glass-card rounded-2xl p-8">
                  <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    Creation Story
                  </h3>
                  <p className="text-white/80 leading-relaxed">
                    Moscowvitz first appeared in the digital realm during a particularly challenging 
                    phase of Moscownpur's development. The team was struggling with how to make 
                    the platform more approachable and user-friendly. In a moment of creative 
                    breakthrough, Moscowvitz manifested as the solution—a friendly, knowledgeable 
                    guide who could help users navigate the complexities of world-building.
                  </p>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Appearance & Design Section */}
          <motion.section 
            variants={itemVariants}
            className="px-8 py-20"
          >
            <div className="max-w-7xl mx-auto">
              <div className="glass-card rounded-3xl p-12 md:p-16">
                <div className="text-center mb-12">
                  <h2 className="text-4xl md:text-5xl font-bold gradient-text-cosmic mb-6">
                    Appearance & Design
                  </h2>
                  <p className="text-xl text-white/70 max-w-2xl mx-auto">
                    Discover the mystical design and distinctive features that make Moscowvitz unique
                  </p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-white mb-4">Physical Description</h3>
                    <p className="text-lg text-white/80 leading-relaxed">
                      Moscowvitz appears as a mystical, ethereal being with a form that seems 
                      to shift and adapt based on the context and the viewer's imagination. 
                      The character typically manifests as a wise, owl-like creature with 
                      shimmering feathers that reflect the colors of the creative spectrum.
                    </p>
                    
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                          <Star className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="text-white font-semibold mb-1">Eyes</h4>
                          <p className="text-white/70 text-sm">Large, intelligent eyes that seem to contain galaxies of knowledge and possibility</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                          <Palette className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="text-white font-semibold mb-1">Feathers</h4>
                          <p className="text-white/70 text-sm">Iridescent plumage that shifts between purple, blue, and silver tones</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                          <Zap className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="text-white font-semibold mb-1">Wings</h4>
                          <p className="text-white/70 text-sm">Graceful wings that appear to be made of starlight and imagination</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
                          <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="text-white font-semibold mb-1">Aura</h4>
                          <p className="text-white/70 text-sm">A gentle, inspiring glow that surrounds the character, representing creative energy</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="glass-card rounded-2xl p-8">
                      <img 
                        src="/Moscowvitz.png" 
                        alt="Moscowvitz character design showing distinctive appearance and mystical aura"
                        className="w-full max-w-sm mx-auto mb-4"
                      />
                      <p className="text-white/60 text-sm">
                        <em>Official character design showing Moscowvitz's distinctive 
                        appearance and mystical aura.</em>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Traits & Role Section */}
          <motion.section 
            variants={itemVariants}
            className="px-8 py-20"
          >
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold gradient-text-cosmic mb-6">
                  Traits & Role
                </h2>
                <p className="text-xl text-white/70 max-w-2xl mx-auto">
                  Understanding the personality traits and platform functions that define Moscowvitz
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="glass-card rounded-2xl p-8">
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                      <UserCircle className="w-6 h-6 text-white" />
                    </div>
                    Personality Traits
                  </h3>
                  <div className="space-y-4">
                    {[
                      { trait: 'Wise', desc: 'Possesses deep knowledge about storytelling, world-building, and creative processes' },
                      { trait: 'Encouraging', desc: 'Always supportive and positive, helping users overcome creative blocks' },
                      { trait: 'Patient', desc: 'Understands that great creative work takes time and provides gentle guidance' },
                      { trait: 'Mysterious', desc: 'Maintains an air of wonder and possibility, never fully revealing all secrets' },
                      { trait: 'Adaptive', desc: 'Changes approach based on the user\'s needs and creative style' }
                    ].map((item, index) => (
                      <div key={index} className="flex items-start gap-4">
                        <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                          <Star className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <h4 className="text-white font-semibold mb-1">{item.trait}</h4>
                          <p className="text-white/70 text-sm">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass-card rounded-2xl p-8">
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                      <Globe className="w-6 h-6 text-white" />
                    </div>
                    Function in Moscownpur
                  </h3>
                  <div className="space-y-4">
                    {[
                      { func: 'Onboarding Guide', desc: 'Helps new users understand the platform\'s features and capabilities' },
                      { func: 'Creative Mentor', desc: 'Provides tips, suggestions, and inspiration for world-building projects' },
                      { func: 'Progress Celebrator', desc: 'Acknowledges user achievements and milestones in their creative journey' },
                      { func: 'Community Ambassador', desc: 'Represents the platform\'s values and fosters a sense of belonging' },
                      { func: 'Feature Introducer', desc: 'Announces new features and updates in an engaging, character-driven way' }
                    ].map((item, index) => (
                      <div key={index} className="flex items-start gap-4">
                        <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
                          <Zap className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <h4 className="text-white font-semibold mb-1">{item.func}</h4>
                          <p className="text-white/70 text-sm">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Media Gallery Section */}
          <motion.section 
            variants={itemVariants}
            className="px-8 py-20"
          >
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold gradient-text-cosmic mb-6">
                  Media Gallery
                </h2>
                <p className="text-xl text-white/70 max-w-2xl mx-auto">
                  Visual representations and artwork featuring Moscowvitz
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="glass-card rounded-2xl p-8 text-center">
                  <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-4">
                    <Images className="w-12 h-12 text-white mx-auto" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Concept Art</h3>
                  <p className="text-white/70 text-sm">Initial character sketches and design exploration</p>
                </div>
                <div className="glass-card rounded-2xl p-8 text-center">
                  <div className="p-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl mb-4">
                    <Star className="w-12 h-12 text-white mx-auto" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Official Portrait</h3>
                  <p className="text-white/70 text-sm">High-resolution character artwork for branding</p>
                </div>
                <div className="glass-card rounded-2xl p-8 text-center">
                  <div className="p-4 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl mb-4">
                    <MessageSquare className="w-12 h-12 text-white mx-auto" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Action Scenes</h3>
                  <p className="text-white/70 text-sm">Moscowvitz in various platform contexts</p>
                </div>
              </div>
              
              <div className="text-center mt-8">
                <p className="text-white/60">
                  <em>Gallery images will be added as the character design is finalized. 
                  Each image will include proper alt text for accessibility.</em>
                </p>
              </div>
            </div>
          </motion.section>

          {/* Trivia & Fun Facts Section */}
          <motion.section 
            variants={itemVariants}
            className="px-8 py-20"
          >
            <div className="max-w-7xl mx-auto">
              <div className="glass-card rounded-3xl p-12 md:p-16">
                <div className="text-center mb-12">
                  <h2 className="text-4xl md:text-5xl font-bold gradient-text-cosmic mb-6">
                    Trivia & Fun Facts
                  </h2>
                  <p className="text-xl text-white/70 max-w-2xl mx-auto">
                    Discover the hidden details and development quirks behind Moscowvitz
                  </p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg">
                        <Lightbulb className="w-6 h-6 text-white" />
                      </div>
                      Easter Eggs
                    </h3>
                    <div className="space-y-4">
                      {[
                        'Moscowvitz sometimes appears in unexpected places throughout the platform with encouraging messages',
                        'The character\'s appearance subtly changes based on the time of day or user\'s activity level',
                        'Clicking on Moscowvitz in certain contexts reveals special animations or hidden features'
                      ].map((fact, index) => (
                        <div key={index} className="flex items-start gap-4">
                          <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                            <Sparkles className="w-4 h-4 text-white" />
                          </div>
                          <p className="text-white/80 text-sm">{fact}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                        <Zap className="w-6 h-6 text-white" />
                      </div>
                      Development Quirks
                    </h3>
                    <div className="space-y-4">
                      {[
                        'The name was chosen after 47 different options were considered and rejected',
                        'Moscowvitz\'s voice (when implemented) will be created using a combination of AI and human voice acting',
                        'The character design has evolved through 12 major iterations since the initial concept',
                        'Several design elements were influenced by early user feedback and suggestions'
                      ].map((fact, index) => (
                        <div key={index} className="flex items-start gap-4">
                          <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                            <Star className="w-4 h-4 text-white" />
                          </div>
                          <p className="text-white/80 text-sm">{fact}</p>
                        </div>
                      ))}
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
                  Meet Moscowvitz in Action
                </h2>
                <p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto">
                  Experience Moscowvitz as your creative companion. Start building your 
                  fictional universe today and let our mystical guide help you along the way.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  <Link to="/signup">
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-10 py-5 glass-card-cosmic text-white text-lg font-semibold rounded-2xl soft-glow-orange smooth-transition flex items-center gap-3"
                    >
                      <Sparkles size={24} />
                      Start Creating with Moscowvitz
                    </motion.button>
                  </Link>
                  <Link to="/features">
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-10 py-5 glass-card text-white/90 hover:text-white text-lg font-semibold rounded-2xl hover:soft-glow smooth-transition"
                    >
                      Explore Features
                    </motion.button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Footer */}
          <Footer />
        </motion.div>
      </div>
    </>
  );
};

export default MoscowvitzWiki;