import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type SocialMedia = {
  id: string;
  platform: string;
  url: string;
  icon_name: string;
  is_active: boolean;
  sort_order: number;
};

const PLATFORMS = [
  { value: "instagram", label: "Instagram", icon: "Instagram" },
  { value: "whatsapp", label: "WhatsApp", icon: "Phone" },
  { value: "tripadvisor", label: "TripAdvisor", icon: "MapPin" },
  { value: "facebook", label: "Facebook", icon: "Facebook" },
  { value: "youtube", label: "YouTube", icon: "Youtube" },
  { value: "tiktok", label: "TikTok", icon: "Music" },
  { value: "twitter", label: "Twitter/X", icon: "Twitter" },
  { value: "email", label: "Email", icon: "Mail" },
];

const AdminSocial = () => {
  const [editing, setEditing] = useState<Partial<SocialMedia> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: socials = [], isLoading } = useQuery({
    queryKey: ["admin-social"],
    queryFn: async () => {
      const { data, error } = await supabase.from("social_media").select("*").order("sort_order");
      if (error) throw error;
      return data as SocialMedia[];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (social: Partial<SocialMedia>) => {
      if (social.id) {
        const { error } = await supabase.from("social_media").update(social).eq("id", social.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("social_media").insert(social);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-social"] });
      setEditing(null);
      toast({ title: "Rede social salva!" });
    },
    onError: (e: Error) => toast({ title: "Erro", description: e.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("social_media").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-social"] });
      toast({ title: "Rede social removida" });
    },
  });

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
              <span className={`text-xs px-2 py-0.5 rounded-full font-sans ${social.is_active ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                {social.is_active ? "Ativo" : "Inativo"}
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={() => { setEditing({ ...social }); setIsNew(false); }}><Pencil className="w-4 h-4" /></Button>
                <Button variant="outline" size="icon" onClick={() => deleteMutation.mutate(social.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
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
            <form onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(editing); }} className="space-y-4">
              <div className="space-y-2">
                <Label className="font-sans">Plataforma</Label>
                <Select
                  value={editing.platform}
                  onValueChange={(v) => {
                    const p = PLATFORMS.find((p) => p.value === v);
                    setEditing({ ...editing, platform: v, icon_name: p?.icon ?? "" });
                  }}
                >
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
                <Input value={editing.url ?? ""} onChange={(e) => setEditing({ ...editing, url: e.target.value })} placeholder="https://instagram.com/..." required />
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
                <Button type="submit" className="font-sans" disabled={saveMutation.isPending}>Salvar</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminSocial;
