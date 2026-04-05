import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Images, ImagePlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const CATEGORIES = [
  { value: "todas", label: "Todas as categorias" },
  { value: "praia", label: "Praia" },
  { value: "trilha", label: "Trilha" },
  { value: "city_tour", label: "City Tour" },
  { value: "barco", label: "Barco" },
];

export type SiteImage = {
  id: string;
  key: string;
  image_url: string;
  label: string;
};

const AdminGallery = () => {
  const [images, setImages] = useState<SiteImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Form Upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadCategory, setUploadCategory] = useState("todas");
  const [uploadLabel, setUploadLabel] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter state
  const [filterCategory, setFilterCategory] = useState("todas");

  const { toast } = useToast();

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('site_images')
      .select('*')
      .like('key', 'gallery%')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setImages(data);
    }
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

  const clearForm = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploadLabel("");
    setUploadCategory("todas");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({ title: "Aviso", description: "Selecione uma imagem primeiro.", variant: "destructive" });
      return;
    }

    setIsUploading(true);

    try {
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('site-images')
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('site-images')
        .getPublicUrl(filePath);

      const key = `gallery__${uploadCategory}__${Date.now()}`;
      
      const { error: insertError } = await supabase
        .from('site_images')
        .insert({
          key,
          image_url: publicUrl,
          label: uploadLabel
        });

      if (insertError) throw insertError;

      toast({ title: "Foto salva com sucesso!" });
      clearForm();
      await loadImages();
    } catch (error) {
      console.error(error);
      toast({ title: "Erro", description: "Ocorreu um erro no upload da imagem.", variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (img: SiteImage) => {
    if (!confirm("Deseja excluir esta foto?")) return;
    
    try {
      if (img.image_url.includes('site-images')) {
        const fileName = img.image_url.substring(img.image_url.lastIndexOf('/') + 1);
        await supabase.storage.from('site-images').remove([fileName]);
      }
    } catch(e) {}

    const { error } = await supabase.from('site_images').delete().eq('id', img.id);
    if (!error) {
      toast({ title: "Foto removida" });
      await loadImages();
    }
  };

  const handleChangeCategory = async (img: SiteImage, newCategory: string) => {
    const parts = img.key.split('__');
    let newKey = img.key;
    if (parts.length >= 3 && parts[0] === 'gallery') {
      newKey = `gallery__${newCategory}__${parts[2]}`;
    } else {
      newKey = `gallery__${newCategory}__${Date.now()}`;
    }

    const { error } = await supabase
      .from('site_images')
      .update({ key: newKey })
      .eq('id', img.id);

    if (!error) {
      toast({ title: "Categoria atualizada!" });
      await loadImages();
    } else {
      toast({ title: "Erro", description: "Não foi possível atualizar a categoria.", variant: "destructive" });
    }
  };

  const getCategoryFromKey = (key: string) => {
    const parts = key.split('__');
    if (parts.length >= 3 && parts[0] === 'gallery') {
      return parts[1];
    }
    return "todas";
  };

  const filteredImages = images.filter((img) => 
    filterCategory === "todas" ? true : getCategoryFromKey(img.key) === filterCategory
  );

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-3xl font-bold text-foreground">Galeria de Fotos</h1>

      <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 mb-4 text-foreground font-semibold">
          <ImagePlus className="w-5 h-5 text-primary" />
          <h2>Adicionar Fotos</h2>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <Input 
            value={uploadLabel} 
            onChange={(e) => setUploadLabel(e.target.value)} 
            placeholder="Legenda (opcional)" 
            className="flex-1 bg-background"
          />
          <div className="w-full md:w-64">
            <Select value={uploadCategory} onValueChange={setUploadCategory}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map(cat => (
                  <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 w-full flex items-center gap-2 border bg-background rounded-lg overflow-hidden relative cursor-pointer" onClick={() => fileInputRef.current?.click()}>
             <input 
              ref={fileInputRef} 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange} 
              className="absolute inset-0 opacity-0 cursor-pointer hidden" 
            />
             <div className="bg-muted px-4 py-2 border-r text-sm whitespace-nowrap cursor-pointer hover:bg-muted/80">Escolher arquivos</div>
             <div className="text-sm text-muted-foreground truncate ml-2">
                 {selectedFile ? selectedFile.name : "Nenhum arquivo escolhido"}
             </div>
          </div>
          {previewUrl && (
            <img src={previewUrl} alt="Preview" className="h-10 w-16 object-cover rounded" />
          )}
          <Button onClick={handleUpload} disabled={isUploading || !selectedFile} className="w-full md:w-auto">
            {isUploading ? "Enviando..." : "Adicionar Foto"}
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <span className="text-sm font-medium">Filtrar por categoria:</span>
        <div className="w-48">
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="bg-card">
              <SelectValue placeholder="Todas as categorias" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map(cat => (
                <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Carregando fotos...</div>
      ) : images.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">Nenhuma foto encontrada na galeria.</div>
      ) : filteredImages.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">Nenhuma foto para esta categoria.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredImages.map((img) => {
            const cat = getCategoryFromKey(img.key);
            
            return (
              <div key={img.id} className="bg-card rounded-xl border overflow-hidden flex flex-col group">
                <div className="relative aspect-[4/3] overflow-hidden">
                  {img.image_url ? (
                    <img src={img.image_url} alt={img.label} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <Images className="w-12 h-12 text-muted-foreground/30" />
                    </div>
                  )}
                  {img.label && (
                    <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/60 to-transparent p-2 text-white text-xs truncate">
                      {img.label}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button variant="destructive" size="icon" onClick={() => handleDelete(img)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="p-2 border-t bg-muted/30">
                  <Select value={cat} onValueChange={(val) => handleChangeCategory(img, val)}>
                    <SelectTrigger className="h-8 text-xs border-0 bg-transparent shadow-none focus:ring-0">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map(c => (
                        <SelectItem key={c.value} value={c.value} className="text-xs">{c.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminGallery;
