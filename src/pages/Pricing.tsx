import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Container, Row, Col, Card, Badge, Button, ListGroup } from 'react-bootstrap';
import { 
  Check, 
  Star, 
  Zap, 
  Crown, 
  Shield,
  Cloud,
  Users,
  Globe,
  Brain,
  Infinity
} from 'react-bootstrap-icons';

const Pricing: React.FC = () => {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for getting started with world building",
      features: [
        "Up to 3 fictional universes",
        "Basic character management",
        "Simple timeline tracking",
        "Community support",
        "Basic templates",
        "1GB storage"
      ],
      limitations: [
        "Limited to 50 characters per universe",
        "Basic export options",
        "No AI assistance"
      ],
      popular: false,
      recommended: false
    },
    {
      name: "Creator",
      price: "$9.99",
      period: "per month",
      description: "Ideal for serious writers and world builders",
      features: [
        "Unlimited fictional universes",
        "Advanced character management",
        "Comprehensive timeline tools",
        "Chapter and scene organization",
        "Region and location mapping",
        "Priority support",
        "Advanced templates",
        "10GB storage",
        "Export to multiple formats",
        "Collaboration tools"
      ],
      limitations: [
        "Limited AI assistance (5 requests/month)",
        "Basic analytics"
      ],
      popular: true,
      recommended: true
    },
    {
      name: "Professional",
      price: "$19.99",
      period: "per month",
      description: "For professional authors and creative teams",
      features: [
        "Everything in Creator",
        "Unlimited AI assistance",
        "Advanced analytics and insights",
        "Team collaboration (up to 5 members)",
        "Custom branding",
        "API access",
        "Priority feature requests",
        "50GB storage",
        "Advanced export options",
        "White-label solutions"
      ],
      limitations: [
        "No limitations on core features"
      ],
      popular: false,
      recommended: false
    }
  ];

  const comparisonFeatures = [
    {
      feature: "Fictional Universes",
      free: "3",
      creator: "Unlimited",
      professional: "Unlimited"
    },
    {
      feature: "Character Management",
      free: "Basic",
      creator: "Advanced",
      professional: "Advanced"
    },
    {
      feature: "Timeline Tools",
      free: "Basic",
      creator: "Comprehensive",
      professional: "Comprehensive"
    },
    {
      feature: "AI Assistance",
      free: "None",
      creator: "5 requests/month",
      professional: "Unlimited"
    },
    {
      feature: "Storage",
      free: "1GB",
      creator: "10GB",
      professional: "50GB"
    },
    {
      feature: "Collaboration",
      free: "None",
      creator: "Basic",
      professional: "Team (5 members)"
    },
    {
      feature: "Export Options",
      free: "Basic",
      creator: "Multiple formats",
      professional: "Advanced + API"
    },
    {
      feature: "Support",
      free: "Community",
      creator: "Priority",
      professional: "Priority + Custom"
    }
  ];

  const faqs = [
    {
      question: "Can I upgrade or downgrade my plan anytime?",
      answer: "Yes, you can change your plan at any time. Upgrades take effect immediately, while downgrades take effect at the end of your current billing period."
    },
    {
      question: "Is there a free trial available?",
      answer: "Yes! You can start with our free plan and upgrade anytime. We also offer a 14-day free trial of our Creator plan to test advanced features."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, PayPal, and Apple Pay. All payments are processed securely through Stripe."
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer: "Absolutely. You can cancel your subscription at any time, and you'll continue to have access until the end of your current billing period."
    },
    {
      question: "Do you offer discounts for students or educators?",
      answer: "Yes! We offer special pricing for students and educators. Contact our support team with your credentials to learn more."
    },
    {
      question: "What happens to my data if I cancel?",
      answer: "Your data is safe. You can export all your content before canceling, and we'll keep your data for 30 days in case you want to reactivate your account."
    }
  ];

  return (
    <>
      <Helmet>
        <title>Pricing - Affordable World Building & Universe Management Tools | MosCownpur</title>
        <meta name="description" content="Choose the perfect plan for your world building needs. From free to professional, our pricing is designed to grow with your creative projects. Start free today!" />
        <meta name="keywords" content="world building software pricing, universe management cost, creative writing tools pricing, character management software cost, story development platform pricing" />
        <meta property="og:title" content="Pricing - Affordable World Building & Universe Management Tools | MosCownpur" />
        <meta property="og:description" content="Choose the perfect plan for your world building needs. From free to professional, our pricing is designed to grow with your creative projects. Start free today!" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.moscownpur.in/pricing" />
        <link rel="canonical" href="https://www.moscownpur.in/pricing" />
      </Helmet>

      <div className="min-vh-100 bg-black text-white py-5">
        <Container>
          {/* Hero Section */}
          <Row className="text-center mb-5">
            <Col>
              <h1 className="display-4 fw-bold mb-4">
                Simple, <span className="text-primary">Transparent Pricing</span>
              </h1>
              <p className="lead mb-4">
                Choose the perfect plan for your world building journey. Start free and upgrade 
                as your creative projects grow. No hidden fees, no surprises.
              </p>
              <div className="d-flex justify-content-center gap-3 flex-wrap">
                <Badge bg="success" className="fs-6 px-3 py-2">Free Forever Plan</Badge>
                <Badge bg="primary" className="fs-6 px-3 py-2">14-Day Free Trial</Badge>
                <Badge bg="warning" className="fs-6 px-3 py-2">Cancel Anytime</Badge>
                <Badge bg="info" className="fs-6 px-3 py-2">No Setup Fees</Badge>
              </div>
            </Col>
          </Row>

          {/* Pricing Cards */}
          <Row className="g-4 mb-5">
            {plans.map((plan, index) => (
              <Col key={index} lg={4}>
                <Card className={`h-100 bg-dark border-0 shadow-lg ${plan.popular ? 'border-primary border-3' : ''}`}>
                  {plan.popular && (
                    <div className="position-absolute top-0 start-50 translate-middle-x">
                      <Badge bg="primary" className="px-3 py-2 rounded-bottom">
                        <Star className="me-1" />
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <Card.Body className="p-4">
                    <div className="text-center mb-4">
                      <h3 className="mb-2">{plan.name}</h3>
                      <div className="mb-3">
                        <span className="display-4 fw-bold">{plan.price}</span>
                        <span className="text-muted">/{plan.period}</span>
                      </div>
                      <p className="text-muted">{plan.description}</p>
                    </div>
                    
                    <ListGroup variant="flush" className="mb-4">
                      {plan.features.map((feature, idx) => (
                        <ListGroup.Item key={idx} className="bg-transparent text-white border-0 px-0">
                          <Check className="text-success me-2" />
                          {feature}
                        </ListGroup.Item>
                      ))}
                    </ListGroup>

                    {plan.limitations.length > 0 && (
                      <div className="mb-4">
                        <h6 className="text-muted mb-2">Limitations:</h6>
                        <ul className="text-muted small">
                          {plan.limitations.map((limitation, idx) => (
                            <li key={idx}>{limitation}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="d-grid">
                      {plan.name === "Free" ? (
                        <Button variant="outline-primary" size="lg" href="/signup">
                          Get Started Free
                        </Button>
                      ) : (
                        <Button variant={plan.popular ? "primary" : "outline-primary"} size="lg" href="/signup">
                          Start {plan.name} Trial
                        </Button>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Feature Comparison */}
          <Row className="mb-5">
            <Col>
              <h2 className="text-center mb-5">Detailed Feature Comparison</h2>
            </Col>
          </Row>
          <Row>
            <Col>
              <Card className="bg-dark border-0 shadow-lg">
                <Card.Body className="p-0">
                  <div className="table-responsive">
                    <table className="table table-dark table-hover mb-0">
                      <thead>
                        <tr>
                          <th className="border-0">Feature</th>
                          <th className="border-0 text-center">Free</th>
                          <th className="border-0 text-center">Creator</th>
                          <th className="border-0 text-center">Professional</th>
                        </tr>
                      </thead>
                      <tbody>
                        {comparisonFeatures.map((feature, index) => (
                          <tr key={index}>
                            <td className="border-0">{feature.feature}</td>
                            <td className="border-0 text-center">{feature.free}</td>
                            <td className="border-0 text-center">{feature.creator}</td>
                            <td className="border-0 text-center">{feature.professional}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* FAQ Section */}
          <Row className="mb-5">
            <Col>
              <h2 className="text-center mb-5">Frequently Asked Questions</h2>
            </Col>
          </Row>
          <Row className="g-4 mb-5">
            {faqs.map((faq, index) => (
              <Col key={index} lg={6}>
                <Card className="h-100 bg-dark border-0 shadow-lg">
                  <Card.Body className="p-4">
                    <h5 className="mb-3">{faq.question}</h5>
                    <p className="text-muted mb-0">{faq.answer}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {/* CTA Section */}
          <Row className="text-center">
            <Col>
              <div className="bg-gradient-primary p-5 rounded-4">
                <h3 className="mb-4">Ready to Start Building Your Universe?</h3>
                <p className="lead mb-4">
                  Join thousands of creators who trust MosCownpur for their world building needs. 
                  Start free today and upgrade when you're ready.
                </p>
                <div className="d-flex justify-content-center gap-3 flex-wrap">
                  <a href="/signup" className="btn btn-primary btn-lg px-4">
                    Start Free Trial
                  </a>
                  <a href="/features" className="btn btn-outline-light btn-lg px-4">
                    Explore Features
                  </a>
                </div>
                <p className="text-muted mt-3 mb-0">
                  No credit card required • 14-day free trial • Cancel anytime
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default Pricing;

