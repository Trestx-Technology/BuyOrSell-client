export const reviewQueries = {
  adReviews: (adId: string) => ({
    Key: ['ratings', 'Ad', adId],
    endpoint: `/ratings/Ad/${adId}`,
  }),
  organizationReviews: (organizationId: string) => ({
    Key: ['ratings', 'Organization', organizationId],
    endpoint: `/ratings/Organization/${organizationId}`,
  }),
  adAverageRating: (adId: string) => ({
    Key: ['ratings', 'Ad', adId, 'average'],
    endpoint: `/ratings/Ad/${adId}/average`,
  }),
  organizationAverageRating: (organizationId: string) => ({
    Key: ['ratings', 'Organization', organizationId, 'average'],
    endpoint: `/ratings/Organization/${organizationId}/average`,
  }),
};

