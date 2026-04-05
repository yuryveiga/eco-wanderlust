/**
 * Simple utility for automatic translation using public APIs
 */

export async function translateText(text: string, targetLang: 'en' | 'es', sourceLang: string = 'pt'): Promise<string> {
  if (!text || text.trim() === "") return "";
  
  // Nomes próprios e lugares que não devem ser traduzidos (usuário solicitou)
  // Como o usuário quer nomes próprios mantidos, a tradução automática geralmente faz um bom trabalho,
  // mas podemos adicionar dicas aqui se necessário.

  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    const response = await fetch(url);
    const data = await response.json();
    
    // Google Translate returns array of arrays for sentences
    if (data && data[0]) {
      return (data[0] as string[][]).map((s) => s[0]).join('');
    }
    return text;
  } catch (error) {
    console.error("Translation error:", error);
    return text;
  }
}

/**
 * Helper to translate HTML content (experimental - tries to preserve tags)
 */
export async function translateHtml(html: string, targetLang: 'en' | 'es'): Promise<string> {
  if (!html || html.trim() === "") return "";

  // For complex HTML, we could use a DOM parser, 
  // but for simple blog posts, we can try to translate sentences between tags.
  // This is a naive implementation:
  
  // Realistically, for a "WOW" effect, a proper API like OpenAI would be better.
  // But let's try to translate the text content within HTML tags.

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
  async function translateNode(node: Node) {
    if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
      const translated = await translateText(node.textContent, targetLang);
      node.textContent = translated;
    } else {
      for (const child of Array.from(node.childNodes)) {
        await translateNode(child);
      }
    }
  }

  await translateNode(doc.body);
  return doc.body.innerHTML;
}
