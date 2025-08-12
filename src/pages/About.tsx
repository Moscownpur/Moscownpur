import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Heart, Lightbulb, Users, Award, Globe, Book, Star, Zap, Shield, Target } from 'lucide-react';

const About: React.FC = () => {
  const teamMembers = [
    {
      name: "Sarah Chen",
      role: "Founder & CEO",
      bio: "Former game designer and author with 15+ years experience in world building and creative storytelling.",
      expertise: ["World Building", "Game Design", "Creative Writing"],
      avatar: "SC"
    },
    {
      name: "Michael Rodriguez",
      role: "Head of Product",
      bio: "Product visionary with a passion for creating tools that empower creators to bring their stories to life.",
      expertise: ["Product Strategy", "User Experience", "Creative Tools"],
      avatar: "MR"
    },
    {
      name: "Emma Thompson",
      role: "Lead Developer",
      bio: "Full-stack developer specializing in creative applications and AI-powered writing tools.",
      expertise: ["Full-Stack Development", "AI Integration", "Creative Software"],
      avatar: "ET"
    },
    {
      name: "David Kim",
      role: "Creative Director",
      bio: "Award-winning author and creative director who understands the challenges of world building.",
      expertise: ["Creative Direction", "Storytelling", "Author Relations"],
      avatar: "DK"
    }
  ];

  const values = [
    {
      icon: <Heart className="text-red-500" size={40} />,
      title: "Passion for Creativity",
      description: "We believe every creator deserves powerful tools to bring their imagination to life."
    },
    {
      icon: <Lightbulb className="text-yellow-500" size={40} />,
      title: "Innovation First",
      description: "Constantly pushing boundaries to create the most advanced world building platform."
    },
    {
      icon: <Users className="text-blue-500" size={40} />,
      title: "Community Driven",
      description: "Our community of creators inspires every feature and improvement we make."
    },
    {
      icon: <Shield className="text-green-500" size={40} />,
      title: "Trust & Security",
      description: "Your creative work is precious - we protect it with enterprise-grade security."
    }
  ];

  const milestones = [
    {
      year: "2024",
      title: "Platform Launch",
      description: "MosCownpur officially launched with core world building features"
    },
    {
      year: "2024",
      title: "10,000+ Users",
      description: "Reached our first major milestone of active creators"
    },
    {
      year: "2024",
      title: "AI Integration",
      description: "Introduced AI-powered story assistance features"
    },
    {
      year: "2024",
      title: "Mobile App",
      description: "Launched mobile companion app for on-the-go world building"
    }
  ];

  const stats = [
    { number: "50,000+", label: "Active Creators" },
    { number: "100,000+", label: "Fictional Universes Created" },
    { number: "1M+", label: "Characters Developed" },
    { number: "5M+", label: "Story Elements Tracked" }
  ];

  return (
    <>
      <Helmet>
        <title>About Us - World Building Platform & Creative Writing Tools | MosCownpur</title>
        <meta name="description" content="Learn about MosCownpur's mission to empower creators with the best world building and universe management tools. Meet our team of passionate creators and innovators." />
        <meta name="keywords" content="about MosCownpur, world building platform, creative writing tools company, universe management software, team behind MosCownpur, creative writing technology" />
        <meta property="og:title" content="About Us - World Building Platform & Creative Writing Tools | MosCownpur" />
        <meta property="og:description" content="Learn about MosCownpur's mission to empower creators with the best world building and universe management tools. Meet our team of passionate creators and innovators." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.moscownpur.in/about" />
        <link rel="canonical" href="https://www.moscownpur.in/about" />
      </Helmet>

      <div className="min-h-screen bg-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-display mb-6">
              About <span className="gradient-text-cosmic">MosCownpur</span>
            </h1>
            <p className="text-subheading text-gray-300 mb-8 max-w-3xl mx-auto">
              We're a team of passionate creators, developers, and storytellers dedicated to 
              building the world's most powerful platform for fictional universe creation and management.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <span className="glass-card px-6 py-3 rounded-full text-sm font-medium soft-glow-blue smooth-transition">World Building</span>
              <span className="glass-card px-6 py-3 rounded-full text-sm font-medium soft-glow-green smooth-transition">Creative Tools</span>
              <span className="glass-card px-6 py-3 rounded-full text-sm font-medium soft-glow-orange smooth-transition">AI Technology</span>
              <span className="glass-card px-6 py-3 rounded-full text-sm font-medium soft-glow-purple smooth-transition">Community</span>
            </div>
          </div>

          {/* Mission Section */}
          <div className="mb-16">
            <div className="glass-card rounded-2xl p-8 md:p-12 soft-glow-cosmic">
              <div className="grid lg:grid-cols-3 gap-8 items-center">
                <div className="lg:col-span-2">
                  <h2 className="text-heading mb-6 gradient-text-blue">Our Mission</h2>
                  <p className="text-subheading text-gray-300 mb-6">
                    To empower creators worldwide with the most comprehensive and intuitive tools 
                    for building, managing, and exploring fictional universes. We believe that every 
                    story deserves a rich, detailed world to call home.
                  </p>
                  <p className="text-body text-gray-400 mb-8">
                    Whether you're writing a novel, creating a game, or developing a screenplay, 
                    MosCownpur provides the foundation you need to bring your creative vision to life. 
                    Our platform combines cutting-edge technology with deep understanding of the 
                    creative process to deliver tools that truly serve creators.
                  </p>
                  <div className="flex gap-4 flex-wrap">
                    <span className="glass-card px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 soft-glow-blue smooth-transition">
                      <Target size={16} />
                      Creator-First Design
                    </span>
                    <span className="glass-card px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 soft-glow-green smooth-transition">
                      <Zap size={16} />
                      Innovation Driven
                    </span>
                    <span className="glass-card px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 soft-glow-orange smooth-transition">
                      <Globe size={16} />
                      Global Community
                    </span>
                  </div>
                </div>
                <div className="text-center">
                  <Globe size={120} className="gradient-text-cosmic mx-auto mb-4" />
                  <h4 className="text-subheading">Building Worlds Together</h4>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="mb-16">
            <h2 className="text-heading text-center mb-12 gradient-text-purple">Our Impact</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-display gradient-text-cosmic mb-2">{stat.number}</div>
                  <p className="text-caption text-gray-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Values Section */}
          <div className="mb-16">
            <h2 className="text-heading text-center mb-12 gradient-text-green">Our Values</h2>
            <div className="grid lg:grid-cols-2 gap-8">
              {values.map((value, index) => (
                <div key={index} className="glass-card rounded-xl p-6 smooth-transition hover:soft-glow-cosmic">
                  <div className="flex items-center mb-4">
                    <div className="mr-4">
                      {value.icon}
                    </div>
                    <h4 className="text-subheading">{value.title}</h4>
                  </div>
                  <p className="text-body text-gray-400">{value.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Team Section */}
          <div className="mb-16">
            <h2 className="text-heading text-center mb-12 gradient-text-orange">Meet Our Team</h2>
            <div className="grid lg:grid-cols-2 gap-8">
              {teamMembers.map((member, index) => (
                <div key={index} className="glass-card rounded-xl p-6 smooth-transition hover:soft-glow-cosmic">
                  <div className="flex items-start mb-4">
                    <div className="gradient-text-cosmic bg-black rounded-full w-16 h-16 flex items-center justify-center mr-4 soft-glow-cosmic">
                      <span className="font-bold text-white text-lg">{member.avatar}</span>
                    </div>
                    <div>
                      <h5 className="text-subheading mb-1">{member.name}</h5>
                      <p className="gradient-text-blue mb-2">{member.role}</p>
                      <p className="text-caption text-gray-400">{member.bio}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {member.expertise.map((skill, idx) => (
                      <span key={idx} className="glass-card text-gray-300 px-3 py-1 rounded-full text-xs smooth-transition">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Milestones Section */}
          <div className="mb-16">
            <h2 className="text-heading text-center mb-12 gradient-text-pink">Our Journey</h2>
            <div className="grid lg:grid-cols-2 gap-8">
              {milestones.map((milestone, index) => (
                <div key={index} className="glass-card rounded-xl p-6 smooth-transition hover:soft-glow-cosmic">
                  <div className="flex items-center mb-4">
                    <span className="gradient-text-cosmic bg-black px-4 py-2 rounded-full text-sm font-medium mr-4 soft-glow-cosmic">{milestone.year}</span>
                    <h5 className="text-subheading">{milestone.title}</h5>
                  </div>
                  <p className="text-body text-gray-400">{milestone.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <div className="glass-card-cosmic rounded-2xl p-8 md:p-12 soft-glow-cosmic">
              <h3 className="text-heading mb-6">Join Our Creative Community</h3>
              <p className="text-subheading text-gray-200 mb-8 max-w-2xl mx-auto">
                Be part of a global community of creators who are building amazing worlds 
                and telling incredible stories with MosCownpur.
              </p>
              <div className="flex justify-center gap-4 flex-wrap">
                <a href="/signup" className="glass-card text-white px-8 py-3 rounded-full font-semibold hover:soft-glow-cosmic smooth-transition">
                  Start Creating Free
                </a>
                <a href="/blog" className="glass-card border border-white text-white px-8 py-3 rounded-full font-semibold hover:soft-glow-cosmic smooth-transition">
                  Read Our Blog
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
