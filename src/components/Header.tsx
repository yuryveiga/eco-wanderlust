import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, Instagram, MapPin, Phone, Mail, Music, Facebook, Youtube, Globe, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteData } from "@/hooks/useSiteData";
import { useLocale } from "@/contexts/LocaleContext";

const iconMap: Record<string, React.ElementType> = {
  Instagram, MapPin, Phone, Mail, Music, Facebook, Youtube,
};

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { pages, socialMedia, images } = useSiteData();
  const { language, setLanguage, currency, setCurrency, t } = useLocale();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNav = (href: string) => {
    setIsMenuOpen(false);
    
    // Internal links (CMS pages or Blog)
    if (href.startsWith("/") || !href.startsWith("#")) {
       navigate(href);
       window.scrollTo({ top: 0, behavior: "smooth" });
       return;
    }

    // Anchor links
    if (href.startsWith("#")) {
      const id = href.replace("#", "");
      if (location.pathname !== "/") {
        navigate("/" + href);
      } else {
        if (id === "top") {
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
  };

  const baseLinks = [
    { label: t("inicio"), href: "#top" },
    { label: t("passeios"), href: "#tours" },
    { label: t("sobre"), href: "#about" },
    { label: t("contato"), href: "#contact" },
    { label: "Blog", href: "/blog" },
  ];

  const navLinks = baseLinks;

  const activeSocials = socialMedia.length > 0
    ? socialMedia.map((s) => ({ platform: s.platform, url: s.url, icon: iconMap[s.icon_name] || MapPin }))
    : [
        { platform: "instagram", url: "https://www.instagram.com/passeiorio/", icon: Instagram },
        { platform: "tripadvisor", url: "https://www.tripadvisor.com.br/", icon: MapPin },
      ];

  const logoUrl = images["logo"];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-background/95 backdrop-blur-md shadow-md py-2" : "bg-background/80 backdrop-blur-sm py-4 border-b border-border/50"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 md:h-16">
          <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="flex items-center gap-2 group">
            {logoUrl ? (
              <img src={logoUrl} alt="Logo" className="h-10 w-10 md:h-12 md:w-12 rounded-full object-cover border-2 border-primary/20 group-hover:border-primary transition-colors focus:outline-none" />
            ) : (
              <div className="w-10 h-10 md:h-12 md:w-12 rounded-full bg-primary flex items-center justify-center group-hover:scale-105 transition-transform">
                <span className="text-primary-foreground font-bold text-xl font-sans">P</span>
              </div>
            )}
            <div className="flex flex-col -gap-1">
              <span className="font-serif text-lg md:text-xl font-bold text-foreground leading-tight">Passeio</span>
              <span className="text-primary font-bold text-xs md:text-sm font-sans tracking-widest uppercase">Rio</span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <button 
                key={link.label} 
                onClick={() => handleNav(link.href)} 
                className={`text-sm font-semibold font-sans transition-all hover:text-primary relative group ${location.pathname === link.href ? "text-primary" : "text-foreground/80"}`}
              >
                {link.label}
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full ${location.pathname === link.href ? "w-full" : ""}`}></span>
              </button>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-4">
            <div className="flex items-center space-x-2 mr-2 border-r pr-4">
              <select className="bg-transparent border-none text-xs font-bold focus:ring-0 cursor-pointer hover:text-primary transition-colors" value={language} onChange={e => setLanguage(e.target.value as any)}>
                <option value="pt">PT</option><option value="en">EN</option><option value="es">ES</option>
              </select>
              <select className="bg-transparent border-none text-xs font-bold focus:ring-0 cursor-pointer text-muted-foreground hover:text-foreground transition-colors" value={currency} onChange={e => setCurrency(e.target.value as any)}>
                <option value="BRL">R$</option><option value="USD">U$</option><option value="EUR">€</option>
              </select>
            </div>

            {activeSocials.map((s) => (
              <a key={s.platform} href={s.url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-all hover:scale-110" aria-label={s.platform}>
                <s.icon className="w-5 h-5" />
              </a>
            ))}
            <Button onClick={() => handleNav("#contact")} size="sm" className="font-bold px-6 shadow-lg shadow-primary/20">{t("reservar")}</Button>
          </div>

          <div className="flex items-center gap-3 lg:hidden">
            <div className="flex items-center border border-border rounded-full px-2 py-1 bg-muted/30">
              <select className="bg-transparent border-none text-[10px] font-bold px-1 py-0 outline-none w-8 appearance-none" value={language} onChange={e => setLanguage(e.target.value as any)}>
                <option value="pt">PT</option><option value="en">EN</option><option value="es">ES</option>
              </select>
              <select className="bg-transparent border-none text-[10px] font-bold px-1 py-0 outline-none w-8 appearance-none border-l text-muted-foreground" value={currency} onChange={e => setCurrency(e.target.value as any)}>
                <option value="BRL">R$</option><option value="USD">U$</option><option value="EUR">€</option>
              </select>
            </div>
            <button className="p-2 transition-transform active:scale-95" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <nav className="lg:hidden py-6 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <button key={link.label} onClick={() => handleNav(link.href)} className={`text-lg font-bold font-sans transition-colors py-2 text-left ${location.pathname === link.href ? "text-primary" : "text-foreground"}`}>
                  {link.label}
                </button>
              ))}
              <div className="flex items-center gap-6 pt-6 border-t border-border">
                {activeSocials.map((s) => (
                  <a key={s.platform} href={s.url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary" aria-label={s.platform}>
                    <s.icon className="w-6 h-6" />
                  </a>
                ))}
              </div>
              <Button onClick={() => handleNav("#contact")} className="mt-4 font-bold h-12 text-lg uppercase tracking-tight">{t("reservar")}</Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
