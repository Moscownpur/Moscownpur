import React from 'react';
import { Helmet } from 'react-helmet-async';
import PublicHeader from '../../components/PublicHeader';
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
      icon: <Globe className="text-blue-500" size={40} />,
      title: "World Building Tools",
      description: "Create immersive fictional worlds with our comprehensive world building platform. Design landscapes, cultures, and histories that bring your universe to life.",
      keywords: ["world building", "fictional worlds", "universe creation", "world design"],
      category: "Core"
    },
    {
      icon: <Users className="text-green-500" size={40} />,
      title: "Character Management System",
      description: "Develop complex characters with detailed profiles, relationships, and character arcs. Track character development across your entire story universe.",
      keywords: ["character management", "character development", "character profiles", "character relationships"],
      category: "Core"
    },
    {
      icon: <Clock className="text-yellow-500" size={40} />,
      title: "Timeline & Event Tracking",
      description: "Organize your story's timeline with precision. Track major events, character milestones, and historical developments across your fictional universe.",
      keywords: ["timeline management", "story timeline", "event tracking", "story chronology"],
      category: "Core"
    },
    {
      icon: <Book className="text-cyan-500" size={40} />,
      title: "Chapter & Scene Organization",
      description: "Structure your narrative with our chapter and scene management tools. Organize story elements for better storytelling and plot development.",
      keywords: ["chapter management", "scene organization", "story structure", "plot development"],
      category: "Core"
    },
    {
      icon: <Map className="text-red-500" size={40} />,
      title: "Region & Location Mapping",
      description: "Create detailed maps and locations within your fictional universe. Design regions, cities, and landmarks that enhance your world building.",
      keywords: ["region mapping", "location design", "fictional maps", "world geography"],
      category: "Advanced"
    },
    {
      icon: <Pencil className="text-gray-400" size={40} />,
      title: "Creative Writing Tools",
      description: "Enhance your creative writing process with specialized tools for story development, dialogue creation, and narrative planning.",
      keywords: ["creative writing", "story development", "dialogue creation", "narrative planning"],
      category: "Advanced"
    },
    {
      icon: <Lightbulb className="text-purple-500" size={40} />,
      title: "AI-Powered Story Assistance",
      description: "Leverage artificial intelligence to enhance your storytelling. Get suggestions for plot development, character interactions, and world building ideas.",
      keywords: ["AI storytelling", "artificial intelligence", "story assistance", "creative AI"],
      category: "Premium"
    },
    {
      icon: <Layers className="text-emerald-500" size={40} />,
      title: "Multi-Universe Management",
      description: "Manage multiple fictional universes simultaneously. Create interconnected worlds or separate story universes with ease.",
      keywords: ["multi-universe", "story universes", "universe management", "interconnected worlds"],
      category: "Premium"
    }
  ];

  const benefits = [
    {
      icon: <Star className="text-yellow-400" size={30} />,
      title: "Professional Quality",
      description: "Create publication-ready content with our professional-grade tools and features."
    },
    {
      icon: <Zap className="text-blue-400" size={30} />,
      title: "Lightning Fast",
      description: "Optimized performance ensures smooth operation even with complex world building projects."
    },
    {
      icon: <Shield className="text-green-400" size={30} />,
      title: "Secure & Private",
      description: "Your creative work is protected with enterprise-grade security and privacy controls."
    },
    {
      icon: <Cloud className="text-purple-400" size={30} />,
      title: "Cloud Sync",
      description: "Access your fictional universes from anywhere with automatic cloud synchronization."
    }
  ];

  return (
    <>
      <Helmet>
        <title>Features - World Building & Universe Management Tools | MosCownpur</title>
        <meta name="description" content="Discover powerful features for world building, character management, timeline tracking, and creative writing. Build immersive fictional universes with our comprehensive tools." />
        <meta name="keywords" content="world building tools, character management, timeline tracking, creative writing software, fictional universe creation, story development tools, universe management platform" />
        <meta property="og:title" content="Features - World Building & Universe Management Tools | MosCownpur" />
        <meta property="og:description" content="Discover powerful features for world building, character management, timeline tracking, and creative writing. Build immersive fictional universes with our comprehensive tools." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.moscownpur.in/features" />
        <link rel="canonical" href="https://www.moscownpur.in/features" />
      </Helmet>

      <div className="min-h-screen bg-background text-foreground dark">
        <PublicHeader />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-display mb-6">
              Powerful Features for <span className="gradient-text-cosmic">Universe Creation</span>
            </h1>
            <p className="text-subheading text-muted-foreground mb-8 max-w-3xl mx-auto">
              Everything you need to build, manage, and explore fictional universes. 
              From world building to character development, our comprehensive platform 
              empowers creators to bring their stories to life.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <span className="glass-card px-6 py-3 rounded-full text-sm font-medium soft-glow-blue smooth-transition">World Building</span>
              <span className="glass-card px-6 py-3 rounded-full text-sm font-medium soft-glow-green smooth-transition">Character Management</span>
              <span className="glass-card px-6 py-3 rounded-full text-sm font-medium soft-glow-orange smooth-transition">Timeline Tracking</span>
              <span className="glass-card px-6 py-3 rounded-full text-sm font-medium soft-glow-purple smooth-transition">Creative Writing</span>
              <span className="glass-card px-6 py-3 rounded-full text-sm font-medium soft-glow-cosmic smooth-transition">AI Assistance</span>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => (
              <div key={index} className="glass-card rounded-xl p-6 smooth-transition hover:soft-glow-cosmic h-full">
                <div className="flex items-center mb-4">
                  <div className="mr-4">
                    {feature.icon}
                  </div>
                  <div>
                    <h5 className="text-subheading mb-2">{feature.title}</h5>
                    <span className={`glass-card px-3 py-1 rounded-full text-xs font-medium ${
                      feature.category === 'Core' ? 'soft-glow-blue' : 
                      feature.category === 'Advanced' ? 'soft-glow-orange' : 
                      'soft-glow-green'
                    }`}>
                      {feature.category}
                    </span>
                  </div>
                </div>
                <p className="text-body text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Benefits Section */}
          <div className="mb-16">
            <h2 className="text-heading text-center mb-12 gradient-text-purple">Why Choose MosCownpur?</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="text-center">
                  <div className="mb-4">
                    {benefit.icon}
                  </div>
                  <h5 className="text-subheading mb-3">{benefit.title}</h5>
                  <p className="text-body text-muted-foreground">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <div className="glass-card-cosmic rounded-2xl p-8 md:p-12 soft-glow-cosmic">
              <h3 className="text-heading mb-6">Ready to Start Building Your Universe?</h3>
              <p className="text-subheading text-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of creators who trust MosCownpur for their world building needs.
              </p>
              <div className="flex justify-center gap-4 flex-wrap">
                <a href="/signup" className="glass-card text-foreground px-8 py-3 rounded-full font-semibold hover:soft-glow-cosmic smooth-transition">
                  Get Started Free
                </a>
                <a href="/" className="glass-card border border-border text-foreground px-8 py-3 rounded-full font-semibold hover:soft-glow-cosmic smooth-transition">
                  Learn More
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Features;

