import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import PublicHeader from '../../components/PublicHeader';
import PublicPageBackground from '../../components/PublicPageBackground';
import Footer from '../../components/Footer';
import { Book, Lightbulb, CheckCircle, Info, Star, Globe, Users, Map, Clock, PenTool } from 'lucide-react';

const WorldBuildingGuide: React.FC = () => {
  const worldBuildingSteps = [
    {
      step: 1,
      title: "Define Your World's Foundation",
      description: "Start with the basic elements that will shape your entire universe.",
      elements: [
        "World type (fantasy, sci-fi, historical, contemporary)",
        "Physical laws and magic systems",
        "Geography and climate",
        "Time period and setting"
      ],
      tips: "Consider how these foundational elements will affect every aspect of your world and story."
    },
    {
      step: 2,
      title: "Develop Cultures and Societies",
      description: "Create believable cultures that inhabit your world.",
      elements: [
        "Social structures and hierarchies",
        "Customs, traditions, and rituals",
        "Languages and communication",
        "Economic systems and trade"
      ],
      tips: "Think about how different cultures interact and what conflicts might arise."
    },
    {
      step: 3,
      title: "Create Compelling Characters",
      description: "Develop characters that fit naturally into your world.",
      elements: [
        "Character backgrounds and motivations",
        "Relationships and connections",
        "Character arcs and development",
        "Cultural influences on personality"
      ],
      tips: "Ensure your characters' actions and beliefs make sense within your world's context."
    },
    {
      step: 4,
      title: "Establish History and Timeline",
      description: "Build a rich history that shapes the present.",
      elements: [
        "Major historical events",
        "Wars, conflicts, and peace treaties",
        "Technological and cultural evolution",
        "Legends and myths"
      ],
      tips: "History should explain why your world is the way it is today."
    },
    {
      step: 5,
      title: "Design Locations and Settings",
      description: "Create memorable places that enhance your story.",
      elements: [
        "Cities, towns, and villages",
        "Natural landmarks and wonders",
        "Important buildings and structures",
        "Transportation and travel routes"
      ],
      tips: "Each location should serve a purpose in your story or world."
    }
  ];

  const commonMistakes = [
    {
      mistake: "Inconsistent World Rules",
      description: "Changing the rules of your world without explanation can confuse readers and break immersion.",
      solution: "Establish clear rules early and stick to them, or provide logical explanations for any changes."
    },
    {
      mistake: "Over-Explaining Everything",
      description: "Dumping too much world information at once can overwhelm readers and slow down the story.",
      solution: "Reveal world details gradually through action, dialogue, and natural story progression."
    },
    {
      mistake: "Ignoring Cultural Diversity",
      description: "Creating monolithic cultures can make your world feel unrealistic and one-dimensional.",
      solution: "Include cultural variations, subcultures, and individual differences within societies."
    },
    {
      mistake: "Forgetting the Human Element",
      description: "Focusing too much on world details while neglecting character development.",
      solution: "Remember that readers connect with characters, not just world details."
    },
    {
      mistake: "Copying Existing Worlds",
      description: "Relying too heavily on existing fictional worlds or real-world cultures without adding originality.",
      solution: "Use existing sources as inspiration but add your own unique twists and elements."
    }
  ];

  const toolsAndResources = [
    {
      category: "World Building Software",
      tools: [
        { name: "MosCownpur", description: "Comprehensive universe management platform", featured: true },
        { name: "World Anvil", description: "Popular world building and campaign management tool" },
        { name: "Notion", description: "Flexible workspace for organizing world building notes" }
      ]
    },
    {
      category: "Research Resources",
      tools: [
        { name: "Wikipedia", description: "General knowledge and historical research" },
        { name: "Google Earth", description: "Geographic and environmental inspiration" },
        { name: "Mythology Websites", description: "Cultural and mythological references" }
      ]
    },
    {
      category: "Creative Inspiration",
      tools: [
        { name: "Pinterest", description: "Visual inspiration for characters, locations, and cultures" },
        { name: "ArtStation", description: "Professional artwork and concept art" },
        { name: "National Geographic", description: "Real-world cultures and environments" }
      ]
    }
  ];

  return (
    <>
      <Helmet>
        <title>World Building Guide - Complete Tutorial for Creating Fictional Universes | MosCownpur</title>
        <meta name="description" content="Master the art of world building with our comprehensive guide. Learn how to create immersive fictional universes, develop cultures, design characters, and build compelling story worlds." />
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
              Complete <span className="gradient-text-cosmic">World Building Guide</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
              Master the art of creating immersive fictional universes. This comprehensive guide
              will teach you everything you need to know about world building, from basic concepts
              to advanced techniques used by professional authors and game designers.
            </p>
            <div className="flex justify-center gap-3 flex-wrap">
              {["Step-by-Step Tutorial", "Professional Tips", "Common Mistakes", "Tools & Resources"].map((tag, i) => (
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

          {/* What is World Building */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-24"
          >
            <div className="glass-card rounded-3xl p-10 md:p-12 border-l-4 border-l-orange-500">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-orange-500/10 rounded-xl mr-6">
                  <Globe className="text-orange-500" size={40} />
                </div>
                <h2 className="text-3xl font-bold borel-regular">What is World Building?</h2>
              </div>
              <p className="text-xl text-foreground/90 mb-6 leading-relaxed">
                World building is the process of creating an imaginary world or universe for your story,
                game, or creative project. It involves developing every aspect of your fictional setting,
                from geography and history to cultures and characters.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Whether you're writing a novel, creating a tabletop RPG campaign, or developing a video game,
                effective world building creates a foundation that makes your story believable and engaging.
                It's about creating a living, breathing world that readers or players can immerse themselves in.
              </p>
            </div>
          </motion.div>

          {/* Step-by-Step Guide */}
          <div className="mb-24">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-4xl font-bold text-center mb-16 borel-regular"
            >
              5-Step <span className="gradient-text-cosmic">World Building Process</span>
            </motion.h2>

            <div className="grid lg:grid-cols-2 gap-8">
              {worldBuildingSteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card rounded-2xl p-8 hover:border-primary/30 transition-all duration-300"
                >
                  <div className="flex items-center mb-6">
                    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-bold mr-4">
                      {step.step}
                    </span>
                    <h4 className="text-2xl font-bold nerko-one-regular">{step.title}</h4>
                  </div>
                  <p className="text-muted-foreground mb-6">{step.description}</p>

                  <h6 className="font-bold mb-4 text-foreground/80">Key Elements:</h6>
                  <ul className="mb-6 space-y-3">
                    {step.elements.map((element, idx) => (
                      <li key={idx} className="flex items-start text-muted-foreground">
                        <CheckCircle className="text-green-500 mr-3 mt-1 flex-shrink-0" size={16} />
                        {element}
                      </li>
                    ))}
                  </ul>

                  <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-5">
                    <div className="flex items-start">
                      <Info className="text-blue-500 mr-3 mt-1 flex-shrink-0" size={20} />
                      <div>
                        <strong className="text-blue-500 block mb-1">Pro Tip:</strong>
                        <p className="text-sm text-muted-foreground">{step.tips}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Common Mistakes */}
          <div className="mb-24">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-4xl font-bold text-center mb-16 borel-regular"
            >
              Common Mistakes to <span className="text-red-500">Avoid</span>
            </motion.h2>

            <div className="grid lg:grid-cols-2 gap-8">
              {commonMistakes.map((mistake, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="glass-card rounded-2xl p-8"
                >
                  <h5 className="text-xl font-bold text-red-500 mb-4 flex items-center nerko-one-regular">
                    <span className="mr-3">⚠️</span>
                    {mistake.mistake}
                  </h5>
                  <p className="text-muted-foreground mb-6">{mistake.description}</p>
                  <div className="bg-green-500/5 border border-green-500/10 rounded-xl p-5">
                    <div className="flex items-start">
                      <Lightbulb className="text-green-500 mr-3 mt-1 flex-shrink-0" size={20} />
                      <div>
                        <strong className="text-green-500 block mb-1">Solution:</strong>
                        <p className="text-sm text-muted-foreground">{mistake.solution}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Tools and Resources */}
          <div className="mb-24">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-4xl font-bold text-center mb-16 borel-regular"
            >
              Essential Tools & <span className="text-blue-500">Resources</span>
            </motion.h2>

            <div className="grid lg:grid-cols-3 gap-8">
              {toolsAndResources.map((category, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card rounded-2xl p-8 hover:border-primary/30 transition-all"
                >
                  <h4 className="text-xl font-bold mb-6 nerko-one-regular text-center border-b border-border pb-4">{category.category}</h4>
                  <div className="space-y-6">
                    {category.tools.map((tool, idx) => (
                      <div key={idx} className="group">
                        <div className="flex items-center mb-2">
                          <h6 className="font-bold group-hover:text-primary transition-colors">{tool.name}</h6>
                          {tool.featured && (
                            <Star className="text-yellow-500 ml-2 fill-yellow-500" size={14} />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{tool.description}</p>
                      </div>
                    ))}
                  </div>
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
                <h3 className="text-3xl md:text-4xl font-bold mb-6 borel-regular">Ready to Start Building Your World?</h3>
                <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                  Put these world building techniques into practice with MosCownpur's comprehensive
                  universe management tools.
                </p>
                <div className="flex justify-center gap-6 flex-wrap">
                  <a href="/signup" className="px-8 py-4 bg-primary text-primary-foreground font-bold rounded-xl shadow-lg hover:shadow-primary/25 transition-all hover:-translate-y-1">
                    Start Building Free
                  </a>
                  <a href="/features" className="px-8 py-4 glass-card font-bold rounded-xl hover:bg-secondary/50 transition-all hover:-translate-y-1">
                    Explore Features
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

export default WorldBuildingGuide;

