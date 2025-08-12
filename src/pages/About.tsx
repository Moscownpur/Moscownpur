import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import { 
  Heart, 
  Lightbulb, 
  People, 
  Award, 
  Globe,
  Book,
  Star,
  Zap,
  Shield,
  Target
} from 'react-bootstrap-icons';

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
      icon: <Heart className="text-danger" size={40} />,
      title: "Passion for Creativity",
      description: "We believe every creator deserves powerful tools to bring their imagination to life."
    },
    {
      icon: <Lightbulb className="text-warning" size={40} />,
      title: "Innovation First",
      description: "Constantly pushing boundaries to create the most advanced world building platform."
    },
    {
      icon: <People className="text-primary" size={40} />,
      title: "Community Driven",
      description: "Our community of creators inspires every feature and improvement we make."
    },
    {
      icon: <Shield className="text-success" size={40} />,
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

      <div className="min-vh-100 bg-black text-white py-5">
        <Container>
          {/* Hero Section */}
          <Row className="text-center mb-5">
            <Col>
              <h1 className="display-4 fw-bold mb-4">
                About <span className="text-primary">MosCownpur</span>
              </h1>
              <p className="lead mb-4">
                We're a team of passionate creators, developers, and storytellers dedicated to 
                building the world's most powerful platform for fictional universe creation and management.
              </p>
              <div className="d-flex justify-content-center gap-3 flex-wrap">
                <Badge bg="primary" className="fs-6 px-3 py-2">World Building</Badge>
                <Badge bg="success" className="fs-6 px-3 py-2">Creative Tools</Badge>
                <Badge bg="warning" className="fs-6 px-3 py-2">AI Technology</Badge>
                <Badge bg="info" className="fs-6 px-3 py-2">Community</Badge>
              </div>
            </Col>
          </Row>

          {/* Mission Section */}
          <Row className="mb-5">
            <Col>
              <Card className="bg-dark border-0 shadow-lg">
                <Card.Body className="p-5">
                  <div className="row align-items-center">
                    <div className="col-lg-8">
                      <h2 className="mb-4">Our Mission</h2>
                      <p className="lead mb-4">
                        To empower creators worldwide with the most comprehensive and intuitive tools 
                        for building, managing, and exploring fictional universes. We believe that every 
                        story deserves a rich, detailed world to call home.
                      </p>
                      <p className="mb-4">
                        Whether you're writing a novel, creating a game, or developing a screenplay, 
                        MosCownpur provides the foundation you need to bring your creative vision to life. 
                        Our platform combines cutting-edge technology with deep understanding of the 
                        creative process to deliver tools that truly serve creators.
                      </p>
                      <div className="d-flex gap-3 flex-wrap">
                        <Badge bg="primary" className="fs-6 px-3 py-2">
                          <Target className="me-2" />
                          Creator-First Design
                        </Badge>
                        <Badge bg="success" className="fs-6 px-3 py-2">
                          <Zap className="me-2" />
                          Innovation Driven
                        </Badge>
                        <Badge bg="warning" className="fs-6 px-3 py-2">
                          <Globe className="me-2" />
                          Global Community
                        </Badge>
                      </div>
                    </div>
                    <div className="col-lg-4 text-center">
                      <Globe size={120} className="text-primary mb-3" />
                      <h4>Building Worlds Together</h4>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Stats Section */}
          <Row className="mb-5">
            <Col>
              <h2 className="text-center mb-5">Our Impact</h2>
            </Col>
          </Row>
          <Row className="g-4 mb-5">
            {stats.map((stat, index) => (
              <Col key={index} md={6} lg={3}>
                <div className="text-center">
                  <div className="display-4 fw-bold text-primary mb-2">{stat.number}</div>
                  <p className="text-muted">{stat.label}</p>
                </div>
              </Col>
            ))}
          </Row>

          {/* Values Section */}
          <Row className="mb-5">
            <Col>
              <h2 className="text-center mb-5">Our Values</h2>
            </Col>
          </Row>
          <Row className="g-4 mb-5">
            {values.map((value, index) => (
              <Col key={index} lg={6}>
                <Card className="h-100 bg-dark border-0 shadow-lg">
                  <Card.Body className="p-4">
                    <div className="d-flex align-items-center mb-3">
                      <div className="me-3">
                        {value.icon}
                      </div>
                      <h4 className="mb-0">{value.title}</h4>
                    </div>
                    <p className="text-muted mb-0">{value.description}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Team Section */}
          <Row className="mb-5">
            <Col>
              <h2 className="text-center mb-5">Meet Our Team</h2>
            </Col>
          </Row>
          <Row className="g-4 mb-5">
            {teamMembers.map((member, index) => (
              <Col key={index} lg={6}>
                <Card className="h-100 bg-dark border-0 shadow-lg">
                  <Card.Body className="p-4">
                    <div className="d-flex align-items-start mb-3">
                      <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '60px', height: '60px' }}>
                        <span className="fw-bold text-white">{member.avatar}</span>
                      </div>
                      <div>
                        <h5 className="mb-1">{member.name}</h5>
                        <p className="text-primary mb-2">{member.role}</p>
                        <p className="text-muted small mb-0">{member.bio}</p>
                      </div>
                    </div>
                    <div className="d-flex gap-2 flex-wrap">
                      {member.expertise.map((skill, idx) => (
                        <Badge key={idx} bg="secondary" className="px-2 py-1">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Milestones Section */}
          <Row className="mb-5">
            <Col>
              <h2 className="text-center mb-5">Our Journey</h2>
            </Col>
          </Row>
          <Row className="g-4 mb-5">
            {milestones.map((milestone, index) => (
              <Col key={index} lg={6}>
                <Card className="h-100 bg-dark border-0 shadow-lg">
                  <Card.Body className="p-4">
                    <div className="d-flex align-items-center mb-3">
                      <Badge bg="primary" className="fs-6 me-3 px-3 py-2">{milestone.year}</Badge>
                      <h5 className="mb-0">{milestone.title}</h5>
                    </div>
                    <p className="text-muted mb-0">{milestone.description}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {/* CTA Section */}
          <Row className="text-center">
            <Col>
              <div className="bg-gradient-primary p-5 rounded-4">
                <h3 className="mb-4">Join Our Creative Community</h3>
                <p className="lead mb-4">
                  Be part of a global community of creators who are building amazing worlds 
                  and telling incredible stories with MosCownpur.
                </p>
                <div className="d-flex justify-content-center gap-3 flex-wrap">
                  <a href="/signup" className="btn btn-primary btn-lg px-4">
                    Start Creating Free
                  </a>
                  <a href="/blog" className="btn btn-outline-light btn-lg px-4">
                    Read Our Blog
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

export default About;
