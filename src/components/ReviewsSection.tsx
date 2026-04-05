import { useState, useEffect, useCallback } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Review {
  id: string;
  author_name: string;
  author_location: string;
  rating: number;
  title: string;
  content: string;
  tour_name: string;
  review_date: string;
}

const reviews: Review[] = [
  {
    id: "1",
    author_name: "Maria Silva",
    author_location: "São Paulo, Brasil",
    rating: 5,
    title: "Experiência incrível!",
    content: "O city tour foi maravilhoso! Nosso guia conhecia todos os detalhes da história do Rio. Recomendo demais!",
    tour_name: "City Tour Rio Completo",
    review_date: "2026-03-15",
  },
  {
    id: "2",
    author_name: "John Smith",
    author_location: "New York, USA",
    rating: 5,
    title: "Best tour in Rio!",
    content: "Amazing experience! The guides were very knowledgeable and friendly. Arraial do Cabo was breathtaking!",
    tour_name: "Arraial do Cabo",
    review_date: "2026-03-10",
  },
  {
    id: "3",
    author_name: "Sophie Dubois",
    author_location: "Paris, France",
    rating: 5,
    title: "Magnifique!",
    content: "Un tour incroyable avec des vues à couper le souffle. Le guide était passionné et très informatif.",
    tour_name: "Cristo Redentor & Pão de Açúcar",
    review_date: "2026-02-28",
  },
  {
    id: "4",
    author_name: "Carlos Oliveira",
    author_location: "Belo Horizonte, Brasil",
    rating: 5,
    title: "Passeio perfeito!",
    content: "Angra dos Reis superou todas as expectativas. Praias lindas e organização impecável.",
    tour_name: "Angra dos Reis",
    review_date: "2026-02-20",
  },
  {
    id: "5",
    author_name: "Emma Wilson",
    author_location: "London, UK",
    rating: 5,
    title: "Unforgettable day!",
    content: "The Pedra Bonita hike was challenging but absolutely worth it. The views from the top were stunning!",
    tour_name: "Trilha da Pedra Bonita",
    review_date: "2026-02-15",
  },
];

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
        <h5 className="font-semibold text-lg mb-3 text-foreground font-serif">{review.title}</h5>
        <p className="text-muted-foreground leading-relaxed line-clamp-4 font-sans">{review.content}</p>
      </div>
      <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between font-sans">
        <span className="text-sm text-primary font-medium">{review.tour_name}</span>
        <span className="text-sm text-muted-foreground">
          {new Date(review.review_date).toLocaleDateString("pt-BR", { month: "short", year: "numeric" })}
        </span>
      </div>
    </div>
  );
}

export function ReviewsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);

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
            O Que Nossos Visitantes Dizem
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto font-sans">
            Leia avaliações autênticas de viajantes que exploraram o Rio conosco
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
            href="https://www.tripadvisor.com.br/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors font-sans"
          >
            Ver todas as avaliações no TripAdvisor
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
