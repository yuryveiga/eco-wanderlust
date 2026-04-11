import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { fetchLovable, insertLovable, deleteLovable, updateLovable, LovableProfile } from "@/integrations/lovable/client";
import { Plus, Trash2, Users, Shield, User, KeyRound } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DeleteConfirmDialog } from "@/components/admin/DeleteConfirmDialog";
import { supabase } from "@/integrations/supabase/client";


const AdminUsers = () => {
  const [profiles, setProfiles] = useState<LovableProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState("user");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetNewPassword, setResetNewPassword] = useState("");
  const [isResetting, setIsResetting] = useState(false);

  const { toast } = useToast();


  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    const data = await fetchLovable<LovableProfile>("profiles");
    setProfiles(data);
    setIsLoading(false);
  };

  const handleCreate = async () => {
    if (!newEmail) return;
    try {
      await insertLovable("profiles", { email: newEmail, role: newRole });
      toast({ title: "Usuário cadastrado!" });
      setNewEmail("");
      setIsDialogOpen(false);
      loadProfiles();
    } catch {
      toast({ title: "Erro ao criar", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    await deleteLovable("profiles", id);
    loadProfiles();
    toast({ title: "Usuário removido" });
    setItemToDelete(null);
  };


  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground flex items-center gap-2">
            <Users className="w-8 h-8 text-primary" />
            Gerenciar Usuários
          </h1>
          <p className="text-muted-foreground font-sans text-sm mt-1">Controle quem tem acesso ao painel administrativo.</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="font-sans">
          <Plus className="w-4 h-4 mr-2" />Novo Usuário
        </Button>
      </div>

      <div className="flex-1 overflow-auto pr-2 pb-8">
        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground font-sans">Carregando...</div>
        ) : profiles.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground font-sans">Nenhum usuário cadastrado.</div>
        ) : (
          <div className="bg-card rounded-xl border border-border/50 divide-y divide-border/50">
            {profiles.map((profile) => (
              <div key={profile.id} className="flex items-center gap-4 p-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${profile.role === 'admin' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                  {profile.role === 'admin' ? <Shield className="w-5 h-5" /> : <User className="w-5 h-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground font-sans truncate">{profile.email}</h3>
                  <select
                    className="text-sm bg-transparent border border-border/50 rounded px-2 py-0.5 font-sans text-muted-foreground cursor-pointer hover:border-primary/50 transition-colors"
                    value={profile.role}
                    onChange={async (e) => {
                      const newRole = e.target.value;
                      const success = await updateLovable("profiles", profile.id, { role: newRole });
                      if (success) {
                        toast({ title: `Role alterada para ${newRole}` });
                        loadProfiles();
                      } else {
                        toast({ title: "Erro ao alterar role", variant: "destructive" });
                      }
                    }}
                  >
                    <option value="user">Usuário</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" title="Trocar senha" onClick={() => { setResetEmail(profile.email); setResetNewPassword(""); setResetDialogOpen(true); }}>
                    <KeyRound className="w-4 h-4 text-primary" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => setItemToDelete(profile.id)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif">Cadastrar Novo Usuário</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>E-mail do Usuário</Label>
              <Input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="email@exemplo.com" />
            </div>
            <div className="space-y-2">
              <Label>Nível de Acesso (Role)</Label>
              <select 
                className="w-full bg-background border rounded-md p-2 font-sans"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
              >
                <option value="user">Usuário (Padrão)</option>
                <option value="admin">Administrador (Total)</option>
              </select>
            </div>
            <p className="text-[10px] text-muted-foreground">
              Nota: O usuário deve utilizar este e-mail para acessar o painel.
            </p>
            <Button onClick={handleCreate} className="w-full mt-4">Salvar Usuário</Button>
          </div>
        </DialogContent>
      </Dialog>
      <DeleteConfirmDialog 
        open={!!itemToDelete} 
        onOpenChange={(open) => !open && setItemToDelete(null)} 
        onConfirm={() => itemToDelete && handleDelete(itemToDelete)}
        title="Excluir Usuário"
        description="Tem certeza que deseja remover o acesso deste usuário? Ele não poderá mais acessar o painel administrativo."
      />

      <Dialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif">Trocar Senha</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground font-sans">
              Enviando link de redefinição de senha para: <strong>{resetEmail}</strong>
            </p>
            <Button
              onClick={async () => {
                setIsResetting(true);
                const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
                  redirectTo: `${window.location.origin}/admin/reset-password`,
                });
                if (error) {
                  toast({ title: "Erro", description: error.message, variant: "destructive" });
                } else {
                  toast({ title: "Link enviado!", description: `Email de redefinição enviado para ${resetEmail}.` });
                  setResetDialogOpen(false);
                }
                setIsResetting(false);
              }}
              className="w-full"
              disabled={isResetting}
            >
              {isResetting ? "Enviando..." : "Enviar link de redefinição por email"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default AdminUsers;
