import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fetchLovable, insertLovable, updateLovable, LovableSiteSetting } from "@/integrations/lovable/client";
import { useToast } from "@/hooks/use-toast";
import { LayoutTemplate, MonitorPlay, MonitorSmartphone, LayoutGrid, Type, Save } from "lucide-react";

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
  const [heroTitle, setHeroTitle] = useState<string>("");
  const [heroSubtitle, setHeroSubtitle] = useState<string>("");
  const [cityToursTitle, setCityToursTitle] = useState<string>("City Tours");
  const [cityToursSubtitle, setCityToursSubtitle] = useState<string>("Explore a cidade com nossos guias especializados");
  const [hikingToursTitle, setHikingToursTitle] = useState<string>("Trilhas e Adventures");
  const [hikingToursSubtitle, setHikingToursSubtitle] = useState<string>("Descubra trilhas incríveis e aventuras na natureza");
  const [dbSettingId, setDbSettingId] = useState<string | null>(null);
  const [dbTitleId, setDbTitleId] = useState<string | null>(null);
  const [dbSubtitleId, setDbSubtitleId] = useState<string | null>(null);
  const [dbCityTitleId, setDbCityTitleId] = useState<string | null>(null);
  const [dbCitySubtitleId, setDbCitySubtitleId] = useState<string | null>(null);
  const [dbHikingTitleId, setDbHikingTitleId] = useState<string | null>(null);
  const [dbHikingSubtitleId, setDbHikingSubtitleId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setIsLoading(true);
    try {
      const settings = await fetchLovable<LovableSiteSetting>("site_settings");
      console.log("Settings carregados:", settings);
      
      const heroStyleSetting = settings.find(s => s.key === "hero_style");
      if (heroStyleSetting) {
        setActiveStyle(heroStyleSetting.value);
        setDbSettingId((heroStyleSetting as any).id);
      }
      
      const heroTitleSetting = settings.find(s => s.key === "hero_title");
      if (heroTitleSetting) {
        setHeroTitle(heroTitleSetting.value);
        setDbTitleId((heroTitleSetting as any).id);
      } else {
        setHeroTitle("Eco-Wanderlust | Passeios Inesquecíveis no Rio de Janeiro");
      }
      
      const heroSubtitleSetting = settings.find(s => s.key === "hero_subtitle");
      if (heroSubtitleSetting) {
        setHeroSubtitle(heroSubtitleSetting.value);
        setDbSubtitleId((heroSubtitleSetting as any).id);
      } else {
        setHeroSubtitle("Descubra a magia do Rio de Janeiro com nossos passeios exclusivos e guias especializados.");
      }
      
      const cityTitleSetting = settings.find(s => s.key === "city_tours_title");
      if (cityTitleSetting) {
        setCityToursTitle(cityTitleSetting.value);
        setDbCityTitleId((cityTitleSetting as any).id);
      }
      
      const citySubtitleSetting = settings.find(s => s.key === "city_tours_subtitle");
      if (citySubtitleSetting) {
        setCityToursSubtitle(citySubtitleSetting.value);
        setDbCitySubtitleId((citySubtitleSetting as any).id);
      }
      
      const hikingTitleSetting = settings.find(s => s.key === "hiking_tours_title");
      if (hikingTitleSetting) {
        setHikingToursTitle(hikingTitleSetting.value);
        setDbHikingTitleId((hikingTitleSetting as any).id);
      }
      
      const hikingSubtitleSetting = settings.find(s => s.key === "hiking_tours_subtitle");
      if (hikingSubtitleSetting) {
        setHikingToursSubtitle(hikingSubtitleSetting.value);
        setDbHikingSubtitleId((hikingSubtitleSetting as any).id);
      }
    } catch (e) {
      console.error("Erro ao carregar site_settings:", e);
    }
    setIsLoading(false);
  };

  const handleSaveTitleSubtitle = async () => {
    try {
      let success = true;
      
      if (dbTitleId) {
        await updateLovable("site_settings", dbTitleId, { value: heroTitle });
      } else {
        const res = await insertLovable("site_settings", { key: "hero_title", value: heroTitle });
        if (res) setDbTitleId((res as any).id);
      }
      
      if (dbSubtitleId) {
        await updateLovable("site_settings", dbSubtitleId, { value: heroSubtitle });
      } else {
        const res = await insertLovable("site_settings", { key: "hero_subtitle", value: heroSubtitle });
        if (res) setDbSubtitleId((res as any).id);
      }
      
      if (dbCityTitleId) {
        await updateLovable("site_settings", dbCityTitleId, { value: cityToursTitle });
      } else {
        const res = await insertLovable("site_settings", { key: "city_tours_title", value: cityToursTitle });
        if (res) setDbCityTitleId((res as any).id);
      }
      
      if (dbCitySubtitleId) {
        await updateLovable("site_settings", dbCitySubtitleId, { value: cityToursSubtitle });
      } else {
        const res = await insertLovable("site_settings", { key: "city_tours_subtitle", value: cityToursSubtitle });
        if (res) setDbCitySubtitleId((res as any).id);
      }
      
      if (dbHikingTitleId) {
        await updateLovable("site_settings", dbHikingTitleId, { value: hikingToursTitle });
      } else {
        const res = await insertLovable("site_settings", { key: "hiking_tours_title", value: hikingToursTitle });
        if (res) setDbHikingTitleId((res as any).id);
      }
      
      if (dbHikingSubtitleId) {
        await updateLovable("site_settings", dbHikingSubtitleId, { value: hikingToursSubtitle });
      } else {
        const res = await insertLovable("site_settings", { key: "hiking_tours_subtitle", value: hikingToursSubtitle });
        if (res) setDbHikingSubtitleId((res as any).id);
      }
      
      localStorage.removeItem('site_settings');
      toast({ title: "Textos salvos com sucesso!" });
    } catch (e) {
      console.error("Erro ao salvar:", e);
      toast({ title: "Erro ao salvar", variant: "destructive" });
    }
  };

  const handleSave = async (styleId: string) => {
    console.log("Salvando hero_style:", styleId, "dbSettingId:", dbSettingId);
    
    try {
      let success = false;
      if (dbSettingId) {
        console.log("Atualizando registro:", dbSettingId);
        success = await updateLovable("site_settings", dbSettingId, { value: styleId });
        console.log("Resultado do update:", success);
      } else {
        console.log("Inserindo novo registro");
        const res = await insertLovable("site_settings", { key: "hero_style", value: styleId });
        console.log("Resultado do insert:", res);
        success = !!res;
        if (res) setDbSettingId((res as any).id || "hero_style");
      }
      
      if (success) {
        setActiveStyle(styleId);
        localStorage.removeItem('site_settings');
        toast({ title: "Estilo do Hero atualizado com sucesso!" });
      } else {
        toast({ title: "Erro ao salvar", description: "Não foi possível salvar no banco", variant: "destructive" });
      }
    } catch (e) {
      console.error("Erro ao salvar hero style:", e);
      toast({ title: "Erro ao salvar", description: "Verifique se a tabela site_settings foi créée no Supabase.", variant: "destructive" });
    }
  };

  if (isLoading) return <div className="p-8 text-muted-foreground font-sans">Carregando...</div>;

  return (
    <div className="max-w-5xl">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-foreground">Hero do Site</h1>
        <p className="text-muted-foreground font-sans text-sm mt-1">
          A seção "Hero" é a primeira coisa que o cliente vê ao entrar no site.
        </p>
      </div>

      <div className="bg-card rounded-xl border p-6 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Type className="w-5 h-5 text-primary" />
          <h2 className="font-sans font-bold text-lg">Título e Subtítulo do Hero</h2>
        </div>
        
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="heroTitle">Título Principal</Label>
            <Input
              id="heroTitle"
              value={heroTitle}
              onChange={(e) => setHeroTitle(e.target.value)}
              placeholder="Digite o título principal..."
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="heroSubtitle">Subtítulo</Label>
            <Input
              id="heroSubtitle"
              value={heroSubtitle}
              onChange={(e) => setHeroSubtitle(e.target.value)}
              placeholder="Digite o subtítulo..."
            />
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl border p-6 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Type className="w-5 h-5 text-primary" />
          <h2 className="font-sans font-bold text-lg">Títulos das Seções de Passeios</h2>
        </div>
        
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="cityToursTitle">City Tours - Título</Label>
            <Input
              id="cityToursTitle"
              value={cityToursTitle}
              onChange={(e) => setCityToursTitle(e.target.value)}
              placeholder="Ex: City Tours"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="cityToursSubtitle">City Tours - Subtítulo</Label>
            <Input
              id="cityToursSubtitle"
              value={cityToursSubtitle}
              onChange={(e) => setCityToursSubtitle(e.target.value)}
              placeholder="Ex: Explore a cidade..."
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="hikingToursTitle">Trilhas - Título</Label>
            <Input
              id="hikingToursTitle"
              value={hikingToursTitle}
              onChange={(e) => setHikingToursTitle(e.target.value)}
              placeholder="Ex: Trilhas e Adventures"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="hikingToursSubtitle">Trilhas - Subtítulo</Label>
            <Input
              id="hikingToursSubtitle"
              value={hikingToursSubtitle}
              onChange={(e) => setHikingToursSubtitle(e.target.value)}
              placeholder="Ex: Descubra trilhas..."
            />
          </div>
          
          <Button onClick={handleSaveTitleSubtitle} className="w-fit font-sans">
            <Save className="w-4 h-4 mr-2" />
            Salvar Textos
          </Button>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="font-serif text-2xl font-bold text-foreground mb-4">Estilo do Hero</h2>

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
