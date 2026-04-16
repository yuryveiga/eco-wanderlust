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
  fit?: "cover" | "contain";
  fill?: boolean;
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
  fit = "cover",
  fill = true,
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
    <div className={cn(
      "relative",
      fill && "overflow-hidden w-full h-full",
      !fill && "flex items-center justify-center",
      containerClassName
    )}>
      {/* Background placeholder base for better UX */}
      {fill && <div className="absolute inset-0 bg-muted/20" />}
      {/* Blurred Placeholder (LQIP) */}
      {blurSrc && (
        <img
          src={blurSrc}
          alt=""
          className={cn(
            "transition-opacity duration-1000 ease-in-out blur-2xl scale-110 pointer-events-none",
            fill ? "absolute inset-0 w-full h-full" : "w-full h-full",
            fit === "cover" ? "object-cover" : "object-contain",
            isLoaded ? "opacity-0 invisible" : "opacity-100 visible"
          )}
          aria-hidden="true"
        />
      )}

      {/* Main Image with modern format support */}
      {/* Main Image with modern format support */}
      <picture className={cn(!fill && "block w-full h-full")}>
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
            "transition-all duration-1000 ease-in-out",
            fill ? "w-full h-full" : "max-w-full max-h-screen h-auto w-auto mx-auto block",
            fit === "cover" ? "object-cover" : "object-contain",
            isLoaded ? "opacity-100 scale-100 blur-0" : "opacity-0 scale-105 blur-lg",
            className
          )}
        />
      </picture>
    </div>
  );
}
