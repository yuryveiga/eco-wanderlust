import { useEffect, useState } from "react";
import { Map, FileText, Image, Share2, Save, LayoutGrid } from "lucide-react";
import { ChangePassword } from "@/components/admin/ChangePassword";
import { fetchLovable, updateLovable, LovableSiteSetting } from "@/integrations/lovable/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const AdminDashboard = () => {
  const [counts, setCounts] = useState({ tours: 0, pages: 0, images: 0, social: 0 });
  const [settingsList, setSettingsList] = useState<LovableSiteSetting[]>([]);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
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
          }
        }
      }
      toast({ title: "Configurações da Home salvas!" });
    } catch (err) {
      toast({ title: "Erro ao salvar", description: "Verifique o console para mais detalhes", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const cards = [
    { label: "Passeios", count: counts.tours, icon: Map, color: "bg-primary/10 text-primary" },
    { label: "Páginas", count: counts.pages, icon: FileText, color: "bg-secondary/20 text-secondary" },
    { label: "Imagens", count: counts.images, icon: Image, color: "bg-accent/20 text-accent-foreground" },
    { label: "Redes Sociais", count: counts.social, icon: Share2, color: "bg-destructive/10 text-destructive" },
  ];

  return (
    <div className="space-y-8 pb-12">
      <h1 className="font-serif text-3xl font-bold text-foreground">Dashboard</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div key={card.label} className="bg-card rounded-xl border border-border/50 p-6 shadow-sm">
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
        {/* Grid settings for Home */}
        <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <LayoutGrid className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-bold font-serif">Configuração da Grade (Home)</h2>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Número de Colunas (Desktop)</Label>
              <Input 
                type="number" min={1} max={4} 
                value={settings['home_tours_columns'] || "3"} 
                onChange={(e) => setSettings({ ...settings, home_tours_columns: e.target.value })} 
              />
            </div>
            <div className="space-y-2">
              <Label>Máximo de Passeios na Home</Label>
              <Input 
                type="number" min={1} 
                value={settings['home_tours_count'] || "6"} 
                onChange={(e) => setSettings({ ...settings, home_tours_count: e.target.value })} 
              />
              <p className="text-[10px] text-muted-foreground">O número de colunas se ajustará automaticamente em celulares.</p>
            </div>
            <Button onClick={handleSaveSettings} disabled={isSaving} className="w-full">
              {isSaving ? "Salvando..." : <><Save className="w-4 h-4 mr-2" /> Salvar Grade</>}
            </Button>
          </div>
        </div>

        <ChangePassword />
      </div>
    </div>
  );
};

export default AdminDashboard;
