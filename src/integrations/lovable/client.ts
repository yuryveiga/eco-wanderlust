const LOVABLE_API = "https://nature-gateway-global.lovable.app/api/database";

export async function fetchLovable<T>(table: string): Promise<T[]> {
  try {
    const response = await fetch(`${LOVABLE_API}/${table}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${table}:`, error);
    return [];
  }
}

export type LovableTour = {
  id: string;
  title: string;
  short_description: string;
  price: number;
  duration: string;
  max_group_size: number;
  image_url: string;
  is_featured: boolean;
  category: string;
  is_active: boolean;
  sort_order: number;
};

export type LovablePage = {
  id: string;
  title: string;
  href: string;
  is_visible: boolean;
  sort_order: number;
};

export type LovableSiteImage = {
  id: string;
  key: string;
  image_url: string;
  label: string;
};

export type LovableSocialMedia = {
  id: string;
  platform: string;
  url: string;
  icon_name: string;
  is_active: boolean;
  sort_order: number;
};
