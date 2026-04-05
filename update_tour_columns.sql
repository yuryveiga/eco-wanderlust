-- Script to update tours table with new functional and translation columns
ALTER TABLE public.tours 
ADD COLUMN IF NOT EXISTS difficulty text,
ADD COLUMN IF NOT EXISTS difficulty_en text,
ADD COLUMN IF NOT EXISTS difficulty_es text,
ADD COLUMN IF NOT EXISTS meeting_point_address text,
ADD COLUMN IF NOT EXISTS meeting_point_address_en text,
ADD COLUMN IF NOT EXISTS meeting_point_address_es text,
ADD COLUMN IF NOT EXISTS youtube_video_url text;

-- Add helpful comments to the columns
COMMENT ON COLUMN public.tours.difficulty IS 'Nível de dificuldade do passeio (ex: Leve, Moderado, Difícil)';
COMMENT ON COLUMN public.tours.meeting_point_address IS 'Endereço textual do ponto de encontro para o mapa do Google';
COMMENT ON COLUMN public.tours.youtube_video_url IS 'Link completo para um vídeo do YouTube do passeio';
