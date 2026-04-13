-- Migration: Add dynamic pricing and available days to tours
ALTER TABLE public.tours 
ADD COLUMN IF NOT EXISTS pricing_model TEXT DEFAULT 'fixed',
ADD COLUMN IF NOT EXISTS price_1_person NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS price_2_people NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS price_3_6_people NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS price_7_19_people NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS available_days JSONB DEFAULT '[]';

-- Update existing allows_open to false as requested to deactivate it
UPDATE public.tours SET allows_open = false;

-- Add comment explaining the pricing model
COMMENT ON COLUMN public.tours.pricing_model IS 'Model for pricing: "fixed" uses the price column, "dynamic" uses the tiered price columns.';
