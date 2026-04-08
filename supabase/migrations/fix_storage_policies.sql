-- Fix storage policies to allow authenticated users to upload images

-- Drop restrictive policies
DROP POLICY IF EXISTS "Admins can upload site images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update site images storage" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete site images storage" ON storage.objects;

-- Allow authenticated users to manage site-images bucket
CREATE POLICY "Authenticated can upload site-images" ON storage.objects 
FOR INSERT TO authenticated WITH CHECK (bucket_id = 'site-images');

CREATE POLICY "Authenticated can update site-images" ON storage.objects 
FOR UPDATE TO authenticated USING (bucket_id = 'site-images');

CREATE POLICY "Authenticated can delete site-images" ON storage.objects 
FOR DELETE TO authenticated USING (bucket_id = 'site-images');

CREATE POLICY "Anyone can view site-images" ON storage.objects 
FOR SELECT USING (bucket_id = 'site-images');