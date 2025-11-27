import { axiosInstance } from '@/services/axios-api-client';
import { organizationQueries } from './index';
import type {
  CreateOrganizationPayload,
  UpdateOrganizationPayload,
  OrganizationResponse,
  OrganizationsListResponse,
  VerifyOrganizationPayload,
  BlockOrganizationPayload,
  UploadImageResponse,
} from '@/interfaces/organization.types';

// Get all organizations
export const findAllOrganizations = async (params?: {
  filter?: string;
  page?: number;
  limit?: number;
  type?: string;
  emirate?: string;
  verified?: boolean;
}): Promise<OrganizationsListResponse> => {
  const response = await axiosInstance.get<OrganizationsListResponse>(
    organizationQueries.findAllOrganizations.endpoint,
    { params },
  );
  return response.data;
};

// Create organization
export const createOrganization = async (
  data: CreateOrganizationPayload,
): Promise<OrganizationResponse> => {
  const response = await axiosInstance.post<OrganizationResponse>(
    organizationQueries.createOrganization.endpoint,
    data,
  );
  return response.data;
};

// Get organization by ID
export const getOrganizationById = async (
  id: string,
): Promise<OrganizationResponse> => {
  const response = await axiosInstance.get<OrganizationResponse>(
    organizationQueries.getOrganizationById(id).endpoint,
  );
  return response.data;
};

// Update organization
export const updateOrganization = async (
  id: string,
  data: UpdateOrganizationPayload,
): Promise<OrganizationResponse> => {
  const response = await axiosInstance.put<OrganizationResponse>(
    organizationQueries.updateOrganization(id).endpoint,
    data,
  );
  return response.data;
};

// Delete organization
export const deleteOrganization = async (id: string): Promise<{
  statusCode: number;
  timestamp: string;
  message?: string;
}> => {
  const response = await axiosInstance.delete(
    organizationQueries.deleteOrganization(id).endpoint,
  );
  return response.data;
};

// Get my organization
export const getMyOrganization = async (): Promise<OrganizationResponse> => {
  const response = await axiosInstance.get<OrganizationResponse>(
    organizationQueries.getMyOrganization.endpoint,
  );
  return response.data;
};

// Update my organization
export const updateMyOrganization = async (
  data: UpdateOrganizationPayload,
): Promise<OrganizationResponse> => {
  const response = await axiosInstance.put<OrganizationResponse>(
    organizationQueries.updateMyOrganization.endpoint,
    data,
  );
  return response.data;
};

// Verify organization
export const verifyOrganization = async (
  id: string,
  data: VerifyOrganizationPayload,
): Promise<OrganizationResponse> => {
  const response = await axiosInstance.put<OrganizationResponse>(
    organizationQueries.verifyOrganization(id).endpoint,
    data,
  );
  return response.data;
};

// Block organization
export const blockOrganization = async (
  id: string,
  data: BlockOrganizationPayload,
): Promise<OrganizationResponse> => {
  const response = await axiosInstance.post<OrganizationResponse>(
    organizationQueries.blockOrganization(id).endpoint,
    data,
  );
  return response.data;
};

// Unblock organization
export const unblockOrganization = async (
  id: string,
): Promise<OrganizationResponse> => {
  const response = await axiosInstance.post<OrganizationResponse>(
    organizationQueries.unblockOrganization(id).endpoint,
  );
  return response.data;
};

// Upload logo
export const uploadLogo = async (
  file: File,
): Promise<UploadImageResponse> => {
  const formData = new FormData();
  formData.append('logo', file);
  
  const response = await axiosInstance.post<UploadImageResponse>(
    organizationQueries.uploadLogo.endpoint,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  return response.data;
};

// Upload cover image
export const uploadCoverImage = async (
  file: File,
): Promise<UploadImageResponse> => {
  const formData = new FormData();
  formData.append('cover', file);
  
  const response = await axiosInstance.post<UploadImageResponse>(
    organizationQueries.uploadCoverImage.endpoint,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  return response.data;
};

