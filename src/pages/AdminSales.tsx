import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { fetchLovable, insertLovable, updateLovable, deleteLovable, LovableSale, LovableTour } from "@/integrations/lovable/client";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Pencil, Trash2, DollarSign, Check, X, Square, CheckSquare } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DeleteConfirmDialog } from "@/components/admin/DeleteConfirmDialog";


const AdminSales = () => {
  const [sales, setSales] = useState<LovableSale[]>([]);
  const [tours, setTours] = useState<LovableTour[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<LovableSale> | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<'all' | 'pending' | 'paid' | 'cancelled'>('all');
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);
  const { toast } = useToast();


  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5 * 60 * 1000);
    
    // Real-time subscription
    const channel = supabase
      .channel('sales-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'sales' }, () => {
        loadData();
      })
      .subscribe();
    
    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, []);

  const loadData = async () => {
    const [salesData, toursData] = await Promise.all([
      fetchLovable<LovableSale>("sales"),
      fetchLovable<LovableTour>("tours")
    ]);
    setSales(salesData.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()));
    setTours(toursData);
    setIsLoading(false);
  };

  const handleSave = async () => {
    if (!editing?.tour_id || !editing?.customer_name || !editing?.customer_email) {
      toast({ title: "Erro", description: "Passeio, nome e email são obrigatórios", variant: "destructive" });
      return;
    }

    try {
      const selectedTour = tours.find(t => t.id === editing.tour_id);
      
      const dataToSave = {
        ...editing,
        tour_title: selectedTour?.title || "",
        tour_slug: selectedTour?.slug || "",
      };

      if (editing.id) {
        await updateLovable("sales", editing.id, dataToSave);
        toast({ title: "Venda atualizada!" });
      } else {
        await insertLovable("sales", dataToSave);
        toast({ title: "Venda registrada!" });
      }

      await loadData();
      setEditing(null);
    } catch {
      toast({ title: "Erro", description: "Erro ao salvar", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    await deleteLovable("sales", id);
    setSales(sales.filter(s => s.id !== id));
    toast({ title: "Venda removida" });
    setItemToDelete(null);
  };


  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredSales.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredSales.map(s => s.id)));
    }
  };

  const deleteSelected = async () => {
    if (selectedIds.size === 0) return;
    setIsBulkDeleteOpen(true);
  };

  const confirmDeleteSelected = async () => {
    const idsToDelete = Array.from(selectedIds);
    setIsBulkDeleteOpen(false);
    
    for (const id of idsToDelete) {
      await deleteLovable("sales", id);
    }
    setSales(sales.filter(s => !selectedIds.has(s.id)));
    setSelectedIds(new Set());
    toast({ title: `${idsToDelete.length} venda(s) removida(s)` });
  };


  const updateStatus = async (sale: LovableSale, status: 'paid' | 'pending' | 'cancelled') => {
    const updates: Partial<LovableSale> = {};
    if (status === 'paid') {
      updates.is_paid = true;
      updates.is_cancelled = false;
    } else if (status === 'pending') {
      updates.is_paid = false;
      updates.is_cancelled = false;
    } else if (status === 'cancelled') {
      updates.is_cancelled = true;
    }
    await updateLovable("sales", sale.id, updates);
    await loadData();
    toast({ title: status === 'paid' ? 'Pago' : status === 'pending' ? 'Pendente' : 'Cancelado' });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const filteredSales = sales.filter(sale => {
    if (filter === 'all') return true;
    if (filter === 'pending') return !sale.is_paid;
    if (filter === 'paid') return sale.is_paid;
    if (filter === 'cancelled') return sale.is_cancelled;
    return true;
  });

  if (isLoading) {
    return <div className="p-8">Carregando...</div>;
  }

  return (
    <div className="flex flex-col h-full overflow-hidden font-sans">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-3xl font-bold text-foreground">Vendas</h1>
        {selectedIds.size > 0 && (
          <Button variant="destructive" onClick={deleteSelected}>
            <Trash2 className="w-4 h-4 mr-2" />Excluir ({selectedIds.size})
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4">
        {[
          { key: 'all', label: 'Todas' },
          { key: 'pending', label: 'Pendentes' },
          { key: 'paid', label: 'Pagas' },
          { key: 'cancelled', label: 'Canceladas' },
        ].map((f) => (
          <Button
            key={f.key}
            variant={filter === f.key ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(f.key as any)}
          >
            {f.label}
          </Button>
        ))}
      </div>

      <div className="bg-card rounded-xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="p-4 w-12">
                  <button onClick={toggleSelectAll}>
                    {selectedIds.size === sales.length && sales.length > 0 ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                  </button>
                </th>
                <th className="text-left p-4 font-bold text-sm">Data</th>
                <th className="text-left p-4 font-bold text-sm">Passeio</th>
                <th className="text-left p-4 font-bold text-sm">Cliente</th>
                <th className="text-left p-4 font-bold text-sm">Pessoas</th>
                <th className="text-left p-4 font-bold text-sm">Valor</th>
                <th className="text-left p-4 font-bold text-sm">Status</th>
                <th className="text-right p-4 font-bold text-sm">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.map((sale) => (
                <tr key={sale.id} className={`border-t hover:bg-muted/30 ${selectedIds.has(sale.id) ? 'bg-primary/5' : ''}`}>
                  <td className="p-4">
                    <button onClick={() => toggleSelect(sale.id)}>
                      {selectedIds.has(sale.id) ? <CheckSquare className="w-5 h-5 text-primary" /> : <Square className="w-5 h-5 text-muted-foreground" />}
                    </button>
                  </td>
                  <td className="p-4 text-sm">{formatDate(sale.created_at)}</td>
                  <td className="p-4 text-sm font-medium">{sale.tour_title}</td>
                  <td className="p-4 text-sm">
                    <div>{sale.customer_name}</div>
                    <div className="text-muted-foreground text-xs">{sale.customer_email}</div>
                    <div className="text-muted-foreground text-xs">{sale.customer_phone}</div>
                  </td>
                  <td className="p-4 text-sm">{sale.quantity}</td>
                  <td className="p-4 text-sm font-bold text-primary">{formatPrice(sale.total_price)}                  </td>
                  <td className="p-4 text-sm">
                    {sale.is_cancelled ? (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">Cancelado</span>
                    ) : sale.is_paid ? (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">Pago</span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700">Pendente</span>
                    )}
                  </td>
                  <td className="p-4 text-right flex gap-1">
                    <Button 
                      size="sm" 
                      variant={sale.is_paid ? "outline" : "default"}
                      className={sale.is_paid ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-green-500 text-white hover:bg-green-600"}
                      onClick={() => updateStatus(sale, 'paid')}
                    >
                      ✓
                    </Button>
                    <Button 
                      size="sm" 
                      variant={!sale.is_paid && !sale.is_cancelled ? "outline" : "default"}
                      className={!sale.is_paid && !sale.is_cancelled ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200" : "text-muted-foreground"}
                      onClick={() => updateStatus(sale, 'pending')}
                    >
                      ⏳
                    </Button>
                    <Button 
                      size="sm" 
                      variant={sale.is_cancelled ? "default" : "outline"}
                      className={sale.is_cancelled ? "bg-red-100 text-red-700 hover:bg-red-200" : "text-red-500"}
                      onClick={() => updateStatus(sale, 'cancelled')}
                    >
                      ✕
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => setEditing(sale)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="text-red-500" onClick={() => handleDelete(sale.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
              {sales.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-muted-foreground">
                    Nenhuma venda registrada
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing?.id ? "Editar Venda" : "Nova Venda"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 p-4">
            <div className="space-y-2">
              <Label>Passeio</Label>
              <select
                value={editing?.tour_id || ""}
                onChange={(e) => {
                  const tour = tours.find(t => t.id === e.target.value);
                  setEditing({ ...editing, tour_id: e.target.value, total_price: tour ? (tour.price || 0) * (editing?.quantity || 1) : 0 });
                }}
                className="w-full h-10 rounded-md border bg-background px-3 py-2"
              >
                <option value="">Selecione o passeio</option>
                {tours.map(tour => (
                  <option key={tour.id} value={tour.id}>{tour.title}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label>Nome do Cliente</Label>
              <Input
                value={editing?.customer_name || ""}
                onChange={(e) => setEditing({ ...editing, customer_name: e.target.value })}
                placeholder="Nome completo"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={editing?.customer_email || ""}
                  onChange={(e) => setEditing({ ...editing, customer_email: e.target.value })}
                  placeholder="email@exemplo.com"
                />
              </div>
              <div className="space-y-2">
                <Label>Telefone</Label>
                <Input
                  value={editing?.customer_phone || ""}
                  onChange={(e) => setEditing({ ...editing, customer_phone: e.target.value })}
                  placeholder="(21) 99999-9999"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Quantidade</Label>
                <Input
                  type="number"
                  min={1}
                  value={editing?.quantity || 1}
                  onChange={(e) => {
                    const qty = Number(e.target.value);
                    const tour = tours.find(t => t.id === editing?.tour_id);
                    setEditing({ ...editing, quantity: qty, total_price: tour ? (tour.price || 0) * qty : 0 });
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Valor Total</Label>
                <Input
                  type="number"
                  value={editing?.total_price || 0}
                  onChange={(e) => setEditing({ ...editing, total_price: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label>Data</Label>
                <Input
                  type="date"
                  value={editing?.selected_date || ""}
                  onChange={(e) => setEditing({ ...editing, selected_date: e.target.value })}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Label>Privativo</Label>
              <Switch
                checked={editing?.is_private ?? true}
                onCheckedChange={(v) => setEditing({ ...editing, is_private: v })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>Pago</Label>
              <Switch
                checked={editing?.is_paid ?? false}
                onCheckedChange={(v) => setEditing({ ...editing, is_paid: v })}
              />
            </div>

            <div className="flex gap-2 mt-4">
              <Button type="button" variant="outline" onClick={() => setEditing(null)} className="flex-1">
                Cancelar
              </Button>
              <Button onClick={handleSave} className="flex-1">
                Salvar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <DeleteConfirmDialog 
        open={!!itemToDelete} 
        onOpenChange={(open) => !open && setItemToDelete(null)} 
        onConfirm={() => itemToDelete && handleDelete(itemToDelete)}
        title="Excluir Venda"
        description="Tem certeza que deseja excluir o registro desta venda? Esta ação removerá permanentemente os dados do cliente e da reserva do nosso histórico."
      />

      <DeleteConfirmDialog 
        open={isBulkDeleteOpen} 
        onOpenChange={setIsBulkDeleteOpen} 
        onConfirm={confirmDeleteSelected}
        title={`Excluir ${selectedIds.size} Vendas`}
        description={`Tem certeza que deseja excluir permanentemente as ${selectedIds.size} vendas selecionadas? Todos os registros serão removidos do histórico.`}
      />
    </div>
  );
};

export default AdminSales;