import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@13?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

/**
 * Creates an event in Google Calendar using a Service Account
 */
async function createGoogleCalendarEvent(sale: Record<string, any>) {
  const GOOGLE_EMAIL = Deno.env.get("GOOGLE_SERVICE_ACCOUNT_EMAIL");
  const GOOGLE_KEY = Deno.env.get("GOOGLE_PRIVATE_KEY")?.replace(/\\n/g, "\n");
  const CALENDAR_ID = Deno.env.get("GOOGLE_CALENDAR_ID");

  if (!GOOGLE_EMAIL || !GOOGLE_KEY || !CALENDAR_ID) {
    console.warn("Google Calendar credentials missing. Skipping event creation.");
    return;
  }

  try {
    // 1. Get Access Token using JWT
    const now = Math.floor(Date.now() / 1000);
    const header = { alg: "RS256", typ: "JWT" };
    const payload = {
      iss: GOOGLE_EMAIL,
      sub: GOOGLE_EMAIL,
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600,
      scope: "https://www.googleapis.com/auth/calendar.events",
    };

    // We use a helper or manual signing here. 
    // For simplicity in this demo environment, we'll assume the user will configure a bridge 
    // or we can use a library if available. 
    // However, to be "ready" as requested, I'll implement the logic using a standard library.
    
    const { JWT } = await import("https://esm.sh/google-auth-library@9?target=deno");
    const client = new JWT({
      email: GOOGLE_EMAIL,
      key: GOOGLE_KEY,
      scopes: ["https://www.googleapis.com/auth/calendar.events"],
    });

    const token = await client.getAccessToken();
    
    // 2. Clear date formatting
    const startDate = new Date(sale.selected_date);
    // Adjust time based on period
    if (sale.selected_period === "Manhã") startDate.setHours(9, 0, 0);
    else if (sale.selected_period === "Tarde") startDate.setHours(14, 0, 0);
    else if (sale.selected_period === "Noite") startDate.setHours(19, 0, 0);
    else startDate.setHours(10, 0, 0);

    const endDate = new Date(startDate);
    endDate.setHours(startDate.getHours() + 4); // Default 4 hours duration

    const event = {
      summary: `Reserva: ${sale.tour_title} - ${sale.customer_name}`,
      description: `
        Cliente: ${sale.customer_name}
        Email: ${sale.customer_email}
        Telefone: ${sale.customer_phone}
        Pessoas: ${sale.quantity}
        Tipo: ${sale.is_private ? 'Privativo' : 'Grupo Aberto'}
        Total: R$ ${sale.total_price}
        Status: Pago via Stripe
      `.trim(),
      start: {
        dateTime: startDate.toISOString(),
        timeZone: "America/Sao_Paulo",
      },
      end: {
        dateTime: endDate.toISOString(),
        timeZone: "America/Sao_Paulo",
      },
      colorId: "2", // Sage color
    };

    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Google Calendar API error: ${error}`);
    }

    console.log(`Event created successfully for sale ${sale.id}`);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Error creating Google Calendar event:", message);
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!stripeKey || !webhookSecret || !supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing environment variables");
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
    });

    const signature = req.headers.get("stripe-signature");
    if (!signature) {
      throw new Error("No signature");
    }

    const body = await req.text();
    let event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      console.error(`Webhook signature verification failed: ${message}`);
      return new Response(`Webhook Error: ${message}`, { status: 400 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as any;
      const saleIdsStr = session.metadata?.sale_ids;
      
      if (saleIdsStr) {
        const saleIds = JSON.parse(saleIdsStr);
        console.log(`Processing payment for sales: ${saleIds.join(", ")}`);

        for (const id of saleIds) {
          // 1. Mark as paid
          const { data: sale, error: updateError } = await supabase
            .from("sales")
            .update({ is_paid: true })
            .eq("id", id)
            .select()
            .single();
          
          if (updateError) {
            console.error(`Error updating sale ${id}:`, updateError);
            continue;
          }

          console.log(`Sale ${id} marked as paid. Creating Calendar event...`);

          // 2. Create Google Calendar Appointment
          await createGoogleCalendarEvent(sale);
        }
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Webhook error:", message);
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
