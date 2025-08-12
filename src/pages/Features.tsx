import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import { 
  Globe, 
  Users, 
  Clock, 
  Book, 
  Map, 
  PenTool, 
  Brain, 
  Layers,
  Star,
  Zap,
  Shield,
  Cloud
} from 'react-bootstrap-icons';

const Features: React.FC = () => {
  const features = [
    {
      icon: <Globe className="text-primary" size={40} />,
      title: "World Building Tools",
      description: "Create immersive fictional worlds with our comprehensive world building platform. Design landscapes, cultures, and histories that bring your universe to life.",
      keywords: ["world building", "fictional worlds", "universe creation", "world design"],
      category: "Core"
    },
    {
      icon: <Users className="text-success" size={40} />,
      title: "Character Management System",
      description: "Develop complex characters with detailed profiles, relationships, and character arcs. Track character development across your entire story universe.",
      keywords: ["character management", "character development", "character profiles", "character relationships"],
      category: "Core"
    },
    {
      icon: <Clock className="text-warning" size={40} />,
      title: "Timeline & Event Tracking",
      description: "Organize your story's timeline with precision. Track major events, character milestones, and historical developments across your fictional universe.",
      keywords: ["timeline management", "story timeline", "event tracking", "story chronology"],
      category: "Core"
    },
    {
      icon: <Book className="text-info" size={40} />,
      title: "Chapter & Scene Organization",
      description: "Structure your narrative with our chapter and scene management tools. Organize story elements for better storytelling and plot development.",
      keywords: ["chapter management", "scene organization", "story structure", "plot development"],
      category: "Core"
    },
    {
      icon: <Map className="text-danger" size={40} />,
      title: "Region & Location Mapping",
      description: "Create detailed maps and locations within your fictional universe. Design regions, cities, and landmarks that enhance your world building.",
      keywords: ["region mapping", "location design", "fictional maps", "world geography"],
      category: "Advanced"
    },
    {
      icon: <PenTool className="text-secondary" size={40} />,
      title: "Creative Writing Tools",
      description: "Enhance your creative writing process with specialized tools for story development, dialogue creation, and narrative planning.",
      keywords: ["creative writing", "story development", "dialogue creation", "narrative planning"],
      category: "Advanced"
    },
    {
      icon: <Brain className="text-primary" size={40} />,
      title: "AI-Powered Story Assistance",
      description: "Leverage artificial intelligence to enhance your storytelling. Get suggestions for plot development, character interactions, and world building ideas.",
      keywords: ["AI storytelling", "artificial intelligence", "story assistance", "creative AI"],
      category: "Premium"
    },
    {
      icon: <Layers className="text-success" size={40} />,
      title: "Multi-Universe Management",
      description: "Manage multiple fictional universes simultaneously. Create interconnected worlds or separate story universes with ease.",
      keywords: ["multi-universe", "story universes", "universe management", "interconnected worlds"],
      category: "Premium"
    }
  ];

  const benefits = [
    {
      icon: <Star className="text-warning" size={30} />,
      title: "Professional Quality",
      description: "Create publication-ready content with our professional-grade tools and features."
    },
    {
      icon: <Zap className="text-info" size={30} />,
      title: "Lightning Fast",
      description: "Optimized performance ensures smooth operation even with complex world building projects."
    },
    {
      icon: <Shield className="text-success" size={30} />,
      title: "Secure & Private",
      description: "Your creative work is protected with enterprise-grade security and privacy controls."
    },
    {
      icon: <Cloud className="text-primary" size={30} />,
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

      <div className="min-vh-100 bg-black text-white py-5">
        <Container>
          {/* Hero Section */}
          <Row className="text-center mb-5">
            <Col>
              <h1 className="display-4 fw-bold mb-4">
                Powerful Features for <span className="text-primary">Universe Creation</span>
              </h1>
              <p className="lead mb-4">
                Everything you need to build, manage, and explore fictional universes. 
                From world building to character development, our comprehensive platform 
                empowers creators to bring their stories to life.
              </p>
              <div className="d-flex justify-content-center gap-3 flex-wrap">
                <Badge bg="primary" className="fs-6 px-3 py-2">World Building</Badge>
                <Badge bg="success" className="fs-6 px-3 py-2">Character Management</Badge>
                <Badge bg="warning" className="fs-6 px-3 py-2">Timeline Tracking</Badge>
                <Badge bg="info" className="fs-6 px-3 py-2">Creative Writing</Badge>
                <Badge bg="secondary" className="fs-6 px-3 py-2">AI Assistance</Badge>
              </div>
            </Col>
          </Row>

          {/* Features Grid */}
          <Row className="g-4 mb-5">
            {features.map((feature, index) => (
              <Col key={index} lg={6} xl={4}>
                <Card className="h-100 bg-dark border-0 shadow-lg hover-lift">
                  <Card.Body className="p-4">
                    <div className="d-flex align-items-center mb-3">
                      <div className="me-3">
                        {feature.icon}
                      </div>
                      <div>
                        <h5 className="mb-1">{feature.title}</h5>
                        <Badge bg={feature.category === 'Core' ? 'primary' : feature.category === 'Advanced' ? 'warning' : 'success'}>
                          {feature.category}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-muted mb-0">{feature.description}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Benefits Section */}
          <Row className="mb-5">
            <Col className="text-center">
              <h2 className="mb-5">Why Choose MosCownpur?</h2>
            </Col>
          </Row>
          <Row className="g-4">
            {benefits.map((benefit, index) => (
              <Col key={index} md={6} lg={3}>
                <div className="text-center">
                  <div className="mb-3">
                    {benefit.icon}
                  </div>
                  <h5 className="mb-3">{benefit.title}</h5>
                  <p className="text-muted">{benefit.description}</p>
                </div>
              </Col>
            ))}
          </Row>

          {/* CTA Section */}
          <Row className="text-center mt-5">
            <Col>
              <div className="bg-gradient-primary p-5 rounded-4">
                <h3 className="mb-4">Ready to Start Building Your Universe?</h3>
                <p className="lead mb-4">
                  Join thousands of creators who trust MosCownpur for their world building needs.
                </p>
                <div className="d-flex justify-content-center gap-3 flex-wrap">
                  <a href="/signup" className="btn btn-primary btn-lg px-4">
                    Get Started Free
                  </a>
                  <a href="/" className="btn btn-outline-light btn-lg px-4">
                    Learn More
                  </a>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default Features;

