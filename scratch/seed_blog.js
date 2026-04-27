
import { createClient } from '@supabase/supabase-js';
import process from 'process';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function cleanupAndReSeed() {
  const slugs = [
    "rio-alem-do-obvio-lugares-secretos",
    "guia-arraial-do-cabo-caribe-brasileiro",
    "melhores-trilhas-rio-de-janeiro",
    "gastronomia-carioca-pratos-tipicos",
    "melhor-epoca-visitar-rio-de-janeiro"
  ];

  console.log('Deleting existing posts with these slugs...');
  await supabase.from('blog_posts').delete().in('slug', slugs);

  const posts = [
    {
      title: "Rio Al\u00e9m do \u00d3bvio: 5 Lugares Secretos para Fugir da Multid\u00e3o",
      slug: "rio-alem-do-obvio-lugares-secretos",
      excerpt: "Descubra mirantes pouco conhecidos e praias escondidas que s\u00f3 os locais frequentam.",
      image_url: "https://images.unsplash.com/photo-1549114844-306d7593da6c?q=80&w=1200",
      is_published: true,
      content: `
        <h2>Fuja do Roteiro Tradicional</h2>
        <p>O Rio de Janeiro \u00e9 famoso pelo Cristo e pelo P\u00e3o de A\u00e7\u00facar, mas a Cidade Maravilhosa esconde segredos que valem a pena ser explorados. Se voc\u00ea busca tranquilidade e vistas de tirar o f\u00f4lego sem as filas quilom\u00e9tricas, este guia \u00e9 para voc\u00ea.</p>
        <h3>1. Mirante do Caet\u00e9</h3>
        <p>Localizado no Parque Municipal da Prainha, esta trilha leve recompensa o visitante com uma vista panor\u00e2mica da Zona Oeste. \u00c9 o lugar perfeito para ver o contraste entre o mar e a mata preservada.</p>
        <h3>2. Praia da Joatinga</h3>
        <p>Uma pequena enseada acess\u00edvel apenas durante a mar\u00e9 baixa. Localizada em um condom\u00ednio no Jo\u00e1, oferece um clima exclusivo e um p\u00f4r do sol inesquec\u00edvel.</p>
        <p><strong>Dica de Especialista:</strong> Visite esses lugares durante a semana para uma experi\u00eancia ainda mais privativa.</p>
      `
    },
    {
      title: "Arraial do Cabo: Um Guia Completo para o \"Caribe Brasileiro\"",
      slug: "guia-arraial-do-cabo-caribe-brasileiro",
      excerpt: "Tudo o que voc\u00ea precisa saber para aproveitar as \u00e1guas cristalinas da Regi\u00e3o dos Lagos.",
      image_url: "https://images.unsplash.com/photo-1516834611397-8d633eaec5c0?q=80&w=1200",
      is_published: true,
      content: `
        <h2>O Para\u00edso \u00e9 Logo Ali</h2>
        <p>Arraial do Cabo ganhou o apelido de Caribe Brasileiro por um motivo \u00f3bvio: suas \u00e1guas incrivelmente azuis e areia branca. A apenas 3 horas do Rio, \u00e9 o destino de bate-volta favorito dos turistas.</p>
        <h3>O que n\u00e3o pode faltar:</h3>
        <ul>
          <li><strong>Passeio de Barco:</strong> A única forma de conhecer a Ilha do Farol, eleita uma das praias mais bonitas do mundo.</li>
          <li><strong>Prainhas do Pontal do Atalaia:</strong> Famosas pela escadaria de madeira que rende fotos incr\u00edveis.</li>
          <li><strong>Mergulho:</strong> Arraial \u00e9 a capital do mergulho no Brasil, com visibilidade excelente e vida marinha abundante.</li>
        </ul>
        <p>Lembre-se de levar protetor solar e repelente, e prepare-se para se apaixonar por cada enseada.</p>
      `
    },
    {
      title: "As 3 Melhores Trilhas para Ver o Rio de Cima",
      slug: "melhores-trilhas-rio-de-janeiro",
      excerpt: "Da Pedra do Tel\u00e9grafo ao Morro Dois Irm\u00e3os, saiba qual trilha escolher.",
      image_url: "https://images.unsplash.com/photo-1552799446-159ba9523315?q=80&w=1200",
      is_published: true,
      content: `
        <h2>Aventure-se na Natureza Carioca</h2>
        <p>O Rio \u00e9 uma das poucas metr\u00f3poles do mundo onde a floresta urbana encontra o mar de forma t\u00e3o dram\u00e1tica. Trilhar \u00e9 uma das melhores formas de entender a geografia da cidade.</p>
        <h3>1. Pedra do Tel\u00e9grafo</h3>
        <p>Famosa pela foto \"perigosa\" que \u00e9 pura ilus\u00e3o de \u00f3tica. O visual das praias selvagens compensa a caminhada de cerca de 45 minutos.</p>
        <h3>2. Morro Dois Irm\u00e3os</h3>
        <p>A vista mais completa da Zona Sul. \u00c9 poss\u00edvel ver a orla de Leblon e Ipanema, a Lagoa Rodrigo de Freitas e o Cristo Redentor em um \u00e2ngulo privilegiado.</p>
        <p><em>Importante: Sempre contrate um guia especializado para trilhas mais longas para garantir sua seguran\u00e7a e aprender sobre a fauna local.</em></p>
      `
    },
    {
      title: "Gastronomia Carioca: 5 Pratos que Voc\u00ea Precisa Provar",
      slug: "gastronomia-carioca-pratos-tipicos",
      excerpt: "Da feijoada de s\u00e1bado ao biscoito Globo na praia, conhe\u00e7a os sabores aut\u00eanticos do RJ.",
      image_url: "https://images.unsplash.com/photo-1563805042-7684c849a158?q=80&w=1200",
      is_published: true,
      content: `
        <h2>Comer como um Local</h2>
        <p>Viajar para o Rio tamb\u00e9m \u00e9 uma experi\u00eancia gastron\u00f4mica. A culin\u00e1ria local reflete a mistura de culturas que formou o Brasil.</p>
        <p><strong>1. Feijoada:</strong> O ritual de s\u00e1bado por excel\u00eancia. Sugerimos provar a do bairro de Santa Teresa para unir sabor e cultura.</p>
        <p><strong>2. Fil\u00e9 \u00e0 Oswaldo Aranha:</strong> Um cl\u00e1ssico dos restaurantes tradicionais da Lapa e Centro, com muito alho e chips de batata portuguesa.</p>
        <p><strong>3. Bolinho de Bacalhau:</strong> Perfeito para acompanhar um chopp gelado em um final de tarde de sol.</p>
        <p>N\u00e3o saia da praia sem provar o Biscoito Globo e o Matte gelado \u2013 o combo oficial do ver\u00e3o carioca!</p>
      `
    },
    {
      title: "Planejando sua Viagem: Qual a melhor \u00e9poca para visitar o Rio?",
      slug: "melhor-epoca-visitar-rio-de-janeiro",
      excerpt: "Descubra quando ir ao Rio de Janeiro para aproveitar o sol ou curtir o Carnaval.",
      image_url: "/placeholder.svg",
      is_published: true,
      content: `
        <h2>Sol o Ano Inteiro?</h2>
        <p>Embora o Rio seja conhecido pelo calor, cada esta\u00e7\u00e3o oferece uma experi\u00eancia diferente. Planejar a data certa depende do seu objetivo.</p>
        <ul>
          <li><strong>Ver\u00e3o (Dez a Mar):</strong> Sol forte, praias lotadas e a energia do Carnaval. Prepare-se para temperaturas acima de 35\u00b0C e chuvas passageiras no fim da tarde.</li>
          <li><strong>Outono (Abril a Junho):</strong> Nossa \u00e9poca favorita. C\u00e9u azul l\u00edmpido, as melhores luzes para fotos e temperaturas agrad\u00e1veis (20\u00b0C a 28\u00b0C).</li>
          <li><strong>Primavera (Setembro a Novembro):</strong> \u00d3tima para trilhas e passeios ao ar livre, com a cidade mais florida e menos filas.</li>
        </ul>
        <p>Independente do m\u00eas, o Rio sempre tem um evento acontecendo e um p\u00f4r do sol te esperando no Arpoador.</p>
      `
    }
  ];

  console.log('Inserting full content posts...');
  const { error } = await supabase.from('blog_posts').insert(posts);

  if (error) {
    console.error('Error seeding data:', error);
  } else {
    console.log('Full blog posts updated successfully!');
  }
}

cleanupAndReSeed();
