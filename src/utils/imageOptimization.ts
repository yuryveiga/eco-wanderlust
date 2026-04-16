/**
 * Optimizes image URLs by appending resizing, quality, and format parameters.
 * Supports Unsplash and Supabase Storage (if transformation is enabled).
 */
export function getOptimizedImage(
  url: string, 
  width: number = 800, 
  quality: number = 80, 
  format?: 'webp' | 'avif',
  fit: 'cover' | 'contain' = 'cover'
): string {
  if (!url) return "";

  // Enable resizing ONLY for tiny placeholders (like the 20px blur prev)
  // to avoid downloading full images for the blur step.
  // Main images will bypass the width parameter as requested.
  const isPlaceholder = width <= 50;
  const widthParam = isPlaceholder ? `&w=${width}` : "";
  const sbWidthParam = isPlaceholder ? `&width=${width}` : "";

  // Unsplash Optimization
  if (url.includes("images.unsplash.com")) {
    const baseUrl = url.split("?")[0];
    const fmt = format ? `&fm=${format}` : "&auto=format";
    // Using fit=crop for covers and fit=max for contained images
    const unsplashFit = fit === 'cover' ? 'crop' : 'max';
    return `${baseUrl}?q=${quality}${widthParam}${fmt}&fit=${unsplashFit}`;
  }

  // Supabase Storage Optimization (Resize API)
  if (url.includes("supabase.co/storage/v1/object/public")) {
    if (url.includes("/object/public/")) {
        const renderUrl = url.replace("/object/public/", "/render/image/public/");
        const fmt = format ? `&format=${format}` : "";
        // Supabase supports resize parameter (cover, contain, fill)
        const sbResize = isPlaceholder ? "" : `&resize=${fit}`;
        return `${renderUrl}?quality=${quality}${sbWidthParam}${fmt}${sbResize}`;
    }
  }

  return url;
}

/**
 * Generates a tiny, low-quality version of the image for use as a blur placeholder (LQIP).
 */
export function getBlurPlaceholder(url: string): string {
  if (!url) return "";
  // tiny width (20px) and low quality (10) for maximum blur efficiency
  return getOptimizedImage(url, 20, 10, 'webp');
}
