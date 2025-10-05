import React from 'react';
import { Helmet } from 'react-helmet-async';
import PublicHeader from '../../components/PublicHeader';
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
        <meta name="keywords" content="world building guide, fictional universe creation, world building tutorial, story world design, character development, universe building tips, creative writing world building" />
        <meta property="og:title" content="World Building Guide - Complete Tutorial for Creating Fictional Universes | MosCownpur" />
        <meta property="og:description" content="Master the art of world building with our comprehensive guide. Learn how to create immersive fictional universes, develop cultures, design characters, and build compelling story worlds." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://www.moscownpur.in/world-building-guide" />
        <link rel="canonical" href="https://www.moscownpur.in/world-building-guide" />
      </Helmet>

      <div className="min-h-screen bg-background text-foreground dark">
        <PublicHeader />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-display mb-6">
              Complete <span className="gradient-text-cosmic">World Building Guide</span>
            </h1>
            <p className="text-subheading text-muted-foreground mb-8 max-w-3xl mx-auto">
              Master the art of creating immersive fictional universes. This comprehensive guide 
              will teach you everything you need to know about world building, from basic concepts 
              to advanced techniques used by professional authors and game designers.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <span className="glass-card px-6 py-3 rounded-full text-sm font-medium soft-glow-blue smooth-transition">Step-by-Step Tutorial</span>
              <span className="glass-card px-6 py-3 rounded-full text-sm font-medium soft-glow-green smooth-transition">Professional Tips</span>
              <span className="glass-card px-6 py-3 rounded-full text-sm font-medium soft-glow-orange smooth-transition">Common Mistakes</span>
              <span className="glass-card px-6 py-3 rounded-full text-sm font-medium soft-glow-purple smooth-transition">Tools & Resources</span>
            </div>
          </div>

          {/* What is World Building */}
          <div className="mb-16">
            <div className="glass-card rounded-2xl p-8 soft-glow-cosmic">
              <div className="flex items-center mb-6">
                <Globe className="gradient-text-cosmic mr-4" size={40} />
                <h2 className="text-heading">What is World Building?</h2>
              </div>
              <p className="text-subheading text-gray-300 mb-4">
                World building is the process of creating an imaginary world or universe for your story, 
                game, or creative project. It involves developing every aspect of your fictional setting, 
                from geography and history to cultures and characters.
              </p>
              <p className="text-body text-gray-400">
                Whether you're writing a novel, creating a tabletop RPG campaign, or developing a video game, 
                effective world building creates a foundation that makes your story believable and engaging. 
                It's about creating a living, breathing world that readers or players can immerse themselves in.
              </p>
            </div>
          </div>

          {/* Step-by-Step Guide */}
          <div className="mb-16">
            <h2 className="text-heading text-center mb-12 gradient-text-purple">5-Step World Building Process</h2>
            <div className="grid lg:grid-cols-2 gap-8">
              {worldBuildingSteps.map((step, index) => (
                <div key={index} className="glass-card rounded-xl p-6 smooth-transition hover:soft-glow-cosmic">
                  <div className="flex items-center mb-4">
                    <span className="glass-card px-4 py-2 rounded-full text-sm font-medium soft-glow-blue mr-4">Step {step.step}</span>
                    <h4 className="text-subheading mb-0">{step.title}</h4>
                  </div>
                  <p className="text-body text-gray-400 mb-4">{step.description}</p>
                  <h6 className="text-subheading mb-3">Key Elements:</h6>
                  <ul className="mb-4 space-y-2">
                    {step.elements.map((element, idx) => (
                      <li key={idx} className="text-body text-gray-300 flex items-start">
                        <span className="text-green-400 mr-2 mt-1">•</span>
                        {element}
                      </li>
                    ))}
                  </ul>
                  <div className="glass-card bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                    <div className="flex items-start">
                      <Info className="text-blue-400 mr-3 mt-1 flex-shrink-0" size={20} />
                      <div>
                        <strong className="text-blue-400">Pro Tip:</strong>
                        <p className="text-body text-gray-300 mt-1">{step.tips}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Common Mistakes */}
          <div className="mb-16">
            <h2 className="text-heading text-center mb-12 gradient-text-orange">Common World Building Mistakes to Avoid</h2>
            <div className="grid lg:grid-cols-2 gap-8">
              {commonMistakes.map((mistake, index) => (
                <div key={index} className="glass-card rounded-xl p-6 smooth-transition hover:soft-glow-cosmic">
                  <h5 className="text-subheading text-red-400 mb-4 flex items-center">
                    <CheckCircle className="mr-2" size={20} />
                    {mistake.mistake}
                  </h5>
                  <p className="text-body text-gray-400 mb-4">{mistake.description}</p>
                  <div className="glass-card bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                    <div className="flex items-start">
                      <Lightbulb className="text-green-400 mr-3 mt-1 flex-shrink-0" size={20} />
                      <div>
                        <strong className="text-green-400">Solution:</strong>
                        <p className="text-body text-gray-300 mt-1">{mistake.solution}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tools and Resources */}
          <div className="mb-16">
            <h2 className="text-heading text-center mb-12 gradient-text-green">Essential Tools and Resources</h2>
            <div className="grid lg:grid-cols-3 gap-8">
              {toolsAndResources.map((category, index) => (
                <div key={index} className="glass-card rounded-xl p-6 smooth-transition hover:soft-glow-cosmic">
                  <h4 className="text-subheading mb-6">{category.category}</h4>
                  <div className="space-y-4">
                    {category.tools.map((tool, idx) => (
                      <div key={idx} className="border-b border-gray-700 pb-4 last:border-b-0">
                        <div className="flex items-center mb-2">
                          <h6 className="text-body font-semibold">{tool.name}</h6>
                          {tool.featured && (
                            <Star className="text-yellow-400 ml-2" size={16} />
                          )}
                        </div>
                        <p className="text-caption text-gray-400">{tool.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <div className="glass-card-cosmic rounded-2xl p-8 md:p-12 soft-glow-cosmic">
              <h3 className="text-heading mb-6">Ready to Start Building Your World?</h3>
              <p className="text-subheading text-gray-200 mb-8 max-w-2xl mx-auto">
                Put these world building techniques into practice with MosCownpur's comprehensive 
                universe management tools.
              </p>
              <div className="flex justify-center gap-4 flex-wrap">
                <a href="/signup" className="glass-card text-white px-8 py-3 rounded-full font-semibold hover:soft-glow-cosmic smooth-transition">
                  Start Building Free
                </a>
                <a href="/features" className="glass-card border border-white text-white px-8 py-3 rounded-full font-semibold hover:soft-glow-cosmic smooth-transition">
                  Explore Features
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WorldBuildingGuide;

