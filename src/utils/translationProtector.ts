/**
 * Utility to protect proper names during translation
 */

const PROTECTED_NAMES = [
  "Tocorime Rio",
  "Rio",
  "Pedra da Gávea",
  "Angra dos Reis",
  "Arraial do Cabo",
  "Búzios",
  "Petrópolis",
  "Maracanã",
  "Cristo Redentor",
  "Pão de Açúcar",
  "Pedra Bonita",
  "Pedra do Telégrafo",
  "Ipanema",
  "Copacabana",
  "Leblon",
  "Lapa",
  "Santa Marta",
  "Marius"
];

export interface ProtectedText {
  protectedText: string;
  replacements: Map<string, string>;
}

/**
 * Build a token that translation engines preserve as a single unit
 * and that won't get glued to adjacent words.
 * Using a capitalized "word-like" token surrounded by spaces works much
 * better than `__PROTECT_0__` (which Google Translate often glues to
 * neighboring words, producing "tourRioguide" style artifacts).
 */
function makeToken(index: number): string {
  // e.g. "Xqzaa", "Xqzab"... — looks like a proper noun, stays intact,
  // and the translator keeps spaces around it.
  const suffix = index.toString(36).padStart(2, "a");
  return `Xqz${suffix}`;
}

/**
 * Replaces protected names with tokens
 */
export function protect(text: string): ProtectedText {
  const replacements = new Map<string, string>();
  let result = text;

  // Sort by length descending to match longer phrases first (e.g. "Angra dos Reis" before "Reis")
  const sortedNames = [...PROTECTED_NAMES].sort((a, b) => b.length - a.length);

  sortedNames.forEach((name, index) => {
    // Regex for exact word/phrase match, case insensitive
    const regex = new RegExp(`\\b${name}\\b`, 'gi');

    // We only replace if it's actually in the text
    if (regex.test(result)) {
      const token = makeToken(index);

      // Store the exact original casing found
      const matches = text.match(regex);
      if (matches && matches[0]) {
        replacements.set(token, matches[0]);
        result = result.replace(regex, token);
      }
    }
  });

  return { protectedText: result, replacements };
}

/**
 * Restores original names from tokens.
 * Also fixes cases where the translator glued the token to adjacent words
 * (e.g. "theXqzaaguide" -> "the Rio guide").
 */
export function restore(text: string, replacements: Map<string, string>): string {
  let result = text;
  replacements.forEach((original, token) => {
    // Case-insensitive match, no word boundary so it also catches glued cases
    const regex = new RegExp(token, 'gi');
    result = result.replace(regex, ` ${original} `);
  });

  // Collapse multiple spaces and trim spaces around punctuation
  result = result.replace(/[ \t]{2,}/g, ' ');
  result = result.replace(/\s+([.,;:!?)])/g, '$1');
  result = result.replace(/([(])\s+/g, '$1');
  return result.trim();
}
