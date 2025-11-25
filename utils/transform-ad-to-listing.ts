import { AD } from "@/interfaces/ad";
import { ListingCardProps } from "@/components/global/listing-card";

/**
 * Transforms an AD object to ListingCardProps format
 */
export const transformAdToListingCard = (ad: AD): ListingCardProps => {
  // Ensure extraFields exists
  const extraFields = ad.extraFields || {};

  // Format date to relative time
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    return date.toLocaleDateString();
  };

  // Extract location
  const getLocation = (): string => {
    if (typeof ad.location === "string") return ad.location;
    if (ad.location?.address) return ad.location.address;
    if (ad.location?.city && ad.location?.state) {
      return `${ad.location.city}, ${ad.location.state}`;
    }
    return "Location not specified";
  };

  // Calculate discount if deal is active
  const discountPercentage = ad.deal && extraFields.discountedPercent
    ? Number(extraFields.discountedPercent)
    : undefined;

  const originalPrice = discountPercentage && ad.price
    ? Math.round(ad.price / (1 - discountPercentage / 100))
    : undefined;

  // Check for exchange availability
  const isExchange = Boolean(
    extraFields.isExchange ||
    extraFields.exchange ||
    extraFields.isExchangeable ||
    extraFields["Any exchange offer ?"]
  );

  return {
    id: ad._id,
    title: ad.title,
    price: ad.price,
    originalPrice,
    discount: discountPercentage,
    location: getLocation(),
    images: ad.images || [],
    extraFields,
    isExchange,
    postedTime: formatDate(ad.createdAt),
    views: 0, // AD type doesn't have views, can be added if available
    isPremium: ad.isFeatured || false,
    isFavorite: false,
  };
};

