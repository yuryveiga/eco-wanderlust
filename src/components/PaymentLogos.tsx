import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface PaymentLogosProps {
  className?: string;
  variant?: 'light' | 'dark';
}

export const PaymentLogos: React.FC<PaymentLogosProps> = ({ className = "", variant = 'light' }) => {
  const isDark = variant === 'dark';
  const textColor = isDark ? 'text-white/60' : 'text-muted-foreground/60';
  const badgeBase = `flex items-center justify-center px-2 py-1 border rounded-md cursor-default transition-opacity hover:opacity-100 opacity-80 h-7 ${isDark ? 'border-white/10 bg-white/5' : 'border-black/5 bg-white'}`;

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <div className="flex items-center gap-2 flex-wrap">
        {/* Stripe */}
        <div className={badgeBase}>
          <span className={`text-[10px] font-black tracking-tight ${isDark ? 'text-white' : 'text-[#635BFF]'}`}>
            stripe
          </span>
        </div>

        {/* Visa */}
        <div className={badgeBase}>
          <span className={`text-[11px] font-black italic tracking-tight ${isDark ? 'text-white' : 'text-[#1A1F71]'}`}>
            VISA
          </span>
        </div>

        {/* Mastercard */}
        <div className={badgeBase}>
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-[#EB001B] inline-block" />
            <span className="w-3 h-3 rounded-full bg-[#F79E1B] inline-block -ml-1.5 mix-blend-multiply" />
          </div>
        </div>

        {/* Pix */}
        <div className={badgeBase}>
          <span className={`text-[10px] font-black tracking-tight ${isDark ? 'text-white' : 'text-[#32BCAD]'}`}>
            Pix
          </span>
        </div>
      </div>

      <div className={`flex items-center gap-1.5 ${textColor} text-[9px] font-bold uppercase tracking-widest`}>
        <ShieldCheck className="w-3 h-3 text-green-500" />
        Secure worldwide checkout
      </div>
    </div>
  );
};
