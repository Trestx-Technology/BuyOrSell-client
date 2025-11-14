export const mediaQueries = {
  // Get presigned URL for upload
  getPresignedUrl: {
    key: "get-presigned-url",
    endpoint: "/presigned-url",
  },
  // Upload file using presigned URL
  uploadFile: {
    key: "upload-file",
    endpoint: "/media/upload",
  },
  // Get media by ID
  getMediaById: {
    key: "get-media-by-id",
    endpoint: "/media/:id",
  },
  // Delete media
  deleteMedia: {
    key: "delete-media",
    endpoint: "/media/:id",
  },
  // Get all media
  getAllMedia: {
    key: "get-all-media",
    endpoint: "/media",
  },
};

