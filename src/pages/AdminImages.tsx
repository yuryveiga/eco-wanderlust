import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Upload } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type SiteImage = {
  id: string;
  key: string;
  image_url: string;
  label: string;
};

const PRESET_KEYS = [
  { key: "logo", label: "Logo do Site" },
  { key: "hero_bg", label: "Fundo do Hero" },
  { key: "about_1", label: "Sobre - Imagem 1" },
  { key: "about_2", label: "Sobre - Imagem 2" },
  { key: "about_3", label: "Sobre - Imagem 3" },
  { key: "about_4", label: "Sobre - Imagem 4" },
];

const AdminImages = () => {
  const [editing, setEditing] = useState<Partial<SiteImage> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: images = [], isLoading } = useQuery({
    queryKey: ["admin-site-images"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_images").select("*").order("key");
      if (error) throw error;
      return data as SiteImage[];
    },
  });

  const uploadImage = async (file: File, key: string): Promise<string> => {
    const ext = file.name.split(".").pop();
    const fileName = `site/${key}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("site-images").upload(fileName, file);
    if (error) throw error;
    const { data } = supabase.storage.from("site-images").getPublicUrl(fileName);
    return data.publicUrl;
  };

  const saveMutation = useMutation({
    mutationFn: async (img: Partial<SiteImage>) => {
      let imageUrl = img.image_url;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile, img.key ?? "img");
      }
      const payload = { ...img, image_url: imageUrl };

      if (img.id) {
        const { error } = await supabase.from("site_images").update(payload).eq("id", img.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("site_images").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-site-images"] });
      setEditing(null);
      setImageFile(null);
      toast({ title: "Imagem salva!" });
    },
    onError: (e: Error) => toast({ title: "Erro", description: e.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("site_images").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-site-images"] });
      toast({ title: "Imagem removida" });
    },
  });

  const missingPresets = PRESET_KEYS.filter((p) => !images.find((i) => i.key === p.key));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">Imagens do Site</h1>
          <p className="text-muted-foreground font-sans text-sm mt-1">Gerencie logo, hero, e imagens de seções</p>
        </div>
        <Button onClick={() => { setEditing({ key: "", label: "", image_url: "" }); setIsNew(true); setImageFile(null); }} className="font-sans">
          <Plus className="w-4 h-4 mr-2" />Nova Imagem
        </Button>
      </div>

      {missingPresets.length > 0 && (
        <div className="mb-6 p-4 bg-accent/10 rounded-xl border border-accent/20">
          <p className="text-sm font-sans text-foreground mb-2 font-medium">Imagens sugeridas para configurar:</p>
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
                  <Button variant="outline" size="sm" onClick={() => { setEditing({ ...img }); setIsNew(false); setImageFile(null); }}><Pencil className="w-3 h-3 mr-1" />Editar</Button>
                  <Button variant="outline" size="sm" onClick={() => deleteMutation.mutate(img.id)}><Trash2 className="w-3 h-3 mr-1 text-destructive" />Remover</Button>
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
            <form onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(editing); }} className="space-y-4">
              <div className="space-y-2">
                <Label className="font-sans">Chave (identificador único)</Label>
                <Input value={editing.key ?? ""} onChange={(e) => setEditing({ ...editing, key: e.target.value })} required disabled={!isNew} placeholder="hero_bg" />
              </div>
              <div className="space-y-2">
                <Label className="font-sans">Descrição</Label>
                <Input value={editing.label ?? ""} onChange={(e) => setEditing({ ...editing, label: e.target.value })} placeholder="Fundo do Hero" />
              </div>
              <div className="space-y-2">
                <Label className="font-sans">Imagem</Label>
                <Input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} />
                {editing.image_url && !imageFile && (
                  <img src={editing.image_url} alt="Preview" className="w-full h-32 object-cover rounded-lg mt-2" />
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

export default AdminImages;
