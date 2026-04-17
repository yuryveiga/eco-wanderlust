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
      // Join multiple segments. Sometimes Google splits long sentences.
      // We join them and then clean up any double spaces that might result,
      // but primarily we remove the invisible characters that cause line break issues.
      let translated = (data[0] as string[][])
        .map((s) => s[0])
        .join('');

      // Replace literal "&nbsp;" strings AND the \u00A0 Unicode character with a regular space
      translated = translated
        .replace(/&nbsp;/g, ' ')
        .replace(/[\u200B\u00AD\u00A0]/g, ' ')
        .replace(/[^\n\r\S]+/g, ' ') // Collapse multiple SPACES (preserve \n)
        .trim();

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

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
  async function translateNode(node: Node) {
    if (node.nodeType === Node.TEXT_NODE && node.textContent) {
      const translated = await translateText(node.textContent, targetLang);
      node.textContent = translated;
    } else {
      const children = Array.from(node.childNodes);
      for (const child of children) {
        await translateNode(child);
      }
    }
  }

  await translateNode(doc.body);

  // Post-processing to ensure spaces around tags like <strong> and <a>
  // Sometimes translation engines trim whitespace that's needed for HTML rendering.
  let result = doc.body.innerHTML;
  
  // Ensure space after closing tags and before opening tags of inline elements
  // only if they are missing.
  result = result
    .replace(/<\/strong>([^\s.,!?;:]) /g, '</strong> $1') // If no space after strong, add one
    .replace(/([^\s])<strong>/g, '$1 <strong>')         // If no space before strong, add one
    .replace(/<\/a>([^\s.,!?;:]) /g, '</a> $1')           // Same for links
    .replace(/([^\s])<a/g, '$1 <a');                      // Same for links
    
  return result;
}
