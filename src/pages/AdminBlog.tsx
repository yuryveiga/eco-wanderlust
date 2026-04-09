import { useState, useEffect, lazy, Suspense, useMemo, useCallback, useRef } from "react";
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

// Importing Quill and registering the module
import { Quill } from "react-quill";
// @ts-ignore
import ImageResize from "quill-image-resize-module-react";
Quill.register("modules/imageResize", ImageResize);

const ReactQuill = lazy(() => import('react-quill'));

const AdminBlog = () => {
  const [posts, setPosts] = useState<LovableBlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<LovableBlogPost> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isTranslatingAll, setIsTranslatingAll] = useState(false);
  const { toast } = useToast();
  
  // Ref to avoid constant re-renders causing editor to lose focus
  const quillRef = useRef<any>(null);

  const loadPosts = async () => {
    const data = await fetchLovable<LovableBlogPost>("blog_posts");
    setPosts(data.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()));
    setIsLoading(false);
  };

  useEffect(() => {
    loadPosts();
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

  const imageHandler = useCallback(() => {
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
           // Insert image into current editor focus
           const quill = quillRef.current?.getEditor();
           if (quill) {
              const range = quill.getSelection(true);
              quill.insertEmbed(range.index, 'image', url);
           }
        }
      } catch (err) {
        toast({ title: "Erro", description: "Falha ao enviar." });
      }
    };
  }, [toast]);

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ 'align': [] }],
        ['link', 'image', 'video'],
        ['clean'],
      ],
      handlers: { image: imageHandler }
    },
    imageResize: {
      parrentElement: "body",
      modules: ["Resize", "DisplaySize", "Toolbar"], // Toolbar provides alignment options for images
    }
  }), [imageHandler]);

  const formats = [
    "header", "bold", "italic", "underline", "strike",
    "list", "bullet", "align", "link", "image", "video"
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden font-sans">
      <style>{`
        .editor-container {
          display: flex;
          flex-direction: column;
          height: 100%;
          min-height: 500px;
        }
        .editor-container .ql-container {
          flex: 1;
          min-height: 400px;
          font-family: inherit;
          font-size: 16px;
          border-bottom-left-radius: 12px;
          border-bottom-right-radius: 12px;
          background: white;
        }
        .editor-container .ql-editor {
          min-height: 400px;
          line-height: 1.6;
        }
        .editor-container .ql-toolbar {
          border-top-left-radius: 12px;
          border-top-right-radius: 12px;
          background: #fdfdfd;
          border-bottom: 1px solid #eee;
        }
        .ql-image-resize-module {
          z-index: 100 !important;
        }
      `}</style>
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">Blog Premium</h1>
          <p className="text-muted-foreground font-sans text-sm mt-1">Crie conteúdo rico com imagens alinháveis e traduções automáticas.</p>
        </div>
        <Button onClick={() => { setEditing({ title: "", slug: "", content: "", is_published: true }); setIsNew(true); }} className="font-sans h-12 px-8 rounded-xl shadow-lg">
          <Plus className="w-4 h-4 mr-2" />Novo Post
        </Button>
        <Button 
          variant="outline" 
          onClick={async () => {
            if (!confirm("Traduzir TODOS os posts para inglês e espanhol?")) return;
            setIsTranslatingAll(true);
            let translated = 0;
            for (const post of posts) {
              try {
                const [titleEn, titleEs, excerptEn, excerptEs] = await Promise.all([
                  translateText(post.title || "", "en"),
                  translateText(post.title || "", "es"),
                  translateText(post.excerpt || "", "en"),
                  translateText(post.excerpt || "", "es"),
                ]);
                await updateLovable("blog_posts", post.id, {
                  title_en: titleEn,
                  title_es: titleEs,
                  excerpt_en: excerptEn,
                  excerpt_es: excerptEs,
                });
                translated++;
              } catch (e) {
                console.error("Error translating post:", post.id, e);
              }
            }
            setIsTranslatingAll(false);
            toast({ title: `${translated} posts traduzidos!` });
            loadPosts();
          }}
          disabled={isTranslatingAll}
          className="font-sans h-12 px-6 rounded-xl"
        >
          {isTranslatingAll ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
          Traduzir Todos
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto pb-12 pr-1">
        {isLoading ? (
          <div className="col-span-full text-center py-24 text-muted-foreground animate-pulse font-sans">Carregando Biblioteca de Posts...</div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="bg-card rounded-2xl border border-border/50 overflow-hidden shadow-sm flex flex-col group hover:shadow-xl transition-all duration-300">
              <div className="relative h-44 bg-muted">
                {post.image_url ? (
                  <img src={post.image_url} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground"><ImageIcon className="w-10 opacity-20" /></div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4 gap-2">
                   <Button size="sm" variant="secondary" className="flex-1 font-bold h-9 bg-white/90" onClick={() => { setEditing({ ...post }); setIsNew(false); }}><Pencil className="w-4 h-4 mr-2" />Editar</Button>
                   <Button size="icon" variant="destructive" className="h-9 w-9" onClick={() => handleDelete(post.id)}><Trash2 className="w-4 h-4" /></Button>
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest self-start mb-3 ${post.is_published ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>{post.is_published ? "PUBLICADO" : "RASCUNHO"}</span>
                <h3 className="font-serif font-bold text-xl leading-tight mb-2 line-clamp-2">{post.title}</h3>
                <p className="text-[10px] text-muted-foreground font-sans mt-auto py-2 border-t font-mono">/{post.slug}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="max-w-[1400px] w-[95vw] min-h-[85vh] h-[95vh] flex flex-col p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="p-6 pb-0 border-b bg-muted/10 shrink-0">
            <DialogTitle className="font-serif text-2xl flex items-center gap-3 mb-4">
              <Type className="w-7 h-7 text-primary" />
              {isNew ? "Nova Publicação" : "Ajustar Conteúdo"}
            </DialogTitle>
          </DialogHeader>
          
           {editing && (
             <div className="flex-1 flex flex-col overflow-hidden">
                <div className="px-6 py-4 flex items-center justify-between bg-muted/5 shrink-0 border-b">
                    <span className="text-sm font-bold text-muted-foreground">Editor de Blog</span>
                    
                    <div className="flex items-center gap-4">
                       <div className="flex items-center gap-2">
                          <Switch checked={editing.is_published ?? true} onCheckedChange={(v) => setEditing({ ...editing, is_published: v })} />
                          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Publicado</span>
                       </div>
                       <div className="h-6 w-px bg-border mx-2" />
                       <Button variant="ghost" onClick={() => setEditing(null)} className="font-bold">Cancelar</Button>
                       <Button onClick={handleSave} className="bg-primary hover:bg-primary/90 text-white font-black px-10 rounded-xl h-12 shadow-xl shadow-primary/20">Salvar Mudanças</Button>
                    </div>
                 </div>

                 <div className="flex-1 flex gap-8 overflow-hidden p-8 bg-muted/[0.02]">
                    {/* Left Sidebar for Metadata */}
                    <div className="w-80 flex flex-col gap-6 shrink-0 overflow-y-auto pr-4 scrollbar-thin">
                       <div className="space-y-3">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-primary">Imagem de Destaque</Label>
                          <div className="aspect-video rounded-2xl bg-muted border-2 border-dashed border-border/50 overflow-hidden relative group">
                             {editing.image_url ? (
                                <img src={editing.image_url} alt="Destaque" className="w-full h-full object-cover" />
                             ) : (
                                <div className="flex flex-col items-center justify-center h-full gap-2 p-6 text-center text-muted-foreground">
                                   <Upload className="w-6 h-6 opacity-30" />
                                   <span className="text-[9px] font-bold">Faça upload da imagem de capa</span>
                                </div>
                             )}
                             <Input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="blog-capa-upload" />
                             <Label htmlFor="blog-capa-upload" className="absolute inset-0 cursor-pointer bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold transition-opacity">Trocar Imagem</Label>
                          </div>
                       </div>

                       <div className="space-y-3">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-primary">URL amigável (SLUG)</Label>
                          <Input value={editing.slug ?? ""} onChange={(e) => setEditing({ ...editing, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })} className="font-mono text-xs h-12 rounded-xl bg-muted/20 border-none shadow-inner" placeholder="ex: explorando-rio" />
                       </div>

                       <div className="mt-4 p-5 rounded-2xl bg-primary/5 border border-primary/10 space-y-3">
                          <h4 className="font-serif font-bold text-primary text-sm">Tradução Automática</h4>
                          <div className="flex flex-col gap-2">
                            <Button onClick={() => autoTranslate('en')} disabled={isTranslating} variant="outline" size="sm" className="w-full h-9 border-blue-200 text-blue-600 font-bold bg-white text-xs">{isTranslating ? <Loader2 className="animate-spin w-3" /> : 'Traduzir para Inglês'}</Button>
                            <Button onClick={() => autoTranslate('es')} disabled={isTranslating} variant="outline" size="sm" className="w-full h-9 border-red-200 text-red-600 font-bold bg-white text-xs">{isTranslating ? <Loader2 className="animate-spin w-3" /> : 'Traduzir para Espanhol'}</Button>
                          </div>
                       </div>
                    </div>

                    {/* Editor Area */}
                    <div className="flex-1 flex flex-col gap-6 overflow-hidden min-h-0">
                       <div className="space-y-2 shrink-0">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-primary">Título</Label>
                          <Input value={editing.title ?? ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className="h-16 text-2xl font-serif font-bold border-none bg-white shadow-sm px-6 rounded-2xl" placeholder="Título impactante..." />
                       </div>
                       <div className="flex-1 flex flex-col overflow-hidden rounded-2xl shadow-sm border bg-white min-h-0">
                          <Suspense fallback={<div className="p-24 text-center font-sans">Carregando Editor de Conteúdo...</div>}>
                             <ReactQuill 
                                ref={quillRef}
                                theme="snow" 
                                value={editing.content || ""} 
                                onChange={(val) => setEditing({ ...editing, content: val })} 
                                className="editor-container"
                                modules={modules}
                                formats={formats}
                                placeholder="Comece a contar sua história..."
                             />
                          </Suspense>
                       </div>
                    </div>
                  </div>
             </div>
           )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminBlog;
