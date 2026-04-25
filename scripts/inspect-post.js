import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectPost() {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('title, content, content_en')
    .eq('slug', 'best-feijoada-rio-de-janeiro-tourists')
    .single();

  if (error) {
    console.error(error);
    return;
  }

  console.log('--- EN CONTENT ---');
  console.log(data.content_en);
  console.log('\n--- PT CONTENT ---');
  console.log(data.content);
}

inspectPost();
