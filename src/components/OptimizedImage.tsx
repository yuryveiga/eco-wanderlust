import { useState, useEffect } from "react";
import { getOptimizedImage, getBlurPlaceholder } from "@/utils/imageOptimization";
import { cn } from "@/lib/utils";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  quality?: number;
  className?: string;
  containerClassName?: string;
  loading?: "lazy" | "eager";
  fetchPriority?: "high" | "low" | "auto";
  decoding?: "async" | "sync" | "auto";
}

export function OptimizedImage({
  src,
  alt,
  width = 800,
  quality = 80,
  className,
  containerClassName,
  loading = "lazy",
  fetchPriority = "auto",
  decoding = "async",
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [blurSrc, setBlurSrc] = useState("");

  useEffect(() => {
    if (src) {
      setBlurSrc(getBlurPlaceholder(src));
      // Reset load state if src changes
      setIsLoaded(false);
    }
  }, [src]);

  return (
    <div className={cn("relative overflow-hidden bg-muted", containerClassName)}>
      {/* Blurred Placeholder (LQIP) */}
      {blurSrc && !isLoaded && (
        <img
          src={blurSrc}
          alt=""
          className={cn(
            "absolute inset-0 w-full h-full object-cover scale-110 blur-2xl transition-opacity duration-500",
            isLoaded ? "opacity-0" : "opacity-100"
          )}
          aria-hidden="true"
        />
      )}

      {/* Main Image with modern format support */}
      <picture>
        <source 
          srcSet={getOptimizedImage(src, width, quality, 'avif')} 
          type="image/avif" 
        />
        <source 
          srcSet={getOptimizedImage(src, width, quality, 'webp')} 
          type="image/webp" 
        />
        <img
          src={getOptimizedImage(src, width, quality)}
          alt={alt}
          onLoad={() => setIsLoaded(true)}
          loading={loading}
          fetchPriority={fetchPriority}
          decoding={decoding}
          className={cn(
            "w-full h-full object-cover transition-all duration-700 ease-in-out",
            isLoaded ? "opacity-100 blur-0 scale-100" : "opacity-0 blur-lg scale-105",
            className
          )}
        />
      </picture>
    </div>
  );
}
