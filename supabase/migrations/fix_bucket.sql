-- Check and fix storage bucket and policies

-- 1. Check if bucket exists, if not create it
INSERT INTO storage.buckets (id, name, public)
VALUES ('site-images', 'site-images', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Apply RLS policies for site-images bucket
DROP POLICY IF EXISTS "Anyone can view site-images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can upload site-images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can update site-images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can delete site-images" ON storage.objects;

CREATE POLICY "Anyone can view site-images" ON storage.objects 
FOR SELECT USING (bucket_id = 'site-images');

CREATE POLICY "Authenticated can upload site-images" ON storage.objects 
FOR INSERT TO authenticated WITH CHECK (bucket_id = 'site-images');

CREATE POLICY "Authenticated can update site-images" ON storage.objects 
FOR UPDATE TO authenticated USING (bucket_id = 'site-images');

CREATE POLICY "Authenticated can delete site-images" ON storage.objects 
FOR DELETE TO authenticated USING (bucket_id = 'site-images');