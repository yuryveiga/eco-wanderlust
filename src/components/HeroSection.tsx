import { ChevronDown, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1483729558449-99ef09a8c325?q=80&w=2070')` }}
      />
      <div className="absolute inset-0 hero-overlay" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-primary-foreground">
        <div className="animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <Star className="w-4 h-4 text-accent fill-accent" />
            <span className="text-sm font-medium font-sans">Avaliados com 5.0 no TripAdvisor</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 text-balance">
            Conheça o Melhor do
            <br />
            <span className="text-accent">Rio de Janeiro</span>
          </h1>

          <p className="text-lg sm:text-xl lg:text-2xl text-primary-foreground/90 max-w-3xl mx-auto mb-8 font-sans">
            City tours completos, passeios de barco em Arraial do Cabo e Angra dos Reis,
            e experiências inesquecíveis com guias especializados.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" onClick={() => scrollTo("tours")} className="text-lg px-8 py-6 font-sans">
              Nossos Passeios
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => scrollTo("contact")}
              className="text-lg px-8 py-6 bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20 hover:text-primary-foreground font-sans"
            >
              Passeio Personalizado
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 mt-12 text-primary-foreground/80 text-sm font-sans">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5" />
              <span>+1000 Turistas Felizes</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM11 19.93C7.05 19.44 4 16.08 4 12C4 11.38 4.08 10.79 4.21 10.21L9 15V16C9 17.1 9.9 18 11 18V19.93ZM17.9 17.39C17.64 16.58 16.9 16 16 16H15V13C15 12.45 14.55 12 14 12H8V10H10C10.55 10 11 9.55 11 9V7H13C14.1 7 15 6.1 15 5V4.59C17.93 5.78 20 8.65 20 12C20 14.08 19.2 15.97 17.9 17.39Z" />
              </svg>
              <span>Saídas Diárias</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" />
              </svg>
              <span>Guias Locais Especializados</span>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-8 h-8 text-primary-foreground/70" />
      </div>
    </section>
  );
}
