import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Map, FileText, Image, Share2 } from "lucide-react";

const AdminDashboard = () => {
  const [counts, setCounts] = useState({ tours: 0, pages: 0, images: 0, social: 0 });

  useEffect(() => {
    const fetchCounts = async () => {
      const [t, p, i, s] = await Promise.all([
        supabase.from("tours").select("id", { count: "exact", head: true }),
        supabase.from("pages").select("id", { count: "exact", head: true }),
        supabase.from("site_images").select("id", { count: "exact", head: true }),
        supabase.from("social_media").select("id", { count: "exact", head: true }),
      ]);
      setCounts({
        tours: t.count ?? 0,
        pages: p.count ?? 0,
        images: i.count ?? 0,
        social: s.count ?? 0,
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
    </div>
  );
};

export default AdminDashboard;
