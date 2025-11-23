import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import PublicHeader from '../../components/PublicHeader';
import PublicPageBackground from '../../components/PublicPageBackground';
import Footer from '../../components/Footer';
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
              Free for <span className="gradient-text-cosmic">Early Birds</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
              Join us as an early bird and get unlimited access to all premium features completely free.
              This is our way of thanking early adopters who believe in our vision.
            </p>
            <div className="flex justify-center gap-3 flex-wrap">
              {["Free Forever", "All Premium Features", "No Limitations", "Early Bird Exclusive"].map((tag, i) => (
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

          {/* Pricing Cards */}
          <div className="grid lg:grid-cols-1 gap-8 mb-24 max-w-2xl mx-auto">
            {plans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className={`relative ${plan.popular ? 'lg:scale-105' : ''}`}
              >
                {plan.earlyBird && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <span className="glass-card px-6 py-3 rounded-full text-sm font-bold flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg animate-pulse">
                      <Star size={16} fill="currentColor" />
                      Early Bird Exclusive
                    </span>
                  </div>
                )}
                <div className={`glass-card rounded-3xl p-10 h-full hover:border-primary/30 transition-all duration-300 ${plan.popular ? 'border-2 border-orange-500/50 shadow-2xl shadow-orange-500/10' : ''}`}>
                  <div className="text-center mb-10">
                    <h3 className="text-3xl font-bold mb-4 nerko-one-regular">{plan.name}</h3>
                    <div className="mb-4 flex items-baseline justify-center">
                      <span className="text-6xl font-bold gradient-text-cosmic borel-regular">{plan.price}</span>
                      <span className="text-muted-foreground ml-2">/{plan.period}</span>
                    </div>
                    <p className="text-muted-foreground">{plan.description}</p>
                  </div>

                  <div className="space-y-4 mb-10">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center">
                        <div className="p-1 bg-green-500/10 rounded-full mr-3">
                          <Check className="text-green-500 flex-shrink-0" size={16} />
                        </div>
                        <span className="text-foreground/90">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {plan.limitations.length > 0 && (
                    <div className="mb-10 p-4 bg-secondary/30 rounded-xl">
                      <h6 className="text-foreground/80 mb-2 font-bold text-sm uppercase tracking-wider">Limitations:</h6>
                      <ul className="text-muted-foreground text-sm space-y-1">
                        {plan.limitations.map((limitation, idx) => (
                          <li key={idx} className="flex items-center">
                            <Check className="text-green-500 mr-2 h-3 w-3" />
                            {limitation}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="mt-auto">
                    <a href="/signup" className="w-full block py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl font-bold text-center text-lg shadow-lg hover:shadow-orange-500/25 transition-all hover:-translate-y-1">
                      Claim Your Free Early Bird Access
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Feature Comparison */}
          <div className="mb-24">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-4xl font-bold text-center mb-16 borel-regular"
            >
              What You Get as an <span className="gradient-text-cosmic">Early Bird</span>
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-card rounded-3xl overflow-hidden"
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/50 bg-secondary/20">
                      <th className="text-left p-6 text-lg font-bold">Feature</th>
                      <th className="text-center p-6 text-lg font-bold text-orange-500">Early Bird Access</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonFeatures.map((feature, index) => (
                      <tr key={index} className="border-b border-border/30 hover:bg-secondary/10 transition-colors">
                        <td className="p-6 font-medium">{feature.feature}</td>
                        <td className="p-6 text-center font-bold text-foreground/90">{feature.earlyBird}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>

          {/* FAQ Section */}
          <div className="mb-24">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-4xl font-bold text-center mb-16 borel-regular"
            >
              Frequently Asked <span className="text-blue-500">Questions</span>
            </motion.h2>

            <div className="grid lg:grid-cols-2 gap-8">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="glass-card rounded-2xl p-8 hover:border-primary/30 transition-all"
                >
                  <h5 className="text-xl font-bold mb-4 nerko-one-regular">{faq.question}</h5>
                  <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
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
                <h3 className="text-3xl md:text-4xl font-bold mb-6 borel-regular">Ready to Join the Early Bird Community?</h3>
                <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                  Don't miss out on this exclusive offer. Join thousands of creators who are already
                  building amazing universes with MosCownpur - completely free.
                </p>
                <div className="flex justify-center gap-6 flex-wrap mb-8">
                  <a href="/signup" className="px-8 py-4 bg-primary text-primary-foreground font-bold rounded-xl shadow-lg hover:shadow-primary/25 transition-all hover:-translate-y-1">
                    Get Free Early Bird Access
                  </a>
                  <a href="/features" className="px-8 py-4 glass-card font-bold rounded-xl hover:bg-secondary/50 transition-all hover:-translate-y-1">
                    Explore Features
                  </a>
                </div>
                <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                  <Shield size={14} /> No credit card required • Free forever • All premium features included
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default Pricing;

