import { createClient } from '@supabase/supabase-js';

const MARACANA_PROJECT_URL = "https://mwxbskzggzznxvkwgrnz.supabase.co";
const MARACANA_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13eGJza3pnZ3p6bnh2a3dncm56Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzNjE5OTUsImV4cCI6MjA4ODkzNzk5NX0.EFfaaN79uifOMgFdIZlQ5C8c-HQH-YodNGWf0MEcf9o";

const maracanaSupabase = createClient(MARACANA_PROJECT_URL, MARACANA_ANON_KEY);

async function getVascoDetails() {
  const { data, error } = await maracanaSupabase
    .from('matches')
    .select('*')
    .ilike('home_team', '%Flamengo%')
    .ilike('away_team', '%Vasco%')
    .order('match_date', { ascending: true });

  if (error) {
    console.error(error);
    return;
  }

  if (data && data.length > 0) {
    data.forEach(match => {
      console.log(`Jogo: ${match.home_team} x ${match.away_team}`);
      console.log(`Data: ${match.match_date}`);
      console.log(`Preço Base: R$ ${match.price}`);
      console.log(`Preço Premium: ${match.price_premium ? 'R$ ' + match.price_premium : 'Não disponível'}`);
      console.log(`Opções Customizadas: ${match.custom_options_json ? JSON.stringify(match.custom_options_json) : 'Nenhuma'}`);
      console.log('---');
    });
  } else {
    console.log("Nenhum jogo Flamengo x Vasco encontrado no banco do parceiro.");
  }
}

getVascoDetails();
