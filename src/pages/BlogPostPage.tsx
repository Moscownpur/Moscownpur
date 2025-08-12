import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import BlogPost from '../components/BlogPost';
import blogData from '../data/blogPosts.json';

const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  
  // Find the post by slug
  const post = blogData.posts.find(p => p.slug === slug);
  
  // If post not found, redirect to blog
  if (!post) {
    return <Navigate to="/blog" replace />;
  }
  
  return <BlogPost post={post} />;
};

export default BlogPostPage;
