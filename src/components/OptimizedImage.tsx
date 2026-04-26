import React, { useState, useEffect, memo } from "react";
import { getOptimizedImage, getBlurPlaceholder } from "@/utils/imageOptimization";
import { cn } from "@/lib/utils";
import { useSiteData } from "@/hooks/useSiteData";

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
  fill?: boolean;
  fit?: "cover" | "contain";
  height?: number;
  onDimensions?: (width: number, height: number) => void;
  version?: string | number;
  showBlur?: boolean;
}

export const OptimizedImage = memo(function OptimizedImage({
  src,
  alt,
  width = 800,
  quality = 70,
  className,
  containerClassName,
  loading = "lazy",
  fetchPriority = "auto",
  decoding = "async",
  fill = true,
  fit = "cover",
  height,
  onDimensions,
  version: propVersion,
  showBlur = true,
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [blurSrc, setBlurSrc] = useState("");
  const { version: siteVersion } = useSiteData();
  
  const version = propVersion || siteVersion;
  const shouldShowBlur = showBlur && fetchPriority !== "high";

  useEffect(() => {
    if (src && shouldShowBlur) {
      setBlurSrc(getBlurPlaceholder(src, fit, height, version));
      // Reset load state if src changes
      setIsLoaded(false);
    }
  }, [src, fit, height, version, shouldShowBlur]);


  return (
    <div className={cn(
      "relative bg-muted/20",
      fill && "overflow-hidden w-full h-full",
      containerClassName
    )}>
      {/* Blurred Placeholder (LQIP) */}
      {shouldShowBlur && blurSrc && (
        <img
          src={blurSrc}
          alt=""
          className={cn(
            "absolute inset-0 w-full h-full blur-2xl transition-opacity duration-1000 ease-in-out",
            fit === "cover" ? "object-cover scale-110" : "object-contain scale-100",
            isLoaded ? "opacity-0 invisible" : "opacity-100 visible"
          )}
          aria-hidden="true"
        />
      )}

      {/* Main Image with modern format support */}
      <picture className={cn(!fill && "flex items-center justify-center w-full h-full")}>
        <source 
          srcSet={getOptimizedImage(src, width, quality, 'avif', fit, height, version)} 
          type="image/avif" 
        />
        <source 
          srcSet={getOptimizedImage(src, width, quality, 'webp', fit, height, version)} 
          type="image/webp" 
        />
        <img
          src={getOptimizedImage(src, width, quality, undefined, fit, height, version)}
          alt={alt}
          onLoad={(e) => {
            const img = e.currentTarget;
            if (onDimensions) {
              onDimensions(img.naturalWidth, img.naturalHeight);
            }
            setIsLoaded(true);
          }}
          loading={loading}
          fetchPriority={fetchPriority}
          decoding={decoding}

          className={cn(
            "transition-all duration-700 ease-in-out",
            fill ? "w-full h-full" : "max-w-full max-h-full",
            fit === "cover" ? "object-cover" : "object-contain",
            isLoaded ? "opacity-100 scale-100 blur-0" : "opacity-0 scale-105 blur-2xl",
            className
          )}
        />
      </picture>
    </div>
  );
});

