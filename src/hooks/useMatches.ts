import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

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
    queryKey: ['matches'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('matches')
        .select('*')
        .order('match_date', { ascending: true });
        
      if (error) {
        console.warn("Table 'matches' might not exist yet:", error.message);
        return [];
      }
      return data as Match[];
    },
  });
}
