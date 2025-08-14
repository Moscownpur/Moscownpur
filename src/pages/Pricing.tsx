import React from 'react';
import { Helmet } from 'react-helmet-async';
import PublicHeader from '../components/PublicHeader';
import { Check, Star, Zap, Crown, Shield, Cloud, Users, Globe, Brain, Infinity } from 'lucide-react';

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

      <div className="min-h-screen bg-black text-white">
        <PublicHeader />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-display mb-6">
              Simple, <span className="gradient-text-cosmic">Transparent Pricing</span>
            </h1>
            <p className="text-subheading text-gray-300 mb-8 max-w-3xl mx-auto">
              Choose the perfect plan for your world building journey. Start free and upgrade 
              as your creative projects grow. No hidden fees, no surprises.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <span className="glass-card px-6 py-3 rounded-full text-sm font-medium soft-glow-green smooth-transition">Free Forever Plan</span>
              <span className="glass-card px-6 py-3 rounded-full text-sm font-medium soft-glow-blue smooth-transition">14-Day Free Trial</span>
              <span className="glass-card px-6 py-3 rounded-full text-sm font-medium soft-glow-orange smooth-transition">Cancel Anytime</span>
              <span className="glass-card px-6 py-3 rounded-full text-sm font-medium soft-glow-purple smooth-transition">No Setup Fees</span>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {plans.map((plan, index) => (
              <div key={index} className={`relative ${plan.popular ? 'lg:scale-105' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <span className="glass-card px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 soft-glow-cosmic">
                      <Star size={16} />
                      Most Popular
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
                    {plan.name === "Free" ? (
                      <a href="/signup" className="glass-card text-white px-8 py-3 rounded-full font-semibold hover:soft-glow-cosmic smooth-transition block text-center">
                        Get Started Free
                      </a>
                    ) : (
                      <a href="/signup" className={`px-8 py-3 rounded-full font-semibold smooth-transition block text-center ${
                        plan.popular 
                          ? 'glass-card-cosmic text-white hover:soft-glow-cosmic' 
                          : 'glass-card text-white hover:soft-glow-cosmic'
                      }`}>
                        Start {plan.name} Trial
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Feature Comparison */}
          <div className="mb-16">
            <h2 className="text-heading text-center mb-12 gradient-text-purple">Detailed Feature Comparison</h2>
            <div className="glass-card rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left p-6 text-subheading">Feature</th>
                      <th className="text-center p-6 text-subheading">Free</th>
                      <th className="text-center p-6 text-subheading">Creator</th>
                      <th className="text-center p-6 text-subheading">Professional</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonFeatures.map((feature, index) => (
                      <tr key={index} className="border-b border-gray-700 hover:bg-gray-800/50 smooth-transition">
                        <td className="p-6 text-body">{feature.feature}</td>
                        <td className="p-6 text-center text-body">{feature.free}</td>
                        <td className="p-6 text-center text-body">{feature.creator}</td>
                        <td className="p-6 text-center text-body">{feature.professional}</td>
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
              <h3 className="text-heading mb-6">Ready to Start Building Your Universe?</h3>
              <p className="text-subheading text-gray-200 mb-8 max-w-2xl mx-auto">
                Join thousands of creators who trust MosCownpur for their world building needs. 
                Start free today and upgrade when you're ready.
              </p>
              <div className="flex justify-center gap-4 flex-wrap mb-6">
                <a href="/signup" className="glass-card text-white px-8 py-3 rounded-full font-semibold hover:soft-glow-cosmic smooth-transition">
                  Start Free Trial
                </a>
                <a href="/features" className="glass-card border border-white text-white px-8 py-3 rounded-full font-semibold hover:soft-glow-cosmic smooth-transition">
                  Explore Features
                </a>
              </div>
              <p className="text-caption text-gray-400">
                No credit card required • 14-day free trial • Cancel anytime
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Pricing;

