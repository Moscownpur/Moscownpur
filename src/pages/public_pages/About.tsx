import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import PublicHeader from '../../components/PublicHeader';
import PublicPageBackground from '../../components/PublicPageBackground';
import Footer from '../../components/Footer';
import { Heart, Lightbulb, Users, Award, Globe, Book, Star, Zap, Shield, Target } from 'lucide-react';

const About: React.FC = () => {
  const teamMembers = [
    {
      name: "Shashank Asthana",
      role: "Contributor",
      bio: "Passionate developer and creative technologist contributing to the world building platform.",
      expertise: ["Development", "Creative Technology", "Platform Building"],
      avatar: "SA"
    },
    {
      name: "Bhavuk Wadhwa",
      role: "Contributor",
      bio: "Dedicated contributor working on innovative features and user experience improvements.",
      expertise: ["User Experience", "Feature Development", "Creative Tools"],
      avatar: "BW"
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
      year: "2025",
      title: "Publish Website",
      description: "MosCownpur website officially launched with core world building features"
    },
    {
      year: "2025",
      title: "AI Integration",
      description: "Introduced AI-powered story assistance features"
    }
  ];

  const stats = [
    { number: "Coming Soon", label: "We're just getting started — stats will appear here as we grow!" }
  ];

  return (
    <>
      <Helmet>
        <title>About Us - World Building Platform & Creative Writing Tools | MosCownpur</title>
        <meta name="description" content="Learn about MosCownpur's mission to empower creators with the best world building and universe management tools. Meet our team of passionate creators and innovators." />
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
              About <span className="gradient-text-cosmic">MosCownpur</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
              We're a team of passionate creators, developers, and storytellers dedicated to
              building the world's most powerful platform for fictional universe creation and management.
            </p>
            <div className="flex justify-center gap-3 flex-wrap">
              {["World Building", "Creative Tools", "AI Technology", "Community"].map((tag, i) => (
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

          {/* Mission Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-24"
          >
            <div className="glass-card rounded-3xl p-10 md:p-12 border-l-4 border-l-blue-500">
              <div className="grid lg:grid-cols-3 gap-10 items-center">
                <div className="lg:col-span-2">
                  <h2 className="text-3xl font-bold mb-6 borel-regular">Our Mission</h2>
                  <p className="text-xl text-foreground/90 mb-6 leading-relaxed">
                    To empower creators worldwide with the most comprehensive and intuitive tools
                    for building, managing, and exploring fictional universes. We believe that every
                    story deserves a rich, detailed world to call home.
                  </p>
                  <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                    Whether you're writing a novel, creating a game, or developing a screenplay,
                    MosCownpur provides the foundation you need to bring your creative vision to life.
                    Our platform combines cutting-edge technology with deep understanding of the
                    creative process to deliver tools that truly serve creators.
                  </p>
                  <div className="flex gap-4 flex-wrap">
                    <span className="px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 bg-blue-500/10 text-blue-500 border border-blue-500/20">
                      <Target size={16} />
                      Creator-First Design
                    </span>
                    <span className="px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 bg-green-500/10 text-green-500 border border-green-500/20">
                      <Zap size={16} />
                      Innovation Driven
                    </span>
                    <span className="px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 bg-orange-500/10 text-orange-500 border border-orange-500/20">
                      <Globe size={16} />
                      Global Community
                    </span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="w-40 h-40 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center animate-pulse-slow">
                    <Globe size={80} className="text-blue-500" />
                  </div>
                  <h4 className="text-xl font-bold nerko-one-regular">Building Worlds Together</h4>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats Section */}
          <div className="mb-24">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-4xl font-bold text-center mb-16 borel-regular"
            >
              Our <span className="gradient-text-cosmic">Impact</span>
            </motion.h2>

            <div className="text-center">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="glass-card rounded-2xl p-10 max-w-3xl mx-auto border border-primary/20 bg-primary/5"
                >
                  <div className="text-5xl md:text-6xl font-bold gradient-text-cosmic mb-6 nerko-one-regular">{stat.number}</div>
                  <p className="text-xl text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Values Section */}
          <div className="mb-24">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-4xl font-bold text-center mb-16 borel-regular"
            >
              Our <span className="text-green-500">Values</span>
            </motion.h2>

            <div className="grid lg:grid-cols-2 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card rounded-2xl p-8 hover:border-primary/30 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-center mb-6">
                    <div className="mr-6 p-3 bg-secondary/30 rounded-xl">
                      {value.icon}
                    </div>
                    <h4 className="text-2xl font-bold nerko-one-regular">{value.title}</h4>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Team Section */}
          <div className="mb-24">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-4xl font-bold text-center mb-16 borel-regular"
            >
              Meet Our <span className="text-orange-500">Team</span>
            </motion.h2>

            <div className="grid lg:grid-cols-2 gap-8">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="glass-card rounded-2xl p-8 hover:border-primary/30 transition-all duration-300 group"
                >
                  <div className="flex items-start mb-6">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center mr-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <span className="font-bold text-white text-2xl">{member.avatar}</span>
                    </div>
                    <div>
                      <h5 className="text-2xl font-bold mb-1 nerko-one-regular">{member.name}</h5>
                      <p className="text-primary font-medium mb-2">{member.role}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{member.bio}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap ml-26 pl-26">
                    {member.expertise.map((skill, idx) => (
                      <span key={idx} className="px-3 py-1 rounded-full text-xs font-medium bg-secondary/50 text-secondary-foreground">
                        {skill}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Milestones Section */}
          <div className="mb-24">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-4xl font-bold text-center mb-16 borel-regular"
            >
              Our <span className="text-pink-500">Journey</span>
            </motion.h2>

            <div className="grid lg:grid-cols-2 gap-8">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="glass-card rounded-2xl p-8 hover:border-primary/30 transition-all"
                >
                  <div className="flex items-center mb-4">
                    <span className="px-4 py-2 rounded-full text-sm font-bold bg-pink-500/10 text-pink-500 mr-4 border border-pink-500/20">{milestone.year}</span>
                    <h5 className="text-xl font-bold nerko-one-regular">{milestone.title}</h5>
                  </div>
                  <p className="text-muted-foreground">{milestone.description}</p>
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
                <h3 className="text-3xl md:text-4xl font-bold mb-6 borel-regular">Join Our Creative Community</h3>
                <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                  Be part of a global community of creators who are building amazing worlds
                  and telling incredible stories with MosCownpur.
                </p>
                <div className="flex justify-center gap-6 flex-wrap">
                  <a href="/signup" className="px-8 py-4 bg-primary text-primary-foreground font-bold rounded-xl shadow-lg hover:shadow-primary/25 transition-all hover:-translate-y-1">
                    Start Creating Free
                  </a>
                  <a href="/blog" className="px-8 py-4 glass-card font-bold rounded-xl hover:bg-secondary/50 transition-all hover:-translate-y-1">
                    Read Our Blog
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

export default About;
