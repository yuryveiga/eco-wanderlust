Deno.serve(async (req) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, phone } = await req.json();

    if (!message || !phone) {
      return new Response(JSON.stringify({ error: "Message and phone are required" }), { status: 400, headers: corsHeaders });
    }

    // Use environment variables for WhatsApp credentials
    const username = Deno.env.get("WHATSAPP_USER") || "yury";
    const password = Deno.env.get("WHATSAPP_PASS") || "1234";

    const loginResponse = await fetch("https://zap-google-back-production.up.railway.app/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    if (!loginResponse.ok) {
      const errorText = await loginResponse.text();
      console.error("Login error:", errorText);
      return new Response(JSON.stringify({ error: "Failed to authenticate with WhatsApp server" }), { status: 500, headers: corsHeaders });
    }

    const { token } = await loginResponse.json();

    // Now send the message - need to get the chat ID first
    // The phone number needs to be formatted as chat ID: phone@c.us
    const chatId = `${phone}@c.us`;

    const sendResponse = await fetch("https://zap-google-back-production.up.railway.app/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        to: chatId,
        body: message
      })
    });

    if (!sendResponse.ok) {
      const errorText = await sendResponse.text();
      console.error("Send error:", errorText);
      return new Response(JSON.stringify({ error: "Failed to send message", details: errorText }), { status: 500, headers: corsHeaders });
    }

    const result = await sendResponse.json();
    return new Response(JSON.stringify({ success: true, ...result }), { headers: corsHeaders });

  } catch (error: any) {
    console.error("Function error:", error);
    return new Response(JSON.stringify({ error: error?.message }), { status: 500, headers: corsHeaders });
  }
})