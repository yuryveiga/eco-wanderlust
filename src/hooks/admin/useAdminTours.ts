import { useState } from "react";
import { LovableTour } from "@/integrations/lovable/client";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useInfiniteQuery } from "@tanstack/react-query";

export function useAdminTours() {
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const { toast } = useToast();

  const [pageSize] = useState(24);

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = useInfiniteQuery({
    queryKey: ['admin-tours', categoryFilter, activeFilter],
    queryFn: async ({ pageParam = 0 }) => {
      const from = pageParam * pageSize;
      const to = from + pageSize - 1;

      let query = supabase
        .from('tours')
        .select('*', { count: 'exact' });

      if (categoryFilter !== 'all') {
        query = query.eq('category', categoryFilter);
      }

      if (activeFilter === 'active') {
        query = query.eq('is_active', true);
      } else if (activeFilter === 'inactive') {
        query = query.eq('is_active', false);
      }

      const { data, count, error } = await query
        .order('sort_order', { ascending: true })
        .range(from, to);

      if (error) {
        toast({ title: "Erro", description: "Falha ao carregar passeios", variant: "destructive" });
        throw error;
      }

      return {
        tours: data || [],
        nextPage: (data?.length || 0) < pageSize ? undefined : pageParam + 1,
        totalCount: count || 0
      };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  const allToursFlat = data?.pages.flatMap(page => page.tours) || [];

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from('tours').delete().eq('id', id);
      if (error) throw error;
      toast({ title: "Passeio removido" });
      refetch();
    } catch (error) {
      toast({ title: "Erro", description: "Falha ao remover passeio", variant: "destructive" });
    }
  };

  return {
    tours: allToursFlat,
    allTours: allToursFlat,
    isLoading,
    categoryFilter,
    setCategoryFilter,
    activeFilter,
    setActiveFilter,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    totalCount: data?.pages[0]?.totalCount || 0,
    pageSize,
    loadTours: refetch,
    handleDelete
  };
}

