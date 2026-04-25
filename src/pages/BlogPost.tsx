import { useState, useEffect } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import { fetchLovable, LovableBlogPost } from "@/integrations/lovable/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Calendar, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { ptBR, enUS, es } from "date-fns/locale";
import { useLocale } from "@/contexts/LocaleContext";
import { Helmet } from "react-helmet-async";
import { useSiteData } from "@/hooks/useSiteData";
import { TourCard, TourCardProps } from "@/components/ToursSection";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import "react-quill-new/dist/quill.snow.css";
import { OptimizedImage } from "@/components/OptimizedImage";
import { getCanonicalUrl } from "@/utils/seo";

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<LovableBlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { t, language } = useLocale();
  const { siteSettings, images, tours } = useSiteData();

  const dateLocale = language === 'en' ? enUS : language === 'es' ? es : ptBR;
  const siteTitle = siteSettings?.site_title?.split('|')[0].trim() || "Tocorime Rio";
  const fallbackImage = images.hero_bg || "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?q=80&w=1920";

  useEffect(() => {
    window.scrollTo(0, 0);
    const loadPost = async () => {
      setIsLoading(true);
      const posts = await fetchLovable<LovableBlogPost>("blog_posts");
      const found = posts.find((p) => p.slug === slug && p.is_published);
      
      setPost(found || null);
      setIsLoading(false);
    };
    loadPost();
  }, [slug]);

  const getTranslated = (field: keyof LovableBlogPost) => {
    if (!post) return "";
    if (language === 'pt') return post[field];
    return (post as Record<string, any>)[`${field}_${language}`] || post[field];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!post) {
    return <Navigate to="/404" replace />;
  }

  const title = getTranslated('title');
  const content = getTranslated('content');
  const excerpt = getTranslated('excerpt');

  const blogHeroStyle = siteSettings?.blog_hero_style || "hero";

  return (
    <div className="min-h-screen flex flex-col font-sans bg-background">
      <style>{`
        .blog-content-area {
          font-family: 'Open Sans', sans-serif !important;
          color: #555555 !important;
          line-height: 1.6 !important;
          font-size: 1.05rem !important;
          text-align: left !important;
          hyphens: none !important;
          word-break: normal !important;
          overflow-wrap: break-word !important;
        }
        .blog-content-area * {
          margin-top: 0 !important;
          margin-inline: 0 !important;
        }
        .blog-content-area p {
          margin-bottom: 1.2rem !important;
          line-height: 1.7 !important;
          text-align: left !important;
          word-break: normal !important;
        }
        /* Handle spacing for manual line breaks without forcing them to be blocks */
        .blog-content-area br {
          margin-bottom: 0 !important;
        }
        /* Specific fix for empty paragraphs used as spacers by some editors */
        .blog-content-area p:empty,
        .blog-content-area p:has(br:only-child) {
          min-height: 1.2rem;
          margin-bottom: 0.8rem !important;
        }
        .blog-content-area h1, 
        .blog-content-area h2, 
        .blog-content-area h3 {
          font-family: 'Montserrat', sans-serif !important;
          font-weight: 700 !important;
          color: #333333 !important;
          margin-top: 1rem !important;
          margin-bottom: 0.3rem !important;
          line-height: 1.2 !important;
        }
        .blog-content-area h1 { font-size: 2rem !important; }
        .blog-content-area h2 { font-size: 1.6rem !important; }
        .blog-content-area h3 { font-size: 1.3rem !important; }
        
        .blog-content-area ul, 
        .blog-content-area ol {
          margin-bottom: 1.5rem !important;
          margin-top: 0.5rem !important;
          padding-left: 2rem !important;
          display: block !important;
        }
        .blog-content-area ul {
          list-style-type: disc !important;
        }
        .blog-content-area ol {
          list-style-type: decimal !important;
        }
        .blog-content-area li {
          margin-bottom: 0.5rem !important;
          line-height: 1.6 !important;
          display: list-item !important;
          list-style: inherit !important;
        }
        .blog-content-area img {
          border-radius: 0.5rem;
          margin: 1rem 0 !important;
          max-width: 100%;
          display: block;
        }
        .blog-content-area blockquote {
          border-left: 3px solid #008967;
          padding-left: 1rem;
          font-style: italic;
          margin: 1rem 0 !important;
          opacity: 0.9;
        }
        /* Override Quill default padding */
        .ql-editor.blog-content-area {
          padding: 0 !important;
        }
      `}</style>
      <Helmet>
        <title>{title} | {siteTitle}</title>
        <meta name="description" content={excerpt || title} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="article" />
        <meta property="og:url" content={getCanonicalUrl(`/blog/${post.slug}`)} />
        <meta property="og:title" content={`${title} | ${siteTitle}`} />
        <meta property="og:description" content={excerpt || title} />
        <meta property="og:image" content={post.image_url || fallbackImage} />

        <link rel="canonical" href={getCanonicalUrl(`/blog/${post.slug}`)} />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": title,
            "description": excerpt || title,
            "image": post.image_url || fallbackImage,
            "datePublished": post.created_at,
            "dateModified": post.updated_at || post.created_at,
            "author": {
              "@type": "Person",
              "name": "Tocorime Rio"
            }
          })}
        </script>

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": t("inicio"),
                "item": "https://tocorimerio.com/"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Blog",
                "item": "https://tocorimerio.com/blog"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": title,
                "item": `https://tocorimerio.com/blog/${post.slug}`
              }
            ]
          })}
        </script>

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:description" content={excerpt || title} />
        <meta name="twitter:image" content={post.image_url || fallbackImage} />

        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800&family=Open+Sans:wght@400;600&display=swap" rel="stylesheet" />
      </Helmet>
      
      <Header />
      
      <main className="flex-1">
        {blogHeroStyle === "hero" ? (
          <>
            {/* HERO SECTION FOR BLOG POST - NEW STYLE */}
            <section className="relative h-[60vh] sm:h-[70vh] flex items-center justify-center overflow-hidden bg-black">
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[20s] hover:scale-110"
                style={{ backgroundImage: `url('${post.image_url || fallbackImage}')` }}
              />
              <div className="absolute inset-0 bg-black/50" />
              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent z-[5]" />
              
              <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in-up">
                <Link to="/blog" className="inline-flex items-center text-white/80 hover:text-white font-sans mb-8 transition-colors">
                  <ArrowLeft className="w-5 h-5 mr-2" /> {t("voltar_blog")}
                </Link>
                
                <div className="flex items-center justify-center gap-2 text-sm text-white/80 mb-6 font-sans uppercase tracking-[0.2em]">
                  <Calendar className="w-4 h-4 text-primary" />
                  {post.created_at ? format(new Date(post.created_at), language === 'en' ? "MMMM dd, yyyy" : "dd 'de' MMMM 'de' yyyy", { locale: dateLocale }) : t("publicado_recentemente")}
                </div>
                
                <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-extrabold text-white mb-6 leading-tight drop-shadow-2xl">
                  {title}
                </h1>
              </div>
            </section>

            {/* CONTENT SECTION */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20 mb-20">
              <div className="bg-card rounded-3xl shadow-2xl p-8 sm:p-16 border border-border/50">
                <div 
                  className="max-w-none ql-editor blog-content-area"
                  style={{ padding: 0 }}
                  dangerouslySetInnerHTML={{ __html: content || "" }}
                />
              </div>
            </div>
          </>
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-32 relative z-10 mb-20">
            <div className="bg-card rounded-2xl shadow-xl p-8 sm:p-12 border border-border/50">
              <Link to="/blog" className="inline-flex items-center text-primary font-medium font-sans mb-6 hover:underline">
                <ArrowLeft className="w-4 h-4 mr-2" /> {t("voltar_blog")}
              </Link>
   
                <div className="w-full aspect-video relative rounded-xl overflow-hidden mb-10 shadow-lg border border-border/50 bg-muted">
                    <OptimizedImage
                      src={post.image_url || fallbackImage}
                      alt={title}
                      width={1200}
                      containerClassName="w-full h-full"
                      fit="cover"
                      className="w-full h-full transition-transform duration-[2s] group-hover:scale-105"
                      loading="eager"
                      fetchPriority="high"
                    />
                </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4 font-sans">
                <Calendar className="w-4 h-4" />
                {post.created_at ? format(new Date(post.created_at), language === 'en' ? "MMMM dd, yyyy" : "dd 'de' MMMM 'de' yyyy", { locale: dateLocale }) : t("publicado_recentemente")}
              </div>
              
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-10 leading-tight">
                {title}
              </h1>
              
              <div 
                className="max-w-none ql-editor blog-content-area"
                style={{ padding: 0 }}
                dangerouslySetInnerHTML={{ __html: content || "" }}
              />
            </div>
          </div>
        )}
        {/* RECOMMENDED TOURS SHOWCASE */}
        <section className="py-20 lg:py-24 bg-muted/30 border-t border-border/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-4">
                {language === 'pt' ? 'Que tal viver essa experiência no Rio de Janeiro?' : 
                 language === 'es' ? '¿Qué tal vivir esta experiencia en Río?' : 
                 'How about living this experience in Rio?'}
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-sans">
                {language === 'pt' ? 'Confira nossos passeios mais bem avaliados e reserve sua próxima aventura.' : 
                 language === 'es' ? 'Echa un vistazo a nuestros tours melhor valorados e reserva tu próxima aventura.' : 
                 'Check out our top-rated tours and book your next adventure.'}
              </p>
            </div>
            
            <div className="px-4 md:px-12">
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent className="-ml-4">
                  {(() => {
                    const sortedTours = tours
                      .sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
                      
                    return sortedTours.map((tour) => (
                      <CarouselItem key={tour.id} className="pl-4 basis-full sm:basis-1/2 lg:basis-1/4">
                        <div className="p-1">
                          <TourCard tour={tour as TourCardProps} />
                        </div>
                      </CarouselItem>
                    ));
                  })()}
                </CarouselContent>
                <div className="hidden md:block">
                  <CarouselPrevious className="-left-12 lg:-left-16 w-12 h-12 bg-white/80 hover:bg-white shadow-lg border-primary/20" />
                  <CarouselNext className="-right-12 lg:-right-16 w-12 h-12 bg-white/80 hover:bg-white shadow-lg border-primary/20" />
                </div>
              </Carousel>
            </div>
            
            <div className="mt-12 text-center">
              <Link to="/#tours">
                <Button size="lg" className="rounded-full px-10 font-bold h-14 text-sm uppercase tracking-widest shadow-xl shadow-primary/20">
                  {t("ver_todos_passeios") || (language === 'pt' ? 'Ver Todos os Passeios' : 'View All Tours')}
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPost;
