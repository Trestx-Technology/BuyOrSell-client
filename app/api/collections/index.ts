export const collectionsQueries = {
  createCollection: {
    Key: ['collection', 'create'],
    endpoint: '/collections',
  },
  getMyCollections: {
    Key: ['collections', 'my'],
    endpoint: '/collections/my',
  },
  getCollectionById: (id: string) => ({
    Key: ['collection', id],
    endpoint: `/collections/${id}`,
  }),
  updateCollection: (id: string) => ({
    Key: ['collection', id, 'update'],
    endpoint: `/collections/${id}`,
  }),
  deleteCollection: (id: string) => ({
    Key: ['collection', id, 'delete'],
    endpoint: `/collections/${id}`,
  }),
  // Collection Ads Management
  addAdsToCollection: (collectionId: string) => ({
    Key: ['collection', collectionId, 'ads', 'add'],
    endpoint: `/collections/${collectionId}/ads`,
  }),
  removeAdFromCollection: (collectionId: string, adId: string) => ({
    Key: ['collection', collectionId, 'ads', adId, 'remove'],
    endpoint: `/collections/${collectionId}/ads/${adId}`,
  }),
  getCollectionsByAd: (adId: string) => ({
    Key: ['collections', 'by-ad', adId],
    endpoint: `/collections/by-ad/${adId}`,
  }),
};

