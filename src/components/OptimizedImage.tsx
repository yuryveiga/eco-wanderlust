import { useState, useRef, useEffect, memo } from "react";

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}

/**
 * Generates srcset entries for responsive images.
 * Supports Supabase Storage render API and Unsplash.
 */
function getSrcSet(url: string, widths: number[]): { webp: string; avif: string; fallback: string } {
  if (!url) return { webp: "", avif: "", fallback: "" };

  const entries = widths.map((w) => {
    const optimized = getResizedUrl(url, w);
    return `${optimized} ${w}w`;
  });

  // For Supabase render API we can request format via query param
  // For others, browsers will use Accept header
  return {
    avif: entries.join(", "),
    webp: entries.join(", "),
    fallback: entries.join(", "),
  };
}

function getResizedUrl(url: string, width: number, quality: number = 80): string {
  if (!url) return "";

  if (url.includes("images.unsplash.com")) {
    const baseUrl = url.split("?")[0];
    return `${baseUrl}?q=${quality}&w=${width}&auto=format&fit=crop`;
  }

  if (url.includes("supabase.co/storage/v1/object/public")) {
    return url.replace("/object/public/", "/render/image/public/") + `?width=${width}&quality=${quality}`;
  }

  return url;
}

function getLqipUrl(url: string): string {
  return getResizedUrl(url, 20, 20);
}

const BREAKPOINT_WIDTHS = [400, 600, 800, 1200, 1600];

export const OptimizedImage = memo(function OptimizedImage({
  src,
  alt,
  className = "",
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  priority = false,
  onClick,
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || isInView) return;
    const el = imgRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [priority, isInView]);

  const srcSet = getSrcSet(src, BREAKPOINT_WIDTHS);
  const lqip = getLqipUrl(src);
  const fallbackSrc = getResizedUrl(src, 800);

  return (
    <div ref={imgRef} className={`relative overflow-hidden ${className}`} onClick={onClick}>
      {/* LQIP blur placeholder — always visible until real image loads */}
      <img
        src={lqip}
        alt=""
        aria-hidden="true"
        className={`absolute inset-0 w-full h-full object-cover scale-110 blur-lg transition-opacity duration-500 ${
          isLoaded ? "opacity-0" : "opacity-100"
        }`}
      />

      {/* Real image with <picture> for format negotiation */}
      {isInView && (
        <picture>
          <source type="image/avif" srcSet={srcSet.avif} sizes={sizes} />
          <source type="image/webp" srcSet={srcSet.webp} sizes={sizes} />
          <img
            src={fallbackSrc}
            srcSet={srcSet.fallback}
            sizes={sizes}
            alt={alt}
            loading={priority ? "eager" : "lazy"}
            decoding={priority ? "sync" : "async"}
            onLoad={() => setIsLoaded(true)}
            className={`w-full h-full object-cover transition-opacity duration-500 ${
              isLoaded ? "opacity-100" : "opacity-0"
            }`}
          />
        </picture>
      )}
    </div>
  );
});
