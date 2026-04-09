import { Bus, Shield, Heart, Users } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { useSiteData } from "@/hooks/useSiteData";

const DEFAULT_IMAGES = [
  'https://images.unsplash.com/photo-1619546952812-520e98064a52?q=80&w=600',
  'https://images.unsplash.com/photo-1544989164-31dc3c645987?q=80&w=600',
  'https://images.unsplash.com/photo-1516834611397-8d633eaec5c0?q=80&w=600',
  'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?q=80&w=600',
];

export function AboutSection() {
  const { t } = useLocale();
  const { images } = useSiteData();

  const aboutImages = [
    images["about_1"] || DEFAULT_IMAGES[0],
    images["about_2"] || DEFAULT_IMAGES[1],
    images["about_3"] || DEFAULT_IMAGES[2],
    images["about_4"] || DEFAULT_IMAGES[3],
  ];

  const features = [
    { icon: Bus, title: t("feat_transporte"), description: t("feat_transporte_desc") },
    { icon: Shield, title: t("feat_seguranca"), description: t("feat_seguranca_desc") },
    { icon: Heart, title: t("feat_experiencia"), description: t("feat_experiencia_desc") },
    { icon: Users, title: t("feat_grupos"), description: t("feat_grupos_desc") },
  ];

  return (
    <section id="about" className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="h-48 lg:h-64 rounded-2xl bg-cover bg-center" style={{ backgroundImage: `url('${aboutImages[0]}')` }} />
              <div className="h-32 lg:h-40 rounded-2xl bg-cover bg-center" style={{ backgroundImage: `url('${aboutImages[1]}')` }} />
            </div>
            <div className="space-y-4 pt-8">
              <div className="h-32 lg:h-40 rounded-2xl bg-cover bg-center" style={{ backgroundImage: `url('${aboutImages[2]}')` }} />
              <div className="h-48 lg:h-64 rounded-2xl bg-cover bg-center" style={{ backgroundImage: `url('${aboutImages[3]}')` }} />
            </div>
          </div>

          <div>
            <p className="text-primary font-medium mb-3 font-sans">{siteSettings?.about_label || t("sobre_passeiorio")}</p>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 text-balance">
              {siteSettings?.about_title || t("porta_entrada")}
            </h2>
            <p className="text-muted-foreground text-lg mb-6 leading-relaxed font-sans">
              {siteSettings?.about_desc || t("sobre_desc1")}
            </p>
            {siteSettings?.about_desc2 && (
              <p className="text-muted-foreground text-lg mb-8 leading-relaxed font-sans">
                {siteSettings.about_desc2}
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map((feature) => (
                <div key={feature.title} className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1 font-sans">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground font-sans">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
