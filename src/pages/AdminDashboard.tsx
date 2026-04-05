import { useEffect, useState } from "react";
import { Map, FileText, Image, Share2, Save, LayoutGrid, Globe } from "lucide-react";
import { ChangePassword } from "@/components/admin/ChangePassword";
import { fetchLovable, updateLovable, insertLovable, LovableSiteSetting } from "@/integrations/lovable/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const AdminDashboard = () => {
  const [counts, setCounts] = useState({ tours: 0, pages: 0, images: 0, social: 0 });
  const [settingsList, setSettingsList] = useState<LovableSiteSetting[]>([]);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingGeneral, setIsSavingGeneral] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      const [t, p, i, s, settingsData] = await Promise.all([
        fetchLovable<{ id: string }>("tours"),
        fetchLovable<{ id: string }>("pages"),
        fetchLovable<{ id: string }>("site_images"),
        fetchLovable<{ id: string }>("social_media"),
        fetchLovable<LovableSiteSetting>("site_settings"),
      ]);
      setCounts({
        tours: t.length,
        pages: p.length,
        images: i.length,
        social: s.length,
      });

      setSettingsList(settingsData);
      const settingsMap: Record<string, string> = {};
      settingsData.forEach((item) => { settingsMap[item.key] = item.value; });
      setSettings(settingsMap);
    };
    fetchData();
  }, []);

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      const keys = ['home_tours_columns', 'home_tours_count'];
      for (const key of keys) {
        if (settings[key]) {
          const settingRecord = settingsList.find(s => s.key === key);
          if (settingRecord?.id) {
            await updateLovable("site_settings", settingRecord.id, { value: settings[key] });
          } else {
            await insertLovable("site_settings", { key, value: settings[key] });
          }
        }
      }
      toast({ title: "Configurações da Home salvas!" });
      // Reload settings to get IDs
      const settingsData = await fetchLovable<LovableSiteSetting>("site_settings");
      setSettingsList(settingsData);
    } catch (err) {
      toast({ title: "Erro ao salvar", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveGeneral = async () => {
    setIsSavingGeneral(true);
    try {
      const keys = ['site_title'];
      for (const key of keys) {
        if (settings[key]) {
          const settingRecord = settingsList.find(s => s.key === key);
          if (settingRecord?.id) {
            await updateLovable("site_settings", settingRecord.id, { value: settings[key] });
          } else {
            await insertLovable("site_settings", { key, value: settings[key] });
          }
        }
      }
      toast({ title: "Configurações Gerais salvas!" });
      // Reload settings to get IDs
      const settingsData = await fetchLovable<LovableSiteSetting>("site_settings");
      setSettingsList(settingsData);
    } catch (err) {
      toast({ title: "Erro ao salvar", variant: "destructive" });
    } finally {
      setIsSavingGeneral(false);
    }
  };

  const cards = [
    { label: "Passeios", count: counts.tours, icon: Map, color: "bg-primary/10 text-primary" },
    { label: "Páginas", count: counts.pages, icon: FileText, color: "bg-secondary/20 text-secondary" },
    { label: "Imagens", count: counts.images, icon: Image, color: "bg-accent/20 text-accent-foreground" },
    { label: "Redes Sociais", count: counts.social, icon: Share2, color: "bg-destructive/10 text-destructive" },
  ];

  return (
    <div className="space-y-8 pb-12 font-sans">
      <h1 className="font-serif text-3xl font-bold text-foreground">Dashboard</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div key={card.label} className="bg-card rounded-2xl border border-border/50 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.color}`}>
                <card.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground font-sans">{card.count}</p>
                <p className="text-sm text-muted-foreground font-sans">{card.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* General Settings */}
        <div className="bg-card border rounded-3xl p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <Globe className="w-7 h-7 text-primary" />
            <h2 className="text-2xl font-bold font-serif">Configurações Gerais</h2>
          </div>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Título do Site (Aba do Navegador)</Label>
              <Input 
                value={settings['site_title'] || "Eco-Wanderlust | Passeios Inesquecíveis no Rio de Janeiro"} 
                onChange={(e) => setSettings({ ...settings, site_title: e.target.value })} 
                placeholder="Ex: Eco-Wanderlust | Passeios no Rio"
                className="h-12 rounded-xl"
              />
              <p className="text-[10px] text-muted-foreground italic">Este texto aparecerá no topo do navegador quando os clientes acessarem a home.</p>
            </div>
            <Button onClick={handleSaveGeneral} disabled={isSavingGeneral} className="w-full h-12 rounded-xl font-bold shadow-lg shadow-primary/20">
              {isSavingGeneral ? "Salvando..." : <><Save className="w-4 h-4 mr-2" /> Salvar Título</>}
            </Button>
          </div>
        </div>

        {/* Grid settings for Home */}
        <div className="bg-card border rounded-3xl p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <LayoutGrid className="w-7 h-7 text-[#2A9D8F]" />
            <h2 className="text-2xl font-bold font-serif">Aparência da Grade</h2>
          </div>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Colunas no Desktop (1 a 4)</Label>
              <Input 
                type="number" min={1} max={4} 
                value={settings['home_tours_columns'] || "3"} 
                onChange={(e) => setSettings({ ...settings, home_tours_columns: e.target.value })} 
                className="h-12 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Máximo de Passeios (Grade Principal)</Label>
              <Input 
                type="number" min={1} 
                value={settings['home_tours_count'] || "6"} 
                onChange={(e) => setSettings({ ...settings, home_tours_count: e.target.value })} 
                className="h-12 rounded-xl"
              />
            </div>
            <Button onClick={handleSaveSettings} variant="outline" disabled={isSaving} className="w-full h-12 rounded-xl font-bold border-2">
              {isSaving ? "Salvando..." : <><Save className="w-4 h-4 mr-2" /> Salvar Layout</>}
            </Button>
          </div>
        </div>

        <div className="md:col-span-2">
          <ChangePassword />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
