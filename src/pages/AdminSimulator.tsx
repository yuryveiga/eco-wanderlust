import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { fetchLovable, insertLovable, LovableTour } from "@/integrations/lovable/client";
import { Play, Calendar, CheckCircle, AlertTriangle } from "lucide-react";

const AdminSimulator = () => {
  const [tours, setTours] = useState<LovableTour[]>([]);
  const [selectedTourId, setSelectedTourId] = useState("");
  const [customerName, setCustomerName] = useState("Cliente de Teste");
  const [customerEmail, setCustomerEmail] = useState("teste@exemplo.com");
  const [bookingDate, setBookingDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedPeriod, setSelectedPeriod] = useState("Manhã");
  const [isSimulating, setIsSimulating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchLovable<LovableTour>("tours").then(setTours);
  }, []);

  const runSimulation = async () => {
    if (!selectedTourId) {
      toast({ title: "Erro", description: "Selecione um passeio", variant: "destructive" });
      return;
    }

    setIsSimulating(true);
    try {
      const tour = tours.find(t => t.id === selectedTourId);
      
      // 1. Criar a reserva (sale) como pendente
      toast({ title: "Passo 1/3", description: "Criando reserva no banco de dados..." });
      
      const newSale = await insertLovable<any>("sales", {
        tour_id: selectedTourId,
        tour_title: tour?.title || "Passeio de Teste",
        tour_slug: tour?.slug || "teste",
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: "(21) 99999-9999",
        quantity: 1,
        total_price: tour?.price || 100,
        selected_date: bookingDate,
        selected_period: selectedPeriod,
        is_private: false,
        is_paid: false
      });

      if (!newSale?.id) throw new Error("Falha ao criar venda");

      // 2. Simular a confirmação de pagamento
      toast({ title: "Passo 2/3", description: "Simulando confirmação de pagamento..." });
      
      const { error: updateError } = await supabase
        .from("sales")
        .update({ is_paid: true })
        .eq("id", newSale.id);

      if (updateError) throw updateError;

      // 3 & 4. Executar integrações em paralelo para maior performance
      toast({ title: "Processando...", description: "Sincronizando agenda e enviando e-mails..." });
      
      const emailPayload = {
        customerName,
        customerEmail,
        customerPhone: "(21) 99999-9999",
        total: tour?.price || 100,
        selectedPeriod,
        isPrivate: false,
        items: [{
          tour: tour?.title || "Passeio de Teste",
          quantity: 1,
          price: tour?.price || 100,
          date: bookingDate
        }]
      };

      const [syncResponse, adminEmailResponse, customerEmailResponse] = await Promise.all([
        // Step 3: Google Agenda
        supabase.functions.invoke("sync-calendar", { body: { saleId: newSale.id } }),
        
        // Step 4: Admin Email
        supabase.functions.invoke("send-alert-email", {
          body: { ...emailPayload, to: `tocorimeriotours@gmail.com, veiga.yury@gmail.com, ${customerEmail}`, isCustomerCopy: false }
        }),
        
        // Step 4: Customer Email
        supabase.functions.invoke("send-alert-email", {
          body: { ...emailPayload, to: customerEmail, isCustomerCopy: true, replyTo: "tocorimeriotours@gmail.com" }
        })
      ]);

      if (syncResponse.error || syncResponse.data?.error) {
        console.error("Erro no calendário:", syncResponse.error || syncResponse.data?.error);
      }
      
      if (adminEmailResponse.error) console.error("Erro no e-mail do admin:", adminEmailResponse.error);
      if (customerEmailResponse.error) console.error("Erro no e-mail do cliente:", customerEmailResponse.error);

      toast({ 
        title: "Sucesso!", 
        description: `Reserva para ${bookingDate} concluída com sucesso!`, 
      });

    } catch (error: any) {
      console.error(error);
      toast({ title: "Erro na simulação", description: error.message, variant: "destructive" });
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-6">
      <Card className="border-2 border-primary/20 shadow-xl overflow-hidden">
        <div className="h-2 bg-primary" />
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl font-bold">
            <Play className="text-primary fill-primary w-8 h-8" />
            Simulador de Reserva Completo
          </CardTitle>
          <CardDescription>
            Teste o processamento de pagamentos e a integração com o Google Agenda em tempo real.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="tour-select" className="text-sm font-semibold">Passeio Desejado</Label>
            <select
              id="tour-select"
              value={selectedTourId}
              onChange={(e) => setSelectedTourId(e.target.value)}
              className="w-full h-11 rounded-lg border-2 border-muted bg-background px-3 py-2 focus:border-primary transition-colors"
            >
              <option value="">Selecione o passeio para simular</option>
              {tours.map(t => (
                <option key={t.id} value={t.id}>{t.title}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customer-name" className="text-sm font-semibold">Nome do Cliente</Label>
              <Input 
                id="customer-name"
                className="h-11 border-2 border-muted"
                value={customerName} 
                onChange={e => setCustomerName(e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customer-email" className="text-sm font-semibold">Email (Google Agenda)</Label>
              <Input 
                id="customer-email"
                className="h-11 border-2 border-muted"
                type="email"
                value={customerEmail} 
                onChange={e => setCustomerEmail(e.target.value)} 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="booking-date" className="text-sm font-semibold">Data da Reserva</Label>
              <Input 
                id="booking-date"
                type="date" 
                className="h-11 border-2 border-muted"
                value={bookingDate} 
                onChange={e => setBookingDate(e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="period-select" className="text-sm font-semibold">Período / Turno</Label>
              <select
                id="period-select"
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="w-full h-11 rounded-lg border-2 border-muted bg-background px-3 py-2 focus:border-primary transition-colors"
              >
                <option value="Manhã">Manhã (09h)</option>
                <option value="Tarde">Tarde (14h)</option>
                <option value="Outro">Outro (10h default)</option>
              </select>
            </div>
          </div>

          <div className="bg-primary/5 border-l-4 border-primary p-5 rounded-r-lg flex gap-4 text-primary/80 text-sm italic">
            <AlertTriangle className="w-6 h-6 shrink-0 text-primary" />
            <p className="leading-relaxed">
              <strong>Simulação Real:</strong> Esta ferramenta cria um registro de venda no banco e aciona o 
              fluxo de backend. Certifique-se de que a Edge Function <code className="bg-primary/10 px-1 rounded">sync-calendar</code> 
              esteja implantada.
            </p>
          </div>

          <Button 
            className="w-full h-14 text-xl font-black bg-primary hover:bg-primary/90 shadow-lg transition-all active:scale-[0.98]" 
            onClick={runSimulation}
            disabled={isSimulating}
          >
            {isSimulating ? "PROCESSANDO FLUXO..." : "EXECUTAR SIMULAÇÃO COMPLETA"}
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: Calendar, label: "Agenda", status: "Integrado", sub: "Google API" },
          { icon: CheckCircle, label: "Database", status: "Conectado", sub: "Supabase" },
          { icon: Play, label: "Stripe", status: "Simulado", sub: "Webhook" },
        ].map((item, idx) => (
          <div key={idx} className="p-4 bg-muted/30 border border-muted rounded-2xl text-center group hover:bg-white hover:shadow-md transition-all">
            <item.icon className="w-8 h-8 mx-auto mb-3 text-primary/60 group-hover:text-primary transition-colors" />
            <div className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">{item.label}</div>
            <div className="text-sm font-bold text-foreground">{item.status}</div>
            <div className="text-[10px] text-muted-foreground">{item.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminSimulator;
