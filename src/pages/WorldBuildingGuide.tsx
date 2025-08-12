import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Container, Row, Col, Card, Accordion, Badge, Alert } from 'react-bootstrap';
import { 
  Book, 
  Lightbulb, 
  CheckCircle, 
  InfoCircle, 
  Star,
  Globe,
  Users,
  Map,
  Clock,
  PenTool
} from 'react-bootstrap-icons';

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

      <div className="min-vh-100 bg-black text-white py-5">
        <Container>
          {/* Hero Section */}
          <Row className="text-center mb-5">
            <Col>
              <h1 className="display-4 fw-bold mb-4">
                Complete <span className="text-primary">World Building Guide</span>
              </h1>
              <p className="lead mb-4">
                Master the art of creating immersive fictional universes. This comprehensive guide 
                will teach you everything you need to know about world building, from basic concepts 
                to advanced techniques used by professional authors and game designers.
              </p>
              <div className="d-flex justify-content-center gap-3 flex-wrap">
                <Badge bg="primary" className="fs-6 px-3 py-2">Step-by-Step Tutorial</Badge>
                <Badge bg="success" className="fs-6 px-3 py-2">Professional Tips</Badge>
                <Badge bg="warning" className="fs-6 px-3 py-2">Common Mistakes</Badge>
                <Badge bg="info" className="fs-6 px-3 py-2">Tools & Resources</Badge>
              </div>
            </Col>
          </Row>

          {/* What is World Building */}
          <Row className="mb-5">
            <Col>
              <Card className="bg-dark border-0 shadow-lg">
                <Card.Body className="p-4">
                  <div className="d-flex align-items-center mb-3">
                    <Globe className="text-primary me-3" size={40} />
                    <h2>What is World Building?</h2>
                  </div>
                  <p className="lead">
                    World building is the process of creating an imaginary world or universe for your story, 
                    game, or creative project. It involves developing every aspect of your fictional setting, 
                    from geography and history to cultures and characters.
                  </p>
                  <p>
                    Whether you're writing a novel, creating a tabletop RPG campaign, or developing a video game, 
                    effective world building creates a foundation that makes your story believable and engaging. 
                    It's about creating a living, breathing world that readers or players can immerse themselves in.
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Step-by-Step Guide */}
          <Row className="mb-5">
            <Col>
              <h2 className="text-center mb-5">5-Step World Building Process</h2>
            </Col>
          </Row>
          <Row className="g-4 mb-5">
            {worldBuildingSteps.map((step, index) => (
              <Col key={index} lg={6}>
                <Card className="h-100 bg-dark border-0 shadow-lg">
                  <Card.Body className="p-4">
                    <div className="d-flex align-items-center mb-3">
                      <Badge bg="primary" className="fs-5 me-3 px-3 py-2">Step {step.step}</Badge>
                      <h4 className="mb-0">{step.title}</h4>
                    </div>
                    <p className="text-muted mb-3">{step.description}</p>
                    <h6 className="mb-2">Key Elements:</h6>
                    <ul className="mb-3">
                      {step.elements.map((element, idx) => (
                        <li key={idx} className="mb-1">{element}</li>
                      ))}
                    </ul>
                    <Alert variant="info" className="mb-0">
                      <InfoCircle className="me-2" />
                      <strong>Pro Tip:</strong> {step.tips}
                    </Alert>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Common Mistakes */}
          <Row className="mb-5">
            <Col>
              <h2 className="text-center mb-5">Common World Building Mistakes to Avoid</h2>
            </Col>
          </Row>
          <Row className="g-4 mb-5">
            {commonMistakes.map((mistake, index) => (
              <Col key={index} lg={6}>
                <Card className="h-100 bg-dark border-0 shadow-lg">
                  <Card.Body className="p-4">
                    <h5 className="text-danger mb-3">
                      <CheckCircle className="me-2" />
                      {mistake.mistake}
                    </h5>
                    <p className="text-muted mb-3">{mistake.description}</p>
                    <Alert variant="success" className="mb-0">
                      <Lightbulb className="me-2" />
                      <strong>Solution:</strong> {mistake.solution}
                    </Alert>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Tools and Resources */}
          <Row className="mb-5">
            <Col>
              <h2 className="text-center mb-5">Essential Tools and Resources</h2>
            </Col>
          </Row>
          <Row className="g-4 mb-5">
            {toolsAndResources.map((category, index) => (
              <Col key={index} lg={4}>
                <Card className="h-100 bg-dark border-0 shadow-lg">
                  <Card.Body className="p-4">
                    <h4 className="mb-4">{category.category}</h4>
                    {category.tools.map((tool, idx) => (
                      <div key={idx} className="mb-3">
                        <div className="d-flex align-items-center mb-1">
                          <h6 className="mb-0">{tool.name}</h6>
                          {tool.featured && (
                            <Star className="text-warning ms-2" size={16} />
                          )}
                        </div>
                        <p className="text-muted small mb-0">{tool.description}</p>
                      </div>
                    ))}
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {/* CTA Section */}
          <Row className="text-center">
            <Col>
              <div className="bg-gradient-primary p-5 rounded-4">
                <h3 className="mb-4">Ready to Start Building Your World?</h3>
                <p className="lead mb-4">
                  Put these world building techniques into practice with MosCownpur's comprehensive 
                  universe management tools.
                </p>
                <div className="d-flex justify-content-center gap-3 flex-wrap">
                  <a href="/signup" className="btn btn-primary btn-lg px-4">
                    Start Building Free
                  </a>
                  <a href="/features" className="btn btn-outline-light btn-lg px-4">
                    Explore Features
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

export default WorldBuildingGuide;

