import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { fetchLovable, insertLovable, updateLovable, deleteLovable, LovableTour } from "@/integrations/lovable/client";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const emptyTour = {
  title: "",
  short_description: "",
  price: 0,
  duration: "",
  max_group_size: 10,
  image_url: "",
  is_featured: false,
  category: "",
  is_active: true,
  sort_order: 0,
};

const AdminTours = () => {
  const [tours, setTours] = useState<LovableTour[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingTour, setEditingTour] = useState<Partial<LovableTour> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const { toast } = useToast();

  useState(() => {
    fetchLovable<LovableTour>("tours").then((data) => {
      setTours(data.sort((a, b) => a.sort_order - b.sort_order));
      setIsLoading(false);
    });
  });

  const handleSave = async () => {
    if (!editingTour?.title) {
      toast({ title: "Erro", description: "Título é obrigatório", variant: "destructive" });
      return;
    }

    try {
      if (isNew) {
        const newTour = { ...editingTour, sort_order: tours.length + 1 };
        await insertLovable("tours", newTour);
        toast({ title: "Passeio criado!" });
      } else if (editingTour.id) {
        await updateLovable("tours", editingTour.id, editingTour);
        toast({ title: "Passeio atualizado!" });
      }

      const data = await fetchLovable<LovableTour>("tours");
      setTours(data.sort((a, b) => a.sort_order - b.sort_order));
      setEditingTour(null);
    } catch {
      toast({ title: "Erro", description: "Erro ao salvar", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Deseja excluir este passeio?")) return;
    await deleteLovable("tours", id);
    setTours(tours.filter((t) => t.id !== id));
    toast({ title: "Passeio removido" });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-3xl font-bold text-foreground">Passeios</h1>
        <Button onClick={() => { setEditingTour({ ...emptyTour }); setIsNew(true); }} className="font-sans">
          <Plus className="w-4 h-4 mr-2" />Novo Passeio
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground font-sans">Carregando...</div>
      ) : tours.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground font-sans">Nenhum passeio cadastrado.</div>
      ) : (
        <div className="grid gap-4">
          {tours.map((tour) => (
            <div key={tour.id} className="bg-card rounded-xl border border-border/50 p-4 flex items-center gap-4">
              {tour.image_url && (
                <img src={tour.image_url} alt={tour.title} className="w-20 h-20 rounded-lg object-cover flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground font-sans truncate">{tour.title}</h3>
                  {tour.is_featured && <span className="text-xs bg-accent text-accent-foreground px-2 py-0.5 rounded-full font-sans">Destaque</span>}
                  {!tour.is_active && <span className="text-xs bg-destructive/10 text-destructive px-2 py-0.5 rounded-full font-sans">Inativo</span>}
                </div>
                <p className="text-sm text-muted-foreground font-sans">{tour.category} · R$ {tour.price} · {tour.duration}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={() => { setEditingTour({ ...tour }); setIsNew(false); }}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => handleDelete(tour.id)}>
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={!!editingTour} onOpenChange={(open) => !open && setEditingTour(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif">{isNew ? "Novo Passeio" : "Editar Passeio"}</DialogTitle>
          </DialogHeader>
          {editingTour && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-sans">Título</Label>
                  <Input value={editingTour.title ?? ""} onChange={(e) => setEditingTour({ ...editingTour, title: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label className="font-sans">Categoria</Label>
                  <Input value={editingTour.category ?? ""} onChange={(e) => setEditingTour({ ...editingTour, category: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="font-sans">Descrição curta</Label>
                <Textarea value={editingTour.short_description ?? ""} onChange={(e) => setEditingTour({ ...editingTour, short_description: e.target.value })} rows={3} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="font-sans">Preço (R$)</Label>
                  <Input type="number" value={editingTour.price ?? 0} onChange={(e) => setEditingTour({ ...editingTour, price: Number(e.target.value) })} />
                </div>
                <div className="space-y-2">
                  <Label className="font-sans">Duração</Label>
                  <Input value={editingTour.duration ?? ""} onChange={(e) => setEditingTour({ ...editingTour, duration: e.target.value })} placeholder="8 horas" />
                </div>
                <div className="space-y-2">
                  <Label className="font-sans">Grupo máx.</Label>
                  <Input type="number" value={editingTour.max_group_size ?? 10} onChange={(e) => setEditingTour({ ...editingTour, max_group_size: Number(e.target.value) })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="font-sans">URL da Imagem</Label>
                <Input value={editingTour.image_url ?? ""} onChange={(e) => setEditingTour({ ...editingTour, image_url: e.target.value })} placeholder="https://..." />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="font-sans">Ordem</Label>
                  <Input type="number" value={editingTour.sort_order ?? 0} onChange={(e) => setEditingTour({ ...editingTour, sort_order: Number(e.target.value) })} />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <Switch checked={editingTour.is_featured ?? false} onCheckedChange={(v) => setEditingTour({ ...editingTour, is_featured: v })} />
                  <Label className="font-sans">Destaque</Label>
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <Switch checked={editingTour.is_active ?? true} onCheckedChange={(v) => setEditingTour({ ...editingTour, is_active: v })} />
                  <Label className="font-sans">Ativo</Label>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setEditingTour(null)} className="font-sans">Cancelar</Button>
                <Button onClick={handleSave} className="font-sans">Salvar</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminTours;
