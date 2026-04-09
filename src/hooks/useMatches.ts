import { useQuery } from '@tanstack/react-query';
import { createClient } from '@supabase/supabase-js';

// Esse é o cliente do projeto original "Maracanã Matchday"
// Isso permite que a Tocorime puxe os jogos diretamente de lá
const MARACANA_PROJECT_URL = "https://mwxbskzggzznxvkwgrnz.supabase.co";
const MARACANA_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13eGJza3pnZ3p6bnh2a3dncm56Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzNjE5OTUsImV4cCI6MjA4ODkzNzk5NX0.EFfaaN79uifOMgFdIZlQ5C8c-HQH-YodNGWf0MEcf9o";

const maracanaSupabase = createClient(MARACANA_PROJECT_URL, MARACANA_ANON_KEY);

export interface Match {
  id: string;
  home_team: string;
  away_team: string;
  match_date: string;
  venue: string;
  price: number;
  available_spots: number;
  sold_count: number;
  status: string;
  stadium?: string;
  slug?: string;
  high_demand?: boolean;
}

export function useMatches() {
  return useQuery({
    queryKey: ['maracana-matches-sync'],
    queryFn: async () => {
      // Buscamos diretamente do banco de dados do Maracanã Matchday
      const { data, error } = await maracanaSupabase
        .from('matches')
        .select('*')
        .order('match_date', { ascending: true });
        
      if (error) {
        console.error("Erro ao sincronizar com o Maracanã Matchday:", error.message);
        return [];
      }
      return data as Match[];
    },
    // Opcional: atualizar os dados a cada 5 minutos
    refetchInterval: 1000 * 60 * 5,
  });
}
