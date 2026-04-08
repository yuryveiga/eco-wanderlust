import { Instagram, MapPin, Mail, Phone, Facebook, Youtube, Music } from "lucide-react";
import { useSiteData } from "@/hooks/useSiteData";
import { useLocale } from "@/contexts/LocaleContext";

const iconMap: Record<string, React.ElementType> = {
  Instagram, MapPin, Phone, Mail, Music, Facebook, Youtube,
};

export function Footer() {
  const { pages, socialMedia, images, siteSettings } = useSiteData();
  const { t } = useLocale();

  const scrollTo = (href: string) => {
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

  const logoUrl = images["logo"] || "https://ogzasprtfgimjqrtcseg.supabase.co/storage/v1/object/public/site-images//images__1_-removebg-preview.png";

  return (
    <footer className="bg-[hsl(145,30%,12%)] text-[hsl(140,10%,96%)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo" className="h-10 w-10 rounded-full object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-[hsl(145,40%,40%)] flex items-center justify-center">
                  <span className="font-bold text-lg font-sans">P</span>
                </div>
              )}
              <div>
                <span className="font-serif text-xl font-semibold">{siteSettings?.site_title?.split('|')[0].trim() || "Passeio"}</span>
                <span className="text-[hsl(145,40%,40%)] font-medium ml-1 font-sans">{siteSettings?.site_subtitle || "Rio"}</span>
              </div>
            </div>
            <p className="text-[hsl(140,10%,96%)]/80 text-sm leading-relaxed font-sans">
              {siteSettings?.about_desc || t("footer_desc")}
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4 font-sans">{t("links_rapidos")}</h3>
            <ul className="space-y-3 font-sans">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <button onClick={() => scrollTo(link.href)} className="text-[hsl(140,10%,96%)]/80 hover:text-[hsl(145,40%,40%)] transition-colors text-sm">
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4 font-sans">{t("contato")}</h3>
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
            <h3 className="font-semibold text-lg mb-4 font-sans">{t("siga_nos")}</h3>
            <div className="flex items-center gap-4 mb-6">
              {activeSocials.map((s) => (
                <a key={s.platform} href={s.url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[hsl(145,20%,20%)] flex items-center justify-center hover:bg-[hsl(145,40%,40%)] transition-colors" aria-label={s.platform}>
                  <s.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[hsl(145,15%,22%)]">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[hsl(140,10%,96%)]/60 text-sm font-sans">&copy; {new Date().getFullYear()} Passeio Rio. {t("direitos")}</p>
            <p className="text-[hsl(140,10%,96%)]/60 text-sm font-sans">{t("turismo_sustentavel")}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
