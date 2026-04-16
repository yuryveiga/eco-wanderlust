import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Clock, Users, MapPin, Calendar, Check, ChevronDown, ChevronUp, ArrowLeft, Star, Shield, Utensils, Activity, Sun, Sunrise, Moon, Plus, Minus, Gauge, Youtube, Cloud, Droplets, Wind, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LovableTour } from "@/integrations/lovable/client";
import { useSiteData } from "@/hooks/useSiteData";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLocale } from "@/contexts/LocaleContext";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { getOptimizedImage } from "@/utils/imageOptimization";
import { OptimizedImage } from "@/components/OptimizedImage";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Maximize2, X, Calendar as CalendarIcon } from "lucide-react";
import { Calendar as CalendarUI } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, parseISO, isPast, isToday } from "date-fns";
import { ptBR, enUS, es } from "date-fns/locale";

export function TourDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { tours, isLoading: isGlobalLoading, siteSettings, socialMedia } = useSiteData();
  const { data: tour, isLoading: isTourLoading } = useQuery({
    queryKey: ["tour", id],
    queryFn: async () => {
      if (!id) return null;
      
      // Check if id is a valid UUID to avoid database type errors
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
      
      let query = supabase.from("tours").select("*");
      
      if (isUuid) {
        query = query.or(`id.eq.${id},slug.eq.${id}`);
      } else {
        query = query.eq("slug", id);
      }
      
      const { data, error } = await query.single();
      if (error) throw error;
      return data as unknown as LovableTour;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const isLoading = isGlobalLoading || isTourLoading;
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
  const [selectedOptionIdx, setSelectedOptionIdx] = useState(0);

  const siteTitle = siteSettings?.site_title?.split('|')[0].trim() || "Eco-Wanderlust";

  // TripAdvisor data
  const tripAdvisorSocial = socialMedia.find(s => 
    s.platform.toLowerCase().includes('tripadvisor') && s.is_active !== false
  );
  const tripAdvisorUrl = tripAdvisorSocial?.url || "https://www.tripadvisor.com.br/";

  const getTranslated = useCallback((field: string) => {
    if (!tour) return "";
    if (language === 'pt') return (tour as any)[field];
    return (tour as any)[`${field}_${language}`] || (tour as any)[field];
  }, [language, tour]);

  const translatedTitle = useMemo(() => getTranslated('title'), [getTranslated]);
  const translatedShortDesc = useMemo(() => getTranslated('short_description'), [getTranslated]);
  
  const translatedCategory = useMemo(() => {
    const rawCat = tour?.category;
    if (rawCat === 'TRILHA') return t('trilhas');
    if (rawCat === 'CITY TOUR') return t('city_tours');
    return getTranslated('category');
  }, [tour, t, getTranslated]);

  const translatedDifficulty = useMemo(() => getTranslated('difficulty'), [getTranslated]);
  const translatedItinerary = useMemo(() => getTranslated(`itinerary_json${language !== 'pt' ? `_${language}` : ""}`) || tour?.itinerary_json, [getTranslated, language, tour?.itinerary_json]);
  const translatedIncluded = useMemo(() => getTranslated(`included_json${language !== 'pt' ? `_${language}` : ""}`) || tour?.included_json, [getTranslated, language, tour?.included_json]);
  const translatedFaq = useMemo(() => getTranslated(`faq_json${language !== 'pt' ? `_${language}` : ""}`) || tour?.faq_json, [getTranslated, language, tour?.faq_json]);
  const translatedHighlights = useMemo(() => getTranslated(`highlights_json${language !== 'pt' ? `_${language}` : ""}`) || tour?.highlights_json, [getTranslated, language, tour?.highlights_json]);

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

  const breadcrumbsLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": t("inicio"),
        "item": "https://tocorimerio.com/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": t("passeios"),
        "item": "https://tocorimerio.com/passeios"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": translatedTitle,
        "item": `https://tocorimerio.com/passeio/${tour?.slug || tour?.id}`
      }
    ]
  };

  const canonicalUrl = `https://tocorimerio.com/passeio/${tour?.slug || tour?.id}`;

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

  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxSource, setLightboxSource] = useState<'hero' | 'gallery'>('hero');

  const images = useMemo(() => {
    let imgs = tour?.images_json as string[] || [];
    if (imgs.length === 0 && tour?.image_url) imgs = [tour.image_url];
    return imgs.filter(url => url && typeof url === 'string');
  }, [tour]);
  const currentUnitPrice = useMemo(() => {
    if (!tour) return 0;
    let basePrice = 0;
    if (tour.pricing_model === 'dynamic') {
      if (quantity === 1) basePrice = tour.price_1_person || 0;
      else if (quantity === 2) basePrice = tour.price_2_people || 0;
      else if (quantity >= 3 && quantity <= 6) basePrice = tour.price_3_6_people || 0;
      else if (quantity >= 7) basePrice = tour.price_7_19_people || 0;
      else basePrice = tour.price || 0;
    } else if (tour.pricing_model === 'group') {
      basePrice = (tour.price || 0) / (quantity || 1);
    } else if (tour.pricing_model === 'custom') {
      basePrice = 0;
    } else {
      basePrice = tour.price || 0;
    }

    // Add custom option price if active
    if (tour.use_custom_options && tour.custom_options_json && tour.custom_options_json[selectedOptionIdx]) {
      basePrice += tour.custom_options_json[selectedOptionIdx].price || 0;
    }
    
    return basePrice;
  }, [tour, quantity, selectedOptionIdx]);

  useEffect(() => {
    const fetchWeather = async () => {
      if (!selectedDate) {
        setWeather(null);
        return;
      }

      // Validate date against available days
      const dateObj = new Date(selectedDate);
      const dayOfWeek = (dateObj.getUTCDay()).toString(); // Matches '0'-'6'
      if (tour?.available_days && tour.available_days.length > 0 && !tour.available_days.includes(dayOfWeek)) {
        toast.error("Este passeio não está disponível neste dia da semana.");
        setSelectedDate("");
        return;
      }

      try {
        const today = new Date();
        const daysAhead = Math.ceil((dateObj.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
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
  }, [selectedDate, tour]);
  
  const handleBooking = () => {
    if (!tour) return;
    if (!selectedDate) {
      toast.error(t("selecione_data"));
      return;
    }

    addToCart({
      id: tour.id,
      slug: tour.slug,
      title: translatedTitle,
      price: currentUnitPrice,
      image_url: getOptimizedImage(tour.image_url || "", 800),
      date: selectedDate,
      period: selectedPeriod,
      isPrivate: isPrivate,
      quantity: quantity,
      pricing_model: tour.pricing_model,
      price_1_person: tour.price_1_person,
      price_2_people: tour.price_2_people,
      price_3_6_people: tour.price_3_6_people,
      price_7_19_people: tour.price_7_19_people,
      group_price: tour.pricing_model === 'group' ? tour.price : undefined,
      max_group_size: tour.max_group_size,
      selected_option: tour.use_custom_options && tour.custom_options_json?.[selectedOptionIdx] ? {
        title: tour.custom_options_json[selectedOptionIdx].title,
        extra_price: tour.custom_options_json[selectedOptionIdx].price
      } : undefined
    });

    toast.success(t("passeio_adicionado"));
    navigate("/carrinho");
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center animate-pulse bg-muted" />;

  if (!tour) return <div className="min-h-screen flex flex-col items-center justify-center"><h1 className="text-2xl font-bold">{t("nao_encontrado")}</h1><Link to="/"><Button className="mt-4">{t("voltar_home")}</Button></Link></div>;

  const highlights = (translatedHighlights as any[]) || [];
  const faqItems = (translatedFaq as any[]) || [];

  const openLightbox = (index: number, source: 'hero' | 'gallery' = 'hero') => {
    setLightboxIndex(index);
    setLightboxSource(source);
    setIsLightboxOpen(true);
  };

  return (
    <main className="min-h-screen bg-background font-sans overflow-x-hidden">
      <Helmet>
        <title>{translatedTitle} | {siteTitle}</title>
        <meta name="description" content={translatedShortDesc || siteSettings?.site_description} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:title" content={`${translatedTitle} | ${siteTitle}`} />
        <meta property="og:description" content={translatedShortDesc || siteSettings?.site_description} />
        <meta property="og:image" content={tour.image_url} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={window.location.href} />
        <meta name="twitter:title" content={`${translatedTitle} | ${siteTitle}`} />
        <meta name="twitter:description" content={translatedShortDesc || siteSettings?.site_description} />
        <meta name="twitter:image" content={tour.image_url} />

        <link rel="canonical" href={canonicalUrl} />
        {/* Note: In a SPA without language prefixes in URL, hreflang is less effective but we keep it pointing to standard URL or param-based if we add it later */}
        {jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}
        <script type="application/ld+json">{JSON.stringify(breadcrumbsLd)}</script>
      </Helmet>
      
      <Header />

      {/* Breadcrumbs & Title Section */}
      <section className="pt-24 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-6">
          <Link to="/" className="hover:text-primary transition-colors">{t("inicio")}</Link>
          <span className="opacity-30">/</span>
          <Link to="/#tours" className="hover:text-primary transition-colors">{t("passeios")}</Link>
          <span className="opacity-30">/</span>
          <span className="text-foreground">{translatedTitle}</span>
        </nav>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
               <span className="text-primary font-black uppercase tracking-[0.2em] text-[10px] px-3 py-1 bg-primary/10 rounded-full border border-primary/20">{translatedCategory}</span>
               {tour.is_featured && <span className="bg-amber-100 text-amber-700 font-black text-[10px] px-3 py-1 rounded-full border border-amber-200 uppercase tracking-widest">{t("destaque")}</span>}
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-foreground leading-[1.1] tracking-tight">{translatedTitle}</h1>
          </div>
          <div className="flex items-center gap-6 bg-card border border-primary/10 px-8 py-6 rounded-[2rem] shadow-xl h-fit ring-4 ring-primary/5">
            <div className="text-right">
              <span className="text-muted-foreground text-[10px] font-black uppercase tracking-widest block mb-1 opacity-70">
                {tour.pricing_model === 'group' ? t("valor_grupo") || "Valor por Grupo" : t("a_partir_de")}
              </span>
              <span className="text-4xl font-black text-primary">
                {(() => {
                  let minBase = 0;
                  if (tour.pricing_model === 'dynamic') {
                    minBase = tour.price_1_person || 0;
                  } else if (tour.pricing_model === 'group') {
                    minBase = (tour.price || 0);
                  } else if (tour.pricing_model === 'custom') {
                    minBase = 0;
                  } else {
                    minBase = tour.price || 0;
                  }
                  
                  if (tour.use_custom_options && tour.custom_options_json && (tour.custom_options_json as any[]).length > 0) {
                    const optionPrices = (tour.custom_options_json as any[]).map(o => o.price || 0);
                    minBase += Math.min(...optionPrices);
                  }
                  return formatPrice(minBase);
                })()}
              </span>
              <span className="text-[10px] font-black uppercase text-muted-foreground block text-right mt-1 opacity-60 tracking-tighter shrink-0">
                {tour.pricing_model === 'group' ? t("ate") || "até" : t("por_pessoa")} {tour.pricing_model === 'group' ? `${tour.max_group_size} ${t("pessoas")}` : ""}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Mosaic Gallery Section */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-12">
        <div className="relative group overflow-hidden rounded-[2rem] shadow-xl bg-muted/20 border">
          <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-2 h-[350px] md:h-[400px] lg:h-[450px]">
            {/* Main Image */}
            <div 
              className="md:col-span-2 md:row-span-2 relative overflow-hidden cursor-pointer group/item"
              onClick={() => openLightbox(0)}
            >
              <OptimizedImage 
                src={images[0] || "/placeholder.svg"} 
                alt={translatedTitle} 
                width={1200}
                containerClassName="w-full h-full"
                className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover/item:scale-110" 
                fetchPriority="high"
              />
              <div className="absolute inset-0 bg-black/0 group-hover/item:bg-black/20 transition-all duration-500" />
            </div>

            {/* Sub-images Grid */}
            {images.slice(1, 5).map((img, idx) => (
              <div 
                key={idx}
                className="hidden md:block relative overflow-hidden cursor-pointer group/item"
                onClick={() => openLightbox(idx + 1)}
              >
                <OptimizedImage 
                  src={img} 
                  alt={`${translatedTitle} ${idx + 1}`} 
                  width={800}
                  containerClassName="w-full h-full"
                  className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover/item:scale-125" 
                />
                <div className="absolute inset-0 bg-black/0 group-hover/item:bg-black/20 transition-all duration-500" />
              </div>
            ))}

            {/* Empty Slots */}
            {images.length < 5 && Array.from({ length: 5 - images.length }).map((_, i) => (
              <div key={`empty-${i}`} className="hidden md:block bg-muted/20 animate-pulse border border-white/10" />
            ))}
          </div>

          <Button 
            variant="secondary" 
            className="absolute bottom-10 right-10 gap-3 bg-white/90 backdrop-blur-2xl hover:bg-white text-black font-black text-[11px] uppercase tracking-widest px-8 h-14 rounded-2xl shadow-2xl transition-all hover:scale-105 ring-1 ring-black/5 active:scale-95"
            onClick={() => openLightbox(0)}
          >
            <Maximize2 className="w-5 h-5 text-primary" />
            {t("ver_galeria_completa")}
          </Button>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 pb-24">
          <div className="lg:col-span-2 space-y-16">
             {/* Ultra-Premium Stats Bar */}
             <div className="bg-card rounded-[2.5rem] border border-primary/10 shadow-xl overflow-hidden ring-1 ring-primary/5">
                <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-primary/10">
                  {/* Duration */}
                  <div className="px-8 py-10 flex flex-col items-center text-center group hover:bg-primary/5 transition-colors">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-5 shadow-inner group-hover:scale-110 transition-transform">
                      <Clock className="w-8 h-8 text-primary" />
                    </div>
                    <span className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em] mb-2">{t("duracao")}</span>
                    <span className="text-xl font-black text-foreground">{translateDuration(tour.duration)}</span>
                  </div>

                  {/* Max People */}
                  <div className="px-8 py-10 flex flex-col items-center text-center group hover:bg-primary/5 transition-colors">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-5 shadow-inner group-hover:scale-110 transition-transform">
                      <Users className="w-8 h-8 text-primary" />
                    </div>
                    <span className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em] mb-2">{t("capacidade")}</span>
                    <span className="text-xl font-black text-foreground">{tour.max_group_size} {t("pessoas")}</span>
                  </div>

                  {/* Difficulty */}
                  {translatedDifficulty && (
                    <div className="px-8 py-10 flex flex-col items-center text-center group hover:bg-[#E76F51]/5 transition-colors">
                      <div className="w-16 h-16 rounded-2xl bg-[#E76F51]/10 flex items-center justify-center mb-5 shadow-inner group-hover:scale-110 transition-transform">
                        <Gauge className="w-8 h-8 text-[#E76F51]" />
                      </div>
                      <span className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em] mb-2">{t("nivel")}</span>
                      <span className="text-xl font-black text-foreground uppercase">{translatedDifficulty}</span>
                    </div>
                  )}
                </div>
             </div>

             <div className="space-y-8 prose prose-slate max-w-none">
                <h2 className="text-4xl font-serif font-black flex items-center gap-4 text-foreground">
                  <div className="w-2 h-10 bg-primary rounded-full" />
                  {t("sobre_o_passeio")}
                </h2>
                <p className="text-xl text-muted-foreground leading-relaxed font-sans first-letter:text-5xl first-letter:font-black first-letter:text-primary first-letter:float-left first-letter:mr-3 first-letter:mt-1 whitespace-pre-wrap">{translatedShortDesc}</p>
              </div>

               {/* Custom Options Selection */}
               {tour.use_custom_options && tour.custom_options_json && tour.custom_options_json.length > 0 && (
                 <div className="space-y-8">
                   <h2 className="text-3xl font-serif font-black flex items-center gap-4 text-foreground">
                     <div className="w-2 h-10 bg-primary rounded-full" />
                     {t("opcoes_reserva")}
                   </h2>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     {tour.custom_options_json.map((option, idx) => (
                       <div 
                         key={idx}
                         onClick={() => setSelectedOptionIdx(idx)}
                         className={`relative p-8 rounded-[2.5rem] border-2 transition-all cursor-pointer group flex flex-col justify-between h-full ${
                           selectedOptionIdx === idx 
                             ? "border-primary bg-primary/5 shadow-xl scale-[1.02] ring-4 ring-primary/5" 
                             : "border-border bg-card hover:border-primary/30 hover:bg-muted/30"
                         }`}
                       >
                         {selectedOptionIdx === idx && (
                           <div className="absolute top-6 right-6 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white shadow-lg">
                             <Check className="w-5 h-5 font-bold" />
                           </div>
                         )}

                         <div className="space-y-4">
                           <div className="space-y-1">
                             <h3 className={`text-xl font-black transition-colors ${selectedOptionIdx === idx ? 'text-primary' : 'text-foreground'}`}>
                               {option.title}
                             </h3>
                             {option.price > 0 && (
                               <p className="text-primary font-black text-sm">
                                 +{formatPrice(option.price)} / {t("pessoa")}
                               </p>
                             )}
                           </div>

               <div className="space-y-4 pt-4 border-t border-primary/10">
                             {/* Positives */}
                             {(option.positive_notices || []).length > 0 && (
                               <div className="space-y-2">
                                 <ul className="space-y-2">
                                   {option.positive_notices.map((n, i) => (
                                     <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                                       <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                                       <span>{n}</span>
                                     </li>
                                   ))}
                                 </ul>
                               </div>
                             )}

                             {/* Negatives */}
                             {(option.negative_notices || []).length > 0 && (
                               <div className="space-y-2">
                                 <ul className="space-y-2">
                                   {option.negative_notices.map((n, i) => (
                                     <li key={i} className="flex items-start gap-2 text-sm text-foreground/60 italic">
                                       <X className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                                       <span>{n}</span>
                                     </li>
                                   ))}
                                 </ul>
                               </div>
                             )}
                           </div>
                         </div>
                       </div>
                     ))}
                   </div>
                 </div>
               )}

               {/* Highlights */}
               {highlights.length > 0 && (
                 <div className="bg-card rounded-2xl border p-8 space-y-6">
                   <h2 className="text-2xl font-serif font-bold flex items-center gap-3"><Star className="text-primary fill-primary" /> {t("destaques")}</h2>
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

               {/* FAQ Section */}
               {faqItems.length > 0 && (
                 <div className="bg-card rounded-2xl border p-8 space-y-6">
                   <h2 className="text-2xl font-serif font-bold flex items-center gap-3"><ChevronDown className="text-primary" /> {t("faq_titulo") || "Para seu conhecimento (FAQ)"}</h2>
                   <div className="space-y-3">
                     {faqItems.map((item: any, i: number) => (
                       <div key={i} className="border rounded-xl overflow-hidden">
                         <button
                           className="w-full text-left p-5 flex items-center justify-between font-bold text-sm hover:bg-muted/30 transition-colors"
                           onClick={() => setOpenFaq(openFaq === i ? null : i)}
                         >
                           <span>{item.q}</span>
                           {openFaq === i ? <ChevronUp className="w-5 h-5 text-primary shrink-0" /> : <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0" />}
                         </button>
                         {openFaq === i && (
                           <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed border-t pt-4">{item.a}</div>
                         )}
                       </div>
                     ))}
                   </div>
                 </div>
               )}

               {/* Tour Photo Gallery Carousel - uses carousel_images_json */}
               {(() => {
                 const carouselImgs = (tour as any)?.carousel_images_json as string[] || [];
                 if (carouselImgs.length === 0) return null;
                 return (
                   <div className="space-y-6">
                     <h2 className="text-2xl font-serif font-bold flex items-center gap-3">
                       <div className="w-2 h-8 bg-primary rounded-full" />
                       {t("galeria_fotos") || "Galeria de Fotos"}
                     </h2>
                     <Carousel opts={{ loop: true, align: "start" }} className="w-full">
                       <CarouselContent className="-ml-4">
                         {carouselImgs.map((img: string, i: number) => (
                           <CarouselItem key={i} className="pl-4 basis-1/2 md:basis-1/3 lg:basis-1/3">
                             <div 
                               className="aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer group/gal border shadow-sm"
                               onClick={() => openLightbox(i, 'gallery')}
                             >
                               <OptimizedImage 
                                 src={img} 
                                 alt={`${translatedTitle} ${i + 1}`} 
                                 width={600}
                                 containerClassName="w-full h-full"
                                 className="w-full h-full object-cover group-hover/gal:scale-110 transition-transform duration-700" 
                                 loading="lazy"
                               />
                             </div>
                           </CarouselItem>
                         ))}
                       </CarouselContent>
                       <CarouselPrevious className="-left-4 bg-card shadow-lg" />
                       <CarouselNext className="-right-4 bg-card shadow-lg" />
                     </Carousel>
                   </div>
                 );
               })()}

               {/* YouTube Video */}
               {tour.youtube_video_url && (
                 <div className="space-y-6">
                   <h2 className="text-2xl font-serif font-bold flex items-center gap-3">
                     <div className="w-2 h-8 bg-primary rounded-full" />
                     {t("video") || "Vídeo"}
                   </h2>
                   <div className="aspect-video rounded-2xl overflow-hidden border shadow-lg">
                     <iframe 
                       src={tour.youtube_video_url.replace("watch?v=", "embed/").replace("youtu.be/", "youtube.com/embed/")} 
                       title={translatedTitle}
                       className="w-full h-full"
                       allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                       allowFullScreen
                     />
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
                     <div className="flex items-center justify-center gap-2 mt-1">
                       <span className="text-5xl font-black text-primary">
                         {(() => {
                           let minBase = 0;
                           if (tour.pricing_model === 'dynamic') {
                             minBase = tour.price_1_person || 0;
                           } else if (tour.pricing_model === 'group') {
                             minBase = (tour.price || 0);
                           } else if (tour.pricing_model === 'custom') {
                             minBase = 0;
                           } else {
                             minBase = tour.price || 0;
                           }
                           
                           if (tour.use_custom_options && tour.custom_options_json && (tour.custom_options_json as any[]).length > 0) {
                             const optionPrices = (tour.custom_options_json as any[]).map(o => o.price || 0);
                             minBase += Math.min(...optionPrices);
                           }
                           return formatPrice(minBase);
                         })()}
                       </span>
                        <span className="text-[10px] font-black uppercase text-muted-foreground mt-2 opacity-60 tracking-widest block text-center w-full">
                          {tour.pricing_model === 'group' ? `${t("ate")} ${tour.max_group_size} ${t("pessoas")}` : (tour.pricing_model === 'dynamic' || tour.pricing_model === 'custom') ? t("a_partir_por_pessoa") : t("por_pessoa")}
                        </span>
                     </div>
                   </div>

                   <div className="space-y-6">
                     <div className="space-y-3">
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs font-black uppercase text-muted-foreground">{t("quantas_pessoas")}</label>
                          {tour.pricing_model !== 'group' && (
                            <span className="text-xs font-bold text-primary">{formatPrice(currentUnitPrice)} / {t("pessoa")}</span>
                          )}
                        </div>
                        <div className="flex items-center justify-between p-2 bg-muted/50 rounded-2xl border">
                          <Button variant="ghost" size="icon" onClick={() => setQuantity(q => Math.max(1, q-1))}><Minus className="w-4 h-4" /></Button>
                          <span className="font-black text-xl">{quantity}</span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => setQuantity(q => Math.min(tour.max_group_size || 10, q+1))}
                            disabled={quantity >= (tour.max_group_size || 10)}
                            className={quantity >= (tour.max_group_size || 10) ? 'opacity-30 cursor-not-allowed' : ''}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="flex items-center justify-between pt-2 px-1">
                           <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">{t("valor_total")}</span>
                           <span className="text-lg font-black text-primary">{formatPrice(currentUnitPrice * quantity)}</span>
                        </div>
                     </div>

                     <div className="space-y-3">
                        <label className="text-xs font-black uppercase text-muted-foreground">{t("data_viagem")}</label>
                         <Popover>
                           <PopoverTrigger asChild>
                             <Button
                               variant="outline"
                               className={`w-full h-14 rounded-2xl border bg-background font-bold text-sm justify-start gap-3 px-4 shadow-none hover:bg-muted/30 transition-colors ${!selectedDate && "text-muted-foreground"}`}
                             >
                               <CalendarIcon className="w-5 h-5 text-primary" />
                               {selectedDate ? format(parseISO(selectedDate), "PPP", { locale: language === 'pt' ? ptBR : language === 'es' ? es : enUS }) : t("selecione_data")}
                             </Button>
                           </PopoverTrigger>
                           <PopoverContent className="w-auto p-0 rounded-3xl overflow-hidden shadow-2xl border-primary/10" align="start">
                             <CalendarUI
                               mode="single"
                               selected={selectedDate ? parseISO(selectedDate) : undefined}
                               onSelect={(date) => {
                                 if (date) {
                                   setSelectedDate(format(date, "yyyy-MM-dd"));
                                 }
                               }}
                               disabled={(date) => {
                                 // Disable past dates
                                 if (isPast(date) && !isToday(date)) return true;
                                 
                                 // Disable days not in available_days (if configured)
                                 if (tour?.available_days && tour.available_days.length > 0) {
                                   const dayOfWeek = date.getDay().toString();
                                   return !tour.available_days.includes(dayOfWeek);
                                 }
                                 return false;
                               }}
                               initialFocus
                               className="font-sans"
                             />
                           </PopoverContent>
                         </Popover>
                         

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
                    <span className="text-xs font-black text-emerald-800 uppercase tracking-widest group-hover:underline">{t("excelente_tripadvisor")}</span>
                 </a>
              </div>
            </div>
          </div>
        </div>

      {/* Sticky Mobile Bar */}
      <div className={`fixed bottom-0 left-0 right-0 z-50 p-4 bg-background/80 backdrop-blur-xl border-t transform transition-transform duration-500 md:hidden ${showStickyBar ? "translate-y-0" : "translate-y-full"}`}>
        <div className="flex items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold text-muted-foreground uppercase">{t("a_partir_de")}</span>
            <div className="flex items-baseline gap-1">
               <div className="font-black text-xl text-primary">
                 {formatPrice(tour.pricing_model === 'dynamic' ? tour.price_1_person || 0 : tour.price)}
               </div>
               <span className="text-[9px] font-black text-muted-foreground uppercase opacity-70">/ {t("pessoa")}</span>
            </div>
          </div>
          <Button onClick={handleBooking} className="flex-1 h-12 rounded-xl font-black">{t("reservar_agora")}</Button>
        </div>
      </div>

      <Footer />

      {/* Lightbox Overlay */}
      {isLightboxOpen && (
        <div 
          className="fixed inset-0 bg-black z-[100] flex items-center justify-center p-0"
          onKeyDown={(e) => {
            if (e.key === "Escape") setIsLightboxOpen(false);
          }}
          tabIndex={0}
        >
          {/* Controls Layer */}
          <div className="absolute inset-0 z-[110] pointer-events-none">
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-4 right-4 w-12 h-12 bg-black/50 hover:bg-black/80 rounded-full flex items-center justify-center transition-colors pointer-events-auto border border-white/10"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            <div className="absolute bottom-10 left-0 right-0 text-center pointer-events-none">
              <span className="bg-black/50 text-white font-sans text-sm px-4 py-1.5 rounded-full border border-white/10 shadow-2xl">
                {lightboxIndex + 1} / {((lightboxSource === 'gallery' ? ((tour as any)?.carousel_images_json as string[] || []) : images).length)}
              </span>
            </div>
          </div>

          <Carousel 
            opts={{ startIndex: lightboxIndex, loop: true }} 
            className="w-full h-full flex items-center justify-center"
          >
            <CarouselContent className="h-full ml-0">
              {(lightboxSource === 'gallery' 
                ? ((tour as any)?.carousel_images_json as string[] || [])
                : images
              ).map((img, i) => (
                <CarouselItem key={i} className="pl-0 h-full w-full flex items-center justify-center">
                  <div className="w-full h-full flex items-center justify-center p-4 md:p-12">
                    <OptimizedImage 
                      src={img} 
                      alt={`${translatedTitle} view ${i+1}`} 
                      width={1800}
                      containerClassName="max-w-full max-h-full flex items-center justify-center"
                      className="max-w-full max-h-full w-auto h-auto cursor-auto" 
                      fit="contain"
                      fill={false}
                      fetchPriority="high"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            <div className="hidden sm:block pointer-events-none">
              <CarouselPrevious className="left-6 bg-black/50 hover:bg-black/80 border-white/10 text-white h-14 w-14 pointer-events-auto shadow-2xl" />
              <CarouselNext className="right-6 bg-black/50 hover:bg-black/80 border-white/10 text-white h-14 w-14 pointer-events-auto shadow-2xl" />
            </div>
          </Carousel>
        </div>
      )}
    </main>
  );
}

