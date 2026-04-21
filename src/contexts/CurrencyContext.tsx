import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Currency = 'BRL' | 'USD' | 'EUR';

interface CurrencyContextType {
  rates: Record<Currency, number>;
  loading: boolean;
  convertBRL: (amount: number, to: Currency) => number;
}

const DEFAULT_RATES: Record<Currency, number> = {
  BRL: 1,
  USD: 0.20, // 1 USD = R$ 5,00
  EUR: 0.18, // 1 EUR = R$ 5,55
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [rates, setRates] = useState<Record<Currency, number>>(DEFAULT_RATES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await fetch('https://open.er-api.com/v6/latest/BRL');
        if (!response.ok) throw new Error('Failed to fetch rates');
        
        const data = await response.json();
        if (data && data.rates) {
          setRates({
            BRL: 1,
            USD: data.rates.USD || DEFAULT_RATES.USD,
            EUR: data.rates.EUR || DEFAULT_RATES.EUR,
          });
        }
      } catch (error) {
        console.error('Error fetching currency rates, using fallback:', error);
        // Fallback already set in state initialization, but ensuring it here
        setRates(DEFAULT_RATES);
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
  }, []);

  const convertBRL = (amount: number, to: Currency) => {
    return amount * (rates[to] || 1);
  };

  return (
    <CurrencyContext.Provider value={{ rates, loading, convertBRL }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error('useCurrency must be used within a CurrencyProvider');
  return context;
};
