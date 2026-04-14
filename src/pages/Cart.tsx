import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import { useLocale } from "@/contexts/LocaleContext";
import { useSiteData } from "@/hooks/useSiteData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Calendar, Clock, ArrowRight, ShoppingBag, CreditCard, ShieldCheck, Users, Plus, Minus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ptBR, enUS, es } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";

const Cart = () => {
  const { items, removeFromCart, total, clearCart, updateQuantity } = useCart();
  const { t, language, formatPrice } = useLocale();
  const { siteSettings } = useSiteData();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [customerInfo, setCustomerInfo] = useState({ name: "", whatsapp: "", email: "" });
  const navigate = useNavigate();
  
  const dateLocale = language === 'en' ? enUS : language === 'es' ? es : ptBR;

  const handleCheckout = async () => {
    if (items.length === 0) return;
    
    if (!customerInfo.name || !customerInfo.whatsapp || !customerInfo.email) {
      alert(language === 'pt' ? "Preencha seu nome, WhatsApp e e-mail" : "Fill in your name, WhatsApp and email");
      return;
    }
    
    setIsProcessing(true);
    try {
      const saleIds: string[] = [];
      
      // Save sale to database and collect IDs
      for (const item of items) {
        const { data, error } = await (supabase.from("sales") as any).insert({
          tour_id: item.id,
          tour_title: item.title,
          tour_slug: item.slug,
          customer_name: customerInfo.name,
          customer_email: customerInfo.email,
          customer_phone: customerInfo.whatsapp,
          quantity: item.quantity,
          total_price: item.price * item.quantity,
          selected_date: item.date,
          selected_period: item.period,
          is_private: item.isPrivate,
          is_paid: false,
        }).select("id").single();

        if (error) throw error;
        if (data?.id) saleIds.push(data.id as string);
      }

      const response = await fetch(
        "https://ogzasprtfgimjqrtcseg.supabase.co/functions/v1/create-checkout",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            items: items.map(item => ({
              title: item.title,
              price: item.price,
              quantity: item.quantity,
              date: item.date,
              period: item.period,
            })),
            sale_ids: saleIds,
            customer: customerInfo,
            currency: "brl",
          }),
        }
      );
      
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Erro ao processar pagamento");
      }
    } catch (error) {
      alert(language === 'pt' ? "Erro ao processar pagamento" : "Error processing payment");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col pt-20 bg-muted/20">
      <Header />
      
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Items List */}
          <div className="flex-1 space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <ShoppingBag className="w-8 h-8 text-primary" />
              <h1 className="font-serif text-3xl font-bold">{t("meu_carrinho")}</h1>
            </div>

            {items.length === 0 ? (
              <div className="bg-card rounded-3xl p-12 text-center border border-border/50 shadow-sm">
                <p className="text-muted-foreground font-sans text-lg mb-8">{t("carrinho_vazio")}</p>
                <Link to="/#tours">
                  <Button className="font-sans px-8 h-12 rounded-full">
                    {t("explorar_passeios")}
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item, idx) => (
                  <div key={`${item.id}-${idx}`} className="bg-card rounded-2xl p-6 border border-border/50 shadow-sm flex flex-col sm:flex-row gap-6 group hover:shadow-md transition-all">
                    <div className="w-full sm:w-40 h-40 rounded-xl overflow-hidden flex-shrink-0 relative">
                      <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                      <div className="absolute top-2 right-2 bg-primary text-white text-[10px] font-black px-2 py-1 rounded-full shadow-lg">
                        {item.quantity}x
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <Link to={`/passeio/${item.slug || item.id}`} className="font-serif text-xl font-bold mb-1 group-hover:text-primary transition-colors block">
                        {item.title}
                      </Link>
                      {item.selected_option && (
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-[10px] font-black bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase tracking-widest border border-primary/20">
                            {item.selected_option.title}
                          </span>
                        </div>
                      )}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-sm text-muted-foreground font-sans">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-primary/70" />
                          <span className="font-medium">{format(new Date(item.date + 'T00:00:00'), "dd/MM/yyyy", { locale: dateLocale })}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-primary/70" />
                          <span className="capitalize font-medium">{item.period === 'morning' ? t('amanha') : item.period === 'afternoon' ? t('tarde') : t('noite')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-primary/70" />
                          <span className="font-medium">{t("grupo_privado")}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-primary/70" />
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => updateQuantity(item.id, item.date, item.period, Math.max(1, item.quantity - 1))}
                              className="w-6 h-6 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="font-medium w-8 text-center">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.date, item.period, item.quantity + 1)}
                              className="w-6 h-6 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <span className="text-muted-foreground text-xs">{item.quantity > 1 ? (language === 'pt' ? 'pessoas' : 'people') : (language === 'pt' ? 'pessoa' : 'person')}</span>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center gap-2">
                         <span className="text-xs text-muted-foreground uppercase font-black tracking-widest">{t("subtotal")}:</span>
                         <span className="text-lg font-black text-primary">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    </div>

                    <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start pt-4 sm:pt-0">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-full h-12 w-12"
                        onClick={() => removeFromCart(item.id, item.date, item.period)}
                      >
                        <Trash2 className="w-6 h-6" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                <div className="flex justify-start">
                   <Button variant="link" onClick={clearCart} className="text-muted-foreground text-xs hover:text-red-500 p-0 font-bold uppercase tracking-tighter">
                    {t("limpar_carrinho")}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Summary Sidebar */}
          {items.length > 0 && (
            <div className="w-full lg:w-96">
              <div className="bg-card rounded-3xl p-8 border border-border/50 shadow-2xl sticky top-24 bg-gradient-to-b from-card to-muted/10">
                <h2 className="font-serif text-2xl font-bold mb-8 border-b pb-4 flex items-center gap-2">
                   <CreditCard className="w-6 h-6 text-primary" />
                   {t("resumo_reserva")}
                </h2>
                
                <div className="space-y-6 mb-10">
                  {/* Customer Info */}
                  <div className="space-y-4">
                    <Label className="text-sm font-bold text-foreground">{language === 'pt' ? 'Seus Dados' : 'Your Details'}</Label>
                    <Input 
                      placeholder={language === 'pt' ? 'Nome completo' : 'Full name'} 
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                      className="h-11 rounded-xl"
                    />
                    <Input 
                      placeholder={language === 'pt' ? 'WhatsApp (com DDD)' : 'WhatsApp (with area code)'} 
                      value={customerInfo.whatsapp}
                      onChange={(e) => setCustomerInfo({...customerInfo, whatsapp: e.target.value})}
                      className="h-11 rounded-xl"
                    />
                    <Input 
                      type="email"
                      placeholder={language === 'pt' ? 'E-mail' : 'Email'} 
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                      className="h-11 rounded-xl"
                    />
                  </div>

                  <div className="flex justify-between font-sans text-muted-foreground">
                    <span className="font-medium">{t("subtotal")}</span>
                    <span className="font-bold">{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between font-sans text-muted-foreground">
                    <span className="font-medium">{t("taxas")}</span>
                    <span className="font-bold">{formatPrice(0)}</span>
                  </div>
                  <div className="flex justify-between font-sans text-2xl font-black text-foreground border-t border-dashed pt-6">
                    <span>{t("total")}</span>
                    <span className="text-primary">{formatPrice(total)}</span>
                  </div>
                </div>

                <Button onClick={handleCheckout} disabled={isProcessing} className="w-full h-18 py-4 rounded-2xl text-lg font-black shadow-xl shadow-primary/20 flex flex-col items-center justify-center gap-0 bg-primary hover:bg-primary/90 transition-all active:scale-95 group">
                  <div className="flex items-center gap-2">
                    {isProcessing ? (language === 'pt' ? "Processando..." : "Processing...") : t("pagar_agora")}
                    {!isProcessing && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                  </div>
                  <span className="text-[10px] opacity-80 font-normal uppercase tracking-[0.2em] mt-1">{t("pagamento_seguro")}</span>
                </Button>

                <div className="mt-8 space-y-4">
                  <div className="flex items-center gap-4 text-[10px] text-muted-foreground bg-background/50 p-4 rounded-2xl border border-dashed border-border">
                    <ShieldCheck className="w-8 h-8 text-green-600 flex-shrink-0" />
                    <p className="leading-relaxed">{t("seguranca_stripe")}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Cart;
