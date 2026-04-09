import { useState, useEffect, lazy, Suspense, useMemo, useCallback, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { fetchLovable, insertLovable, updateLovable, deleteLovable, uploadLovableFile, LovableBlogPost, LovableSiteImage } from "@/integrations/lovable/client";
import { Plus, Pencil, Trash2, Image as ImageIcon, Upload, Type, Sparkles, Loader2, Star, FolderOpen } from "lucide-react";
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
  const [searchParams] = useSearchParams();
  const [posts, setPosts] = useState<LovableBlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<LovableBlogPost> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isTranslatingAll, setIsTranslatingAll] = useState(false);
  const [galleryImages, setGalleryImages] = useState<LovableSiteImage[]>([]);
  const { toast } = useToast();

  const loadPosts = async () => {
    console.log("loadPosts called");
    setIsLoading(true);
    const data = await fetchLovable<LovableBlogPost>("blog_posts");
    setPosts(data.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()));
    setIsLoading(false);
  };

  useEffect(() => {
    loadPosts();
  }, []);

  useEffect(() => {
    const postId = searchParams.get('post');
    if (postId && posts.length > 0) {
      const post = posts.find(p => p.id === postId);
      if (post) {
        setEditing(post);
        setIsNew(false);
      }
    }
  }, [searchParams, posts]);

  const loadGalleryImages = async () => {
    const imgs = await fetchLovable<LovableSiteImage>("site_images");
    setGalleryImages(imgs.filter(i => i.key?.startsWith('gallery')));
  };

  useEffect(() => {
    if (editing) {
      loadGalleryImages();
    }
  }, [editing]);

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

  const autoTranslate = async () => {
    if (!editing) return;
    if (!editing.title && !editing.content) {
      toast({ title: "Atenção", description: "Escreva algo em Português primeiro." });
      return;
    }

    setIsTranslating(true);
    toast({ title: "Mágica em andamento...", description: "Traduzindo para Inglês e Espanhol..." });

    try {
      const [titleEn, titleEs, contentEn, contentEs] = await Promise.all([
        translateText(editing.title || "", "en"),
        translateText(editing.title || "", "es"),
        translateHtml(editing.content || "", "en"),
        translateHtml(editing.content || "", "es")
      ]);

      setEditing(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          title_en: titleEn,
          title_es: titleEs,
          content_en: contentEn,
          content_es: contentEs
        } as Partial<LovableBlogPost>;
      });
      
      toast({ title: "Sucesso!", description: "Tradução para Inglês e Espanhol concluída." });
    } catch (err) {
      toast({ title: "Erro na tradução", description: "Tente novamente daqui a pouco.", variant: "destructive" });
    } finally {
      setIsTranslating(false);
    }
  };

  const [showGalleryPicker, setShowGalleryPicker] = useState(false);
  const quillRef = useRef<any>(null);

  const imageHandler = useCallback(() => {
    const choice = confirm("Escolher da galeria do site? (OK = Galeria, Cancelar = Upload)");
    if (choice) {
      setShowGalleryPicker(true);
    } else {
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
    }
  }, [toast]);

  const insertImageFromGallery = (url: string) => {
    const quill = quillRef.current?.getEditor();
    if (quill) {
      const range = quill.getSelection(true);
      quill.insertEmbed(range.index, 'image', url);
    }
    setShowGalleryPicker(false);
    toast({ title: "Imagem inserida!" });
  };

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
          {editing && (
            <Tabs defaultValue="content" className="flex-1 flex flex-col overflow-hidden">
              <DialogHeader className="p-6 pb-0 border-b bg-muted/10 shrink-0">
                <DialogTitle className="font-serif text-2xl flex items-center gap-3 mb-4">
                  <Type className="w-7 h-7 text-primary" />
                  {isNew ? "Nova Publicação" : "Ajustar Conteúdo"}
                </DialogTitle>
                <TabsList className="h-12 bg-transparent border-b w-full justify-start gap-4">
                  <TabsTrigger value="content" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-2 font-bold">Conteúdo</TabsTrigger>
                  <TabsTrigger value="gallery" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-2 font-bold">Galeria</TabsTrigger>
                </TabsList>
              </DialogHeader>
              
              <div className="px-6 py-3 border-b bg-muted/5 flex justify-end gap-3">
                <Button variant="outline" onClick={() => setEditing(null)}>Cancelar</Button>
                <Button onClick={handleSave}>{isNew ? "Criar Post" : "Salvar Alterações"}</Button>
              </div>
              
              <TabsContent value="content" className="m-0 flex-1 overflow-hidden">
                <div className="flex-1 flex gap-8 overflow-hidden p-8 bg-muted/[0.02]">
                    {/* Left Sidebar for Metadata */}
                    <div className="w-80 flex flex-col gap-6 shrink-0 overflow-y-auto pr-4 scrollbar-thin">
                       <div className="space-y-3">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-primary">Imagem de Capa</Label>
                          <div className="aspect-video rounded-2xl bg-muted border-2 border-dashed border-border/50 overflow-hidden relative group">
                             {editing.image_url ? (
                                <img src={editing.image_url} alt="Destaque" className="w-full h-full object-cover" />
                             ) : (
                                <div className="flex flex-col items-center justify-center h-full gap-2 p-6 text-center text-muted-foreground">
                                   <Upload className="w-6 h-6 opacity-30" />
                                   <span className="text-[9px] font-bold">Upload ou escolha da galeria</span>
                                </div>
                             )}
                             <div className="absolute inset-0 flex gap-2 justify-center items-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button size="sm" variant="secondary" className="h-8 bg-white">
                                  <Upload className="w-3 h-3 mr-1" />Upload
                                </Button>
                                <Button size="sm" variant="secondary" className="h-8 bg-white" onClick={() => setShowGalleryPicker(true)}>
                                  <FolderOpen className="w-3 h-3 mr-1" />Galeria
                                </Button>
                             </div>
                             <Input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="blog-capa-upload" />
                          </div>
                       </div>

                       <div className="space-y-3">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-primary">URL amigável (SLUG)</Label>
                          <Input value={editing.slug ?? ""} onChange={(e) => setEditing({ ...editing, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })} className="font-mono text-xs h-12 rounded-xl bg-muted/20 border-none shadow-inner" placeholder="ex: explorando-rio" />
                       </div>

                        <div className="mt-4 p-5 rounded-2xl bg-primary/5 border border-primary/10 space-y-3">
                           <h4 className="font-serif font-bold text-primary text-sm">Tradução Automática</h4>
                           <Button onClick={() => autoTranslate()} disabled={isTranslating} variant="outline" size="sm" className="w-full h-9 font-bold bg-white text-xs">{isTranslating ? <Loader2 className="animate-spin w-3 mr-2" /> : <Sparkles className="w-3 mr-2" />}Traduzir para EN e ES</Button>
                        </div>
                    </div>

                    {/* Editor Area */}
                    <div className="flex-1 flex flex-col gap-6 overflow-hidden min-h-0">
                       <div className="space-y-2 shrink-0">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-primary">Título</Label>
                          <Input value={editing.title ?? ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className="h-16 text-2xl font-serif font-bold border-none bg-white shadow-sm px-6 rounded-2xl" placeholder="Título impactante..." />
                       </div>
                        <div className="flex-1 flex flex-col overflow-hidden rounded-2xl shadow-sm border bg-white min-h-0 max-h-[500px]">
                           <Suspense fallback={<div className="p-24 text-center font-sans">Carregando Editor de Conteúdo...</div>}>
                              <ReactQuill 
                                 ref={quillRef}
                                 theme="snow" 
                                 value={editing.content || ""} 
                                 onChange={(val) => setEditing({ ...editing, content: val })} 
                                 className="editor-container h-full"
                                 modules={modules}
                                 formats={formats}
                                 placeholder="Comece a contar sua história..."
                              />
                           </Suspense>
                        </div>
                    </div>
                 </div>
               </TabsContent>

               <TabsContent value="gallery" className="m-0 flex-1 overflow-y-auto p-8">
                 <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-lg">Selecionar Imagem de Capa</h3>
                        <p className="text-sm text-muted-foreground">Escolha uma imagem da galeria do site</p>
                      </div>
                    </div>
                    
                    {galleryImages.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">Nenhuma imagem na galeria</div>
                    ) : (
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                        {galleryImages.map((img) => (
                          <button
                            key={img.id}
                            onClick={() => setEditing({ ...editing, image_url: img.image_url })}
                            className={`relative aspect-square rounded-xl overflow-hidden border-4 transition-all ${editing.image_url === img.image_url ? "border-primary ring-4 ring-primary/20" : "border-transparent hover:border-primary/50"}`}
                          >
                            <img src={img.image_url} alt={img.label || ""} className="w-full h-full object-cover" />
                            {editing.image_url === img.image_url && (
                              <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-1">
                                <Star className="w-4 h-4 fill-white" />
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                 </div>
               </TabsContent>
             </Tabs>
            )}
        </DialogContent>

        {/* Gallery Picker Modal */}
        <Dialog open={showGalleryPicker} onOpenChange={setShowGalleryPicker}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle>Escolher da Galeria do Site</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-4 overflow-y-auto max-h-[60vh] p-4">
              {galleryImages.map((img) => (
                <button
                  key={img.id}
                  onClick={() => {
                    insertImageFromGallery(img.image_url);
                  }}
                  className="relative aspect-square rounded-lg overflow-hidden border-2 hover:border-primary transition-all"
                >
                  <img src={img.image_url} alt={img.label || ""} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </Dialog>
    </div>
  );
};

export default AdminBlog;
