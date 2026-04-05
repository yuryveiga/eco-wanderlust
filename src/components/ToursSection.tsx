import { Link } from "react-router-dom";
import { Clock, Users, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteData } from "@/hooks/useSiteData";
import { useLocale } from "@/contexts/LocaleContext";

type TourCardProps = {
  id: string;
  title: string;
  short_description: string;
  price: number;
  duration: string;
  max_group_size: number;
  image_url: string;
  is_featured: boolean;
  category: string;
  slug?: string;
  title_en?: string;
  title_es?: string;
  short_description_en?: string;
  short_description_es?: string;
  category_en?: string;
  category_es?: string;
};

function TourCard({ tour }: { tour: TourCardProps }) {
  const { t, formatPrice, language } = useLocale();

  const getTranslated = (field: string) => {
    if (language === 'pt') return (tour as any)[field];
    return (tour as any)[`${field}_${language}`] || (tour as any)[field];
  };

  const title = getTranslated('title');
  const short_description = getTranslated('short_description');
  const category = getTranslated('category');

  return (
    <Link to={`/passeio/${tour.slug || tour.id}`} className="block bg-card rounded-2xl overflow-hidden shadow-lg border border-border/50 group hover:shadow-xl transition-shadow duration-300">
      <div className="relative h-56 overflow-hidden">
        <img src={tour.image_url} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
        {tour.is_featured && (
          <div className="absolute top-4 left-4 bg-accent text-accent-foreground text-xs font-semibold px-3 py-1 rounded-full font-sans flex items-center gap-1">
            <Star className="w-3 h-3 fill-current" /> {language === 'pt' ? 'Destaque' : language === 'es' ? 'Destacado' : 'Featured'}
          </div>
        )}
        <div className="absolute top-4 right-4 bg-card/90 backdrop-blur-sm text-foreground text-xs font-medium px-3 py-1 rounded-full font-sans">{category}</div>
      </div>
      <div className="p-6">
        <h3 className="font-serif text-xl font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-muted-foreground text-sm mb-4 font-sans line-clamp-2">{short_description}</p>
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4 font-sans">
          <div className="flex items-center gap-1"><Clock className="w-4 h-4" /><span>{tour.duration}</span></div>
          <div className="flex items-center gap-1"><Users className="w-4 h-4" /><span>Max {tour.max_group_size}</span></div>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-primary font-sans">{formatPrice(tour.price)}</span>
            <span className="text-muted-foreground text-sm font-sans"> / {t("por_pessoa")}</span>
          </div>
          <Button size="sm" className="font-sans">{t("reservar")}</Button>
        </div>
      </div>
    </Link>
  );
}

export function ToursSection() {
  const { tours, siteSettings, isLoading } = useSiteData();
  const { t } = useLocale();

  const columns = Number(siteSettings['home_tours_columns']) || 3;
  const count = Number(siteSettings['home_tours_count']) || 6;
  const displayTours = tours.slice(0, count);

  // Dynamic grid class based on columns
  const gridColsClass = columns === 1 ? "lg:grid-cols-1 max-w-2xl mx-auto" : 
                        columns === 2 ? "lg:grid-cols-2" : 
                        columns === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3";

  return (
    <section id="tours" className="py-20 lg:py-28 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 lg:mb-16">
          <p className="text-primary font-medium mb-3 font-sans">{t("passeios")}</p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
            {t("conhecaPasseios")}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-sans">
            {t("conheca_sub")}
          </p>
        </div>
        {isLoading ? (
          <div className={`grid grid-cols-1 md:grid-cols-2 ${gridColsClass} gap-8`}>
            {[1, 2, 3].map((i) => <div key={i} className="h-80 bg-muted rounded-2xl animate-pulse" />)}
          </div>
        ) : (
          <div className={`grid grid-cols-1 md:grid-cols-2 ${gridColsClass} gap-8`}>
            {displayTours.map((tour) => <TourCard key={tour.id} tour={tour as any} />)}
          </div>
        )}
      </div>
    </section>
  );
}
