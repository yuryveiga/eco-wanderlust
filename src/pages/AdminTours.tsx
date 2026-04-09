import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { fetchLovable, insertLovable, updateLovable, deleteLovable, uploadLovableFile, LovableTour, fetchLovable as fetchSiteImages, LovableSiteImage } from "@/integrations/lovable/client";
import { Plus, Pencil, Trash2, Image as ImageIcon, Star, Trash, Upload, Sparkles, Loader2, List, Info, HelpCircle, MapPin, Youtube } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { translateText } from "@/utils/translate";
import { Sunrise, Sun, Moon } from "lucide-react";

const AdminTours = () => {
  const [tours, setTours] = useState<LovableTour[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<LovableTour> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isTranslatingAll, setIsTranslatingAll] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'CITY TOUR' | 'TRILHA'>('all');
  const [galleryImages, setGalleryImages] = useState<LovableSiteImage[]>([]);
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
    
    // Ensure category is included
    const dataToSave = {
      ...editing,
      slug,
      category: editing.category || 'CITY TOUR'
    };

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
      
      const [tTitle, tCat, tDesc, tDif, tAddr] = await Promise.all([
        translateText(editing.title || "", targetLang),
        translateText(editing.category || "", targetLang),
        translateText(editing.short_description || "", targetLang),
        translateText(editing.difficulty || "", targetLang),
        translateText(editing.meeting_point_address || "", targetLang)
      ]);

      const translateJsonArray = async (arr: any[], fields: string[]): Promise<any[]> => {
        if (!arr || !Array.isArray(arr)) return arr;
        const translated = await Promise.all(arr.map(async (item) => {
          const newItem: any = { ...item };
          for (const field of fields) {
            if (item[field]) {
              newItem[field] = await translateText(item[field], targetLang);
            }
          }
          return newItem;
        }));
        return translated;
      };

      const [tItinerary, tIncluded, tHighlights, tFaq] = await Promise.all([
        translateJsonArray(editing.itinerary_json || [], ['time', 'description']),
        translateJsonArray(editing.included_json || [], ['text']),
        translateJsonArray(editing.highlights_json || [], ['text']),
        translateJsonArray(editing.faq_json || [], ['q', 'a']),
      ]);

      setEditing({
        ...editing,
        [`title${suffix}`]: tTitle,
        [`category${suffix}`]: tCat,
        [`short_description${suffix}`]: tDesc,
        [`difficulty${suffix}`]: tDif,
        [`meeting_point_address${suffix}`]: tAddr,
        [`itinerary_json${suffix}`]: tItinerary,
        [`included_json${suffix}`]: tIncluded,
        [`highlights_json${suffix}`]: tHighlights,
        [`faq_json${suffix}`]: tFaq,
      });
      
      toast({ title: "Sucesso!", description: `Tradução para ${targetLang === 'en' ? 'Inglês' : 'Espanhol'} concluída.` });
    } catch (err) {
      toast({ title: "Erro na tradução", description: "Tente novamente.", variant: "destructive" });
    } finally {
      setIsTranslating(false);
    }
  };

  const updateJsonField = (field: keyof LovableTour, index: number, subField: string, value: any) => {
    if (!editing) return;
    const arr = [...((editing[field] as any[]) || [])];
    arr[index] = { ...arr[index], [subField]: value };
    setEditing({ ...editing, [field]: arr });
  };

  const addJsonItem = (field: keyof LovableTour, newItem: any) => {
    if (!editing) return;
    const arr = [...((editing[field] as any[]) || []), newItem];
    setEditing({ ...editing, [field]: arr });
  };

  const removeJsonItem = (field: keyof LovableTour, index: number) => {
    if (!editing) return;
    const arr = [...((editing[field] as any[]) || [])];
    arr.splice(index, 1);
    setEditing({ ...editing, [field]: arr });
  };

  return (
    <div className="flex flex-col h-full overflow-hidden font-sans">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <h1 className="font-serif text-3xl font-bold text-foreground">Gerenciar Passeios</h1>
        <Button onClick={() => { setEditing({ title: "", price: 0, duration: "", max_group_size: 1, images_json: [], is_active: true, itinerary_json: [], included_json: [], highlights_json: [], faq_json: [], difficulty: "Leve", youtube_video_url: "", category: "CITY TOUR" }); setIsNew(true); }} className="font-sans">
          <Plus className="w-4 h-4 mr-2" />Novo Passeio
        </Button>
        <Button 
          variant="outline" 
          onClick={async () => {
            if (!confirm("Traduzir TODOS os passeios para inglês e espanhol?")) return;
            setIsTranslatingAll(true);
            let translated = 0;
            for (const tour of tours) {
              try {
                const [titleEn, titleEs, descEn, descEs, diffEn, diffEs] = await Promise.all([
                  translateText(tour.title || "", "en"),
                  translateText(tour.title || "", "es"),
                  translateText(tour.short_description || "", "en"),
                  translateText(tour.short_description || "", "es"),
                  translateText(tour.difficulty || "", "en"),
                  translateText(tour.difficulty || "", "es"),
                ]);

                const translateJsonField = async (json: any[], lang: 'en' | 'es'): Promise<any[]> => {
                  if (!json || !Array.isArray(json)) return json;
                  const translated = await Promise.all(json.map(async (item) => {
                    if (item.text) {
                      const translatedText = await translateText(item.text, lang);
                      return { ...item, text: translatedText };
                    }
                    if (item.description) {
                      const translatedDesc = await translateText(item.description, lang);
                      return { ...item, description: translatedDesc };
                    }
                    if (item.q && item.a) {
                      const translatedQ = await translateText(item.q, lang);
                      const translatedA = await translateText(item.a, lang);
                      return { q: translatedQ, a: translatedA };
                    }
                    if (item.time && item.description) {
                      const translatedTime = await translateText(item.time, lang);
                      const translatedDesc = await translateText(item.description, lang);
                      return { time: translatedTime, description: translatedDesc };
                    }
                    return item;
                  }));
                  return translated;
                };

                const [itineraryEn, itineraryEs, includedEn, includedEs, highlightsEn, highlightsEs, faqEn, faqEs] = await Promise.all([
                  translateJsonField(tour.itinerary_json, "en"),
                  translateJsonField(tour.itinerary_json, "es"),
                  translateJsonField(tour.included_json, "en"),
                  translateJsonField(tour.included_json, "es"),
                  translateJsonField(tour.highlights_json, "en"),
                  translateJsonField(tour.highlights_json, "es"),
                  translateJsonField(tour.faq_json, "en"),
                  translateJsonField(tour.faq_json, "es"),
                ]);

                await updateLovable("tours", tour.id, {
                  title_en: titleEn,
                  title_es: titleEs,
                  short_description_en: descEn,
                  short_description_es: descEs,
                  difficulty_en: diffEn,
                  difficulty_es: diffEs,
                  itinerary_json_en: itineraryEn,
                  itinerary_json_es: itineraryEs,
                  included_json_en: includedEn,
                  included_json_es: includedEs,
                  highlights_json_en: highlightsEn,
                  highlights_json_es: highlightsEs,
                  faq_json_en: faqEn,
                  faq_json_es: faqEs,
                });
                translated++;
              } catch (e) {
                console.error("Error translating tour:", tour.id, e);
              }
            }
            setIsTranslatingAll(false);
            toast({ title: `${translated} passeios traduzidos!` });
            loadTours();
          }}
          disabled={isTranslatingAll}
          className="font-sans"
        >
          {isTranslatingAll ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
          Traduzir Todos
        </Button>
      </div>

      <div className="flex gap-2 mb-6 shrink-0">
        <Button
          variant={categoryFilter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setCategoryFilter('all')}
          className="rounded-full font-sans"
        >
          Todos
        </Button>
        <Button
          variant={categoryFilter === 'CITY TOUR' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setCategoryFilter('CITY TOUR')}
          className="rounded-full font-sans"
        >
          City Tour
        </Button>
        <Button
          variant={categoryFilter === 'TRILHA' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setCategoryFilter('TRILHA')}
          className="rounded-full font-sans"
        >
          Trilha
        </Button>
      </div>

      <div className="flex-1 overflow-auto pr-2 pb-8">
        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground font-sans uppercase tracking-[0.2em] animate-pulse">Carregando...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tours
              .filter(tour => categoryFilter === 'all' || tour.category === categoryFilter)
              .map((tour) => (
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
                    <Button size="icon" variant="secondary" className="h-9 w-9 shadow-lg backdrop-blur-sm bg-white/90" onClick={() => { 
                      const tourWithCategory = {
                        ...tour, 
                        category: tour.category?.toUpperCase() || 'CITY TOUR'
                      };
                      setEditing(tourWithCategory); 
                      setIsNew(false); 
                      // Load gallery images
                      fetchSiteImages<LovableSiteImage>("site_images").then(imgs => {
                        setGalleryImages(imgs.filter(i => i.key?.startsWith('gallery')));
                      });
                    }}>
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
                    <div className="flex flex-col">
                      <span className="text-primary font-black font-sans text-lg">R$ {tour.price}</span>
                      {!tour.is_active && <span className="text-[10px] text-red-500 font-bold uppercase tracking-tighter">Inativo</span>}
                    </div>
                    <span className="text-xs text-muted-foreground font-sans font-medium uppercase tracking-wider">{tour.duration}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="max-w-6xl h-[95vh] flex flex-col p-0 overflow-hidden border-none shadow-2xl font-sans">
          {editing && (
            <Tabs defaultValue="content" className="flex-1 flex flex-col h-full overflow-hidden">
              <DialogHeader className="p-6 pb-0 border-b bg-muted/20 shrink-0">
                <DialogTitle className="font-serif text-2xl mb-4">{isNew ? "Criar Experiência Premium" : "Ajustar Detalhes do Passeio"}</DialogTitle>
                <TabsList className="w-full justify-start gap-4 bg-transparent border-none p-0 mb-[-1px] overflow-x-auto">
                  <TabsTrigger value="content" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6 py-3 font-bold">Conteúdo Base</TabsTrigger>
                  <TabsTrigger value="info" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6 py-3 font-bold">Informações do Passeio</TabsTrigger>
                  <TabsTrigger value="gallery" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6 py-3 font-bold">Imagens</TabsTrigger>
                  <TabsTrigger value="settings" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6 py-3 font-bold">Preços e Config</TabsTrigger>
                </TabsList>
              </DialogHeader>

              <div className="flex-1 overflow-hidden flex flex-col">
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                  
                  {/* TAB CONTENT: BASIC INFO */}
                  <TabsContent value="content" className="m-0 space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                       <div className="lg:col-span-2 space-y-4">
                          <Label className="font-black text-xs uppercase tracking-widest text-primary">Textos Principais</Label>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label className="text-xs uppercase font-bold text-muted-foreground">Título (PT)</Label>
                              <Input value={editing.title ?? ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className="h-12 font-serif text-lg" />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-xs uppercase font-bold text-muted-foreground">Categoria</Label>
                              <div className="flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                  <input
                                    type="radio"
                                    name="category"
                                    checked={editing?.category === 'CITY TOUR'}
                                    onChange={() => setEditing({ ...editing, category: 'CITY TOUR' })}
                                    className="w-5 h-5 text-primary"
                                  />
                                  <span className="font-bold">CITY TOUR</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                  <input
                                    type="radio"
                                    name="category"
                                    checked={editing?.category === 'TRILHA'}
                                    onChange={() => setEditing({ ...editing, category: 'TRILHA' })}
                                    className="w-5 h-5 text-primary"
                                  />
                                  <span className="font-bold">TRILHA</span>
                                </label>
                              </div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs uppercase font-bold text-muted-foreground">Resumo (PT)</Label>
                            <textarea className="w-full min-h-[150px] rounded-xl border p-4 text-sm font-sans" value={editing.short_description ?? ""} onChange={(e) => setEditing({ ...editing, short_description: e.target.value })} />
                          </div>
                          <div className="space-y-2 bg-red-50/50 p-4 rounded-2xl border border-red-100">
                             <Label className="text-[10px] font-black uppercase tracking-widest text-[#E76F51] flex items-center gap-2">
                                <Youtube className="w-4 h-4" /> Link do Vídeo (YouTube)
                             </Label>
                             <Input 
                                value={editing.youtube_video_url ?? ""} 
                                onChange={(e) => setEditing({ ...editing, youtube_video_url: e.target.value })} 
                                placeholder="https://www.youtube.com/watch?v=..." 
                                className="h-10 border-red-200"
                             />
                             <p className="text-[10px] text-muted-foreground">Cole o link completo do vídeo que deseja exibir.</p>
                          </div>
                       </div>
                       
                       <div className="bg-muted/30 p-6 rounded-3xl border border-border/50 space-y-6">
                          <Label className="font-black text-xs uppercase tracking-widest text-blue-600 block mb-4">Traduções Instantâneas</Label>
                          <div className="space-y-4">
                             <Button onClick={() => autoTranslate('en')} disabled={isTranslating} variant="outline" className="w-full h-12 justify-between px-6 rounded-2xl border-blue-200 text-blue-600 font-bold">
                                <span>Traduzir para Inglês (EN)</span>
                                {isTranslating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                             </Button>
                             <Button onClick={() => autoTranslate('es')} disabled={isTranslating} variant="outline" className="w-full h-12 justify-between px-6 rounded-2xl border-red-200 text-red-600 font-bold">
                                <span>Traduzir para Espanhol (ES)</span>
                                {isTranslating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                             </Button>
                          </div>
                       </div>
                    </div>
                  </TabsContent>

                  {/* TAB INFO: ITINERARY, INCLUDED, FAQ, MAP */}
                  <TabsContent value="info" className="m-0 space-y-10 pb-10">
                     <div className="grid grid-cols-1 gap-6 bg-muted/20 p-6 rounded-3xl border">
                        <Label className="font-black text-xs uppercase tracking-widest text-primary flex items-center gap-2">
                           <MapPin className="w-4 h-4" /> Ponto de Encontro (Mapa)
                        </Label>
                        <div className="space-y-2">
                           <Label className="text-[10px] uppercase font-bold text-muted-foreground">Endereço Completo / Local</Label>
                           <Input 
                              value={editing.meeting_point_address ?? ""} 
                              onChange={(e) => setEditing({ ...editing, meeting_point_address: e.target.value })} 
                              placeholder="Rua Visconde de Pirajá, 123, Ipanema" 
                              className="h-12"
                           />
                           <p className="text-[10px] text-muted-foreground italic">Este endereço será usado para gerar o mapa do Google na página do passeio.</p>
                        </div>
                     </div>

                     <div className="space-y-4">
                        <div className="flex items-center justify-between border-b pb-2">
                           <Label className="font-black text-xs uppercase tracking-widest text-primary flex items-center gap-2">
                              <List className="w-4 h-4" /> Itinerário
                           </Label>
                           <Button size="sm" variant="ghost" onClick={() => addJsonItem('itinerary_json', { time: '08:00', description: '' })} className="font-bold text-xs h-8">+ Adicionar Etapa</Button>
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                           {(editing.itinerary_json as any[])?.map((step, i) => (
                             <div key={i} className="flex gap-4 items-start bg-muted/20 p-4 rounded-2xl border">
                                <div className="w-24 shrink-0"><Input value={step.time} onChange={(e) => updateJsonField('itinerary_json', i, 'time', e.target.value)} className="h-10" /></div>
                                <div className="flex-1"><Input value={step.description} onChange={(e) => updateJsonField('itinerary_json', i, 'description', e.target.value)} className="h-10" /></div>
                                <Button size="icon" variant="ghost" onClick={() => removeJsonItem('itinerary_json', i)}><Trash2 className="w-4 h-4" /></Button>
                             </div>
                           ))}
                        </div>
                     </div>

                     <div className="space-y-4">
                        <div className="flex items-center justify-between border-b pb-2">
                           <Label className="font-black text-xs uppercase tracking-widest text-primary flex items-center gap-2">
                              <Info className="w-4 h-4" /> O que está incluído?
                           </Label>
                           <Button size="sm" variant="ghost" onClick={() => addJsonItem('included_json', { icon: 'Check', text: '' })} className="font-bold text-xs h-8">+ Adicionar Item</Button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                           {(editing.included_json as any[])?.map((item, i) => (
                             <div key={i} className="flex gap-4 items-center bg-muted/20 p-4 rounded-2xl border">
                                <Input value={item.text} onChange={(e) => updateJsonField('included_json', i, 'text', e.target.value)} className="h-10" />
                                <Button size="icon" variant="ghost" onClick={() => removeJsonItem('included_json', i)}><Trash className="w-4 h-4" /></Button>
                             </div>
                           ))}
                         </div>
                      </div>

                      <div className="space-y-4">
                         <div className="flex items-center justify-between border-b pb-2">
                            <Label className="font-black text-xs uppercase tracking-widest text-primary flex items-center gap-2">
                               <Star className="w-4 h-4" /> Highlights (Destaques)
                            </Label>
                            <Button size="sm" variant="ghost" onClick={() => addJsonItem('highlights_json', { icon: 'Check', text: '' })} className="font-bold text-xs h-8">+ Adicionar</Button>
                         </div>
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {(editing.highlights_json as any[])?.map((item, i) => (
                              <div key={i} className="flex gap-4 items-center bg-muted/20 p-4 rounded-2xl border">
                                 <Input value={item.text} onChange={(e) => updateJsonField('highlights_json', i, 'text', e.target.value)} placeholder="Destaque..." className="h-10" />
                                 <Button size="icon" variant="ghost" onClick={() => removeJsonItem('highlights_json', i)}><Trash className="w-4 h-4" /></Button>
                              </div>
                            ))}
                         </div>
                      </div>

                      <div className="space-y-4">
                         <div className="flex items-center justify-between border-b pb-2">
                            <Label className="font-black text-xs uppercase tracking-widest text-primary flex items-center gap-2">
                               <HelpCircle className="w-4 h-4" /> Para seu conhecimento (FAQ)
                           </Label>
                           <Button size="sm" variant="ghost" onClick={() => addJsonItem('faq_json', { q: '', a: '' })} className="font-bold text-xs h-8">+ Nova Pergunta</Button>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                           {(editing.faq_json as any[])?.map((item, i) => (
                             <div key={i} className="bg-muted/10 p-5 rounded-3xl border space-y-4">
                                <Input value={item.q} onChange={(e) => updateJsonField('faq_json', i, 'q', e.target.value)} placeholder="Pergunta..." className="font-bold border-none bg-transparent" />
                                <textarea className="w-full text-sm text-muted-foreground bg-transparent border-none p-0 min-h-[60px]" value={item.a} onChange={(e) => updateJsonField('faq_json', i, 'a', e.target.value)} placeholder="Resposta..." />
                                <div className="flex justify-end"><Button variant="ghost" size="sm" className="text-red-500" onClick={() => removeJsonItem('faq_json', i)}>Excluir</Button></div>
                             </div>
                           ))}
                        </div>
                     </div>
                  </TabsContent>

                  {/* TAB GALLERY */}
                  <TabsContent value="gallery" className="m-0 space-y-6">
                    <div className="p-12 border-4 border-dashed rounded-[40px] bg-muted/20 flex flex-col items-center justify-center gap-4 transition-all hover:bg-muted/30 text-center relative group">
                      <Upload className="w-10 h-10 text-primary" />
                      <div>
                        <h4 className="font-black text-xl">Galeria de Fotos</h4>
                        <p className="text-sm text-muted-foreground mt-2">Arraste fotos ou clique para carregar.</p>
                        <Input type="file" multiple accept="image/*" onChange={handleFileUpload} className="hidden" id="tour-files-upload" disabled={isUploading} />
                        <Label htmlFor="tour-files-upload" className="absolute inset-0 cursor-pointer opacity-0" />
                      </div>
                    </div>
                    
                    {/* Imagens da Galeria do Site */}
                    {galleryImages.length > 0 && (
                      <div className="border-t pt-6">
                        <h4 className="font-black text-lg mb-4">Escolher da Galeria do Site</h4>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                          {galleryImages.map((img) => (
                            <button
                              key={img.id}
                              onClick={() => {
                                if (!editing) return;
                                const currentImages = editing.images_json || [];
                                if (!currentImages.includes(img.image_url)) {
                                  setEditing({
                                    ...editing,
                                    images_json: [...currentImages, img.image_url],
                                    image_url: editing.image_url || img.image_url,
                                  });
                                  toast({ title: "Imagem adicionada!" });
                                }
                              }}
                              className="relative aspect-square rounded-xl overflow-hidden border-2 hover:border-primary transition-all"
                            >
                              <img src={img.image_url} alt={img.label} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-primary/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Plus className="w-6 h-6 text-white" />
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-8">
                      {editing.images_json?.map((url, index) => (
                        <div key={index} className={`relative aspect-square rounded-3xl overflow-hidden border-4 transition-all ${editing.image_url === url ? "border-primary" : "border-transparent"}`}>
                          <img src={url} alt={`Gallery ${index}`} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                            <Button size="icon" variant="ghost" className="text-white" onClick={() => setMainImage(url)}><Star className={`w-6 h-6 ${editing.image_url === url ? "fill-white" : ""}`} /></Button>
                            <Button size="icon" variant="ghost" className="text-white" onClick={() => removeImage(index)}><Trash2 className="w-6 h-6" /></Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  {/* TAB SETTINGS */}
                  <TabsContent value="settings" className="m-0 space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="space-y-3">
                        <Label className="font-black text-xs uppercase tracking-widest text-muted-foreground">Valor por Pessoa (R$)</Label>
                        <Input type="number" value={editing.price ?? 0} onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })} className="h-14 font-black text-2xl rounded-2xl" />
                      </div>
                      <div className="space-y-3">
                        <Label className="font-black text-xs uppercase tracking-widest text-muted-foreground">Tempo Estimado</Label>
                        <Input value={editing.duration ?? ""} onChange={(e) => setEditing({ ...editing, duration: e.target.value })} className="h-14 rounded-2xl" />
                      </div>
                      <div className="space-y-3">
                        <Label className="font-black text-xs uppercase tracking-widest text-muted-foreground">Nivel de Dificuldade</Label>
                        <Input value={editing.difficulty ?? ""} onChange={(e) => setEditing({ ...editing, difficulty: e.target.value })} placeholder="ex: Leve, Moderada..." className="h-14 rounded-2xl font-bold text-primary" />
                      </div>
                      <div className="space-y-3">
                        <Label className="font-black text-xs uppercase tracking-widest text-muted-foreground">Vagas do Grupo</Label>
                        <Input type="number" value={editing.max_group_size ?? 1} onChange={(e) => setEditing({ ...editing, max_group_size: Number(e.target.value) })} className="h-14 rounded-2xl" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-10 border-t">
                        <div className="bg-muted/30 p-6 rounded-3xl border flex items-center justify-between">
                            <Label className="font-bold">Ativo no Site</Label>
                            <Switch checked={editing.is_active ?? true} onCheckedChange={(v) => setEditing({ ...editing, is_active: v })} />
                        </div>
                        <div className="bg-muted/30 p-6 rounded-3xl border flex items-center justify-between">
                            <Label className="font-bold">Permitir Privado</Label>
                            <Switch checked={editing.allows_private ?? true} onCheckedChange={(v) => setEditing({ ...editing, allows_private: v })} />
                        </div>
                        <div className="bg-muted/30 p-6 rounded-3xl border flex items-center justify-between opacity-50">
                            <Label className="font-bold">Grupo Aberto (inativo)</Label>
                            <Switch checked={false} disabled />
                        </div>
                        <div className="bg-muted/30 p-6 rounded-3xl border flex items-center justify-between">
                            <Label className="font-bold">Destaque</Label>
                            <Switch checked={editing.is_featured ?? false} onCheckedChange={(v) => setEditing({ ...editing, is_featured: v })} />
                        </div>
                    </div>

                    <div className="space-y-6 pt-10 border-t pb-10">
                       <Label className="font-black text-xs uppercase tracking-widest text-primary block mb-6">Turnos</Label>
                       <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                          <div className="flex items-center justify-between bg-muted/40 p-4 rounded-2xl">
                             <div className="flex items-center gap-3"><Sunrise className="w-5" /><Label className="font-bold">Manhã</Label></div>
                             <Switch checked={editing.has_morning ?? true} onCheckedChange={(v) => setEditing({ ...editing, has_morning: v })} />
                          </div>
                          <div className="flex items-center justify-between bg-muted/40 p-4 rounded-2xl">
                             <div className="flex items-center gap-3"><Sun className="w-5" /><Label className="font-bold">Tarde</Label></div>
                             <Switch checked={editing.has_afternoon ?? false} onCheckedChange={(v) => setEditing({ ...editing, has_afternoon: v })} />
                          </div>
                          <div className="flex items-center justify-between bg-muted/40 p-4 rounded-2xl">
                             <div className="flex items-center gap-3"><Moon className="w-5" /><Label className="font-bold">Noite</Label></div>
                             <Switch checked={editing.has_night ?? false} onCheckedChange={(v) => setEditing({ ...editing, has_night: v })} />
                          </div>
                       </div>
                    </div>
                  </TabsContent>
                </div>
                
                <div className="p-6 border-t bg-muted/10 shrink-0 flex justify-end gap-4">
                  <Button type="button" variant="outline" onClick={() => setEditing(null)} className="px-10 h-14 rounded-2xl">Descartar</Button>
                  <Button onClick={handleSave} className="px-16 h-14 bg-primary text-white rounded-2xl font-black" disabled={isUploading}>
                    {isNew ? "Publicar" : "Salvar"}
                  </Button>
                </div>
              </div>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminTours;
