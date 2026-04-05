import { useState } from "react";
import { Menu, X, Instagram, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "Inicio", href: "#top" },
  { label: "Passeios", href: "#tours" },
  { label: "Sobre Nós", href: "#about" },
  { label: "Contato", href: "#contact" },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollTo = (href: string) => {
    setIsMenuOpen(false);
    const id = href.replace("#", "");
    if (id === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <button onClick={() => scrollTo("#top")} className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg font-sans">P</span>
            </div>
            <div className="hidden sm:block">
              <span className="font-serif text-xl font-semibold text-foreground">Passeio</span>
              <span className="text-primary font-medium ml-1 font-sans">Rio</span>
            </div>
          </button>

          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className="text-foreground hover:text-primary transition-colors font-medium font-sans"
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-4">
            <a href="https://www.instagram.com/passeiorio/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Instagram">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="https://www.tripadvisor.com.br/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="TripAdvisor">
              <MapPin className="w-5 h-5" />
            </a>
            <Button onClick={() => scrollTo("#contact")}>Reservar</Button>
          </div>

          <button className="lg:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <nav className="lg:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <button key={link.href} onClick={() => scrollTo(link.href)} className="text-foreground hover:text-primary transition-colors font-medium py-2 text-left font-sans">
                  {link.label}
                </button>
              ))}
              <div className="flex items-center gap-4 pt-4 border-t border-border">
                <a href="https://www.instagram.com/passeiorio/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Instagram">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="https://www.tripadvisor.com.br/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="TripAdvisor">
                  <MapPin className="w-5 h-5" />
                </a>
              </div>
              <Button onClick={() => scrollTo("#contact")} className="mt-2">Reservar</Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
