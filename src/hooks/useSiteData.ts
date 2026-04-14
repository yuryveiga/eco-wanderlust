import { useQuery } from "@tanstack/react-query";
import { fetchLovable, LovableTour, LovablePage, LovableSiteImage, LovableSocialMedia, LovableSiteSetting } from "@/integrations/lovable/client";

const fallbackTours: LovableTour[] = [
  { id: "1", title: "City Tour Rio Completo", short_description: "Conheça os pontos turísticos mais icônicos do Rio de Janeiro.", price: 250, duration: "8 horas", max_group_size: 15, image_url: "https://images.unsplash.com/photo-1619546952812-520e98064a52?q=80&w=1200", is_featured: true, category: "City Tour", is_active: true, sort_order: 1 },
  { id: "2", title: "Arraial do Cabo", short_description: "Descubra o Caribe Brasileiro com águas cristalinas.", price: 180, duration: "12 horas", max_group_size: 20, image_url: "https://images.unsplash.com/photo-1516834611397-8d633eaec5c0?q=80&w=1200", is_featured: true, category: "Praia", is_active: true, sort_order: 2 },
  { id: "3", title: "Angra dos Reis", short_description: "Navegue pelas ilhas paradisíacas de Angra dos Reis.", price: 200, duration: "10 horas", max_group_size: 25, image_url: "https://images.unsplash.com/photo-1544989164-31dc3c645987?q=80&w=1200", is_featured: true, category: "Barco", is_active: true, sort_order: 3 },
];

const TOUR_LISTING_COLUMNS = "id,title,short_description,price,duration,max_group_size,image_url,is_featured,category,is_active,sort_order,slug,pricing_model,price_1_person,price_2_people,price_3_6_people,price_7_19_people,use_custom_options,custom_options_json,external_url,title_en,title_es,short_description_en,short_description_es,category_en,category_es";

export function useSiteData() {
  const { data, isLoading } = useQuery({
    queryKey: ["siteData"],
    queryFn: async () => {
      const [toursData, pagesData, imagesData, socialData, settingsData] = await Promise.all([
        fetchLovable<LovableTour>("tours", TOUR_LISTING_COLUMNS),
        fetchLovable<LovablePage>("pages"),
        fetchLovable<LovableSiteImage>("site_images"),
        fetchLovable<LovableSocialMedia>("social_media"),
        fetchLovable<LovableSiteSetting>("site_settings"),
      ]);

      const activeTours = toursData.filter((t) => t.is_active).sort((a, b) => a.sort_order - b.sort_order);
      
      const imagesMap: Record<string, string> = {};
      imagesData.forEach((img) => { imagesMap[img.key] = img.image_url; });
      
      const settingsMap: Record<string, string> = {};
      settingsData.forEach((s) => { settingsMap[s.key] = s.value; });

      if (settingsData.length > 0) {
        localStorage.setItem('site_settings', JSON.stringify(settingsMap));
      }

      return {
        tours: activeTours.length > 0 ? activeTours : fallbackTours,
        pages: pagesData.filter((p) => p.is_visible).sort((a, b) => a.sort_order - b.sort_order),
        images: imagesMap,
        socialMedia: socialData.filter((s) => s.is_active).sort((a, b) => a.sort_order - b.sort_order),
        siteSettings: settingsMap,
      };
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  // Handle cached settings fallback
  const cachedSettings = (() => {
    try {
      return JSON.parse(localStorage.getItem('site_settings') || '{}');
    } catch {
      return {};
    }
  })();

  return {
    tours: data?.tours || fallbackTours,
    pages: data?.pages || [],
    images: data?.images || {},
    socialMedia: data?.socialMedia || [],
    siteSettings: data?.siteSettings || cachedSettings,
    isLoading,
  };
}