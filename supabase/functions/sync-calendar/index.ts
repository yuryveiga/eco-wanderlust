import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Base64url encode
function base64url(data: Uint8Array): string {
  let binary = "";
  for (const byte of data) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64urlStr(str: string): string {
  return base64url(new TextEncoder().encode(str));
}

// Import PEM private key for RS256
// Standard base64 decode (handles padding)
function decodeBase64(b64: string): Uint8Array {
  const binString = atob(b64);
  const bytes = new Uint8Array(binString.length);
  for (let i = 0; i < binString.length; i++) {
    bytes[i] = binString.charCodeAt(i);
  }
  return bytes;
}

async function importPrivateKey(pem: string): Promise<CryptoKey> {
  // Remove PEM headers/footers and all whitespace
  const pemContents = pem
    .replace(/-----BEGIN (?:RSA )?PRIVATE KEY-----/g, "")
    .replace(/-----END (?:RSA )?PRIVATE KEY-----/g, "")
    .replace(/[\r\n\s]/g, "");
  
  const binaryDer = decodeBase64(pemContents);
  return crypto.subtle.importKey(
    "pkcs8",
    binaryDer,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  );
}

// Create a signed JWT for Google APIs
async function createGoogleJWT(email: string, key: string, scopes: string[]): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = base64urlStr(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = base64urlStr(JSON.stringify({
    iss: email,
    sub: email,
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
    scope: scopes.join(" "),
  }));
  const signingInput = `${header}.${payload}`;
  const privateKey = await importPrivateKey(key);
  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    privateKey,
    new TextEncoder().encode(signingInput)
  );
  return `${signingInput}.${base64url(new Uint8Array(signature))}`;
}

// Exchange JWT for access token
async function getAccessToken(email: string, key: string): Promise<string> {
  const jwt = await createGoogleJWT(email, key, [
    "https://www.googleapis.com/auth/calendar.events",
  ]);
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });
  if (!res.ok) throw new Error(`Token exchange failed: ${await res.text()}`);
  const data = await res.json();
  return data.access_token;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { saleId } = await req.json();
    
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

    const GOOGLE_EMAIL = Deno.env.get("GOOGLE_SERVICE_ACCOUNT_EMAIL");
    const GOOGLE_KEY = Deno.env.get("GOOGLE_PRIVATE_KEY")?.replace(/\\n/g, "\n");
    const CALENDAR_ID = Deno.env.get("GOOGLE_CALENDAR_ID");

    if (!GOOGLE_EMAIL || !GOOGLE_KEY || !CALENDAR_ID) {
      throw new Error("Configurações do Google ausentes no servidor.");
    }

    const token = await getAccessToken(GOOGLE_EMAIL, GOOGLE_KEY);

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
      colorId: "5",
    };

    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CALENDAR_ID)}/events`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
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
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Erro desconhecido";
    return new Response(JSON.stringify({ error: message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
