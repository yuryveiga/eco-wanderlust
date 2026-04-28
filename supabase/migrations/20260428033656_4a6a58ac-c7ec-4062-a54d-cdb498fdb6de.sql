ALTER TABLE public.matches 
  ADD COLUMN IF NOT EXISTS custom_options_json jsonb,
  ADD COLUMN IF NOT EXISTS price_premium numeric;