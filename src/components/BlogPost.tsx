import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Calendar, User, ArrowLeft, Clock, Eye, Share, Bookmark, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PublicHeader from './PublicHeader';
import PublicPageBackground from './PublicPageBackground';
import Footer from './Footer';

interface BlogPostProps {
  post: {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    author: string;
    date: string;
    readTime: string;
    category: string;
    tags: string[];
    featured: boolean;
    views: number;
    slug: string;
  };
}

const BlogPost: React.FC<BlogPostProps> = ({ post }) => {
  const navigate = useNavigate();

  // Convert content with emojis and formatting to JSX
  const formatContent = (content: string) => {
    return content.split('\n').map((line, index) => {
      if (line.trim() === '') {
        return <br key={index} />;
      }

      // Handle headers (lines starting with emoji + text)
      if (/^[🎭🌍🦹‍♀️📖🚀👉🧠🎯💾🔗🎬💡🔧🎮🇮🇳🇷🇺🌏🚌🧸]/.test(line)) {
        return <h3 key={index} className="text-2xl font-bold mt-8 mb-4 nerko-one-regular text-primary">{line}</h3>;
      }

      // Handle subheaders (lines with **text**)
      if (line.includes('**')) {
        const parts = line.split('**');
        return (
          <h4 key={index} className="text-xl font-semibold mt-6 mb-3 text-foreground/90">
            {parts.map((part, i) =>
              i % 2 === 1 ? <strong key={i} className="text-primary">{part}</strong> : part
            )}
          </h4>
        );
      }

      // Handle lists (lines starting with -)
      if (line.trim().startsWith('-')) {
        return (
          <li key={index} className="text-muted-foreground mb-2 ml-4 list-disc marker:text-primary">
            {line.trim().substring(1).trim()}
          </li>
        );
      }

      // Handle numbered lists
      if (/^\d+\./.test(line.trim())) {
        return (
          <li key={index} className="text-muted-foreground mb-2 ml-4 list-decimal marker:text-primary">
            {line.trim()}
          </li>
        );
      }

      // Regular paragraph
      return <p key={index} className="text-muted-foreground mb-4 leading-relaxed">{line}</p>;
    });
  };

  return (
    <>
      <Helmet>
        <title>{post.title} | MosCownpur Blog</title>
        <meta name="description" content={post.excerpt} />
        <meta name="keywords" content={post.tags.join(', ')} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://www.moscownpur.in/blog/${post.slug}`} />
        <link rel="canonical" href={`https://www.moscownpur.in/blog/${post.slug}`} />
      </Helmet>

      <div className="min-h-screen bg-background text-foreground overflow-hidden transition-colors duration-500">
        <PublicPageBackground />
        <PublicHeader />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative z-10">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <button
              onClick={() => navigate('/blog')}
              className="px-6 py-3 rounded-full font-semibold bg-secondary/30 hover:bg-secondary/50 transition-all flex items-center gap-2 text-sm backdrop-blur-sm border border-border/50"
            >
              <ArrowLeft size={16} /> Back to Blog
            </button>
          </motion.div>

          {/* Article Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-16"
          >
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <span className="px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-orange-500 to-red-500 text-white mb-6 inline-block shadow-lg">
                  {post.category}
                </span>
                <h1 className="text-4xl md:text-6xl font-bold mb-6 borel-regular leading-tight">{post.title}</h1>
                <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-2xl mx-auto">{post.excerpt}</p>

                {/* Article Meta */}
                <div className="flex justify-center items-center gap-6 mb-8 flex-wrap text-sm font-medium text-muted-foreground">
                  <div className="flex items-center">
                    <User className="text-primary mr-2" size={16} />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="text-primary mr-2" size={16} />
                    <span>{new Date(post.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="text-primary mr-2" size={16} />
                    <span>{post.readTime}</span>
                  </div>
                  <div className="flex items-center">
                    <Eye className="text-primary mr-2" size={16} />
                    <span>{post.views.toLocaleString()} views</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex justify-center gap-2 mb-8 flex-wrap">
                  {post.tags.map((tag, index) => (
                    <span key={index} className="px-3 py-1 rounded-full text-xs font-medium bg-secondary/50 text-secondary-foreground">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center gap-3 mb-6">
                  <button className="p-3 rounded-full bg-secondary/30 hover:bg-primary/20 hover:text-primary transition-all backdrop-blur-sm border border-border/50">
                    <Share size={20} />
                  </button>
                  <button className="p-3 rounded-full bg-secondary/30 hover:bg-primary/20 hover:text-primary transition-all backdrop-blur-sm border border-border/50">
                    <Bookmark size={20} />
                  </button>
                  <button className="p-3 rounded-full bg-secondary/30 hover:bg-red-500/20 hover:text-red-500 transition-all backdrop-blur-sm border border-border/50">
                    <Heart size={20} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Article Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <div className="glass-card rounded-3xl p-8 md:p-12 border-t-4 border-t-orange-500">
              <div className="article-content prose prose-invert max-w-none prose-lg prose-headings:font-bold prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-primary prose-li:text-muted-foreground">
                {formatContent(post.content)}
              </div>

              {/* Article Footer */}
              <hr className="border-border my-12" />
              <div className="text-center">
                <h5 className="text-2xl font-bold mb-4 nerko-one-regular">Enjoyed this article?</h5>
                <p className="text-muted-foreground mb-8">
                  Share it with fellow creators and storytellers who might find it helpful.
                </p>
                <div className="flex justify-center gap-4 flex-wrap">
                  <button className="px-6 py-3 bg-[#1DA1F2] text-white rounded-xl font-bold hover:shadow-lg hover:shadow-[#1DA1F2]/25 transition-all hover:-translate-y-1">
                    Share on Twitter
                  </button>
                  <button className="px-6 py-3 bg-[#0077B5] text-white rounded-xl font-bold hover:shadow-lg hover:shadow-[#0077B5]/25 transition-all hover:-translate-y-1">
                    Share on LinkedIn
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Related Articles Suggestion */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-24"
          >
            <div className="text-center">
              <h3 className="text-3xl font-bold mb-6 borel-regular">Continue Your <span className="gradient-text-cosmic">Creative Journey</span></h3>
              <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                Explore more articles to enhance your world building and storytelling skills.
              </p>
              <button
                onClick={() => navigate('/blog')}
                className="px-8 py-4 bg-primary text-primary-foreground rounded-xl font-bold shadow-lg hover:shadow-primary/25 transition-all hover:-translate-y-1"
              >
                Browse All Articles
              </button>
            </div>
          </motion.div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default BlogPost;
