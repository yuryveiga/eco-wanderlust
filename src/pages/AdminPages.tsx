import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { fetchLovable, insertLovable, updateLovable, deleteLovable, uploadLovableFile, LovablePage } from "@/integrations/lovable/client";
import { Plus, Pencil, Trash2, GripVertical } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { lazy, Suspense } from 'react';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = lazy(() => import('react-quill'));

const slugify = (text: string) => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
};

const AdminPages = () => {
  const [pages, setPages] = useState<LovablePage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<LovablePage> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadPages();
  }, []);

  const loadPages = async () => {
    const data = await fetchLovable<LovablePage>("pages");
    setPages(data.sort((a, b) => a.sort_order - b.sort_order));
    setIsLoading(false);
  };

  const handleSave = async () => {
    if (!editing?.title) {
      toast({ title: "Erro", description: "Título é obrigatório", variant: "destructive" });
      return;
    }

    const href = editing.href || slugify(editing.title);
    const dataToSave = { ...editing, href };

    try {
      if (isNew) {
        const newPage = { ...dataToSave, sort_order: pages.length + 1 };
        await insertLovable("pages", newPage);
        toast({ title: "Página criada!" });
      } else if (editing.id) {
        await updateLovable("pages", editing.id, dataToSave);
        toast({ title: "Página atualizada!" });
      }

      await loadPages();
      setEditing(null);
    } catch {
      toast({ title: "Erro", description: "Erro ao salvar", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Deseja excluir esta página?")) return;
    await deleteLovable("pages", id);
    setPages(pages.filter((p) => p.id !== id));
    toast({ title: "Página removida" });
  };

  const imageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files ? input.files[0] : null;
      if (!file) return;

      try {
        const url = await uploadLovableFile(file);
        if (url) {
          // Em um componente funcional, a forma mais garantida sem ref
          // é injetar o HTML da tag img manualmente.
          setEditing(prev => {
            if (!prev) return prev;
            return {
              ...prev,
              content: (prev.content || "") + `\n<img src="${url}" alt="image" />\n`
            };
          });
          toast({ title: "Imagem anexada no final do texto!" });
        }
      } catch (err) {
        toast({ title: "Erro", description: "Falha ao enviar." });
      }
    };
  };

  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link', 'image', 'video'],
        ['clean'],
      ],
      handlers: {
        image: imageHandler
      }
    }
  };

  const systemPageLabels = ["inicio", "início", "home", "passeios", "blog", "contato"];
  const displayPages = pages.filter(p => !systemPageLabels.includes(p.title.toLowerCase()));

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">Páginas CMS</h1>
          <p className="text-muted-foreground font-sans text-sm mt-1">Crie conteúdo rico ou links para ancorar no menu do site.</p>
        </div>
        <Button onClick={() => { setEditing({ title: "", href: "/", content: "", is_visible: true, sort_order: pages.length }); setIsNew(true); }} className="font-sans">
          <Plus className="w-4 h-4 mr-2" />Nova Página
        </Button>
      </div>

      <div className="flex-1 overflow-auto pr-2 pb-8">
        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground font-sans">Carregando...</div>
        ) : displayPages.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground font-sans">Nenhuma página personalizada cadastrada.</div>
        ) : (
          <div className="bg-card rounded-xl border border-border/50 divide-y divide-border/50">
            {displayPages.map((page) => (
              <div key={page.id} className="flex items-center gap-4 p-4">
                <GripVertical className="w-4 h-4 text-muted-foreground" />
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground font-sans">{page.title}</h3>
                  <p className="text-sm text-muted-foreground font-sans">{page.href} {page.content && page.content.length > 5 && <span className="ml-2 text-xs bg-primary/10 text-primary px-2 rounded-full">Tem Conteúdo</span>}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-sans ${page.is_visible ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                  {page.is_visible ? "Visível" : "Oculto"}
                </span>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={() => { setEditing({ ...page }); setIsNew(false); }}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => handleDelete(page.id)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-6">
          <DialogHeader className="shrink-0 mb-4">
            <DialogTitle className="font-serif">{isNew ? "Criar Nova Página" : "Editar Página"}</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-2 pb-4">
              <div className="grid grid-cols-2 gap-4 shrink-0">
                <div className="space-y-2">
                  <Label className="font-sans">Título da Página (Aparece no Menu)</Label>
                  <Input 
                    value={editing.title ?? ""} 
                    onChange={(e) => {
                      const title = e.target.value;
                      setEditing({ ...editing, title, href: editing.href === "/" || !editing.href ? slugify(title) : editing.href });
                    }} 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-sans">Slug / Rota (URL)</Label>
                  <Input 
                   value={editing.href ?? ""} 
                   onChange={(e) => setEditing({ ...editing, href: slugify(e.target.value) })} 
                   placeholder="ex: sobre-nos" 
                   required 
                  />
                  <p className="text-[10px] text-muted-foreground">Endereço: seudominio.com/{editing.href || "..."}</p>
                </div>
              </div>
              
              <div className="flex-1 flex flex-col min-h-[350px]">
                <Label className="font-sans mb-2 shrink-0">Conteúdo da Página (Editor Avançado)</Label>
                <div className="flex-1 rounded-md border flex flex-col" style={{ minHeight: "300px" }}>
                  <Suspense fallback={<div className="p-4 text-sm text-muted-foreground">Carregando editor de texto...</div>}>
                    <ReactQuill 
                      theme="snow" 
                      value={editing.content || ""} 
                      onChange={(content) => setEditing({ ...editing, content })} 
                      className="flex-1 w-full bg-background flex flex-col h-full editor-container"
                      modules={modules}
                    />
                  </Suspense>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 shrink-0 pt-4 border-t">
                <div className="space-y-2">
                  <Label className="font-sans">Ordem de Exibição no Menu</Label>
                  <Input type="number" value={editing.sort_order ?? 0} onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })} />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <Switch checked={editing.is_visible ?? true} onCheckedChange={(v) => setEditing({ ...editing, is_visible: v })} />
                  <Label className="font-sans">Tornar página visível no menu principal</Label>
                </div>
              </div>
              
              <div className="flex justify-end gap-2 pt-4 bg-background shrink-0 pb-2">
                <Button type="button" variant="outline" onClick={() => setEditing(null)} className="font-sans">Cancelar</Button>
                <Button onClick={handleSave} className="font-sans px-8">{isNew ? "Criar" : "Salvar Alterações"}</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPages;
