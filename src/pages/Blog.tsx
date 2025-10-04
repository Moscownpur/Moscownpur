import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Search, Calendar, User, ArrowRight, Book, Clock, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PublicHeader from '../components/PublicHeader';
import Footer from '../components/Footer';
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

      <div className="min-h-screen bg-background text-foreground dark">
        <PublicHeader />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-display mb-6">
              Creative Writing <span className="gradient-text-cosmic">Blog</span>
            </h1>
            <p className="text-subheading text-muted-foreground mb-8 max-w-3xl mx-auto">
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

        </div>
      </div>
      
      {/* SEO-Optimized Footer */}
      <Footer />
    </>
  );
};

export default Blog;

