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
                    <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl leading-relaxed mb-6">
                      The Official Mascot of Moscownpur
                    </p>
                    <p className="text-lg text-foreground leading-relaxed mb-8">
                      A cool, confident, and slightly rugged anthropomorphic snow leopard guardian from the 
                      Realm of Forgotten Whispers. Clad in a black bomber jacket and Ushanka hat, Moscowvitz 
                      stands as the protector of all characters, wielding the Banner of Memory to shield 
                      creations from the Demon Dragon of Forgetting.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                      <span className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white font-semibold">
                        🐆 Snow Leopard Guardian
                      </span>
                      <span className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full text-white font-semibold">
                        🛡️ Protector of Characters
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
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
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
                    <h3 className="text-xl font-bold text-foreground mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
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
                      In the Realm of Forgotten Whispers, where every character ever imagined is born, Moscowvitz 
                      serves as the guardian king of Moscownpur. As a protector forged of imagination's purest flame, 
                      he stands against the Demon Dragon of Forgetting and the Pixel Demon, ensuring no creation 
                      shall fade unguarded and no tale shall vanish unloved.
                    </p>
                    <p className="text-lg text-white/80 leading-relaxed">
                      Clad in stories and wielding the Banner of Memory, Moscowvitz defends the realm where heroes 
                      of bedtime stories, villains from late-night doodles, and sidekicks no one bothered to finish 
                      find sanctuary from the fickle memory of humans.
                    </p>
                    <div className="flex items-center gap-4 pt-4">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-yellow-400" />
                        <span className="text-white/90 font-medium">Guardian King</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-purple-400" />
                        <span className="text-white/90 font-medium">Banner of Memory</span>
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
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
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
                    In a dimension parallel to human thought, every character ever imagined is born. Heroes of 
                    bedtime stories, villains from late-night doodles, sidekicks no one bothered to finish—they 
                    live, laugh, and vanish when their creators forget them. At the heart of this fragile world, 
                    the Vitzs rose as visionaries, tinkerers, and chroniclers of dreams.
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
                    The Vitzs built Moscownpur—not just stone and mortar, but a living bastion powered by stories 
                    themselves. Here, characters found sanctuary, no longer bound by the fickle memory of humans. 
                    Yet peace has enemies: the Demon Dragon of Forgetting and the Pixel Demon threaten to destroy 
                    or sabotage the realm.
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
                    When the Demon Dragon's shadow threatened to consume all, there arose a guardian from within 
                    the Vitz lineage: Moscowvitz. No citadel, no splinter faction—he was a king forged of imagination's 
                    purest flame, sworn to guard the realm of Moscownpur. Clad in stories, wielding the Banner of Memory, 
                    Moscowvitz stands as the protector of all characters.
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
                  <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Discover the mystical design and distinctive features that make Moscowvitz unique
                  </p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-white mb-4">Physical Description</h3>
                    <p className="text-lg text-white/80 leading-relaxed">
                      Moscowvitz is a cool, confident, and slightly rugged anthropomorphic snow leopard. He has 
                      primarily white fur with dark grey/black spots, bright captivating blue eyes, and a charming 
                      pink nose. He wears a black bomber jacket with a fur-lined collar, black trousers, a crisp 
                      white shirt, and a large black Ushanka hat with earflaps.
                    </p>
                    
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                          <Star className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="text-white font-semibold mb-1">Bright Blue Eyes</h4>
                          <p className="text-white/70 text-sm">Captivating blue eyes that are a striking contrast to the white and grey fur</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                          <Palette className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="text-white font-semibold mb-1">Ushanka Hat</h4>
                          <p className="text-white/70 text-sm">A large, black fur cap with earflaps that is a defining characteristic of his rugged look</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                          <Zap className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="text-white font-semibold mb-1">Bomber Jacket</h4>
                          <p className="text-white/70 text-sm">A black bomber jacket with fur-lined collar, visible pockets, and zipper for a rugged appearance</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
                          <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="text-white font-semibold mb-1">Pink Nose</h4>
                          <p className="text-white/70 text-sm">A charming pink nose that adds a touch of playfulness to his confident expression</p>
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
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
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
                      { trait: 'Confident', desc: 'Cool, confident, and slightly rugged with a striking and appealing design' },
                      { trait: 'Protective', desc: 'Sworn to guard the realm of Moscownpur and protect all characters from threats' },
                      { trait: 'Noble', desc: 'A king forged of imagination\'s purest flame, dedicated to defending the realm' },
                      { trait: 'Athletic', desc: 'Well-built and athletic, appearing strong and capable in his guardian role' },
                      { trait: 'Friendly', desc: 'Has a friendly, slightly mischievous expression that puts others at ease' }
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
                      { func: 'Realm Guardian', desc: 'Protects the Realm of Forgotten Whispers from the Demon Dragon of Forgetting' },
                      { func: 'Character Protector', desc: 'Shields all characters from the Pixel Demon\'s trickery and corruption' },
                      { func: 'Memory Keeper', desc: 'Wields the Banner of Memory to ensure no creation shall fade unguarded' },
                      { func: 'Sanctuary Defender', desc: 'Maintains Moscownpur as a fortress, archive, and sanctuary for all characters' },
                      { func: 'Imagination Guardian', desc: 'Forever lit by the fire of imagination, defending the realm from oblivion' }
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
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
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
                  <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
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