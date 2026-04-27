-- =============================================
-- CRIAR TABELAS NO SUPABASE
-- =============================================

-- Tabela de Passeios
CREATE TABLE IF NOT EXISTS tours (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  short_description TEXT,
  price NUMERIC DEFAULT 0,
  duration TEXT,
  max_group_size INTEGER DEFAULT 10,
  image_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  category TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Páginas/Menu
CREATE TABLE IF NOT EXISTS pages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  href TEXT NOT NULL,
  is_visible BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Imagens do Site
CREATE TABLE IF NOT EXISTS site_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  image_url TEXT,
  label TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Redes Sociais
CREATE TABLE IF NOT EXISTS social_media (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  platform TEXT NOT NULL,
  url TEXT NOT NULL,
  icon_name TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Configurações do Site
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- INSERIR DADOS DE EXEMPLO
-- =============================================

-- Inserir Passeios
INSERT INTO tours (title, short_description, price, duration, max_group_size, image_url, is_featured, category, is_active, sort_order)
VALUES
  ('City Tour Rio Completo', 'Conheça os pontos turísticos mais icônicos do Rio de Janeiro: Cristo Redentor, Pão de Açúcar, Escadaria Selarón e muito mais!', 250, '8 horas', 15, '/placeholder.svg', true, 'City Tour', true, 1),
  ('Arraial do Cabo', 'Descubra o Caribe Brasileiro com águas cristalinas, areia branca e passeios de barco inesquecíveis.', 180, '12 horas', 20, 'https://images.unsplash.com/photo-1516834611397-8d633eaec5c0?q=80&w=1200', true, 'Praia', true, 2),
  ('Angra dos Reis', 'Navegue pelas ilhas paradisíacas de Angra dos Reis. Praias escondidas e águas cristalinas.', 200, '10 horas', 25, '/placeholder.svg', true, 'Barco', true, 3),
  ('Búzios Day Trip', 'Explore a charmosa vila de pescadores que encantou Brigitte Bardot. Praias lindas e Rua das Pedras.', 220, '12 horas', 15, 'https://images.unsplash.com/photo-1589146010751-48820f47360a?q=80&w=1200', true, 'Praia', true, 4),
  ('Niterói e Museums', 'Visite o MAC, o Mosquito Museum e conheça a incrível vista do Rio com漿 oelas da outra margem.', 180, '6 horas', 15, '/placeholder.svg', false, 'Cultura', true, 5),
  ('Pedra Bonita e beaches', 'Trilha na Pedra Bonita com vista panorâmica e depois relax nas melhores praias da zona oeste.', 150, '8 horas', 12, 'https://images.unsplash.com/photo-1552799446-159ba9523315?q=80&w=1200', false, 'Trilha', true, 6)
ON CONFLICT DO NOTHING;

-- Inserir Páginas do Menu
INSERT INTO pages (title, href, is_visible, sort_order)
VALUES
  ('Inicio', '/', true, 1),
  ('Passeios', '/#tours', true, 2),
  ('Galeria', '/#gallery', true, 3),
  ('Contato', '/#contact', true, 4)
ON CONFLICT DO NOTHING;

-- Inserir Imagens do Site
INSERT INTO site_images (key, image_url, label)
VALUES
  ('logo', '', 'Logo do Site'),
  ('hero_bg', '/placeholder.svg', 'Fundo do Hero'),
  ('gallery_1', '/placeholder.svg', 'Galeria 1'),
  ('gallery_2', 'https://images.unsplash.com/photo-1516834611397-8d633eaec5c0?q=80&w=600', 'Galeria 2'),
  ('gallery_3', '/placeholder.svg', 'Galeria 3'),
  ('gallery_4', 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?q=80&w=600', 'Galeria 4'),
  ('gallery_5', 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600', 'Galeria 5'),
  ('gallery_6', '/placeholder.svg', 'Galeria 6')
ON CONFLICT (key) DO NOTHING;

-- Inserir Redes Sociais
INSERT INTO social_media (platform, url, icon_name, is_active, sort_order)
VALUES
  ('instagram', 'https://www.instagram.com/tocorimerio/', 'Instagram', true, 1),
  ('whatsapp', 'https://wa.me/5521999999999', 'Phone', true, 2)
ON CONFLICT DO NOTHING;

-- =============================================
-- CONFIGURAR RLS (Segurança)
-- =============================================

ALTER TABLE tours ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read tours" ON tours FOR SELECT USING (is_active = true);

ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read pages" ON pages FOR SELECT USING (is_visible = true);

ALTER TABLE site_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read images" ON site_images FOR SELECT USING (true);

ALTER TABLE social_media ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read social" ON social_media FOR SELECT USING (is_active = true);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Authenticated can manage settings" ON site_settings FOR ALL TO authenticated USING (true);

-- Inserir configuração padrão do hero
INSERT INTO site_settings (key, value) VALUES ('hero_style', 'style1') ON CONFLICT (key) DO NOTHING;
