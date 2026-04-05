import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InstagramPost {
  id: string;
  thumbnail: string;
  permalink: string;
  caption: string;
  timestamp: string;
}

const INSTAGRAM_USERNAME = "tocorimerio";

const fallbackPosts: InstagramPost[] = [
  {
    id: "1",
    thumbnail: "https://images.unsplash.com/photo-1619546952812-520e98064a52?q=80&w=600",
    permalink: "https://www.instagram.com/tocorimerio/",
    caption: "Pôr do sol no Rio de Janeiro 🌅 #riodejaneiro #brazil",
    timestamp: "2024-01-15",
  },
  {
    id: "2",
    thumbnail: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?q=80&w=600",
    permalink: "https://www.instagram.com/tocorimerio/",
    caption: "City Tour completinho! 🗿✈️",
    timestamp: "2024-01-10",
  },
  {
    id: "3",
    thumbnail: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?q=80&w=600",
    permalink: "https://www.instagram.com/tocorimerio/",
    caption: "Arraial do Cabo é pura maravilha! 🏖️",
    timestamp: "2024-01-05",
  },
  {
    id: "4",
    thumbnail: "https://images.unsplash.com/photo-1569609808299-1c51f7ab43d1?q=80&w=600",
    permalink: "https://www.instagram.com/tocorimerio/",
    caption: "Aventure-se! 🌿",
    timestamp: "2024-01-01",
  },
  {
    id: "5",
    thumbnail: "https://images.unsplash.com/photo-1598734403563-14fb6d9ba8f2?q=80&w=600",
    permalink: "https://www.instagram.com/tocorimerio/",
    caption: "Vista incrível! 📸",
    timestamp: "2023-12-28",
  },
];

export function InstagramCarousel() {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInstagramPosts = async () => {
      try {
        const response = await fetch(
          `https://www.instagram.com/api/v1/users/web_profile_info/?username=${INSTAGRAM_USERNAME}`,
          {
            headers: {
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          const userPosts = data.data?.user?.edge_owner_to_timeline_media?.edges || [];
          const formattedPosts = userPosts.slice(0, 5).map((edge: { node: { id: string; display_url: string; shortcode: string; edge_media_to_caption: { edges: Array<{ node: { text: string } }> }; taken_at_timestamp: number } }) => ({
            id: edge.node.id,
            thumbnail: edge.node.display_url,
            permalink: `https://www.instagram.com/p/${edge.node.shortcode}/`,
            caption: edge.node.edge_media_to_caption.edges[0]?.node.text || "",
            timestamp: new Date(edge.node.taken_at_timestamp * 1000).toISOString(),
          }));
          setPosts(formattedPosts);
        } else {
          setPosts(fallbackPosts);
        }
      } catch {
        setPosts(fallbackPosts);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInstagramPosts();
  }, []);

  const visiblePosts = posts.slice(currentIndex, currentIndex + 3);
  const showLeftArrow = currentIndex > 0;
  const showRightArrow = currentIndex + 3 < posts.length;

  const prevSlide = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => Math.min(posts.length - 3, prev + 1));
  };

  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 lg:mb-16">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Instagram className="w-6 h-6 text-primary" />
            <p className="text-primary font-medium font-sans">@{INSTAGRAM_USERNAME}</p>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
            Sigue-nos no Instagram
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-sans">
            Veja nossas últimas aventuras e fotos dos nossos passeios
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-full max-w-sm h-80 bg-muted rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="relative">
            <div className="overflow-hidden">
              <div 
                className="flex gap-6 transition-transform duration-300 ease-out"
                style={{ transform: `translateX(-${currentIndex * (100 / 3)}%)` }}
              >
                {posts.map((post) => (
                  <a
                    key={post.id}
                    href={post.permalink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-none w-full md:w-1/2 lg:w-1/3 group"
                  >
                    <div className="bg-card rounded-2xl overflow-hidden border border-border/50 group-hover:shadow-xl transition-all duration-300">
                      <div className="relative h-64 overflow-hidden">
                        <img
                          src={post.thumbnail}
                          alt={post.caption.slice(0, 50)}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                          <Instagram className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                      </div>
                      <div className="p-4">
                        <p className="text-sm text-muted-foreground font-sans line-clamp-2">
                          {post.caption.slice(0, 80)}
                          {post.caption.length > 80 && "..."}
                        </p>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {posts.length > 3 && (
              <>
                {showLeftArrow && (
                  <button
                    onClick={prevSlide}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-6 w-12 h-12 bg-background hover:bg-muted rounded-full shadow-lg border border-border/50 flex items-center justify-center transition-all hover:scale-110 z-10"
                    aria-label="Post anterior"
                  >
                    <ChevronLeft className="w-5 h-5 text-foreground" />
                  </button>
                )}
                {showRightArrow && (
                  <button
                    onClick={nextSlide}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-6 w-12 h-12 bg-background hover:bg-muted rounded-full shadow-lg border border-border/50 flex items-center justify-center transition-all hover:scale-110 z-10"
                    aria-label="Próximo post"
                  >
                    <ChevronRight className="w-5 h-5 text-foreground" />
                  </button>
                )}
              </>
            )}
          </div>
        )}

        <div className="text-center mt-10">
          <a
            href={`https://www.instagram.com/${INSTAGRAM_USERNAME}/`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" size="lg" className="font-sans">
              <Instagram className="w-4 h-4 mr-2" />
              Ver mais no Instagram
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
