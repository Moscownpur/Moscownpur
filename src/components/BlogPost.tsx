import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Calendar, User, ArrowLeft, Clock, Eye, Share, Bookmark, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PublicHeader from './PublicHeader';

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
        return <h3 key={index} className="text-heading mt-8 mb-4 font-bold">{line}</h3>;
      }
      
      // Handle subheaders (lines with **text**)
      if (line.includes('**')) {
        const parts = line.split('**');
        return (
          <h4 key={index} className="text-subheading mt-6 mb-3 font-semibold">
            {parts.map((part, i) => 
              i % 2 === 1 ? <strong key={i}>{part}</strong> : part
            )}
          </h4>
        );
      }
      
      // Handle lists (lines starting with -)
      if (line.trim().startsWith('-')) {
        return (
          <li key={index} className="text-body mb-2 ml-4">
            {line.trim().substring(1).trim()}
          </li>
        );
      }
      
      // Handle numbered lists
      if (/^\d+\./.test(line.trim())) {
        return (
          <li key={index} className="text-body mb-2 ml-4">
            {line.trim()}
          </li>
        );
      }
      
      // Regular paragraph
      return <p key={index} className="text-body mb-4 text-gray-300">{line}</p>;
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

      <div className="min-h-screen bg-black text-white">
        <PublicHeader />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Back Button */}
          <div className="mb-8">
            <button 
              onClick={() => navigate('/blog')}
              className="glass-card text-white px-6 py-3 rounded-full font-semibold hover:soft-glow-cosmic smooth-transition flex items-center gap-2"
            >
              <ArrowLeft size={16} /> Back to Blog
            </button>
          </div>

          {/* Article Header */}
          <div className="mb-16">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <span className="glass-card px-4 py-2 rounded-full text-sm font-medium soft-glow-blue mb-6 inline-block">
                  {post.category}
                </span>
                <h1 className="text-display mb-6">{post.title}</h1>
                <p className="text-subheading text-gray-300 mb-8">{post.excerpt}</p>
                
                {/* Article Meta */}
                <div className="flex justify-center items-center gap-6 mb-6 flex-wrap">
                  <div className="flex items-center">
                    <User className="text-gray-400 mr-2" size={16} />
                    <span className="text-body">{post.author}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="text-gray-400 mr-2" size={16} />
                    <span className="text-body">{new Date(post.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="text-gray-400 mr-2" size={16} />
                    <span className="text-body">{post.readTime}</span>
                  </div>
                  <div className="flex items-center">
                    <Eye className="text-gray-400 mr-2" size={16} />
                    <span className="text-body">{post.views.toLocaleString()} views</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex justify-center gap-2 mb-6 flex-wrap">
                  {post.tags.map((tag, index) => (
                    <span key={index} className="glass-card text-gray-300 px-3 py-1 rounded-full text-xs smooth-transition">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center gap-3 mb-6">
                  <button className="glass-card text-white px-4 py-2 rounded-full text-sm font-medium hover:soft-glow-cosmic smooth-transition flex items-center gap-2">
                    <Share size={16} />
                    Share
                  </button>
                  <button className="glass-card text-white px-4 py-2 rounded-full text-sm font-medium hover:soft-glow-cosmic smooth-transition flex items-center gap-2">
                    <Bookmark size={16} />
                    Save
                  </button>
                  <button className="glass-card text-white px-4 py-2 rounded-full text-sm font-medium hover:soft-glow-cosmic smooth-transition flex items-center gap-2">
                    <Heart size={16} />
                    Like
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Article Content */}
          <div className="max-w-4xl mx-auto">
            <div className="glass-card rounded-2xl p-8 md:p-12">
              <div className="article-content prose prose-invert max-w-none">
                {formatContent(post.content)}
              </div>
              
              {/* Article Footer */}
              <hr className="border-gray-700 my-12" />
              <div className="text-center">
                <h5 className="text-subheading mb-4">Enjoyed this article?</h5>
                <p className="text-body text-gray-400 mb-6">
                  Share it with fellow creators and storytellers who might find it helpful.
                </p>
                <div className="flex justify-center gap-4">
                  <button className="glass-card-cosmic text-white px-6 py-3 rounded-full font-semibold hover:soft-glow-cosmic smooth-transition">
                    Share on Twitter
                  </button>
                  <button className="glass-card text-white px-6 py-3 rounded-full font-semibold hover:soft-glow-cosmic smooth-transition">
                    Share on LinkedIn
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Related Articles Suggestion */}
          <div className="mt-16">
            <div className="text-center">
              <h3 className="text-heading mb-6 gradient-text-purple">Continue Your Creative Journey</h3>
              <p className="text-subheading text-gray-300 mb-8 max-w-2xl mx-auto">
                Explore more articles to enhance your world building and storytelling skills.
              </p>
              <button 
                onClick={() => navigate('/blog')}
                className="glass-card text-white px-8 py-3 rounded-full font-semibold hover:soft-glow-cosmic smooth-transition"
              >
                Browse All Articles
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogPost;
