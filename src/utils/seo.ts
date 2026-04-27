export const BASE_URL = "https://tocorimerio.com";

/**
 * Gera uma URL canônica limpa, removendo barras finais e parâmetros de consulta.
 * @param path O caminho da página (ex: "/blog/meu-post")
 * @returns A URL canônica completa
 */
export const getCanonicalUrl = (path: string = "") => {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  // Remove trailing slash unless it's just the root
  const finalPath = cleanPath === "/" ? "" : cleanPath.replace(/\/$/, "");
  return `${BASE_URL}${finalPath}`;
};

export const generateLocalBusinessSchema = (siteTitle: string, description: string) => {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": siteTitle,
    "description": description,
    "url": BASE_URL,
    "telephone": "+5521999999999",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Rio de Janeiro",
      "addressRegion": "RJ",
      "addressCountry": "BR"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": -22.9068,
      "longitude": -43.1729
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      "opens": "08:00",
      "closes": "20:00"
    }
  };
};
