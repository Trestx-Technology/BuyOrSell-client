import { AD, ProductExtraField } from "@/interfaces/ad";
import { normalizeExtraFieldsToArray } from "./normalize-extra-fields";

export interface DiscountInfo {
  currentPrice: number;
  originalPrice?: number;
  discountPercentage?: number;
}

/**
 * Calculates discount information from an AD object
 * Priority order:
 * 1. discountedPrice (if discountedPrice < price) - checks even if deal is false
 * 2. dealPercentage (if deal is active or dealPercentage exists)
 * 3. discountedPercent in extraFields (if deal is active or field exists)
 * 4. No discount - returns regular price
 *
 * @param ad - The AD object to calculate discount from
 * @returns DiscountInfo object with currentPrice, originalPrice (if discounted), and discountPercentage (if discounted)
 */
export function getDiscountInfo(ad: AD): DiscountInfo {
  // Priority 1: If discountedPrice is provided and is less than price, use it directly
  // Check this even if deal is false, as discountedPrice might be set independently
  if (ad.discountedPrice && ad.discountedPrice < ad.price && ad.price > 0) {
    const discountPercentage = Math.round(
      ((ad.price - ad.discountedPrice) / ad.price) * 100
    );
    return {
      currentPrice: ad.discountedPrice,
      originalPrice: ad.price,
      discountPercentage: discountPercentage,
    };
  }

  // Priority 2: Check for dealPercentage (check even if deal is false, as it might be set)
  if (ad.dealPercentage && ad.dealPercentage > 0 && ad.price) {
    const discountPercentage = Math.round(ad.dealPercentage);
    const discountedPrice = Math.round(
      ad.price * (1 - discountPercentage / 100)
    );
    // Only return discount if calculated price is less than original
    if (discountedPrice < ad.price) {
      return {
        currentPrice: discountedPrice,
        originalPrice: ad.price,
        discountPercentage: discountPercentage,
      };
    }
  }

  // Priority 3: Check for discount in extraFields (discountedPercent field)
  const extraFields = normalizeExtraFieldsToArray(ad.extraFields || []);
  const discountPercentField = extraFields.find(
    (f: ProductExtraField) =>
      f.name?.toLowerCase().includes("discountedPercent") ||
      f.name?.toLowerCase().includes("discountpercent")
  );

  // Check discountPercentField if deal is active OR if the field exists (more flexible)
  if (discountPercentField && (ad.deal || discountPercentField.value)) {
    const discountPercentage = Number(discountPercentField.value) || 0;
    if (discountPercentage > 0 && ad.price) {
      const discountedPrice = Math.round(
        ad.price * (1 - discountPercentage / 100)
      );
      // Only return discount if calculated price is less than original
      if (discountedPrice < ad.price) {
        return {
          currentPrice: discountedPrice,
          originalPrice: ad.price,
          discountPercentage: Math.round(discountPercentage),
        };
      }
    }
  }

  // No discount - show regular price
  return {
    currentPrice: ad.price,
    originalPrice: undefined,
    discountPercentage: undefined,
  };
}
