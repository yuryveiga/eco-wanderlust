import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Upload, Images } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type GalleryImage = {
  id: string;
  key: string;
  image_url: string;
  label: string;
};

const PRESET_KEYS = [
  { key: "gallery_1", label: "Foto 1", category: "gallery" },
  { key: "gallery_2", label: "Foto 2", category: "gallery" },
  { key: "gallery_3", label: "Foto 3", category: "gallery" },
  { key: "gallery_4", label: "Foto 4", category: "gallery" },
  { key: "gallery_5", label: "Foto 5", category: "gallery" },
  { key: "gallery_6", label: "Foto 6", category: "gallery" },
  { key: "gallery_7", label: "Foto 7", category: "gallery" },
  { key: "gallery_8", label: "Foto 8", category: "gallery" },
  { key: "gallery_9", label: "Foto 9", category: "gallery" },
  { key: "gallery_10", label: "Foto 10", category: "gallery" },
  { key: "gallery_11", label: "Foto 11", category: "gallery" },
  { key: "gallery_12", label: "Foto 12", category: "gallery" },
];

const AdminGallery = () => {
  const [editing, setEditing] = useState<Partial<GalleryImage> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: images = [], isLoading } = useQuery({
    queryKey: ["admin-gallery-images"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_images")
        .select("*")
        .ilike("key", "gallery_%")
        .order("key");
      if (error) throw error;
      return data as GalleryImage[];
    },
  });

  const uploadImage = async (file: File, key: string): Promise<string> => {
    const ext = file.name.split(".").pop();
    const fileName = `gallery/${key}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("site-images").upload(fileName, file);
    if (error) throw error;
    const { data } = supabase.storage.from("site-images").getPublicUrl(fileName);
    return data.publicUrl;
  };

  const saveMutation = useMutation({
    mutationFn: async (img: Partial<GalleryImage>) => {
      let imageUrl = img.image_url;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile, img.key ?? "gallery");
      }
      const payload = { ...img, image_url: imageUrl };

      if (img.id) {
        const { error } = await supabase.from("site_images").update(payload).eq("id", img.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("site_images").upsert([payload as GalleryImage], { onConflict: "key" });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-gallery-images"] });
      queryClient.invalidateQueries({ queryKey: ["site-images"] });
      setEditing(null);
      setImageFile(null);
      toast({ title: "Foto salva!" });
    },
    onError: (e: Error) => toast({ title: "Erro", description: e.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("site_images").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-gallery-images"] });
      queryClient.invalidateQueries({ queryKey: ["site-images"] });
      toast({ title: "Foto removida" });
    },
  });

  const missingPresets = PRESET_KEYS.filter((p) => !images.find((i) => i.key === p.key));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">Galeria de Fotos</h1>
          <p className="text-muted-foreground font-sans text-sm mt-1">Gerencie as fotos da galeria do site</p>
        </div>
        <Button onClick={() => { setEditing({ key: "", label: "", image_url: "" }); setIsNew(true); setImageFile(null); }} className="font-sans">
          <Plus className="w-4 h-4 mr-2" />Nova Foto
        </Button>
      </div>

      {missingPresets.length > 0 && (
        <div className="mb-6 p-4 bg-accent/10 rounded-xl border border-accent/20">
          <p className="text-sm font-sans text-foreground mb-2 font-medium">Slots disponíveis para adicionar:</p>
          <div className="flex flex-wrap gap-2">
            {missingPresets.map((p) => (
              <Button key={p.key} size="sm" variant="outline" className="font-sans" onClick={() => { setEditing({ key: p.key, label: p.label, image_url: "" }); setIsNew(true); setImageFile(null); }}>
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
                  <Button variant="secondary" size="icon" onClick={() => { setEditing({ ...img }); setIsNew(false); setImageFile(null); }}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="destructive" size="icon" onClick={() => deleteMutation.mutate(img.id)}>
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
            <form onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(editing); }} className="space-y-4">
              <div className="space-y-2">
                <Label className="font-sans">Chave (identificador)</Label>
                <Input value={editing.key ?? ""} onChange={(e) => setEditing({ ...editing, key: e.target.value })} required disabled={!isNew} placeholder="gallery_1" />
              </div>
              <div className="space-y-2">
                <Label className="font-sans">Descrição</Label>
                <Input value={editing.label ?? ""} onChange={(e) => setEditing({ ...editing, label: e.target.value })} placeholder="Pôr do sol no Rio" />
              </div>
              <div className="space-y-2">
                <Label className="font-sans">Foto</Label>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} className="hidden" />
                <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} className="w-full font-sans">
                  <Upload className="w-4 h-4 mr-2" />
                  {imageFile ? imageFile.name : "Selecionar arquivo"}
                </Button>
                {editing.image_url && !imageFile && (
                  <img src={editing.image_url} alt="Preview" className="w-full h-40 object-cover rounded-lg mt-2" />
                )}
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setEditing(null)} className="font-sans">Cancelar</Button>
                <Button type="submit" className="font-sans" disabled={saveMutation.isPending}>Salvar</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminGallery;
