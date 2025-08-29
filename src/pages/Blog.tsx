import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Search, Calendar, User, ArrowRight, Book, Clock, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PublicHeader from '../components/PublicHeader';
import { supabaseClient } from '../lib/supabaseClient';
import logoImage from '/logo.jpg';

const Blog: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory] = useState('');

  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const { data } = await supabaseClient
        .from('blogs')
        .select('id, title, author_id, body, tags, category, created_at, updated_at')
        .order('created_at', { ascending: false });
      setBlogPosts(
        (data || []).map((p: any) => ({
          id: p.id,
          title: p.title || 'Untitled',
          excerpt: (p.body || '').slice(0, 160),
          author: 'Admin',
          date: p.created_at || new Date().toISOString(),
          readTime: `${Math.max(1, Math.round(((p.body || '').split(' ').length) / 200))} min read`,
          category: p.category || 'General',
          tags: (p.tags || '').split(',').map((t: string) => t.trim()).filter(Boolean),
          featured: false,
          views: 0,
        }))
      );
      setLoading(false);
    };
    fetchPosts();
  }, []);

  const categories = useMemo(() => {
    const counts: Record<string, number> = {};
    blogPosts.forEach((p) => {
      const key = p.category || 'General';
      counts[key] = (counts[key] || 0) + 1;
    });
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }, [blogPosts]);

  const popularTags = useMemo(() => {
    const tagSet = new Set<string>();
    blogPosts.forEach((p) => (p.tags || []).forEach((t: string) => tagSet.add(t)));
    return Array.from(tagSet).slice(0, 12);
  }, [blogPosts]);

  const featuredPost = blogPosts[0];

  // Filter posts based on search and category
  const filteredPosts = blogPosts.filter((post: any) => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = !selectedCategory || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handlePostClick = (post: any) => {
    navigate(`/blog/${post.id}`);
  };

  return (
    <>
      <Helmet>
        <title>Blog - Creative Writing Tips & World Building Resources | MosCownpur</title>
        <meta name="description" content="Discover expert tips, tutorials, and resources for world building, character development, and creative writing. Learn from professional authors and enhance your storytelling skills." />
        <meta name="keywords" content="creative writing blog, world building tips, character development guide, writing tutorials, universe creation resources, storytelling advice, author tips" />
        <meta property="og:title" content="Blog - Creative Writing Tips & World Building Resources | MosCownpur" />
        <meta property="og:description" content="Discover expert tips, tutorials, and resources for world building, character development, and creative writing. Learn from professional authors and enhance your storytelling skills." />
        <meta property="og:type" content="blog" />
        <meta property="og:url" content="https://www.moscownpur.in/blog" />
        <link rel="canonical" href="https://www.moscownpur.in/blog" />
      </Helmet>

      <div className="min-h-screen bg-black text-white">
        <PublicHeader />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-display mb-6">
              Creative Writing <span className="gradient-text-cosmic">Blog</span>
            </h1>
            <p className="text-subheading text-gray-300 mb-8 max-w-3xl mx-auto">
              Expert tips, tutorials, and resources for world building, character development, 
              and creative writing. Learn from professional authors and enhance your storytelling skills.
            </p>
            
            {/* Search Bar */}
            {/* <div className="flex justify-center mb-8">
              <div className="w-full max-w-md">
                <div className="glass-card rounded-full flex items-center px-6 py-3">
                  <Search className="text-gray-400 mr-3" size={20} />
                  <input 
                    type="text" 
                    placeholder="Search articles..." 
                    className="bg-transparent text-white flex-1 outline-none placeholder-gray-400"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button className="glass-card-cosmic px-4 py-2 rounded-full text-sm font-medium hover:soft-glow-cosmic smooth-transition">
                    Search
                  </button>
                </div>
              </div>
            </div> */}

            {/* <div className="flex justify-center gap-4 flex-wrap">
              <span className="glass-card px-6 py-3 rounded-full text-sm font-medium soft-glow-blue smooth-transition">World Building</span>
              <span className="glass-card px-6 py-3 rounded-full text-sm font-medium soft-glow-green smooth-transition">Character Development</span>
              <span className="glass-card px-6 py-3 rounded-full text-sm font-medium soft-glow-orange smooth-transition">Writing Tips</span>
              <span className="glass-card px-6 py-3 rounded-full text-sm font-medium soft-glow-purple smooth-transition">AI Tools</span>
            </div> */}
          </div>

          {/* Featured Post */}
          {featuredPost && (
            <div className="mb-16">
              <div className="glass-card rounded-2xl p-8 smooth-transition hover:soft-glow-cosmic">
                <div className="grid lg:grid-cols-3 gap-8 items-center">
                  <div className="lg:col-span-2">
                    <span className="glass-card px-4 py-2 rounded-full text-sm font-medium soft-glow-orange mb-4 inline-block">Latest Article</span>
                    <h2 className="text-heading mb-4">{featuredPost.title}</h2>
                    <p className="text-subheading text-gray-300 mb-6">{featuredPost.excerpt}</p>
                    <div className="flex items-center gap-6 mb-6 flex-wrap">
                      <div className="flex items-center">
                        <User className="text-gray-400 mr-2" size={16} />
                        <span className="text-body">{featuredPost.author}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="text-gray-400 mr-2" size={16} />
                        <span className="text-body">{new Date(featuredPost.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="text-gray-400 mr-2" size={16} />
                        <span className="text-body">{featuredPost.readTime}</span>
                      </div>
                      {/* <div className="flex items-center">
                        <Eye className="text-gray-400 mr-2" size={16} />
                        <span className="text-body">{featuredPost.views.toLocaleString()} views</span>
                      </div> */}
                    </div>
                    <div className="flex gap-2 mb-6 flex-wrap">
                      {(featuredPost.tags as string[]).slice(0, 3).map((tag: string, index: number) => (
                        <span key={index} className="glass-card text-gray-300 px-3 py-1 rounded-full text-xs smooth-transition">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <button 
                      className="glass-card-cosmic text-white px-6 py-3 rounded-full font-semibold hover:soft-glow-cosmic smooth-transition flex items-center gap-2"
                      onClick={() => handlePostClick(featuredPost)}
                    >
                      Read Full Article <ArrowRight size={16} />
                    </button>
                  </div>
                  <div className="text-center">
                    <img src={logoImage} alt="Moscownpur Logo" className="w-20 h-20 mx-auto mb-4" />
                    <h5 className="text-subheading">Featured Article</h5>
                    <p className="text-caption text-gray-400">Most popular this week</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Categories and Blog Posts */}
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                {/* Categories */}
                <div className="glass-card rounded-xl p-6 mb-6">
                  <h5 className="text-subheading mb-4">Categories</h5>
                  <div className="space-y-3">
                    {categories.map((category, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-body">{category.name}</span>
                        <span className="glass-card px-2 py-1 rounded-full text-xs font-medium">{category.count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Popular Tags */}
                <div className="glass-card rounded-xl p-6">
                  <h5 className="text-subheading mb-4">Popular Tags</h5>
                  <div className="flex flex-wrap gap-2">
                    {(popularTags as string[]).map((tagItem: string, tagIndex: number) => (
                      <span key={tagIndex} className="glass-card text-gray-300 px-3 py-1 rounded-full text-xs smooth-transition">
                        {tagItem}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Blog Posts */}
            <div className="lg:col-span-3">
              <div className="grid md:grid-cols-2 gap-8">
                {(loading ? [] : filteredPosts.filter((post: any) => !post.featured)).map((post: any, index: number) => (
                  <div key={index} className="glass-card rounded-xl p-6 smooth-transition hover:soft-glow-cosmic cursor-pointer h-full" onClick={() => handlePostClick(post)}>
                    <div className="flex justify-between items-start mb-4">
                      <span className="glass-card px-3 py-1 rounded-full text-xs font-medium soft-glow-blue">{post.category}</span>
                      {/* <div className="flex items-center text-gray-400">
                        <Eye size={14} className="mr-1" />
                        <span className="text-xs">{post.views.toLocaleString()}</span>
                      </div> */}
                    </div>
                    <h5 className="text-subheading mb-3">{post.title}</h5>
                    <p className="text-body text-gray-400 mb-4">{post.excerpt}</p>
                    <div className="flex items-center gap-4 mb-4 flex-wrap">
                      <div className="flex items-center">
                        <User size={14} className="text-gray-400 mr-1" />
                        <span className="text-xs text-gray-400">{post.author}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar size={14} className="text-gray-400 mr-1" />
                        <span className="text-xs text-gray-400">{new Date(post.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock size={14} className="text-gray-400 mr-1" />
                        <span className="text-xs text-gray-400">{post.readTime}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 mb-4 flex-wrap">
                      {post.tags.slice(0, 2).map((tag: string, idx: number) => (
                        <span key={idx} className="glass-card text-gray-300 px-2 py-1 rounded-full text-xs smooth-transition">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <button className="glass-card text-white px-4 py-2 rounded-full text-sm font-medium hover:soft-glow-cosmic smooth-transition flex items-center gap-2">
                      Read More <ArrowRight size={14} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Load More Button */}
              {/* <div className="text-center mt-12">
                <button className="glass-card text-white px-8 py-3 rounded-full font-semibold hover:soft-glow-cosmic smooth-transition">
                  Load More Articles
                </button>
              </div> */}
            </div>
          </div>

          {/* Social Media Follow */}
          <div className="mt-16">
            <div className="glass-card-cosmic rounded-2xl p-8 md:p-12 soft-glow-cosmic text-center">
              <h3 className="text-heading mb-6">Follow Us for More Content</h3>
              <p className="text-subheading text-gray-200 mb-8 max-w-2xl mx-auto">
                Stay connected with us on social media for the latest world building tips, 
                character development advice, and creative writing resources.
              </p>
              <div className="flex justify-center gap-4 mb-6 flex-wrap">
                <a 
                  href="https://www.linkedin.com/in/moscownpur" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="glass-card text-white px-6 py-3 rounded-full font-semibold hover:soft-glow-cosmic smooth-transition flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  LinkedIn
                </a>
                <a 
                  href="https://x.com/moscownpur" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="glass-card text-white px-6 py-3 rounded-full font-semibold hover:soft-glow-cosmic smooth-transition flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  X (Twitter)
                </a>
                <a 
                  href="https://www.instagram.com/moscownpur/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="glass-card text-white px-6 py-3 rounded-full font-semibold hover:soft-glow-cosmic smooth-transition flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323c-.875.807-2.026 1.297-3.323 1.297zm7.718-1.297c-.875.807-2.026 1.297-3.323 1.297s-2.448-.49-3.323-1.297c-.807-.875-1.297-2.026-1.297-3.323s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323z"/>
                  </svg>
                  Instagram
                </a>
                <a 
                  href="https://www.youtube.com/@Moscownpur" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="glass-card text-white px-6 py-3 rounded-full font-semibold hover:soft-glow-cosmic smooth-transition flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  YouTube
                </a>
              </div>
              <p className="text-caption text-white">
                Follow us for daily inspiration, tips, and behind-the-scenes content
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Blog;

