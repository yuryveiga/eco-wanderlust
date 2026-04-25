import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in process.env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkPosts() {
  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select('title, slug, content, image_url, excerpt, title_en, content_en')
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) {
    console.error('Error fetching posts:', error);
    return;
  }

  posts.forEach((post, i) => {
    console.log(`\n--- Post ${i + 1} ---`);
    console.log(`Title: ${post.title}`);
    console.log(`Slug: ${post.slug}`);
    console.log(`Image URL: ${post.image_url ? 'YES' : 'MISSING'}`);
    console.log(`Excerpt: ${post.excerpt ? 'YES' : 'MISSING'}`);
    console.log(`Content (PT) Length: ${post.content ? post.content.length : 0} chars`);
    console.log(`Title (EN): ${post.title_en ? 'YES' : 'MISSING'}`);
    console.log(`Content (EN) Length: ${post.content_en ? post.content_en.length : 0} chars`);
    
    if (post.content_en && post.content_en.length < 500) {
      console.log(`WARNING: Content EN seems short (${post.content_en.length} chars)`);
    }
  });
}

checkPosts();
