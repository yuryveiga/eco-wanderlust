import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { fetchLovable, insertLovable, updateLovable, deleteLovable, uploadLovableFile, LovableSiteImage } from "@/integrations/lovable/client";
import { Plus, Pencil, Trash2, Upload, Image } from "lucide-react";
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    const data = await fetchLovable<LovableSiteImage>("site_images");
    setImages(data);
    setIsLoading(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!editing?.key) {
      toast({ title: "Erro", description: "Chave é obrigatória", variant: "destructive" });
      return;
    }

    setIsUploading(true);

    try {
      let imageUrl = editing.image_url || "";

      if (selectedFile) {
        const uploadedUrl = await uploadLovableFile(selectedFile);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        } else {
          toast({ title: "Erro", description: "Falha ao fazer upload da imagem", variant: "destructive" });
          setIsUploading(false);
          return;
        }
      }

      const dataToSave = { ...editing, image_url: imageUrl };

      if (isNew) {
        await insertLovable("site_images", dataToSave);
        toast({ title: "Imagem salva!" });
      } else if (editing.id) {
        await updateLovable("site_images", editing.id, dataToSave);
        toast({ title: "Imagem atualizada!" });
      }

      await loadImages();
      setEditing(null);
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch {
      toast({ title: "Erro", description: "Erro ao salvar", variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Deseja excluir esta imagem?")) return;
    await deleteLovable("site_images", id);
    await loadImages();
    toast({ title: "Imagem removida" });
  };

  const openNew = (key?: string, label?: string) => {
    setEditing({ key: key || "", label: label || "", image_url: "" });
    setIsNew(true);
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const openEdit = (img: LovableSiteImage) => {
    setEditing({ ...img });
    setIsNew(false);
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const missingPresets = PRESET_KEYS.filter((p) => !images.find((i) => i.key === p.key));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">Imagens do Site</h1>
          <p className="text-muted-foreground font-sans text-sm mt-1">Gerencie logo, hero, e imagens de seções</p>
        </div>
        <Button onClick={() => openNew()} className="font-sans">
          <Plus className="w-4 h-4 mr-2" />Nova Imagem
        </Button>
      </div>

      {missingPresets.length > 0 && (
        <div className="mb-6 p-4 bg-accent/10 rounded-xl border border-accent/20">
          <p className="text-sm font-sans text-foreground mb-2 font-medium">Imagens sugeridas para configurar:</p>
          <div className="flex flex-wrap gap-2">
            {missingPresets.map((p) => (
              <Button key={p.key} size="sm" variant="outline" className="font-sans" onClick={() => openNew(p.key, p.label)}>
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
              {img.image_url ? (
                <img src={img.image_url} alt={img.label} className="w-full h-40 object-cover" />
              ) : (
                <div className="w-full h-40 bg-muted flex items-center justify-center">
                  <Image className="w-12 h-12 text-muted-foreground/30" />
                </div>
              )}
              <div className="p-4">
                <p className="font-semibold text-foreground font-sans">{img.label || img.key}</p>
                <p className="text-xs text-muted-foreground font-sans">Chave: {img.key}</p>
                <div className="flex gap-2 mt-3">
                  <Button variant="outline" size="sm" onClick={() => openEdit(img)}>
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
                <Input 
                  value={editing.key ?? ""} 
                  onChange={(e) => setEditing({ ...editing, key: e.target.value })} 
                  required 
                  disabled={!isNew} 
                  placeholder="hero_bg" 
                />
              </div>
              <div className="space-y-2">
                <Label className="font-sans">Descrição</Label>
                <Input 
                  value={editing.label ?? ""} 
                  onChange={(e) => setEditing({ ...editing, label: e.target.value })} 
                  placeholder="Fundo do Hero" 
                />
              </div>
              <div className="space-y-2">
                <Label className="font-sans">Imagem</Label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => fileInputRef.current?.click()} 
                  className="w-full font-sans"
                  disabled={isUploading}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {selectedFile ? selectedFile.name : "Selecionar arquivo"}
                </Button>
                {(previewUrl || editing.image_url) && (
                  <div className="mt-2">
                    <img 
                      src={previewUrl || editing.image_url} 
                      alt="Preview" 
                      className="w-full h-40 object-cover rounded-lg" 
                    />
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setEditing(null)} className="font-sans">Cancelar</Button>
                <Button onClick={handleSave} className="font-sans" disabled={isUploading}>
                  {isUploading ? "Enviando..." : "Salvar"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminImages;
