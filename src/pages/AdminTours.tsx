import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { fetchLovable, insertLovable, updateLovable, deleteLovable, uploadLovableFile, LovableTour } from "@/integrations/lovable/client";
import { Plus, Pencil, Trash2, Upload, MapPin, Utensils, Shield, Activity, Clock, Calendar, Sunrise, Sun, Moon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const emptyTour: Partial<LovableTour> = {
  title: "",
  short_description: "",
  price: 0,
  duration: "",
  max_group_size: 10,
  image_url: "",
  is_featured: false,
  category: "",
  is_active: true,
  sort_order: 0,
  itinerary_json: [],
  included_json: [],
  faq_json: [],
  has_morning: true,
  has_afternoon: false,
  has_night: false,
  allows_private: false,
  allows_open: true,
};

const iconOptions = [
  { value: "MapPin", label: "Localização", Icon: MapPin },
  { value: "Utensils", label: "Alimentação", Icon: Utensils },
  { value: "Shield", label: "Segurança", Icon: Shield },
  { value: "Activity", label: "Atividade", Icon: Activity },
  { value: "Clock", label: "Relógio", Icon: Clock },
  { value: "Calendar", label: "Calendário", Icon: Calendar },
  { value: "Sunrise", label: "Manhã", Icon: Sunrise },
  { value: "Sun", label: "Tarde", Icon: Sun },
  { value: "Moon", label: "Noite", Icon: Moon },
];

const AdminTours = () => {
  const [tours, setTours] = useState<LovableTour[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingTour, setEditingTour] = useState<Partial<LovableTour> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadTours();
  }, []);

  const loadTours = async () => {
    const data = await fetchLovable<LovableTour>("tours");
    setTours(data.sort((a, b) => a.sort_order - b.sort_order));
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
    if (!editingTour?.title) {
      toast({ title: "Erro", description: "Título é obrigatório", variant: "destructive" });
      return;
    }

    setIsUploading(true);

    try {
      let imageUrl = editingTour.image_url || "";

      if (selectedFile) {
        const uploadedUrl = await uploadLovableFile(selectedFile);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        }
      }

      const dataToSave = { ...editingTour, image_url: imageUrl };

      if (isNew) {
        await insertLovable("tours", dataToSave);
        toast({ title: "Passeio criado!" });
      } else if (editingTour.id) {
        await updateLovable("tours", editingTour.id, dataToSave);
        toast({ title: "Passeio atualizado!" });
      }

      await loadTours();
      setEditingTour(null);
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch {
      toast({ title: "Erro", description: "Erro ao salvar", variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Deseja excluir este passeio?")) return;
    await deleteLovable("tours", id);
    await loadTours();
    toast({ title: "Passeio removido" });
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <h1 className="font-serif text-3xl font-bold text-foreground">Gerenciar Passeios</h1>
        <Button onClick={() => { setEditingTour({ ...emptyTour }); setIsNew(true); setSelectedFile(null); setPreviewUrl(null); }} className="font-sans">
          <Plus className="w-4 h-4 mr-2" />Novo Passeio
        </Button>
      </div>

      <div className="flex-1 overflow-auto pr-2 pb-8">
        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground font-sans">Carregando...</div>
        ) : tours.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground font-sans">Nenhum passeio cadastrado.</div>
        ) : (
          <div className="grid gap-4">
            {tours.map((tour) => (
              <div key={tour.id} className="bg-card rounded-xl border border-border/50 p-4 flex items-center gap-4">
                {tour.image_url && (
                  <img src={tour.image_url} alt={tour.title} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground font-sans truncate">{tour.title}</h3>
                    {tour.is_featured && <span className="text-[10px] bg-accent text-accent-foreground px-2 py-0.5 rounded-full font-bold uppercase">Destaque</span>}
                  </div>
                  <p className="text-sm text-muted-foreground font-sans">{tour.category} · R$ {tour.price}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={() => { setEditingTour({ ...tour }); setIsNew(false); setSelectedFile(null); setPreviewUrl(null); }}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => handleDelete(tour.id)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={!!editingTour} onOpenChange={(open) => !open && setEditingTour(null)}>
        <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0">
          <DialogHeader className="p-6 pb-2 border-b shrink-0">
            <DialogTitle className="font-serif text-2xl">{isNew ? "Criar Novo Passeio" : "Editar Passeio"}</DialogTitle>
          </DialogHeader>
          
          {editingTour && (
            <div className="flex-1 overflow-y-auto p-6 pt-2">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-6">
                  <TabsTrigger value="basic">Dados Básicos</TabsTrigger>
                  <TabsTrigger value="itinerary">Itinerário</TabsTrigger>
                  <TabsTrigger value="included">Incluso / FAQ</TabsTrigger>
                  <TabsTrigger value="settings">Opções & Tipos</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Título do Passeio</Label>
                      <Input value={editingTour.title ?? ""} onChange={(e) => setEditingTour({ ...editingTour, title: e.target.value })} placeholder="Ex: Cristo Redentor & City Tour" />
                    </div>
                    <div className="space-y-2">
                      <Label>Categoria</Label>
                      <Input value={editingTour.category ?? ""} onChange={(e) => setEditingTour({ ...editingTour, category: e.target.value })} placeholder="Ex: Histórico, Aventura" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Descrição Curta</Label>
                    <Textarea value={editingTour.short_description ?? ""} onChange={(e) => setEditingTour({ ...editingTour, short_description: e.target.value })} rows={4} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Preço Base (R$)</Label>
                      <Input type="number" value={editingTour.price ?? 0} onChange={(e) => setEditingTour({ ...editingTour, price: Number(e.target.value) })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Duração</Label>
                      <Input value={editingTour.duration ?? ""} onChange={(e) => setEditingTour({ ...editingTour, duration: e.target.value })} placeholder="Ex: 8 horas" />
                    </div>
                    <div className="space-y-2">
                      <Label>Grupo Máximo</Label>
                      <Input type="number" value={editingTour.max_group_size ?? 10} onChange={(e) => setEditingTour({ ...editingTour, max_group_size: Number(e.target.value) })} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Imagem de Capa</Label>
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                    <div className="flex gap-4 items-start">
                      <div className="flex-1">
                        <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} className="w-full h-24 border-dashed" disabled={isUploading}>
                          <Upload className="w-6 h-6 mr-2" />
                          {selectedFile ? selectedFile.name : "Clique para subir a foto"}
                        </Button>
                      </div>
                      {(previewUrl || editingTour.image_url) && (
                        <img src={previewUrl || editingTour.image_url} alt="Preview" className="w-24 h-24 object-cover rounded-lg border shadow-sm" />
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="itinerary" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-lg font-bold">Itinerário Passo a Passo</Label>
                    <Button type="button" variant="outline" size="sm" onClick={() => { setEditingTour({ ...editingTour, itinerary_json: [...(editingTour.itinerary_json || []), { time: "", description: "" }] }); }}>
                      <Plus className="w-4 h-4 mr-2" />Adicionar Passo
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {(editingTour.itinerary_json || []).map((item, index) => (
                      <div key={index} className="flex gap-2 p-3 border rounded-lg bg-muted/30">
                        <Input placeholder="Horário" value={item.time} onChange={(e) => { const arr = [...(editingTour.itinerary_json || [])]; arr[index].time = e.target.value; setEditingTour({ ...editingTour, itinerary_json: arr }); }} className="w-24 shrink-0" />
                        <Input placeholder="Descrição" value={item.description} onChange={(e) => { const arr = [...(editingTour.itinerary_json || [])]; arr[index].description = e.target.value; setEditingTour({ ...editingTour, itinerary_json: arr }); }} className="flex-1" />
                        <Button type="button" variant="ghost" size="icon" onClick={() => { const arr = [...(editingTour.itinerary_json || [])]; arr.splice(index, 1); setEditingTour({ ...editingTour, itinerary_json: arr }); }}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="included" className="space-y-6">
                  {/* Included Items */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-lg font-bold">O que está incluso</Label>
                      <Button type="button" variant="outline" size="sm" onClick={() => { setEditingTour({ ...editingTour, included_json: [...(editingTour.included_json || []), { icon: "Check", text: "" }] }); }}>
                        <Plus className="w-4 h-4 mr-2" />Adicionar Item
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {(editingTour.included_json || []).map((item, index) => (
                        <div key={index} className="flex gap-2 items-center p-2 border rounded-lg">
                          <select 
                            className="bg-muted px-2 py-1 rounded text-xs outline-none"
                            value={item.icon}
                            onChange={(e) => { const arr = [...(editingTour.included_json || [])]; arr[index].icon = e.target.value; setEditingTour({ ...editingTour, included_json: arr }); }}
                          >
                            {iconOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                          </select>
                          <Input placeholder="Ex: Almoço incluso" value={item.text} onChange={(e) => { const arr = [...(editingTour.included_json || [])]; arr[index].text = e.target.value; setEditingTour({ ...editingTour, included_json: arr }); }} className="flex-1" />
                          <Button type="button" variant="ghost" size="icon" onClick={() => { const arr = [...(editingTour.included_json || [])]; arr.splice(index, 1); setEditingTour({ ...editingTour, included_json: arr }); }}><Trash2 className="w-4 h-4" /></Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* FAQ Items */}
                  <div className="space-y-4 pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <Label className="text-lg font-bold">Dúvidas / FAQ</Label>
                      <Button type="button" variant="outline" size="sm" onClick={() => { setEditingTour({ ...editingTour, faq_json: [...(editingTour.faq_json || []), { q: "", a: "" }] }); }}>
                        <Plus className="w-4 h-4 mr-2" />Adicionar FAQ
                      </Button>
                    </div>
                    <div className="space-y-3">
                      {(editingTour.faq_json || []).map((item, index) => (
                        <div key={index} className="p-3 border rounded-lg space-y-2">
                          <div className="flex gap-2">
                            <Input placeholder="Pergunta" value={item.q} onChange={(e) => { const arr = [...(editingTour.faq_json || [])]; arr[index].q = e.target.value; setEditingTour({ ...editingTour, faq_json: arr }); }} className="flex-1 font-bold" />
                            <Button type="button" variant="ghost" size="icon" onClick={() => { const arr = [...(editingTour.faq_json || [])]; arr.splice(index, 1); setEditingTour({ ...editingTour, faq_json: arr }); }}><Trash2 className="w-4 h-4" /></Button>
                          </div>
                          <Textarea placeholder="Resposta" value={item.a} onChange={(e) => { const arr = [...(editingTour.faq_json || [])]; arr[index].a = e.target.value; setEditingTour({ ...editingTour, faq_json: arr }); }} rows={2} />
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="settings" className="space-y-8">
                  {/* Períodos */}
                  <div className="space-y-4">
                    <Label className="text-lg font-bold">Disponibilidade de Período</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="flex items-center justify-between p-4 border rounded-xl bg-card">
                        <div className="flex items-center gap-3">
                          <Sunrise className="w-5 h-5 text-amber-500" />
                          <Label>Manhã</Label>
                        </div>
                        <Switch checked={editingTour.has_morning ?? true} onCheckedChange={(v) => setEditingTour({ ...editingTour, has_morning: v })} />
                      </div>
                      <div className="flex items-center justify-between p-4 border rounded-xl bg-card">
                        <div className="flex items-center gap-3">
                          <Sun className="w-5 h-5 text-orange-500" />
                          <Label>Tarde</Label>
                        </div>
                        <Switch checked={editingTour.has_afternoon ?? false} onCheckedChange={(v) => setEditingTour({ ...editingTour, has_afternoon: v })} />
                      </div>
                      <div className="flex items-center justify-between p-4 border rounded-xl bg-card">
                        <div className="flex items-center gap-3">
                          <Moon className="w-5 h-5 text-blue-500" />
                          <Label>Noite</Label>
                        </div>
                        <Switch checked={editingTour.has_night ?? false} onCheckedChange={(v) => setEditingTour({ ...editingTour, has_night: v })} />
                      </div>
                    </div>
                  </div>

                  {/* Grupo Modes */}
                  <div className="space-y-4 pt-4 border-t">
                    <Label className="text-lg font-bold">Modos de Reserva</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-center justify-between p-4 border rounded-xl bg-card">
                        <div className="flex flex-col">
                          <Label className="font-bold">Grupo Aberto (Open)</Label>
                          <span className="text-[10px] text-muted-foreground">Vagas vendidas individualmente</span>
                        </div>
                        <Switch checked={editingTour.allows_open ?? true} onCheckedChange={(v) => setEditingTour({ ...editingTour, allows_open: v })} />
                      </div>
                      <div className="flex items-center justify-between p-4 border rounded-xl bg-card">
                        <div className="flex flex-col">
                          <Label className="font-bold">Grupo Privado</Label>
                          <span className="text-[10px] text-muted-foreground">Exclusivo para o grupo que reserva</span>
                        </div>
                        <Switch checked={editingTour.allows_private ?? false} onCheckedChange={(v) => setEditingTour({ ...editingTour, allows_private: v })} />
                      </div>
                    </div>
                  </div>

                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t">
                    <div className="space-y-2">
                      <Label>Ordem no Site</Label>
                      <Input type="number" value={editingTour.sort_order ?? 0} onChange={(e) => setEditingTour({ ...editingTour, sort_order: Number(e.target.value) })} />
                    </div>
                    <div className="flex items-center gap-2 pt-8">
                      <Switch checked={editingTour.is_featured ?? false} onCheckedChange={(v) => setEditingTour({ ...editingTour, is_featured: v })} />
                      <Label>Destaque na Home</Label>
                    </div>
                    <div className="flex items-center gap-2 pt-8">
                      <Switch checked={editingTour.is_active ?? true} onCheckedChange={(v) => setEditingTour({ ...editingTour, is_active: v })} />
                      <Label>Publicado / Ativo</Label>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}

          <div className="p-6 border-t bg-muted/30 shrink-0 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setEditingTour(null)} className="font-sans px-8">Cancelar</Button>
            <Button onClick={handleSave} className="font-sans px-10" disabled={isUploading}>
              {isUploading ? "Salvando..." : "Salvar Passeio"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminTours;
