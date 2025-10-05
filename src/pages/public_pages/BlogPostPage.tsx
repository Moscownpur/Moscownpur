import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import BlogPost from '../../components/BlogPost';
import { supabaseClient } from '../../lib/supabaseClient';

const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<any | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;
      const { data, error } = await supabaseClient
        .from('blogs')
        .select('id, title, author_id, body, tags, category, created_at, updated_at')
        .eq('id', slug)
        .single();
      if (error || !data) {
        setNotFound(true);
        return;
      }
      setPost({
        id: data.id,
        title: data.title || 'Untitled',
        excerpt: (data.body || '').slice(0, 160),
        content: data.body || '',
        author: 'Admin',
        date: data.created_at || new Date().toISOString(),
        readTime: `${Math.max(1, Math.round(((data.body || '').split(' ').length) / 200))} min read`,
        category: data.category || 'General',
        tags: (data.tags || '').split(',').map((t: string) => t.trim()).filter(Boolean),
        featured: false,
        views: 0,
        slug: data.id,
      });
    };
    fetchPost();
  }, [slug]);

  if (notFound) return <Navigate to="/blog" replace />;
  if (!post) return null;

  return <BlogPost post={post} />;
};

export default BlogPostPage;
