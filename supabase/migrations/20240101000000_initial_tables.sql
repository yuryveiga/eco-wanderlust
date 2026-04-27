-- Initial creation of sales table to support later migrations
CREATE TABLE IF NOT EXISTS public.sales (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tour_id UUID,
  tour_title TEXT,
  tour_slug TEXT,
  customer_name TEXT,
  customer_email TEXT,
  customer_phone TEXT,
  quantity INTEGER DEFAULT 1,
  total_price NUMERIC DEFAULT 0,
  selected_date TEXT,
  selected_period TEXT,
  is_private BOOLEAN DEFAULT false,
  is_paid BOOLEAN DEFAULT false,
  is_archived BOOLEAN DEFAULT false,
  is_cancelled BOOLEAN DEFAULT false,
  currency TEXT DEFAULT 'BRL',
  provider TEXT DEFAULT 'tour',
  payment_intent_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blog posts table
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  title_en TEXT,
  title_es TEXT,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  content_en TEXT,
  content_es TEXT,
  image_url TEXT,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  author_name TEXT NOT NULL,
  author_location TEXT,
  rating INTEGER DEFAULT 5,
  title TEXT,
  title_en TEXT,
  title_es TEXT,
  content TEXT NOT NULL,
  content_en TEXT,
  content_es TEXT,
  tour_name TEXT,
  review_date DATE DEFAULT CURRENT_DATE,
  is_published BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
