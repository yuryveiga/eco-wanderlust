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

  let minBase = 0;

  if (tour.pricing_model === 'dynamic') {
    // For dynamic model, we find the minimum of all defined per-person tiers AND the base price
    const dynamicPrices = [
      tour.price,
      tour.price_1_person,
      tour.price_2_people,
      tour.price_3_6_people,
      tour.price_7_19_people
    ].filter((p): p is number => typeof p === 'number' && p > 0);

    if (dynamicPrices.length > 0) {
      minBase = Math.min(...dynamicPrices);
    } else {
      minBase = tour.price || 0;
    }
  } else if (tour.pricing_model === 'group') {
    // For group, we return the base price (usually the total for the group)
    minBase = tour.price || 0;
  } else if (tour.pricing_model === 'custom') {
    // Custom model starts at 0 and adds options
    minBase = 0;
  } else {
    // Fixed or undefined model
    minBase = tour.price || 0;
  }

  // If there are custom options and they are active, add the lowest possible option price
  if (tour.use_custom_options && Array.isArray(tour.custom_options_json) && tour.custom_options_json.length > 0) {
    const optionPrices = (tour.custom_options_json as any[])
      .map(o => o.price || 0);
    
    // We add the minimum option price to the base
    minBase += Math.min(...optionPrices);
  }

  return minBase;
}
