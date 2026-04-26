-- Ensure table has excerpt column
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS excerpt TEXT;

-- Inserting 4 blog posts about Rio de Janeiro
INSERT INTO public.blog_posts (title, slug, content, excerpt, image_url, is_published, created_at)
VALUES 
(
    'Os 5 Melhores Mirantes Gratuitos no Rio de Janeiro', 
    'melhores-mirantes-gratuitos-rj', 
    '<h2>Descubra as vistas mais incríveis da cidade sem gastar nada!</h2><p>O Rio de Janeiro é mundialmente famoso por sua geografia privilegiada, onde o mar e a montanha se encontram. Embora o Cristo Redentor e o Pão de Açúcar sejam paradas obrigatórias, existem mirantes gratuitos que oferecem ângulos igualmente espetaculares.</p><h3>1. Mirante Dona Marta</h3><p>Localizado no caminho para o Corcovado, oferece uma das vistas mais clássicas do Pão de Açúcar e da Baía de Guanabara.</p><h3>2. Parque das Ruínas (Santa Teresa)</h3><p>Além da vista panorâmica do Centro e da Lapa, você aproveita o ambiente cultural de um dos bairros mais charmosos do Rio.</p><h3>3. Vista Chinesa</h3><p>No coração da Floresta da Tijuca, este deck em estilo oriental proporciona uma visão deslumbrante da Lagoa e do Morro Dois Irmãos.</p>', 
    'Conheça os ângulos mais espetaculares da Cidade Maravilhosa sem gastar um centavo. Do Mirante Dona Marta à Vista Chinesa.', 
    '/maracana-hero.jpg', 
    true, 
    NOW()
),
(
    'Roteiro de 3 Dias para Aproveitar a Cidade Maravilhosa', 
    'roteiro-3-dias-rio-de-janeiro', 
    '<h2>Planeje sua viagem perfeita com este roteiro otimizado</h2><p>Três dias no Rio é pouco para ver tudo, mas o suficiente para se apaixonar. Dividimos as atrações por regiões para você não perder tempo no trânsito.</p><h3>Dia 1: O Clássico</h3><p>Comece cedo no Cristo Redentor para evitar filas, siga para o Pão de Açúcar ao entardecer e termine a noite com um chope gelado na Urca.</p><h3>Dia 2: Cultura e História</h3><p>Explore o Centro Histórico, a Confeitaria Colombo e a Escadaria Selarón na Lapa. À tarde, relaxe nas areias de Ipanema.</p><h3>Dia 3: Natureza e Ar Livre</h3><p>Visite o Jardim Botânico e faça uma caminhada leve pela Pista Cláudio Coutinho ou pela trilha do Morro da Urca.</p>', 
    'Três dias no Rio é o suficiente para se apaixonar. Aprenda a dividir seus dias entre o clássico, a cultura e a natureza.', 
    'https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?q=80&w=1200', 
    true, 
    NOW() + INTERVAL '1 hour'
),
(
    'Onde Comer no Rio: Gastronomia e Sabores Cariocas', 
    'onde-comer-no-rio-gastronomia', 
    '<h2>Uma viagem pelos temperos e tradições do Rio</h2><p>A comida no Rio de Janeiro vai muito além da feijoada. É uma mistura de influências portuguesas, mineiras e, claro, o toque descontraído do carioca.</p><h3>O Tradicional Botequim</h3><p>Não saia do Rio sem comer um Bolinho de Bacalhau no Pavão Azul ou um Filé à Oswaldo Aranha no Cosmopolita.</p><h3>Café da Manhã com Vista</h3><p>O Parque Lage e o Forte de Copacabana oferecem experiências gastronômicas inesquecíveis em cenários cinematográficos.</p><h3>A Famosa Feijoada</h3><p>Sábado é dia oficial de feijoada! O bairro de Santa Teresa é um dos melhores lugares para saborear esse prato ouvindo um bom samba.</p>', 
    'Uma viagem pelos temperos cariocas. Do botequim raiz ao luxuoso café da manhã no Forte de Copacabana.', 
    'https://images.unsplash.com/photo-1544148103-0773bf10dca3?q=80&w=1200', 
    true, 
    NOW() + INTERVAL '2 hours'
),
(
    'Dicas de Segurança e Transporte para Turistas no Rio', 
    'dicas-seguranca-transporte-rio', 
    '<h2>Viaje tranquilo com essas dicas essenciais</h2><p>O Rio é uma cidade grande e, como qualquer metrópole, exige atenção. Aqui estão as melhores formas de se locomover e como aproveitar sem sustos.</p><h3>Transporte Público</h3><p>O MetrôRio é excelente, seguro e cobre as principais áreas turísticas. Para curtas distâncias, o VLT no Centro é uma ótima opção.</p><h3>Aplicativos de Transporte</h3><p>Uber e 99 funcionam muito bem e são as formas mais práticas de voltar para o hotel à noite.</p><h3>Dicas de Ouro</h3><p>Evite usar joias ou relógios chamativos, prefira roupas descontraídas (o estilo carioca!) e tenha atenção redobrada ao usar o celular em locais muito movimentados.</p>', 
    'O Rio é uma cidade incrível, mas exige atenção. Saiba como se locomover com segurança e praticidade durante sua estada.', 
    '/maracana-hero.jpg', 
    true, 
    NOW() + INTERVAL '3 hours'
);
