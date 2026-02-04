/**
 * Formats a price number with locale-specific formatting
 */
export const formatPrice = (amount: number): string => {
  return new Intl.NumberFormat("en-AE", {
    minimumFractionDigits: 0,
  }).format(amount);
};

/**
 * Formats a price number in a compact way (e.g. 1K, 1M)
 */
export const formatCompactPrice = (amount: number): string => {
  return new Intl.NumberFormat("en-AE", {
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: 1,
  }).format(amount);
};
