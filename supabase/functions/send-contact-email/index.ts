import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { to, senderName, senderEmail, senderPhone, tourInterest, message } = await req.json();

    if (!to) {
      throw new Error("E-mail de destino não fornecido");
    }

    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY não configurada");
    }

    const subject = `Novo Contato do Site: ${senderName}`;
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #eee; border-radius: 10px; }
          .header { background: #2A9D8F; color: white; padding: 10px 20px; border-radius: 10px 10px 0 0; }
          .content { padding: 20px; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; color: #2A9D8F; }
          .message { background: #f9f9f9; padding: 15px; border-radius: 5px; margin-top: 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Novo Contato - Tocorime Rio</h1>
          </div>
          <div class="content">
            <div class="field">
              <span class="label">Nome:</span> ${senderName}
            </div>
            <div class="field">
              <span class="label">E-mail:</span> ${senderEmail}
            </div>
            <div class="field">
              <span class="label">Telefone:</span> ${senderPhone || "Não informado"}
            </div>
            <div class="field">
              <span class="label">Passeio de Interesse:</span> ${tourInterest || "Não selecionado"}
            </div>
            <div class="field">
              <span class="label">Mensagem:</span>
              <div class="message">${message.replace(/\n/g, "<br>")}</div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Tocorime Rio <contato@tocorimerio.com>",
        to: [to],
        reply_to: senderEmail,
        subject: subject,
        html: htmlContent,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Resend error:", errorData);
      throw new Error("Erro ao enviar e-mail via Resend");
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Function error:", error?.message);
    return new Response(JSON.stringify({ error: error?.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
