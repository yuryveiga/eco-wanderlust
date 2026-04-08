import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { fetchLovable, insertLovable, updateLovable, LovableSiteSetting } from "@/integrations/lovable/client";
import { useToast } from "@/hooks/use-toast";
import { LayoutTemplate, MonitorPlay, MonitorSmartphone, LayoutGrid } from "lucide-react";

const STYLES = [
  {
    id: "style1",
    name: "Clássico (Slideshow)",
    description: "Imagens de fundo em tela cheia que rotacionam suavemente a cada 6 segundos.",
    icon: MonitorPlay,
  },
  {
    id: "style2",
    name: "Moderno Split-Screen",
    description: "Tela dividida com texto ousado à esquerda e imagem imersiva à direita.",
    icon: MonitorSmartphone,
  },
  {
    id: "style3",
    name: "Imersão Glassmorphism",
    description: "Fundo cinemático fixo com um cartão de vidro fosco centralizado flutuando.",
    icon: LayoutGrid,
  }
];

const AdminHero = () => {
  const [activeStyle, setActiveStyle] = useState<string>("style1");
  const [dbSettingId, setDbSettingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setIsLoading(true);
    try {
      // Usaremos a tabela site_settings
      const settings = await fetchLovable<LovableSiteSetting>("site_settings");
      const heroSetting = settings.find(s => s.key === "hero_style");
      
      if (heroSetting) {
        setActiveStyle(heroSetting.value);
        setDbSettingId((heroSetting as any).id || heroSetting.key);
      }
    } catch (e) {
      console.error("Tabela site_settings talvez não exista", e);
    }
    setIsLoading(false);
  };

  const handleSave = async (styleId: string) => {
    setActiveStyle(styleId);
    
    try {
      if (dbSettingId) {
        await updateLovable("site_settings", dbSettingId, { value: styleId });
      } else {
        const res = await insertLovable("site_settings", { key: "hero_style", value: styleId });
        if (res) setDbSettingId((res as any).id || "hero_style");
      }
      localStorage.removeItem('site_settings');
      toast({ title: "Estilo do Hero atualizado com sucesso!" });
      setTimeout(() => window.location.reload(), 500);
    } catch (e) {
      console.error("Erro ao salvar hero style:", e);
      toast({ title: "Erro ao salvar", description: "Verifique se a tabela site_settings foi criada no Supabase.", variant: "destructive" });
    }
  };

  if (isLoading) return <div className="p-8 text-muted-foreground font-sans">Carregando...</div>;

  return (
    <div className="max-w-5xl">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-foreground">Estilo do Hero</h1>
        <p className="text-muted-foreground font-sans text-sm mt-1">
          A seção "Hero" é a primeira coisa que o cliente vê ao entrar no site. Escolha o design que mais combina com a vibração da marca.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {STYLES.map((style) => (
          <div 
            key={style.id}
            className={`relative bg-card rounded-xl border-2 overflow-hidden transition-all duration-300 cursor-pointer ${
              activeStyle === style.id 
                ? "border-primary shadow-lg ring-2 ring-primary/20 scale-[1.02]" 
                : "border-border/50 hover:border-primary/50"
            }`}
            onClick={() => handleSave(style.id)}
          >
            <div className="bg-muted aspect-[4/3] flex items-center justify-center border-b">
              {style.id === "style1" && (
                <div className="w-full h-full bg-slate-800 relative flex items-center justify-center p-4">
                  <span className="text-white/50 font-bold text-2xl tracking-widest border border-white/20 px-8 py-2">SLIDESHOW</span>
                </div>
              )}
              {style.id === "style2" && (
                <div className="w-full h-full flex">
                  <div className="w-1/2 bg-slate-900 p-4 flex flex-col justify-center gap-2">
                    <div className="w-3/4 h-4 bg-white/20 rounded"></div>
                    <div className="w-full h-8 bg-white/40 rounded"></div>
                    <div className="w-1/2 h-8 bg-white/40 rounded mb-4"></div>
                    <div className="w-1/3 h-6 bg-primary rounded-full"></div>
                  </div>
                  <div className="w-1/2 bg-slate-400"></div>
                </div>
              )}
              {style.id === "style3" && (
                <div className="w-full h-full bg-slate-800 relative flex items-center justify-center p-4">
                  <div className="w-3/4 h-3/4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 flex flex-col items-center justify-center gap-3">
                    <div className="w-2/3 h-6 bg-white/40 rounded"></div>
                    <div className="w-3/4 h-3 bg-white/20 rounded"></div>
                    <div className="w-3/4 h-3 bg-white/20 rounded"></div>
                    <div className="w-1/2 h-8 bg-primary rounded mt-2"></div>
                  </div>
                </div>
              )}
            </div>
            <div className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <style.icon className={`w-5 h-5 ${activeStyle === style.id ? "text-primary" : "text-muted-foreground"}`} />
                <h3 className="font-sans font-bold text-lg">{style.name}</h3>
              </div>
              <p className="text-sm text-muted-foreground font-sans line-clamp-3">
                {style.description}
              </p>
              
              <Button 
                variant={activeStyle === style.id ? "default" : "outline"}
                className={`w-full mt-4 font-sans ${activeStyle === style.id ? "pointer-events-none" : ""}`}
              >
                {activeStyle === style.id ? "Ativo" : "Ativar Estilo"}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminHero;
