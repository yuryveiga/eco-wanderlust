import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import { chromium } from 'playwright';
import { createClient } from '@supabase/supabase-js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.resolve(__dirname, '../dist');

// Supabase setup
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials. Did you run with --env-file=.env?");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function startServer() {
  const app = express();
  
  // Serve static files from dist
  app.use(express.static(distPath));

  // Fallback to index.html for SPA routing
  app.use((req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });

  return new Promise((resolve) => {
    const server = app.listen(0, () => {
      resolve({ server, port: server.address().port });
    });
  });
}

async function fetchDynamicRoutes() {
  const routes = ['/', '/blog', '/carrinho', '/maracanã-calendário'];

  console.log('Fetching dynamic routes from Supabase...');
  
  // Fetch blog posts
  const { data: posts } = await supabase.from('blog_posts').select('slug').eq('is_published', true);
  if (posts) {
    posts.forEach(post => routes.push(`/blog/${post.slug}`));
  }

  // Fetch tours
  const { data: tours } = await supabase.from('tours').select('id');
  if (tours) {
    tours.forEach(tour => routes.push(`/passeio/${tour.id}`));
  }

  // Fetch pages
  const { data: pages } = await supabase.from('pages').select('href').eq('is_visible', true);
  if (pages) {
    pages.forEach(page => {
        if (!routes.includes(page.href)) routes.push(page.href);
    });
  }

  return routes;
}

async function prerender() {
  console.log('Starting prerender process...');
  const { server, port } = await startServer();
  const baseUrl = `http://localhost:${port}`;
  
  const routes = await fetchDynamicRoutes();
  console.log(`Found ${routes.length} routes to prerender.`);

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // Block images/fonts to speed up rendering (optional, but good for CI)
  // We don't block everything so the layout still forms somewhat correctly if it depends on them
  await page.route('**/*.{png,jpg,jpeg,svg,gif,webp,woff2}', route => route.fulfill({status: 200, body: ''}));
  
  for (const route of routes) {
    console.log(`Prerendering ${route}...`);
    try {
      // Go to the page and wait for network to be idle
      await page.goto(`${baseUrl}${route}`, { waitUntil: 'networkidle', timeout: 45000 });
      
      // Wait a bit more for React Query and animations to settle
      await page.waitForTimeout(2000); 

      let content = await page.content();
      
      // Remove any tracking scripts or dev server injected scripts if desired, 
      // but leaving them is fine as they will just run on client side.
      // We do need the JS for the SPA to hydrate!
      
      const savePath = route === '/' 
        ? path.join(distPath, 'index.html')
        : path.join(distPath, decodeURI(route), 'index.html');
      
      const dirPath = path.dirname(savePath);
      await fs.mkdir(dirPath, { recursive: true });
      
      await fs.writeFile(savePath, content);
      console.log(`✓ Saved ${savePath}`);
    } catch (e) {
      console.error(`✗ Error prerendering ${route}:`, e.message);
    }
  }

  await browser.close();
  server.close();
  console.log('Prerendering complete!');
}

prerender().catch(console.error);
