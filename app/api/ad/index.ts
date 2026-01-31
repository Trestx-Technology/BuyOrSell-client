export const adQueries = {
  ads: {
    Key: ["ads"],
    endpoint: "/ad",
  },
  adById: (id: string) => ({
    Key: ["ad", id],
    endpoint: `/ad/${id}`,
  }),
  createAd: {
    Key: ["ad", "create"],
    endpoint: "/ad",
  },
  updateAd: (id: string) => ({
    Key: ["ad", id, "update"],
    endpoint: `/ad/${id}`,
  }),
  deleteAd: (id: string) => ({
    Key: ["ad", id, "delete"],
    endpoint: `/ad/${id}`,
  }),
  updateAdStatus: (id: string) => ({
    Key: ["ad", id, "status"],
    endpoint: `/ad/${id}/status`,
  }),
  renewAd: (id: string) => ({
    Key: ["ad", id, "renew"],
    endpoint: `/ad/renew/${id}`,
  }),
  adsByUser: (userId: string) => ({
    Key: ["ads", "user", userId],
    endpoint: `/ad/user/${userId}`,
  }),
  adsByCategory: (categoryId: string) => ({
    Key: ["ads", "category", categoryId],
    endpoint: `/ad/category/${categoryId}`,
  }),
  searchAds: {
    Key: ["ads", "search"],
    endpoint: "/ad/search",
  },
  liveAds: {
    Key: ["ads", "live"],
    endpoint: "/ad/live",
  },
  featuredAds: {
    Key: ["ads", "featured"],
    endpoint: "/ad/featured",
  },
  myAds: {
    Key: ["ads", "my"],
    endpoint: "/ad/my",
  },
  uploadAdImages: {
    Key: ["ad", "images", "upload"],
    endpoint: "/ad/images",
  },
  filterAds: {
    Key: ["ads", "filter"],
    endpoint: "/ad/filter",
  },
  similarAds: (id: string) => ({
    Key: ["ad", id, "similar"],
    endpoint: `/ad/${id}/similar`,
  }),
  adsByKeyword: (keyword: string, params?: { userId?: string }) => ({
    Key: ["ads", "keyword", keyword, params],
    endpoint: `/ad/keyword/${keyword}`,
  }),
  searchAdsAI: {
    Key: ["ads", "search", "ai"],
    endpoint: "/ad/search/ai",
  },
};
