import {
  PresignedUrlRequest,
  PresignedUrlResponse,
  UploadFileResponse,
  GetMediaResponse,
  DeleteMediaResponse,
} from '@/interfaces/media.types';
import { mediaQueries } from './index';
import { axiosInstance } from '@/services/axios-api-client';

// Upload file directly to /media/upload endpoint
export const uploadFile = async (
  file: File,
): Promise<UploadFileResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axiosInstance.post<UploadFileResponse>(
    mediaQueries.uploadFile.endpoint,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  return response.data;
};

// Upload multiple files
export const uploadFiles = async (
  files: File[],
): Promise<UploadFileResponse[]> => {
  const uploadPromises = files.map((file) => uploadFile(file));
  return Promise.all(uploadPromises);
};

// Get presigned URL for file upload
export const getPresignedUrl = async (
  request: PresignedUrlRequest,
): Promise<PresignedUrlResponse> => {
  const response = await axiosInstance.post<PresignedUrlResponse>(
    mediaQueries.getPresignedUrl.endpoint,
    request,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  return response.data;
};

// Upload file to presigned URL
export const uploadFileToPresignedUrl = async (
  presignedUrl: string,
  file: File,
): Promise<void> => {
  await fetch(presignedUrl, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type,
    },
  });
};

// Get media by ID
export const getMediaById = async (
  id: string,
): Promise<GetMediaResponse> => {
  const response = await axiosInstance.get<GetMediaResponse>(
    mediaQueries.getMediaById(id).endpoint,
  );
  return response.data;
};

// Delete media
export const deleteMedia = async (
  id: string,
): Promise<DeleteMediaResponse> => {
  const response = await axiosInstance.delete<DeleteMediaResponse>(
    mediaQueries.deleteMedia(id).endpoint,
  );
  return response.data;
};

// Get all media
export const getAllMedia = async (params?: {
  page?: number;
  limit?: number;
  fileType?: string;
}): Promise<GetMediaResponse> => {
  const response = await axiosInstance.get<GetMediaResponse>(
    mediaQueries.getAllMedia.endpoint,
    { params },
  );
  return response.data;
};

