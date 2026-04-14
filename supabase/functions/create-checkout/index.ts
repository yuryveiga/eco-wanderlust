import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@13?target=deno";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { items, sale_ids, customer, currency = "brl", usePartnerStripe = false } = await req.json();

    // Select Stripe Key
    let stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (usePartnerStripe) {
      const partnerKey = Deno.env.get("PARTNER_STRIPE_SECRET_KEY");
      if (partnerKey) {
        stripeKey = partnerKey;
        console.log("Using Partner Stripe Key for match booking");
      } else {
        console.warn("PARTNER_STRIPE_SECRET_KEY not found, falling back to default");
      }
    }

    if (!stripeKey) {
      throw new Error("Stripe API key not configured");
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
    });

    if (!items || items.length === 0) {
      return new Response(
        JSON.stringify({ error: "Carrinho vazio" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const origin = req.headers.get("origin") || req.headers.get("referer")?.replace(/\/$/, "") || "https://tocorimerio.lovable.app";

    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: currency,
        product_data: {
          name: item.title,
          description: `${item.quantity} pessoa(s) - ${item.date} ${item.period}`,
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    // Metadata for attribution
    const metadata: any = {
      sale_ids: JSON.stringify(sale_ids || []),
      source_platform: "Tocorime Rio",
      attribution_origin: "https://tocorime.com.br",
    };

    if (customer?.email) metadata.customer_email = customer.email;
    if (customer?.whatsapp) metadata.customer_phone = customer.whatsapp;

    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: "payment",
      success_url: `${origin}/confirmacao?sale_ids=${encodeURIComponent(JSON.stringify(sale_ids))}`,
      cancel_url: `${origin}/carrinho?canceled=true`,
      customer_email: customer?.email,
      metadata: metadata,
    });

    return new Response(
      JSON.stringify({ url: session.url }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Checkout error:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
