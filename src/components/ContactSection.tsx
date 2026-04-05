import { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useLocale } from "@/contexts/LocaleContext";

export function ContactSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { t } = useLocale();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1000));
    toast({ title: t("msg_enviada"), description: t("contato_breve") });
    (e.target as HTMLFormElement).reset();
    setIsSubmitting(false);
  };

  return (
    <section id="contact" className="py-20 lg:py-28 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 lg:mb-16">
          <p className="text-primary font-medium mb-3 font-sans">{t("entre_contato")}</p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
            {t("pronto_aventura")}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-sans">
            {t("contato_desc")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          <div>
            <h3 className="font-serif text-2xl font-semibold text-foreground mb-6">{t("info_contato")}</h3>
            <div className="space-y-6 mb-8">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1 font-sans">{t("email")}</h4>
                  <a href="mailto:contato@passeiorio.com" className="text-muted-foreground hover:text-primary transition-colors font-sans">contato@passeiorio.com</a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1 font-sans">WhatsApp</h4>
                  <a href="https://wa.me/5521999999999" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors font-sans">+55 21 99999-9999</a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1 font-sans">{t("rio_janeiro")}</h4>
                  <p className="text-muted-foreground font-sans">Rio de Janeiro, Brasil</p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-2xl p-6 border border-border/50">
              <h4 className="font-semibold text-foreground mb-2 font-sans">{t("horario_atenda")}</h4>
              <p className="text-muted-foreground text-sm font-sans">{t("set_dom")}</p>
              <p className="text-muted-foreground text-sm font-sans">{t("wa_24h")}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="bg-card rounded-2xl p-8 shadow-lg border border-border/50 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="font-sans">{t("nome")}</Label>
                <Input id="name" name="name" required placeholder={t("seu_nome")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="font-sans">{t("email")}</Label>
                <Input id="email" name="email" type="email" required placeholder={t("seu_email")} />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="font-sans">{t("telefone")}</Label>
                <Input id="phone" name="phone" placeholder="+55 21 99999-9999" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tour" className="font-sans">{t("passeio_interesse")}</Label>
                <Select name="tour_interest">
                  <SelectTrigger>
                    <SelectValue placeholder={t("selecione_passeio")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="city-tour">City Tour Rio Completo</SelectItem>
                    <SelectItem value="arraial">Arraial do Cabo</SelectItem>
                    <SelectItem value="angra">Angra dos Reis</SelectItem>
                    <SelectItem value="cristo-pao">Cristo & Pão de Açúcar</SelectItem>
                    <SelectItem value="trilha">Trilha da Pedra Bonita</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="message" className="font-sans">{t("mensagem")}</Label>
              <Textarea id="message" name="message" required placeholder={t("conte_planos")} rows={4} />
            </div>
            <Button type="submit" size="lg" className="w-full font-sans" disabled={isSubmitting}>
              <Send className="w-4 h-4 mr-2" />
              {isSubmitting ? t("enviando") : t("enviar_mensagem")}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
