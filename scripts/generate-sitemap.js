import { SitemapStream, streamToPromise } from 'sitemap';
import { createWriteStream } from 'fs';
import { resolve } from 'path';

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
  // Note: Removed all private routes (/login, /signup, /admin/*, /dashboard/*)
  // These should not be indexed by search engines
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
    
    // Add public routes to the sitemap
    publicRoutes.forEach(route => {
      sitemap.write(route);
      console.log(`✅ Added public route: ${route.url}`);
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
    console.log(`📊 Total public routes: ${publicRoutes.length}`);
    console.log(`🌐 Sitemap URL: ${baseURL}/sitemap.xml`);
    console.log(`🔒 Private routes excluded: /login, /signup, /admin/*, /dashboard/*`);
    
  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    process.exit(1);
  }
}

generateSitemap(); 