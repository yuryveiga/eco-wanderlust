-- Fix: Allow all authenticated users to manage tours, pages, images, social media
-- This is needed because the app uses anon key which is authenticated but not admin

-- Fix tours policies
DROP POLICY IF EXISTS "Admins can insert tours" ON public.tours;
DROP POLICY IF EXISTS "Admins can update tours" ON public.tours;
DROP POLICY IF EXISTS "Admins can delete tours" ON public.tours;

CREATE POLICY "Authenticated can insert tours" ON public.tours FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can update tours" ON public.tours FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated can delete tours" ON public.tours FOR DELETE TO authenticated USING (true);

-- Fix pages policies
DROP POLICY IF EXISTS "Admins can insert pages" ON public.pages;
DROP POLICY IF EXISTS "Admins can update pages" ON public.pages;
DROP POLICY IF EXISTS "Admins can delete pages" ON public.pages;

CREATE POLICY "Authenticated can insert pages" ON public.pages FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can update pages" ON public.pages FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated can delete pages" ON public.pages FOR DELETE TO authenticated USING (true);

-- Fix site_images policies
DROP POLICY IF EXISTS "Admins can insert site images" ON public.site_images;
DROP POLICY IF EXISTS "Admins can update site images" ON public.site_images;
DROP POLICY IF EXISTS "Admins can delete site images" ON public.site_images;

CREATE POLICY "Authenticated can insert site_images" ON public.site_images FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can update site_images" ON public.site_images FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated can delete site_images" ON public.site_images FOR DELETE TO authenticated USING (true);

-- Fix social_media policies
DROP POLICY IF EXISTS "Admins can insert social media" ON public.social_media;
DROP POLICY IF EXISTS "Admins can update social media" ON public.social_media;
DROP POLICY IF EXISTS "Admins can delete social media" ON public.social_media;

CREATE POLICY "Authenticated can insert social_media" ON public.social_media FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can update social_media" ON public.social_media FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated can delete social_media" ON public.social_media FOR DELETE TO authenticated USING (true);

-- Fix site_settings policies
DROP POLICY IF EXISTS "Authenticated can manage settings" ON public.site_settings;

CREATE POLICY "Authenticated can manage site_settings" ON public.site_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);