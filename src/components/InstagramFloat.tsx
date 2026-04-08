import { Instagram } from "lucide-react";
import { useSiteData } from "@/hooks/useSiteData";

export function InstagramFloat() {
  const { socialMedia } = useSiteData();
  
  const instagram = socialMedia.find(s => 
    s.platform.toLowerCase().includes('instagram') && s.is_active !== false
  );

  if (!instagram) return null;

  return (
    <a
      href={instagram.url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 left-6 z-50 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 group"
      aria-label="Siga no Instagram"
    >
      <Instagram className="w-8 h-8 fill-current" />
      <span className="absolute left-full ml-3 bg-black/80 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none font-sans">
        Siga no Instagram!
      </span>
    </a>
  );
}