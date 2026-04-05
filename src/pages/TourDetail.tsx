import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Clock, Users, MapPin, Calendar, Check, ChevronDown, ChevronUp, ArrowLeft, Star, Shield, Utensils, Activity, Sun, Sunrise, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteData } from "@/hooks/useSiteData";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function TourDetail() {
  const { id } = useParams<{ id: string }>();
  const { tours } = useSiteData();
  const [currentImage, setCurrentImage] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isPrivate, setIsPrivate] = useState(false);

  const tour = tours.find((t) => t.id === id || t.slug === id);

  const availablePeriods = tour ? [
    { id: 'morning', label: 'Manhã', active: tour.has_morning !== false, Icon: Sunrise },
    { id: 'afternoon', label: 'Tarde', active: tour.has_afternoon === true, Icon: Sun },
    { id: 'night', label: 'Noite', active: tour.has_night === true, Icon: Moon },
  ].filter(p => p.active) : [];

  const [selectedPeriod, setSelectedPeriod] = useState('morning');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (tour) {
      // If only private is allowed, default to it
      if (tour.allows_private && !tour.allows_open) {
        setIsPrivate(true);
      } else {
        setIsPrivate(false);
      }

      if (availablePeriods.length > 0) {
        setSelectedPeriod(availablePeriods[0].id);
      }
    }
  }, [tour]);
  
  if (!tour) {
    return (
      <main>
        <Header />
        <div className="min-h-screen flex flex-col items-center justify-center pt-20">
          <h1 className="font-serif text-3xl font-bold text-foreground mb-4">Passeio não encontrado</h1>
          <Link to="/">
            <Button variant="outline" className="font-sans">
              <ArrowLeft className="w-4 h-4 mr-2" />Voltar para home
            </Button>
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  const images = tour.image_url 
    ? [tour.image_url, tour.image_url, tour.image_url] 
    : ["https://images.unsplash.com/photo-1619546952812-520e98064a52?q=80&w=1200"];

  const nextImage = () => setCurrentImage((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentImage((prev) => (prev - 1 + images.length) % images.length);

  const highlights = tour.included_json || [
    { icon: "MapPin", text: "Transporte ida e volta" },
    { icon: "Utensils", text: "Almoço incluso" },
    { icon: "Shield", text: "Equipamento de segurança" },
    { icon: "Activity", text: "Instrutor especializado" },
  ];

  const faqItems = tour.faq_json || [
    { q: "O que está incluído?", a: "Transporte, almoço, equipamento de segurança e instrutor especializado." },
    { q: "O que devo levar?", a: "Roupas confortáveis, tênis (que possam molhar), protetor solar e repelente." },
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
      default: return Check;
    }
  };



  return (
    <main className="min-h-screen bg-background">
      <Header />

      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground font-sans mb-6">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <span>/</span>
            <Link to="/#tours" className="hover:text-foreground transition-colors">Passeios</Link>
            <span>/</span>
            <span className="text-foreground">{tour.title}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="relative rounded-2xl overflow-hidden bg-muted shadow-lg">
                <img 
                  src={images[currentImage]} 
                  alt={tour.title}
                  className="w-full h-[400px] lg:h-[500px] object-cover"
                />
                {images.length > 1 && (
                  <>
                    <button 
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/90 hover:bg-background rounded-full flex items-center justify-center shadow-lg transition-all"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/90 hover:bg-background rounded-full flex items-center justify-center shadow-lg transition-all"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {images.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentImage(i)}
                          className={`w-2 h-2 rounded-full transition-all ${i === currentImage ? "bg-primary w-6" : "bg-background/60"}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              <div className="bg-card rounded-2xl border border-border/50 p-6 lg:p-8 shadow-sm">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    {tour.category && (
                      <span className="text-sm font-bold text-primary font-sans uppercase tracking-wider">{tour.category}</span>
                    )}
                    <h1 className="font-serif text-2xl lg:text-4xl font-bold text-foreground mt-1">
                      {tour.title}
                    </h1>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-amber-500 bg-amber-50 px-3 py-1 rounded-full border border-amber-100">
                    < Star className="w-4 h-4 fill-current" />
                    <span className="font-bold font-sans">4.9</span>
                    <span className="text-muted-foreground font-sans text-xs">(128)</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-6 text-sm text-muted-foreground font-sans mb-8 pb-6 border-b border-border">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary/70" />
                    <span className="font-medium">{tour.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary/70" />
                    <span className="font-medium">Até {tour.max_group_size} pessoas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary/70" />
                    <span className="font-medium">Todos os dias</span>
                  </div>
                </div>

                <div className="prose prose-sm max-w-none text-muted-foreground font-sans">
                  <p className="text-lg leading-relaxed whitespace-pre-wrap text-foreground/80">
                    {tour.short_description}
                  </p>
                </div>
              </div>

              {tour.itinerary_json && tour.itinerary_json.length > 0 && (
                <div className="bg-card rounded-2xl border border-border/50 p-6 lg:p-8 shadow-sm">
                  <h2 className="font-serif text-2xl lg:text-3xl font-bold text-[#2A9D8F] mb-2">
                    Itinerário e Detalhes
                  </h2>
                  <p className="text-muted-foreground font-sans text-sm mb-8">
                    Apenas para referência. Os itinerários estão sujeitos a alterações.
                  </p>
                  
                  <div className="space-y-0 relative">
                    {tour.itinerary_json.map((step, i) => (
                      <div key={i} className="relative pl-10 pb-8 last:pb-0">
                        {i !== tour.itinerary_json!.length - 1 && (
                          <div className="absolute top-6 left-[11px] bottom-[-8px] w-0 border-l-[2px] border-dashed border-[#F4A261]/40 z-0"></div>
                        )}
                        <div className="absolute top-0 left-0 z-10 bg-background pt-1 pb-1">
                           <MapPin className="w-6 h-6 text-[#E76F51] fill-[#E76F51]/10" />
                        </div>
                        <h3 className="font-bold text-[#2A9D8F] font-sans text-lg mb-2 pt-1">{step.time}</h3>
                        <p className="text-muted-foreground font-sans text-sm leading-relaxed">{step.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-card rounded-2xl border border-border/50 p-6 lg:p-8 shadow-sm">
                <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
                  O que está incluído
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {highlights.map((item, i) => {
                    const Icon = getIcon(item.icon);
                    return (
                      <div key={i} className="flex items-center gap-4 group">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                        <span className="text-foreground font-sans font-medium">{item.text}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {faqItems.length > 0 && (
                <div className="bg-card rounded-2xl border border-border/50 p-6 lg:p-8 shadow-sm">
                  <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
                    Para seu conhecimento
                  </h2>
                  <div className="space-y-4">
                    {faqItems.map((item, i) => (
                      <div key={i} className="border border-border/50 rounded-xl overflow-hidden">
                        <button
                          onClick={() => setOpenFaq(openFaq === i ? null : i)}
                          className={`w-full flex items-center justify-between gap-4 text-left p-4 transition-colors ${openFaq === i ? "bg-muted/50" : "hover:bg-muted/30"}`}
                        >
                          <span className="font-bold text-foreground font-sans">{item.q}</span>
                          {openFaq === i ? (
                            <ChevronUp className="w-5 h-5 text-primary flex-shrink-0" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                          )}
                        </button>
                        {openFaq === i && (
                          <div className="p-4 pt-0 bg-muted/20">
                            <p className="border-t border-border/30 pt-4 text-muted-foreground font-sans text-sm leading-relaxed">
                              {item.a}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sticky Booking Widget */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <div className="bg-card rounded-3xl border border-border/50 p-6 shadow-2xl overflow-hidden">
                  <div className="mb-6 pb-6 border-b text-center">
                    <span className="text-sm text-muted-foreground font-sans uppercase tracking-widest block mb-1">A partir de</span>
                    <span className="text-5xl font-bold text-primary font-sans">
                      R$ {tour.price}
                    </span>
                    <span className="text-muted-foreground font-sans text-sm block mt-1"> por pessoa</span>
                  </div>
                  
                  {(tour.allows_open || tour.allows_private) && (
                    <div className="mb-8">
                       <div className="flex gap-2 mb-4 bg-muted/50 p-1.5 rounded-full border border-border/50">
                        {tour.allows_open !== false && (
                          <button 
                            onClick={() => setIsPrivate(false)}
                            className={`flex-1 font-sans text-sm py-2.5 px-4 rounded-full font-bold transition-all ${
                              !isPrivate 
                                ? "bg-primary text-primary-foreground shadow-lg" 
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            Open grupo
                          </button>
                        )}
                        {tour.allows_private && (
                          <button 
                            onClick={() => setIsPrivate(true)}
                            className={`flex-1 font-sans text-sm py-2.5 px-4 rounded-full font-bold transition-all ${
                              isPrivate 
                                ? "bg-[#008967] text-white shadow-lg" 
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            Grupo Privado
                          </button>
                        )}
                      </div>
                      
                      <div className="min-h-[44px] flex items-center justify-center px-4 bg-muted/20 rounded-2xl border border-dashed border-border py-2">
                        <p className="text-center text-[12px] text-muted-foreground font-sans leading-snug">
                          {isPrivate 
                            ? "Passeios privados oferecem uma experiência exclusiva apenas para o seu grupo."
                            : "Os grupos abertos são formados automaticamente de acordo com as disponibilidades."
                          }
                        </p>
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-8 mb-8">
                    {availablePeriods.length > 0 && (
                      <div className="border-t pt-6">
                        <h4 className="font-serif font-bold text-foreground mb-4 text-center">Qual período você prefere?</h4>
                        <div className="grid grid-cols-1 gap-2">
                          {availablePeriods.map((p) => (
                            <button 
                              key={p.id}
                              onClick={() => setSelectedPeriod(p.id)}
                              className={`flex items-center justify-between gap-4 py-4 px-6 rounded-2xl font-bold font-sans text-sm transition-all border-2 ${
                                selectedPeriod === p.id 
                                  ? "bg-primary/5 border-primary text-primary shadow-inner" 
                                  : "bg-background border-border hover:border-primary/30 text-muted-foreground"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <p.Icon className={`w-5 h-5 ${selectedPeriod === p.id ? "text-primary" : "text-muted-foreground"}`} />
                                {p.label}
                              </div>
                              {selectedPeriod === p.id && <Check className="w-5 h-5" />}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="border-t pt-6 border-b pb-6 flex flex-col gap-4">
                       <div className="flex items-center justify-between text-sm font-sans px-2">
                         <span className="text-foreground font-bold font-sans text-base">Data da Viagem</span>
                         <Calendar className="w-5 h-5 text-primary" />
                       </div>
                       <input 
                         type="date" 
                         className="w-full px-5 py-4 rounded-2xl border-2 border-border bg-muted/10 text-foreground font-sans font-bold text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                       />
                    </div>
                  </div>

                  <Button className="w-full h-16 text-lg font-sans font-black rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                    RESERVAR AGORA
                  </Button>

                  <div className="mt-8 pt-6 border-t border-border space-y-3">
                    <div className="flex items-center gap-3 text-sm text-muted-foreground font-sans">
                      <Shield className="w-5 h-5 text-green-600" />
                      <span className="font-semibold text-foreground/80">Pagamento 100% Seguro</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground font-sans">
                      <Check className="w-5 h-5 text-green-600" />
                      <span className="font-semibold text-foreground/80">Cancelamento Grátis até 24h</span>
                    </div>
                  </div>
                </div>

                <Link to="/" className="block mt-6">
                  <Button variant="ghost" className="w-full font-sans group text-muted-foreground hover:text-primary">
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Explorar outros destinos
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
