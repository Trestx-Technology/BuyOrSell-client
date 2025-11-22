export const mediaQueries = {
  getPresignedUrl: {
    Key: ['media', 'presigned-url'],
    endpoint: '/presigned-url',
  },
  uploadFile: {
    Key: ['media', 'upload'],
    endpoint: '/media/upload',
  },
  getMediaById: (id: string) => ({
    Key: ['media', id],
    endpoint: `/media/${id}`,
  }),
  deleteMedia: (id: string) => ({
    Key: ['media', id, 'delete'],
    endpoint: `/media/${id}`,
  }),
  getAllMedia: {
    Key: ['media'],
    endpoint: '/media',
  },
};

