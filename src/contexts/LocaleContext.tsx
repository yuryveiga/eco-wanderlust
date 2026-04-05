import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'pt' | 'en' | 'es';
type Currency = 'BRL' | 'USD' | 'EUR';

interface LocaleContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  currency: Currency;
  setCurrency: (curr: Currency) => void;
  t: (key: string) => string;
  formatPrice: (priceBrl: number) => string;
}

const translations = {
  pt: {
    inicio: 'Início',
    passeios: 'Passeios',
    sobre: 'Sobre Nós',
    contato: 'Contato',
    galeria: 'Galeria de Fotos',
    galeria_sub: 'Fotos dos nossos passeios e paisagens do Rio de Janeiro',
    reservar: 'Reservar',
    conhecaPasseios: 'Descubra Nossos Passeios',
    conheca_sub: 'Experiências únicas e inesquecíveis pelo Rio',
    detalhes: 'Detalhes',
    nenhuma_foto: 'Nenhuma foto na galeria ainda.',
    por_pessoa: 'por pessoa',
    
    // Hero
    avaliados: 'Avaliados com 5.0 no TripAdvisor',
    conheca_melhor: 'Conheça o Melhor do',
    rio_janeiro: 'Rio de Janeiro',
    hero_desc: 'City tours completos, passeios de barco em Arraial do Cabo e Angra dos Reis, e experiências inesquecíveis com guias especializados.',
    nossos_passeios: 'Nossos Passeios',
    passeio_pers: 'Passeio Personalizado',
    turistas_felizes: '+1000 Turistas Felizes',
    saidas_diarias: 'Saídas Diárias',
    guias_espec: 'Guias Locais Especializados',
  },
  en: {
    inicio: 'Home',
    passeios: 'Tours',
    sobre: 'About Us',
    contato: 'Contact',
    galeria: 'Photo Gallery',
    galeria_sub: 'Photos of our tours and Rio de Janeiro landscapes',
    reservar: 'Book Now',
    conhecaPasseios: 'Discover Our Tours',
    conheca_sub: 'Unique and unforgettable experiences in Rio',
    detalhes: 'Details',
    nenhuma_foto: 'No photos in the gallery yet.',
    por_pessoa: 'per person',
    
    // Hero
    avaliados: 'Rated 5.0 on TripAdvisor',
    conheca_melhor: 'Discover the Best of',
    rio_janeiro: 'Rio de Janeiro',
    hero_desc: 'Complete city tours, boat trips in Arraial do Cabo and Angra dos Reis, and unforgettable experiences with expert guides.',
    nossos_passeios: 'Our Tours',
    passeio_pers: 'Custom Tour',
    turistas_felizes: '+1000 Happy Tourists',
    saidas_diarias: 'Daily Departures',
    guias_espec: 'Expert Local Guides',
  },
  es: {
    inicio: 'Inicio',
    passeios: 'Paseos',
    sobre: 'Sobre Nosotros',
    contato: 'Contacto',
    galeria: 'Galería de Fotos',
    galeria_sub: 'Fotos de nuestros paseos y paisajes de Río de Janeiro',
    reservar: 'Reservar',
    conhecaPasseios: 'Descubre Nuestros Paseos',
    conheca_sub: 'Experiencias únicas e inolvidables en Río',
    detalhes: 'Detalles',
    nenhuma_foto: 'No hay fotos en la galería todavía.',
    por_pessoa: 'por persona',
    
    // Hero
    avaliados: 'Puntuado 5.0 en TripAdvisor',
    conheca_melhor: 'Descubre lo Mejor de',
    rio_janeiro: 'Río de Janeiro',
    hero_desc: 'City tours completos, paseos en barco por Arraial do Cabo y Angra dos Reis, y experiencias inolvidables con guías expertos.',
    nossos_passeios: 'Nuestros Paseos',
    passeio_pers: 'Paseo Personalizado',
    turistas_felizes: '+1000 Turistas Felices',
    saidas_diarias: 'Salidas Diarias',
    guias_espec: 'Guías Locales Expertos',
  }
};

// Câmbio aproximado para os cálculos locais baseados em Real (BRL)
const rates = {
  BRL: 1,
  USD: 5.20,
  EUR: 5.60,
};

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export const LocaleProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('pt');
  const [currency, setCurrency] = useState<Currency>('BRL');

  const t = (key: string) => {
    return translations[language][key as keyof typeof translations.pt] || key;
  };

  const formatPrice = (priceBrl: number) => {
    if (!priceBrl) return "";
    const converted = priceBrl / rates[currency];
    return new Intl.NumberFormat(language === 'en' ? 'en-US' : language === 'es' ? 'es-ES' : 'pt-BR', {
      style: 'currency',
      currency: currency,
    }).format(converted);
  };

  return (
    <LocaleContext.Provider value={{ language, setLanguage, currency, setCurrency, t, formatPrice }}>
      {children}
    </LocaleContext.Provider>
  );
};

export const useLocale = () => {
  const context = useContext(LocaleContext);
  if (!context) throw new Error('useLocale must be used within a LocaleProvider');
  return context;
};
