import { Clock, Users, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Tour {
  id: string;
  title: string;
  short_description: string;
  price: number;
  duration: string;
  max_group_size: number;
  image_url: string;
  is_featured: boolean;
  category: string;
}

const tours: Tour[] = [
  {
    id: "1",
    title: "City Tour Rio Completo",
    short_description: "Conheça os pontos turísticos mais icônicos do Rio de Janeiro em um tour completo de dia inteiro.",
    price: 250,
    duration: "8 horas",
    max_group_size: 15,
    image_url: "https://images.unsplash.com/photo-1619546952812-520e98064a52?q=80&w=600",
    is_featured: true,
    category: "City Tour",
  },
  {
    id: "2",
    title: "Arraial do Cabo",
    short_description: "Descubra o Caribe Brasileiro com águas cristalinas e praias paradisíacas em Arraial do Cabo.",
    price: 180,
    duration: "12 horas",
    max_group_size: 20,
    image_url: "https://images.unsplash.com/photo-1516834611397-8d633eaec5c0?q=80&w=600",
    is_featured: true,
    category: "Praia",
  },
  {
    id: "3",
    title: "Angra dos Reis",
    short_description: "Navegue pelas ilhas paradisíacas de Angra dos Reis em um passeio de escuna inesquecível.",
    price: 200,
    duration: "10 horas",
    max_group_size: 25,
    image_url: "https://images.unsplash.com/photo-1544989164-31dc3c645987?q=80&w=600",
    is_featured: true,
    category: "Barco",
  },
  {
    id: "4",
    title: "Cristo Redentor & Pão de Açúcar",
    short_description: "Visite as duas maravilhas do Rio em um único passeio com guia especializado.",
    price: 300,
    duration: "6 horas",
    max_group_size: 12,
    image_url: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?q=80&w=600",
    is_featured: false,
    category: "City Tour",
  },
  {
    id: "5",
    title: "Trilha da Pedra Bonita",
    short_description: "Trilha ecológica com vista panorâmica incrível do Rio de Janeiro.",
    price: 150,
    duration: "4 horas",
    max_group_size: 10,
    image_url: "https://images.unsplash.com/photo-1518639192441-8fce0a366e2e?q=80&w=600",
    is_featured: false,
    category: "Trilha",
  },
  {
    id: "6",
    title: "Passeio Noturno pela Lapa",
    short_description: "Descubra a vida noturna carioca com um tour cultural pelo bairro da Lapa.",
    price: 120,
    duration: "4 horas",
    max_group_size: 15,
    image_url: "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?q=80&w=600",
    is_featured: false,
    category: "Cultural",
  },
];

function TourCard({ tour }: { tour: Tour }) {
  return (
    <div className="bg-card rounded-2xl overflow-hidden shadow-lg border border-border/50 group hover:shadow-xl transition-shadow duration-300">
      <div className="relative h-56 overflow-hidden">
        <img
          src={tour.image_url}
          alt={tour.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {tour.is_featured && (
          <div className="absolute top-4 left-4 bg-accent text-accent-foreground text-xs font-semibold px-3 py-1 rounded-full font-sans flex items-center gap-1">
            <Star className="w-3 h-3 fill-current" />
            Destaque
          </div>
        )}
        <div className="absolute top-4 right-4 bg-card/90 backdrop-blur-sm text-foreground text-xs font-medium px-3 py-1 rounded-full font-sans">
          {tour.category}
        </div>
      </div>
      <div className="p-6">
        <h3 className="font-serif text-xl font-semibold text-foreground mb-2">{tour.title}</h3>
        <p className="text-muted-foreground text-sm mb-4 font-sans line-clamp-2">{tour.short_description}</p>
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4 font-sans">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{tour.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>Até {tour.max_group_size} pessoas</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-primary font-sans">R$ {tour.price}</span>
            <span className="text-muted-foreground text-sm font-sans"> /pessoa</span>
          </div>
          <Button size="sm" className="font-sans">Reservar</Button>
        </div>
      </div>
    </div>
  );
}

export function ToursSection() {
  return (
    <section id="tours" className="py-20 lg:py-28 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 lg:mb-16">
          <p className="text-primary font-medium mb-3 font-sans">Nossos Passeios</p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
            Experiências Inesquecíveis
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-sans">
            Escolha entre nossa seleção de passeios cuidadosamente planejados,
            cada um projetado para proporcionar momentos únicos na Cidade Maravilhosa.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tours.map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </div>
      </div>
    </section>
  );
}
