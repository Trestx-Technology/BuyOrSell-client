export const bannerQueries = {
  banners: {
    Key: ['banners'],
    endpoint: '/banner',
  },
  bannerById: (id: string) => ({
    Key: ['banner', id],
    endpoint: `/banner/${id}`,
  }),
  createBanner: {
    Key: ['banner', 'create'],
    endpoint: '/banner',
  },
  updateBanner: (id: string) => ({
    Key: ['banner', id, 'update'],
    endpoint: `/banner/${id}`,
  }),
  deleteBanner: (id: string) => ({
    Key: ['banner', id, 'delete'],
    endpoint: `/banner/${id}`,
  }),
};

