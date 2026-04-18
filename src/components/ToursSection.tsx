import { useState, memo } from "react";
import { Link } from "react-router-dom";
import { Clock, Users, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteData } from "@/hooks/useSiteData";
import { useLocale } from "@/contexts/LocaleContext";
import { OptimizedImage } from "./OptimizedImage";
import { getTourMinPrice } from "@/utils/pricing";

export type TourCardProps = {
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
  external_url?: string;
  pricing_model?: 'fixed' | 'dynamic' | 'group' | 'custom';
  price_1_person?: number;
  price_2_people?: number;
  price_3_6_people?: number;
  price_7_19_people?: number;
  use_custom_options?: boolean;
  custom_options_json?: any;
};

export const TourCard = memo(({ tour }: { tour: TourCardProps }) => {
  const { t, formatPrice, language } = useLocale();

  const getTranslated = (field: keyof TourCardProps) => {
    if (language === 'pt') return tour[field];
    return (tour as Record<string, any>)[`${field}_${language}`] || tour[field];
  };

  const title = getTranslated('title');
  const short_description = getTranslated('short_description');
  
  const category = (() => {
    const rawCat = tour?.category;
    if (rawCat === 'TRILHA') return t('trilhas');
    if (rawCat === 'CITY TOUR') return t('city_tours');
    return getTranslated('category');
  })();

  const durationStr = language === 'pt' ? tour.duration : tour.duration
    ?.replace(/horas/gi, t("horas"))
    .replace(/hora/gi, t("hora"))
    .replace(/minutos/gi, t("minutos"))
    .replace(/minuto/gi, t("minuto"));

  const href = tour.external_url || `/passeio/${tour.slug || tour.id}`;
  const isExternal = !!tour.external_url;

  const CardContent = (
    <>
      <div className="relative h-64 overflow-hidden bg-muted">
        <OptimizedImage 
          src={tour.image_url} 
          alt={title} 
          width={600} 
          containerClassName="w-full h-full"
          fit="cover"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
          loading="lazy" 
        />
        {tour.is_featured && (
          <div className="absolute top-4 left-4 bg-accent text-accent-foreground text-xs font-semibold px-3 py-1 rounded-full font-sans flex items-center gap-1">
            <Star className="w-3 h-3 fill-current" /> {t("destaque")}
          </div>
        )}
        <div className="absolute top-4 right-4 bg-card/90 backdrop-blur-sm text-foreground text-xs font-black px-3 py-1 rounded-full font-sans uppercase tracking-widest">{category}</div>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="font-serif text-xl font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-muted-foreground text-sm mb-6 font-sans line-clamp-2">{short_description}</p>

        <div className="mt-auto space-y-4">
          {!isExternal && (
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-black uppercase tracking-[0.15em] opacity-60">
              <Clock className="w-3.5 h-3.5 text-primary" />
              <span>{durationStr?.split(' ')[0]} {t("horas")}</span>
            </div>
          )}

          <div>
            {(tour.price > 0 || tour.pricing_model === 'custom' || (tour.pricing_model === 'dynamic' && (tour.price_1_person || tour.price_2_people || tour.price_3_6_people || tour.price_7_19_people))) && (
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-primary font-sans leading-none">
                  {formatPrice(getTourMinPrice(tour as any))}
                </span>
                <span className="text-muted-foreground text-[9px] font-black uppercase tracking-tighter opacity-50">
                  {tour.pricing_model === 'group' ? t("por_grupo") : (tour.pricing_model === 'dynamic' || tour.pricing_model === 'custom') ? t("a_partir_por_pessoa") : `/ ${t("por_pessoa")}`}
                </span>
              </div>
            )}
          </div>
          
          <Button className="w-full h-12 rounded-xl font-black text-[11px] uppercase tracking-[0.25em] shadow-xl shadow-primary/10 group-hover:bg-accent group-hover:shadow-accent/20 transition-all duration-300">
            {isExternal 
              ? (tour.title.toLowerCase().includes('maracana') 
                ? (language === 'pt' ? 'RESERVAR AGORA' : 'BOOK NOW') 
                : (language === 'pt' ? 'Saber Mais' : 'Learn More')) 
              : t("reservar")}
          </Button>
        </div>
      </div>
    </>
  );

  if (isExternal) {
    return (
      <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="block bg-card rounded-2xl overflow-hidden shadow-lg border border-border/50 group hover:shadow-xl transition-shadow duration-300 focus:outline-none focus:ring-2 focus:ring-primary"
        aria-label={`${isExternal ? (language === 'pt' ? 'Saber mais sobre' : 'Learn more about') : t("reservar")} ${title}`}
      >
        {CardContent}
      </a>
    );
  }

  return (
    <Link 
      to={href} 
      className="block bg-card rounded-2xl overflow-hidden shadow-lg border border-border/50 group hover:shadow-xl transition-shadow duration-300 focus:outline-none focus:ring-2 focus:ring-primary"
      aria-label={`${t("reservar")} ${title}`}
    >
      {CardContent}
    </Link>
  );
});

TourCard.displayName = "TourCard";


export function ToursSection() {
  const { tours, siteSettings, isLoading } = useSiteData();
  const { t, language } = useLocale();
  const [activeTab, setActiveTab] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const columns = Number(siteSettings['home_tours_columns']) || 3;
  const count = Number(siteSettings['home_tours_count']) || 6;
  
  // Dynamic categories from settings (up to 3)
  const categories = [
    {
      value: siteSettings['home_category_1'] || 'CITY TOUR',
      label: language === 'pt' 
        ? (siteSettings['home_category_1_label'] || siteSettings['city_tours_title'] || t("city_tours"))
        : (siteSettings[`home_category_1_label_${language}`] || siteSettings[`city_tours_title_${language}`] || t("city_tours")),
    },
    {
      value: siteSettings['home_category_2'] || 'TRILHA',
      label: language === 'pt' 
        ? (siteSettings['home_category_2_label'] || siteSettings['hiking_tours_title'] || t("trilhas"))
        : (siteSettings[`home_category_2_label_${language}`] || siteSettings[`hiking_tours_title_${language}`] || t("trilhas")),
    },
    // 3rd category only if configured
    ...(siteSettings['home_category_3'] ? [{
      value: siteSettings['home_category_3'],
      label: language === 'pt' 
        ? (siteSettings['home_category_3_label'] || siteSettings['home_category_3'])
        : (siteSettings[`home_category_3_label_${language}`] || siteSettings['home_category_3_label'] || siteSettings['home_category_3']),
    }] : []),
  ];

  const handleTabChange = (idx: number) => {
    if (idx !== activeTab) {
      setIsAnimating(true);
      setActiveTab(idx);
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  const gridColsClass = columns === 1 ? "lg:grid-cols-1 max-w-2xl mx-auto" : 
                        columns === 2 ? "lg:grid-cols-2" : 
                        columns === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3";

  const activeCat = categories[activeTab];
  const displayTours = tours
    .filter(t => t.category?.toUpperCase().includes(activeCat.value))
    .sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
  
  // Title and subtitle
  const toursSectionTitleKey = language === 'pt' ? 'tours_section_title' : `tours_section_title_${language}`;
  const toursSectionSubtitleKey = language === 'pt' ? 'tours_section_subtitle' : `tours_section_subtitle_${language}`;
  const toursTitle = siteSettings[toursSectionTitleKey] || siteSettings['tours_section_title'] || (language === 'pt' ? 'Conheça o Melhor do Rio de Janeiro' : language === 'es' ? 'Descubre lo mejor de Río' : 'Discover the Best of Rio');
  const toursSubtitle = siteSettings[toursSectionSubtitleKey] || siteSettings['tours_section_subtitle'] || (language === 'pt' ? 'City tours completos, passeios de barco em Arraial do Cabo e Angra dos Reis, e experiências inesquecíveis com guias especializados.' : language === 'es' ? 'Tours completos por la ciudad, paseos en barco en Arraial do Cabo y Angra dos Reis, y experiencias increibles con guías especializados.' : 'Complete city tours, boat trips in Arraial do Cabo and Angra dos Reis, and unforgettable experiences with specialized guides.');

  return (
    <section id="tours" className="py-20 lg:py-28 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-3 text-balance">{toursTitle}</h2>
          {toursSubtitle && <p className="text-muted-foreground text-lg max-w-xl mx-auto font-sans">{toursSubtitle}</p>}
        </div>
        
        <div className="flex justify-center gap-3 mb-12">
          {categories.map((cat, idx) => (
            <Button
              key={cat.value}
              size="lg"
              variant={activeTab === idx ? 'default' : 'outline'}
              onClick={() => handleTabChange(idx)}
              className={`font-sans px-8 rounded-full ${activeTab !== idx ? 'border-2' : ''}`}
            >
              {cat.label}
            </Button>
          ))}
        </div>
        
        <div className={`transition-all duration-500 ease-in-out ${isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
          {isLoading ? (
            <div className={`grid grid-cols-1 md:grid-cols-2 ${gridColsClass} gap-8`}>
              {[1, 2, 3].map((i) => <div key={i} className="h-80 bg-muted rounded-2xl animate-pulse" />)}
            </div>
          ) : displayTours.length > 0 ? (
            <div className={`grid grid-cols-1 md:grid-cols-2 ${gridColsClass} gap-8`}>
              {displayTours.slice(0, count).map((tour) => <TourCard key={`${activeTab}-${tour.id}`} tour={tour as TourCardProps} />)}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">{language === 'pt' ? 'Nenhum passeio disponível' : 'No tours available'}</p>
          )}
        </div>
      </div>
    </section>
  );
}
