import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import { useLocale } from "@/contexts/LocaleContext";
import { useSiteData } from "@/hooks/useSiteData";
import { Button } from "@/components/ui/button";
import { Trash2, Calendar, Clock, ArrowRight, ShoppingBag, CreditCard, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { ptBR, enUS, es } from "date-fns/locale";

const Cart = () => {
  const { items, removeFromCart, total, clearCart } = useCart();
  const { t, language } = useLocale();
  const { siteSettings } = useSiteData();
  
  const dateLocale = language === 'en' ? enUS : language === 'es' ? es : ptBR;
  const stripeLink = siteSettings['stripe_payment_link'] || "#";

  const handleCheckout = () => {
    if (stripeLink === "#") {
      alert(language === 'pt' ? "Link de pagamento não configurado." : "Payment link not configured.");
      return;
    }
    // Redirect to Stripe or external payment
    window.location.href = stripeLink;
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
              <h1 className="font-serif text-3xl font-bold">{t("meu_carrinho") || "Meu Carrinho"}</h1>
            </div>

            {items.length === 0 ? (
              <div className="bg-card rounded-3xl p-12 text-center border border-border/50 shadow-sm">
                <p className="text-muted-foreground font-sans text-lg mb-8">{t("carrinho_vazio") || "Seu carrinho está vazio."}</p>
                <Link to="/#tours">
                  <Button className="font-sans px-8 h-12 rounded-full">
                    {t("explorar_passeios") || "Explorar Passeios"}
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item, idx) => (
                  <div key={`${item.id}-${idx}`} className="bg-card rounded-2xl p-6 border border-border/50 shadow-sm flex flex-col sm:flex-row gap-6 group hover:shadow-md transition-all">
                    <div className="w-full sm:w-32 h-32 rounded-xl overflow-hidden flex-shrink-0">
                      <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-serif text-xl font-bold mb-2">{item.title}</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 text-sm text-muted-foreground font-sans">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-primary/70" />
                          <span>{format(new Date(item.date + 'T00:00:00'), "dd/MM/yyyy", { locale: dateLocale })}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-primary/70" />
                          <span className="capitalize">{item.period === 'morning' ? t('amanha') : item.period === 'afternoon' ? t('tarde') : t('noite')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-primary/70" />
                          <span>{item.isPrivate ? t("grupo_privado") : t("open_grupo")}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-4">
                      <span className="text-xl font-bold text-primary">R$ {item.price * item.quantity}</span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-full"
                        onClick={() => removeFromCart(item.id, item.date, item.period)}
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                <Button variant="link" onClick={clearCart} className="text-muted-foreground text-xs hover:text-red-500">
                  {t("limpar_carrinho") || "Limpar Carrinho"}
                </Button>
              </div>
            )}
          </div>

          {/* Summary Sidebar */}
          {items.length > 0 && (
            <div className="w-full lg:w-96">
              <div className="bg-card rounded-3xl p-8 border border-border/50 shadow-xl sticky top-24">
                <h2 className="font-serif text-2xl font-bold mb-6 border-b pb-4">{t("resumo_reserva") || "Resumo"}</h2>
                
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between font-sans text-muted-foreground">
                    <span>{t("subtotal") || "Subtotal"}</span>
                    <span>R$ {total}</span>
                  </div>
                  <div className="flex justify-between font-sans text-muted-foreground">
                    <span>{t("taxas") || "Taxas"}</span>
                    <span>R$ 0</span>
                  </div>
                  <div className="flex justify-between font-sans text-xl font-bold text-foreground border-t pt-4">
                    <span>{t("total") || "Total"}</span>
                    <span className="text-primary">R$ {total}</span>
                  </div>
                </div>

                <Button onClick={handleCheckout} className="w-full h-16 rounded-2xl text-lg font-black shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  {t("pagar_agora") || "Pagar com Stripe"}
                  <ArrowRight className="w-5 h-5" />
                </Button>

                <div className="mt-8 space-y-4">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground bg-muted/30 p-3 rounded-xl">
                    <ShieldCheck className="w-10 h-10 text-green-600 flex-shrink-0" />
                    <p>{t("seguranca_stripe") || "Pagamento processado com segurança via Stripe. Seus dados estão protegidos."}</p>
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
