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
    const { items, sale_ids, customer, currency = "brl" } = await req.json();

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");

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

    console.log("Processing checkout for items:", JSON.stringify(items));
    
    // Calculate totals in cents for better precision
    const subtotalCents = items.reduce((acc: number, item: any) => {
      const price = parseFloat(item.price);
      const quantity = parseInt(item.quantity);
      return acc + Math.round(price * 100 * quantity);
    }, 0);
    
    const feeCents = Math.round(subtotalCents * 0.05);
    const totalCents = subtotalCents + feeCents;

    console.log(`Subtotal: ${subtotalCents} cents, Fee: ${feeCents} cents, Total: ${totalCents} cents`);

    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: currency,
        product_data: {
          name: item.title,
          description: `${item.quantity} pessoa(s) - ${item.date} ${item.period}`,
        },
        unit_amount: Math.round(parseFloat(item.price) * 100),
      },
      quantity: parseInt(item.quantity),
    }));

    // Add 5% Service Fee
    if (feeCents > 0) {
      lineItems.push({
        price_data: {
          currency: currency,
          product_data: {
            name: "Taxa de Serviço (5%)",
            description: "Taxa de reserva e processamento",
          },
          unit_amount: feeCents,
        },
        quantity: 1,
      });
    }

    // Metadata for attribution
    const metadata: any = {
      sale_ids: JSON.stringify(sale_ids || []),
      source_platform: "Tocorime Rio",
      attribution_origin: "https://tocorime.com.br",
      total_with_fee_cents: totalCents.toString()
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
