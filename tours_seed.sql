-- Inserting 6 diverse tours in Rio de Janeiro
INSERT INTO public.tours (
    title, slug, short_description, price, duration, max_group_size, 
    image_url, is_featured, category, allows_open, allows_private, 
    has_morning, has_afternoon, has_night,
    itinerary_json, included_json
)
VALUES 
(
    'Trilha da Pedra do Telégrafo', 'trilha-pedra-do-telegrafo', 
    'A foto mais famosa do Rio! Uma caminhada moderada com vistas de tirar o fôlego das praias selvagens.', 
    180.00, '5h', 12, 
    '/maracana-hero.jpg', true, 'Aventura', true, true, 
    true, false, false,
    '[{"time": "06:00", "description": "Pick-up nos hotéis"}, {"time": "08:00", "description": "Início da trilha em Barra de Guaratiba"}, {"time": "09:30", "description": "Chegada à Pedra e tempo para fotos"}, {"time": "11:00", "description": "Descida e almoço livre"}]',
    '[{"icon": "MapPin", "text": "Guia Bilíngue"}, {"icon": "Shield", "text": "Seguro Aventura"}]'
),
(
    'Arraial do Cabo: O Caribe Brasileiro', 'arraial-do-cabo-caribe', 
    'Um paraíso de águas cristalinas e areia branca. Passeio de escuna visitando as melhores praias da região.', 
    250.00, '12h', 40, 
    'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?q=80&w=1200', true, 'Marítimo', true, false, 
    true, false, false,
    '[{"time": "07:00", "description": "Saída do Rio de Janeiro"}, {"time": "10:30", "description": "Embarque na escuna em Arraial"}, {"time": "13:00", "description": "Almoço incluído na cidade"}, {"time": "16:00", "description": "Retorno ao Rio"}]',
    '[{"icon": "Utensils", "text": "Almoço Incluso"}, {"icon": "Activity", "text": "Passeio de Escuna"}]'
),
(
    'Petrópolis: A Cidade Imperial', 'petropolis-cidade-imperial', 
    'Viaje no tempo e conheça a história do Brasil Império no Museu Imperial e no Palácio de Cristal.', 
    220.00, '8h', 15, 
    'https://images.unsplash.com/photo-1582236371421-25ae90e4f9b8?q=80&w=1200', false, 'Histórico', true, true, 
    true, false, false,
    '[{"time": "08:30", "description": "Saída em direção à Serra"}, {"time": "10:00", "description": "Visita ao Museu Imperial"}, {"time": "12:30", "description": "Almoço no Centro Histórico"}, {"time": "15:00", "description": "Visita à Cervejaria e Casa de Santos Dumont"}]',
    '[{"icon": "MapPin", "text": "Transporte Executivo"}, {"icon": "Shield", "text": "Entradas nos Museus"}]'
),
(
    'Angra dos Reis & Ilha Grande', 'angra-ilha-grande-veleiro', 
    'Navegação exclusiva em lancha ou escuna pelas 365 ilhas de Angra. Paradas para mergulho na Lagoa Azul.', 
    290.00, '13h', 30, 
    'https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?q=80&w=1200', true, 'Marítimo', true, true, 
    true, false, false,
    '[{"time": "07:30", "description": "Check-in e saída do Rio"}, {"time": "11:00", "description": "Embarque em Angra"}, {"time": "13:30", "description": "Parada na Ilha da Gipóia para almoço"}, {"time": "15:00", "description": "Lagoa Azul e Mergulho"}]',
    '[{"icon": "Utensils", "text": "Almoço Buffet"}, {"icon": "MapPin", "text": "Mergulho com Snorkel"}]'
),
(
    'Sunset Sailing Baía de Guanabara', 'sunset-sailing-rio', 
    'O pôr do sol mais romântico do mundo visto de um veleiro privativo ou compartilhado. Open bar e petiscos.', 
    350.00, '3h', 8, 
    'https://images.unsplash.com/photo-1568249826477-848e063f972b?q=80&w=1200', false, 'Experiência', true, true, 
    false, true, false,
    '[{"time": "16:00", "description": "Embarque na Marina da Glória"}, {"time": "17:30", "description": "Pôr do sol em frente ao Pão de Açúcar"}, {"time": "18:30", "description": "Navegação sob a Ponte Rio-Niterói"}]',
    '[{"icon": "Utensils", "text": "Bebidas e Snacks"}, {"icon": "Shield", "text": "Serviço VIP"}]'
),
(
    'Favela Santa Marta & Arte Urbana', 'favela-santa-marta-cultural', 
    'Um mergulho na cultura local e nos grafites da primeira favela pacificada. Visita à estátua de Michael Jackson.', 
    150.00, '3h', 10, 
    '/maracana-hero.jpg', false, 'Cultural', true, true, 
    true, true, false,
    '[{"time": "09:00", "description": "Encontro na Praça Corumbá"}, {"time": "09:30", "description": "Subida de Bondinho social"}, {"time": "11:00", "description": "Workshop de percussão ou grafite"}]',
    '[{"icon": "MapPin", "text": "Guia Comunitário"}, {"icon": "Shield", "text": "Contribuição para o Projeto"}]'
)
ON CONFLICT (slug) DO NOTHING;
