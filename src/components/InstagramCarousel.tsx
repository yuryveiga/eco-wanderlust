import { Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/contexts/LocaleContext";

const INSTAGRAM_USERNAME = "tocorimerio";

export function InstagramCarousel() {
  const { t } = useLocale();

  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 lg:mb-16">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Instagram className="w-6 h-6 text-primary" />
            <p className="text-primary font-medium font-sans">@{INSTAGRAM_USERNAME}</p>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
            {t("siga_instagram")}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-sans">
            {t("insta_desc")}
          </p>
        </div>

        <div 
          className="w-full rounded-2xl overflow-hidden border border-border/50"
          style={{ height: "500px" }}
        >
          <iframe
            src={`https://www.juicer.io/api/boards/${INSTAGRAM_USERNAME}/iframe`}
            style={{ width: "100%", height: "100%", border: "none" }}
            title="Instagram Feed"
            loading="lazy"
          />
        </div>

        <div className="text-center mt-10">
          <a
            href={`https://www.instagram.com/${INSTAGRAM_USERNAME}/`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" size="lg" className="font-sans">
              <Instagram className="w-4 h-4 mr-2" />
              {t("ver_mais_insta")}
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
