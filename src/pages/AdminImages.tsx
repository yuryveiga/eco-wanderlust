import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { fetchLovable, insertLovable, updateLovable, deleteLovable, uploadLovableFile, LovableSiteImage } from "@/integrations/lovable/client";
import { Trash2, Upload, Image as ImageIcon, Loader2 } from "lucide-react";
import { DeleteConfirmDialog } from "@/components/admin/DeleteConfirmDialog";


const PRESET_KEYS = [
  { key: "logo", label: "Logo do Site" },
  { key: "hero_bg", label: "Fundo do Hero Principal" },
  { key: "hero_bg_2", label: "Fundo do Hero (Opção 2)" },
  { key: "hero_bg_3", label: "Fundo do Hero (Opção 3)" },
  { key: "about_1", label: "Sobre a Eco-Wanderlust - Imagem 1" },
  { key: "about_2", label: "Sobre a Eco-Wanderlust - Imagem 2" },
  { key: "about_3", label: "Sobre a Eco-Wanderlust - Imagem 3" },
  { key: "about_4", label: "Sobre a Eco-Wanderlust - Imagem 4" },
];

const AdminImages = () => {
  const [images, setImages] = useState<LovableSiteImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  
  const { toast } = useToast();

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    setIsLoading(true);
    const data = await fetchLovable<LovableSiteImage>("site_images");
    setImages(data);
    setIsLoading(false);
  };

  const handleUpload = async (key: string, label: string, file: File) => {
    setUploadingKey(key);
    try {
      const publicUrl = await uploadLovableFile(file);
      if (!publicUrl) throw new Error("Falha no upload");

      const existingImage = images.find(img => img.key === key);
      
      const dataToSave = {
        key,
        label,
        image_url: publicUrl
      };

      if (existingImage && existingImage.id) {
        await updateLovable("site_images", existingImage.id, dataToSave);
      } else {
        await insertLovable("site_images", dataToSave as LovableSiteImage);
      }

      toast({ title: "Imagem atualizada no site!" });
      await loadImages();
    } catch (e) {
      toast({ title: "Erro", description: "Não foi possível enviar a imagem.", variant: "destructive" });
    } finally {
      setUploadingKey(null);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteLovable("site_images", id);
    toast({ title: "Imagem removida" });
    setItemToDelete(null);
    await loadImages();
  };


  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-foreground">Imagens Estruturais do Site</h1>
        <p className="text-muted-foreground font-sans text-sm mt-1">
          Edite as fotos principais usadas na estrutura do site (Logo, Banners, Fundo, etc).
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground font-sans flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin" /> Carregando layout...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PRESET_KEYS.map((preset) => {
            const existingImage = images.find((i) => i.key === preset.key);
            
            return (
              <ImageCard 
                key={preset.key} 
                preset={preset} 
                img={existingImage} 
                isUploading={uploadingKey === preset.key}
                onUpload={(file) => handleUpload(preset.key, preset.label, file)}
                onDelete={() => existingImage?.id && setItemToDelete(existingImage.id)}
              />
            );
          })}
        </div>
      )}

      <DeleteConfirmDialog 
        open={!!itemToDelete} 
        onOpenChange={(open) => !open && setItemToDelete(null)} 
        onConfirm={() => itemToDelete && handleDelete(itemToDelete)}
        title="Remover Imagem Estrutural"
        description="Tem certeza que deseja remover esta imagem? Isso pode impactar o design visual do site até que uma nova imagem seja definida."
      />
    </div>
  );
};

// Subcomponent para gerenciar o input invisível localmente sem encher a tela de Refs
const ImageCard = ({ 
  preset, 
  img, 
  isUploading, 
  onUpload, 
  onDelete 
}: { 
  preset: typeof PRESET_KEYS[0], 
  img: LovableSiteImage | undefined, 
  isUploading: boolean, 
  onUpload: (file: File) => void,
  onDelete: () => void 
}) => {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
    }
    // reset input
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="bg-card rounded-xl border overflow-hidden shadow-sm flex flex-col">
      <div className="p-4 border-b bg-muted/20">
        <h3 className="font-semibold font-sans">{preset.label}</h3>
        <p className="text-xs text-muted-foreground">Chave: {preset.key}</p>
      </div>
      <div className="relative aspect-video overflow-hidden bg-muted/30">
        {isUploading ? (
           <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-10">
             <Loader2 className="w-8 h-8 text-primary animate-spin mb-2" />
             <p className="text-xs font-medium">Enviando...</p>
           </div>
        ) : img?.image_url ? (
          <img src={img.image_url} alt={preset.label} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
            <ImageIcon className="w-10 h-10 mb-2 opacity-20" />
            <span className="text-xs font-medium opacity-50">Nenhuma imagem definida</span>
          </div>
        )}
      </div>
      <div className="p-4 flex gap-2">
        <input 
          ref={fileRef}
          type="file" 
          accept="image/*" 
          onChange={handleFile} 
          className="hidden" 
        />
        <Button 
          variant={img?.image_url ? "outline" : "default"} 
          className="flex-1 font-sans text-xs" 
          onClick={() => fileRef.current?.click()}
          disabled={isUploading}
        >
          <Upload className="w-3 h-3 mr-2" />
          {img?.image_url ? "Alterar Imagem" : "Adicionar Imagem"}
        </Button>

        {img?.image_url && (
          <Button variant="ghost" size="icon" onClick={onDelete} title="Remover" className="text-destructive hover:text-destructive hover:bg-destructive/10">
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default AdminImages;
