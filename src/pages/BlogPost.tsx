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
import "react-quill-new/dist/quill.snow.css";

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<LovableBlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { t, language } = useLocale();
  const { siteSettings } = useSiteData();

  const dateLocale = language === 'en' ? enUS : language === 'es' ? es : ptBR;
  const siteTitle = siteSettings?.site_title?.split('|')[0].trim() || "Eco-Wanderlust";
  const { images } = useSiteData();
  const fallbackImage = images.hero_bg || "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?q=80&w=1920";

  const loadPost = async () => {
    setIsLoading(true);
    const posts = await fetchLovable<LovableBlogPost>("blog_posts");
    const found = posts.find((p) => p.slug === slug && p.is_published);
    
    setPost(found || null);
    setIsLoading(false);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    loadPost();
  }, [slug]);

  const getTranslated = (field: string) => {
    if (!post) return "";
    if (language === 'pt') return (post as any)[field];
    return (post as any)[`${field}_${language}`] || (post as any)[field];
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
          font-family: inherit;
          color: inherit;
          line-height: 1.8;
        }
        .blog-content-area p {
          margin-bottom: 1.5rem;
          font-size: 1.125rem;
          opacity: 0.9;
        }
        .blog-content-area h1, 
        .blog-content-area h2, 
        .blog-content-area h3 {
          font-family: var(--font-serif);
          font-weight: 700;
          color: var(--foreground);
          margin-top: 2.5rem;
          margin-bottom: 1.25rem;
          line-height: 1.3;
        }
        .blog-content-area h2 { font-size: 2rem; }
        .blog-content-area h3 { font-size: 1.5rem; }
        
        .blog-content-area ul, 
        .blog-content-area ol {
          margin-bottom: 1.5rem;
          padding-left: 1.5rem;
        }
        .blog-content-area li {
          margin-bottom: 0.5rem;
        }
        .blog-content-area img {
          border-radius: 1rem;
          margin: 2rem 0;
          box-shadow: 0 10px 30px -10px rgba(0,0,0,0.1);
        }
        .blog-content-area blockquote {
          border-left: 4px solid var(--primary);
          padding-left: 1.5rem;
          font-style: italic;
          margin: 2rem 0;
          opacity: 0.8;
        }
      `}</style>
      <Helmet>
        <title>{title} | {siteTitle}</title>
        <meta name="description" content={excerpt || title} />
        <meta property="og:title" content={`${title} | ${siteTitle}`} />
        <meta property="og:image" content={post.image_url || fallbackImage} />
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
                  className="prose prose-lg dark:prose-invert max-w-none font-sans ql-editor blog-content-area"
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
   
                <div className="w-full aspect-video relative rounded-xl overflow-hidden mb-10 shadow-lg border border-border/50">
                  <img 
                    src={post.image_url || fallbackImage} 
                    alt={title} 
                    className="w-full h-full object-cover"
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
                className="prose prose-lg dark:prose-invert max-w-none font-sans ql-editor blog-content-area"
                style={{ padding: 0 }}
                dangerouslySetInnerHTML={{ __html: content || "" }}
              />
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default BlogPost;
