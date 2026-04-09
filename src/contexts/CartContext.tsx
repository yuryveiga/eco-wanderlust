import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  id: string;
  slug?: string;
  title: string;
  price: number;
  image_url: string;
  date: string;
  period: string;
  isPrivate: boolean;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string, date: string, period: string) => void;
  updateQuantity: (id: string, date: string, period: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('eco_cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('eco_cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (newItem: CartItem) => {
    setItems(prev => {
      // Check if exact same item exists (id, date, period, privacy)
      const existing = prev.find(i => 
        i.id === newItem.id && 
        i.date === newItem.date && 
        i.period === newItem.period &&
        i.isPrivate === newItem.isPrivate
      );

      if (existing) {
        return prev.map(i => i === existing ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, newItem];
    });
  };

  const removeFromCart = (id: string, date: string, period: string) => {
    setItems(prev => prev.filter(i => !(i.id === id && i.date === date && i.period === period)));
  };

  const updateQuantity = (id: string, date: string, period: string, quantity: number) => {
    setItems(prev => prev.map(i => 
      i.id === id && i.date === date && i.period === period 
        ? { ...i, quantity } 
        : i
    ));
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
