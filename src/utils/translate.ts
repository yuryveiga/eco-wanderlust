import { protect, restore } from "./translationProtector";

export async function translateText(text: string, targetLang: 'en' | 'es', sourceLang: string = 'pt'): Promise<string> {
  if (!text || text.trim() === "") return "";
  
  try {
    const { protectedText, replacements } = protect(text);
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(protectedText)}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data && data[0]) {
      const translated = (data[0] as string[][]).map((s) => s[0]).join('');
      return restore(translated, replacements);
    }
    return text;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Translation failed";
    console.error("Translation API error:", message);
    throw new Error(message);
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
    if (node.nodeType === Node.TEXT_NODE && node.textContent) {
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
