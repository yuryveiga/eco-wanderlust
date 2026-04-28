import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'

Deno.serve(async (req) => {
  try {
    // Esta função será chamada pelo botão do Admin
    // Como Deno (Edge Functions) não roda Playwright facilmente, 
    // a melhor forma é disparar o GitHub Action via API.
    
    const GITHUB_TOKEN = Deno.env.get('GITHUB_TOKEN');
    const GITHUB_REPO = Deno.env.get('GITHUB_REPO'); // formato: usuario/repositorio
    
    if (!GITHUB_TOKEN || !GITHUB_REPO) {
      return new Response(
        JSON.stringify({ error: 'Configuração pendente: GITHUB_TOKEN ou GITHUB_REPO não encontrados.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const response = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/dispatches`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event_type: 'sync-matches-trigger'
      }),
    });

    if (response.ok) {
      return new Response(
        JSON.stringify({ message: 'Sincronização disparada via GitHub Actions!' }),
        { headers: { 'Content-Type': 'application/json' } }
      )
    } else {
      const err = await response.text();
      throw new Error(err);
    }

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
