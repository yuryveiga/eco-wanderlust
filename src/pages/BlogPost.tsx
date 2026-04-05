import { useState, useEffect } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import { fetchLovable, LovableBlogPost } from "@/integrations/lovable/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Calendar, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { ptBR, enUS, es } from "date-fns/locale";
import { useLocale } from "@/contexts/LocaleContext";

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<LovableBlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { t, language } = useLocale();

  const dateLocale = language === 'en' ? enUS : language === 'es' ? es : ptBR;

  useEffect(() => {
    window.scrollTo(0, 0);
    loadPost();
  }, [slug]);

  const loadPost = async () => {
    setIsLoading(true);
    const posts = await fetchLovable<LovableBlogPost>("blog_posts");
    const found = posts.find((p) => p.slug === slug && p.is_published);
    
    setPost(found || null);
    setIsLoading(false);
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

  return (
    <div className="min-h-screen flex flex-col pt-20">
      <Header />
      
      <main className="flex-1 bg-background pb-16">
        {post.image_url && (
          <div className="w-full h-[40vh] md:h-[60vh] relative">
            <img 
              src={post.image_url} 
              alt={post.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>
        )}
        
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
          <div className="bg-card rounded-2xl shadow-xl p-8 sm:p-12 border border-border/50">
            <Link to="/blog" className="inline-flex items-center text-primary font-medium font-sans mb-6 hover:underline">
              <ArrowLeft className="w-4 h-4 mr-2" /> {t("voltar_blog")}
            </Link>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4 font-sans">
              <Calendar className="w-4 h-4" />
              {post.created_at ? format(new Date(post.created_at), language === 'en' ? "MMMM dd, yyyy" : "dd 'de' MMMM 'de' yyyy", { locale: dateLocale }) : t("publicado_recentemente")}
            </div>
            
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-10 leading-tight">
              {post.title}
            </h1>
            
            <div 
              className="prose prose-lg dark:prose-invert max-w-none font-sans"
              dangerouslySetInnerHTML={{ __html: post.content || "" }}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPost;
