import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { JWT } from "https://esm.sh/google-auth-library@9?target=deno";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { saleId } = await req.json();
    
    // 1. Pegar dados da reserva
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { data: sale, error: fetchError } = await supabase
      .from("sales")
      .select("*")
      .eq("id", saleId)
      .single();

    if (fetchError || !sale) throw new Error("Venda não encontrada");

    // 2. Configurações do Google
    const GOOGLE_EMAIL = Deno.env.get("GOOGLE_SERVICE_ACCOUNT_EMAIL");
    const GOOGLE_KEY = Deno.env.get("GOOGLE_PRIVATE_KEY")?.replace(/\\n/g, "\n");
    const CALENDAR_ID = Deno.env.get("GOOGLE_CALENDAR_ID");

    if (!GOOGLE_EMAIL || !GOOGLE_KEY || !CALENDAR_ID) {
      throw new Error("Configurações do Google ausentes no servidor.");
    }

    const client = new JWT({
      email: GOOGLE_EMAIL,
      key: GOOGLE_KEY,
      scopes: ["https://www.googleapis.com/auth/calendar.events"],
    });

    const token = await client.getAccessToken();

    // 3. Preparar Evento
    const startDate = new Date(sale.selected_date);
    if (sale.selected_period === "Manhã") startDate.setHours(9, 0, 0);
    else if (sale.selected_period === "Tarde") startDate.setHours(14, 0, 0);
    else startDate.setHours(10, 0, 0);

    const endDate = new Date(startDate);
    endDate.setHours(startDate.getHours() + 4);

    const event = {
      summary: `Reserva: ${sale.tour_title} - ${sale.customer_name}`,
      description: `Cliente: ${sale.customer_name}\nEmail: ${sale.customer_email}\nStatus: Sincronizado Manualmente`,
      start: { dateTime: startDate.toISOString(), timeZone: "America/Sao_Paulo" },
      end: { dateTime: endDate.toISOString(), timeZone: "America/Sao_Paulo" },
      colorId: "5", // Amarelo para diferenciar do automático
    };

    // 4. Enviar para o Google
    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CALENDAR_ID)}/events`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      }
    );

    if (!response.ok) throw new Error(await response.text());

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
