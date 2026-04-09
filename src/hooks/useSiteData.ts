import { useState, useEffect } from "react";
import { fetchLovable, LovableTour, LovablePage, LovableSiteImage, LovableSocialMedia, LovableSiteSetting } from "@/integrations/lovable/client";

const fallbackTours = [
  { id: "1", title: "City Tour Rio Completo", short_description: "Conheça os pontos turísticos mais icônicos do Rio de Janeiro.", price: 250, duration: "8 horas", max_group_size: 15, image_url: "https://images.unsplash.com/photo-1619546952812-520e98064a52?q=80&w=1200", is_featured: true, category: "City Tour", is_active: true, sort_order: 1 },
  { id: "2", title: "Arraial do Cabo", short_description: "Descubra o Caribe Brasileiro com águas cristalinas.", price: 180, duration: "12 horas", max_group_size: 20, image_url: "https://images.unsplash.com/photo-1516834611397-8d633eaec5c0?q=80&w=1200", is_featured: true, category: "Praia", is_active: true, sort_order: 2 },
  { id: "3", title: "Angra dos Reis", short_description: "Navegue pelas ilhas paradisíacas de Angra dos Reis.", price: 200, duration: "10 horas", max_group_size: 25, image_url: "https://images.unsplash.com/photo-1544989164-31dc3c645987?q=80&w=1200", is_featured: true, category: "Barco", is_active: true, sort_order: 3 },
];

export function useSiteData() {
  const [tours, setTours] = useState<LovableTour[]>([]);
  const [pages, setPages] = useState<LovablePage[]>([]);
  const [images, setImages] = useState<Record<string, string>>({});
  const [socialMedia, setSocialMedia] = useState<LovableSocialMedia[]>([]);
  const [siteSettings, setSiteSettings] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [toursData, pagesData, imagesData, socialData, settingsData] = await Promise.all([
          fetchLovable<LovableTour>("tours"),
          fetchLovable<LovablePage>("pages"),
          fetchLovable<LovableSiteImage>("site_images"),
          fetchLovable<LovableSocialMedia>("social_media"),
          fetchLovable<LovableSiteSetting>("site_settings"),
        ]);

        const activeTours = toursData.filter((t) => t.is_active).sort((a, b) => a.sort_order - b.sort_order);
        setTours(activeTours.length > 0 ? activeTours : fallbackTours);
        setPages(pagesData.filter((p) => p.is_visible).sort((a, b) => a.sort_order - b.sort_order));
        
        const imagesMap: Record<string, string> = {};
        imagesData.forEach((img) => { imagesMap[img.key] = img.image_url; });
        setImages(imagesMap);
        
        const settingsMap: Record<string, string> = {};
        settingsData.forEach((s) => { settingsMap[s.key] = s.value; });
        
        console.log("site_title from DB:", settingsData.find(s => s.key === 'site_title'));
        
        // Only update localStorage if we got actual data from the database
        if (settingsData.length > 0) {
          setSiteSettings(settingsMap);
          localStorage.setItem('site_settings', JSON.stringify(settingsMap));
        } else {
          // Try to load from localStorage as fallback
          try {
            const cached = JSON.parse(localStorage.getItem('site_settings') || '{}');
            setSiteSettings(cached);
          } catch {
            setSiteSettings({});
          }
        }
        
        setSocialMedia(socialData.filter((s) => s.is_active).sort((a, b) => a.sort_order - b.sort_order));
      } catch (error) {
        console.error("Error loading site data:", error);
        // Load from localStorage as fallback
        try {
          const cached = JSON.parse(localStorage.getItem('site_settings') || '{}');
          setSiteSettings(cached);
          setTours(fallbackTours);
        } catch {
          setSiteSettings({});
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  return {
    tours,
    pages,
    images,
    socialMedia,
    siteSettings,
    isLoading,
  };
}