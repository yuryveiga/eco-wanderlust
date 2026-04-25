import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

// Basic protective wrapper for Google Translate API (simplified version for script)
async function translate(text, targetLang, sourceLang = 'pt') {
  if (!text || text.trim() === "") return "";
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    const response = await fetch(url);
    const data = await response.json();
    if (data && data[0]) {
      return data[0].map(s => s[0]).join('');
    }
    return text;
  } catch (e) {
    console.error("Translation failed", e);
    return text;
  }
}

async function fixPosts() {
  console.log("Starting translation fix for 10 posts...");
  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select('id, title, content, content_en, title_en, excerpt_en')
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) {
    console.error(error);
    return;
  }

  for (const post of posts) {
    // If EN content is significantly longer than PT content, PT is likely truncated
    const enLen = post.content_en ? post.content_en.length : 0;
    const ptLen = post.content ? post.content.length : 0;

    if (enLen > 1000 && ptLen < 1000) {
      console.log(`Fixing post: ${post.title}`);
      
      const titlePt = await translate(post.title_en, 'pt', 'en');
      const contentPt = await translate(post.content_en, 'pt', 'en');
      
      const { error: updateError } = await supabase
        .from('blog_posts')
        .update({
          title: titlePt,
          content: contentPt
        })
        .eq('id', post.id);

      if (updateError) {
        console.error(`Error updating post ${post.id}:`, updateError);
      } else {
        console.log(`Successfully fixed: ${post.title}`);
      }
      
      // Wait a bit to avoid hitting rate limits too fast
      await new Promise(r => setTimeout(r, 1000));
    } else {
      console.log(`Skipping post (already seems complete or both short): ${post.title}`);
    }
  }
  console.log("Fix completed.");
}

fixPosts();
