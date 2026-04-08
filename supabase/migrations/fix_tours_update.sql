-- Fix: Allow authenticated users to update tours
DROP POLICY IF EXISTS "Admins can update tours" ON public.tours;

CREATE POLICY "Admins or authenticated can update tours" ON public.tours 
FOR UPDATE TO authenticated 
USING (true)
WITH CHECK (true);