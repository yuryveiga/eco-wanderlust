import { useState } from "react";
import { Images, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useSiteData } from "@/hooks/useSiteData";

export function GallerySection() {
  const { images } = useSiteData();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const galleryImages = Object.entries(images)
    .filter(([key]) => !['logo', 'hero_bg'].includes(key))
    .map(([key, url]) => ({ key, url }));

  if (galleryImages.length === 0) {
    return (
      <section className="py-20 lg:py-28 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Images className="w-6 h-6 text-primary" />
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
              Galeria de Fotos
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-sans">
              Fotos dos nossos passeios e paisagens do Rio de Janeiro
            </p>
          </div>
          <div className="text-center py-12 text-muted-foreground font-sans">
            Nenhuma foto na galeria ainda.
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
    <section className="py-20 lg:py-28 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 lg:mb-16">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Images className="w-6 h-6 text-primary" />
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
            Galeria de Fotos
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-sans">
            Fotos dos nossos passeios e paisagens do Rio de Janeiro
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {galleryImages.map((img, index) => (
            <button
              key={img.key}
              onClick={() => openLightbox(index)}
              className="relative aspect-square rounded-xl overflow-hidden group bg-card"
            >
              <img
                src={img.url}
                alt={img.key}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                <Images className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </button>
          ))}
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
            src={galleryImages[selectedIndex].url}
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
          
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white font-sans text-sm">
            {selectedIndex + 1} / {galleryImages.length}
          </div>
        </div>
      )}
    </section>
  );
}
