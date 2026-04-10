
import { createClient } from '@supabase/supabase-js';
import process from 'process';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const posts = [
  {
    title: "Carnaval no Rio: O Guia Definitivo para Aproveitar como um Carioca",
    slug: "carnaval-rio-guia-definitivo",
    excerpt: "Dicas de seguran\u00e7a, os melhores blocos de rua e como conseguir ingressos para o Samb\u00f3dromo.",
    image_url: "https://images.unsplash.com/photo-1543783318-ae78f6974720?q=80&w=1200",
    is_published: true,
    content: `
      <h2>A Magia da Maior Festa do Mundo</h2>
      <p>O Carnaval do Rio de Janeiro \u00e9 uma experi\u00eancia que todos deveriam viver pelo menos uma vez na vida. Mas para aproveitar de verdade, \u00e9 preciso planejamento.</p>
      <h3>Blocos de Rua vs. Samb\u00f3dromo</h3>
      <p>Enquanto o Samb\u00f3dromo oferece o espet\u00e1culo visual das escolas de samba, os blocos de rua s\u00e3o a alma da festa para os locais. S\u00e3o mais de 400 blocos espalhados pela cidade!</p>
      <h3>Dicas de Sobreviv\u00eancia:</h3>
      <ul>
        <li><strong>Hidrata\u00e7\u00e3o:</strong> O calor no Rio durante o Carnaval pode passar dos 40\u00b0C. \u00c1gua \u00e9 sua melhor amiga.</li>
        <li><strong>Seguran\u00e7a:</strong> Use doleiras e evite ostentar objetos de valor em grandes multid\u00f5es.</li>
        <li><strong>Fantasias:</strong> Use roupas leves e confort\u00e1veis. Gl\u00edtter biodegrad\u00e1vel \u00e9 lei!</li>
      </ul>
      <p>Se voc\u00ea busca algo mais exclusivo, os camarotes da Sapuca\u00ed oferecem open bar, buffet e uma vista privilegiada do desfile.</p>
    `
  },
  {
    title: "B\u00fazios e Cabo Frio: O Charme e a Agita\u00e7\u00e3o da Regi\u00e3o dos Lagos",
    slug: "buzios-cabo-frio-regiao-dos-lagos",
    excerpt: "Explore as praias mais sofisticadas de B\u00fazios e a areia branqu\u00edssima de Cabo Frio em uma s\u00f3 viagem.",
    image_url: "https://images.unsplash.com/photo-1590523741831-2996a4605f99?q=80&w=1200",
    is_published: true,
    content: `
      <h2>Al\u00e9m da Capital</h2>
      <p>A Regi\u00e3o dos Lagos \u00e9 o ref\u00fagio de fim de semana dos cariocas. B\u00fazios e Cabo Frio, embora vizinhas, oferecem experi\u00eancias completamente diferentes.</p>
      <h3>Arma\u00e7\u00e3o dos B\u00fazios: Sofistica\u00e7\u00e3o e Charme</h3>
      <p>Antiga vila de pescadores que ficou famosa no mundo todo após a visita de Brigitte Bardot. A Rua das Pedras \u00e9 o centro da vida noturna e da gastronomia de alto padrão.</p>
      <h3>Cabo Frio: Praias de Areia Branca</h3>
      <p>A Praia do Forte \u00e9 o cart\u00e3o postal, com uma extens\u00e3o de areia tão branca que parece neve. \u00c9 o lugar ideal para fam\u00edlias e praticantes de esportes n\u00e1uticos.</p>
      <p><strong>Roteiro sugerido:</strong> Passe o dia mergulhando na Ilha do Japon\u00eas em Cabo Frio e termine a noite jantando no Porto da Barra em B\u00fazios.</p>
    `
  },
  {
    title: "Cultura e Hist\u00f3ria: Um Mergulho no Passado Imperial do Rio",
    slug: "rio-imperial-cultura-historia",
    excerpt: "Visite o Museu do Amanh\u00e3, a Biblioteca Nacional e descubra as heran\u00e7as da fam\u00edlia real no Brasil.",
    image_url: "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?q=80&w=1200",
    is_published: true,
    content: `
      <h2>Uma Cidade que Respira Hist\u00f3ria</h2>
      <p>O Rio de Janeiro foi a única capital europeia fora da Europa durante o per\u00edodo imperial. Essa heran\u00e7a est\u00e1 viva em cada esquina do centro da cidade.</p>
      <h3>O Corredor Cultural do Centro</h3>
      <p>Caminhar pelo Centro \u00e9 como viajar no tempo. A Confeitaria Colombo, fundada em 1894, \u00e9 parada obrigat\u00f3ria para um caf\u00e9 com ares da Belle \u00c9poque.</p>
      <h3>Principais Museus para Visitar:</h3>
      <ul>
        <li><strong>Museu do Amanh\u00e3:</strong> Uma obra-prima da arquitetura moderna dedicada \u00e0 sustentabilidade.</li>
        <li><strong>Museu de Arte do Rio (MAR):</strong> Oferece exposi\u00e7\u00f5es que conectam a arte \u00e0 hist\u00f3ria da cidade.</li>
        <li><strong>Biblioteca Nacional:</strong> Uma das dez maiores do mundo, com um acervo que veio de Portugal com a fam\u00edlia real.</li>
      </ul>
      <p>Termine seu passeio culturel no Real Gabinete Portugu\u00eas de Leitura, eleito uma das bibliotecas mais bonitas do mundo.</p>
    `
  },
  {
    title: "Rio com Crian\u00e7as: Roteiro Completo para uma Viagem em Fam\u00edlia",
    slug: "rio-de-janeiro-com-criancas-roteiro",
    excerpt: "Do AquaRio ao BioParque, descubra os melhores passeios para entreter os pequenos na Cidade Maravilhosa.",
    image_url: "https://images.unsplash.com/photo-1606103836293-0a0fa3ee4054?q=80&w=1200",
    is_published: true,
    content: `
      <h2>Divers\u00e3o para Todas as Idades</h2>
      <p>O Rio \u00e9 um destino excelente para fam\u00edlias. Al\u00e9m das praias, a cidade investiu muito em atra\u00e7\u00f5es educativas e interativas.</p>
      <h3>AquaRio e BioParque</h3>
      <p>O maior aqu\u00e1rio marinho da Am\u00e9rica do Sul \u00e9 garantia de sucesso com as crian\u00e7as. Logo ao lado, o BioParque oferece um conceito moderno de preserva\u00e7\u00e3o animal.</p>
      <h3>Atividades ao Ar Livre:</h3>
      <ul>
        <li><strong>Lagoa Rodrigo de Freitas:</strong> Alugue um pedalinho ou bicicletas para um passeio relaxante.</li>
        <li><strong>Jardim Bot\u00e2nico:</strong> Um espa\u00e7o seguro e calmo para os pequenos correrem enquanto aprendem sobre a flora brasileira.</li>
        <li><strong>Paineiras Corcovado:</strong> Uma forma divertida e confort\u00e1vel de chegar ao Cristo Redentor.</li>
      </ul>
      <p>N\u00e3o se esque\u00e7a do protetor solar e de manter as crian\u00e7as bem hidratadas!</p>
    `
  },
  {
    title: "Os 5 Melhores Pontos para Ver o P\u00f4r do Sol no Rio de Janeiro",
    slug: "melhores-pontos-por-do-sol-rio",
    excerpt: "Saiba onde tirar as melhores fotos e encerrar seu dia com chave de ouro na Cidade Maravilhosa.",
    image_url: "https://images.unsplash.com/photo-1518709382025-0fc773305c45?q=80&w=1200",
    is_published: true,
    content: `
      <h2>O Espet\u00e1culo Di\u00e1rio</h2>
      <p>Assistir ao p\u00f4r do sol \u00e9 quase um esporte no Rio. A geografia privilegiada cria cen\u00e1rios dignos de cinema todos os dias.</p>
      <h3>1. Pedra do Arpoador</h3>
      <p>O local cl\u00e1ssico. Aplaudir o sol quando ele mergulha no mar atr\u00e1s do Morro Dois Irm\u00e3os \u00e9 uma tradi\u00e7\u00e3o carioca.</p>
      <h3>2. Mureta da Urca</h3>
      <p>Ideal para quem busca um clima descontra\u00eddo. Pe\u00e7a uma cerveja gelada e pasteis enquanto v\u00ea o sol se p\u00f4r sobre a Ba\u00eda de Guanabara.</p>
      <h3>3. Parque da Cidade (Niter\u00f3i)</h3>
      <p>Embora tecnicamente fora do Rio, oferece a vista mais ic\u00f4nica da silhueta da cidade durante o entardecer.</p>
      <p><strong>Dica:</strong> Chegue pelo menos 30 minutos antes para garantir um bom lugar e ajustar sua c\u00e2mera!</p>
    `
  }
];

async function seed() {
  console.log('Inserting more high-quality blog posts...');
  const { error } = await supabase.from('blog_posts').insert(posts);

  if (error) {
    console.error('Error seeding data:', error);
  } else {
    console.log('5 additional blog posts inserted successfully!');
  }
}

seed();
