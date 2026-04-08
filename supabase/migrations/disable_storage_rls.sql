-- Disable RLS on storage completely
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;

-- Also ensure bucket is public
UPDATE storage.buckets SET public = true WHERE id = 'site-images';