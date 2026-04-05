import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchLovable, LovableBlogPost } from "@/integrations/lovable/client";
import { Link } from "react-router-dom";
import { useLocale } from "@/contexts/LocaleContext";

export function BlogCarousel() {
  const [posts, setPosts] = useState<LovableBlogPost[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useLocale();

  useEffect(() => {
    fetchLovable<LovableBlogPost>("blog_posts").then((data) => {
      setPosts(data.filter(p => p.is_published));
      setIsLoading(false);
    }).catch(() => setIsLoading(false));
  }, []);

  const nextPost = () => {
    setCurrentIndex((prev) => (prev + 1) % posts.length);
  };

  const prevPost = () => {
    setCurrentIndex((prev) => (prev - 1 + posts.length) % posts.length);
  };

  if (isLoading || posts.length === 0) return null;

  return (
    <section className="bg-[#FF8A5B] py-16 md:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left Side: Content */}
          <div className="w-full lg:w-1/3 text-white">
            <h2 className="font-serif text-4xl sm:text-5xl font-bold mb-6 leading-tight">
              {t("inspirado_explorar")}
            </h2>
            <div className="w-full h-0.5 bg-white/30 mb-8 max-w-[280px]" />
            <p className="text-lg sm:text-xl font-sans lg:leading-relaxed text-white/90 mb-10">
              {t("blog_desc")}
            </p>
            
            <div className="flex gap-4 mt-8">
              <button 
                onClick={prevPost}
                className="w-12 h-12 rounded-full bg-white text-[#FF8A5B] flex items-center justify-center hover:bg-white/90 transition-all shadow-lg active:scale-95"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button 
                onClick={nextPost}
                className="w-12 h-12 rounded-full bg-white text-[#FF8A5B] flex items-center justify-center hover:bg-white/90 transition-all shadow-lg active:scale-95"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Right Side: Carousel */}
          <div className="w-full lg:w-2/3 relative h-[500px]">
             <div 
               className="flex gap-6 transition-transform duration-500 ease-out h-full"
               style={{ transform: `translateX(-${currentIndex * (posts.length > 1 ? 42 : 0)}%)` }}
             >
                {posts.map((post) => (
                  <div 
                    key={post.id} 
                    className="min-w-[300px] md:min-w-[340px] w-full max-w-[380px] h-full flex flex-col rounded-2xl overflow-hidden shadow-2xl group"
                  >
                    <div className="h-2/5 overflow-hidden">
                      <img 
                        src={post.image_url || "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?q=80&w=1200"} 
                        alt={post.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>
                    <div className="h-3/5 bg-[#008967] p-6 flex flex-col justify-between items-start">
                      <div className="w-full">
                        <h3 className="font-serif text-xl font-bold text-white mb-4 line-clamp-3 leading-snug">
                          {post.title}
                        </h3>
                        <p className="text-white/80 font-sans text-sm line-clamp-4 leading-relaxed">
                          {post.content ? post.content.replace(/<[^>]*>/g, '').substring(0, 150) + "..." : post.title}
                        </p>
                      </div>
                      
                      <Link to={`/blog/${post.slug}`} className="mt-4">
                        <Button className="bg-[#FF8A5B] hover:bg-[#ff7a45] text-white rounded-full px-6 font-sans font-bold flex items-center gap-2 group/btn">
                          {t("explore_conosco")}
                          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
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
