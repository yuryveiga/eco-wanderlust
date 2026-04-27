
-- Add is_archived column
ALTER TABLE public.sales ADD COLUMN IF NOT EXISTS is_archived boolean DEFAULT false;

-- Create function to auto-archive paid sales past their date
CREATE OR REPLACE FUNCTION public.auto_archive_sales()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.sales
  SET is_archived = true
  WHERE is_paid = true
    AND is_archived = false
    AND selected_date IS NOT NULL
    AND selected_date::date < CURRENT_DATE;
END;
$$;
