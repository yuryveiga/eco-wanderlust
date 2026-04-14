-- Adicionar coluna para armazenar dados dos passageiros (Nome e Nascimento)
ALTER TABLE public.sales ADD COLUMN IF NOT EXISTS passengers_json JSONB DEFAULT '[]'::jsonb;

-- Comentário para documentação
COMMENT ON COLUMN public.sales.passengers_json IS 'Lista de passageiros [{name: string, dob: string}]';
