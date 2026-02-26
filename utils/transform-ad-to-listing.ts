import { AD, AdLocation, ProductExtraFields } from "@/interfaces/ad";
import { ListingCardProps } from "@/components/features/listing-card/listing-card";
import { HotDealsListingCardProps } from "@/components/features/hot-deals-listing-card/hot-deals-listing-card";
import { LatestAd, DealAd } from "@/interfaces/home.types";
import { formatDate } from "./format-date";
import { type Locale } from "@/lib/i18n/config";

/**
 * Transforms an AD object to ListingCardProps format
 * @param ad - The AD object to transform
 * @param locale - Optional locale to use Arabic fields when locale is 'ar'
 */
export const transformAdToListingCard = (
  ad: AD,
  locale?: Locale,
): ListingCardProps => {
  const isArabic = locale === "ar";

  // Extract address as AdLocation object - prefer ad.address, fall back to ad.location if it's an object
  const getAddress = (): AdLocation => {
    if (ad.address && typeof ad.address === "object") {
      return ad.address as AdLocation;
    }
    if (ad.location && typeof ad.location === "object") {
      return ad.location as AdLocation;
    }
    // If location is a string, put it in the address field
    if (typeof ad.location === "string") {
      return { address: ad.location };
    }
    return {};
  };

  // Convert extraFields array to flat object for ListingCard
  // extraFields can be an array of {name, type, value, optionalArray} or already a flat object
  // extraFields is optional and may not be present in all ads
  const normalizeExtraFields = (): Record<string, any> => {
    if (!ad.extraFields) return {};

    // If it's already an object (Record), return it
    if (!Array.isArray(ad.extraFields)) {
      return ad.extraFields;
    }

    // If it's an array, convert to flat object map where key is name and value is the full field object
    // This preserves icon and other metadata which normalizeExtraFieldsToArray can now handle
    const flatFields: Record<string, any> = {};
    ad.extraFields.forEach((field) => {
      if (
        field &&
        typeof field === "object" &&
        "name" in field &&
        "value" in field
      ) {
        flatFields[field.name] = field;
      }
    });
    return flatFields;
  };

  const extraFields = normalizeExtraFields();

  // Calculate discount - prioritize discountedPrice, then discountedPercent from extraFields
  let currentPrice = ad.price;
  let originalPrice: number | undefined = undefined;
  let discountPercentage: number | undefined = undefined;

  if (
    ad.discountedPrice !== null &&
    ad.discountedPrice !== undefined &&
    ad.discountedPrice < ad.price
  ) {
    // discountedPrice is available and is less than price
    currentPrice = ad.discountedPrice;
    originalPrice = ad.price;
    // Calculate discount percentage
    discountPercentage = Math.round(
      ((ad.price - ad.discountedPrice) / ad.price) * 100,
    );
  } else {
    // Try to get discount from extraFields
    const discountedPercent =
      ad.deal && extraFields.discountedPercent
        ? Number(extraFields.discountedPercent)
        : undefined;

    if (discountedPercent && discountedPercent > 0 && ad.price) {
      // Calculate original price from discount percentage
      originalPrice = Math.round(ad.price / (1 - discountedPercent / 100));
      currentPrice = ad.price; // price is already the discounted price
      discountPercentage = Math.round(discountedPercent);
    }
  }

  // Check for exchange availability - these are top-level fields, not in extraFields
  const isExchange = Boolean(
    ad.upForExchange ||
    ad.isExchangable || // Note: API uses "isExchangable" (misspelling)
    ad.exchanged,
  );

  // Extract seller information
  const getSellerInfo = () => {
    if (!ad.owner) return undefined;

    // If organization exists, it's an agent listing
    const isAgent = !!ad.organization;
    const sellerType: "Agent" | "Individual" = isAgent ? "Agent" : "Individual";

    // Get seller name - prefer organization name if available, otherwise use owner name
    let sellerName: string | undefined;
    if (ad.organization?.tradeName) {
      sellerName = ad.organization.tradeName;
    } else if (ad.organization?.legalName) {
      sellerName = ad.organization.legalName;
    } else if (ad.owner.name) {
      sellerName = ad.owner.name;
    } else if (ad.owner.firstName || ad.owner.lastName) {
      sellerName = `${ad.owner.firstName || ""} ${
        ad.owner.lastName || ""
      }`.trim();
    }

    // Determine if verified - check organization verified status or owner verification
    const isVerified =
      ad.organization?.verified ||
      ad.owner.emailVerified ||
      ad.owner.phoneVerified ||
      false;

    const phoneNumber = ad.contactPhoneNumber || ad.owner.phoneNo;
    const connectionTypes = ad.connectionTypes || [];
    const canCall = connectionTypes.includes("call");
    const canWhatsapp = connectionTypes.includes("whatsapp");

    return {
      id: ad.owner._id,
      name: sellerName,
      firstName: ad.owner.firstName,
      lastName: ad.owner.lastName,
      type: sellerType,
      isVerified,
      image: ad.owner.image || null,
      phoneNumber,
      canCall,
      canWhatsapp,
    };
  };

  return {
    id: ad._id,
    title: isArabic && ad.titleAr ? ad.titleAr : ad.title,
    price: currentPrice,
    originalPrice,
    discount: discountPercentage,
    location: getAddress(),
    images: ad.images || [],
    extraFields: extraFields as ProductExtraFields, // Cast to ProductExtraFields for compatibility
    isExchange,
    postedTime: formatDate(ad.createdAt),
    views: ad.views || 0, // Use views from AD if available
    isPremium: ad.isFeatured || false,
    seller: getSellerInfo(),
    isSaved: ad.isSaved,
    isAddedInCollection: ad.isAddedInCollection,
  };
};

/**
 * Transforms an AD object, LatestAd, or DealAd to HotDealsListingCardProps format
 * Includes deal validity and seller information
 * @param ad - The ad object to transform
 * @param locale - Optional locale to use Arabic fields when locale is 'ar'
 */
export const transformAdToHotDealsCard = (
  ad: AD | LatestAd | DealAd,
  locale?: Locale,
): HotDealsListingCardProps => {
  const isArabic = locale === "ar";
  // Check which type of ad it is
  const isDealAd =
    "address" in ad &&
    ad.address &&
    typeof ad.address === "object" &&
    "state" in ad.address;
  const isLatestAd = "dealValidThrough" in ad && !isDealAd;

  // Get deal validity
  let dealValidThrough: string | null = null;
  if (isDealAd) {
    dealValidThrough = (ad as DealAd).dealValidThrough;
  } else if (isLatestAd) {
    dealValidThrough = (ad as LatestAd).dealValidThrough;
  } else {
    const adObj = ad as AD;
    // Check extraFields for deal validity
    if (adObj.extraFields) {
      const extraFields = Array.isArray(adObj.extraFields)
        ? adObj.extraFields.reduce(
            (acc, field) => {
              if (
                field &&
                typeof field === "object" &&
                "name" in field &&
                "value" in field
              ) {
                acc[field.name] = field.value;
              }
              return acc;
            },
            {} as Record<string, string | number | boolean | string[] | null>,
          )
        : adObj.extraFields;

      // Try different field names for deal validity
      dealValidThrough =
        extraFields.dealValidThrough ||
        extraFields.dealValidThru ||
        extraFields.validity ||
        adObj.validity ||
        null;
    } else if (adObj.validity) {
      dealValidThrough = adObj.validity;
    }
  }

  // Get discount percentage
  let discountPercentage: number | undefined;
  if (isDealAd) {
    discountPercentage = (ad as DealAd).dealPercentage || undefined;
  } else if (isLatestAd) {
    discountPercentage = (ad as LatestAd).dealPercentage || undefined;
  } else {
    const adObj = ad as AD;
    if (adObj.extraFields) {
      const extraFields = Array.isArray(adObj.extraFields)
        ? adObj.extraFields.reduce(
            (acc, field) => {
              if (
                field &&
                typeof field === "object" &&
                "name" in field &&
                "value" in field
              ) {
                acc[field.name] = field.value;
              }
              return acc;
            },
            {} as Record<string, string | number | boolean | string[] | null>,
          )
        : adObj.extraFields;
      discountPercentage = extraFields.discountedPercent
        ? Number(extraFields.discountedPercent)
        : undefined;
    }
  }

  // Use the appropriate transform function
  let baseCard: ListingCardProps;
  if (isDealAd) {
    baseCard = transformDealAdToCard(ad as DealAd, locale);
  } else if (isLatestAd) {
    baseCard = transformLatestAdToCard(ad as LatestAd, locale);
  } else {
    baseCard = transformAdToListingCard(ad as AD, locale);
  }

  // For DealAd, prices are already set correctly in transformDealAdToCard
  // For other types, calculate original price if needed
  let finalOriginalPrice = baseCard.originalPrice;
  if (!isDealAd && discountPercentage && baseCard.price) {
    finalOriginalPrice = Math.round(
      baseCard.price / (1 - discountPercentage / 100),
    );
  }

  return {
    ...baseCard,
    isAddedInCollection:
      baseCard.isAddedInCollection || (ad as any).isAddedInCollection,
    isSaved: baseCard.isSaved || (ad as any).isSaved,
    originalPrice: finalOriginalPrice,
    discount: discountPercentage,
    dealValidThrough,
    discountText: discountPercentage
      ? `FLAT ${Math.round(discountPercentage)}% OFF`
      : undefined,
    showDiscountBadge: !!discountPercentage,
    showTimer: !!dealValidThrough,
  };
};

/**
 * Helper function to transform LatestAd to base card format
 * @param ad - The LatestAd object to transform
 * @param locale - Optional locale to use Arabic fields when locale is 'ar'
 */
const transformLatestAdToCard = (
  ad: LatestAd,
  locale?: Locale,
): ListingCardProps => {
  const isArabic = locale === "ar";
  // Normalize extraFields
  const normalizeExtraFields = (): Record<
    string,
    string | number | boolean | string[] | null
  > => {
    if (!ad.extraFields) return {};
    const flatFields: Record<
      string,
      string | number | boolean | string[] | null
    > = {};
    ad.extraFields.forEach((field) => {
      if (
        field &&
        typeof field === "object" &&
        "name" in field &&
        "value" in field
      ) {
        flatFields[field.name] = field.value;
      }
    });
    return flatFields;
  };

  const extraFields = normalizeExtraFields();

  // Get seller info from LatestAd owner
  const seller = ad.owner
    ? {
        name: ad.owner.name,
        firstName: ad.owner.firstName,
        lastName: ad.owner.lastName,
        type: "Individual" as const, // LatestAd doesn't have organization info
        isVerified: false,
        image: ad.owner.image || null,
      }
    : undefined;

  // Build AdLocation from LatestAd's flatter address structure
  const getAddress = (): AdLocation => {
    const loc: AdLocation = {};
    if (ad.address) {
      loc.city = ad.address.city || undefined;
      loc.state = ad.address.state || undefined;
    }
    if (ad.addressAr) {
      loc.cityAr = ad.addressAr.city || undefined;
      loc.stateAr = ad.addressAr.state || undefined;
    }
    // If we have a string location, use it as the address field
    if (ad.location && typeof ad.location === "string") {
      loc.address = ad.location;
    }
    return loc;
  };

  return {
    id: ad.id,
    title: isArabic && ad.titleAr ? ad.titleAr : ad.title,
    price: ad.price,
    originalPrice: ad.discountedPrice ? ad.price : undefined,
    discount: ad.dealPercentage || undefined,
    location: getAddress(),
    images: ad.images || [],
    extraFields: extraFields as ProductExtraFields,
    isExchange: Boolean(ad.exchanged || ad.isExchangeable),
    postedTime: formatDate(ad.createdAt),
    views: ad.views || 0,
    isPremium: false,
    seller,
    isSaved: (ad as any).isSaved,
    isAddedInCollection: (ad as any).isAddedInCollection,
  };
};

/**
 * Helper function to transform DealAd to base card format
 * @param ad - The DealAd object to transform
 * @param locale - Optional locale to use Arabic fields when locale is 'ar'
 */
const transformDealAdToCard = (
  ad: DealAd,
  locale?: Locale,
): ListingCardProps => {
  const isArabic = locale === "ar";
  // Normalize extraFields
  const normalizeExtraFields = (): Record<
    string,
    string | number | boolean | string[] | null
  > => {
    if (!ad.extraFields) return {};
    const flatFields: Record<
      string,
      string | number | boolean | string[] | null
    > = {};
    ad.extraFields.forEach((field) => {
      if (
        field &&
        typeof field === "object" &&
        "name" in field &&
        "value" in field
      ) {
        flatFields[field.name] = field.value;
      }
    });
    return flatFields;
  };

  const extraFields = normalizeExtraFields();

  // Build AdLocation from DealAd's address structure.
  // The real API returns a FLAT object: { state, city, address, addressAr, stateAr, cityAr, ... }
  // An older shape has the nested form: { state: { state, city, area } }
  const getAddress = (): AdLocation => {
    const loc: AdLocation = {};
    if (!ad.address) return loc;

    const addr = ad.address as any;

    // Detect flat shape: has string `state` or `city` directly
    if (typeof addr.state === "string" || typeof addr.city === "string") {
      loc.state = addr.state || undefined;
      loc.city = addr.city || undefined;
      loc.area = addr.area || undefined;
      loc.address = addr.address || undefined;
      loc.country = addr.country || undefined;
      loc.zipCode = addr.zipCode || undefined;
      // Arabic fields may be on the root address object (real API packs them there)
      loc.stateAr = addr.stateAr || ad.addressAr?.state || undefined;
      loc.cityAr = addr.cityAr || ad.addressAr?.city || undefined;
      loc.addressAr = addr.addressAr || ad.addressAr?.address || undefined;
    } else if (addr.state && typeof addr.state === "object") {
      // Nested shape: address.state = { state, city, area }
      const nested = addr.state;
      loc.state = nested.state || undefined;
      loc.city = nested.city || undefined;
      loc.area = nested.area || undefined;
      // Arabic from top-level addressAr
      loc.stateAr = ad.addressAr?.state || undefined;
      loc.cityAr = ad.addressAr?.city || undefined;
      loc.addressAr = ad.addressAr?.address || undefined;
    }

    return loc;
  };

  // Get seller info from DealAd owner
  const seller = ad.owner
    ? {
        name: ad.owner.name,
        firstName: ad.owner.firstName,
        lastName: ad.owner.lastName,
        type: "Individual" as const, // DealAd doesn't have organization info
        isVerified: false,
        image: ad.owner.image || null,
      }
    : undefined;

  // For DealAd: discountedPrice is the current price, price is the original price
  // If discountedPrice exists, use it as the display price, otherwise use price
  const displayPrice =
    ad.discountedPrice !== null && ad.discountedPrice !== undefined
      ? ad.discountedPrice
      : ad.price;
  const originalPrice =
    ad.discountedPrice !== null && ad.discountedPrice !== undefined
      ? ad.price
      : undefined;

  return {
    id: ad.id || ad._id || "",
    title: isArabic && ad.titleAr ? ad.titleAr : ad.title,
    price: displayPrice,
    originalPrice: originalPrice,
    discount: ad.dealPercentage || undefined,
    location: getAddress(),
    images: ad.images || [],
    extraFields: extraFields as ProductExtraFields,
    isExchange: Boolean(ad.exchanged || ad.isExchangeable),
    postedTime: formatDate(ad.createdAt),
    views: ad.views || 0,
    isPremium: false,
    seller,
    isSaved: (ad as any).isSaved,
    isAddedInCollection: (ad as any).isAddedInCollection,
  };
};
