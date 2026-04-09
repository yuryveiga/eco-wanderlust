/**
 * Formats a match date always in America/Sao_Paulo timezone,
 * regardless of the user's local timezone.
 */

const RIO_TZ = 'America/Sao_Paulo';

export function getMatchDateInRio(dateStr: string): Date {
  // Parse the date and get its representation in Rio timezone
  const date = new Date(dateStr);
  // Get the Rio timezone offset string
  const rioStr = date.toLocaleString('en-US', { timeZone: RIO_TZ });
  return new Date(rioStr);
}

export function formatMatchDate(dateStr: string, options: Intl.DateTimeFormatOptions & { locale?: string } = {}): string {
  const { locale = 'en-US', ...formatOptions } = options;
  const date = new Date(dateStr);
  return date.toLocaleString(locale, { ...formatOptions, timeZone: RIO_TZ });
}

export function getMatchHour(dateStr: string): string {
  const d = getMatchDateInRio(dateStr);
  const h = d.getHours().toString().padStart(2, '0');
  const m = d.getMinutes().toString().padStart(2, '0');
  return `${h}h${m}`;
}

export function getMatchDay(dateStr: string): number {
  return getMatchDateInRio(dateStr).getDate();
}

export function getMatchMonth(dateStr: string): number {
  return getMatchDateInRio(dateStr).getMonth();
}

export function getMatchYear(dateStr: string): number {
  return getMatchDateInRio(dateStr).getFullYear();
}

/**
 * Check if a match date falls on the same day as `day`, using Rio timezone.
 */
export function isMatchOnDay(matchDateStr: string, day: Date): boolean {
  const rio = getMatchDateInRio(matchDateStr);
  return rio.getDate() === day.getDate() &&
         rio.getMonth() === day.getMonth() &&
         rio.getFullYear() === day.getFullYear();
}

/**
 * Generate a deterministic "display" spot count for urgency/scarcity.
 * Uses a hash of the match ID to produce a consistent number between min and max.
 */
export function getDisplaySpots(matchId: string, realSpots: number, soldCount: number): number {
  const realLeft = realSpots - soldCount;
  if (realLeft <= 0) return 0;
  // Generate a deterministic number from the match ID
  let hash = 0;
  for (let i = 0; i < matchId.length; i++) {
    hash = ((hash << 5) - hash) + matchId.charCodeAt(i);
    hash |= 0;
  }
  // Range: 3 to 8 spots displayed
  const fakeSpots = 3 + (Math.abs(hash) % 6);
  // Never show more than real spots
  return Math.min(fakeSpots, realLeft);
}
