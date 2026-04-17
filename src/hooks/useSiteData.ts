import { useQuery } from "@tanstack/react-query";
import { fetchLovable, LovableTour, LovablePage, LovableSiteImage, LovableSocialMedia, LovableSiteSetting } from "@/integrations/lovable/client";

const fallbackTours: LovableTour[] = [
  { id: "1", title: "City Tour Rio Completo", short_description: "Conheça os pontos turísticos mais icônicos do Rio de Janeiro.", price: 250, duration: "8 horas", max_group_size: 15, image_url: "https://images.unsplash.com/photo-1619546952812-520e98064a52?q=80&w=1200", is_featured: true, category: "City Tour", is_active: true, sort_order: 1 },
  { id: "2", title: "Arraial do Cabo", short_description: "Descubra o Caribe Brasileiro com águas cristalinas.", price: 180, duration: "12 horas", max_group_size: 20, image_url: "https://images.unsplash.com/photo-1516834611397-8d633eaec5c0?q=80&w=1200", is_featured: true, category: "Praia", is_active: true, sort_order: 2 },
  { id: "3", title: "Angra dos Reis", short_description: "Navegue pelas ilhas paradisíacas de Angra dos Reis.", price: 200, duration: "10 horas", max_group_size: 25, image_url: "https://images.unsplash.com/photo-1544989164-31dc3c645987?q=80&w=1200", is_featured: true, category: "Barco", is_active: true, sort_order: 3 },
];

const TOUR_LISTING_COLUMNS = "id,title,short_description,price,duration,max_group_size,image_url,is_featured,category,is_active,sort_order,slug,pricing_model,price_1_person,price_2_people,price_3_6_people,price_7_19_people,use_custom_options,custom_options_json,external_url,title_en,title_es,short_description_en,short_description_es,category_en,category_es";

export function useTours() {
  return useQuery({
    queryKey: ["tours"],
    queryFn: async () => {
      const data = await fetchLovable<LovableTour>("tours", TOUR_LISTING_COLUMNS);
      return data.filter((t) => t.is_active).sort((a, b) => a.sort_order - b.sort_order);
    },
    staleTime: 1000 * 60 * 10,
  });
}

export function usePages() {
  return useQuery({
    queryKey: ["pages"],
    queryFn: async () => {
      const data = await fetchLovable<LovablePage>("pages");
      return data.filter((p) => p.is_visible).sort((a, b) => a.sort_order - b.sort_order);
    },
    staleTime: 1000 * 60 * 60, // 1 hour for pages
  });
}

export function useSiteImages() {
  return useQuery({
    queryKey: ["siteImages"],
    queryFn: async () => {
      const data = await fetchLovable<LovableSiteImage>("site_images");
      const imagesMap: Record<string, string> = {};
      data.forEach((img) => { imagesMap[img.key] = img.image_url; });
      
      const galleryImages = data
        .filter(img => img.key?.startsWith('gallery'))
        .map(img => ({ id: img.id, url: img.image_url, key: img.key }));

      return { imagesMap, galleryImages };
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}

export function useSocialMedia() {
  return useQuery({
    queryKey: ["socialMedia"],
    queryFn: async () => {
      const data = await fetchLovable<LovableSocialMedia>("social_media");
      return data.filter((s) => s.is_active).sort((a, b) => a.sort_order - b.sort_order);
    },
    staleTime: 1000 * 60 * 60,
  });
}

export function useSiteSettings() {
  return useQuery({
    queryKey: ["siteSettings"],
    queryFn: async () => {
      const data = await fetchLovable<LovableSiteSetting>("site_settings");
      const settingsMap: Record<string, string> = {};
      data.forEach((s) => { settingsMap[s.key] = s.value; });
      
      if (data.length > 0) {
        localStorage.setItem('site_settings', JSON.stringify(settingsMap));
      }
      
      return settingsMap;
    },
    staleTime: 1000 * 60 * 10,
  });
}

// Backward compatible combined hook
export function useSiteData() {
  const toursQuery = useTours();
  const pagesQuery = usePages();
  const imagesQuery = useSiteImages();
  const socialQuery = useSocialMedia();
  const settingsQuery = useSiteSettings();

  const isLoading = toursQuery.isLoading || pagesQuery.isLoading || imagesQuery.isLoading || socialQuery.isLoading || settingsQuery.isLoading;

  // Handle cached settings fallback
  const cachedSettings = (() => {
    try {
      return JSON.parse(localStorage.getItem('site_settings') || '{}');
    } catch {
      return {};
    }
  })();

  return {
    tours: toursQuery.data || fallbackTours,
    pages: pagesQuery.data || [],
    images: imagesQuery.data?.imagesMap || {},
    gallery: imagesQuery.data?.galleryImages || [],
    socialMedia: socialQuery.data || [],
    siteSettings: settingsQuery.data || cachedSettings,
    isLoading,
  };
}