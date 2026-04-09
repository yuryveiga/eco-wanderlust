import { useState, useEffect, useCallback } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/contexts/LocaleContext";
import { useSiteData } from "@/hooks/useSiteData";
import { supabase } from "@/integrations/supabase/client";

interface Review {
  id: string;
  author_name: string;
  author_location: string;
  rating: number;
  title: string;
  title_en: string | null;
  title_es: string | null;
  content: string;
  content_en: string | null;
  content_es: string | null;
  tour_name: string;
  review_date: string;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-5 w-5 ${star <= rating ? "fill-accent text-accent" : "fill-muted text-muted"}`}
        />
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  const { language } = useLocale();

  const title = language === 'en' ? (review.title_en || review.title) : language === 'es' ? (review.title_es || review.title) : review.title;
  const content = language === 'en' ? (review.content_en || review.content) : language === 'es' ? (review.content_es || review.content) : review.content;

  return (
    <div className="bg-card rounded-2xl p-8 shadow-lg border border-border/50 h-full flex flex-col">
      <div className="flex items-start gap-4 mb-6">
        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="text-xl font-semibold text-primary font-sans">{review.author_name.charAt(0)}</span>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-foreground truncate font-sans">{review.author_name}</h4>
          <p className="text-sm text-muted-foreground truncate font-sans">{review.author_location}</p>
        </div>
        <StarRating rating={review.rating} />
      </div>
      <div className="relative flex-1">
        <Quote className="absolute -top-2 -left-2 h-8 w-8 text-primary/10" />
        <h5 className="font-semibold text-lg mb-3 text-foreground font-serif">{title}</h5>
        <p className="text-muted-foreground leading-relaxed line-clamp-4 font-sans">{content}</p>
      </div>
      <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between font-sans">
        <span className="text-sm text-primary font-medium">{review.tour_name}</span>
        <span className="text-sm text-muted-foreground">
          {new Date(review.review_date).toLocaleDateString(language === 'pt' ? 'pt-BR' : language === 'es' ? 'es-ES' : 'en-US', { month: "short", year: "numeric" })}
        </span>
      </div>
    </div>
  );
}

export function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);
  const { t } = useLocale();
  const { socialMedia } = useSiteData();

  const tripAdvisorSocial = socialMedia.find(s =>
    s.platform.toLowerCase().includes('tripadvisor') && s.is_active !== false
  );
  const tripAdvisorUrl = tripAdvisorSocial?.url || "https://www.tripadvisor.com.br/";

  useEffect(() => {
    const loadReviews = async () => {
      const { data } = await supabase
        .from('reviews')
        .select('*')
        .eq('is_published', true)
        .order('sort_order', { ascending: true });
      if (data && data.length > 0) setReviews(data);
    };
    loadReviews();
  }, []);

  useEffect(() => {
    const update = () => setItemsPerView(window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const maxIndex = Math.max(0, reviews.length - itemsPerView);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  if (reviews.length === 0) return null;

  return (
    <section className="py-20 bg-muted/30 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <svg viewBox="0 0 32 32" className="h-8 w-8" aria-label="TripAdvisor">
              <circle cx="16" cy="16" r="16" fill="#34E0A1" />
              <circle cx="12" cy="16" r="3" fill="#000" />
              <circle cx="20" cy="16" r="3" fill="#000" />
              <circle cx="12" cy="16" r="1.5" fill="#fff" />
              <circle cx="20" cy="16" r="1.5" fill="#fff" />
            </svg>
            <span className="text-lg font-semibold text-foreground font-sans">TripAdvisor Reviews</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4 text-balance">
            {t("visitantes_dizem")}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto font-sans">
            {t("reviews_desc")}
          </p>
        </div>

        <div className="relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
            >
              {reviews.map((review) => (
                <div key={review.id} className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 px-3">
                  <ReviewCard review={review} />
                </div>
              ))}
            </div>
          </div>

          {reviews.length > itemsPerView && (
            <>
              <Button variant="outline" size="icon" className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-background shadow-lg hover:bg-accent hidden md:flex" onClick={prevSlide} aria-label="Anterior">
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="icon" className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-background shadow-lg hover:bg-accent hidden md:flex" onClick={nextSlide} aria-label="Próximo">
                <ChevronRight className="h-5 w-5" />
              </Button>
            </>
          )}
        </div>

        {reviews.length > itemsPerView && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${index === currentIndex ? "bg-primary w-6" : "bg-primary/30 hover:bg-primary/50"}`}
                aria-label={`Slide ${index + 1}`}
              />
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <a
            href={tripAdvisorUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors font-sans"
          >
            {t("ver_todas_tripadvisor")}
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
