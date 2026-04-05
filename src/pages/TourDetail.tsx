import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Clock, Users, MapPin, Calendar, Check, ChevronDown, ChevronUp, ArrowLeft, Star, Shield, Utensils, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteData } from "@/hooks/useSiteData";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ChevronLeft, ChevronRight } from "lucide-react";

const highlights = [
  { icon: MapPin, text: "Transporte ida e volta" },
  { icon: Utensils, text: "Almoço incluso" },
  { icon: Shield, text: "Equipamento de segurança" },
  { icon: Activity, text: "Instrutor especializado" },
];

const faqItems = [
  { q: "O que está incluído?", a: "Transporte, almoço, equipamento de segurança e instrutor especializado." },
  { q: "O que devo levar?", a: "Roupas confortáveis, tênis (que possam molhar), protetor solar e repelente." },
  { q: "É seguro para iniciantes?", a: "Sim! O rafting é suitable para todos os níveis, com orientações completas antes da atividade." },
  { q: "Cancelamento", a: "Cancelamento gratuito até 48 horas antes. Após esse prazo, 50% do valor é retido." },
];

export function TourDetail() {
  const { id } = useParams<{ id: string }>();
  const { tours } = useSiteData();
  const [currentImage, setCurrentImage] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isPrivate, setIsPrivate] = useState(false);

  const tour = tours.find((t) => t.id === id);
  
  const images = tour?.image_url 
    ? [tour.image_url, tour.image_url, tour.image_url] 
    : ["https://images.unsplash.com/photo-1619546952812-520e98064a52?q=80&w=1200"];

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

  const nextImage = () => setCurrentImage((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentImage((prev) => (prev - 1 + images.length) % images.length);

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
              <div className="relative rounded-2xl overflow-hidden bg-muted">
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

              <div className="bg-card rounded-2xl border border-border/50 p-6 lg:p-8">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    {tour.category && (
                      <span className="text-sm font-medium text-primary font-sans">{tour.category}</span>
                    )}
                    <h1 className="font-serif text-2xl lg:text-3xl font-bold text-foreground mt-1">
                      {tour.title}
                    </h1>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-amber-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="font-sans">4.9</span>
                    <span className="text-muted-foreground font-sans">(128)</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground font-sans mb-6 pb-6 border-b border-border">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{tour.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>Até {tour.max_group_size} pessoas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Todos os dias</span>
                  </div>
                </div>

                <div className="prose prose-sm max-w-none text-muted-foreground font-sans">
                  <p className="text-base leading-relaxed whitespace-pre-wrap">
                    {tour.short_description}
                  </p>
                </div>
              </div>

              {tour.itinerary_json && tour.itinerary_json.length > 0 && (
                <div className="bg-card rounded-2xl border border-border/50 p-6 lg:p-8">
                  <h2 className="font-serif text-2xl font-bold text-[#2A9D8F] mb-2">
                    Itinerário e Detalhes
                  </h2>
                  <p className="text-muted-foreground font-sans text-sm mb-8">
                    Apenas para referência. Os itinerários estão sujeitos a alterações.
                  </p>
                  
                  <div className="space-y-0 relative">
                    {tour.itinerary_json.map((step, i) => (
                      <div key={i} className="relative pl-10 pb-8 last:pb-0">
                        {i !== tour.itinerary_json!.length - 1 && (
                          <div className="absolute top-6 left-[11px] bottom-[-8px] w-0 border-l-[3px] border-dashed border-[#F4A261]/60 z-0"></div>
                        )}
                        <div className="absolute top-0 left-0 z-10 bg-background pt-1 pb-1">
                           <MapPin className="w-6 h-6 text-[#E76F51] fill-[#E76F51]/10" />
                        </div>
                        <h3 className="font-bold text-[#2A9D8F] font-sans mb-2 pt-1">{step.time}</h3>
                        <p className="text-muted-foreground font-sans text-sm leading-relaxed">{step.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-card rounded-2xl border border-border/50 p-6 lg:p-8">
                <h2 className="font-serif text-xl font-bold text-foreground mb-6">
                  O que está incluído
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {highlights.map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-5 h-5 text-primary" />
                      </div>
                      <span className="text-foreground font-sans text-sm">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-card rounded-2xl border border-border/50 p-6 lg:p-8">
                <h2 className="font-serif text-xl font-bold text-foreground mb-6">
                  Para seu conhecimento
                </h2>
                <div className="space-y-4">
                  {faqItems.map((item, i) => (
                    <div key={i} className="border-b border-border/50 last:border-0 pb-4 last:pb-0">
                      <button
                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                        className="w-full flex items-center justify-between gap-4 text-left"
                      >
                        <span className="font-medium text-foreground font-sans">{item.q}</span>
                        {openFaq === i ? (
                          <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        )}
                      </button>
                      {openFaq === i && (
                        <p className="mt-3 text-muted-foreground font-sans text-sm leading-relaxed">
                          {item.a}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <div className="bg-card rounded-2xl border border-border/50 p-6 shadow-lg">
                  <div className="mb-6 border-b pb-4">
                    <span className="text-3xl font-bold text-primary font-sans">
                      R$ {tour.price}
                    </span>
                    <span className="text-muted-foreground font-sans text-sm"> /pessoa</span>
                  </div>
                  
                  <div className="flex gap-2 mb-4 bg-muted/50 p-1 rounded-full">
                    <button 
                      onClick={() => setIsPrivate(false)}
                      className={`flex-1 font-sans text-sm py-2 px-4 rounded-full font-medium transition-all ${
                        !isPrivate 
                          ? "bg-primary text-primary-foreground shadow-sm" 
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Open grupo
                    </button>
                    <button 
                      onClick={() => setIsPrivate(true)}
                      className={`flex-1 font-sans text-sm py-2 px-4 rounded-full font-medium transition-all ${
                        isPrivate 
                          ? "bg-[#008967] text-white shadow-sm" 
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Grupo Privado
                    </button>
                  </div>
                  
                  <div className="min-h-[40px] flex items-center justify-center mb-6 px-4">
                    <p className="text-center text-[13px] text-muted-foreground font-sans animate-fade-in">
                      {isPrivate 
                        ? "Passeios privados oferecem uma experiência exclusiva apenas para o seu grupo."
                        : "Os grupos abertos são formados automaticamente de acordo com as disponibilidades."
                      }
                    </p>
                  </div>
                  
                  <div className="space-y-6 mb-6">
                    <div className="border-t pt-4">
                      <h4 className="font-serif font-bold text-foreground mb-3 text-lg">Período</h4>
                      <button className="w-full bg-primary text-primary-foreground font-sans text-sm py-3 px-4 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors">
                        Manhã <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
                      </button>
                    </div>

                    <div className="border-t pt-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-sans font-bold text-base text-foreground">Adulto</h4>
                          <p className="text-xs text-muted-foreground font-sans">Idade 14 e até</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <button className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90">
                            <span className="text-xl leading-none mt-[-2px]">-</span>
                          </button>
                          <span className="font-bold text-lg font-sans w-4 text-center">1</span>
                          <button className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90">
                            <span className="text-xl leading-none mt-[-2px]">+</span>
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-sans font-bold text-base text-foreground">Crianças</h4>
                          <p className="text-xs text-muted-foreground font-sans">Idades 7 a 13</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <button className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90">
                            <span className="text-xl leading-none mt-[-2px]">-</span>
                          </button>
                          <span className="font-bold text-lg font-sans w-4 text-center">0</span>
                          <button className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90">
                            <span className="text-xl leading-none mt-[-2px]">+</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-b py-4 flex flex-col gap-2">
                       <div className="flex items-center justify-between gap-3 text-sm font-sans cursor-pointer group">
                         <span className="text-foreground font-bold font-sans text-base">Data</span>
                         <div className="flex items-center text-muted-foreground group-hover:text-primary transition-colors">
                           <span className="mr-2">Selecione uma data</span>
                           <Calendar className="w-4 h-4" />
                         </div>
                       </div>
                       <input 
                         type="date" 
                         className="w-full mt-2 px-4 py-3 rounded-lg border border-input bg-background/50 text-foreground font-sans text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                       />
                    </div>
                  </div>

                  <Button className="w-full h-14 text-base font-sans font-bold rounded-full mt-2">
                    Reservar agora
                  </Button>

                  <p className="text-center text-xs text-muted-foreground font-sans mt-4">
                    Reserve agora, pague depois
                  </p>

                  <div className="mt-6 pt-6 border-t border-border">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground font-sans">
                      <Shield className="w-4 h-4" />
                      <span>Pagamento seguro</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground font-sans mt-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span>Cancelamento gratuito</span>
                    </div>
                  </div>
                </div>

                <Link to="/" className="mt-4">
                  <Button variant="outline" className="w-full font-sans">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Ver outros passeios
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
