-- Try granting anonymous access to storage
-- This should work if you have sufficient permissions

-- First try to allow public access
GRANT ALL ON storage.objects TO anon;
GRANT ALL ON storage.objects TO authenticated;
GRANT ALL ON storage.buckets TO anon;
GRANT ALL ON storage.buckets TO authenticated;

-- If the above doesn't work, try creating permissive policies
-- that work for all cases
DROP POLICY IF EXISTS "Allow all uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow all reads" ON storage.objects;
DROP POLICY IF EXISTS "Allow all deletes" ON storage.objects;

CREATE POLICY "Allow all uploads" ON storage.objects 
FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow all reads" ON storage.objects 
FOR SELECT TO anon USING (true);

CREATE POLICY "Allow all updates" ON storage.objects 
FOR UPDATE TO anon USING (true);

CREATE POLICY "Allow all deletes" ON storage.objects 
FOR DELETE TO anon USING (true);