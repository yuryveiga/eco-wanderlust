import { supabase } from "@/integrations/supabase/client";

export async function uploadLovableFile(file: File): Promise<string | null> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('site-images')
      .upload(fileName, file);

    if (uploadError) {
      alert(`ERRO DE BUCKET (Storage): Não foi possível salvar a imagem no servidor.\nDetalhe: ${uploadError.message}`);
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('site-images')
      .getPublicUrl(fileName);

    return publicUrl;
  } catch (error) {
    console.error("Upload error:", error);
    // Retorna nulo para barrar inserção se o upload falhar
    return null;
  }
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });
}

export async function fetchLovable<T>(table: string): Promise<T[]> {
  try {
    console.log(`Fetching from ${table}`);
    const { data, error } = await supabase.from(table as any).select('*').order('sort_order');
    if (error) {
      console.error(`Fetch error for ${table}:`, error);
      throw error;
    }
    console.log(`Fetched ${table}:`, data);
    return (data || []) as T[];
  } catch (error: any) {
    console.error(`Error fetching ${table}:`, error);
    alert(`Erro ao carregar ${table}: ` + error?.message);
    return [];
  }
}

export async function insertLovable<T>(table: string, data: any): Promise<T | null> {
  try {
    // Strip id, created_at, updated_at out of the data to avoid Postgres primary key or timestamp errors
    const sanitizedData = { ...data } as any;
    delete sanitizedData.id;
    delete sanitizedData.created_at;
    delete sanitizedData.updated_at;
    
    const { data: result, error } = await supabase
      .from(table as any)
      .insert(sanitizedData)
      .select()
      .single();
      
    if (error) throw error;
    return result as T;
  } catch (error: any) {
    console.error(`Error inserting ${table}:`, error);
    alert(`Erro ao salvar no banco (${table}): \n\n` + JSON.stringify(error));
    return null;
  }
}

export async function updateLovable<T>(table: string, id: string, data: Partial<T>): Promise<boolean> {
  try {
    const sanitizedData = { ...data } as any;
    delete sanitizedData.id;
    delete sanitizedData.created_at;
    delete sanitizedData.updated_at;

    console.log(`Updating ${table}:`, { id, data: sanitizedData });
    
    const { data: result, error } = await supabase
      .from(table as any)
      .update(sanitizedData)
      .eq('id', id)
      .select();
      
    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }
    
    console.log("Update result:", result);
    return true;
  } catch (error: any) {
    console.error(`Error updating ${table}:`, error);
    alert(`Erro ao atualizar no banco (${table}): \n\n` + JSON.stringify(error));
    return false;
  }
}

export async function deleteLovable(table: string, id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from(table as any)
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    return true;
  } catch (error: any) {
    console.error(`Error deleting ${table}:`, error);
    alert(`Erro ao excluir no banco (${table}): \n\n` + JSON.stringify(error));
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
  itinerary_json?: { time: string; description: string }[];
  has_morning?: boolean;
  has_afternoon?: boolean;
  has_night?: boolean;
  allows_private?: boolean;
  allows_open?: boolean;
  included_json?: { icon: string; text: string }[];
  faq_json?: { q: string; a: string }[];
  slug?: string;
  title_en?: string;
  title_es?: string;
  short_description_en?: string;
  short_description_es?: string;
  category_en?: string;
  category_es?: string;
  itinerary_json_en?: { time: string; description: string }[];
  itinerary_json_es?: { time: string; description: string }[];
  included_json_en?: { icon: string; text: string }[];
  included_json_es?: { icon: string; text: string }[];
  faq_json_en?: { q: string; a: string }[];
  faq_json_es?: { q: string; a: string }[];
  images_json?: string[];
  difficulty?: string;
  difficulty_en?: string;
  difficulty_es?: string;
  meeting_point_address?: string;
  meeting_point_address_en?: string;
  meeting_point_address_es?: string;
  youtube_video_url?: string;
};

export type LovablePage = {
  id: string;
  title: string;
  href: string;
  content?: string;
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

export type LovableBlogPost = {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  image_url?: string;
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
  title_en?: string;
  title_es?: string;
  content_en?: string;
  content_es?: string;
  excerpt_en?: string;
  excerpt_es?: string;
};

export type LovableSiteSetting = {
  id: string;
  key: string;
  value: string;
};

export type LovableProfile = {
  id: string;
  email: string;
  role: string;
  created_at: string;
};
