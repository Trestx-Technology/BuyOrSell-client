export const adQueries = {
  // Get all ads with filters
  ads: {
    key: "ads",
    endpoint: "/ad",
  },
  // Get ad by ID
  adById: {
    key: "ad-by-id",
    endpoint: "/ad/:id",
  },
  // Create ad
  createAd: {
    key: "create-ad",
    endpoint: "/ad",
  },
  // Update ad
  updateAd: {
    key: "update-ad",
    endpoint: "/ad/:id",
  },
  // Delete ad
  deleteAd: {
    key: "delete-ad",
    endpoint: "/ad/:id",
  },
  // Update ad status
  updateAdStatus: {
    key: "update-ad-status",
    endpoint: "/ad/:id/status",
  },
  // Get ads by user
  adsByUser: {
    key: "ads-by-user",
    endpoint: "/ad/user/:userId",
  },
  // Get ads by category
  adsByCategory: {
    key: "ads-by-category",
    endpoint: "/ad/category/:categoryId",
  },
  // Search ads
  searchAds: {
    key: "search-ads",
    endpoint: "/ad/search",
  },
  // Get live ads
  liveAds: {
    key: "live-ads",
    endpoint: "/ad/live",
  },
  // Get featured ads
  featuredAds: {
    key: "featured-ads",
    endpoint: "/ad/featured",
  },
  // Get my ads
  myAds: {
    key: "my-ads",
    endpoint: "/ad/my",
  },
  // Upload ad images
  uploadAdImages: {
    key: "upload-ad-images",
    endpoint: "/ad/images",
  },
};

