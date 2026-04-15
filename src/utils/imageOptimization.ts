/**
 * Optimizes image URLs by appending resizing and quality parameters.
 * Supports Unsplash and Supabase Storage (if transformation is enabled).
 */
export function getOptimizedImage(url: string, width: number = 800, quality: number = 80): string {
  if (!url) return "";

  // Unsplash Optimization
  if (url.includes("images.unsplash.com")) {
    const baseUrl = url.split("?")[0];
    return `${baseUrl}?q=${quality}&w=${width}&auto=format&fit=crop`;
  }

  // Supabase Storage Optimization (Resize API)
  // Note: Requires Supabase Pro or Image Transformation enabled
  if (url.includes("supabase.co/storage/v1/object/public")) {
    // If you have image transformation enabled, the URL structure changes to:
    // .../storage/v1/render/image/public/bucket/path?width=...
    if (url.includes("/object/public/")) {
        return url.replace("/object/public/", "/render/image/public/") + `?width=${width}&quality=${quality}`;
    }
  }

  return url;
}
