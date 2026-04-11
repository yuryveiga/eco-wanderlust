import { supabase } from "@/integrations/supabase/client";

export async function uploadLovableFile(file: File): Promise<string | null> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('site-images')
      .upload(fileName, file);

    if (uploadError) {
      alert(`ERRO DE BUCKET (Storage): ${uploadError.message}`);
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('site-images')
      .getPublicUrl(fileName);

    return publicUrl;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro desconhecido';
    alert(`ERRO DE BUCKET: ${message}`);
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let query = supabase.from(table as any).select('*');
    
    if (table === 'tours' || table === 'pages' || table === 'social_media') {
      query = query.order('sort_order');
    }
    
    const { data, error } = await query;
    if (error) {
      throw error;
    }
    return (data || []) as T[];
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro desconhecido';
    alert(`Erro ao carregar ${table}: ` + message);
    return [];
  }
}

export async function insertLovable<T>(table: string, data: Partial<T>): Promise<T | null> {
  try {
    const sanitizedData = { ...data } as Record<string, unknown>;
    delete sanitizedData.id;
    delete sanitizedData.created_at;
    delete sanitizedData.updated_at;
    
    const { data: result, error } = await supabase
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .from(table as any)
      .insert(sanitizedData)
      .select()
      .single();
      
    if (error) throw error;
    return result as T;
  } catch (error: unknown) {
    alert(`Erro ao salvar no banco (${table}): \n\n` + JSON.stringify(error));
    return null;
  }
}

export async function updateLovable<T>(table: string, id: string, data: Partial<T>): Promise<boolean> {
  try {
    const sanitizedData = { ...data } as Record<string, unknown>;
    delete sanitizedData.id;
    delete sanitizedData.created_at;
    delete sanitizedData.updated_at;

    const { error } = await supabase
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .from(table as any)
      .update(sanitizedData)
      .eq('id', id)
      .select();
      
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error: unknown) {
    alert(`Erro ao atualizar no banco (${table}): \n\n` + JSON.stringify(error));
    return false;
  }
}

export async function deleteLovable(table: string, id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .from(table as any)
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    return true;
  } catch (error: unknown) {
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
  highlights_json?: { icon: string; text: string }[];
  highlights_json_en?: { icon: string; text: string }[];
  highlights_json_es?: { icon: string; text: string }[];
  meeting_point_address?: string;
  meeting_point_address_en?: string;
  meeting_point_address_es?: string;
  youtube_video_url?: string;
  external_url?: string;
  carousel_images_json?: string[];
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
  show_in_header?: boolean;
};

export type LovableSale = {
  id: string;
  tour_id: string;
  tour_title: string;
  tour_slug: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  quantity: number;
  total_price: number;
  selected_date: string;
  selected_period: string;
  is_private: boolean;
  is_paid: boolean;
  created_at: string;
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
