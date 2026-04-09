import { Helmet } from "react-helmet-async";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink, Calendar } from "lucide-react";

const MaracanaCalendar = () => {
  const [calendarUrl] = useState("https://maracanamatchday.com/calendar");

  useEffect(() => {
    // Update document title and meta tags for SEO
    document.title = "Calendário de Jogos do Maracanã - Tocorime Rio";
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Confira o calendário atualizado de jogos e eventos no Estádio do Maracanã. Acompanhe os horários dos principais jogos de futebol, shows e eventos no Rio de Janeiro.");
    }
    
    // Update Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute("content", "Calendário de Jogos do Maracanã - Tocorime Rio");
    }
    
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute("content", "Confira o calendário atualizado de jogos e eventos no Estádio do Maracanã. Acompanhe os horários dos principais jogos de futebol, shows e eventos no Rio de Janeiro.");
    }
    
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) {
      ogUrl.setAttribute("content", window.location.href);
    } else {
      const metaOgUrl = document.createElement('meta');
      metaOgUrl.setAttribute("property", "og:url");
      metaOgUrl.setAttribute("content", window.location.href);
      document.head.appendChild(metaOgUrl);
    }
    
    const ogType = document.querySelector('meta[property="og:type"]');
    if (!ogType) {
      const metaOgType = document.createElement('meta');
      metaOgType.setAttribute("property", "og:type");
      metaOgType.setAttribute("content", "website");
      document.head.appendChild(metaOgType);
    }
  }, []);

  return (
    <main>
      <Helmet>
        <title>Calendário de Jogos do Maracanã - Tocorime Rio</title>
        <meta name="description" content="Confira o calendário atualizado de jogos e eventos no Estádio do Maracanã. Acompanhe os horários dos principais jogos de futebol, shows e eventos no Rio de Janeiro." />
        <meta property="og:title" content="Calendário de Jogos do Maracanã - Tocorime Rio" />
        <meta property="og:description" content="Confira o calendário atualizado de jogos e eventos no Estádio do Maracanã. Acompanhe os horários dos principais jogos de futebol, shows e eventos no Rio de Janeiro." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Calendário de Jogos do Maracanã - Tocorime Rio" />
        <meta name="twitter:description" content="Confira o calendário atualizado de jogos e eventos no Estádio do Maracanã. Acompanhe os horários dos principais jogos de futebol, shows e eventos no Rio de Janeiro." />
      </Helmet>
      
      <Header />
      
      <div className="min-h-screen bg-muted/30 py-20 pb-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-foreground mb-4">
              Calendário Maracanã
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-sans">
              Acompanhe os jogos e eventos no Templo do Futebol e planeje sua experiência com a Tocorime Rio.
            </p>
          </div>
          
          <div className="bg-card rounded-3xl shadow-xl overflow-hidden border border-border/50 transition-all hover:shadow-2xl">
            <div className="aspect-[16/6] relative overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1599327311438-ef2766ec0667?auto=format&fit=crop&q=80&w=1200" 
                alt="Estádio do Maracanã" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
              <div className="absolute bottom-6 left-8">
                <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-2 inline-block">
                  Oficial
                </span>
                <h2 className="text-2xl font-bold text-foreground font-serif">Maracanã Match Day</h2>
              </div>
            </div>

            <div className="p-8 sm:p-10">
              <div className="flex flex-col md:flex-row gap-8 items-center justify-between bg-muted/30 p-8 rounded-2xl border border-primary/10">
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2 font-serif">Acesse o Calendário Oficial</h3>
                  <p className="text-muted-foreground text-sm font-sans leading-relaxed">
                    Para garantir que você veja as informações mais atualizadas sobre ingressos, horários e disponibilidade em tempo real, recomendamos acessar o portal oficial do Maracanã.
                  </p>
                </div>
                <Button asChild size="lg" className="font-bold px-8 h-14 shadow-lg shadow-primary/20 group">
                  <a href="https://maracanamatchday.com/calendar" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                    Ver Calendário Completo
                    <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </a>
                </Button>
              </div>

              <div className="mt-12">
                <h3 className="text-lg font-bold mb-6 font-serif flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Destaques de Abril 2026
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   {[
                     { date: "11/04", teams: "Fluminense x Flamengo", icon: "⚽" },
                     { date: "15/04", teams: "Fluminense x Ind. Rivadavia", icon: "🏆" },
                     { date: "16/04", teams: "Flamengo x Ind. Medelin", icon: "⚽" },
                     { date: "19/04", teams: "Flamengo x Bahia", icon: "⚽" },
                     { date: "22/04", teams: "Flamengo x Vitória", icon: "⚽" },
                     { date: "26/04", teams: "Fluminense x Chapecoense", icon: "⚽" },
                   ].map((match, i) => (
                     <div key={i} className="flex items-center justify-between p-4 bg-muted/20 rounded-xl border border-border/40 hover:border-primary/20 transition-colors">
                        <div className="flex items-center gap-4">
                          <span className="text-xs font-bold text-primary bg-primary/5 px-2 py-1 rounded">{match.date}</span>
                          <span className="font-medium text-sm">{match.teams}</span>
                        </div>
                        <span>{match.icon}</span>
                     </div>
                   ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-16 text-center bg-primary/5 p-10 rounded-3xl border border-primary/10">
            <h2 className="text-2xl font-bold text-foreground mb-4 font-serif">
              Viva a Emoção do Futebol Carioca
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto font-sans">
              Não quer se preocupar com transporte ou segurança para ir ao estádio? 
              A Tocorime Rio oferece experiências completas de ida ao Maracanã com guias locais.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild variant="outline" className="font-bold border-primary text-primary hover:bg-primary/5">
                <a href="/passeios">Explorar Passeios</a>
              </Button>
              <Button asChild className="font-bold bg-accent text-accent-foreground hover:bg-accent/90">
                <a href="https://wa.me/5521995624596" target="_blank" rel="noopener noreferrer">Falar com Consultor</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  );
};

export default MaracanaCalendar;