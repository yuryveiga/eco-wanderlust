-- ATUALIZAÇÃO DO BANCO DE DADOS (SUPABASE)
-- Execute este script na aba SQL Editor do seu Supabase Dashboard

-- 1. Suporte a Conteúdo nas Páginas (ReactQuill HTML)
ALTER TABLE public.pages ADD COLUMN IF NOT EXISTS content TEXT;

-- 2. Suporte a Itinerários nos Passeios (JSON Array)
ALTER TABLE public.tours ADD COLUMN IF NOT EXISTS itinerary_json JSONB;

-- 3. Nova Tabela: Configurações do Site (Estilo Hero, etc)
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Admins can modify settings" ON public.site_settings USING (public.has_role(auth.uid(), 'admin'));

-- Inserir estilo padrão para que não fique vazio
INSERT INTO public.site_settings (key, value) VALUES ('hero_style', 'style1') ON CONFLICT (key) DO NOTHING;

-- 4. Nova Tabela: Blog Posts
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  image_url TEXT,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view published posts" ON public.blog_posts FOR SELECT USING (is_published = true);
CREATE POLICY "Admins can modify blog" ON public.blog_posts USING (public.has_role(auth.uid(), 'admin'));
