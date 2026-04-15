import { useState, useMemo } from "react";
import { Images, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useSiteData } from "@/hooks/useSiteData";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useLocale } from "@/contexts/LocaleContext";
import { getOptimizedImage } from "@/utils/imageOptimization";

export function GallerySection() {
  const { gallery } = useSiteData();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const { t } = useLocale();

  const galleryImages = useMemo(() => {
    return [...gallery].sort(() => Math.random() - 0.5);
  }, [gallery]);

  if (galleryImages.length === 0) {
    return (
      <section className="py-20 lg:py-28 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Images className="w-6 h-6 text-primary" />
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
              {t("galeria")}
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-sans">
              {t("galeria_sub")}
            </p>
          </div>
          <div className="text-center py-12 text-muted-foreground font-sans">
            {t("nenhuma_foto")}
          </div>
        </div>
      </section>
    );
  }

  const openLightbox = (index: number) => setSelectedIndex(index);
  const closeLightbox = () => setSelectedIndex(null);
  const prevImage = () => setSelectedIndex((prev) => prev! > 0 ? prev! - 1 : galleryImages.length - 1);
  const nextImage = () => setSelectedIndex((prev) => prev! < galleryImages.length - 1 ? prev! + 1 : 0);

  return (
    <section className="py-20 lg:py-28 bg-muted/30 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 lg:mb-16">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Images className="w-6 h-6 text-primary" />
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
            {t("galeria")}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-sans">
            {t("galeria_sub")}
          </p>
        </div>

        <div className="px-12">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-3 md:-ml-4">
              {galleryImages.map((img, index) => (
                <CarouselItem key={img.key} className="pl-3 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/3">
                  <div className="p-1">
                    <button
                      onClick={() => openLightbox(index)}
                      className="relative w-full aspect-video rounded-xl overflow-hidden group bg-card border"
                    >
                      <img
                        src={getOptimizedImage(img.url, 800)}
                        alt={img.key}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                        <Images className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    </button>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="-left-12 lg:-left-16 w-12 h-12" />
            <CarouselNext className="-right-12 lg:-right-16 w-12 h-12" />
          </Carousel>
        </div>
      </div>

      {selectedIndex !== null && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
          onClick={closeLightbox}
          onKeyDown={(e) => {
            if (e.key === "Escape") closeLightbox();
            if (e.key === "ArrowLeft") prevImage();
            if (e.key === "ArrowRight") nextImage();
          }}
          tabIndex={0}
        >
          <button
            onClick={(e) => { e.stopPropagation(); closeLightbox(); }}
            className="absolute top-4 right-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          
          <button
            onClick={(e) => { e.stopPropagation(); prevImage(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          
          <img
            src={getOptimizedImage(galleryImages[selectedIndex].url, 1600)}
            alt={galleryImages[selectedIndex].key}
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
          
          <button
            onClick={(e) => { e.stopPropagation(); nextImage(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
          
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white font-sans text-sm bg-black/50 px-3 py-1 rounded-full">
            {selectedIndex + 1} / {galleryImages.length}
          </div>
        </div>
      )}
    </section>
  );
}
