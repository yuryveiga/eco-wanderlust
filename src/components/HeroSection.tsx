import { ChevronDown, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteData } from "@/hooks/useSiteData";
import { useLocale } from "@/contexts/LocaleContext";
import { OptimizedImage } from "./OptimizedImage";

export function HeroSection() {
  const { images, siteSettings } = useSiteData();
  const { t, language } = useLocale();
  const [currentBg, setCurrentBg] = useState(0);
  const heroStyle = siteSettings['hero_style'] || "style1";
  
  const heroTitleKey = language === 'pt' ? 'hero_title' : `hero_title_${language}`;
  const heroSubtitleKey = language === 'pt' ? 'hero_subtitle' : `hero_subtitle_${language}`;
  
  const heroTitle = siteSettings[heroTitleKey] || siteSettings['hero_title'] || `${t("conheca_melhor")} ${t("rio_janeiro")}`;
  const heroSubtitle = siteSettings[heroSubtitleKey] || siteSettings['hero_subtitle'] || t("hero_desc");
  
  const availableBgs = [
    images["hero_bg"],
    images["hero_bg_2"],
    images["hero_bg_3"]
  ].filter(Boolean);

  const heroBgs = availableBgs.length > 0 ? availableBgs : ["https://images.unsplash.com/photo-1483729558449-99ef09a8c325?q=80&w=2070"];



  useEffect(() => {
    if (heroBgs.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % heroBgs.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [heroBgs.length]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const renderSlideshowBackgrounds = () => (
    <>
      {heroBgs.map((bg, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${index === currentBg ? 'opacity-100' : 'opacity-0'}`}
        >
          <OptimizedImage
            src={bg}
            alt=""
            width={1600}
            containerClassName="w-full h-full"
            className="w-full h-full object-cover"
            loading={index === 0 ? "eager" : "lazy"}
            fetchPriority={index === 0 ? "high" : "low"}
            decoding={index === 0 ? "sync" : "async"}
          />
        </div>
      ))}
      <div className="absolute inset-0 bg-black/40" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background via-background/20 to-transparent z-[5]" />
    </>
  );

  if (heroStyle === "style3") {
    // Style 3: Imersão Glassmorphism
    return (
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
        {renderSlideshowBackgrounds()}
        <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 mt-16 animate-fade-in-up">
          <div className="bg-background/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 sm:p-12 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
            
            <div className="inline-flex items-center gap-2 bg-primary/20 text-white border border-primary/30 rounded-full px-4 py-1.5 mb-6">
              <Star className="w-4 h-4 fill-primary text-primary" />
              <span className="text-sm font-medium font-sans uppercase tracking-widest">{t("avaliados")}</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl font-bold mb-6 text-white text-balance drop-shadow-lg">
              {heroTitle}
            </h1>

            <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto mb-10 font-sans font-light">
              {heroSubtitle}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" onClick={() => scrollTo("tours")} className="text-lg px-8 py-6 font-sans w-full sm:w-auto shadow-lg shadow-primary/25">
                {t("nossos_passeios")}
              </Button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12 pt-8 border-t border-white/10 text-white/80 font-sans text-sm">
              <div className="flex flex-col items-center gap-2"><div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-1"><Star className="w-5 h-5 text-primary" /></div>{t("turistas_felizes")}</div>
              <div className="flex flex-col items-center gap-2"><div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-1"><svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22ZM11 19.93C7.05 19.44 4 16.08 4 12C4 11.38 4.08 10.79 4.21 10.21L9 15V16C9 17.1 9.9 18 11 18V19.93Z" /></svg></div>{t("saidas_diarias")}</div>
              <div className="flex flex-col items-center gap-2"><div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-1"><svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" /></svg></div>{t("guias_espec")}</div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (heroStyle === "style2") {
    // Style 2: Modern Split Screen with Smooth Gradient
    return (
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-background">
        <div className="absolute inset-0 w-full lg:w-[70%] lg:left-[30%] z-0 h-[50vh] lg:h-full top-0 lg:top-0 mt-16 lg:mt-0">
          {renderSlideshowBackgrounds()}
          {/* Horizontal gradient for desktop */}
          <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-background via-background/90 to-transparent w-full lg:w-64 z-10 hidden lg:block"></div>
          {/* Vertical gradient for mobile */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background via-background/90 to-transparent h-32 z-10 block lg:hidden"></div>
        </div>

        <div className="w-full lg:w-[55%] relative z-10 flex items-center justify-center p-8 sm:p-16 lg:p-24 bg-background lg:bg-transparent lg:bg-gradient-to-r lg:from-background lg:via-background lg:to-transparent mt-[50vh] lg:mt-0">
          <div className="max-w-xl animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-2 mb-6 border border-primary/20">
              <Star className="w-4 h-4 fill-primary" />
              <span className="text-sm font-medium font-sans">{t("avaliados")}</span>
            </div>

            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-6 text-foreground text-balance leading-[1.1]">
              {heroTitle}
            </h1>

            <p className="text-lg text-muted-foreground mb-8 font-sans leading-relaxed">
              {heroSubtitle}
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Button size="lg" onClick={() => scrollTo("tours")} className="w-full sm:w-auto text-lg px-8 py-6 font-sans">
                {t("nossos_passeios")}
              </Button>
              <Button size="lg" variant="outline" onClick={() => scrollTo("contact")} className="w-full sm:w-auto text-lg px-8 py-6 font-sans border-2">
                {t("passeio_pers")}
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Style 1: Clássico Slideshow (Default)
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {renderSlideshowBackgrounds()}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white mt-16">
        <div className="animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <Star className="w-4 h-4 text-primary fill-primary" />
            <span className="text-sm font-medium font-sans">{t("avaliados")}</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 text-balance drop-shadow-xl">
            {heroTitle}
          </h1>

          <p className="text-lg sm:text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto mb-8 font-sans drop-shadow">
            {heroSubtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" onClick={() => scrollTo("tours")} className="text-lg px-8 py-6 font-sans">
              {t("nossos_passeios")}
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => scrollTo("contact")}
              className="text-lg px-8 py-6 bg-black/20 border-white/30 text-white hover:bg-white hover:text-black font-sans transition-colors"
            >
              {t("passeio_pers")}
            </Button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-8 h-8 text-white/70" />
      </div>
    </section>
  );
}
