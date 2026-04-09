import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Star, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { translateText } from "@/utils/translate";

interface Review {
  id: string;
  author_name: string;
  author_location: string;
  rating: number;
  title: string;
  title_en: string | null;
  title_es: string | null;
  content: string;
  content_en: string | null;
  content_es: string | null;
  tour_name: string;
  review_date: string;
  is_published: boolean;
  sort_order: number;
}

const emptyReview = {
  author_name: "",
  author_location: "",
  rating: 5,
  title: "",
  title_en: "",
  title_es: "",
  content: "",
  content_en: "",
  content_es: "",
  tour_name: "",
  review_date: new Date().toISOString().split("T")[0],
  is_published: true,
  sort_order: 0,
};

export default function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyReview);
  const [isTranslating, setIsTranslating] = useState(false);

  const loadReviews = async () => {
    const { data } = await supabase.from("reviews").select("*").order("sort_order");
    if (data) setReviews(data);
  };

  useEffect(() => { loadReviews(); }, []);

  const openNew = () => {
    setEditingId(null);
    setForm({ ...emptyReview, sort_order: reviews.length });
    setDialogOpen(true);
  };

  const openEdit = (r: Review) => {
    setEditingId(r.id);
    setForm({
      author_name: r.author_name,
      author_location: r.author_location,
      rating: r.rating,
      title: r.title,
      title_en: r.title_en || "",
      title_es: r.title_es || "",
      content: r.content,
      content_en: r.content_en || "",
      content_es: r.content_es || "",
      tour_name: r.tour_name,
      review_date: r.review_date,
      is_published: r.is_published,
      sort_order: r.sort_order,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.author_name || !form.title || !form.content) {
      toast.error("Preencha nome, título e conteúdo");
      return;
    }

    const payload = {
      ...form,
      title_en: form.title_en || null,
      title_es: form.title_es || null,
      content_en: form.content_en || null,
      content_es: form.content_es || null,
    };

    if (editingId) {
      const { error, data } = await supabase.from("reviews").update(payload).eq("id", editingId);
      console.log("Update result:", error, data);
      if (error) { toast.error("Erro ao atualizar: " + error.message); return; }
      toast.success("Review atualizado!");
    } else {
      const { error, data } = await supabase.from("reviews").insert(payload);
      console.log("Insert result:", error, data);
      if (error) { toast.error("Erro ao criar: " + error.message); return; }
      toast.success("Review criado!");
    }
    setDialogOpen(false);
    loadReviews();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remover este review?")) return;
    await supabase.from("reviews").delete().eq("id", id);
    toast.success("Review removido");
    loadReviews();
  };

  const handleTranslate = async () => {
    if (!form.title || !form.content) {
      toast.error("Preencha o título e conteúdo em português primeiro");
      return;
    }
    setIsTranslating(true);
    try {
      const [titleEn, titleEs, contentEn, contentEs] = await Promise.all([
        translateText(form.title, "en"),
        translateText(form.title, "es"),
        translateText(form.content, "en"),
        translateText(form.content, "es"),
      ]);
      setForm(f => ({
        ...f,
        title_en: titleEn,
        title_es: titleEs,
        content_en: contentEn,
        content_es: contentEs,
      }));
      toast.success("Tradução concluída!");
    } catch (err) {
      toast.error("Erro ao traduzir");
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className="space-y-6 w-full max-w-full overflow-hidden">
      <div className="flex items-center justify-between w-full min-w-0">
        <h1 className="text-2xl font-bold truncate">Reviews do TripAdvisor</h1>
        <Button onClick={openNew} className="flex-shrink-0"><Plus className="w-4 h-4 mr-2" />Novo Review</Button>
      </div>

      <div className="w-full max-w-full overflow-x-hidden">
        <div className="grid gap-4 w-full">
        {reviews.map((r) => (
        <Card key={r.id} className={`${!r.is_published ? "opacity-50" : ""} w-full max-w-full`}>
            <CardContent className="flex items-center gap-4 py-4 w-full max-w-full overflow-hidden">
              <div className="flex-1 min-w-0 w-full">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="font-bold">{r.author_name}</span>
                  <span className="text-muted-foreground text-sm">— {r.author_location}</span>
                  <div className="flex gap-0.5 ml-2">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} className={`h-3 w-3 ${s <= r.rating ? "fill-amber-400 text-amber-400" : "text-muted"}`} />
                    ))}
                  </div>
                </div>
                <p className="font-medium break-words">{r.title}</p>
                <p className="text-sm text-muted-foreground break-words">{r.content}</p>
                <p className="text-xs text-primary mt-1">{r.tour_name} • {r.review_date}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Button variant="ghost" size="icon" onClick={() => openEdit(r)}><Pencil className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(r.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {reviews.length === 0 && (
          <p className="text-center text-muted-foreground py-12">Nenhum review cadastrado. Clique em "Novo Review" para adicionar.</p>
        )}
      </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto w-full">
          <DialogHeader>
            <DialogTitle>{editingId ? "Editar Review" : "Novo Review"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Nome do Autor *</Label>
                <Input value={form.author_name} onChange={e => setForm(f => ({ ...f, author_name: e.target.value }))} placeholder="Maria Silva" />
              </div>
              <div>
                <Label>Localização</Label>
                <Input value={form.author_location} onChange={e => setForm(f => ({ ...f, author_location: e.target.value }))} placeholder="São Paulo, Brasil" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Avaliação</Label>
                <div className="flex gap-1 mt-2">
                  {[1,2,3,4,5].map(s => (
                    <button key={s} type="button" onClick={() => setForm(f => ({ ...f, rating: s }))}>
                      <Star className={`h-6 w-6 ${s <= form.rating ? "fill-amber-400 text-amber-400" : "text-muted"}`} />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label>Nome do Passeio</Label>
                <Input value={form.tour_name} onChange={e => setForm(f => ({ ...f, tour_name: e.target.value }))} placeholder="City Tour Rio" />
              </div>
              <div>
                <Label>Data</Label>
                <Input type="date" value={form.review_date} onChange={e => setForm(f => ({ ...f, review_date: e.target.value }))} />
              </div>
            </div>
            <div>
              <Label>Título (PT) *</Label>
              <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
            </div>
            <div>
              <Label>Conteúdo (PT) *</Label>
              <Textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Título (EN)</Label>
                <Input value={form.title_en} onChange={e => setForm(f => ({ ...f, title_en: e.target.value }))} />
              </div>
              <div>
                <Label>Título (ES)</Label>
                <Input value={form.title_es} onChange={e => setForm(f => ({ ...f, title_es: e.target.value }))} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Conteúdo (EN)</Label>
                <Textarea value={form.content_en} onChange={e => setForm(f => ({ ...f, content_en: e.target.value }))} rows={2} />
              </div>
              <div>
                <Label>Conteúdo (ES)</Label>
                <Textarea value={form.content_es} onChange={e => setForm(f => ({ ...f, content_es: e.target.value }))} rows={2} />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch checked={form.is_published} onCheckedChange={v => setForm(f => ({ ...f, is_published: v }))} />
                <Label>Publicado</Label>
              </div>
              <div className="flex items-center gap-2">
                <Label>Ordem</Label>
                <Input type="number" className="w-20" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))} />
              </div>
              <Button variant="outline" onClick={handleTranslate} disabled={isTranslating} className="ml-auto">
                {isTranslating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Traduzir para EN/ES
              </Button>
            </div>
            <Button onClick={handleSave} className="w-full">{editingId ? "Salvar" : "Criar Review"}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
