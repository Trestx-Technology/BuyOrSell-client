/**
 * Seller translations type definitions
 */
export type SellerTranslations = {
  header: {
    topRated: string;
    memberSince: string;
    reviews: string;
    callSeller: string;
    message: string;
    whatsapp: string;
  };
  info: {
    sellerStatistics: string;
    totalAds: string;
    activeListings: string;
    totalReviews: string;
    responseTime: string;
    description: string;
    languageSpoken: string;
    certifications: string;
    businessHours: string;
    trustScore: string;
    basedOnReviews: string;
    responseRate: string;
    avgResponseTime: string;
    safetyFeatures: string;
    verifiedBusinessLicense: string;
    identityVerified: string;
    phoneNumberVerified: string;
    professionalDealer: string;
    contactInfo?: string;
    address?: string;
    website?: string;
    locations?: string;
    tags?: string;
    brands?: string;
    licenseInfo?: string;
    // Legacy fields for backward compatibility
    carsSold?: string;
    happyCustomers?: string;
  };
  reviews: {
    title: string;
    overallRating: string;
    basedOn: string;
    reviews: string;
    ratingAndReviews: string;
    writeReview: string;
    sortBy: {
      latest: string;
      oldest: string;
      highest: string;
      lowest: string;
    };
    viewAll: string;
    showLess: string;
    writeReviewDialog: {
      title: string;
      rating: string;
      yourReview: string;
      placeholder: string;
      cancel: string;
      submitReview: string;
    };
  };
  listings: {
    adsPostedBy: string;
    noListingsFound: string;
  };
};

