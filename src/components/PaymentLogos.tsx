import React from 'react';
import { CreditCard, Smartphone, ShieldCheck } from 'lucide-react';

interface PaymentLogosProps {
  className?: string;
  variant?: 'light' | 'dark';
}

export const PaymentLogos: React.FC<PaymentLogosProps> = ({ className = "", variant = 'light' }) => {
  const isDark = variant === 'dark';
  const textColor = isDark ? 'text-white/60' : 'text-muted-foreground/60';
  const iconColor = isDark ? 'text-white/40' : 'text-primary/40';

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <div className="flex items-center gap-4">
        {/* Apple Pay placeholder-like visual */}
        <div className={`flex items-center gap-1 px-2 py-1 border rounded-md cursor-default transition-opacity hover:opacity-100 opacity-70 ${isDark ? 'border-white/10 bg-white/5' : 'border-black/5 bg-black/5'}`}>
          <Smartphone className={`w-3 h-3 ${isDark ? 'text-white' : 'text-black'}`} />
          <span className={`text-[10px] font-black tracking-tighter ${isDark ? 'text-white' : 'text-black'}`}>Pay</span>
        </div>
        
        {/* Google Pay placeholder-like visual */}
        <div className={`flex items-center gap-1 px-2 py-1 border rounded-md cursor-default transition-opacity hover:opacity-100 opacity-70 ${isDark ? 'border-white/10 bg-white/5' : 'border-black/5 bg-black/5'}`}>
          <span className="text-[10px] font-black tracking-tighter">
            <span className="text-blue-500">G</span>
            <span className={`${isDark ? 'text-white' : 'text-black'}`}> Pay</span>
          </span>
        </div>

        {/* Visa/Master */}
        <div className="flex gap-2">
          <CreditCard className={`w-5 h-5 ${iconColor}`} />
        </div>
      </div>
      
      <div className={`flex items-center gap-1.5 ${textColor} text-[9px] font-bold uppercase tracking-widest`}>
        <ShieldCheck className="w-3 h-3 text-green-500" />
        Secure worldwide checkout
      </div>
    </div>
  );
};
