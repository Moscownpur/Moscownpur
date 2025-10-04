import React from 'react';
import { Helmet } from 'react-helmet-async';
import PublicHeader from '../components/PublicHeader';
import { Check, Star, Zap, Crown, Shield, Cloud, Users, Globe, Brain, Infinity } from 'lucide-react';

const Pricing: React.FC = () => {
  const plans = [
    {
      name: "Early Bird",
      price: "$0",
      period: "forever",
      description: "Limited time offer for early adopters",
      features: [
        "Unlimited fictional universes",
        "Advanced character management",
        "Comprehensive timeline tools",
        "Unlimited AI assistance",
        "Advanced analytics and insights",
        "Team collaboration (up to 5 members)",
        "Custom branding options",
        "API access",
        "Priority feature requests",
        "Advanced export options",
        "White-label solutions",
        "Premium support"
      ],
      limitations: [
        "No limitations - full access to all features"
      ],
      popular: true,
      recommended: true,
      earlyBird: true
    }
  ];

  const comparisonFeatures = [
    {
      feature: "Fictional Universes",
      earlyBird: "Unlimited"
    },
    {
      feature: "Character Management",
      earlyBird: "Advanced"
    },
    {
      feature: "Timeline Tools",
      earlyBird: "Comprehensive"
    },
    {
      feature: "AI Assistance",
      earlyBird: "Unlimited"
    },
    {
      feature: "Storage",
      earlyBird: "Unlimited"
    },
    {
      feature: "Collaboration",
      earlyBird: "Team (5 members)"
    },
    {
      feature: "Export Options",
      earlyBird: "Advanced + API"
    },
    {
      feature: "Support",
      earlyBird: "Priority + Custom"
    }
  ];

  const faqs = [
    {
      question: "Is this really free forever?",
      answer: "Yes! As an early bird, you get access to all premium features completely free. This is our way of thanking early adopters who believe in our vision."
    },
    {
      question: "What happens when the early bird period ends?",
      answer: "Early bird members will be grandfathered in and keep their free access. We'll always honor our commitment to early adopters."
    },
    {
      question: "Are there any hidden fees or limitations?",
      answer: "No hidden fees, no limitations. You get full access to all features, unlimited usage, and premium support - completely free."
    },
    {
      question: "Can I invite team members to my free account?",
      answer: "Yes! You can invite up to 5 team members to collaborate on your projects at no additional cost."
    },
    {
      question: "What if I need more than 5 team members?",
      answer: "Contact our support team. We're flexible and want to accommodate your needs as an early bird member."
    },
    {
      question: "Do you offer discounts for students or educators?",
      answer: "Since everything is free for early birds, there's no need for additional discounts! Students and educators are welcome to join as early birds."
    }
  ];

  return (
    <>
      <Helmet>
        <title>Pricing - Free Early Bird Access to World Building Tools | MosCownpur</title>
        <meta name="description" content="Join as an early bird and get unlimited access to our world building platform completely free. Limited time offer for early adopters. Start building your universe today!" />
        <meta name="keywords" content="free world building software, early bird pricing, universe management free, creative writing tools free, character management software free" />
        <meta property="og:title" content="Pricing - Free Early Bird Access to World Building Tools | MosCownpur" />
        <meta property="og:description" content="Join as an early bird and get unlimited access to our world building platform completely free. Limited time offer for early adopters. Start building your universe today!" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.moscownpur.in/pricing" />
        <link rel="canonical" href="https://www.moscownpur.in/pricing" />
      </Helmet>

      <div className="min-h-screen bg-background text-foreground dark">
        <PublicHeader />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-display mb-6">
              <span className="gradient-text-cosmic">Free for Early Birds</span>
            </h1>
            <p className="text-subheading text-muted-foreground mb-8 max-w-3xl mx-auto">
              Join us as an early bird and get unlimited access to all premium features completely free. 
              This is our way of thanking early adopters who believe in our vision.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <span className="glass-card px-6 py-3 rounded-full text-sm font-medium soft-glow-green smooth-transition">Free Forever</span>
              <span className="glass-card px-6 py-3 rounded-full text-sm font-medium soft-glow-blue smooth-transition">All Premium Features</span>
              <span className="glass-card px-6 py-3 rounded-full text-sm font-medium soft-glow-orange smooth-transition">No Limitations</span>
              <span className="glass-card px-6 py-3 rounded-full text-sm font-medium soft-glow-purple smooth-transition">Early Bird Exclusive</span>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid lg:grid-cols-1 gap-8 mb-16 max-w-2xl mx-auto">
            {plans.map((plan, index) => (
              <div key={index} className={`relative ${plan.popular ? 'lg:scale-105' : ''}`}>
                {plan.earlyBird && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <span className="glass-card px-6 py-3 rounded-full text-sm font-medium flex items-center gap-2 soft-glow-cosmic animate-pulse">
                      <Star size={16} />
                      Early Bird Exclusive
                    </span>
                  </div>
                )}
                <div className={`glass-card rounded-2xl p-8 h-full smooth-transition hover:soft-glow-cosmic ${plan.popular ? 'border-2 border-blue-500' : ''}`}>
                  <div className="text-center mb-8">
                    <h3 className="text-heading mb-4">{plan.name}</h3>
                    <div className="mb-4">
                      <span className="text-display gradient-text-cosmic">{plan.price}</span>
                      <span className="text-gray-400">/{plan.period}</span>
                    </div>
                    <p className="text-body text-gray-400">{plan.description}</p>
                  </div>
                  
                  <div className="space-y-3 mb-8">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center">
                        <Check className="text-green-500 mr-3 flex-shrink-0" size={20} />
                        <span className="text-body">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {plan.limitations.length > 0 && (
                    <div className="mb-8">
                      <h6 className="text-gray-400 mb-3 font-medium">Limitations:</h6>
                      <ul className="text-gray-500 text-sm space-y-1">
                        {plan.limitations.map((limitation, idx) => (
                          <li key={idx}>{limitation}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="mt-auto">
                    <a href="/signup" className="glass-card-cosmic text-white px-8 py-4 rounded-full font-semibold hover:soft-glow-cosmic smooth-transition block text-center text-lg">
                      Claim Your Free Early Bird Access
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Feature Comparison */}
          <div className="mb-16">
            <h2 className="text-heading text-center mb-12 gradient-text-purple">What You Get as an Early Bird</h2>
            <div className="glass-card rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left p-6 text-subheading">Feature</th>
                      <th className="text-center p-6 text-subheading">Early Bird Access</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonFeatures.map((feature, index) => (
                      <tr key={index} className="border-b border-gray-700 hover:bg-gray-800/50 smooth-transition">
                        <td className="p-6 text-body">{feature.feature}</td>
                        <td className="p-6 text-center text-body">{feature.earlyBird}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mb-16">
            <h2 className="text-heading text-center mb-12 gradient-text-green">Frequently Asked Questions</h2>
            <div className="grid lg:grid-cols-2 gap-8">
              {faqs.map((faq, index) => (
                <div key={index} className="glass-card rounded-xl p-6 smooth-transition hover:soft-glow-cosmic">
                  <h5 className="text-subheading mb-4">{faq.question}</h5>
                  <p className="text-body text-gray-400">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <div className="glass-card-cosmic rounded-2xl p-8 md:p-12 soft-glow-cosmic">
              <h3 className="text-heading mb-6">Ready to Join the Early Bird Community?</h3>
              <p className="text-subheading text-gray-200 mb-8 max-w-2xl mx-auto">
                Don't miss out on this exclusive offer. Join thousands of creators who are already 
                building amazing universes with MosCownpur - completely free.
              </p>
              <div className="flex justify-center gap-4 flex-wrap mb-6">
                <a href="/signup" className="glass-card text-white px-8 py-4 rounded-full font-semibold hover:soft-glow-cosmic smooth-transition text-lg">
                  Get Free Early Bird Access
                </a>
                <a href="/features" className="glass-card border border-white text-white px-8 py-4 rounded-full font-semibold hover:soft-glow-cosmic smooth-transition">
                  Explore Features
                </a>
              </div>
              <p className="text-caption text-white">
                No credit card required • Free forever • All premium features included
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Pricing;

