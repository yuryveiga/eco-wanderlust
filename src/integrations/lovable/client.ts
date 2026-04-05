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

export async function insertLovable<T>(table: string, data: T): Promise<T | null> {
  try {
    const response = await fetch(`${LOVABLE_API}/${table}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(`Error inserting ${table}:`, error);
    return null;
  }
}

export async function updateLovable<T>(table: string, id: string, data: Partial<T>): Promise<boolean> {
  try {
    const response = await fetch(`${LOVABLE_API}/${table}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return response.ok;
  } catch (error) {
    console.error(`Error updating ${table}:`, error);
    return false;
  }
}

export async function deleteLovable(table: string, id: string): Promise<boolean> {
  try {
    const response = await fetch(`${LOVABLE_API}/${table}/${id}`, {
      method: "DELETE",
    });
    return response.ok;
  } catch (error) {
    console.error(`Error deleting ${table}:`, error);
    return false;
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
