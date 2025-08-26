# Sitemap Generation

This project includes automated sitemap generation to help search engines discover and index your website pages.

## Files

- `scripts/generate-sitemap-with-dynamic.js` - Advanced sitemap generator (static routes + dynamic blog posts)
- `scripts/generate-sitemap-with-dynamic.js` - Advanced sitemap generator (includes dynamic routes from database)
- `public/sitemap.xml` - Generated sitemap file
- `public/robots.txt` - Robots file referencing the sitemap
- `public/logo.jpg` - Main logo used for social media and app icons

## Usage

### Basic Sitemap (Static Routes Only)
```bash
npm run generate-sitemap
```

### Advanced Sitemap (With Dynamic Routes from Database)
```bash
npm run generate-sitemap-dynamic
```

### Automated Build Process
The sitemap is automatically generated during the build process:
```bash
npm run build
```

## Configuration

### Domain
Update the domain in the sitemap scripts:
```javascript
const baseURL = 'https://www.moscownpur.in';
```

### Environment Variables (for dynamic routes)
For the dynamic sitemap generator, ensure these environment variables are set:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Routes Included

### Public Routes (Indexed by Search Engines)
- `/` - Homepage (priority: 1.0)
- `/blog` - Blog listing page (priority: 0.7)
- `/blog/[slug]` - Individual blog posts (priority: 0.6, fetched from database)

### Private Routes (Excluded from Sitemap)
The following routes are intentionally excluded from the sitemap as they should not be indexed by search engines:
- `/login` - Login page
- `/signup` - Signup page  
- `/forgot-password` - Password reset
- `/admin/*` - All admin pages
- `/dashboard/*` - All dashboard pages (require authentication)

### Dynamic Routes (Database-driven)
- **Blog Posts**: Automatically fetched from the `blogs` table in Supabase
  - URL format: `/blog/[slug]` (slug generated from title)
  - Priority: 0.6
  - Change frequency: Monthly
  - Last modified: Uses `updated_at` or `created_at` from database

## Blog System Integration

### Database Schema
The blog system uses the `blogs` table with the following structure:
- `id` (uuid) - Primary key
- `title` (text) - Blog post title
- `author_id` (uuid) - References auth.users
- `body` (text) - Blog post content
- `tags` (text) - Comma-separated tags
- `category` (text) - Blog category
- `created_at` and `updated_at` timestamps

### URL Generation
Blog post URLs are automatically generated from the title:
- Title: "How AI Can Remember Your World Better Than You Do"
- URL: `/blog/how-ai-can-remember-your-world-better-than-you-do`

## SEO Benefits

1. **Search Engine Discovery**: Helps search engines find all your pages
2. **Crawl Efficiency**: Provides metadata about page update frequency
3. **Priority Indication**: Tells search engines which pages are most important
4. **Last Modified Dates**: Helps with content freshness signals
5. **Dynamic Blog Indexing**: Automatically includes new blog posts in sitemap

## Logo and Branding

The project uses `logo.jpg` as the main logo for:
- Social media Open Graph images
- Twitter Card images
- App icons in manifest.json
- Favicon
- Header logo display

## Deployment

Make sure these files are included in your deployment:
- `public/sitemap.xml`
- `public/robots.txt`
- `public/logo.jpg`

## Search Engine Submission

After deployment, submit your sitemap to search engines:

1. **Google Search Console**: Submit `https://www.moscownpur.in/sitemap.xml`
2. **Bing Webmaster Tools**: Submit the same URL
3. **Other search engines**: Check their respective webmaster tools

## Customization

### Adding New Routes
Edit the `publicRoutes` array in the sitemap scripts to add new routes.

### Modifying Priorities
Adjust the `priority` values (0.0 to 1.0) to indicate page importance.

### Changing Update Frequency
Modify `changefreq` values:
- `always` - Page changes every time it's accessed
- `hourly` - Page changes hourly
- `daily` - Page changes daily
- `weekly` - Page changes weekly
- `monthly` - Page changes monthly
- `yearly` - Page changes yearly
- `never` - Page never changes

## Troubleshooting

### Sitemap Not Generating
- Check that the `sitemap` package is installed
- Ensure the `public` directory exists
- Verify file permissions

### Dynamic Routes Not Working
- Check Supabase environment variables
- Verify database connection
- Check console for error messages

### Blog Posts Not Appearing
- Verify the `blogs` table exists in your Supabase database
- Check that blog posts have valid titles
- Ensure the database connection is working

### Build Process Failing
- Ensure sitemap generation completes before build
- Check for syntax errors in sitemap scripts
- Verify all dependencies are installed 