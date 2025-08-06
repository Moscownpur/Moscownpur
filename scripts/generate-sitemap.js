import { SitemapStream, streamToPromise } from 'sitemap';
import { createWriteStream } from 'fs';
import { resolve } from 'path';

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

// Dynamic routes template (these will be generated if you have actual data)
const dynamicRouteTemplates = [
  {
    pattern: '/dashboard/worlds/:id',
    changefreq: 'weekly',
    priority: 0.7,
    // Note: In a real implementation, you would fetch actual world IDs from your database
    // For now, we'll skip these as they require database access
  },
  {
    pattern: '/dashboard/scenes/:id',
    changefreq: 'weekly',
    priority: 0.7,
    // Note: In a real implementation, you would fetch actual scene IDs from your database
    // For now, we'll skip these as they require database access
  },
];

async function generateSitemap() {
  try {
    console.log('🚀 Generating sitemap...');
    
    // Create a sitemap stream
    const sitemap = new SitemapStream({ hostname: baseURL });
    
    // Add static routes to the sitemap
    staticRoutes.forEach(route => {
      sitemap.write(route);
      console.log(`✅ Added route: ${route.url}`);
    });
    
    // Note: For dynamic routes, you would typically:
    // 1. Connect to your database (Supabase)
    // 2. Fetch actual IDs for worlds, scenes, etc.
    // 3. Generate URLs for each item
    // 
    // Example for dynamic routes (uncomment and modify as needed):
    /*
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
    
    // Fetch worlds
    const { data: worlds } = await supabase.from('worlds').select('id, updated_at');
    worlds?.forEach(world => {
      sitemap.write({
        url: `/dashboard/worlds/${world.id}`,
        changefreq: 'weekly',
        priority: 0.7,
        lastmod: world.updated_at,
      });
    });
    
    // Fetch scenes
    const { data: scenes } = await supabase.from('scenes').select('id, updated_at');
    scenes?.forEach(scene => {
      sitemap.write({
        url: `/dashboard/scenes/${scene.id}`,
        changefreq: 'weekly',
        priority: 0.7,
        lastmod: scene.updated_at,
      });
    });
    */
    
    sitemap.end();
    
    // Convert stream to string
    const sitemapXML = await streamToPromise(sitemap);
    
    // Write to file
    const outputPath = resolve('./public/sitemap.xml');
    const writeStream = createWriteStream(outputPath);
    writeStream.write(sitemapXML);
    writeStream.end();
    
    console.log(`✅ Sitemap generated successfully at: ${outputPath}`);
    console.log(`📊 Total routes: ${staticRoutes.length}`);
    console.log(`🌐 Sitemap URL: ${baseURL}/sitemap.xml`);
    
  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    process.exit(1);
  }
}

generateSitemap(); 