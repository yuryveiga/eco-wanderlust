
-- Timestamp update function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Tours table
CREATE TABLE public.tours (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  short_description TEXT NOT NULL DEFAULT '',
  price NUMERIC NOT NULL DEFAULT 0,
  duration TEXT NOT NULL DEFAULT '',
  max_group_size INTEGER NOT NULL DEFAULT 10,
  image_url TEXT NOT NULL DEFAULT '',
  is_featured BOOLEAN NOT NULL DEFAULT false,
  category TEXT NOT NULL DEFAULT '',
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.tours ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active tours" ON public.tours FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert tours" ON public.tours FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update tours" ON public.tours FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete tours" ON public.tours FOR DELETE TO authenticated USING (true);

CREATE TRIGGER update_tours_updated_at BEFORE UPDATE ON public.tours FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Pages table
CREATE TABLE public.pages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  href TEXT NOT NULL,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view pages" ON public.pages FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert pages" ON public.pages FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update pages" ON public.pages FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete pages" ON public.pages FOR DELETE TO authenticated USING (true);

CREATE TRIGGER update_pages_updated_at BEFORE UPDATE ON public.pages FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Site images table
CREATE TABLE public.site_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  image_url TEXT NOT NULL DEFAULT '',
  label TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.site_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view site images" ON public.site_images FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert site images" ON public.site_images FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update site images" ON public.site_images FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete site images" ON public.site_images FOR DELETE TO authenticated USING (true);

CREATE TRIGGER update_site_images_updated_at BEFORE UPDATE ON public.site_images FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Social media table
CREATE TABLE public.social_media (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  platform TEXT NOT NULL,
  url TEXT NOT NULL DEFAULT '',
  icon_name TEXT NOT NULL DEFAULT '',
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.social_media ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view social media" ON public.social_media FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert social media" ON public.social_media FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update social media" ON public.social_media FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete social media" ON public.social_media FOR DELETE TO authenticated USING (true);

CREATE TRIGGER update_social_media_updated_at BEFORE UPDATE ON public.social_media FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Storage bucket for site images
INSERT INTO storage.buckets (id, name, public) VALUES ('site-images', 'site-images', true);

CREATE POLICY "Anyone can view site images storage" ON storage.objects FOR SELECT USING (bucket_id = 'site-images');
CREATE POLICY "Authenticated users can upload site images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'site-images');
CREATE POLICY "Authenticated users can update site images" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'site-images');
CREATE POLICY "Authenticated users can delete site images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'site-images');
