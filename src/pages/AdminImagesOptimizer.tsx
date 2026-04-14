import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { fetchLovable, updateLovable, uploadLovableFile, LovableTour, LovableSiteImage } from "@/integrations/lovable/client";
import { Loader2, Zap, CheckCircle, AlertTriangle, Image as ImageIcon, Search } from "lucide-react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

const AdminImagesOptimizer = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [results, setResults] = useState<{
    id: string;
    type: 'tour' | 'site_image';
    field: string;
    url: string;
    itemTitle: string;
    status: 'pending' | 'success' | 'error';
    originalIndex?: number; // for arrays like images_json
  }[]>([]);
  const [progress, setProgress] = useState(0);

  const scanImages = async () => {
    setIsScanning(true);
    setResults([]);
    try {
      const [tours, siteImages] = await Promise.all([
        fetchLovable<LovableTour>("tours"),
        fetchLovable<LovableSiteImage>("site_images")
      ]);

      const found: typeof results = [];

      // Scan Site Images
      siteImages.forEach(img => {
        if (img.image_url && img.image_url.includes("supabase.co") && !img.image_url.toLowerCase().endsWith(".webp")) {
          found.push({ id: img.id, type: 'site_image', field: 'image_url', url: img.image_url, itemTitle: img.label || img.key, status: 'pending' });
        }
      });

      // Scan Tours
      tours.forEach(tour => {
        // Main Image
        if (tour.image_url && tour.image_url.includes("supabase.co") && !tour.image_url.toLowerCase().endsWith(".webp")) {
          found.push({ id: tour.id, type: 'tour', field: 'image_url', url: tour.image_url, itemTitle: tour.title, status: 'pending' });
        }
        // Gallery (images_json)
        if (tour.images_json && Array.isArray(tour.images_json)) {
          tour.images_json.forEach((url, idx) => {
            if (url && url.includes("supabase.co") && !url.toLowerCase().endsWith(".webp")) {
              found.push({ id: tour.id, type: 'tour', field: 'images_json', url, itemTitle: `${tour.title} (Galeria ${idx + 1})`, status: 'pending', originalIndex: idx });
            }
          });
        }
        // Carousel
        if (tour.carousel_images_json && Array.isArray(tour.carousel_images_json)) {
          tour.carousel_images_json.forEach((url, idx) => {
            if (url && url.includes("supabase.co") && !url.toLowerCase().endsWith(".webp")) {
              found.push({ id: tour.id, type: 'tour', field: 'carousel_images_json', url, itemTitle: `${tour.title} (Carrossel ${idx + 1})`, status: 'pending', originalIndex: idx });
            }
          });
        }
      });

      setResults(found);
      if (found.length === 0) {
        toast.info("Nenhuma imagem pendente de otimização encontrada.");
      } else {
        toast.success(`Encontradas ${found.length} imagens para otimizar.`);
      }
    } catch (error) {
      toast.error("Erro ao escanear imagens.");
      console.error(error);
    } finally {
      setIsScanning(false);
    }
  };

  const optimizeAll = async () => {
    if (results.length === 0) return;
    setIsOptimizing(true);
    setProgress(0);

    let completed = 0;
    const total = results.length;

    for (let i = 0; i < results.length; i++) {
      const item = results[i];
      try {
        // 1. Fetch image as Blob
        const response = await fetch(item.url);
        const blob = await response.blob();
        const file = new File([blob], "image_to_optimize.jpg", { type: blob.type });

        // 2. Upload (it will be automatically compressed by our new uploadLovableFile logic)
        const newUrl = await uploadLovableFile(file);
        if (!newUrl) throw new Error("Upload failed");

        // 3. Update Database
        if (item.type === 'site_image') {
          await updateLovable("site_images", item.id, { image_url: newUrl });
        } else {
          // Fetch current tour to get the array if needed
          const [currentTour] = await fetchLovable<LovableTour>("tours"); // This is just a dummy fetch, we need to be careful
          // To be safe, we should fetch by ID, but fetchLovable doesn't support it easily.
          // Let's use a workaround or assume we have the data.
          
          if (item.field === 'image_url') {
            await updateLovable("tours", item.id, { image_url: newUrl });
          } else {
             // For arrays, we need to be more precise. 
             // Let's re-fetch the tour to ensure we have the latest arrays.
             const allTours = await fetchLovable<LovableTour>("tours");
             const tour = allTours.find(t => t.id === item.id);
             if (tour) {
               if (item.field === 'images_json' && tour.images_json) {
                 const newArray = [...tour.images_json];
                 if (item.originalIndex !== undefined) newArray[item.originalIndex] = newUrl;
                 await updateLovable("tours", item.id, { images_json: newArray });
               } else if (item.field === 'carousel_images_json' && tour.carousel_images_json) {
                 const newArray = [...tour.carousel_images_json];
                 if (item.originalIndex !== undefined) newArray[item.originalIndex] = newUrl;
                 await updateLovable("tours", item.id, { carousel_images_json: newArray });
               }
             }
          }
        }

        setResults(prev => prev.map((r, idx) => idx === i ? { ...r, status: 'success' } : r));
      } catch (error) {
        console.error(`Error optimizing ${item.url}:`, error);
        setResults(prev => prev.map((r, idx) => idx === i ? { ...r, status: 'error' } : r));
      }
      completed++;
      setProgress((completed / total) * 100);
    }

    setIsOptimizing(false);
    toast.success("Otimização concluída!");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="bg-card rounded-3xl border border-border/50 p-8 shadow-xl">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <Zap className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-serif font-black text-foreground">Otimizador de Storage</h1>
            <p className="text-muted-foreground font-sans">
              Converta imagens antigas para WebP e reduza o peso do seu banco de dados.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button 
            variant="outline" 
            className="h-14 rounded-2xl border-dashed border-2 hover:bg-muted/50 transition-all font-bold" 
            onClick={scanImages}
            disabled={isScanning || isOptimizing}
          >
            {isScanning ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Search className="w-5 h-5 mr-2" />}
            Escanear Banco de Imagens
          </Button>
          <Button 
            className="h-14 rounded-2xl shadow-lg shadow-primary/20 font-black" 
            disabled={results.length === 0 || isOptimizing || isScanning}
            onClick={optimizeAll}
          >
            {isOptimizing ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Zap className="w-5 h-5 mr-2" />}
            Otimizar {results.length} Imagens Agora
          </Button>
        </div>

        {isOptimizing && (
          <div className="mt-8 space-y-2">
            <div className="flex justify-between text-xs font-black uppercase tracking-widest text-primary">
              <span>Processando...</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}
      </div>

      {results.length > 0 && (
        <div className="bg-card rounded-3xl border border-border/50 shadow-xl overflow-hidden">
          <div className="p-4 bg-muted/30 border-b flex justify-between items-center px-8">
            <h3 className="font-black uppercase tracking-tighter text-sm">Lista de Ativos Pendentes</h3>
            <span className="text-xs font-bold text-muted-foreground">{results.length} itens encontrados</span>
          </div>
          <div className="divide-y max-h-[500px] overflow-auto">
            {results.map((item, idx) => (
              <div key={idx} className="p-4 px-8 flex items-center justify-between hover:bg-muted/10 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                    <img src={item.url} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground leading-none mb-1">{item.itemTitle}</h4>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">{item.field} · {item.type}</p>
                  </div>
                </div>
                <div>
                  {item.status === 'pending' && <div className="w-2 h-2 rounded-full bg-yellow-400" />}
                  {item.status === 'success' && <CheckCircle className="w-5 h-5 text-green-500" />}
                  {item.status === 'error' && <AlertTriangle className="w-5 h-5 text-red-500" />}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {!isScanning && !isOptimizing && results.length === 0 && (
        <div className="text-center py-20 bg-muted/10 rounded-3xl border border-dashed border-border/50">
          <ImageIcon className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
          <p className="text-muted-foreground font-sans italic">Clique em escanear para começar a limpeza.</p>
        </div>
      )}
    </div>
  );
};

export default AdminImagesOptimizer;
