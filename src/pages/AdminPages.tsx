import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { fetchLovable, insertLovable, updateLovable, deleteLovable, LovablePage } from "@/integrations/lovable/client";
import { Plus, Pencil, Trash2, GripVertical } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const AdminPages = () => {
  const [pages, setPages] = useState<LovablePage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<LovablePage> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchLovable<LovablePage>("pages").then((data) => {
      setPages(data.sort((a, b) => a.sort_order - b.sort_order));
      setIsLoading(false);
    });
  }, []);

  const handleSave = async () => {
    if (!editing?.title || !editing?.href) {
      toast({ title: "Erro", description: "Título e link são obrigatórios", variant: "destructive" });
      return;
    }

    try {
      if (isNew) {
        const newPage = { ...editing, sort_order: pages.length + 1 };
        await insertLovable("pages", newPage);
        toast({ title: "Página criada!" });
      } else if (editing.id) {
        await updateLovable("pages", editing.id, editing);
        toast({ title: "Página atualizada!" });
      }

      const data = await fetchLovable<LovablePage>("pages");
      setPages(data.sort((a, b) => a.sort_order - b.sort_order));
      setEditing(null);
    } catch {
      toast({ title: "Erro", description: "Erro ao salvar", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Deseja excluir esta página?")) return;
    await deleteLovable("pages", id);
    setPages(pages.filter((p) => p.id !== id));
    toast({ title: "Página removida" });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">Páginas / Menu</h1>
          <p className="text-muted-foreground font-sans text-sm mt-1">Gerencie os itens do menu do site</p>
        </div>
        <Button onClick={() => { setEditing({ title: "", href: "#", is_visible: true, sort_order: pages.length }); setIsNew(true); }} className="font-sans">
          <Plus className="w-4 h-4 mr-2" />Nova Página
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground font-sans">Carregando...</div>
      ) : pages.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground font-sans">Nenhuma página cadastrada.</div>
      ) : (
        <div className="bg-card rounded-xl border border-border/50 divide-y divide-border/50">
          {pages.map((page) => (
            <div key={page.id} className="flex items-center gap-4 p-4">
              <GripVertical className="w-4 h-4 text-muted-foreground" />
              <div className="flex-1">
                <h3 className="font-semibold text-foreground font-sans">{page.title}</h3>
                <p className="text-sm text-muted-foreground font-sans">{page.href}</p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-sans ${page.is_visible ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                {page.is_visible ? "Visível" : "Oculto"}
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={() => { setEditing({ ...page }); setIsNew(false); }}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => handleDelete(page.id)}>
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-serif">{isNew ? "Nova Página" : "Editar Página"}</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="font-sans">Título</Label>
                <Input value={editing.title ?? ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label className="font-sans">Link (href)</Label>
                <Input value={editing.href ?? ""} onChange={(e) => setEditing({ ...editing, href: e.target.value })} placeholder="#tours" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-sans">Ordem</Label>
                  <Input type="number" value={editing.sort_order ?? 0} onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })} />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <Switch checked={editing.is_visible ?? true} onCheckedChange={(v) => setEditing({ ...editing, is_visible: v })} />
                  <Label className="font-sans">Visível no menu</Label>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setEditing(null)} className="font-sans">Cancelar</Button>
                <Button onClick={handleSave} className="font-sans">Salvar</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPages;
