import { useEffect, useState } from "react";
import { Map, FileText, Image, Share2 } from "lucide-react";
import { ChangePassword } from "@/components/admin/ChangePassword";
import { fetchLovable } from "@/integrations/lovable/client";

const AdminDashboard = () => {
  const [counts, setCounts] = useState({ tours: 0, pages: 0, images: 0, social: 0 });

  useEffect(() => {
    const fetchCounts = async () => {
      const [t, p, i, s] = await Promise.all([
        fetchLovable<{ id: string }>("tours"),
        fetchLovable<{ id: string }>("pages"),
        fetchLovable<{ id: string }>("site_images"),
        fetchLovable<{ id: string }>("social_media"),
      ]);
      setCounts({
        tours: t.length,
        pages: p.length,
        images: i.length,
        social: s.length,
      });
    };
    fetchCounts();
  }, []);

  const cards = [
    { label: "Passeios", count: counts.tours, icon: Map, color: "bg-primary/10 text-primary" },
    { label: "Páginas", count: counts.pages, icon: FileText, color: "bg-secondary/20 text-secondary" },
    { label: "Imagens", count: counts.images, icon: Image, color: "bg-accent/20 text-accent-foreground" },
    { label: "Redes Sociais", count: counts.social, icon: Share2, color: "bg-destructive/10 text-destructive" },
  ];

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold text-foreground mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card) => (
          <div key={card.label} className="bg-card rounded-xl border border-border/50 p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.color}`}>
                <card.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground font-sans">{card.count}</p>
                <p className="text-sm text-muted-foreground font-sans">{card.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ChangePassword />
    </div>
  );
};

export default AdminDashboard;
