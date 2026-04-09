import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fetchLovable, insertLovable, updateLovable, LovableSiteSetting } from "@/integrations/lovable/client";
import { useToast } from "@/hooks/use-toast";
import { LayoutTemplate, MonitorPlay, MonitorSmartphone, LayoutGrid, Type, Save, Sparkles, Loader2 } from "lucide-react";
import { translateText } from "@/utils/translate";

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
  const [toursSectionTitle, setToursSectionTitle] = useState<string>("");
  const [toursSectionSubtitle, setToursSectionSubtitle] = useState<string>("");
  const [cityToursTitle, setCityToursTitle] = useState<string>("City Tours");
  const [cityToursSubtitle, setCityToursSubtitle] = useState<string>("Explore a cidade com nossos guias especializados");
  const [hikingToursTitle, setHikingToursTitle] = useState<string>("Trilhas e Adventures");
  const [hikingToursSubtitle, setHikingToursSubtitle] = useState<string>("Descubra trilhas incríveis e aventuras na natureza");
  const [aboutLabel, setAboutLabel] = useState<string>("");
  const [aboutTitle, setAboutTitle] = useState<string>("");
  const [aboutDesc, setAboutDesc] = useState<string>("");
  const [aboutDesc2, setAboutDesc2] = useState<string>("");
  const [dbSettingId, setDbSettingId] = useState<string | null>(null);
  const [dbTitleId, setDbTitleId] = useState<string | null>(null);
  const [dbSubtitleId, setDbSubtitleId] = useState<string | null>(null);
  const [dbToursTitleId, setDbToursTitleId] = useState<string | null>(null);
  const [dbToursSubtitleId, setDbToursSubtitleId] = useState<string | null>(null);
  const [dbCityTitleId, setDbCityTitleId] = useState<string | null>(null);
  const [dbCitySubtitleId, setDbCitySubtitleId] = useState<string | null>(null);
  const [dbHikingTitleId, setDbHikingTitleId] = useState<string | null>(null);
  const [dbHikingSubtitleId, setDbHikingSubtitleId] = useState<string | null>(null);
  const [dbAboutLabelId, setDbAboutLabelId] = useState<string | null>(null);
  const [dbAboutTitleId, setDbAboutTitleId] = useState<string | null>(null);
  const [dbAboutDescId, setDbAboutDescId] = useState<string | null>(null);
  const [dbAboutDesc2Id, setDbAboutDesc2Id] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isTranslating, setIsTranslating] = useState(false);
  const [allTranslated, setAllTranslated] = useState(false);
  const [siteSettings, setSiteSettings] = useState<LovableSiteSetting[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setIsLoading(true);
    try {
      const settings = await fetchLovable<LovableSiteSetting>("site_settings");
      setSiteSettings(settings);
      console.log("Settings carregados:", settings);
      
      const heroStyleSetting = siteSettings.find(s => s.key === "hero_style");
      if (heroStyleSetting) {
        setActiveStyle(heroStyleSetting.value);
        setDbSettingId((heroStyleSetting as any).id);
      }
      
      const heroTitleSetting = siteSettings.find(s => s.key === "hero_title");
      if (heroTitleSetting) {
        setHeroTitle(heroTitleSetting.value);
        setDbTitleId((heroTitleSetting as any).id);
      } else {
        setHeroTitle("Eco-Wanderlust | Passeios Inesquecíveis no Rio de Janeiro");
      }
      
      const heroSubtitleSetting = siteSettings.find(s => s.key === "hero_subtitle");
      if (heroSubtitleSetting) {
        setHeroSubtitle(heroSubtitleSetting.value);
        setDbSubtitleId((heroSubtitleSetting as any).id);
      } else {
        setHeroSubtitle("Descubra a magia do Rio de Janeiro com nossos passeios exclusivos e guias especializados.");
      }
      
      const toursTitleSetting = siteSettings.find(s => s.key === "tours_section_title");
      if (toursTitleSetting) {
        setToursSectionTitle(toursTitleSetting.value);
        setDbToursTitleId((toursTitleSetting as any).id);
      } else {
        setToursSectionTitle("Conheça o Melhor do Rio de Janeiro");
      }
      
      const toursSubtitleSetting = siteSettings.find(s => s.key === "tours_section_subtitle");
      if (toursSubtitleSetting) {
        setToursSectionSubtitle(toursSubtitleSetting.value);
        setDbToursSubtitleId((toursSubtitleSetting as any).id);
      } else {
        setToursSectionSubtitle("City tours completos, passeios de barco em Arraial do Cabo e Angra dos Reis, e experiências inesquecíveis com guias especializados.");
      }
      
      const cityTitleSetting = siteSettings.find(s => s.key === "city_tours_title");
      if (cityTitleSetting) {
        setCityToursTitle(cityTitleSetting.value);
        setDbCityTitleId((cityTitleSetting as any).id);
      }
      
      const citySubtitleSetting = siteSettings.find(s => s.key === "city_tours_subtitle");
      if (citySubtitleSetting) {
        setCityToursSubtitle(citySubtitleSetting.value);
        setDbCitySubtitleId((citySubtitleSetting as any).id);
      }
      
      const hikingTitleSetting = siteSettings.find(s => s.key === "hiking_tours_title");
      if (hikingTitleSetting) {
        setHikingToursTitle(hikingTitleSetting.value);
        setDbHikingTitleId((hikingTitleSetting as any).id);
      }
      
      const hikingSubtitleSetting = siteSettings.find(s => s.key === "hiking_tours_subtitle");
      if (hikingSubtitleSetting) {
        setHikingToursSubtitle(hikingSubtitleSetting.value);
        setDbHikingSubtitleId((hikingSubtitleSetting as any).id);
      }
      
      const aboutTitleSetting = siteSettings.find(s => s.key === "about_title");
      if (aboutTitleSetting) {
        setAboutTitle(aboutTitleSetting.value);
        setDbAboutTitleId((aboutTitleSetting as any).id);
      } else {
        setAboutTitle("Sua Porta de Entrada para a Cidade Maravilhosa");
      }
      
      const aboutDescSetting = siteSettings.find(s => s.key === "about_desc");
      if (aboutDescSetting) {
        setAboutDesc(aboutDescSetting.value);
        setDbAboutDescId((aboutDescSetting as any).id);
      } else {
        setAboutDesc("A Passeio Rio oferece experiências turísticas autênticas que mostram o melhor do Rio de Janeiro. Do Cristo Redentor ao Pão de Açúcar, de Arraial do Cabo a Angra dos Reis, revelamos a beleza incomparável desta cidade magnification.");
      }

      const aboutLabelSetting = siteSettings.find(s => s.key === "about_label");
      if (aboutLabelSetting) {
        setAboutLabel(aboutLabelSetting.value);
        setDbAboutLabelId((aboutLabelSetting as any).id);
      } else {
        setAboutLabel("Sobre a Passeio Rio");
      }

      const aboutDesc2Setting = siteSettings.find(s => s.key === "about_desc2");
      if (aboutDesc2Setting) {
        setAboutDesc2(aboutDesc2Setting.value);
        setDbAboutDesc2Id((aboutDesc2Setting as any).id);
      } else {
        setAboutDesc2("Com guias locais especializados e saídas diárias confirmadas, garantimos uma experiência segura, confortável e inesquecível.");
      }
    } catch (e) {
      console.error("Erro ao carregar site_settings:", e);
    }
    setIsLoading(false);
  };

  const handleSaveTitleSubtitle = async () => {
    try {
      console.log("Saving about_title:", aboutTitle, "dbAboutTitleId:", dbAboutTitleId);
      console.log("Saving about_desc:", aboutDesc, "dbAboutDescId:", dbAboutDescId);
      
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
      
      if (dbToursTitleId) {
        await updateLovable("site_settings", dbToursTitleId, { value: toursSectionTitle });
      } else {
        const res = await insertLovable("site_settings", { key: "tours_section_title", value: toursSectionTitle });
        if (res) setDbToursTitleId((res as any).id);
      }
      
      if (dbToursSubtitleId) {
        await updateLovable("site_settings", dbToursSubtitleId, { value: toursSectionSubtitle });
      } else {
        const res = await insertLovable("site_settings", { key: "tours_section_subtitle", value: toursSectionSubtitle });
        if (res) setDbToursSubtitleId((res as any).id);
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
      
      // Save about section
      if (dbAboutTitleId) {
        const result = await updateLovable("site_settings", dbAboutTitleId, { value: aboutTitle });
        console.log("Update about_title result:", result);
      } else {
        const res = await insertLovable("site_settings", { key: "about_title", value: aboutTitle });
        console.log("Insert about_title result:", res);
        if (res) setDbAboutTitleId((res as any).id);
      }
      
      if (dbAboutDescId) {
        const result = await updateLovable("site_settings", dbAboutDescId, { value: aboutDesc });
        console.log("Update about_desc result:", result);
      } else {
        const res = await insertLovable("site_settings", { key: "about_desc", value: aboutDesc });
        console.log("Insert about_desc result:", res);
        if (res) setDbAboutDescId((res as any).id);
      }

      if (dbAboutLabelId) {
        await updateLovable("site_settings", dbAboutLabelId, { value: aboutLabel });
      } else {
        const res = await insertLovable("site_settings", { key: "about_label", value: aboutLabel });
        if (res) setDbAboutLabelId((res as any).id);
      }

      if (dbAboutDesc2Id) {
        await updateLovable("site_settings", dbAboutDesc2Id, { value: aboutDesc2 });
      } else {
        const res = await insertLovable("site_settings", { key: "about_desc2", value: aboutDesc2 });
        if (res) setDbAboutDesc2Id((res as any).id);
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
        
        <Button 
          variant="default" 
          onClick={async () => {
            console.log("siteSettings state:", siteSettings);
            console.log("Fields:", heroTitle, heroSubtitle, toursSectionTitle, toursSectionSubtitle, aboutLabel, aboutTitle, aboutDesc, aboutDesc2);
            const allFields = [heroTitle, heroSubtitle, toursSectionTitle, toursSectionSubtitle, aboutLabel, aboutTitle, aboutDesc, aboutDesc2];
            if (allFields.every(f => !f)) {
              toast({ title: "Preencha algum campo primeiro", variant: "destructive" });
              return;
            }
            setIsTranslating(true);
            try {
              // Reload settings before saving
              const freshSettings = await fetchLovable<LovableSiteSetting>("site_settings");
              setSiteSettings(freshSettings);
              console.log("Fresh settings:", freshSettings);
              
              console.log("Starting translation for fields:", allFields);
              const translations = await Promise.all([
                heroTitle ? translateText(heroTitle, "en") : null, heroTitle ? translateText(heroTitle, "es") : null,
                heroSubtitle ? translateText(heroSubtitle, "en") : null, heroSubtitle ? translateText(heroSubtitle, "es") : null,
                toursSectionTitle ? translateText(toursSectionTitle, "en") : null, toursSectionTitle ? translateText(toursSectionTitle, "es") : null,
                toursSectionSubtitle ? translateText(toursSectionSubtitle, "en") : null, toursSectionSubtitle ? translateText(toursSectionSubtitle, "es") : null,
                aboutLabel ? translateText(aboutLabel, "en") : null, aboutLabel ? translateText(aboutLabel, "es") : null,
                aboutTitle ? translateText(aboutTitle, "en") : null, aboutTitle ? translateText(aboutTitle, "es") : null,
                aboutDesc ? translateText(aboutDesc, "en") : null, aboutDesc ? translateText(aboutDesc, "es") : null,
                aboutDesc2 ? translateText(aboutDesc2, "en") : null, aboutDesc2 ? translateText(aboutDesc2, "es") : null,
              ]);
              
              const keys = [
                "hero_title_en", "hero_title_es", "hero_subtitle_en", "hero_subtitle_es",
                "tours_section_title_en", "tours_section_title_es", "tours_section_subtitle_en", "tours_section_subtitle_es",
                "about_label_en", "about_label_es", "about_title_en", "about_title_es", 
                "about_desc_en", "about_desc_es", "about_desc2_en", "about_desc2_es"
              ];
              
              for (let i = 0; i < keys.length; i++) {
                if (translations[i]) {
                  console.log(`Saving ${keys[i]}:`, translations[i]);
                  const existing = freshSettings.find(s => s.key === keys[i]);
                  if (existing) {
                    console.log("Updating existing:", existing.id);
                    await updateLovable("site_settings", (existing as any).id, { value: translations[i] });
                  } else {
                    console.log("Inserting new:", keys[i]);
                    await insertLovable("site_settings", { key: keys[i], value: translations[i] });
                  }
                }
              }
              
              setAllTranslated(true);
              toast({ title: "Tradução concluída! Salve as alterações." });
            } catch (e: any) {
              console.error("Translation error:", e);
              toast({ title: "Erro ao traduzir: " + (e?.message || e?.toString() || "Verifique a API key"), variant: "destructive" });
            } finally {
              setIsTranslating(false);
            }
          }}
          disabled={isTranslating}
          className="mt-4"
        >
          {isTranslating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
          Traduzir Tudo
        </Button>
        
        {allTranslated && (
          <span className="ml-3 text-sm text-green-600 font-sans">✓ Traduzido! Agora clique em Salvar em cada seção.</span>
        )}
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
          <Button 
            variant="outline" 
            onClick={async () => {
              if (!heroTitle && !heroSubtitle) {
                toast({ title: "Preencha o título ou subtítulo primeiro", variant: "destructive" });
                return;
              }
              setIsTranslating(true);
              try {
                const results = await Promise.all([
                  heroTitle ? translateText(heroTitle, "en") : null,
                  heroTitle ? translateText(heroTitle, "es") : null,
                  heroSubtitle ? translateText(heroSubtitle, "en") : null,
                  heroSubtitle ? translateText(heroSubtitle, "es") : null,
                ]);
                // Save translations to site_settings
                const keysToSave = [];
                if (results[0]) {
                  const existing = siteSettings.find(s => s.key === "hero_title_en");
                  if (existing) await updateLovable("site_settings", (existing as any).id, { value: results[0] });
                  else await insertLovable("site_settings", { key: "hero_title_en", value: results[0] });
                }
                if (results[1]) {
                  const existing = siteSettings.find(s => s.key === "hero_title_es");
                  if (existing) await updateLovable("site_settings", (existing as any).id, { value: results[1] });
                  else await insertLovable("site_settings", { key: "hero_title_es", value: results[1] });
                }
                if (results[2]) {
                  const existing = siteSettings.find(s => s.key === "hero_subtitle_en");
                  if (existing) await updateLovable("site_settings", (existing as any).id, { value: results[2] });
                  else await insertLovable("site_settings", { key: "hero_subtitle_en", value: results[2] });
                }
                if (results[3]) {
                  const existing = siteSettings.find(s => s.key === "hero_subtitle_es");
                  if (existing) await updateLovable("site_settings", (existing as any).id, { value: results[3] });
                  else await insertLovable("site_settings", { key: "hero_subtitle_es", value: results[3] });
                }
                toast({ title: "Tradução concluída! Salve as alterações." });
              } catch (e) {
                toast({ title: "Erro ao traduzir", variant: "destructive" });
              } finally {
                setIsTranslating(false);
              }
            }}
            disabled={isTranslating}
            className="mt-2"
          >
          </Button>
        </div>
      </div>

      <div className="bg-card rounded-xl border p-6 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Type className="w-5 h-5 text-primary" />
          <h2 className="font-sans font-bold text-lg">Seção de Passeios (abaixo do Hero)</h2>
        </div>
        
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="toursSectionTitle">Título</Label>
            <Input
              id="toursSectionTitle"
              value={toursSectionTitle}
              onChange={(e) => setToursSectionTitle(e.target.value)}
              placeholder="Ex: Conheça o Melhor do Rio de Janeiro"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="toursSectionSubtitle">Subtítulo</Label>
            <Input
              id="toursSectionSubtitle"
              value={toursSectionSubtitle}
              onChange={(e) => setToursSectionSubtitle(e.target.value)}
              placeholder="Ex: City tours completos..."
            />
          </div>
          
          <Button 
            variant="outline" 
            onClick={async () => {
              if (!toursSectionTitle && !toursSectionSubtitle) {
                toast({ title: "Preencha o título ou subtítulo primeiro", variant: "destructive" });
                return;
              }
              setIsTranslating(true);
              try {
                const results = await Promise.all([
                  toursSectionTitle ? translateText(toursSectionTitle, "en") : null,
                  toursSectionTitle ? translateText(toursSectionTitle, "es") : null,
                  toursSectionSubtitle ? translateText(toursSectionSubtitle, "en") : null,
                  toursSectionSubtitle ? translateText(toursSectionSubtitle, "es") : null,
                ]);
                const keys = ["tours_section_title_en", "tours_section_title_es", "tours_section_subtitle_en", "tours_section_subtitle_es"];
                for (let i = 0; i < 4; i++) {
                  if (results[i]) {
                    const existing = siteSettings.find(s => s.key === keys[i]);
                    if (existing) await updateLovable("site_settings", (existing as any).id, { value: results[i] });
                    else await insertLovable("site_settings", { key: keys[i], value: results[i] });
                  }
                }
                toast({ title: "Tradução concluída! Salve as alterações." });
              } catch (e) {
                toast({ title: "Erro ao traduzir", variant: "destructive" });
              } finally {
                setIsTranslating(false);
              }
            }}
            disabled={isTranslating}
          >
          </Button>
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

      <div className="bg-card rounded-xl border p-6 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Type className="w-5 h-5 text-primary" />
          <h2 className="font-sans font-bold text-lg">Seção "Sobre" (Página)</h2>
        </div>
        
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="aboutLabel">Label (Sobre a Passeio Rio)</Label>
            <Input
              id="aboutLabel"
              value={aboutLabel}
              onChange={(e) => setAboutLabel(e.target.value)}
              placeholder="Ex: Sobre a Passeio Rio"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="aboutTitle">Título</Label>
            <Input
              id="aboutTitle"
              value={aboutTitle}
              onChange={(e) => setAboutTitle(e.target.value)}
              placeholder="Ex: Sua Porta de Entrada para a Cidade Maravilhosa"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="aboutDesc">Descrição</Label>
            <textarea
              id="aboutDesc"
              value={aboutDesc}
              onChange={(e) => setAboutDesc(e.target.value)}
              placeholder="Digite a descrição..."
              className="w-full min-h-[100px] rounded-xl border p-4 text-sm font-sans"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="aboutDesc2">Descrição 2</Label>
            <textarea
              id="aboutDesc2"
              value={aboutDesc2}
              onChange={(e) => setAboutDesc2(e.target.value)}
              placeholder="Com guias locais especializados..."
              className="w-full min-h-[100px] rounded-xl border p-4 text-sm font-sans"
            />
          </div>
          
          <Button 
            variant="outline" 
            onClick={async () => {
              if (!aboutLabel && !aboutTitle && !aboutDesc && !aboutDesc2) {
                toast({ title: "Preencha algum campo primeiro", variant: "destructive" });
                return;
              }
              setIsTranslating(true);
              try {
                const results = await Promise.all([
                  aboutLabel ? translateText(aboutLabel, "en") : null,
                  aboutLabel ? translateText(aboutLabel, "es") : null,
                  aboutTitle ? translateText(aboutTitle, "en") : null,
                  aboutTitle ? translateText(aboutTitle, "es") : null,
                  aboutDesc ? translateText(aboutDesc, "en") : null,
                  aboutDesc ? translateText(aboutDesc, "es") : null,
                  aboutDesc2 ? translateText(aboutDesc2, "en") : null,
                  aboutDesc2 ? translateText(aboutDesc2, "es") : null,
                ]);
                const keys = ["about_label_en", "about_label_es", "about_title_en", "about_title_es", "about_desc_en", "about_desc_es", "about_desc2_en", "about_desc2_es"];
                for (let i = 0; i < 8; i++) {
                  if (results[i]) {
                    const existing = siteSettings.find(s => s.key === keys[i]);
                    if (existing) await updateLovable("site_settings", (existing as any).id, { value: results[i] });
                    else await insertLovable("site_settings", { key: keys[i], value: results[i] });
                  }
                }
                toast({ title: "Tradução concluída! Salve as alterações." });
              } catch (e) {
                toast({ title: "Erro ao traduzir", variant: "destructive" });
              } finally {
                setIsTranslating(false);
              }
            }}
            disabled={isTranslating}
          >
          </Button>
          
          <Button onClick={handleSaveTitleSubtitle} className="w-fit font-sans">
            <Save className="w-4 h-4 mr-2" />
            Salvar
          </Button>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="font-serif text-2xl font-bold text-foreground mb-4">Estilo do Hero</h2>
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
