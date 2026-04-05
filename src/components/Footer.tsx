import { Instagram, MapPin, Mail, Phone } from "lucide-react";

export function Footer() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="bg-[hsl(145,30%,12%)] text-[hsl(140,10%,96%)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-[hsl(145,40%,40%)] flex items-center justify-center">
                <span className="font-bold text-lg font-sans">P</span>
              </div>
              <div>
                <span className="font-serif text-xl font-semibold">Passeio</span>
                <span className="text-[hsl(145,40%,40%)] font-medium ml-1 font-sans">Rio</span>
              </div>
            </div>
            <p className="text-[hsl(140,10%,96%)]/80 text-sm leading-relaxed font-sans">
              Descubra as maravilhas naturais do Rio de Janeiro através de experiências de ecoturismo sustentável.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4 font-sans">Links Rápidos</h3>
            <ul className="space-y-3 font-sans">
              {[
                { label: "Inicio", id: "top" },
                { label: "Passeios", id: "tours" },
                { label: "Sobre Nós", id: "about" },
                { label: "Contato", id: "contact" },
              ].map((link) => (
                <li key={link.id}>
                  <button onClick={() => link.id === "top" ? window.scrollTo({ top: 0, behavior: "smooth" }) : scrollTo(link.id)} className="text-[hsl(140,10%,96%)]/80 hover:text-[hsl(145,40%,40%)] transition-colors text-sm">
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4 font-sans">Contato</h3>
            <ul className="space-y-3 font-sans">
              <li className="flex items-center gap-2 text-[hsl(140,10%,96%)]/80 text-sm">
                <Mail className="w-4 h-4 text-[hsl(145,40%,40%)]" />
                <a href="mailto:contato@passeiorio.com" className="hover:text-[hsl(145,40%,40%)] transition-colors">contato@passeiorio.com</a>
              </li>
              <li className="flex items-center gap-2 text-[hsl(140,10%,96%)]/80 text-sm">
                <Phone className="w-4 h-4 text-[hsl(145,40%,40%)]" />
                <a href="tel:+5521999999999" className="hover:text-[hsl(145,40%,40%)] transition-colors">+55 21 99999-9999</a>
              </li>
              <li className="flex items-start gap-2 text-[hsl(140,10%,96%)]/80 text-sm">
                <MapPin className="w-4 h-4 text-[hsl(145,40%,40%)] mt-0.5" />
                <span>Rio de Janeiro, Brasil</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4 font-sans">Siga-nos</h3>
            <div className="flex items-center gap-4 mb-6">
              <a href="https://www.instagram.com/passeiorio/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[hsl(145,20%,20%)] flex items-center justify-center hover:bg-[hsl(145,40%,40%)] transition-colors" aria-label="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://www.tripadvisor.com.br/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[hsl(145,20%,20%)] flex items-center justify-center hover:bg-[hsl(145,40%,40%)] transition-colors" aria-label="TripAdvisor">
                <MapPin className="w-5 h-5" />
              </a>
            </div>
            <p className="text-[hsl(140,10%,96%)]/80 text-sm font-sans">Confira nossas avaliações no TripAdvisor</p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[hsl(145,15%,22%)]">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[hsl(140,10%,96%)]/60 text-sm font-sans">&copy; {new Date().getFullYear()} Passeio Rio. Todos os direitos reservados.</p>
            <p className="text-[hsl(140,10%,96%)]/60 text-sm font-sans">Turismo Sustentável no Rio de Janeiro</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
