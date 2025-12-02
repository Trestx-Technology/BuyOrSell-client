/**
 * System fields that are built into the ad posting form
 * These fields are handled separately from dynamic category fields
 */
export const AD_SYSTEM_FIELDS = [
  "title",
  "description",
  "price",
  "phoneNumber",
  "address",
  "images",
  "isFeatured",
  "connectionTypes",
  "isExchange",
  "exchangeTitle",
  "exchangeDescription",
  "exchangeImages",
  "deal",
  "validity",
  "dealValidThru",
  "discountedPercent",
] as const;

