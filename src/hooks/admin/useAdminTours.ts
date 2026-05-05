import { useState } from "react";
import { LovableTour } from "@/integrations/lovable/client";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

export function useAdminTours() {
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const { toast } = useToast();

  const [pageSize] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin-tours', currentPage, categoryFilter, activeFilter],
    queryFn: async () => {
      const from = (currentPage - 1) * pageSize;
      const to = from + pageSize - 1;

      let query = supabase
        .from('tours')
        .select('*', { count: 'exact' });

      // Apply category filter at database level
      if (categoryFilter !== 'all') {
        query = query.eq('category', categoryFilter);
      }

      // Apply status filter at database level
      if (activeFilter === 'active') {
        query = query.eq('is_active', true);
      } else if (activeFilter === 'inactive') {
        query = query.eq('is_active', false);
      }

      const { data, count, error } = await query
        .order('sort_order')
        .range(from, to);

      if (error) {
        toast({ title: "Erro", description: "Falha ao carregar passeios", variant: "destructive" });
        throw error;
      }

      return {
        tours: data || [],
        totalCount: count || 0
      };
    }
  });

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
    tours: data?.tours || [],
    allTours: data?.tours || [], // Keeping compatibility, though we don't have all tours anymore
    isLoading,
    categoryFilter,
    setCategoryFilter,
    activeFilter,
    setActiveFilter,
    currentPage,
    setCurrentPage,
    totalCount: data?.totalCount || 0,
    pageSize,
    loadTours: refetch,
    handleDelete
  };
}

