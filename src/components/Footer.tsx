import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Globe, 
  BookOpen, 
  Users, 
  Clock, 
  Film, 
  FileText, 
  Bot, 
  Calendar,
  Mail,
  Phone,
  MapPin,
  ExternalLink
} from 'lucide-react';
import logoImage from '/logo.jpg';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const navigationSections = [
    {
      title: 'Platform',
      links: [
        { name: 'Features', href: '/features', icon: Globe },
        { name: 'World Building Guide', href: '/world-building-guide', icon: BookOpen },
        { name: 'Pricing', href: '/pricing', icon: Users },
        { name: 'About Us', href: '/about', icon: Clock },
      ]
    },
    {
      title: 'Resources',
      links: [
        { name: 'Blog', href: '/blog', icon: FileText },
        { name: 'Character Development', href: '/features#characters', icon: Users },
        { name: 'Timeline Management', href: '/features#timeline', icon: Calendar },
        { name: 'AI Integration', href: '/features#ai', icon: Bot },
      ]
    },
    {
      title: 'Support',
      links: [
        { name: 'Contact Us', href: '/about#contact', icon: Mail },
        { name: 'Help Center', href: '/features#help', icon: FileText },
        { name: 'Privacy Policy', href: '/privacy', icon: FileText },
        { name: 'Terms of Service', href: '/terms', icon: FileText },
      ]
    }
  ];

  const socialLinks = [
    {
      name: 'LinkedIn',
      href: 'https://www.linkedin.com/in/moscownpur',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      )
    },
    {
      name: 'X (Twitter)',
      href: 'https://x.com/moscownpur',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      )
    },
    {
      name: 'Instagram',
      href: 'https://www.instagram.com/moscownpur/',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323c-.875.807-2.026 1.297-3.323 1.297zm7.718-1.297c-.875.807-2.026 1.297-3.323 1.297s-2.448-.49-3.323-1.297c-.807-.875-1.297-2.026-1.297-3.323s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323z"/>
        </svg>
      )
    },
    {
      name: 'YouTube',
      href: 'https://www.youtube.com/@Moscownpur',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      )
    }
  ];

  return (
    <footer className="bg-black text-white border-t border-white/10" role="contentinfo">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <img src={logoImage} alt="Moscownpur Logo" className="w-16 h-16" />
              <div>
                <h3 className="text-xl font-bold gradient-text-cosmic">Moscownpur</h3>
                <p className="text-sm text-gray-400">Fictional Universe Management Platform</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Empowering creators to build infinite worlds. Create, manage, and explore fictional universes 
              with our comprehensive world-building and storytelling platform.
            </p>
            
            {/* Contact Information */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center text-gray-400">
                <Mail className="w-4 h-4 mr-3" />
                <a href="mailto:contact@moscownpur.in" className="hover:text-white smooth-transition">
                  contact@moscownpur.in
                </a>
              </div>
              <div className="flex items-center text-gray-400">
                <Globe className="w-4 h-4 mr-3" />
                <a href="https://www.moscownpur.in" className="hover:text-white smooth-transition">
                  www.moscownpur.in
                </a>
              </div>
            </div>

            {/* Social Media Links */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="glass-card p-3 rounded-full hover:soft-glow-cosmic smooth-transition"
                    aria-label={`Follow us on ${social.name}`}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </div>
          </div>

          {/* Navigation Sections */}
          {navigationSections.map((section) => (
            <div key={section.title}>
              <h4 className="text-sm font-semibold text-white mb-4">{section.title}</h4>
              <nav className="space-y-3">
                {section.links.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="flex items-center text-gray-400 hover:text-white smooth-transition group"
                  >
                    <link.icon className="w-4 h-4 mr-2 group-hover:scale-110 smooth-transition" />
                    <span className="text-sm">{link.name}</span>
                  </Link>
                ))}
              </nav>
            </div>
          ))}
        </div>

        {/* Newsletter Signup */}
        {/* <div className="mt-12 pt-8 border-t border-white/10">
          <div className="bg-black rounded-2xl p-8 text-center">
            <h3 className="text-heading mb-4">Stay Updated with Creative Insights</h3>
            <p className="text-subheading text-gray-200 mb-6 max-w-2xl mx-auto">
              Get the latest world-building tips, character development advice, and creative writing resources 
              delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 glass-card px-4 py-3 rounded-full text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                aria-label="Email address for newsletter"
              />
              <button className="glass-card-cosmic text-white px-6 py-3 rounded-full font-semibold hover:soft-glow-cosmic smooth-transition">
                Subscribe
              </button>
            </div>
          </div>
        </div> */}
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <span>&copy; {currentYear} Moscownpur. All rights reserved.</span>
              <Link to="/privacy" className="hover:text-white smooth-transition">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-white smooth-transition">Terms of Service</Link>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <span>Made with ❤️ for creators worldwide</span>
            </div>
          </div>
        </div>
      </div>

      {/* Structured Data for SEO */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Moscownpur",
          "url": "https://www.moscownpur.in",
          "logo": "https://www.moscownpur.in/logo.jpg",
          "description": "Fictional Universe Management Platform - Empowering creators to build infinite worlds",
          "sameAs": [
            "https://www.linkedin.com/in/moscownpur",
            "https://x.com/moscownpur",
            "https://www.instagram.com/moscownpur/",
            "https://www.youtube.com/@Moscownpur"
          ],
          "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "customer service",
            "email": "contact@moscownpur.in"
          },
          "address": {
            "@type": "PostalAddress",
            "addressCountry": "IN"
          }
        })}
      </script>
    </footer>
  );
};

export default Footer;
