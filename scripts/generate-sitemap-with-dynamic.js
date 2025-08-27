import { SitemapStream, streamToPromise } from 'sitemap';
import { createWriteStream } from 'fs';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Define your base URL
const baseURL = 'https://www.moscownpur.in';

// Public routes that should be indexed by search engines
const publicRoutes = [
  {
    url: '/',
    changefreq: 'weekly',
    priority: 1.0,
    lastmod: new Date().toISOString(),
  },
  {
    url: '/features',
    changefreq: 'monthly',
    priority: 0.9,
    lastmod: new Date().toISOString(),
  },
  {
    url: '/world-building-guide',
    changefreq: 'monthly',
    priority: 0.8,
    lastmod: new Date().toISOString(),
  },
  {
    url: '/pricing',
    changefreq: 'monthly',
    priority: 0.8,
    lastmod: new Date().toISOString(),
  },
  {
    url: '/blog',
    changefreq: 'weekly',
    priority: 0.7,
    lastmod: new Date().toISOString(),
  },
  {
    url: '/about',
    changefreq: 'monthly',
    priority: 0.6,
    lastmod: new Date().toISOString(),
  },
  {
    url: '/signup',
    changefreq: 'monthly',
    priority: 0.9,
    lastmod: new Date().toISOString(),
  },
  {
    url: '/login',
    changefreq: 'monthly',
    priority: 0.5,
    lastmod: new Date().toISOString(),
  },
  // Note: Removed all private routes (/admin/*, /dashboard/*)
  // These should not be indexed by search engines
];

async function fetchDynamicRoutes() {
  const dynamicRoutes = [];
  
  try {
    // Initialize Supabase client
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      console.log('⚠️  Supabase credentials not found. Skipping database routes.');
      return dynamicRoutes;
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Fetch worlds
    console.log('🔍 Fetching worlds...');
    const { data: worlds, error: worldsError } = await supabase
      .from('worlds')
      .select('id, updated_at')
      .order('updated_at', { ascending: false });
    
    if (worldsError) {
      console.error('❌ Error fetching worlds:', worldsError);
    } else if (worlds) {
      worlds.forEach(world => {
        dynamicRoutes.push({
          url: `/dashboard/worlds/${world.id}`,
          changefreq: 'weekly',
          priority: 0.7,
          lastmod: world.updated_at,
        });
      });
      console.log(`✅ Added ${worlds.length} world routes`);
    }
    
    // Fetch scenes
    console.log('🔍 Fetching scenes...');
    const { data: scenes, error: scenesError } = await supabase
      .from('scenes')
      .select('id, updated_at')
      .order('updated_at', { ascending: false });
    
    if (scenesError) {
      console.error('❌ Error fetching scenes:', scenesError);
    } else if (scenes) {
      scenes.forEach(scene => {
        dynamicRoutes.push({
          url: `/dashboard/scenes/${scene.id}`,
          changefreq: 'weekly',
          priority: 0.7,
          lastmod: scene.updated_at,
        });
      });
      console.log(`✅ Added ${scenes.length} scene routes`);
    }
    
    // Fetch blog posts from database
    console.log('🔍 Fetching blog posts from database...');
    const { data: blogs, error: blogsError } = await supabase
      .from('blogs')
      .select('id, title, created_at, updated_at')
      .order('created_at', { ascending: false });
    
    if (blogsError) {
      console.error('❌ Error fetching blogs:', blogsError);
    } else if (blogs) {
      blogs.forEach(blog => {
        // Use the blog id for the URL since BlogPostPage uses id for routing
        dynamicRoutes.push({
          url: `/blog/${blog.id}`,
          changefreq: 'monthly',
          priority: 0.6,
          lastmod: blog.updated_at || blog.created_at,
        });
      });
      console.log(`✅ Added ${blogs.length} blog post routes from database`);
    }
    
  } catch (error) {
    console.error('❌ Error fetching dynamic routes:', error);
  }
  
  return dynamicRoutes;
}

async function generateSitemap() {
  try {
    console.log('🚀 Generating sitemap with dynamic routes...');
    
    // Create a sitemap stream
    const sitemap = new SitemapStream({ hostname: baseURL });
    
    // Add public routes to the sitemap
    publicRoutes.forEach(route => {
      sitemap.write(route);
      console.log(`✅ Added public route: ${route.url}`);
    });
    
    // Add HTTP versions of important pages for SEO
    const httpRoutes = [
      { url: '/', changefreq: 'weekly', priority: 1.0, lastmod: new Date().toISOString() },
      { url: '/features', changefreq: 'monthly', priority: 0.9, lastmod: new Date().toISOString() },
      { url: '/world-building-guide', changefreq: 'monthly', priority: 0.8, lastmod: new Date().toISOString() },
      { url: '/pricing', changefreq: 'monthly', priority: 0.8, lastmod: new Date().toISOString() },
      { url: '/blog', changefreq: 'weekly', priority: 0.7, lastmod: new Date().toISOString() },
      { url: '/about', changefreq: 'monthly', priority: 0.6, lastmod: new Date().toISOString() },
      { url: '/signup', changefreq: 'monthly', priority: 0.9, lastmod: new Date().toISOString() },
      { url: '/login', changefreq: 'monthly', priority: 0.5, lastmod: new Date().toISOString() },
    ];

    httpRoutes.forEach(route => {
      const httpRoute = {
        ...route,
        url: `http://www.moscownpur.in${route.url}`
      };
      sitemap.write(httpRoute);
      console.log(`✅ Added HTTP route: http://www.moscownpur.in${route.url}`);
    });
    
    // Fetch and add dynamic routes
    const dynamicRoutes = await fetchDynamicRoutes();
    dynamicRoutes.forEach(route => {
      sitemap.write(route);
      console.log(`✅ Added dynamic route: ${route.url}`);
    });
    
    sitemap.end();
    
    // Convert stream to string
    const sitemapXML = await streamToPromise(sitemap);
    
    // Write to file
    const outputPath = resolve('./public/sitemap.xml');
    const writeStream = createWriteStream(outputPath);
    writeStream.write(sitemapXML);
    writeStream.end();
    
    const totalRoutes = publicRoutes.length + dynamicRoutes.length + httpRoutes.length;
    console.log(`✅ Sitemap generated successfully at: ${outputPath}`);
    console.log(`📊 Total routes: ${totalRoutes} (${publicRoutes.length} public + ${dynamicRoutes.length} dynamic + ${httpRoutes.length} HTTP)`);
    console.log(`🌐 Sitemap URL: ${baseURL}/sitemap.xml`);
    console.log(`🔒 Private routes excluded: /login, /signup, /admin/*, /dashboard/*`);
    
  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    process.exit(1);
  }
}

generateSitemap(); 