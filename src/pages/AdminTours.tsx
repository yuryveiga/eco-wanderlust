import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { fetchLovable, insertLovable, updateLovable, deleteLovable, uploadLovableFile, LovableTour } from "@/integrations/lovable/client";
import { Plus, Pencil, Trash2, Link as LinkIcon, Image as ImageIcon, Star, Trash, Upload, Sparkles, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { translateText } from "@/utils/translate";

const AdminTours = () => {
  const [tours, setTours] = useState<LovableTour[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<LovableTour> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadTours();
  }, []);

  const loadTours = async () => {
    const data = await fetchLovable<LovableTour>("tours");
    setTours(data);
    setIsLoading(false);
  };

  const handleSave = async () => {
    if (!editing?.title) {
      toast({ title: "Erro", description: "Título é obrigatório", variant: "destructive" });
      return;
    }

    const slug = editing.slug || editing.title.toLowerCase().replace(/\s+/g, '-');
    const dataToSave = { ...editing, slug };

    try {
      if (isNew) {
        await insertLovable("tours", dataToSave);
        toast({ title: "Passeio criado!" });
      } else if (editing.id) {
        await updateLovable("tours", editing.id, dataToSave);
        toast({ title: "Passeio atualizado!" });
      }

      await loadTours();
      setEditing(null);
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !editing) return;
    
    setIsUploading(true);
    try {
      const newImages = [...(editing.images_json || [])];
      for (const file of Array.from(files)) {
        const url = await uploadLovableFile(file);
        if (url) newImages.push(url);
      }
      
      const newImageUrl = editing.image_url || newImages[0];
      setEditing({ ...editing, images_json: newImages, image_url: newImageUrl });
      toast({ title: "Imagens carregadas com sucesso!" });
    } catch {
      toast({ title: "Erro", description: "Falha ao enviar." });
    } finally {
      setIsUploading(false);
    }
  };

  const setMainImage = (url: string) => {
    if (!editing) return;
    setEditing({ ...editing, image_url: url });
    toast({ title: "Imagem principal definida!" });
  };

  const removeImage = (index: number) => {
    if (!editing || !editing.images_json) return;
    const newImages = [...editing.images_json];
    const removed = newImages.splice(index, 1)[0];
    const newMain = editing.image_url === removed ? newImages[0] || "" : editing.image_url;
    setEditing({ ...editing, images_json: newImages, image_url: newMain });
  };

  const autoTranslate = async (targetLang: 'en' | 'es') => {
    if (!editing) return;
    if (!editing.title && !editing.category && !editing.short_description) {
      toast({ title: "Atenção", description: "Escreva algo em Português primeiro." });
      return;
    }

    setIsTranslating(true);
    toast({ title: "Mágica em andamento...", description: "Traduzindo passeio..." });

    try {
      const suffix = targetLang === 'en' ? '_en' : '_es';
      
      const [tTitle, tCat, tDesc] = await Promise.all([
        translateText(editing.title || "", targetLang),
        translateText(editing.category || "", targetLang),
        translateText(editing.short_description || "", targetLang)
      ]);

      setEditing({
        ...editing,
        [`title${suffix}` as any]: tTitle,
        [`category${suffix}` as any]: tCat,
        [`short_description${suffix}` as any]: tDesc
      });
      
      toast({ title: "Sucesso!", description: `Tradução para ${targetLang === 'en' ? 'Inglês' : 'Espanhol'} concluída.` });
    } catch (err) {
      toast({ title: "Erro na tradução", description: "Tente novamente.", variant: "destructive" });
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <h1 className="font-serif text-3xl font-bold text-foreground">Gerenciar Passeios</h1>
        <Button onClick={() => { setEditing({ title: "", price: 0, duration: "", max_group_size: 1, images_json: [], is_published: true }); setIsNew(true); }} className="font-sans">
          <Plus className="w-4 h-4 mr-2" />Novo Passeio
        </Button>
      </div>

      <div className="flex-1 overflow-auto pr-2 pb-8">
        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground font-sans uppercase tracking-[0.2em] animate-pulse">Carregando...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tours.map((tour) => (
              <div key={tour.id} className="bg-card rounded-2xl border border-border/50 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group">
                <div className="relative h-48 bg-muted">
                  {tour.image_url ? (
                    <img src={tour.image_url} alt={tour.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      <ImageIcon className="w-10 h-10 opacity-30" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="icon" variant="secondary" className="h-9 w-9 shadow-lg backdrop-blur-sm bg-white/90" onClick={() => { setEditing({ ...tour }); setIsNew(false); }}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="destructive" className="h-9 w-9 shadow-lg" onClick={() => handleDelete(tour.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-black font-sans text-primary shadow-sm uppercase tracking-widest">
                    {tour.category}
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-serif font-bold text-xl leading-tight mb-3 line-clamp-2">{tour.title}</h3>
                  <div className="mt-auto pt-4 flex items-center justify-between border-t border-border/50">
                    <span className="text-primary font-black font-sans text-lg">R$ {tour.price}</span>
                    <span className="text-xs text-muted-foreground font-sans font-medium uppercase tracking-wider">{tour.duration}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="max-w-5xl h-[90vh] flex flex-col p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="p-6 pb-0 border-b bg-muted/20 shrink-0">
            <DialogTitle className="font-serif text-2xl mb-4">{isNew ? "Criar Experiência Premium" : "Ajustar Detalhes do Passeio"}</DialogTitle>
            <Tabs defaultValue="content" className="w-full">
              <TabsList className="w-full justify-start gap-4 bg-transparent border-none p-0 mb-[-1px]">
                <TabsTrigger value="content" className="data-[state=active]:bg-background data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6 py-3 font-bold font-sans">Conteúdo e Tradução</TabsTrigger>
                <TabsTrigger value="gallery" className="data-[state=active]:bg-background data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6 py-3 font-bold font-sans">Imagens e Grid 📸</TabsTrigger>
                <TabsTrigger value="settings" className="data-[state=active]:bg-background data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6 py-3 font-bold font-sans">Preços e Config</TabsTrigger>
              </TabsList>
          </DialogHeader>

          {editing && (
            <div className="flex-1 overflow-hidden flex flex-col">
              <Tabs defaultValue="content" className="flex-1 flex flex-col">
                <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
                  <TabsContent value="content" className="m-0 space-y-6">
                    <Tabs defaultValue="pt" className="w-full">
                      <TabsList className="mb-4 bg-muted/40 p-1 rounded-xl">
                        <TabsTrigger value="pt" className="rounded-lg px-4 py-2 font-bold font-sans">PORTUGUÊS (Base)</TabsTrigger>
                        <TabsTrigger value="en" className="rounded-lg px-4 py-2 font-bold font-sans text-blue-600">INGLÊS (EN)</TabsTrigger>
                        <TabsTrigger value="es" className="rounded-lg px-4 py-2 font-bold font-sans text-red-600">ESPANHOL (ES)</TabsTrigger>
                      </TabsList>

                      <TabsContent value="pt" className="space-y-4 m-0">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="font-sans font-bold text-xs uppercase tracking-widest text-muted-foreground">Título do Passeio</Label>
                            <Input value={editing.title ?? ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} required className="font-serif text-lg h-12" />
                          </div>
                          <div className="space-y-2">
                            <Label className="font-sans font-bold text-xs uppercase tracking-widest text-muted-foreground">Categoria</Label>
                            <Input value={editing.category ?? ""} onChange={(e) => setEditing({ ...editing, category: e.target.value })} placeholder="ex: AVENTURA" className="h-12 font-sans font-bold uppercase tracking-wider" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="font-sans font-bold text-xs uppercase tracking-widest text-muted-foreground">Resumo / Descrição Curta</Label>
                          <textarea 
                            className="w-full min-h-[120px] rounded-xl border border-input bg-background px-4 py-3 text-sm font-sans shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                            value={editing.short_description ?? ""} 
                            onChange={(e) => setEditing({ ...editing, short_description: e.target.value })}
                          />
                        </div>
                      </TabsContent>

                      <TabsContent value="en" className="space-y-4 m-0">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">Tradução para Inglês</p>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => autoTranslate('en')}
                            disabled={isTranslating}
                            className="bg-blue-50 text-blue-600 hover:bg-blue-100 font-black h-8 gap-1 rounded-full border border-blue-200"
                          >
                            {isTranslating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                            TRADUZIR COM IA 🪄
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="font-sans text-xs font-bold text-muted-foreground">Title (EN)</Label>
                            <Input value={editing.title_en ?? ""} onChange={(e) => setEditing({ ...editing, title_en: e.target.value })} className="font-serif text-lg h-12 border-blue-100" />
                          </div>
                          <div className="space-y-2">
                            <Label className="font-sans text-xs font-bold text-muted-foreground">Category (EN)</Label>
                            <Input value={editing.category_en ?? ""} onChange={(e) => setEditing({ ...editing, category_en: e.target.value })} className="h-12 border-blue-100" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="font-sans text-xs font-bold text-muted-foreground">Short Description (EN)</Label>
                          <textarea 
                            className="w-full min-h-[120px] rounded-xl border border-blue-100 bg-background px-4 py-3 text-sm font-sans"
                            value={editing.short_description_en ?? ""} 
                            onChange={(e) => setEditing({ ...editing, short_description_en: e.target.value })}
                          />
                        </div>
                      </TabsContent>

                      <TabsContent value="es" className="space-y-4 m-0">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-red-600 uppercase tracking-widest">Traducción al Español</p>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => autoTranslate('es')}
                            disabled={isTranslating}
                            className="bg-red-50 text-red-600 hover:bg-red-100 font-black h-8 gap-1 rounded-full border border-red-200"
                          >
                            {isTranslating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                            TRADUCIR CON IA 🪄
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="font-sans text-xs font-bold text-muted-foreground">Título (ES)</Label>
                            <Input value={editing.title_es ?? ""} onChange={(e) => setEditing({ ...editing, title_es: e.target.value })} className="font-serif text-lg h-12 border-red-100" />
                          </div>
                          <div className="space-y-2">
                            <Label className="font-sans text-xs font-bold text-muted-foreground">Categoría (ES)</Label>
                            <Input value={editing.category_es ?? ""} onChange={(e) => setEditing({ ...editing, category_es: e.target.value })} className="h-12 border-red-100" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="font-sans text-xs font-bold text-muted-foreground">Descripción Corta (ES)</Label>
                          <textarea 
                            className="w-full min-h-[120px] rounded-xl border border-red-100 bg-background px-4 py-3 text-sm font-sans"
                            value={editing.short_description_es ?? ""} 
                            onChange={(e) => setEditing({ ...editing, short_description_es: e.target.value })}
                          />
                        </div>
                      </TabsContent>
                    </Tabs>
                  </TabsContent>

                  <TabsContent value="gallery" className="m-0 space-y-6">
                    <div className="p-6 border-2 border-dashed rounded-3xl bg-muted/10 flex flex-col items-center justify-center gap-4 transition-colors hover:bg-muted/20 text-center">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <Upload className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground">Carregar fotos para o Passeio</h4>
                        <p className="text-xs text-muted-foreground mt-1 underline cursor-pointer">Arraste ou clique para selecionar arquivos</p>
                        <Input type="file" multiple accept="image/*" onChange={handleFileUpload} className="hidden" id="tour-files-upload" disabled={isUploading} />
                        <Label htmlFor="tour-files-upload" className="absolute inset-0 cursor-pointer opacity-0" />
                      </div>
                    </div>
                    {isUploading && <p className="text-center text-sm animate-pulse text-primary font-bold">Enviando imagens...</p>}
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6">
                      {editing.images_json?.map((url, index) => (
                        <div key={index} className={`relative aspect-square rounded-2xl overflow-hidden shadow-sm group border-2 ${editing.image_url === url ? "border-primary" : "border-transparent"}`}>
                          <img src={url} alt={`Gallery ${index}`} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <Button size="icon" variant="ghost" className="text-white hover:bg-white/20" onClick={() => setMainImage(url)}>
                              <Star className={`w-5 h-5 ${editing.image_url === url ? "fill-primary text-primary" : ""}`} />
                            </Button>
                            <Button size="icon" variant="ghost" className="text-white hover:bg-red-500" onClick={() => removeImage(index)}>
                              <Trash className="w-5 h-5" />
                            </Button>
                          </div>
                          {editing.image_url === url && (
                            <div className="absolute top-2 left-2 bg-primary text-white px-2 py-0.5 rounded-full text-[8px] font-black uppercase shadow-lg">CAPA</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="settings" className="m-0 space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label className="font-sans font-bold">Preço Unitário (R$)</Label>
                        <Input type="number" value={editing.price ?? 0} onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })} className="h-12 font-sans font-black text-lg" />
                      </div>
                      <div className="space-y-2">
                        <Label className="font-sans font-bold">Duração (Texto)</Label>
                        <Input value={editing.duration ?? ""} onChange={(e) => setEditing({ ...editing, duration: e.target.value })} placeholder="ex: 4 horas" className="h-12" />
                      </div>
                      <div className="space-y-2">
                        <Label className="font-sans font-bold">Grupo Máximo</Label>
                        <Input type="number" value={editing.max_group_size ?? 1} onChange={(e) => setEditing({ ...editing, max_group_size: Number(e.target.value) })} className="h-12" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                      <div className="flex items-center gap-3 bg-muted/20 p-4 rounded-2xl border">
                        <Switch checked={editing.is_published ?? true} onCheckedChange={(v) => setEditing({ ...editing, is_published: v })} />
                        <div>
                          <Label className="font-bold block">Publicado</Label>
                          <p className="text-[10px] text-muted-foreground">Visível para clientes</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 bg-muted/20 p-4 rounded-2xl border">
                        <Switch checked={editing.allows_private ?? false} onCheckedChange={(v) => setEditing({ ...editing, allows_private: v })} />
                        <div>
                          <Label className="font-bold block">Permite Privado</Label>
                          <p className="text-[10px] text-muted-foreground">Habilitar opção VIP</p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
              
              <div className="p-6 border-t bg-muted/10 shrink-0 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setEditing(null)} className="font-sans px-8 h-12 rounded-xl">Cancelar</Button>
                <Button onClick={handleSave} className="font-sans px-12 h-12 bg-primary hover:bg-primary/90 text-white shadow-xl rounded-xl font-black">
                  {isNew ? "Publicar Experiência" : "Salvar Alterações"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminTours;
