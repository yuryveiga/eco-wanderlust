import { useState, useEffect, lazy, Suspense, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { fetchLovable, insertLovable, updateLovable, deleteLovable, uploadLovableFile, LovableBlogPost } from "@/integrations/lovable/client";
import { Plus, Pencil, Trash2, Image as ImageIcon, Upload, Type, Sparkles, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { translateText, translateHtml } from "@/utils/translate";
import 'react-quill/dist/quill.snow.css';

const ReactQuill = lazy(() => import('react-quill'));

const AdminBlog = () => {
  const [posts, setPosts] = useState<LovableBlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<LovableBlogPost> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchLovable<LovableBlogPost>("blog_posts").then((data) => {
      setPosts(data.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()));
      setIsLoading(false);
    });
  }, []);

  const handleSave = async () => {
    if (!editing?.title || !editing?.slug) {
      toast({ title: "Erro", description: "Título e slug são obrigatórios", variant: "destructive" });
      return;
    }

    try {
      if (isNew) {
        await insertLovable("blog_posts", { ...editing, is_published: editing.is_published ?? false });
        toast({ title: "Post criado!" });
      } else if (editing.id) {
        await updateLovable("blog_posts", editing.id, editing);
        toast({ title: "Post atualizado!" });
      }

      const data = await fetchLovable<LovableBlogPost>("blog_posts");
      setPosts(data.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()));
      setEditing(null);
    } catch {
      toast({ title: "Erro", description: "Erro ao salvar", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Deseja excluir este post?")) return;
    await deleteLovable("blog_posts", id);
    setPosts(posts.filter((p) => p.id !== id));
    toast({ title: "Post removido" });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editing) return;
    
    setIsUploading(true);
    try {
      const url = await uploadLovableFile(file);
      if (url) {
        setEditing({ ...editing, image_url: url });
        toast({ title: "Imagem carregada com sucesso!" });
      }
    } catch {
      toast({ title: "Erro", description: "Falha ao enviar imagem.", variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  const autoTranslate = async (targetLang: 'en' | 'es') => {
    if (!editing) return;
    if (!editing.title && !editing.content) {
      toast({ title: "Atenção", description: "Escreva algo em Português primeiro." });
      return;
    }

    setIsTranslating(true);
    toast({ title: "Mágica em andamento...", description: "Traduzindo conteúdo..." });

    try {
      const titleKey = (targetLang === 'en' ? 'title_en' : 'title_es') as keyof LovableBlogPost;
      const contentKey = (targetLang === 'en' ? 'content_en' : 'content_es') as keyof LovableBlogPost;
      
      const [translatedTitle, translatedContent] = await Promise.all([
        translateText(editing.title || "", targetLang),
        translateHtml(editing.content || "", targetLang)
      ]);

      setEditing(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          [titleKey]: translatedTitle,
          [contentKey]: translatedContent
        } as Partial<LovableBlogPost>;
      });
      
      toast({ title: "Sucesso!", description: `Tradução para ${targetLang === 'en' ? 'Inglês' : 'Espanhol'} concluída.` });
    } catch (err) {
      toast({ title: "Erro na tradução", description: "Tente novamente daqui a pouco.", variant: "destructive" });
    } finally {
      setIsTranslating(false);
    }
  };

  const imageHandler = useCallback((langSuffix: "" | "_en" | "_es") => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files ? input.files[0] : null;
      if (!file) return;

      toast({ title: "Enviando imagem..." });
      try {
        const url = await uploadLovableFile(file);
        if (url) {
          const field = `content${langSuffix}` as keyof LovableBlogPost;
          setEditing(prev => {
            if (!prev) return prev;
            return {
              ...prev,
              [field]: (prev[field] || "") + `<p><img src="${url}" alt="image" style="max-width:100%; border-radius:12px; margin: 20px 0;" /></p>`
            };
          });
          toast({ title: "Imagem inserida no post!" });
        }
      } catch (err) {
        toast({ title: "Erro", description: "Falha ao enviar." });
      }
    };
  }, [toast]);

  const modulesPT = useMemo(() => ({
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link', 'image', 'video'],
        ['clean'],
      ],
      handlers: { image: () => imageHandler("") }
    }
  }), [imageHandler]);

  const modulesEN = useMemo(() => ({
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link', 'image', 'video'],
        ['clean'],
      ],
      handlers: { image: () => imageHandler("_en") }
    }
  }), [imageHandler]);

  const modulesES = useMemo(() => ({
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link', 'image', 'video'],
        ['clean'],
      ],
      handlers: { image: () => imageHandler("_es") }
    }
  }), [imageHandler]);

  return (
    <div className="flex flex-col h-full overflow-hidden font-sans">
      <style>{`
        .editor-container .ql-container {
          min-height: 400px;
          font-family: inherit;
          font-size: 16px;
        }
        .editor-container .ql-editor {
          min-height: 400px;
        }
        .editor-container .ql-toolbar {
          border-top-left-radius: 8px;
          border-top-right-radius: 8px;
          background: #f8fafc;
        }
        .editor-container .ql-container {
          border-bottom-left-radius: 8px;
          border-bottom-right-radius: 8px;
        }
      `}</style>
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">Blog</h1>
          <p className="text-muted-foreground font-sans text-sm mt-1">Gerencie artigos com editor rico e multi-idioma.</p>
        </div>
        <Button onClick={() => { setEditing({ title: "", slug: "", content: "", is_published: true }); setIsNew(true); }} className="font-sans">
          <Plus className="w-4 h-4 mr-2" />Novo Post
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto pb-12 pr-1">
        {isLoading ? (
          <div className="col-span-full text-center py-12 text-muted-foreground font-sans animate-pulse">Carregando...</div>
        ) : posts.length === 0 ? (
          <div className="col-span-full text-center py-12 text-muted-foreground font-sans">Nenhum post publicado.</div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="bg-card rounded-xl border border-border/50 overflow-hidden shadow-sm flex flex-col group hover:shadow-md transition-shadow">
              <div className="relative h-40 bg-muted">
                {post.image_url ? (
                  <img src={post.image_url} alt={post.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <ImageIcon className="w-8 h-8 opacity-50" />
                  </div>
                )}
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button size="icon" variant="secondary" className="h-8 w-8 shadow-sm" onClick={() => { setEditing({ ...post }); setIsNew(false); }}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="destructive" className="h-8 w-8 shadow-sm" onClick={() => handleDelete(post.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-sans uppercase tracking-wider ${post.is_published ? "bg-primary/10 text-primary border border-primary/20" : "bg-muted text-muted-foreground"}`}>
                    {post.is_published ? "Publicado" : "Rascunho"}
                  </span>
                </div>
                <h3 className="font-serif font-bold text-lg leading-tight mb-2 line-clamp-2">{post.title}</h3>
                <p className="text-xs text-muted-foreground font-sans mt-auto border-t pt-2 border-border/30 truncate">/{post.slug}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="max-w-6xl h-[95vh] flex flex-col p-6 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="shrink-0 mb-4">
            <DialogTitle className="font-serif text-2xl flex items-center gap-2">
              <Type className="w-6 h-6 text-primary" />
              {isNew ? "Criar Novo Post Premium" : "Editar Artigo do Blog"}
            </DialogTitle>
          </DialogHeader>
          
          {editing && (
            <div className="flex-1 flex flex-col gap-6 overflow-hidden">
               <Tabs defaultValue="portuguese" className="w-full h-full flex flex-col overflow-hidden">
                <TabsList className="grid w-80 grid-cols-3 mb-4 shrink-0">
                  <TabsTrigger value="portuguese" className="font-bold">Português (PT)</TabsTrigger>
                  <TabsTrigger value="english" className="font-bold text-blue-600">English (EN)</TabsTrigger>
                  <TabsTrigger value="spanish" className="font-bold text-red-600">Español (ES)</TabsTrigger>
                </TabsList>

                <div className="flex-1 flex flex-col overflow-y-auto pr-2 gap-6 pb-4">
                  {/* Common Fields */}
                  <div className="grid grid-cols-2 gap-4 shrink-0 bg-muted/20 p-5 rounded-2xl border border-border/50 shadow-inner">
                    <div className="space-y-2">
                      <Label className="font-sans font-bold text-xs uppercase tracking-widest text-muted-foreground">Slug / URL Amigável</Label>
                      <Input value={editing.slug ?? ""} onChange={(e) => setEditing({ ...editing, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })} placeholder="melhores-praias-rj" required className="font-mono text-xs" />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-sans font-bold text-xs uppercase tracking-widest text-muted-foreground">Imagem de Capa (Principal)</Label>
                      <div className="flex items-center gap-4">
                        {editing.image_url && (
                          <img src={editing.image_url} alt="Capa" className="h-10 w-10 object-cover rounded-lg shadow-sm border border-border" />
                        )}
                        <div className="relative flex-1">
                          <Input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="blog-image-upload" disabled={isUploading} />
                          <Label htmlFor="blog-image-upload" className={`flex items-center justify-center h-10 w-full border-2 border-dashed rounded-xl cursor-pointer hover:bg-muted/50 transition-colors ${isUploading ? 'opacity-50' : ''}`}>
                            <Upload className="w-3 h-3 mr-2 text-primary" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{isUploading ? 'Enviando...' : 'Fazer Upload'}</span>
                          </Label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* PORTUGUESE CONTENT */}
                  <TabsContent value="portuguese" className="flex-1 flex flex-col gap-4 m-0">
                    <div className="space-y-2">
                      <Label className="font-sans font-bold text-xs uppercase tracking-widest text-muted-foreground">Título do Artigo</Label>
                      <Input value={editing.title ?? ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} placeholder="Título em Português..." required className="font-serif text-lg py-6" />
                    </div>
                    <div className="flex-1 flex flex-col min-h-[400px]">
                      <Label className="mb-2 font-bold text-xs uppercase tracking-widest text-muted-foreground">Conteúdo Completo</Label>
                      <Suspense fallback={<div className="p-12 text-center text-muted-foreground">Carregando editor rico...</div>}>
                        <ReactQuill 
                          theme="snow" 
                          value={editing.content || ""} 
                          onChange={(val) => setEditing({ ...editing, content: val })} 
                          className="editor-container"
                          modules={modulesPT}
                          placeholder="Escreva seu artigo aqui..."
                        />
                      </Suspense>
                    </div>
                  </TabsContent>

                  {/* ENGLISH CONTENT */}
                  <TabsContent value="english" className="flex-1 flex flex-col gap-4 m-0">
                    <div className="flex items-center justify-between">
                      <Label className="font-sans font-bold text-blue-600 uppercase tracking-widest text-xs">Translation Details (EN)</Label>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => autoTranslate('en')}
                        disabled={isTranslating}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-8 font-black gap-1 rounded-full border border-blue-100"
                      >
                        {isTranslating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                        TRADUZIR COM IA 🪄
                      </Button>
                    </div>
                    <Input value={editing.title_en ?? ""} onChange={(e) => setEditing({ ...editing, title_en: e.target.value })} placeholder="English title..." className="border-blue-100 py-6 text-lg font-serif" />
                    <div className="flex-1 flex flex-col min-h-[400px]">
                      <Suspense fallback={<div className="p-12 text-center text-muted-foreground">Loading editor...</div>}>
                        <ReactQuill 
                          theme="snow" 
                          value={editing.content_en || ""} 
                          onChange={(val) => setEditing({ ...editing, content_en: val })} 
                          className="editor-container border-blue-100"
                          modules={modulesEN}
                          placeholder="Clique em 'Traduzir com IA' para autocompletar"
                        />
                      </Suspense>
                    </div>
                  </TabsContent>

                  {/* SPANISH CONTENT */}
                  <TabsContent value="spanish" className="flex-1 flex flex-col gap-4 m-0">
                    <div className="flex items-center justify-between">
                      <Label className="font-sans font-bold text-red-600 uppercase tracking-widest text-xs">Detalles de Traducción (ES)</Label>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => autoTranslate('es')}
                        disabled={isTranslating}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 font-black gap-1 rounded-full border border-red-100"
                      >
                        {isTranslating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                        TRADUCIR CON IA 🪄
                      </Button>
                    </div>
                    <Input value={editing.title_es ?? ""} onChange={(e) => setEditing({ ...editing, title_es: e.target.value })} placeholder="Título en Español..." className="border-red-100 py-6 text-lg font-serif" />
                    <div className="flex-1 flex flex-col min-h-[400px]">
                      <Suspense fallback={<div className="p-12 text-center text-muted-foreground">Cargando editor...</div>}>
                        <ReactQuill 
                          theme="snow" 
                          value={editing.content_es || ""} 
                          onChange={(val) => setEditing({ ...editing, content_es: val })} 
                          className="editor-container border-red-100"
                          modules={modulesES}
                          placeholder="Clique em 'Traducir con IA' para autocompletar"
                        />
                      </Suspense>
                    </div>
                  </TabsContent>
                </div>

                <div className="flex items-center justify-between pt-6 border-t mt-4 shrink-0 px-1">
                  <div className="flex items-center gap-3">
                    <Switch checked={editing.is_published ?? true} onCheckedChange={(v) => setEditing({ ...editing, is_published: v })} />
                    <Label className="font-sans font-bold text-sm tracking-tight">Post publicado para os clientes</Label>
                  </div>
                  <div className="flex gap-3">
                    <Button type="button" variant="outline" onClick={() => setEditing(null)} className="font-sans px-8 h-10 rounded-xl">Descartar</Button>
                    <Button onClick={handleSave} className="font-sans px-12 h-10 bg-primary hover:bg-primary/90 text-white shadow-xl rounded-xl font-black" disabled={isUploading}>
                      {isNew ? "Publicar Agora" : "Salvar Artigo"}
                    </Button>
                  </div>
                </div>
              </Tabs>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminBlog;
