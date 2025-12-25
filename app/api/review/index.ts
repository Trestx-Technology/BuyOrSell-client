export type ReviewObject = "User" | "Ads" | "Company" | "Organization";

export const reviewQueries = {
  // GET /ratings/{reviewObject}/{reviewObjectId}
  getReviews: (reviewObject: ReviewObject, reviewObjectId: string) => ({
    Key: ["ratings", reviewObject, reviewObjectId],
    endpoint: `/ratings/${reviewObject}/${reviewObjectId}`,
  }),
  // GET /ratings/{reviewObject}/{reviewObjectId}/average
  getAverageRating: (reviewObject: ReviewObject, reviewObjectId: string) => ({
    Key: ["ratings", reviewObject, reviewObjectId, "average"],
    endpoint: `/ratings/${reviewObject}/${reviewObjectId}/average`,
  }),
  // POST /ratings
  createReview: () => ({
    Key: ["ratings", "create"],
    endpoint: `/ratings`,
  }),
  // Helper methods for backward compatibility
  adReviews: (adId: string) => ({
    Key: ["ratings", "Ads", adId],
    endpoint: `/ratings/Ads/${adId}`,
  }),
  organizationReviews: (organizationId: string) => ({
    Key: ["ratings", "Organization", organizationId],
    endpoint: `/ratings/Organization/${organizationId}`,
  }),
  adAverageRating: (adId: string) => ({
    Key: ["ratings", "Ads", adId, "average"],
    endpoint: `/ratings/Ads/${adId}/average`,
  }),
  organizationAverageRating: (organizationId: string) => ({
    Key: ["ratings", "Organization", organizationId, "average"],
    endpoint: `/ratings/Organization/${organizationId}/average`,
  }),
};
