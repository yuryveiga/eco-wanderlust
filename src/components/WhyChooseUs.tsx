import React from 'react';
import { useLocale } from '@/contexts/LocaleContext';
import { Star, MapPin, ShieldCheck } from 'lucide-react';
import { ViewFadeIn } from './ViewFadeIn';

export const WhyChooseUs = () => {
  const { t } = useLocale();

  const reasons = [
    {
      icon: Star,
      title: t('pq_exp_exclusiva'),
      desc: t('pq_exp_exclusiva_desc'),
      color: 'text-yellow-500',
      bg: 'bg-yellow-500/10'
    },
    {
      icon: MapPin,
      title: t('pq_guia_local'),
      desc: t('pq_guia_local_desc'),
      color: 'text-green-600',
      bg: 'bg-green-600/10'
    },
    {
      icon: ShieldCheck,
      title: t('pq_seguranca'),
      desc: t('pq_seguranca_desc'),
      color: 'text-blue-600',
      bg: 'bg-blue-600/10'
    }
  ];

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <ViewFadeIn>
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-slate-900 mb-2">
              {t('porque_reservar')}
            </h2>
            <div className="w-20 h-1 bg-green-600 mx-auto rounded-full" />
          </div>
        </ViewFadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reasons.map((reason, index) => (
            <ViewFadeIn key={index} direction="up">
              <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-md transition-shadow">
                <div className={`w-16 h-16 rounded-full ${reason.bg} flex items-center justify-center mb-4`}>
                  <reason.icon className={`w-8 h-8 ${reason.color}`} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{reason.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {reason.desc}
                </p>
              </div>
            </ViewFadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};
