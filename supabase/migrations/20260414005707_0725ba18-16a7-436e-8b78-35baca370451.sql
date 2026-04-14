ALTER TABLE public.tours 
ADD COLUMN IF NOT EXISTS use_custom_options boolean NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS custom_options_json jsonb DEFAULT '[]'::jsonb;