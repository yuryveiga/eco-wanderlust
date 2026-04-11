import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { fetchLovable, insertLovable, updateLovable, deleteLovable, uploadLovableFile, LovableTour, LovableSiteImage, LovableSiteSetting } from "@/integrations/lovable/client";
import { Plus, Pencil, Trash2, Image as ImageIcon, Star, Trash, Upload, Sparkles, Loader2, List, Info, HelpCircle, MapPin, Youtube, ExternalLink } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { translateText } from "@/utils/translate";
import { Sunrise, Sun, Moon } from "lucide-react";

type JsonFieldItem = {
  time?: string;
  description?: string;
  text?: string;
  q?: string;
  a?: string;
  icon?: string;
};

const AdminTours = () => {
  const [searchParams] = useSearchParams();
  const [tours, setTours] = useState<LovableTour[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<LovableTour> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isTranslatingAll, setIsTranslatingAll] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'CITY TOUR' | 'TRILHA'>('all');
  const [galleryImages, setGalleryImages] = useState<LovableSiteImage[]>([]);
  const [activeInfoLang, setActiveInfoLang] = useState<'pt' | 'en' | 'es'>('pt');
  const { toast } = useToast();

  useEffect(() => {
    loadTours();
  }, []);

  useEffect(() => {
    const tourId = searchParams.get('tour');
    if (tourId && tours.length > 0) {
      const tour = tours.find(t => t.id === tourId);
      if (tour) {
        setEditing(tour);
        setIsNew(false);
      }
    }
  }, [searchParams, tours]);

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

    setIsTranslating(true);
    toast({ title: "Salvando e Traduzindo...", description: "Isso pode levar alguns segundos." });

    try {
      const slug = editing.slug || editing.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      
      const translatedData = await translateTourData(editing);
      
      // Ensure category is included
      const dataToSave = {
        ...translatedData,
        slug,
        category: translatedData.category || 'CITY TOUR'
      };

      if (isNew) {
        await insertLovable("tours", dataToSave);
        toast({ title: "Passeio criado e traduzido!" });
      } else if (editing.id) {
        await updateLovable("tours", editing.id, dataToSave);
        toast({ title: "Passeio atualizado e traduzido!" });
      }

      await loadTours();
      setEditing(null);
    } catch {
      toast({ title: "Erro", description: "Erro ao salvar", variant: "destructive" });
    } finally {
      setIsTranslating(false);
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

  const translateTourData = async (data: Partial<LovableTour>): Promise<Partial<LovableTour>> => {
    if (!data.title && !data.category && !data.short_description) {
      return data;
    }

    const [tTitleEn, tTitleEs, tCatEn, tCatEs, tDescEn, tDescEs, tDifEn, tDifEs, tAddrEn, tAddrEs] = await Promise.all([
      translateText(data.title || "", "en"),
      translateText(data.title || "", "es"),
      translateText(data.category || "", "en"),
      translateText(data.category || "", "es"),
      translateText(data.short_description || "", "en"),
      translateText(data.short_description || "", "es"),
      translateText(data.difficulty || "", "en"),
      translateText(data.difficulty || "", "es"),
      translateText(data.meeting_point_address || "", "en"),
      translateText(data.meeting_point_address || "", "es")
    ]);

    const translateJsonArray = async (arr: JsonFieldItem[], fields: (keyof JsonFieldItem)[], lang: 'en' | 'es'): Promise<JsonFieldItem[]> => {
      if (!arr || !Array.isArray(arr)) return arr;
      const translated = await Promise.all(arr.map(async (item) => {
        const newItem: JsonFieldItem = { ...item };
        for (const field of fields) {
          const val = item[field];
          if (val) {
            newItem[field] = await translateText(val, lang);
          }
        }
        return newItem;
      }));
      return translated;
    };

    const [tItineraryEn, tItineraryEs, tIncludedEn, tIncludedEs, tHighlightsEn, tHighlightsEs, tFaqEn, tFaqEs] = await Promise.all([
      translateJsonArray(data.itinerary_json || [], ['time', 'description'], "en"),
      translateJsonArray(data.itinerary_json || [], ['time', 'description'], "es"),
      translateJsonArray(data.included_json || [], ['text'], "en"),
      translateJsonArray(data.included_json || [], ['text'], "es"),
      translateJsonArray(data.highlights_json || [], ['text'], "en"),
      translateJsonArray(data.highlights_json || [], ['text'], "es"),
      translateJsonArray(data.faq_json || [], ['q', 'a'], "en"),
      translateJsonArray(data.faq_json || [], ['q', 'a'], "es"),
    ]);

    return {
      ...data,
      title_en: tTitleEn,
      title_es: tTitleEs,
      category_en: tCatEn,
      category_es: tCatEs,
      short_description_en: tDescEn,
      short_description_es: tDescEs,
      difficulty_en: tDifEn,
      difficulty_es: tDifEs,
      meeting_point_address_en: tAddrEn,
      meeting_point_address_es: tAddrEs,
      itinerary_json_en: tItineraryEn as any,
      itinerary_json_es: tItineraryEs as any,
      included_json_en: tIncludedEn as any,
      included_json_es: tIncludedEs as any,
      highlights_json_en: tHighlightsEn as any,
      highlights_json_es: tHighlightsEs as any,
      faq_json_en: tFaqEn as any,
      faq_json_es: tFaqEs as any,
    };
  };

  const autoTranslate = async () => {
    if (!editing) return;
    if (!editing.title && !editing.category && !editing.short_description) {
      toast({ title: "Atenção", description: "Escreva algo em Português primeiro." });
      return;
    }

    setIsTranslating(true);
    toast({ title: "Mágica em andamento...", description: "Traduzindo para Inglês e Espanhol..." });

    try {
      const translatedData = await translateTourData(editing);
      setEditing(translatedData);
      toast({ title: "Sucesso!", description: "Tradução para Inglês e Espanhol concluída." });
    } catch (err) {
      toast({ title: "Erro na tradução", description: "Tente novamente.", variant: "destructive" });
    } finally {
      setIsTranslating(false);
    }
  };

  const updateJsonField = (field: keyof LovableTour, index: number, subField: string, value: string) => {
    if (!editing) return;
    const arr = [...((editing[field] as any[]) || [])];
    arr[index] = { ...arr[index], [subField]: value };
    setEditing({ ...editing, [field]: arr });
  };

  const addJsonItem = (field: keyof LovableTour, newItem: JsonFieldItem) => {
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
            if (!confirm("Traduzir TODOS os passeios para inglês e espanhol? Isso pode levar alguns minutos.")) return;
            setIsTranslatingAll(true);
            let translatedCount = 0;
            
            toast({ 
              title: "Processando tradução em massa", 
              description: `Traduzindo ${tours.length} passeios. Por favor, aguarde...` 
            });

            for (const tour of tours) {
              try {
                const translatedData = await translateTourData(tour);
                
                await updateLovable("tours", tour.id, {
                  title_en: translatedData.title_en,
                  title_es: translatedData.title_es,
                  category_en: translatedData.category_en,
                  category_es: translatedData.category_es,
                  short_description_en: translatedData.short_description_en,
                  short_description_es: translatedData.short_description_es,
                  difficulty_en: translatedData.difficulty_en,
                  difficulty_es: translatedData.difficulty_es,
                  meeting_point_address_en: translatedData.meeting_point_address_en,
                  meeting_point_address_es: translatedData.meeting_point_address_es,
                  itinerary_json_en: translatedData.itinerary_json_en,
                  itinerary_json_es: translatedData.itinerary_json_es,
                  included_json_en: translatedData.included_json_en,
                  included_json_es: translatedData.included_json_es,
                  highlights_json_en: translatedData.highlights_json_en,
                  highlights_json_es: translatedData.highlights_json_es,
                  faq_json_en: translatedData.faq_json_en,
                  faq_json_es: translatedData.faq_json_es,
                });
                translatedCount++;
                
                // Small delay to be gentle with the translation API
                await new Promise(r => setTimeout(r, 300));
              } catch (e) {
                console.error("Error translating tour:", tour.id, e);
              }
            }
            
            setIsTranslatingAll(false);
            toast({ title: "Concluído!", description: `${translatedCount} passeios foram traduzidos.` });
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
                      fetchLovable<LovableSiteImage>("site_images").then(imgs => {
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
        <DialogContent className="max-w-6xl h-[95vh] flex flex-col p-0 overflow-hidden border-none shadow-2xl font-sans" onPointerDownOutside={(e) => e.preventDefault()}>
          {editing && (
            <Tabs defaultValue="content" className="flex-1 flex flex-col h-full overflow-hidden">
              <DialogHeader className="p-6 pb-0 border-b bg-muted/20 shrink-0">
                <DialogTitle className="font-serif text-2xl mb-4">{isNew ? "Criar Experiência Premium" : "Ajustar Detalhes do Passeio"}</DialogTitle>
                <TabsList className="w-full justify-start gap-4 bg-transparent border-none p-0 mb-[-1px] overflow-x-auto">
                  <TabsTrigger value="content" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6 py-3 font-bold">Conteúdo Base</TabsTrigger>
                  {!editing.external_url && (
                    <TabsTrigger value="info" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6 py-3 font-bold">Informações do Passeio</TabsTrigger>
                  )}
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
                          
                          <div className="space-y-3 bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
                             <Label className="text-[10px] font-black uppercase tracking-widest text-blue-600 flex items-center gap-2">
                                <ExternalLink className="w-4 h-4" /> DIRECIONAR PARA (Link Externo)
                             </Label>
                             <Input 
                                value={editing.external_url ?? ""} 
                                onChange={(e) => setEditing({ ...editing, external_url: e.target.value })} 
                                placeholder="https://exemplo.com/pagina-do-passeio" 
                                className="h-12 border-blue-200 bg-white"
                             />
                             <p className="text-[10px] text-muted-foreground italic">Se preenchido, este passeio enviará o usuário direto para este link e não terá página interna.</p>
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
                            <Label className="font-black text-xs uppercase tracking-widest text-blue-600 block mb-4">Tradução Automática</Label>
                            <Button onClick={() => autoTranslate()} disabled={isTranslating} variant="outline" className="w-full h-12 justify-center px-6 rounded-2xl font-bold">
                               <Sparkles className="w-4 h-4 mr-2" />
                               <span>Traduzir para EN e ES</span>
                               {isTranslating ? <Loader2 className="w-4 h-4 ml-2 animate-spin" /> : null}
                            </Button>
                         </div>
                      </div>
                    </TabsContent>

                    {/* TAB INFO: ITINERARY, INCLUDED, FAQ, MAP */}
                  <TabsContent value="info" className="m-0 space-y-10 pb-10">
                     <div className="grid grid-cols-1 gap-6 bg-muted/20 p-6 rounded-3xl border">
                        <Label className="font-black text-xs uppercase tracking-widest text-primary flex items-center gap-2">
                           <MapPin className="w-4 h-4" /> Ponto de Encontro (Mapa)
                        </Label>
                        <div className="space-y-4">
                           <div className="flex gap-2">
                              <Button size="sm" variant={activeInfoLang === 'pt' ? 'default' : 'outline'} onClick={() => setActiveInfoLang('pt')} className="text-[10px] h-7 px-3">PT</Button>
                              <Button size="sm" variant={activeInfoLang === 'en' ? 'default' : 'outline'} onClick={() => setActiveInfoLang('en')} className="text-[10px] h-7 px-3">EN</Button>
                              <Button size="sm" variant={activeInfoLang === 'es' ? 'default' : 'outline'} onClick={() => setActiveInfoLang('es')} className="text-[10px] h-7 px-3">ES</Button>
                           </div>
                           <div className="space-y-2">
                              <Label className="text-[10px] uppercase font-bold text-muted-foreground">Endereço Completo / Local ({activeInfoLang.toUpperCase()})</Label>
                              <Input 
                                 value={String((activeInfoLang === 'pt' ? editing.meeting_point_address : editing[`meeting_point_address_${activeInfoLang}` as keyof LovableTour]) ?? "")} 
                                 onChange={(e) => setEditing({ ...editing, [activeInfoLang === 'pt' ? 'meeting_point_address' : `meeting_point_address_${activeInfoLang}`]: e.target.value })} 
                                 placeholder="Rua Visconde de Pirajá, 123, Ipanema" 
                                 className="h-12"
                              />
                           </div>
                        </div>
                     </div>

                     <div className="space-y-6">
                        <div className="flex items-center justify-between border-b pb-2">
                           <Label className="font-black text-xs uppercase tracking-widest text-primary flex items-center gap-2">
                              <List className="w-4 h-4" /> Itinerário ({activeInfoLang.toUpperCase()})
                           </Label>
                           <div className="flex items-center gap-4">
                              <div className="flex gap-1">
                                 <Button size="sm" variant={activeInfoLang === 'pt' ? 'default' : 'outline'} onClick={() => setActiveInfoLang('pt')} className="text-[10px] h-6 px-2">PT</Button>
                                 <Button size="sm" variant={activeInfoLang === 'en' ? 'default' : 'outline'} onClick={() => setActiveInfoLang('en')} className="text-[10px] h-6 px-2">EN</Button>
                                 <Button size="sm" variant={activeInfoLang === 'es' ? 'default' : 'outline'} onClick={() => setActiveInfoLang('es')} className="text-[10px] h-6 px-2">ES</Button>
                              </div>
                              <Button size="sm" variant="ghost" onClick={() => addJsonItem(activeInfoLang === 'pt' ? 'itinerary_json' : `itinerary_json_${activeInfoLang}` as keyof LovableTour, { time: '08:00', description: '' })} className="font-bold text-xs h-8">+ Adicionar Etapa</Button>
                           </div>
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                           {((editing[activeInfoLang === 'pt' ? 'itinerary_json' : `itinerary_json_${activeInfoLang}` as keyof LovableTour] as JsonFieldItem[]) || [])?.map((step, i) => (
                             <div key={i} className="flex gap-4 items-start bg-muted/20 p-4 rounded-2xl border">
                                <div className="w-24 shrink-0"><Input value={step.time} onChange={(e) => updateJsonField(activeInfoLang === 'pt' ? 'itinerary_json' : `itinerary_json_${activeInfoLang}` as keyof LovableTour, i, 'time', e.target.value)} className="h-10" /></div>
                                <div className="flex-1"><Input value={step.description} onChange={(e) => updateJsonField(activeInfoLang === 'pt' ? 'itinerary_json' : `itinerary_json_${activeInfoLang}` as keyof LovableTour, i, 'description', e.target.value)} className="h-10" /></div>
                                <Button size="icon" variant="ghost" onClick={() => removeJsonItem(activeInfoLang === 'pt' ? 'itinerary_json' : `itinerary_json_${activeInfoLang}` as keyof LovableTour, i)}><Trash2 className="w-4 h-4" /></Button>
                             </div>
                           ))}
                        </div>
                     </div>

                     <div className="space-y-6">
                        <div className="flex items-center justify-between border-b pb-2">
                           <Label className="font-black text-xs uppercase tracking-widest text-primary flex items-center gap-2">
                              <Info className="w-4 h-4" /> O que está incluído? ({activeInfoLang.toUpperCase()})
                           </Label>
                           <div className="flex items-center gap-4">
                              <div className="flex gap-1">
                                 <Button size="sm" variant={activeInfoLang === 'pt' ? 'default' : 'outline'} onClick={() => setActiveInfoLang('pt')} className="text-[10px] h-6 px-2">PT</Button>
                                 <Button size="sm" variant={activeInfoLang === 'en' ? 'default' : 'outline'} onClick={() => setActiveInfoLang('en')} className="text-[10px] h-6 px-2">EN</Button>
                                 <Button size="sm" variant={activeInfoLang === 'es' ? 'default' : 'outline'} onClick={() => setActiveInfoLang('es')} className="text-[10px] h-6 px-2">ES</Button>
                              </div>
                              <Button size="sm" variant="ghost" onClick={() => addJsonItem(activeInfoLang === 'pt' ? 'included_json' : `included_json_${activeInfoLang}` as keyof LovableTour, { icon: 'Check', text: '' })} className="font-bold text-xs h-8">+ Adicionar Item</Button>
                           </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                           {((editing[activeInfoLang === 'pt' ? 'included_json' : `included_json_${activeInfoLang}` as keyof LovableTour] as JsonFieldItem[]) || [])?.map((item, i) => (
                             <div key={i} className="flex gap-4 items-center bg-muted/20 p-4 rounded-2xl border">
                                <Input value={item.text} onChange={(e) => updateJsonField(activeInfoLang === 'pt' ? 'included_json' : `included_json_${activeInfoLang}` as keyof LovableTour, i, 'text', e.target.value)} className="h-10" />
                                <Button size="icon" variant="ghost" onClick={() => removeJsonItem(activeInfoLang === 'pt' ? 'included_json' : `included_json_${activeInfoLang}` as keyof LovableTour, i)}><Trash className="w-4 h-4" /></Button>
                             </div>
                           ))}
                         </div>
                      </div>

                      <div className="space-y-6">
                         <div className="flex items-center justify-between border-b pb-2">
                            <Label className="font-black text-xs uppercase tracking-widest text-primary flex items-center gap-2">
                               <Star className="w-4 h-4" /> Highlights (Destaques) ({activeInfoLang.toUpperCase()})
                            </Label>
                            <div className="flex items-center gap-4">
                              <div className="flex gap-1">
                                 <Button size="sm" variant={activeInfoLang === 'pt' ? 'default' : 'outline'} onClick={() => setActiveInfoLang('pt')} className="text-[10px] h-6 px-2">PT</Button>
                                 <Button size="sm" variant={activeInfoLang === 'en' ? 'default' : 'outline'} onClick={() => setActiveInfoLang('en')} className="text-[10px] h-6 px-2">EN</Button>
                                 <Button size="sm" variant={activeInfoLang === 'es' ? 'default' : 'outline'} onClick={() => setActiveInfoLang('es')} className="text-[10px] h-6 px-2">ES</Button>
                              </div>
                              <Button size="sm" variant="ghost" onClick={() => addJsonItem(activeInfoLang === 'pt' ? 'highlights_json' : `highlights_json_${activeInfoLang}` as keyof LovableTour, { icon: 'Check', text: '' })} className="font-bold text-xs h-8">+ Adicionar</Button>
                            </div>
                         </div>
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {((editing[activeInfoLang === 'pt' ? 'highlights_json' : `highlights_json_${activeInfoLang}` as keyof LovableTour] as JsonFieldItem[]) || [])?.map((item, i) => (
                               <div key={i} className="flex gap-4 items-center bg-muted/20 p-4 rounded-2xl border">
                                  <Input value={item.text} onChange={(e) => updateJsonField(activeInfoLang === 'pt' ? 'highlights_json' : `highlights_json_${activeInfoLang}` as keyof LovableTour, i, 'text', e.target.value)} placeholder="Destaque..." className="h-10" />
                                  <Button size="icon" variant="ghost" onClick={() => removeJsonItem(activeInfoLang === 'pt' ? 'highlights_json' : `highlights_json_${activeInfoLang}` as keyof LovableTour, i)}><Trash className="w-4 h-4" /></Button>
                               </div>
                            ))}
                         </div>
                      </div>

                      <div className="space-y-6">
                         <div className="flex items-center justify-between border-b pb-2">
                            <Label className="font-black text-xs uppercase tracking-widest text-primary flex items-center gap-2">
                               <HelpCircle className="w-4 h-4" /> Para seu conhecimento (FAQ) ({activeInfoLang.toUpperCase()})
                           </Label>
                           <div className="flex items-center gap-4">
                              <div className="flex gap-1">
                                 <Button size="sm" variant={activeInfoLang === 'pt' ? 'default' : 'outline'} onClick={() => setActiveInfoLang('pt')} className="text-[10px] h-6 px-2">PT</Button>
                                 <Button size="sm" variant={activeInfoLang === 'en' ? 'default' : 'outline'} onClick={() => setActiveInfoLang('en')} className="text-[10px] h-6 px-2">EN</Button>
                                 <Button size="sm" variant={activeInfoLang === 'es' ? 'default' : 'outline'} onClick={() => setActiveInfoLang('es')} className="text-[10px] h-6 px-2">ES</Button>
                              </div>
                              <Button size="sm" variant="ghost" onClick={() => addJsonItem(activeInfoLang === 'pt' ? 'faq_json' : `faq_json_${activeInfoLang}` as keyof LovableTour, { q: '', a: '' })} className="font-bold text-xs h-8">+ Nova Pergunta</Button>
                           </div>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                           {((editing[activeInfoLang === 'pt' ? 'faq_json' : `faq_json_${activeInfoLang}` as keyof LovableTour] as JsonFieldItem[]) || [])?.map((item, i) => (
                             <div key={i} className="bg-muted/10 p-5 rounded-3xl border space-y-4">
                                <Input value={item.q} onChange={(e) => updateJsonField(activeInfoLang === 'pt' ? 'faq_json' : `faq_json_${activeInfoLang}` as keyof LovableTour, i, 'q', e.target.value)} placeholder="Pergunta..." className="font-bold border-none bg-transparent" />
                                <textarea className="w-full text-sm text-muted-foreground bg-transparent border-none p-0 min-h-[60px]" value={item.a} onChange={(e) => updateJsonField(activeInfoLang === 'pt' ? 'faq_json' : `faq_json_${activeInfoLang}` as keyof LovableTour, i, 'a', e.target.value)} placeholder="Resposta..." />
                                <div className="flex justify-end"><Button variant="ghost" size="sm" className="text-red-500" onClick={() => removeJsonItem(activeInfoLang === 'pt' ? 'faq_json' : `faq_json_${activeInfoLang}` as keyof LovableTour, i)}>Excluir</Button></div>
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
                    {!editing.external_url ? (
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
                    ) : (
                      <div className="p-10 border rounded-3xl bg-muted/20 text-center">
                        <p className="text-muted-foreground">Este é um passeio de redirecionamento externo. Apenas a opção de <strong>Destaque</strong> está disponível nesta aba.</p>
                      </div>
                    )}

                    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-10 border-t ${editing.external_url ? 'flex justify-center' : ''}`}>
                        {!editing.external_url && (
                          <>
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
                          </>
                        )}
                        <div className="bg-muted/30 p-6 rounded-3xl border flex items-center justify-between">
                            <Label className="font-bold">Destaque</Label>
                            <Switch checked={editing.is_featured ?? false} onCheckedChange={(v) => setEditing({ ...editing, is_featured: v })} />
                        </div>
                    </div>

                     {!editing.external_url && (
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
                     )}
                  </TabsContent>
                </div>
                
                <div className="p-6 border-t bg-muted/10 shrink-0 flex justify-end gap-4">
                  <Button type="button" variant="outline" onClick={() => setEditing(null)} className="px-10 h-14 rounded-2xl">Descartar</Button>
                  <Button onClick={handleSave} className="px-16 h-14 bg-primary text-white rounded-2xl font-black" disabled={isUploading || isTranslating}>
                    {isTranslating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
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
