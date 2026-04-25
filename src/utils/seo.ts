export const BASE_URL = "https://tocorimerio.com";

/**
 * Gera uma URL canônica limpa, removendo barras finais e parâmetros de consulta.
 * @param path O caminho da página (ex: "/blog/meu-post")
 * @param lang O idioma atual para incluir na URL (ex: "pt", "en")
 * @returns A URL canônica completa
 */
export const getCanonicalUrl = (path: string = "") => {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  // Remove trailing slash unless it's just the root
  const finalPath = cleanPath === "/" ? "" : cleanPath.replace(/\/$/, "");
  return `${BASE_URL}${finalPath}`;
};
