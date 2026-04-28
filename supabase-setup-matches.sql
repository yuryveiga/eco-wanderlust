-- 1. CLIQUE NO SQL EDITOR DO SEU SUPABASE
-- 2. COLE O CÓDIGO ABAIXO E CLIQUE EM "RUN" (EXECUTAR)

-- Criar a tabela de jogos (matches)
CREATE TABLE IF NOT EXISTS public.matches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  home_team TEXT NOT NULL,
  away_team TEXT NOT NULL,
  match_date TIMESTAMP WITH TIME ZONE NOT NULL,
  competition TEXT NOT NULL DEFAULT 'Campeonato Carioca',
  venue TEXT NOT NULL DEFAULT 'Maracanã',
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  home_team_logo TEXT,
  away_team_logo TEXT,
  available_spots INTEGER NOT NULL DEFAULT 20,
  sold_count INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'sold_out', 'cancelled', 'completed')),
  includes_transfer BOOLEAN NOT NULL DEFAULT true,
  includes_ticket BOOLEAN NOT NULL DEFAULT true,
  includes_guide BOOLEAN NOT NULL DEFAULT true,
  description_pt TEXT,
  description_en TEXT,
  high_demand BOOLEAN DEFAULT false,
  slug TEXT UNIQUE,
  stadium TEXT DEFAULT 'Maracanã',
  custom_options_json JSONB,
  included_json JSONB,
  not_included_json JSONB,
  bring_json JSONB,
  dont_bring_json JSONB,
  attention_json JSONB,
  not_suitable_json JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar Segurança (RLS)
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

-- Permitir que qualquer pessoa veja os jogos
CREATE POLICY "Matches are publicly readable" ON public.matches
  FOR SELECT USING (true);

-- Criar trigger para atualizar o timestamp automaticamente
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Deletar trigger se já existir para evitar erro
DROP TRIGGER IF EXISTS update_matches_updated_at ON public.matches;

CREATE TRIGGER update_matches_updated_at
  BEFORE UPDATE ON public.matches
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Notificar o sistema sobre a nova tabela
NOTIFY pgrst, 'reload schema';
