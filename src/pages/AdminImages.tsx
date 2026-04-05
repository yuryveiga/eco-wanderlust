import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { fetchLovable, insertLovable, updateLovable, deleteLovable, LovableSiteImage } from "@/integrations/lovable/client";
import { Plus, Pencil, Trash2, Upload } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const PRESET_KEYS = [
  { key: "logo", label: "Logo do Site" },
  { key: "hero_bg", label: "Fundo do Hero" },
  { key: "about_1", label: "Sobre - Imagem 1" },
  { key: "about_2", label: "Sobre - Imagem 2" },
  { key: "about_3", label: "Sobre - Imagem 3" },
  { key: "about_4", label: "Sobre - Imagem 4" },
];

const AdminImages = () => {
  const [images, setImages] = useState<LovableSiteImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<LovableSiteImage> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchLovable<LovableSiteImage>("site_images").then((data) => {
      setImages(data);
      setIsLoading(false);
    });
  }, []);

  const handleSave = async () => {
    if (!editing?.key) {
      toast({ title: "Erro", description: "Chave é obrigatória", variant: "destructive" });
      return;
    }

    try {
      if (isNew) {
        await insertLovable("site_images", editing);
        toast({ title: "Imagem salva!" });
      } else if (editing.id) {
        await updateLovable("site_images", editing.id, editing);
        toast({ title: "Imagem atualizada!" });
      }

      const data = await fetchLovable<LovableSiteImage>("site_images");
      setImages(data);
      setEditing(null);
    } catch {
      toast({ title: "Erro", description: "Erro ao salvar", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Deseja excluir esta imagem?")) return;
    await deleteLovable("site_images", id);
    setImages(images.filter((i) => i.id !== id));
    toast({ title: "Imagem removida" });
  };

  const missingPresets = PRESET_KEYS.filter((p) => !images.find((i) => i.key === p.key));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">Imagens do Site</h1>
          <p className="text-muted-foreground font-sans text-sm mt-1">Gerencie logo, hero, e imagens de seções</p>
        </div>
        <Button onClick={() => { setEditing({ key: "", label: "", image_url: "" }); setIsNew(true); }} className="font-sans">
          <Plus className="w-4 h-4 mr-2" />Nova Imagem
        </Button>
      </div>

      {missingPresets.length > 0 && (
        <div className="mb-6 p-4 bg-accent/10 rounded-xl border border-accent/20">
          <p className="text-sm font-sans text-foreground mb-2 font-medium">Imagens sugeridas para configurar:</p>
          <div className="flex flex-wrap gap-2">
            {missingPresets.map((p) => (
              <Button key={p.key} size="sm" variant="outline" className="font-sans" onClick={() => { setEditing({ key: p.key, label: p.label, image_url: "" }); setIsNew(true); }}>
                <Upload className="w-3 h-3 mr-1" />{p.label}
              </Button>
            ))}
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground font-sans">Carregando...</div>
      ) : images.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground font-sans">Nenhuma imagem cadastrada.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((img) => (
            <div key={img.id} className="bg-card rounded-xl border border-border/50 overflow-hidden">
              {img.image_url && <img src={img.image_url} alt={img.label} className="w-full h-40 object-cover" />}
              <div className="p-4">
                <p className="font-semibold text-foreground font-sans">{img.label}</p>
                <p className="text-xs text-muted-foreground font-sans">Chave: {img.key}</p>
                <div className="flex gap-2 mt-3">
                  <Button variant="outline" size="sm" onClick={() => { setEditing({ ...img }); setIsNew(false); }}>
                    <Pencil className="w-3 h-3 mr-1" />Editar
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(img.id)}>
                    <Trash2 className="w-3 h-3 mr-1 text-destructive" />Remover
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-serif">{isNew ? "Nova Imagem" : "Editar Imagem"}</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="font-sans">Chave (identificador único)</Label>
                <Input value={editing.key ?? ""} onChange={(e) => setEditing({ ...editing, key: e.target.value })} required disabled={!isNew} placeholder="hero_bg" />
              </div>
              <div className="space-y-2">
                <Label className="font-sans">Descrição</Label>
                <Input value={editing.label ?? ""} onChange={(e) => setEditing({ ...editing, label: e.target.value })} placeholder="Fundo do Hero" />
              </div>
              <div className="space-y-2">
                <Label className="font-sans">URL da Imagem</Label>
                <Input value={editing.image_url ?? ""} onChange={(e) => setEditing({ ...editing, image_url: e.target.value })} placeholder="https://..." />
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

export default AdminImages;
