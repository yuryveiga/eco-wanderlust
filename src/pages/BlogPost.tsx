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
import "react-quill/dist/quill.snow.css";

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<LovableBlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { t, language } = useLocale();
  const { siteSettings } = useSiteData();

  const dateLocale = language === 'en' ? enUS : language === 'es' ? es : ptBR;
  const siteTitle = siteSettings?.site_title?.split('|')[0].trim() || "Eco-Wanderlust";

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

  return (
    <div className="min-h-screen flex flex-col pt-20 font-sans">
      <Helmet>
        <title>{title} | {siteTitle}</title>
        <meta name="description" content={excerpt || title} />
        <meta property="og:title" content={`${title} | ${siteTitle}`} />
        {post.image_url && <meta property="og:image" content={post.image_url} />}
      </Helmet>
      <Header />
      
      <main className="flex-1 bg-background pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 relative z-10">
          <div className="bg-card rounded-2xl shadow-xl p-8 sm:p-12 border border-border/50">
            <Link to="/blog" className="inline-flex items-center text-primary font-medium font-sans mb-6 hover:underline">
              <ArrowLeft className="w-4 h-4 mr-2" /> {t("voltar_blog")}
            </Link>

            {post.image_url && (
              <div className="w-full aspect-video relative rounded-xl overflow-hidden mb-10 shadow-lg border border-border/50">
                <img 
                  src={post.image_url} 
                  alt={title} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4 font-sans">
              <Calendar className="w-4 h-4" />
              {post.created_at ? format(new Date(post.created_at), language === 'en' ? "MMMM dd, yyyy" : "dd 'de' MMMM 'de' yyyy", { locale: dateLocale }) : t("publicado_recentemente")}
            </div>
            
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-10 leading-tight">
              {title}
            </h1>
            
            <div 
              className="prose prose-lg dark:prose-invert max-w-none font-sans ql-editor"
              style={{ padding: 0 }}
              dangerouslySetInnerHTML={{ __html: content || "" }}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPost;
