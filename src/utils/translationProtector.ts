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
      const token = `__PROTECT_${index}__`;
      
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
 * Restores original names from tokens
 */
export function restore(text: string, replacements: Map<string, string>): string {
  let result = text;
  replacements.forEach((original, token) => {
    // Some translation APIs might add spaces inside our tokens (e.g. "__ PROTECT_0 __")
    // or change casing. We try to be flexible.
    const flexibleTokenRegex = new RegExp(`${token.replace(/_/g, '[\\s_]*')}`, 'gi');
    result = result.replace(flexibleTokenRegex, original);
  });
  return result;
}
