import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { fetchLovable, insertLovable, updateLovable, deleteLovable, uploadLovableFile, LovableBlogPost } from "@/integrations/lovable/client";
import { Plus, Pencil, Trash2, Image as ImageIcon, Upload, Globe } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminBlog = () => {
  const [posts, setPosts] = useState<LovableBlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<LovableBlogPost> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
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

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">Blog</h1>
          <p className="text-muted-foreground font-sans text-sm mt-1">Gerencie artigos, dicas de viagem e notícias.</p>
        </div>
        <Button onClick={() => { setEditing({ title: "", slug: "", content: "", is_published: true }); setIsNew(true); }} className="font-sans">
          <Plus className="w-4 h-4 mr-2" />Novo Post
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto pb-12">
        {isLoading ? (
          <div className="col-span-full text-center py-12 text-muted-foreground font-sans">Carregando...</div>
        ) : posts.length === 0 ? (
          <div className="col-span-full text-center py-12 text-muted-foreground font-sans">Nenhum post publicado.</div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="bg-card rounded-xl border overflow-hidden shadow-sm flex flex-col group">
              <div className="relative h-40 bg-muted">
                {post.image_url ? (
                  <img src={post.image_url} alt={post.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <ImageIcon className="w-8 h-8 opacity-50" />
                  </div>
                )}
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button size="icon" variant="secondary" className="h-8 w-8" onClick={() => { setEditing({ ...post }); setIsNew(false); }}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="destructive" className="h-8 w-8" onClick={() => handleDelete(post.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-sans uppercase tracking-wider ${post.is_published ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                    {post.is_published ? "Publicado" : "Rascunho"}
                  </span>
                </div>
                <h3 className="font-serif font-bold text-lg leading-tight mb-2 line-clamp-2">{post.title}</h3>
                <p className="text-xs text-muted-foreground font-sans mt-auto">/{post.slug}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="max-w-5xl h-[90vh] flex flex-col p-6">
          <DialogHeader className="shrink-0 mb-4">
            <DialogTitle className="font-serif text-2xl flex items-center gap-2">
              <Globe className="w-6 h-6 text-primary" />
              {isNew ? "Criar Novo Post" : "Editar Post"}
            </DialogTitle>
          </DialogHeader>
          
          {editing && (
            <div className="flex-1 flex flex-col gap-6 overflow-y-auto pr-2 pb-4">
               <Tabs defaultValue="portuguese" className="w-full h-full flex flex-col">
                <TabsList className="grid w-80 grid-cols-3 mb-4">
                  <TabsTrigger value="portuguese">PT</TabsTrigger>
                  <TabsTrigger value="english">EN</TabsTrigger>
                  <TabsTrigger value="spanish">ES</TabsTrigger>
                </TabsList>

                {/* Common Fields */}
                <div className="grid grid-cols-2 gap-4 mb-4 shrink-0 bg-muted/20 p-4 rounded-xl border border-border/50">
                  <div className="space-y-2">
                    <Label className="font-sans">Slug (ex: melhores-praias-rj)</Label>
                    <Input value={editing.slug ?? ""} onChange={(e) => setEditing({ ...editing, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })} placeholder="melhores-praias-rj" required />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-sans">Imagem de Capa</Label>
                    <div className="flex items-center gap-4">
                      {editing.image_url && (
                        <img src={editing.image_url} alt="Capa" className="h-10 w-10 object-cover rounded shadow" />
                      )}
                      <div className="relative flex-1">
                        <Input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="blog-image-upload" disabled={isUploading} />
                        <Label htmlFor="blog-image-upload" className={`flex items-center justify-center h-10 w-full border-2 border-dashed rounded-md cursor-pointer hover:bg-muted/50 transition-colors ${isUploading ? 'opacity-50' : ''}`}>
                          <Upload className="w-4 h-4 mr-2 text-muted-foreground" />
                          <span className="text-xs font-sans text-muted-foreground">{isUploading ? 'Enviando...' : 'Fazer Upload'}</span>
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* PORTUGUESE CONTENT */}
                <TabsContent value="portuguese" className="flex-1 flex flex-col gap-4 m-0">
                  <div className="space-y-2">
                    <Label className="font-sans">Título do Post (PT)</Label>
                    <Input value={editing.title ?? ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} required />
                  </div>
                  <div className="flex-1 grid grid-cols-2 gap-4 min-h-[300px]">
                    <div className="flex flex-col">
                      <Label className="mb-2">Conteúdo (Markdown PT)</Label>
                      <Textarea 
                        value={editing.content || ""} 
                        onChange={(e) => setEditing({ ...editing, content: e.target.value })} 
                        className="flex-1 font-mono text-sm leading-relaxed p-4 bg-background resize-none"
                        placeholder="Escreva em Português..."
                      />
                    </div>
                    <div className="flex flex-col">
                       <Label className="mb-2">Preview</Label>
                       <div className="flex-1 border rounded-md p-4 bg-muted/10 overflow-y-auto prose prose-xs dark:prose-invert max-w-none">
                         <div dangerouslySetInnerHTML={{ __html: (editing.content || "").replace(/\n/g, '<br/>') }} />
                       </div>
                    </div>
                  </div>
                </TabsContent>

                {/* ENGLISH CONTENT */}
                <TabsContent value="english" className="flex-1 flex flex-col gap-4 m-0">
                  <div className="space-y-2">
                    <Label className="font-sans text-blue-500">Post Title (EN)</Label>
                    <Input value={editing.title_en ?? ""} onChange={(e) => setEditing({ ...editing, title_en: e.target.value })} placeholder="English title..." />
                  </div>
                  <div className="flex-1 grid grid-cols-2 gap-4 min-h-[300px]">
                    <div className="flex flex-col">
                      <Label className="mb-2">Content (Markdown EN)</Label>
                      <Textarea 
                        value={editing.content_en || ""} 
                        onChange={(e) => setEditing({ ...editing, content_en: e.target.value })} 
                        className="flex-1 font-mono text-sm leading-relaxed p-4 bg-background resize-none border-blue-200"
                        placeholder="Write in English..."
                      />
                    </div>
                    <div className="flex-1 border rounded-md p-4 bg-muted/10 overflow-y-auto prose prose-xs dark:prose-invert max-w-none">
                        <div dangerouslySetInnerHTML={{ __html: (editing.content_en || "").replace(/\n/g, '<br/>') }} />
                    </div>
                  </div>
                </TabsContent>

                {/* SPANISH CONTENT */}
                <TabsContent value="spanish" className="flex-1 flex flex-col gap-4 m-0">
                  <div className="space-y-2">
                    <Label className="font-sans text-red-500">Título del Post (ES)</Label>
                    <Input value={editing.title_es ?? ""} onChange={(e) => setEditing({ ...editing, title_es: e.target.value })} placeholder="Título en Español..." />
                  </div>
                  <div className="flex-1 grid grid-cols-2 gap-4 min-h-[300px]">
                    <div className="flex flex-col">
                      <Label className="mb-2">Contenido (Markdown ES)</Label>
                      <Textarea 
                        value={editing.content_es || ""} 
                        onChange={(e) => setEditing({ ...editing, content_es: e.target.value })} 
                        className="flex-1 font-mono text-sm leading-relaxed p-4 bg-background resize-none border-red-200"
                        placeholder="Escribe en Español..."
                      />
                    </div>
                    <div className="flex-1 border rounded-md p-4 bg-muted/10 overflow-y-auto prose prose-xs dark:prose-invert max-w-none">
                        <div dangerouslySetInnerHTML={{ __html: (editing.content_es || "").replace(/\n/g, '<br/>') }} />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex items-center gap-2 pt-4 border-t mt-auto shrink-0">
                <Switch checked={editing.is_published ?? true} onCheckedChange={(v) => setEditing({ ...editing, is_published: v })} />
                <Label className="font-sans">Postar publicamente (Publicado)</Label>
              </div>
              
              <div className="flex justify-end gap-2 pt-4 bg-background shrink-0 pb-2">
                <Button type="button" variant="outline" onClick={() => setEditing(null)} className="font-sans">Cancelar</Button>
                <Button onClick={handleSave} className="font-sans px-8 bg-primary hover:bg-primary/90" disabled={isUploading}>
                  {isNew ? "Publicar" : "Salvar Alterações"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminBlog;
