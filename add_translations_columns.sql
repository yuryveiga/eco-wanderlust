-- Adding translation columns to tours
ALTER TABLE public.tours 
ADD COLUMN IF NOT EXISTS title_en text,
ADD COLUMN IF NOT EXISTS title_es text,
ADD COLUMN IF NOT EXISTS short_description_en text,
ADD COLUMN IF NOT EXISTS short_description_es text,
ADD COLUMN IF NOT EXISTS category_en text,
ADD COLUMN IF NOT EXISTS category_es text,
ADD COLUMN IF NOT EXISTS itinerary_json_en jsonb,
ADD COLUMN IF NOT EXISTS itinerary_json_es jsonb,
ADD COLUMN IF NOT EXISTS included_json_en jsonb,
ADD COLUMN IF NOT EXISTS included_json_es jsonb,
ADD COLUMN IF NOT EXISTS faq_json_en jsonb,
ADD COLUMN IF NOT EXISTS faq_json_es jsonb,
ADD COLUMN IF NOT EXISTS images_json jsonb; -- For the premium grid (multiple images)

-- Adding translation columns to blog_posts
ALTER TABLE public.blog_posts
ADD COLUMN IF NOT EXISTS title_en text,
ADD COLUMN IF NOT EXISTS title_es text,
ADD COLUMN IF NOT EXISTS content_en text,
ADD COLUMN IF NOT EXISTS content_es text,
ADD COLUMN IF NOT EXISTS excerpt_en text,
ADD COLUMN IF NOT EXISTS excerpt_es text;
