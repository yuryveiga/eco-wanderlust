import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const siteUrl = 'https://tocorimerio.com'; // Definitive production URL

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase credentials not found in environment variables.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function generateSitemap() {
  console.log('Generating dynamic sitemap...');

  try {
    // Fetch Tours
    const { data: tours, error: toursError } = await supabase
      .from('tours')
      .select('id, slug, updated_at')
      .eq('is_active', true);

    if (toursError) {
      console.warn('Could not fetch tours for sitemap (likely Invalid API Key):', toursError.message);
      return; // Stop gracefully
    }

    // Fetch Blog Posts
    const { data: posts, error: postsError } = await supabase
      .from('blog_posts')
      .select('slug, updated_at')
      .eq('is_published', true);

    if (postsError) {
      console.warn('Could not fetch posts for sitemap (likely Invalid API Key):', postsError.message);
      return; // Stop gracefully
    }

    const staticPages = [
      { url: '/', priority: 1.0, changefreq: 'daily' },
      { url: '/blog', priority: 0.9, changefreq: 'weekly' },
      { url: '/sobre', priority: 0.7, changefreq: 'monthly' },
      { url: '/contato', priority: 0.7, changefreq: 'monthly' },
      { url: '/passeios', priority: 0.8, changefreq: 'weekly' },
      { url: '/carrinho', priority: 0.6, changefreq: 'weekly' },
    ];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // Static Pages
    staticPages.forEach(page => {
      xml += `  <url>\n`;
      xml += `    <loc>${siteUrl}${page.url}</loc>\n`;
      xml += `    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n`;
      xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
      xml += `    <priority>${page.priority}</priority>\n`;
      xml += `  </url>\n`;
    });

    // Tours
    tours.forEach(tour => {
      xml += `  <url>\n`;
      xml += `    <loc>${siteUrl}/passeio/${tour.slug || tour.id}</loc>\n`;
      xml += `    <lastmod>${(tour.updated_at || new Date().toISOString()).split('T')[0]}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.8</priority>\n`;
      xml += `  </url>\n`;
    });

    // Blog Posts
    posts.forEach(post => {
      xml += `  <url>\n`;
      xml += `    <loc>${siteUrl}/blog/${post.slug}</loc>\n`;
      xml += `    <lastmod>${(post.updated_at || new Date().toISOString()).split('T')[0]}</lastmod>\n`;
      xml += `    <changefreq>monthly</changefreq>\n`;
      xml += `    <priority>0.8</priority>\n`;
      xml += `  </url>\n`;
    });

    xml += `</urlset>`;

    const publicPath = path.join(__dirname, '../public/sitemap.xml');
    fs.writeFileSync(publicPath, xml);
    console.log(`Sitemap generated successfully at ${publicPath}`);
    console.log(`Added ${tours.length} tours and ${posts.length} blog posts.`);

  } catch (error) {
    console.error('Error generating sitemap:', error);
    process.exit(1);
  }
}

generateSitemap();
