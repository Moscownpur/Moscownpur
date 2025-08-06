import { SitemapStream, streamToPromise } from 'sitemap';
import { createWriteStream } from 'fs';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';

// Define your base URL
const baseURL = 'https://www.moscownpur.in';

// Static routes with their metadata
const staticRoutes = [
  {
    url: '/',
    changefreq: 'weekly',
    priority: 1.0,
    lastmod: new Date().toISOString(),
  },
  {
    url: '/login',
    changefreq: 'monthly',
    priority: 0.8,
    lastmod: new Date().toISOString(),
  },
  {
    url: '/signup',
    changefreq: 'monthly',
    priority: 0.8,
    lastmod: new Date().toISOString(),
  },
  {
    url: '/forgot-password',
    changefreq: 'monthly',
    priority: 0.6,
    lastmod: new Date().toISOString(),
  },
  {
    url: '/admin/login',
    changefreq: 'monthly',
    priority: 0.7,
    lastmod: new Date().toISOString(),
  },
  {
    url: '/admin/dashboard',
    changefreq: 'daily',
    priority: 0.9,
    lastmod: new Date().toISOString(),
  },
  {
    url: '/dashboard',
    changefreq: 'daily',
    priority: 0.9,
    lastmod: new Date().toISOString(),
  },
  {
    url: '/dashboard/worlds',
    changefreq: 'weekly',
    priority: 0.8,
    lastmod: new Date().toISOString(),
  },
  {
    url: '/dashboard/regions',
    changefreq: 'weekly',
    priority: 0.8,
    lastmod: new Date().toISOString(),
  },
  {
    url: '/dashboard/characters',
    changefreq: 'weekly',
    priority: 0.8,
    lastmod: new Date().toISOString(),
  },
  {
    url: '/dashboard/timeline',
    changefreq: 'weekly',
    priority: 0.8,
    lastmod: new Date().toISOString(),
  },
  {
    url: '/dashboard/chapters',
    changefreq: 'weekly',
    priority: 0.8,
    lastmod: new Date().toISOString(),
  },
  {
    url: '/dashboard/scenes',
    changefreq: 'weekly',
    priority: 0.8,
    lastmod: new Date().toISOString(),
  },
  {
    url: '/dashboard/stories',
    changefreq: 'weekly',
    priority: 0.8,
    lastmod: new Date().toISOString(),
  },
  {
    url: '/dashboard/ai-test',
    changefreq: 'monthly',
    priority: 0.6,
    lastmod: new Date().toISOString(),
  },
];

async function fetchDynamicRoutes() {
  const dynamicRoutes = [];
  
  try {
    // Initialize Supabase client
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      console.log('⚠️  Supabase credentials not found. Skipping dynamic routes.');
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
    
    // Add static routes to the sitemap
    staticRoutes.forEach(route => {
      sitemap.write(route);
      console.log(`✅ Added static route: ${route.url}`);
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
    
    const totalRoutes = staticRoutes.length + dynamicRoutes.length;
    console.log(`✅ Sitemap generated successfully at: ${outputPath}`);
    console.log(`📊 Total routes: ${totalRoutes} (${staticRoutes.length} static + ${dynamicRoutes.length} dynamic)`);
    console.log(`🌐 Sitemap URL: ${baseURL}/sitemap.xml`);
    
  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    process.exit(1);
  }
}

generateSitemap(); 