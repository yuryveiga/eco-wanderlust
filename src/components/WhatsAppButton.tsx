import { MessageCircle } from "lucide-react";
import { useSiteData } from "@/hooks/useSiteData";

export function WhatsAppButton() {
  const { socialMedia } = useSiteData();
  
  // Find WhatsApp or Phone in social media
  const whatsapp = socialMedia.find(s => 
    s.platform.toLowerCase().includes('whatsapp') || 
    s.icon_name.toLowerCase().includes('phone')
  );

  if (!whatsapp) return null;

  // Clean the number (remove non-digits, but keep + if exists)
  const cleanNumber = whatsapp.url.replace(/[^\d+]/g, "");
  
  const handleClick = () => {
    // If it's a full URL, use it, otherwise format as wa.me
    const url = whatsapp.url.startsWith('http') 
      ? whatsapp.url 
      : `https://wa.me/${cleanNumber.replace('+', '')}`;
    
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 group animate-bounce-slow"
      aria-label="Contato via WhatsApp"
    >
      <MessageCircle className="w-8 h-8 fill-current" />
      <span className="absolute right-full mr-3 bg-black/80 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none font-sans">
        Dúvidas? Fale conosco!
      </span>
    </button>
  );
}
