-- Add extra columns to tours table as seen in database_updates.sql
ALTER TABLE public.tours ADD COLUMN IF NOT EXISTS has_morning BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE public.tours ADD COLUMN IF NOT EXISTS has_afternoon BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE public.tours ADD COLUMN IF NOT EXISTS has_night BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE public.tours ADD COLUMN IF NOT EXISTS allows_private BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE public.tours ADD COLUMN IF NOT EXISTS allows_open BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE public.tours ADD COLUMN IF NOT EXISTS included_json JSONB;
ALTER TABLE public.tours ADD COLUMN IF NOT EXISTS faq_json JSONB;
ALTER TABLE public.tours ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;
ALTER TABLE public.tours ADD COLUMN IF NOT EXISTS itinerary_json JSONB;
ALTER TABLE public.tours ADD COLUMN IF NOT EXISTS pricing_model TEXT DEFAULT 'fixed';
ALTER TABLE public.tours ADD COLUMN IF NOT EXISTS price_1_person NUMERIC;
ALTER TABLE public.tours ADD COLUMN IF NOT EXISTS price_2_people NUMERIC;
ALTER TABLE public.tours ADD COLUMN IF NOT EXISTS price_3_6_people NUMERIC;
ALTER TABLE public.tours ADD COLUMN IF NOT EXISTS price_7_19_people NUMERIC;
ALTER TABLE public.tours ADD COLUMN IF NOT EXISTS use_custom_options BOOLEAN DEFAULT false;
ALTER TABLE public.tours ADD COLUMN IF NOT EXISTS custom_options_json JSONB DEFAULT '[]';
ALTER TABLE public.tours ADD COLUMN IF NOT EXISTS external_url TEXT;

-- Also add translation columns to tours
ALTER TABLE public.tours ADD COLUMN IF NOT EXISTS title_en TEXT;
ALTER TABLE public.tours ADD COLUMN IF NOT EXISTS title_es TEXT;
ALTER TABLE public.tours ADD COLUMN IF NOT EXISTS short_description_en TEXT;
ALTER TABLE public.tours ADD COLUMN IF NOT EXISTS short_description_es TEXT;
ALTER TABLE public.tours ADD COLUMN IF NOT EXISTS category_en TEXT;
ALTER TABLE public.tours ADD COLUMN IF NOT EXISTS category_es TEXT;

-- Also add translation columns to pages
ALTER TABLE public.pages ADD COLUMN IF NOT EXISTS title_en TEXT;
ALTER TABLE public.pages ADD COLUMN IF NOT EXISTS title_es TEXT;
ALTER TABLE public.pages ADD COLUMN IF NOT EXISTS content TEXT;
ALTER TABLE public.pages ADD COLUMN IF NOT EXISTS content_en TEXT;
ALTER TABLE public.pages ADD COLUMN IF NOT EXISTS content_es TEXT;

-- Create profiles table (admin users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'user', -- 'admin' ou 'user'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
