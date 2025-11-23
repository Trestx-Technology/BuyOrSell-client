export const bannerQueries = {
  banners: {
    Key: ['banners'],
    endpoint: '/banner',
  },
  bannerById: (id: string) => ({
    Key: ['banner', id],
    endpoint: `/banner/${id}`,
  }),
  activeBanners: {
    Key: ['banners', 'active'],
    endpoint: '/banner/active',
  },
  bannersByPosition: (position: string) => ({
    Key: ['banners', 'position', position],
    endpoint: `/banner/position/${position}`,
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
  updateBannerStatus: (id: string) => ({
    Key: ['banner', id, 'status'],
    endpoint: `/banner/${id}/status`,
  }),
};

