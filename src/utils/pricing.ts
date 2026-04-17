/**
 * Pricing utilities for calculating tour costs based on different models.
 * Robust to strings and non-numeric values that may arrive from API.
 */

export type PricingTour = {
  price: number;
  pricing_model?: 'fixed' | 'dynamic' | 'group' | 'custom' | string;
  price_1_person?: number;
  price_2_people?: number;
  price_3_6_people?: number;
  price_7_19_people?: number;
  use_custom_options?: boolean;
  custom_options_json?: any;
};

/**
 * Safely converts a value to a positive number.
 */
function asNumber(val: any): number {
  if (val === null || val === undefined) return 0;
  const n = Number(val);
  return isNaN(n) ? 0 : n;
}

/**
 * Calculates the absolute minimum base price per person for a tour.
 * This looks across all dynamic pricing tiers and custom options to find the lowest possible cost.
 */
export function getTourMinPrice(tour: PricingTour): number {
  if (!tour) return 0;

  let prices: number[] = [];

  // Base price (often used for fixed or group models)
  const basePrice = asNumber(tour.price);
  if (basePrice > 0) prices.push(basePrice);

  // Dynamic per-person tiers - adding all valid prices to find the minimum
  const p1 = asNumber(tour.price_1_person);
  if (p1 > 0) prices.push(p1);
  
  const p2 = asNumber(tour.price_2_people);
  if (p2 > 0) prices.push(p2);
  
  const p36 = asNumber(tour.price_3_6_people);
  if (p36 > 0) prices.push(p36);
  
  const p719 = asNumber(tour.price_7_19_people);
  if (p719 > 0) prices.push(p719);

  // Initial candidate for min price across all available tiers
  let minBase = prices.length > 0 ? Math.min(...prices) : basePrice;

  // Group model specific override
  if (tour.pricing_model === 'group') {
    minBase = basePrice;
  } else if (tour.pricing_model === 'custom' && prices.length === 0) {
    minBase = 0;
  }

  // If there are custom options and they are active, add the lowest possible required option price
  if (tour.use_custom_options && Array.isArray(tour.custom_options_json) && tour.custom_options_json.length > 0) {
    const optionPrices = (tour.custom_options_json as any[])
      .map(o => asNumber(o.price))
      .filter(p => p >= 0);
    
    // We add the minimum option price to the base to show the "Starting from"
    if (optionPrices.length > 0) {
      minBase += Math.min(...optionPrices);
    }
  }

  return minBase;
}
