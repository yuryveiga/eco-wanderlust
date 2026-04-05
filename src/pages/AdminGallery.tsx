import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { fetchLovable, insertLovable, updateLovable, deleteLovable, LovableSiteImage } from "@/integrations/lovable/client";
import { Plus, Pencil, Trash2, Upload, Images } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const PRESET_KEYS = [
  { key: "gallery_1", label: "Foto 1" },
  { key: "gallery_2", label: "Foto 2" },
  { key: "gallery_3", label: "Foto 3" },
  { key: "gallery_4", label: "Foto 4" },
  { key: "gallery_5", label: "Foto 5" },
  { key: "gallery_6", label: "Foto 6" },
  { key: "gallery_7", label: "Foto 7" },
  { key: "gallery_8", label: "Foto 8" },
  { key: "gallery_9", label: "Foto 9" },
  { key: "gallery_10", label: "Foto 10" },
  { key: "gallery_11", label: "Foto 11" },
  { key: "gallery_12", label: "Foto 12" },
];

const AdminGallery = () => {
  const [images, setImages] = useState<LovableSiteImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<LovableSiteImage> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchLovable<LovableSiteImage>("site_images").then((data) => {
      const galleryImages = data.filter((img) => img.key?.startsWith("gallery_"));
      setImages(galleryImages);
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
        toast({ title: "Foto salva!" });
      } else if (editing.id) {
        await updateLovable("site_images", editing.id, editing);
        toast({ title: "Foto atualizada!" });
      }

      const data = await fetchLovable<LovableSiteImage>("site_images");
      const galleryImages = data.filter((img) => img.key?.startsWith("gallery_"));
      setImages(galleryImages);
      setEditing(null);
    } catch {
      toast({ title: "Erro", description: "Erro ao salvar", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Deseja excluir esta foto?")) return;
    await deleteLovable("site_images", id);
    setImages(images.filter((i) => i.id !== id));
    toast({ title: "Foto removida" });
  };

  const missingPresets = PRESET_KEYS.filter((p) => !images.find((i) => i.key === p.key));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">Galeria de Fotos</h1>
          <p className="text-muted-foreground font-sans text-sm mt-1">Gerencie as fotos da galeria do site</p>
        </div>
        <Button onClick={() => { setEditing({ key: "", label: "", image_url: "" }); setIsNew(true); }} className="font-sans">
          <Plus className="w-4 h-4 mr-2" />Nova Foto
        </Button>
      </div>

      {missingPresets.length > 0 && (
        <div className="mb-6 p-4 bg-accent/10 rounded-xl border border-accent/20">
          <p className="text-sm font-sans text-foreground mb-2 font-medium">Slots disponíveis para adicionar:</p>
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
        <div className="text-center py-12 text-muted-foreground font-sans">Nenhuma foto na galeria.</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((img) => (
            <div key={img.id} className="bg-card rounded-xl border border-border/50 overflow-hidden group">
              <div className="relative aspect-square overflow-hidden">
                {img.image_url ? (
                  <img src={img.image_url} alt={img.label} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <Images className="w-12 h-12 text-muted-foreground/30" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <Button variant="secondary" size="icon" onClick={() => { setEditing({ ...img }); setIsNew(false); }}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="destructive" size="icon" onClick={() => handleDelete(img.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="p-3">
                <p className="font-medium text-foreground font-sans text-sm truncate">{img.label}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-serif">{isNew ? "Nova Foto" : "Editar Foto"}</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="font-sans">Chave (identificador)</Label>
                <Input value={editing.key ?? ""} onChange={(e) => setEditing({ ...editing, key: e.target.value })} required disabled={!isNew} placeholder="gallery_1" />
              </div>
              <div className="space-y-2">
                <Label className="font-sans">Descrição</Label>
                <Input value={editing.label ?? ""} onChange={(e) => setEditing({ ...editing, label: e.target.value })} placeholder="Descrição da foto" />
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

export default AdminGallery;
