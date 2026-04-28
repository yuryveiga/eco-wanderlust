import { createClient } from '@supabase/supabase-js';

const MARACANA_PROJECT_URL = "https://mwxbskzggzznxvkwgrnz.supabase.co";
const MARACANA_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13eGJza3pnZ3p6bnh2a3dncm56Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzNjE5OTUsImV4cCI6MjA4ODkzNzk5NX0.EFfaaN79uifOMgFdIZlQ5C8c-HQH-YodNGWf0MEcf9o";

const maracanaSupabase = createClient(MARACANA_PROJECT_URL, MARACANA_ANON_KEY);

async function checkMatches() {
  const { data, error } = await maracanaSupabase
    .from('matches')
    .select('id, home_team, away_team, price, price_premium, highlights, full_description')
    .order('match_date', { ascending: false })
    .limit(5);

  if (error) {
    console.error(error);
    return;
  }

  data.forEach(m => {
    console.log(`Match: ${m.home_team} x ${m.away_team}`);
    console.log(`Price: ${m.price}, Premium: ${m.price_premium}`);
    console.log(`Highlights: ${m.highlights}`);
    console.log(`Description: ${m.full_description?.substring(0, 50)}...`);
    console.log('---');
  });
}

checkMatches();
