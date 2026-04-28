import { createClient } from '@supabase/supabase-js';

const MARACANA_PROJECT_URL = "https://mwxbskzggzznxvkwgrnz.supabase.co";
const MARACANA_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13eGJza3pnZ3p6bnh2a3dncm56Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzNjE5OTUsImV4cCI6MjA4ODkzNzk5NX0.EFfaaN79uifOMgFdIZlQ5C8c-HQH-YodNGWf0MEcf9o";

const maracanaSupabase = createClient(MARACANA_PROJECT_URL, MARACANA_ANON_KEY);

async function findSectorsInTours() {
  const { data, error } = await maracanaSupabase
    .from('tours')
    .select('id, title, custom_options_json')
    .ilike('title', '%Flamengo%Vasco%')
    .limit(5);

  if (error) {
    console.error(error);
    return;
  }

  if (data && data.length > 0) {
    data.forEach(t => {
      console.log(`Tour: ${t.title}`);
      console.log(`Options: ${JSON.stringify(t.custom_options_json, null, 2)}`);
      console.log('---');
    });
  } else {
    console.log("Nenhum tour/jogo encontrado na tabela 'tours' do parceiro.");
  }
}

findSectorsInTours();
