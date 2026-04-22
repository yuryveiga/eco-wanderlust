/**
 * Optimizes image URLs by appending resizing, quality, and format parameters.
 * Supports Unsplash and Supabase Storage (if transformation is enabled).
 */
export function getOptimizedImage(
  url: string, 
  width: number = 800, 
  quality: number = 80, 
  format?: 'webp' | 'avif',
  fit: 'cover' | 'contain' = 'cover',
  height?: number,
  version?: string | number
): string {
  if (!url) return "";

  // Enable resizing ONLY for tiny placeholders (like the 20px blur prev)
  const isPlaceholder = width <= 50;
  const widthParam = isPlaceholder ? `&w=${width}` : "";
  const heightParam = height ? `&h=${height}` : "";
  const sbWidthParam = isPlaceholder ? `&width=${width}` : "";
  const sbHeightParam = height ? `&height=${height}` : "";
  const versionParam = version ? `&v=${version}` : "";

  // Unsplash Optimization
  if (url.includes("images.unsplash.com")) {
    const baseUrl = url.split("?")[0];
    const fmt = format ? `&fm=${format}` : "&auto=format";
    
    if (fit === 'contain') {
      const fitParam = height ? "&fit=max" : "";
      return `${baseUrl}?q=${quality}${widthParam}${heightParam}${fmt}${fitParam}${versionParam}`;
    }
    
    return `${baseUrl}?q=${quality}${widthParam}${heightParam}${fmt}${versionParam}&fit=crop`;
  }

  // Supabase Storage Optimization (Resize API)
  if (url.includes("supabase.co/storage/v1/object/public")) {
    if (url.includes("/object/public/")) {
        const renderUrl = url.replace("/object/public/", "/render/image/public/");
        const fmt = format ? `&format=${format}` : "";
        const sbResize = isPlaceholder ? "" : `&resize=${fit}`;
        return `${renderUrl}?quality=${quality}${sbWidthParam}${sbHeightParam}${fmt}${sbResize}${versionParam}`;
    }
  }

  // Add version to other URLs if provided
  if (versionParam) {
    const separator = url.includes("?") ? "&" : "?";
    return `${url}${separator}v=${version}`;
  }

  return url;
}

/**
 * Generates a tiny, low-quality version of the image for use as a blur placeholder (LQIP).
 */
export function getBlurPlaceholder(url: string, fit: 'cover' | 'contain' = 'cover', height?: number, version?: string | number): string {
  if (!url) return "";
  // tiny width (20px) and low quality (10) for maximum blur efficiency
  return getOptimizedImage(url, 20, 10, 'webp', fit, height, version);
}
