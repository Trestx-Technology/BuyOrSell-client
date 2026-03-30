import { AD, AdLocation, ProductExtraFields } from "@/interfaces/ad";
import { ListingCardProps } from "@/components/features/listing-card/listing-card";
import { HotDealsListingCardProps } from "@/components/features/hot-deals-listing-card/hot-deals-listing-card";
import { LatestAd, DealAd } from "@/interfaces/home.types";
import { formatDate } from "./format-date";
import { getDiscountInfo } from "./get-discount-info";
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
      const addr = ad.address as any;
      return {
        ...addr,
        state: addr.state || addr.emirate,
        stateAr: addr.stateAr || addr.emirateAr,
      } as AdLocation;
    }
    if (ad.location && typeof ad.location === "object") {
      const loc = ad.location as any;
      return {
        ...loc,
        state: loc.state || loc.emirate,
        stateAr: loc.stateAr || loc.emirateAr,
      } as AdLocation;
    }
    // If location is a string, put it in the address field
    if (typeof ad.location === "string") {
      return { address: ad.location };
    }
    return {};
  };

  // Convert extraFields array to flat object for ListingCard
  const normalizeExtraFields = (): Record<string, any> => {
    if (!ad.extraFields) return {};

    if (!Array.isArray(ad.extraFields)) {
      return ad.extraFields;
    }

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

  const extraFieldsFlat = normalizeExtraFields();

  // Pricing Logic - Use centralized getDiscountInfo
  const { currentPrice, originalPrice, discountPercentage } = getDiscountInfo(ad);

  // Check for exchange availability
  const isExchange = Boolean(
    ad.upForExchange ||
    ad.isExchangable || 
    ad.exchanged,
  );

  // Extract seller information
  const getSellerInfo = () => {
    if (!ad.owner) return undefined;

    const isAgent = !!ad.organization;
    const sellerType: "Agent" | "Individual" = isAgent ? "Agent" : "Individual";

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
    extraFields: extraFieldsFlat as ProductExtraFields,
    isExchange,
    postedTime: formatDate(ad.createdAt),
    views: ad.views || 0,
    isPremium: ad.isFeatured || false,
    seller: getSellerInfo(),
    isSaved: ad.isSaved,
    isAddedInCollection: ad.isAddedInCollection,
  };
};

/**
 * Transforms an AD object, LatestAd, or DealAd to HotDealsListingCardProps format
 * @param ad - The ad object to transform
 * @param locale - Optional locale to use Arabic fields when locale is 'ar'
 */
export const transformAdToHotDealsCard = (
  ad: AD | LatestAd | DealAd,
  locale?: Locale,
): HotDealsListingCardProps => {
  const isArabic = locale === "ar";
  
  // Use the appropriate transform function for base properties
  let baseCard: ListingCardProps;
  let dealValidThrough: string | null = null;
  const isDealAd = "address" in ad && ad.address && typeof ad.address === "object" && "state" in ad.address;
  const isLatestAd = "dealValidThrough" in ad && !isDealAd;

  if (isDealAd) {
    baseCard = transformDealAdToCard(ad as DealAd, locale);
    dealValidThrough = (ad as DealAd).dealValidThrough || null;
  } else if (isLatestAd) {
    baseCard = transformLatestAdToCard(ad as LatestAd, locale);
    dealValidThrough = (ad as LatestAd).dealValidThrough || null;
  } else {
    baseCard = transformAdToListingCard(ad as AD, locale);
    const adObj = ad as AD;
    // Check various sources for dealValidThrough
    dealValidThrough = adObj.validity || null;
    if (!dealValidThrough && adObj.extraFields) {
      const extraFields = Array.isArray(adObj.extraFields) ? adObj.extraFields : [];
      const validityField = extraFields.find(f => 
        f?.name?.toLowerCase().includes("validity") || 
        f?.name?.toLowerCase().includes("dealvalidthrough")
      );
      if (validityField) dealValidThrough = String(validityField.value);
    }
  }

  return {
    ...baseCard,
    dealValidThrough,
    discountText: baseCard.discount
      ? `FLAT ${Math.round(baseCard.discount)}% OFF`
      : undefined,
    showDiscountBadge: !!baseCard.discount,
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
    price: ad.dealPercentage ? Math.round(ad.price * (1 - ad.dealPercentage / 100)) : ad.price,
    originalPrice: ad.dealPercentage ? ad.price : undefined,
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
