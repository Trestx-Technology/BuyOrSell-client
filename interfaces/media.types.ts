export interface PresignedUrlRequest {
  fileName: string;
  fileType: string;
  fileSize?: number;
}

export interface PresignedUrlResponse {
  statusCode: number;
  timestamp: string;
  data: {
    presignedUrl: string;
    fileUrl: string;
    fileName: string;
    fileKey: string;
  };
}

export interface UploadFileResponse {
  statusCode: number;
  timestamp: string;
  data: {
    key: string;
    fileUrl: string;
    contentType: string;
    size: number;
    originalName: string;
  };
}

export interface MediaItem {
  _id: string;
  url: string;
  fileName: string;
  fileKey: string;
  fileSize: number;
  fileType: string;
  uploadedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetMediaResponse {
  statusCode: number;
  timestamp: string;
  data: MediaItem | MediaItem[];
}

export interface DeleteMediaResponse {
  statusCode: number;
  timestamp: string;
  message: string;
}

