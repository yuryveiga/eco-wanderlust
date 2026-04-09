Deno.serve(async (req) => {
  try {
    const { to, customerName, customerEmail, customerPhone, items, total } = await req.json()

    if (!to) {
      return new Response(JSON.stringify({ error: 'Email não configurado' }), { status: 400 })
    }

    const itemsHtml = items.map((item: any) => 
      `<li>${item.tour} - ${item.quantity} pessoa(s) - R$ ${item.price.toFixed(2)} - Data: ${item.date}</li>`
    ).join('')

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2A9D8F;">Nova Reserva!</h2>
        <p><strong>Cliente:</strong> ${customerName}</p>
        <p><strong>Email:</strong> ${customerEmail}</p>
        <p><strong>WhatsApp:</strong> ${customerPhone}</p>
        <h3>Itens:</h3>
        <ul>${itemsHtml}</ul>
        <p><strong>Total:</strong> R$ ${total.toFixed(2)}</p>
        <p style="color: #666; font-size: 12px;">Enviado automaticamente pelo sistema de reservas</p>
      </div>
    `

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Eco-Wanderlust <noreply@ecowanderlust.com>',
        to: to,
        subject: '🔔 Nova Reserva Recebida!',
        html: htmlContent
      })
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Email error:', error)
      return new Response(JSON.stringify({ error }), { status: 500 })
    }

    return new Response(JSON.stringify({ success: true }), { headers: { 'Content-Type': 'application/json' } })
  } catch (error) {
    console.error('Function error:', error)
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }
})