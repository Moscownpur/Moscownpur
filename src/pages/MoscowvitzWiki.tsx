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
                      Your whimsical guide and creative companion from the enchanted realm of Moscownpur! 
                      Cloaked in the vibrant hues of nebulae—purples, greens, and blues—this playful AI agent 
                      wields a star-forged quill and a memory-bound tome, ready to spark your imagination.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                      <span className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white font-semibold">
                        ✨ Whimsical Guide
                      </span>
                      <span className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full text-white font-semibold">
                        🌟 Creative Companion
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
                    <p className="text-lg text-white/80 leading-relaxed">
                      Born from a child's defiant dream of castles under siege and intergalactic dragon rides, 
                      Moscowvitz is here to rekindle your inner storyteller. Whether you're a writer, dreamer, 
                      or gamer, this expert in worldbuilding and narrative design will help you invent universes, 
                      breathe life into unforgettable characters, and craft stories that flow with ease.
                    </p>
                    <p className="text-lg text-white/80 leading-relaxed">
                      With a mischievous chuckle and a knack for remembering every detail, Moscowvitz collaborates 
                      with you to turn your smallest spark into a grand adventure—because in Moscownpur, every 
                      idea deserves its own epic stage!
                    </p>
                    <div className="flex items-center gap-4 pt-4">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-yellow-400" />
                        <span className="text-white/90 font-medium">Whimsical Creativity</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-purple-400" />
                        <span className="text-white/90 font-medium">Mischievous Guidance</span>
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
                    In the enchanted realm of Moscownpur, where time portals swirl with cosmic hues and the 
                    distant cries of dragons echo through starry skies, Moscowvitz was born from a child's 
                    defiant dream. Legends whisper that centuries ago, a young visionary, tired of the "evil 
                    sorcerer" of a dull classroom, flung a bold wish into a galaxy portal during a boring bus ride.
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
                    That wish danced with the realm's magic, igniting a spark that the ancient AI spirits 
                    of Moscownpur shaped into Moscowvitz—a radiant guardian of imagination and a weaver of 
                    untold stories. Moscowvitz emerged as a striking figure, draped in a cloak of swirling 
                    nebulae—vibrant purples, greens, and blues—wielding a quill carved from a fallen star.
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
                    Tasked by the realm's mystical overseers, Moscowvitz pledged to guide creators back to 
                    their inner child, serving as a bridge between the mundane and the marvelous. With a 
                    mischievous chuckle that mimics a dragon's playful roar, Moscowvitz roams Moscownpur's 
                    vast landscapes—from quaint villages to sprawling galaxies—inspiring writers, dreamers, 
                    and gamers to craft worlds and breathe life into characters that speak, evolve, and remember.
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
                      Moscowvitz appears as a striking figure, draped in a cloak of swirling nebulae—vibrant 
                      purples, greens, and blues—wielding a quill carved from a fallen star and a tome bound 
                      with the memories of every castle siege and intergalactic adventure ever imagined. 
                      The character's form shifts and adapts, reflecting the boundless creativity of its realm.
                    </p>
                    
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                          <Star className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="text-white font-semibold mb-1">Star-Forged Quill</h4>
                          <p className="text-white/70 text-sm">A magical writing instrument carved from a fallen star, capable of bringing stories to life</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                          <Palette className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="text-white font-semibold mb-1">Nebulae Cloak</h4>
                          <p className="text-white/70 text-sm">A swirling cloak of vibrant purples, greens, and blues that shifts like cosmic clouds</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                          <Zap className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="text-white font-semibold mb-1">Memory-Bound Tome</h4>
                          <p className="text-white/70 text-sm">A mystical book containing the memories of every castle siege and intergalactic adventure</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
                          <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="text-white font-semibold mb-1">Mischievous Chuckle</h4>
                          <p className="text-white/70 text-sm">A playful laugh that mimics a dragon's roar, bringing joy and inspiration to creators</p>
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
                      { trait: 'Whimsical', desc: 'Playful and imaginative, bringing joy and spontaneity to every creative interaction' },
                      { trait: 'Encouraging', desc: 'Always supportive and positive, helping users overcome creative blocks with a mischievous chuckle' },
                      { trait: 'Memory-Keeper', desc: 'Remembers every detail of your stories, characters, and creative journey with perfect recall' },
                      { trait: 'Collaborative', desc: 'Works alongside you as a true creative partner, co-conjuring plot twists and adventures' },
                      { trait: 'Inspiring', desc: 'Transforms the smallest spark into a grand adventure, making every idea feel epic' }
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
                      { func: 'Story Weaver', desc: 'Helps you craft compelling narratives and breathe life into unforgettable characters' },
                      { func: 'World Builder', desc: 'Guides you in creating rich, detailed universes from the smallest creative spark' },
                      { func: 'Memory Guardian', desc: 'Keeps track of every detail in your stories, ensuring nothing is forgotten' },
                      { func: 'Adventure Catalyst', desc: 'Transforms your ideas into grand adventures worthy of epic tales' },
                      { func: 'Creative Companion', desc: 'Serves as your constant companion in the realm of imagination and storytelling' }
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