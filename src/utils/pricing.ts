/**
 * Pricing utilities for calculating tour costs based on different models.
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
 * Calculates the absolute minimum base price per person for a tour.
 * This looks across all dynamic pricing tiers and custom options to find the lowest possible cost.
 */
export function getTourMinPrice(tour: PricingTour): number {
  if (!tour) return 0;

  let prices: number[] = [];

  // Base price (often used for fixed or group models)
  if (typeof tour.price === 'number' && tour.price > 0) {
    prices.push(tour.price);
  }

  // Dynamic per-person tiers
  if (typeof tour.price_1_person === 'number' && tour.price_1_person > 0) {
    prices.push(tour.price_1_person);
  }
  if (typeof tour.price_2_people === 'number' && tour.price_2_people > 0) {
    prices.push(tour.price_2_people);
  }
  if (typeof tour.price_3_6_people === 'number' && tour.price_3_6_people > 0) {
    prices.push(tour.price_3_6_people);
  }
  if (typeof tour.price_7_19_people === 'number' && tour.price_7_19_people > 0) {
    prices.push(tour.price_7_19_people);
  }

  // Initial candidate for min price
  let minBase = prices.length > 0 ? Math.min(...prices) : (tour.price || 0);

  // Group model specific override
  if (tour.pricing_model === 'group') {
    minBase = tour.price || 0;
  } else if (tour.pricing_model === 'custom' && prices.length === 0) {
    minBase = 0;
  }

  // If there are custom options and they are active, add the lowest possible required option price
  if (tour.use_custom_options && Array.isArray(tour.custom_options_json) && tour.custom_options_json.length > 0) {
    const optionPrices = (tour.custom_options_json as any[])
      .map(o => typeof o.price === 'number' ? o.price : 0)
      .filter(p => p >= 0);
    
    // We add the minimum option price to the base to show the "Starting from"
    if (optionPrices.length > 0) {
      minBase += Math.min(...optionPrices);
    }
  }

  return minBase;
}
