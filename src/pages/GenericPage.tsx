import { useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import { fetchLovable, LovablePage } from "@/integrations/lovable/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const GenericPage = () => {
  const { slug } = useParams();
  const [page, setPage] = useState<LovablePage | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPage();
  }, [slug]);

  const loadPage = async () => {
    setIsLoading(true);
    const pages = await fetchLovable<LovablePage>("pages");
    const found = pages.find((p) => p.href === `/${slug}`);
    
    setPage(found || null);
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!page || (!page.content && page.is_visible === false)) {
    return <Navigate to="/404" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col pt-20">
      <Header />
      
      <main className="flex-1 bg-background py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-foreground mb-8 text-center">
            {page.title}
          </h1>
          
          <div 
            className="prose prose-lg dark:prose-invert max-w-none font-sans"
            dangerouslySetInnerHTML={{ __html: page.content || "<p>Nenhum conteúdo adicionado.</p>" }}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default GenericPage;
