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
};

