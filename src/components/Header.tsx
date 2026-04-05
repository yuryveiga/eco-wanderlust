import { useState } from "react";
import { Menu, X, Instagram, MapPin, Phone, Mail, Music, Facebook, Youtube, Globe, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteData } from "@/hooks/useSiteData";
import { useLocale } from "@/contexts/LocaleContext";

const iconMap: Record<string, React.ElementType> = {
  Instagram, MapPin, Phone, Mail, Music, Facebook, Youtube,
};

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { pages, socialMedia, images } = useSiteData();
  const { language, setLanguage, currency, setCurrency, t } = useLocale();

  const scrollTo = (href: string) => {
    setIsMenuOpen(false);
    if (href.startsWith("#")) {
      const id = href.replace("#", "");
      if (id === "top") { window.scrollTo({ top: 0, behavior: "smooth" }); return; }
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const navLinks = pages.length > 0
    ? pages.map((p) => ({ label: p.title, href: p.href }))
    : [
        { label: t("inicio"), href: "#top" },
        { label: t("passeios"), href: "#tours" },
        { label: t("sobre"), href: "#about" },
        { label: t("contato"), href: "#contact" },
      ];

  const activeSocials = socialMedia.length > 0
    ? socialMedia.map((s) => ({ platform: s.platform, url: s.url, icon: iconMap[s.icon_name] || MapPin }))
    : [
        { platform: "instagram", url: "https://www.instagram.com/passeiorio/", icon: Instagram },
        { platform: "tripadvisor", url: "https://www.tripadvisor.com.br/", icon: MapPin },
      ];

  const logoUrl = images["logo"];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <button onClick={() => scrollTo("#top")} className="flex items-center gap-2">
            {logoUrl ? (
              <img src={logoUrl} alt="Logo" className="h-10 w-10 rounded-full object-cover" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg font-sans">P</span>
              </div>
            )}
            <div className="hidden sm:block">
              <span className="font-serif text-xl font-semibold text-foreground">Passeio</span>
              <span className="text-primary font-medium ml-1 font-sans">Rio</span>
            </div>
          </button>

          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <button key={link.href} onClick={() => scrollTo(link.href)} className="text-foreground hover:text-primary transition-colors font-medium font-sans">
                {link.label}
              </button>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-4">
            <div className="flex items-center space-x-2 mr-2 border-r pr-4">
              <select 
                className="bg-transparent border-none text-sm font-medium focus:ring-0 cursor-pointer"
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
              >
                <option value="pt">PT</option>
                <option value="en">EN</option>
                <option value="es">ES</option>
              </select>
              
              <select 
                className="bg-transparent border-none text-sm font-medium focus:ring-0 cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
                value={currency}
                onChange={(e) => setCurrency(e.target.value as any)}
              >
                <option value="BRL">R$</option>
                <option value="USD">U$</option>
                <option value="EUR">€</option>
              </select>
            </div>

            {activeSocials.map((s) => (
              <a key={s.platform} href={s.url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label={s.platform}>
                <s.icon className="w-5 h-5" />
              </a>
            ))}
            <Button onClick={() => scrollTo("#contact")}>{t("reservar")}</Button>
          </div>

          <div className="flex items-center gap-3 lg:hidden">
            <div className="flex items-center border border-border rounded-md px-1 py-1">
              <select className="bg-transparent border-none text-xs px-1 py-0 outline-none w-10 appearance-none" value={language} onChange={e => setLanguage(e.target.value as any)}>
                <option value="pt">PT</option><option value="en">EN</option><option value="es">ES</option>
              </select>
              <select className="bg-transparent border-none text-xs px-1 py-0 outline-none w-10 appearance-none border-l text-muted-foreground" value={currency} onChange={e => setCurrency(e.target.value as any)}>
                <option value="BRL">R$</option><option value="USD">U$</option><option value="EUR">€</option>
              </select>
            </div>
            
            <button className="p-2" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
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
                {activeSocials.map((s) => (
                  <a key={s.platform} href={s.url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label={s.platform}>
                    <s.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
              <Button onClick={() => scrollTo("#contact")} className="mt-2">{t("reservar")}</Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
