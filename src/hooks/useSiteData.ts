import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useSiteData() {
  const tours = useQuery({
    queryKey: ["site-tours"],
    queryFn: async () => {
      const { data } = await supabase
        .from("tours")
        .select("*")
        .eq("is_active", true)
        .order("sort_order");
      return data ?? [];
    },
  });

  const pages = useQuery({
    queryKey: ["site-pages"],
    queryFn: async () => {
      const { data } = await supabase
        .from("pages")
        .select("*")
        .eq("is_visible", true)
        .order("sort_order");
      return data ?? [];
    },
  });

  const images = useQuery({
    queryKey: ["site-images"],
    queryFn: async () => {
      const { data } = await supabase.from("site_images").select("*");
      const map: Record<string, string> = {};
      data?.forEach((img) => { map[img.key] = img.image_url; });
      return map;
    },
  });

  const socialMedia = useQuery({
    queryKey: ["site-social"],
    queryFn: async () => {
      const { data } = await supabase
        .from("social_media")
        .select("*")
        .eq("is_active", true)
        .order("sort_order");
      return data ?? [];
    },
  });

  return {
    tours: tours.data ?? [],
    pages: pages.data ?? [],
    images: images.data ?? {},
    socialMedia: socialMedia.data ?? [],
    isLoading: tours.isLoading || pages.isLoading || images.isLoading || socialMedia.isLoading,
  };
}
