import { Bus, Shield, Heart, Users } from "lucide-react";

const features = [
  { icon: Bus, title: "Transporte Confortável", description: "Veículos com ar-condicionado, assentos confortáveis e amplo espaço para bagagens." },
  { icon: Shield, title: "Segurança Garantida", description: "Todos os passeios são conduzidos por motoristas experientes e guias certificados." },
  { icon: Heart, title: "Experiências Autênticas", description: "Conheça os pontos turísticos mais icônicos e descubra lugares fora do roteiro tradicional." },
  { icon: Users, title: "Grupos Reduzidos", description: "Grupos pequenos garantem atenção personalizada e uma experiência mais intimista." },
];

export function AboutSection() {
  return (
    <section id="about" className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="h-48 lg:h-64 rounded-2xl bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1619546952812-520e98064a52?q=80&w=600')` }} />
              <div className="h-32 lg:h-40 rounded-2xl bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1544989164-31dc3c645987?q=80&w=600')` }} />
            </div>
            <div className="space-y-4 pt-8">
              <div className="h-32 lg:h-40 rounded-2xl bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1516834611397-8d633eaec5c0?q=80&w=600')` }} />
              <div className="h-48 lg:h-64 rounded-2xl bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1483729558449-99ef09a8c325?q=80&w=600')` }} />
            </div>
          </div>

          <div>
            <p className="text-primary font-medium mb-3 font-sans">Sobre a Passeio Rio</p>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 text-balance">
              Sua Porta de Entrada para a
              <br />
              <span className="text-primary">Cidade Maravilhosa</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-6 leading-relaxed font-sans">
              A Passeio Rio oferece experiências turísticas autênticas que mostram o melhor
              do Rio de Janeiro. Do Cristo Redentor ao Pão de Açúcar, de Arraial do Cabo
              a Angra dos Reis, revelamos a beleza incomparável desta cidade magnífica.
            </p>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed font-sans">
              Com guias locais especializados e saídas diárias confirmadas, garantimos
              uma experiência segura, confortável e inesquecível.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map((feature) => (
                <div key={feature.title} className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1 font-sans">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground font-sans">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
