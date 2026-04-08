import { useState, useEffect, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Clock, Users, MapPin, Calendar, Check, ChevronDown, ChevronUp, ArrowLeft, Star, Shield, Utensils, Activity, Sun, Sunrise, Moon, Plus, Minus, Gauge, Youtube, Cloud, Droplets, Wind } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteData } from "@/hooks/useSiteData";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLocale } from "@/contexts/LocaleContext";
import { useCart } from "@/contexts/CartContext";
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

  const tour = tours.find((t) => t.id === id || t.slug === id);
  const siteTitle = siteSettings?.site_title?.split('|')[0].trim() || "Eco-Wanderlust";

  // Get TripAdvisor URL from social media
  const tripAdvisorSocial = socialMedia.find(s => 
    s.platform.toLowerCase().includes('tripadvisor') && s.is_active !== false
  );
  console.log("TripAdvisor social:", tripAdvisorSocial);
  console.log("All socialMedia:", socialMedia);
  const tripAdvisorUrl = tripAdvisorSocial?.url || "https://www.tripadvisor.com.br/";

  const getTranslated = (obj: any, field: string) => {
    if (!obj) return "";
    if (language === 'pt') return obj[field];
    return obj[`${field}_${language}`] || obj[field];
  };

  const translatedTitle = getTranslated(tour, 'title');
  const translatedShortDesc = getTranslated(tour, 'short_description');
  const translatedCategory = getTranslated(tour, 'category');
  const translatedDifficulty = getTranslated(tour, 'difficulty');
  const translatedItinerary = getTranslated(tour, `itinerary_json${language !== 'pt' ? `_${language}` : ""}`) || tour?.itinerary_json;
  const translatedIncluded = getTranslated(tour, `included_json${language !== 'pt' ? `_${language}` : ""}`) || tour?.included_json;
  const translatedFaq = getTranslated(tour, `faq_json${language !== 'pt' ? `_${language}` : ""}`) || tour?.faq_json;
  const translatedHighlights = getTranslated(tour, `highlights_json${language !== 'pt' ? `_${language}` : ""}`) || tour?.highlights_json;

  const getYoutubeId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const youtubeId = tour?.youtube_video_url ? getYoutubeId(tour.youtube_video_url) : null;

  const availablePeriods = tour ? [
    { id: 'morning', label: t('amanha'), active: tour.has_morning !== false, Icon: Sunrise },
    { id: 'afternoon', label: t('tarde'), active: tour.has_afternoon === true, Icon: Sun },
    { id: 'night', label: t('noite'), active: tour.has_night === true, Icon: Moon },
  ].filter(p => p.active) : [];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (tour) {
      if (tour.allows_private && !tour.allows_open) {
        setIsPrivate(true);
      } else {
        setIsPrivate(false);
      }

      if (availablePeriods.length > 0) {
        setSelectedPeriod(availablePeriods[0].id);
      }
    }
  }, [tour, availablePeriods.length]);

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
        
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=-22.9068&longitude=-43.1729&daily=temperature_2m_max,temperature_2m_min,weathercode&forecast_days=16`
        );
        
        if (response.ok) {
          const data = await response.json();
          const dayIndex = daysAhead;
          
          if (data.daily && data.daily.temperature_2m_max[dayIndex] !== undefined) {
            const weatherCode = data.daily.weathercode[dayIndex];
            const conditions: Record<number, string> = {
              0: 'Ensolarado',
              1: 'Parcialmente nublado',
              2: 'Nublado',
              3: 'Nublado',
              45: 'Neblina',
              48: 'Neblina',
              51: 'Chuva leve',
              53: 'Chuva moderada',
              55: 'Chuva forte',
              61: 'Chuva',
              63: 'Chuva',
              65: 'Chuva forte',
              80: 'Temporal',
              81: 'Temporal',
              82: 'Temporal',
              95: 'Tempestade',
              96: 'Tempestade',
              99: 'Tempestade',
            };
            
            setWeather({
              temp: Math.round((data.daily.temperature_2m_max[dayIndex] + data.daily.temperature_2m_min[dayIndex]) / 2),
              condition: conditions[weatherCode] || 'Parcialmente nublado',
              humidity: 70,
              wind: 12,
            });
          }
        }
      } catch (error) {
        console.error("Weather fetch error:", error);
        setWeather(null);
      }
    };
    
    fetchWeather();
  }, [selectedDate]);
  
  const handleBooking = () => {
    if (!tour) return;
    if (!selectedDate) {
      alert(language === 'pt' ? "Por favor, selecione uma data." : "Please select a date.");
      return;
    }

    addToCart({
      id: tour.id,
      title: translatedTitle,
      price: tour.price,
      image_url: tour.image_url || images[0],
      date: selectedDate,
      period: selectedPeriod,
      isPrivate: isPrivate,
      quantity: quantity
    });

    navigate("/carrinho");
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        <p className="mt-4 font-sans text-muted-foreground">{t("carregando_passeio")}</p>
      </main>
    );
  }

  if (!tour) {
    return (
      <main>
        <Header />
        <div className="min-h-screen flex flex-col items-center justify-center pt-20">
          <h1 className="font-serif text-3xl font-bold text-foreground mb-4">{t("nao_encontrado")}</h1>
          <Link to="/">
            <Button variant="outline" className="font-sans">
              <ArrowLeft className="w-4 h-4 mr-2" />{t("voltar_home")}
            </Button>
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  const images = tour.images_json && tour.images_json.length > 0
    ? tour.images_json 
    : tour.image_url 
      ? [tour.image_url, tour.image_url, tour.image_url, tour.image_url] 
      : ["https://images.unsplash.com/photo-1619546952812-520e98064a52?q=80&w=1200", "https://images.unsplash.com/photo-1512753360413-a496f8824f1c?q=80&w=1200", "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?q=80&w=1200", "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200"];

  const highlights = (translatedHighlights as any[]) || [
    { icon: "MapPin", text: t("transporte_trans") },
    { icon: "Utensils", text: t("almoco_inc") },
    { icon: "Shield", text: t("equip_seg") },
    { icon: "Activity", text: t("instrutor_esp") },
  ];

  const faqItems = (translatedFaq as any[]) || [
    { q: t("o_que_inclui"), a: t("o_que_inclui_desc") },
    { q: t("o_que_levar"), a: t("o_que_levar_desc") },
  ];

  const getIcon = (name: string) => {
    switch(name) {
      case "MapPin": return MapPin;
      case "Utensils": return Utensils;
      case "Shield": return Shield;
      case "Activity": return Activity;
      case "Clock": return Clock;
      case "Calendar": return Calendar;
      case "Sunrise": return Sunrise;
      case "Sun": return Sun;
      case "Moon": return Moon;
      case "Gauge": return Gauge;
      default: return Check;
    }
  };

  const handleImageSwap = (idx: number) => {
    setSelectedImageIdx(idx);
  };

  return (
    <main className="min-h-screen bg-background font-sans">
      <Helmet>
        <title>{translatedTitle} | {siteTitle}</title>
        <meta name="description" content={translatedShortDesc || siteSettings?.site_description || `Descubra os melhores passeios no Rio de Janeiro com a ${siteTitle}.`} />
        <meta property="og:title" content={`${translatedTitle} | ${siteTitle}`} />
        <meta property="og:description" content={translatedShortDesc} />
        {tour.image_url && <meta property="og:image" content={tour.image_url} />}
        <meta property="og:type" content="website" />
        <link rel="canonical" href={window.location.href} />
      </Helmet>
      <Header />

      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground font-sans mb-6">
            <Link to="/" className="hover:text-foreground transition-colors">{t("inicio")}</Link>
            <span>/</span>
            <Link to="/#tours" className="hover:text-foreground transition-colors">{t("passeios")}</Link>
            <span>/</span>
            <span className="text-foreground">{translatedTitle}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
            <div className="lg:col-span-2 space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-4 aspect-video md:aspect-[2/1] gap-2 lg:gap-3 mb-4 rounded-3xl overflow-hidden shadow-2xl bg-muted/20">
                  <div className="md:col-span-3 relative h-full group cursor-zoom-in">
                    <img src={images[selectedImageIdx]} alt={tour.title} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-1000" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none z-20" />
                  </div>
                  <div className="hidden md:grid grid-rows-3 gap-2 lg:gap-3 h-full">
                    {[1, 2, 3].map((idx) => (
                      <div key={idx} className={`relative h-full overflow-hidden group cursor-pointer transition-all duration-300 ${selectedImageIdx === idx ? "ring-4 ring-primary inset-0 z-30" : "opacity-80 hover:opacity-100"}`} onClick={() => handleImageSwap(idx)}>
                        <img src={images[idx] || images[0]} alt={`Gallery ${idx}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                        {selectedImageIdx === idx && <div className="absolute inset-0 bg-primary/10 flex items-center justify-center"><Check className="text-primary w-8 h-8 drop-shadow-lg" /></div>}
                      </div>
                    ))}
                  </div>
               </div>

              <div className="bg-card rounded-2xl border border-border/50 p-6 lg:p-8 shadow-sm">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    {translatedCategory && <span className="text-sm font-bold text-primary font-sans uppercase tracking-wider">{translatedCategory}</span>}
                    <h1 className="font-serif text-2xl lg:text-4xl font-bold text-foreground mt-1">{translatedTitle}</h1>
                  </div>
                  <a 
                    href={tripAdvisorUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-amber-500 bg-amber-50 px-3 py-1 rounded-full border border-amber-100 hover:bg-amber-100 transition-colors"
                  >
                    <Star className="w-4 h-4 fill-current" />
                    <span className="font-bold font-sans">4.9</span>
                    <span className="text-muted-foreground font-sans text-xs">(128)</span>
                  </a>
                </div>

                <div className="flex flex-wrap gap-6 text-sm text-muted-foreground font-sans mb-8 pb-6 border-b border-border">
                  <div className="flex items-center gap-2"><Clock className="w-5 h-5 text-primary/70" /><span className="font-medium">{tour.duration}</span></div>
                  <div className="flex items-center gap-2"><Users className="w-5 h-5 text-primary/70" /><span className="font-medium">Até {tour.max_group_size} {language === 'pt' ? 'pessoas' : 'people'}</span></div>
                  <div className="flex items-center gap-2"><Calendar className="w-5 h-5 text-primary/70" /><span className="font-medium">{language === 'pt' ? 'Todos os dias' : 'Every day'}</span></div>
                  {translatedDifficulty && (
                    <div className="flex items-center gap-2">
                       <Gauge className="w-5 h-5 text-[#E76F51]" />
                       <span className="font-bold text-[#E76F51]">{translatedDifficulty}</span>
                    </div>
                  )}
                </div>

                <div className="prose prose-sm max-w-none text-muted-foreground font-sans"><p className="text-lg leading-relaxed whitespace-pre-wrap text-foreground/80">{translatedShortDesc}</p></div>
              </div>

              {/* Highlights Section */}
              {highlights && highlights.length > 0 && (
                <div className="bg-card rounded-2xl border border-border/50 p-6 lg:p-8 shadow-sm">
                  <h2 className="font-serif text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                    <Star className="text-primary w-6 h-6" />
                    {language === 'pt' ? 'Destaques' : 'Highlights'}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {highlights.map((item, idx) => {
                      const Icon = getIcon(item.icon);
                      return (
                        <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Icon className="w-5 h-5 text-primary" />
                          </div>
                          <span className="text-foreground font-sans text-sm">{item.text}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {translatedItinerary && (translatedItinerary as any[]).length > 0 && (
                <div className="bg-card rounded-2xl border border-border/50 p-6 lg:p-8 shadow-sm">
                  <h2 className="font-serif text-2xl lg:text-3xl font-bold text-[#2A9D8F] mb-6">{t("itinerario_detalhes")}</h2>
                  <div className="space-y-0 relative">
                    {(translatedItinerary as any[]).map((step, i) => (
                      <div key={i} className="relative pl-10 pb-8 last:pb-0">
                        {translatedItinerary && i !== (translatedItinerary as any[]).length - 1 && <div className="absolute top-6 left-[11px] bottom-[-8px] w-0 border-l-[2px] border-dashed border-[#F4A261]/40 z-0"></div>}
                        <div className="absolute top-0 left-0 z-10 bg-background pt-1 pb-1"><MapPin className="w-6 h-6 text-[#E76F51] fill-[#E76F51]/10" /></div>
                        <h3 className="font-bold text-[#2A9D8F] font-sans text-lg mb-2 pt-1">{step.time}</h3>
                        <p className="text-muted-foreground font-sans text-sm leading-relaxed">{step.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-card rounded-2xl border border-border/50 p-6 lg:p-8 shadow-sm">
                <h3 className="font-serif text-2xl font-bold text-foreground mb-6">{t("o_que_inclui")}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {(translatedIncluded as any[])?.map((item, i) => { const Icon = getIcon(item.icon); return (<div key={i} className="flex items-center gap-4 group"><div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors"><Icon className="w-6 h-6 text-primary" /></div><span className="text-foreground font-sans font-medium">{item.text}</span></div>)})}
                </div>
              </div>

              {faqItems.length > 0 && (
                <div className="bg-card rounded-2xl border border-border/50 p-6 lg:p-8 shadow-sm">
                  <h3 className="font-serif text-2xl font-bold text-foreground mb-6">{t("para_conhecimento")}</h3>
                  <div className="space-y-4">
                    {faqItems.map((item, i) => (
                      <div key={i} className="border border-border/50 rounded-xl overflow-hidden">
                        <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className={`w-full flex items-center justify-between gap-4 text-left p-4 transition-colors ${openFaq === i ? "bg-muted/50" : "hover:bg-muted/30"}`}>
                          <span className="font-bold text-foreground font-sans">{item.q}</span>
                          {openFaq === i ? <ChevronUp className="w-5 h-5 text-primary flex-shrink-0" /> : <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />}
                        </button>
                        {openFaq === i && <div className="p-4 pt-0 bg-muted/20"><p className="border-t border-border/30 pt-4 text-muted-foreground font-sans text-sm leading-relaxed">{item.a}</p></div>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {youtubeId && (
                <div className="bg-card rounded-2xl border border-border/50 p-6 lg:p-8 shadow-sm">
                   <h3 className="font-serif text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                     <Youtube className="w-6 h-6 text-red-600" />
                     {language === 'pt' ? 'Vídeo da Experiência' : 'Experience Video'}
                   </h3>
                   <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-2xl border bg-black">
                      <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${youtubeId}`} title="Experience Video" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                   </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <div className="bg-card rounded-3xl border border-border/50 p-6 shadow-2xl overflow-hidden">
                  <div className="mb-6 pb-6 border-b text-center">
                    <span className="text-sm text-muted-foreground font-sans uppercase tracking-widest block mb-1">{t("a_partir_de")}</span>
                    <span className="text-5xl font-bold text-primary font-sans">{formatPrice(tour.price * quantity)}</span>
                    <span className="text-muted-foreground font-sans text-sm block mt-2">{quantity} {quantity > 1 ? (language === 'pt' ? 'pessoas' : 'people') : (language === 'pt' ? 'pessoa' : 'person')}</span>
                  </div>
                  <div className="space-y-8 mb-8">
                    <div className="border-t pt-6">
                       <h4 className="font-serif font-bold text-foreground mb-4 text-center">{language === 'pt' ? 'Quantas pessoas?' : 'How many people?'}</h4>
                       <div className="flex items-center justify-between bg-muted/30 p-2 rounded-2xl border border-border/50 w-48 mx-auto">
                          <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 rounded-xl bg-background border flex items-center justify-center disabled:opacity-30" disabled={quantity <= 1}><Minus className="w-5 h-5" /></button>
                          <span className="font-sans font-black text-xl w-10 text-center">{quantity}</span>
                          <button onClick={() => setQuantity(Math.min(tour.max_group_size || 10, quantity + 1))} className="w-10 h-10 rounded-xl bg-background border flex items-center justify-center"><Plus className="w-5 h-5" /></button>
                       </div>
                    </div>
                    {availablePeriods.length > 0 && (
                      <div className="border-t pt-6">
                        <h4 className="font-serif font-bold text-foreground mb-4 text-center">{t("qual_periodo")}</h4>
                        <div className="grid grid-cols-1 gap-2">
                          {availablePeriods.map((p) => (<button key={p.id} onClick={() => setSelectedPeriod(p.id)} className={`flex items-center justify-between gap-4 py-4 px-6 rounded-2xl font-bold font-sans text-sm border-2 ${selectedPeriod === p.id ? "bg-primary/5 border-primary text-primary" : "bg-background border-border text-muted-foreground"}`}>{p.label}{selectedPeriod === p.id && <Check className="w-5 h-5" />}</button>))}
                        </div>
                      </div>
                    )}
                    <div className="border-t pt-6 border-b pb-6 flex flex-col gap-4">
                       <div className="flex items-center justify-between text-sm font-sans px-2">
                         <span className="text-foreground font-bold font-sans text-base">{t("data_viagem")}</span><Calendar className="w-5 h-5 text-primary" />
                       </div>
                       <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="w-full px-5 py-4 rounded-2xl border-2 border-border bg-muted/10 text-foreground font-sans font-bold text-sm" />
                    </div>
                    {weather && selectedDate && (
                      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-4 border border-blue-100 mb-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {weather.condition.includes('Ensolarado') ? <Sun className="w-8 h-8 text-amber-500" /> : 
                             weather.condition.includes('Chuva') || weather.condition.includes('Temporal') ? <Cloud className="w-8 h-8 text-gray-500" /> :
                             <Cloud className="w-8 h-8 text-blue-400" />}
                            <div>
                              <span className="font-bold text-foreground font-sans text-lg">{weather.temp}°C</span>
                              <span className="text-muted-foreground font-sans text-sm block">{weather.condition}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1"><Droplets className="w-4 h-4 text-blue-400" /><span>{weather.humidity}%</span></div>
                            <div className="flex items-center gap-1"><Wind className="w-4 h-4 text-gray-400" /><span>{weather.wind} km/h</span></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <Button onClick={handleBooking} className="w-full h-16 text-lg font-sans font-black rounded-2xl shadow-xl shadow-primary/20 active:scale-95 transition-all">{t("reservar_agora")}</Button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-muted/30 py-20 mt-12 bg-primary/5 rounded-[40px]">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="font-serif text-3xl font-bold text-foreground mb-12 text-center uppercase tracking-widest">{t("voce_tambem_pode_gostar")}</h2>
              <Carousel className="w-full">
                <CarouselContent className="-ml-4">
                  {tours
                    .filter((t_item) => t_item.id !== tour.id && t_item.slug !== tour.slug)
                    .slice(0, 6)
                    .map((item) => (
                      <CarouselItem key={item.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                        <Link to={`/passeio/${item.slug || item.id}`} className="block h-full group">
                          <div className="bg-card rounded-3xl border border-border/50 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 h-full flex flex-col">
                            <div className="relative h-64 overflow-hidden">
                              <img src={item.image_url || ""} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black font-sans text-primary">
                                {getTranslated(item, 'category')}
                              </div>
                            </div>
                            <div className="p-6 flex-1 flex flex-col">
                              <h3 className="font-serif font-bold text-xl mb-2 text-foreground group-hover:text-primary transition-colors line-clamp-1">{getTranslated(item, 'title')}</h3>
                              <p className="text-muted-foreground font-sans text-sm mb-6 line-clamp-2">{getTranslated(item, 'short_description')}</p>
                              <div className="mt-auto pt-4 flex items-center justify-between border-t border-border/40">
                                 <span className="text-primary font-black font-sans">{formatPrice(item.price)}</span>
                                 <span className="text-xs font-bold text-muted-foreground font-sans uppercase tracking-widest">{item.duration}</span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </CarouselItem>
                    ))}
                </CarouselContent>
                <div className="hidden md:block">
                  <CarouselPrevious className="-left-12 bg-white shadow-xl border-none hover:bg-primary hover:text-white" />
                  <CarouselNext className="-right-12 bg-white shadow-xl border-none hover:bg-primary hover:text-white" />
                </div>
              </Carousel>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
