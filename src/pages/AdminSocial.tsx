import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { fetchLovable, insertLovable, updateLovable, deleteLovable, LovableSocialMedia } from "@/integrations/lovable/client";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const PLATFORMS = [
  { value: "instagram", label: "Instagram" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "tripadvisor", label: "TripAdvisor" },
  { value: "facebook", label: "Facebook" },
  { value: "youtube", label: "YouTube" },
  { value: "tiktok", label: "TikTok" },
  { value: "twitter", label: "Twitter/X" },
  { value: "email", label: "Email" },
];

const AdminSocial = () => {
  const [socials, setSocials] = useState<LovableSocialMedia[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<LovableSocialMedia> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchLovable<LovableSocialMedia>("social_media").then((data) => {
      setSocials(data.sort((a, b) => a.sort_order - b.sort_order));
      setIsLoading(false);
    });
  }, []);

  const handleSave = async () => {
    if (!editing?.platform || !editing?.url) {
      toast({ title: "Erro", description: "Plataforma e URL são obrigatórios", variant: "destructive" });
      return;
    }

    try {
      if (isNew) {
        const newSocial = { ...editing, icon_name: editing.platform, sort_order: socials.length + 1 };
        await insertLovable("social_media", newSocial);
        toast({ title: "Rede social salva!" });
      } else if (editing.id) {
        await updateLovable("social_media", editing.id, editing);
        toast({ title: "Rede social atualizada!" });
      }

      const data = await fetchLovable<LovableSocialMedia>("social_media");
      setSocials(data.sort((a, b) => a.sort_order - b.sort_order));
      setEditing(null);
    } catch {
      toast({ title: "Erro", description: "Erro ao salvar", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Deseja excluir esta rede social?")) return;
    await deleteLovable("social_media", id);
    setSocials(socials.filter((s) => s.id !== id));
    toast({ title: "Rede social removida" });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">Redes Sociais</h1>
          <p className="text-muted-foreground font-sans text-sm mt-1">Gerencie os links de redes sociais do site</p>
        </div>
        <Button onClick={() => { setEditing({ platform: "", url: "", icon_name: "", is_active: true, sort_order: socials.length }); setIsNew(true); }} className="font-sans">
          <Plus className="w-4 h-4 mr-2" />Nova Rede
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground font-sans">Carregando...</div>
      ) : socials.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground font-sans">Nenhuma rede social cadastrada.</div>
      ) : (
        <div className="bg-card rounded-xl border border-border/50 divide-y divide-border/50">
          {socials.map((social) => (
            <div key={social.id} className="flex items-center gap-4 p-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-bold font-sans text-sm">{social.platform.charAt(0).toUpperCase()}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground font-sans capitalize">{social.platform}</h3>
                <p className="text-sm text-muted-foreground font-sans truncate">{social.url}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground font-sans">Header</span>
                <Switch 
                  checked={social.show_in_header !== false}
                  onCheckedChange={async (checked) => {
                    const updated = { ...social, show_in_header: checked };
                    await updateLovable("social_media", social.id, { show_in_header: checked });
                    setSocials(socials.map(s => s.id === social.id ? updated : s));
                  }}
                />
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-sans ${social.is_active ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                {social.is_active ? "Ativo" : "Inativo"}
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={() => { setEditing({ ...social }); setIsNew(false); }}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => handleDelete(social.id)}>
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-serif">{isNew ? "Nova Rede Social" : "Editar Rede Social"}</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="font-sans">Plataforma</Label>
                <Select value={editing.platform} onValueChange={(v) => setEditing({ ...editing, platform: v })}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    {PLATFORMS.map((p) => (
                      <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="font-sans">URL</Label>
                <Input value={editing.url ?? ""} onChange={(e) => setEditing({ ...editing, url: e.target.value })} placeholder="https://..." required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-sans">Ordem</Label>
                  <Input type="number" value={editing.sort_order ?? 0} onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })} />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <Switch checked={editing.is_active ?? true} onCheckedChange={(v) => setEditing({ ...editing, is_active: v })} />
                  <Label className="font-sans">Ativo</Label>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setEditing(null)} className="font-sans">Cancelar</Button>
                <Button onClick={handleSave} className="font-sans">Salvar</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminSocial;
