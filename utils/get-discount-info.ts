import { AD } from "@/interfaces/ad";

export interface DiscountInfo {
  currentPrice: number;
  originalPrice?: number;
  discountPercentage?: number;
}

/**
 * Calculates discount information from an AD object
 * Priority order:
 * 1. discountedPrice (if discountedPrice < price) - checks even if deal is false
 * 2. dealPercentage or discountedPercent (if percentage > 0)
 * 3. No discount - returns regular price
 *
 * @param ad - The AD object to calculate discount from
 * @returns DiscountInfo object with currentPrice, originalPrice (if discounted), and discountPercentage (if discounted)
 */
export function getDiscountInfo(ad: AD): DiscountInfo {
  const price = Number(ad.price) || 0;
  const discountedPrice = ad.discountedPrice !== null && ad.discountedPrice !== undefined ? Number(ad.discountedPrice) : null;
  
  // 1. Priority: Handle ad.discountedPrice explicitly if it's less than regular price
  if (discountedPrice !== null && discountedPrice < price && price > 0) {
    const discountPercentage = Math.round(((price - discountedPrice) / price) * 100);
    return {
      currentPrice: discountedPrice,
      originalPrice: price,
      discountPercentage: discountPercentage > 0 ? discountPercentage : undefined,
    };
  }

  // 2. Priority: Handle dealPercentage or discountedPercent if percentage > 0
  const percentage = Number(ad.dealPercentage || ad.discountedPercent) || 0;

  if (percentage > 0 && price > 0) {
    const discountPercentage = Math.round(percentage);
    const calculatedDiscountedPrice = Math.round(price * (1 - discountPercentage / 100));
    
    return {
      currentPrice: calculatedDiscountedPrice,
      originalPrice: price,
      discountPercentage: discountPercentage,
    };
  }

  // Default: show regular price
  return {
    currentPrice: price,
    originalPrice: undefined,
    discountPercentage: undefined,
  };
}
