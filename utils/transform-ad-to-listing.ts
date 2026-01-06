import { AD, ProductExtraFields } from "@/interfaces/ad";
import { ListingCardProps } from "@/components/global/listing-card";
import { HotDealsListingCardProps } from "@/components/global/hot-deals-listing-card";
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
  locale?: Locale
): ListingCardProps => {
  const isArabic = locale === "ar";
  // Extract location
  const getLocation = (): string => {
    // Helper function to safely get and trim string values
    const getStringValue = (value: unknown): string | null => {
      if (typeof value === "string") {
        const trimmed = value.trim();
        return trimmed || null;
      }
      return null;
    };

    // Check both location and address fields
    const locationData = ad.location || ad.address;

    // Handle undefined/null cases
    if (!locationData) {
      return "Location not specified";
    }

    // Handle string location
    if (typeof locationData === "string") {
      const trimmed = locationData.trim();
      return trimmed || "Location not specified";
    }

    // Handle object location - check for address field first
    const address = getStringValue(locationData.address);
    if (address) return address;

    // Use Arabic address if available and locale is Arabic
    if (isArabic && ad.addressAr) {
      const cityAr = ad.addressAr.city;
      const stateAr = ad.addressAr.state;
      if (cityAr && stateAr) {
        return `${cityAr}, ${stateAr}`;
      }
      if (cityAr) return cityAr;
      if (stateAr) return stateAr;
    }

    // Build location from city and state
    const city = getStringValue(locationData.city);
    const state = getStringValue(locationData.state);

    if (city && state) {
      return `${city}, ${state}`;
    }

    // Fallback to individual fields if only one is available
    if (city) return city;
    if (state) return state;

    // Check other location fields as fallback
    const area = getStringValue(locationData.area);
    const country = getStringValue(locationData.country);
    const street = getStringValue(locationData.street);

    if (area) return area;
    if (street) return street;
    if (country) return country;

    return "Location not specified";
  };

  // Convert extraFields array to flat object for ListingCard
  // extraFields can be an array of {name, type, value, optionalArray} or already a flat object
  // extraFields is optional and may not be present in all ads
  const normalizeExtraFields = (): Record<
    string,
    string | number | boolean | string[] | null
  > => {
    if (!ad.extraFields) return {};

    // If it's already an object (Record), return it
    if (!Array.isArray(ad.extraFields)) {
      return ad.extraFields as Record<
        string,
        string | number | boolean | string[] | null
      >;
    }

    // If it's an array, convert to flat object
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
      ((ad.price - ad.discountedPrice) / ad.price) * 100
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
      ad.exchanged
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

    return {
      name: sellerName,
      firstName: ad.owner.firstName,
      lastName: ad.owner.lastName,
      type: sellerType,
      isVerified,
      image: ad.owner.image || null,
    };
  };

  return {
    id: ad._id,
    title: isArabic && ad.titleAr ? ad.titleAr : ad.title,
    price: currentPrice,
    originalPrice,
    discount: discountPercentage,
    isAddedInCollection: ad.isAddedInCollection,
    location: getLocation(),
    images: ad.images || [],
    extraFields: extraFields as ProductExtraFields, // Cast to ProductExtraFields for compatibility
    isExchange,
    postedTime: formatDate(ad.createdAt),
    views: ad.views || 0, // Use views from AD if available
    isPremium: ad.isFeatured || false,
    seller: getSellerInfo(),
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
  locale?: Locale
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
        ? adObj.extraFields.reduce((acc, field) => {
            if (
              field &&
              typeof field === "object" &&
              "name" in field &&
              "value" in field
            ) {
              acc[field.name] = field.value;
            }
            return acc;
          }, {} as Record<string, string | number | boolean | string[] | null>)
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
        ? adObj.extraFields.reduce((acc, field) => {
            if (
              field &&
              typeof field === "object" &&
              "name" in field &&
              "value" in field
            ) {
              acc[field.name] = field.value;
            }
            return acc;
          }, {} as Record<string, string | number | boolean | string[] | null>)
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
      baseCard.price / (1 - discountPercentage / 100)
    );
  }

  return {
    ...baseCard,
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
  locale?: Locale
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

  // Get location - use Arabic address if available
  const getLocation = (): string => {
    if (isArabic && ad.addressAr) {
      const cityAr = ad.addressAr.city;
      const stateAr = ad.addressAr.state;
      if (cityAr && stateAr) {
        return `${cityAr}, ${stateAr}`;
      }
      if (cityAr) return cityAr;
      if (stateAr) return stateAr;
    }
    return ad.location || "Location not specified";
  };

  return {
    id: ad.id,
    title: isArabic && ad.titleAr ? ad.titleAr : ad.title,
    price: ad.price,
    originalPrice: ad.discountedPrice ? ad.price : undefined,
    discount: ad.dealPercentage || undefined,
    location: getLocation(),
    images: ad.images || [],
    extraFields: extraFields as ProductExtraFields,
    isExchange: Boolean(ad.exchanged || ad.isExchangeable),
    postedTime: formatDate(ad.createdAt),
    views: 0,
    isPremium: false,
    seller,
  };
};

/**
 * Helper function to transform DealAd to base card format
 * @param ad - The DealAd object to transform
 * @param locale - Optional locale to use Arabic fields when locale is 'ar'
 */
const transformDealAdToCard = (
  ad: DealAd,
  locale?: Locale
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

  // Extract location from nested address structure - use Arabic if available
  const getLocation = (): string => {
    // Use Arabic address if available and locale is Arabic
    if (isArabic && ad.addressAr) {
      const cityAr = ad.addressAr.city;
      const stateAr = ad.addressAr.state;
      if (cityAr && stateAr) {
        return `${cityAr}, ${stateAr}`;
      }
      if (cityAr) return cityAr;
      if (stateAr) return stateAr;
    }

    if (!ad.address || !ad.address.state) {
      return "Location not specified";
    }

    const { state, city, area } = ad.address.state;
    const parts: string[] = [];

    if (area) parts.push(area);
    if (city) parts.push(city);
    if (state) parts.push(state);

    return parts.length > 0 ? parts.join(", ") : "Location not specified";
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
    location: getLocation(),
    images: ad.images || [],
    extraFields: extraFields as ProductExtraFields,
    isExchange: Boolean(ad.exchanged || ad.isExchangeable),
    postedTime: formatDate(ad.createdAt),
    views: 0,
    isPremium: false,
    seller,
  };
};
