import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Search, Calendar, User, ArrowRight, Book, Clock, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PublicHeader from '../../components/PublicHeader';
import PublicPageBackground from '../../components/PublicPageBackground';
import Footer from '../../components/Footer';
import { supabaseClient } from '../../lib/supabaseClient';
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
              Creative Writing <span className="gradient-text-cosmic">Blog</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
              Expert tips, tutorials, and resources for world building, character development,
              and creative writing. Learn from professional authors and enhance your storytelling skills.
            </p>
          </motion.div>

          {/* Featured Post */}
          {featuredPost && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-24"
            >
              <div className="glass-card rounded-3xl p-10 hover:border-primary/30 transition-all duration-300">
                <div className="grid lg:grid-cols-3 gap-10 items-center">
                  <div className="lg:col-span-2">
                    <span className="px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-orange-500 to-red-500 text-white mb-6 inline-block shadow-lg">
                      Latest Article
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold mb-6 nerko-one-regular">{featuredPost.title}</h2>
                    <p className="text-lg text-muted-foreground mb-8 leading-relaxed">{featuredPost.excerpt}</p>

                    <div className="flex items-center gap-6 mb-8 flex-wrap text-sm font-medium text-muted-foreground">
                      <div className="flex items-center">
                        <User className="text-primary mr-2" size={16} />
                        <span>{featuredPost.author}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="text-primary mr-2" size={16} />
                        <span>{new Date(featuredPost.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="text-primary mr-2" size={16} />
                        <span>{featuredPost.readTime}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 mb-8 flex-wrap">
                      {(featuredPost.tags as string[]).slice(0, 3).map((tag: string, index: number) => (
                        <span key={index} className="px-3 py-1 rounded-full text-xs font-medium bg-secondary/50 text-secondary-foreground">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <button
                      className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:shadow-lg hover:shadow-primary/25 transition-all flex items-center gap-2 hover:-translate-y-1"
                      onClick={() => handlePostClick(featuredPost)}
                    >
                      Read Full Article <ArrowRight size={18} />
                    </button>
                  </div>

                  <div className="text-center p-8 bg-secondary/10 rounded-2xl border border-border/50">
                    <img src={logoImage} alt="Moscownpur Logo" className="w-24 h-24 mx-auto mb-6 rounded-2xl shadow-xl" />
                    <h5 className="text-xl font-bold mb-2 nerko-one-regular">Featured Article</h5>
                    <p className="text-sm text-muted-foreground">Most popular this week</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Categories and Blog Posts */}
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-8">
                {/* Categories */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="glass-card rounded-2xl p-6"
                >
                  <h5 className="text-xl font-bold mb-6 nerko-one-regular border-b border-border pb-4">Categories</h5>
                  <div className="space-y-3">
                    {categories.map((category, index) => (
                      <div key={index} className="flex justify-between items-center group cursor-pointer">
                        <span className="text-muted-foreground group-hover:text-primary transition-colors font-medium">{category.name}</span>
                        <span className="px-2 py-1 rounded-lg text-xs font-bold bg-secondary text-secondary-foreground">{category.count}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Popular Tags */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="glass-card rounded-2xl p-6"
                >
                  <h5 className="text-xl font-bold mb-6 nerko-one-regular border-b border-border pb-4">Popular Tags</h5>
                  <div className="flex flex-wrap gap-2">
                    {(popularTags as string[]).map((tagItem: string, tagIndex: number) => (
                      <span key={tagIndex} className="px-3 py-1 rounded-full text-xs font-medium bg-secondary/50 hover:bg-primary/20 hover:text-primary cursor-pointer transition-colors">
                        {tagItem}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Blog Posts */}
            <div className="lg:col-span-3">
              <div className="grid md:grid-cols-2 gap-8">
                {(loading ? [] : filteredPosts.filter((post: any) => !post.featured)).map((post: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="glass-card rounded-2xl p-8 hover:border-primary/30 cursor-pointer h-full flex flex-col group transition-all duration-300 hover:-translate-y-1"
                    onClick={() => handlePostClick(post)}
                  >
                    <div className="flex justify-between items-start mb-6">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-500 uppercase tracking-wider">
                        {post.category}
                      </span>
                    </div>

                    <h5 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors nerko-one-regular leading-tight">
                      {post.title}
                    </h5>

                    <p className="text-muted-foreground mb-6 line-clamp-3 flex-grow">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center gap-4 mb-6 text-xs font-medium text-muted-foreground">
                      <div className="flex items-center">
                        <User size={14} className="mr-1" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar size={14} className="mr-1" />
                        <span>{new Date(post.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock size={14} className="mr-1" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 mb-6 flex-wrap">
                      {post.tags.slice(0, 2).map((tag: string, idx: number) => (
                        <span key={idx} className="px-2 py-1 rounded-md text-xs bg-secondary/30 text-muted-foreground">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <button className="w-full py-3 rounded-xl font-bold border border-border hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all flex items-center justify-center gap-2 group-hover:bg-primary/5">
                      Read More <ArrowRight size={16} />
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

        </div>

        <Footer />
      </div>
    </>
  );
};

export default Blog;
