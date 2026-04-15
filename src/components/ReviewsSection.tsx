import { useEffect } from "react";
import { useLocale } from "@/contexts/LocaleContext";

export function ReviewsSection() {
  const { t } = useLocale();

  useEffect(() => {
    // Load Elfsight platform script
    const script = document.createElement("script");
    script.src = "https://elfsightcdn.com/platform.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Clean up script on unmount
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <section id="reviews" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4 text-balance">
            {t("visitantes_dizem")}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto font-sans">
            {t("reviews_desc")}
          </p>
        </div>

        <div className="min-h-[400px] flex items-center justify-center">
          <div 
            className="elfsight-app-a8e8bba0-e42c-47cd-a67d-a76cbb8bbd82" 
            data-elfsight-app-lazy
          />
        </div>
      </div>
    </section>
  );
}
