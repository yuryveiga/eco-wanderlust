import { useState, useEffect, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Clock, Users, MapPin, Calendar, Check, ChevronDown, ChevronUp, ArrowLeft, Star, Shield, Utensils, Activity, Sun, Sunrise, Moon, Plus, Minus, Gauge, Youtube, Cloud, Droplets, Wind, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteData } from "@/hooks/useSiteData";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLocale } from "@/contexts/LocaleContext";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { getOptimizedImage } from "@/utils/imageOptimization";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";

export function TourDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { tours, isLoading, siteSettings, socialMedia } = useSiteData();
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isPrivate, setIsPrivate] = useState(false);
  const { t, language, formatPrice } = useLocale();
  const { addToCart } = useCart();
  const [selectedPeriod, setSelectedPeriod] = useState('morning');
  const [selectedDate, setSelectedDate] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [weather, setWeather] = useState<{ temp: number; condition: string; humidity: number; wind: number } | null>(null);
  const [showStickyBar, setShowStickyBar] = useState(false);

  const tour = tours.find((t) => t.id === id || t.slug === id);
  const siteTitle = siteSettings?.site_title?.split('|')[0].trim() || "Eco-Wanderlust";

  // TripAdvisor data
  const tripAdvisorSocial = socialMedia.find(s => 
    s.platform.toLowerCase().includes('tripadvisor') && s.is_active !== false
  );
  const tripAdvisorUrl = tripAdvisorSocial?.url || "https://www.tripadvisor.com.br/";

  const getTranslated = (obj: any, field: string) => {
    if (!obj) return "";
    if (language === 'pt') return obj[field];
    return obj[`${field}_${language}`] || obj[field];
  };

  const translatedTitle = getTranslated(tour, 'title');
  const translatedShortDesc = getTranslated(tour, 'short_description');
  
  const translatedCategory = useMemo(() => {
    const rawCat = tour?.category;
    if (rawCat === 'TRILHA') return t('trilhas');
    if (rawCat === 'CITY TOUR') return t('city_tours');
    return getTranslated(tour, 'category');
  }, [tour, language, t]);

  const translatedDifficulty = getTranslated(tour, 'difficulty');
  const translatedItinerary = getTranslated(tour, `itinerary_json${language !== 'pt' ? `_${language}` : ""}`) || tour?.itinerary_json;
  const translatedIncluded = getTranslated(tour, `included_json${language !== 'pt' ? `_${language}` : ""}`) || tour?.included_json;
  const translatedFaq = getTranslated(tour, `faq_json${language !== 'pt' ? `_${language}` : ""}`) || tour?.faq_json;
  const translatedHighlights = getTranslated(tour, `highlights_json${language !== 'pt' ? `_${language}` : ""}`) || tour?.highlights_json;

  const translateDuration = (duration: string) => {
    if (language === 'pt' || !duration) return duration;
    return duration
      .replace(/horas/gi, t("horas"))
      .replace(/hora/gi, t("hora"))
      .replace(/minutos/gi, t("minutos"))
      .replace(/minuto/gi, t("minuto"));
  };

  // JSON-LD Structured Data
  const jsonLd = tour ? {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": translatedTitle,
    "description": translatedShortDesc,
    "image": tour.image_url,
    "offers": {
      "@type": "Offer",
      "price": tour.price,
      "priceCurrency": "BRL",
      "availability": "https://schema.org/InStock"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "128"
    }
  } : null;

  useEffect(() => {
    window.scrollTo(0, 0);
    const handleScroll = () => {
      setShowStickyBar(window.scrollY > 600);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [id]);

  useEffect(() => {
    if (tour) {
      if (tour.allows_private && !tour.allows_open) {
        setIsPrivate(true);
      } else {
        setIsPrivate(false);
      }
    }
  }, [tour]);

  useEffect(() => {
    const fetchWeather = async () => {
      if (!selectedDate) {
        setWeather(null);
        return;
      }
      try {
        const date = new Date(selectedDate);
        const today = new Date();
        const daysAhead = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        if (daysAhead < 0 || daysAhead > 16) {
          setWeather(null);
          return;
        }
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=-22.9068&longitude=-43.1729&daily=temperature_2m_max,temperature_2m_min,weathercode&forecast_days=16`);
        if (response.ok) {
          const data = await response.json();
          const dayIndex = Math.min(daysAhead, 15);
          if (data.daily && data.daily.temperature_2m_max[dayIndex] !== undefined) {
            const conditions: Record<number, string> = { 0: 'Ensolarado', 1: 'Parcialmente nublado', 2: 'Nublado', 3: 'Nublado', 45: 'Neblina', 51: 'Chuva leve', 61: 'Chuva', 80: 'Temporal', 95: 'Tempestade' };
            setWeather({
              temp: Math.round((data.daily.temperature_2m_max[dayIndex] + data.daily.temperature_2m_min[dayIndex]) / 2),
              condition: conditions[data.daily.weathercode[dayIndex]] || 'Parcialmente nublado',
              humidity: 70,
              wind: 12,
            });
          }
        }
      } catch (error) { console.error("Weather fetch error:", error); }
    };
    fetchWeather();
  }, [selectedDate]);
  
  const handleBooking = () => {
    if (!tour) return;
    if (!selectedDate) {
      toast.error(language === 'pt' ? "Por favor, selecione uma data." : "Please select a date.");
      return;
    }

    addToCart({
      id: tour.id,
      slug: tour.slug,
      title: translatedTitle,
      price: tour.price,
      image_url: getOptimizedImage(tour.image_url || "", 800),
      date: selectedDate,
      period: selectedPeriod,
      isPrivate: isPrivate,
      quantity: quantity
    });

    toast.success(language === 'pt' ? "Passeio adicionado ao carrinho!" : "Tour added to cart!", {
      action: {
        label: t("reservar"),
        onClick: () => navigate("/carrinho")
      }
    });
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center animate-pulse bg-muted" />;

  if (!tour) return <div className="min-h-screen flex flex-col items-center justify-center"><h1 className="text-2xl font-bold">{t("nao_encontrado")}</h1><Link to="/"><Button className="mt-4">{t("voltar_home")}</Button></Link></div>;

  const images = tour.images_json || (tour.image_url ? [tour.image_url] : ["/placeholder.svg"]);
  const highlights = (translatedHighlights as any[]) || [];
  const faqItems = (translatedFaq as any[]) || [];

  return (
    <main className="min-h-screen bg-background font-sans overflow-x-hidden">
      <Helmet>
        <title>{translatedTitle} | {siteTitle}</title>
        <meta name="description" content={translatedShortDesc || siteSettings?.site_description} />
        <link rel="canonical" href={window.location.href} />
        <link rel="alternate" hrefLang="pt" href={`${window.location.origin}/pt/passeio/${tour.slug || tour.id}`} />
        <link rel="alternate" hrefLang="en" href={`${window.location.origin}/en/passeio/${tour.slug || tour.id}`} />
        <link rel="alternate" hrefLang="es" href={`${window.location.origin}/es/passeio/${tour.slug || tour.id}`} />
        {jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}
      </Helmet>
      
      <Header />

      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground font-sans mb-8">
            <Link to="/" className="hover:text-foreground transition-colors">{t("inicio")}</Link>
            <span>/</span>
            <Link to="/#tours" className="hover:text-foreground transition-colors">{t("passeios")}</Link>
            <span>/</span>
            <span className="text-foreground font-medium">{translatedTitle}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pb-12">
            <div className="lg:col-span-2 space-y-10">
               {/* Gallery */}
               <div className="rounded-3xl overflow-hidden shadow-2xl bg-muted/20 aspect-video md:aspect-[2/1]">
                 <img src={getOptimizedImage(images[selectedImageIdx], 1200)} alt={translatedTitle} className="w-full h-full object-cover" />
               </div>

               {/* Meta Info */}
               <div className="bg-card rounded-2xl border p-8 shadow-sm">
                 <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                   <div>
                     <span className="text-primary font-black uppercase tracking-widest text-xs">{translatedCategory}</span>
                     <h1 className="font-serif text-3xl lg:text-5xl font-bold mt-2 text-balance leading-tight">{translatedTitle}</h1>
                   </div>
                   <div className="flex items-center gap-4">
                     <div className="text-right">
                       <span className="text-muted-foreground text-xs uppercase block">{t("a_partir_de")}</span>
                       <span className="text-3xl font-black text-primary">{formatPrice(tour.price)}</span>
                     </div>
                   </div>
                 </div>

                 <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-y">
                   <div className="flex items-center gap-3">
                     <Clock className="w-5 h-5 text-primary" />
                     <div className="flex flex-col"><span className="text-[10px] uppercase text-muted-foreground font-bold">{language === 'pt' ? 'Duração' : 'Duration'}</span><span className="text-sm font-bold">{translateDuration(tour.duration)}</span></div>
                   </div>
                   <div className="flex items-center gap-3">
                     <Users className="w-5 h-5 text-primary" />
                     <div className="flex flex-col"><span className="text-[10px] uppercase text-muted-foreground font-bold">{language === 'pt' ? 'Carga Máxima' : 'Capacity'}</span><span className="text-sm font-bold">{tour.max_group_size} {t("pessoas")}</span></div>
                   </div>
                   <div className="flex items-center gap-3">
                     <MapPin className="w-5 h-5 text-primary" />
                     <div className="flex flex-col"><span className="text-[10px] uppercase text-muted-foreground font-bold">{language === 'pt' ? 'Saída' : 'Departure'}</span><span className="text-sm font-bold">Rio de Janeiro</span></div>
                   </div>
                   {translatedDifficulty && (
                     <div className="flex items-center gap-3">
                       <Gauge className="w-5 h-5 text-[#E76F51]" />
                       <div className="flex flex-col"><span className="text-[10px] uppercase text-muted-foreground font-bold">{language === 'pt' ? 'Dificuldade' : 'Difficulty'}</span><span className="text-sm font-bold uppercase">{translatedDifficulty}</span></div>
                     </div>
                   )}
                 </div>

                 <div className="mt-8">
                   <p className="text-lg text-muted-foreground leading-relaxed font-sans">{translatedShortDesc}</p>
                 </div>
               </div>

               {/* Highlights */}
               {highlights.length > 0 && (
                 <div className="bg-card rounded-2xl border p-8 space-y-6">
                   <h2 className="text-2xl font-serif font-bold flex items-center gap-3"><Star className="text-primary fill-primary" /> {language === 'pt' ? 'Destaques' : 'Highlights'}</h2>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {highlights.map((h, i) => (
                       <div key={i} className="flex items-center gap-3 p-4 bg-muted/30 rounded-xl">
                         <Check className="text-primary w-5 h-5" />
                         <span className="text-sm font-medium">{h.text}</span>
                       </div>
                     ))}
                   </div>
                 </div>
               )}

               {/* Itinerary */}
               {translatedItinerary && (translatedItinerary as any[]).length > 0 && (
                 <div className="bg-card rounded-2xl border p-8 space-y-8">
                   <h2 className="text-2xl font-serif font-bold text-[#2A9D8F]">{t("itinerario_detalhes")}</h2>
                   <div className="relative space-y-8">
                     <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-dashed border-l-2 border-primary/20" />
                     {(translatedItinerary as any[]).map((step, i) => (
                       <div key={i} className="relative pl-10">
                         <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center text-[10px] text-primary-foreground font-bold shadow-lg ring-4 ring-background">{i + 1}</div>
                         <h3 className="font-bold text-lg mb-1">{step.time}</h3>
                         <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
                       </div>
                     ))}
                   </div>
                 </div>
               )}
            </div>

            {/* Booking Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 space-y-6">
                 <div className="bg-card rounded-3xl border border-primary/20 p-8 shadow-2xl relative overflow-hidden group">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150" />
                   
                   <div className="text-center mb-8">
                     <span className="text-muted-foreground text-xs font-black uppercase tracking-[0.2em]">{t("a_partir_de")}</span>
                     <div className="flex items-center justify-center gap-2 mt-1">
                       <span className="text-5xl font-black text-primary">{formatPrice(tour.price * quantity)}</span>
                     </div>
                   </div>

                   <div className="space-y-6">
                     <div className="space-y-3">
                        <label className="text-xs font-black uppercase text-muted-foreground">{t("quantas_pessoas")}</label>
                        <div className="flex items-center justify-between p-2 bg-muted/50 rounded-2xl border">
                          <Button variant="ghost" size="icon" onClick={() => setQuantity(q => Math.max(1, q-1))}><Minus className="w-4 h-4" /></Button>
                          <span className="font-black text-xl">{quantity}</span>
                          <Button variant="ghost" size="icon" onClick={() => setQuantity(q => Math.min(tour.max_group_size || 10, q+1))}><Plus className="w-4 h-4" /></Button>
                        </div>
                     </div>

                     <div className="space-y-3">
                        <label className="text-xs font-black uppercase text-muted-foreground">{t("data_viagem")}</label>
                        <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="w-full p-4 rounded-2xl border bg-background font-bold text-sm focus:ring-2 ring-primary outline-none transition-all" />
                     </div>

                     {weather && (
                       <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 flex items-center justify-between">
                         <div className="flex items-center gap-3">
                           <Sun className="w-8 h-8 text-amber-500" />
                           <div>
                             <span className="text-lg font-black block">{weather.temp}°C</span>
                             <span className="text-xs text-muted-foreground">{weather.condition}</span>
                           </div>
                         </div>
                         <div className="text-[10px] text-right text-muted-foreground">
                           <span>HUM: {weather.humidity}%</span><br/>
                           <span>WIND: {weather.wind}km/h</span>
                         </div>
                       </div>
                     )}

                     <Button onClick={handleBooking} size="lg" className="w-full h-16 rounded-2xl font-black text-lg gap-3 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                       <ShoppingCart className="w-6 h-6" /> {t("reservar_agora")}
                     </Button>
                   </div>

                   <p className="text-center text-[10px] text-muted-foreground mt-6 font-bold uppercase tracking-widest">{t("pagamento_seguro")}</p>
                 </div>

                 {/* TripAdvisor Badge Link */}
                 <a href={tripAdvisorUrl} target="_blank" rel="noopener noreferrer" className="block p-6 bg-emerald-50 border border-emerald-100 rounded-2xl text-center group hover:bg-emerald-100 transition-colors">
                    <div className="flex items-center justify-center gap-2 mb-2">
                       <Star className="w-4 h-4 fill-emerald-600 text-emerald-600" />
                       <Star className="w-4 h-4 fill-emerald-600 text-emerald-600" />
                       <Star className="w-4 h-4 fill-emerald-600 text-emerald-600" />
                       <Star className="w-4 h-4 fill-emerald-600 text-emerald-600" />
                       <Star className="w-4 h-4 fill-emerald-600 text-emerald-600" />
                    </div>
                    <span className="text-xs font-black text-emerald-800 uppercase tracking-widest group-hover:underline">Excellent on TripAdvisor</span>
                 </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Mobile Bar */}
      <div className={`fixed bottom-0 left-0 right-0 z-50 p-4 bg-background/80 backdrop-blur-xl border-t transform transition-transform duration-500 md:hidden ${showStickyBar ? "translate-y-0" : "translate-y-full"}`}>
        <div className="flex items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold text-muted-foreground uppercase">{t("a_partir_de")}</span>
            <div className="font-black text-xl text-primary">{formatPrice(tour.price)}</div>
          </div>
          <Button onClick={handleBooking} className="flex-1 h-12 rounded-xl font-black">{t("reservar_agora")}</Button>
        </div>
      </div>

      <Footer />
    </main>
  );
}

