import { axiosInstance } from '@/services/axios-api-client';
import { organizationQueries } from './index';
import type {
  CreateOrganizationPayload,
  UpdateOrganizationPayload,
  OrganizationResponse,
  OrganizationsListResponse,
  BlockOrganizationPayload,
  OrganizationByIdResponse,
  BlockHistoryItem,
  FollowersListResponse,
  FollowersCountResponse,
  BulkApprovePayload,
  BulkRejectPayload,
} from '@/interfaces/organization.types';

// Get all organizations with pagination, search and sorting
export const findAllOrganizations = async (params?: {
  search?: string;
  type?: string;
  emirate?: string;
  verified?: boolean;
  status?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}): Promise<OrganizationsListResponse> => {
  const response = await axiosInstance.get<OrganizationsListResponse>(
    organizationQueries.findAllOrganizations(params).endpoint,
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
): Promise<OrganizationByIdResponse> => {
  const response = await axiosInstance.get<OrganizationByIdResponse>(
    organizationQueries.getOrganizationById(id).endpoint,
  );
  return response.data;
};

// Update organization
export const updateOrganization = async (
  id: string,
  data: UpdateOrganizationPayload,
): Promise<OrganizationResponse> => {
  const response = await axiosInstance.patch<OrganizationResponse>(
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

// Approve organization (Admin only)
export const approveOrganization = async (
  id: string,
): Promise<OrganizationResponse> => {
  const response = await axiosInstance.post<OrganizationResponse>(
    organizationQueries.approveOrganization(id).endpoint,
  );
  return response.data;
};

// Reject organization (Admin only)
export const rejectOrganization = async (
  id: string,
  data?: { rejectionReason?: string },
): Promise<OrganizationResponse> => {
  const response = await axiosInstance.post<OrganizationResponse>(
    organizationQueries.rejectOrganization(id).endpoint,
    data,
  );
  return response.data;
};

// Submit organization for review
export const submitOrganization = async (
  id: string,
): Promise<OrganizationResponse> => {
  const response = await axiosInstance.post<OrganizationResponse>(
    organizationQueries.submitOrganization(id).endpoint,
  );
  return response.data;
};

// Block or unblock organization (admin only)
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

// Get block history for an organization (admin only)
export const getBlockHistory = async (
  id: string,
): Promise<{
  statusCode: number;
  message: string;
  data: BlockHistoryItem[];
  timestamp: string;
}> => {
  const response = await axiosInstance.get<{
    statusCode: number;
    message: string;
    data: BlockHistoryItem[];
    timestamp: string;
  }>(organizationQueries.getBlockHistory(id).endpoint);
  return response.data;
};

// Follow an organization
export const followOrganization = async (
  id: string,
): Promise<OrganizationResponse> => {
  const response = await axiosInstance.post<OrganizationResponse>(
    organizationQueries.followOrganization(id).endpoint,
  );
  return response.data;
};

// Unfollow an organization
export const unfollowOrganization = async (
  id: string,
): Promise<OrganizationResponse> => {
  const response = await axiosInstance.delete<OrganizationResponse>(
    organizationQueries.unfollowOrganization(id).endpoint,
  );
  return response.data;
};

// Get organization followers list with pagination
export const getFollowers = async (
  id: string,
  params?: { page?: number; limit?: number },
): Promise<FollowersListResponse> => {
  const response = await axiosInstance.get<FollowersListResponse>(
    organizationQueries.getFollowers(id, params).endpoint,
    { params },
  );
  return response.data;
};

// Get organization followers count
export const getFollowersCount = async (
  id: string,
): Promise<FollowersCountResponse> => {
  const response = await axiosInstance.get<FollowersCountResponse>(
    organizationQueries.getFollowersCount(id).endpoint,
  );
  return response.data;
};

// Bulk approve submitted organizations (Admin only)
export const bulkApproveOrganizations = async (
  data: BulkApprovePayload,
): Promise<{
  statusCode: number;
  message: string;
  data: { approved: number; failed: number };
  timestamp: string;
}> => {
  const response = await axiosInstance.post<{
    statusCode: number;
    message: string;
    data: { approved: number; failed: number };
    timestamp: string;
  }>(organizationQueries.bulkApproveOrganizations.endpoint, data);
  return response.data;
};

// Bulk reject submitted organizations (Admin only)
export const bulkRejectOrganizations = async (
  data: BulkRejectPayload,
): Promise<{
  statusCode: number;
  message: string;
  data: { rejected: number; failed: number };
  timestamp: string;
}> => {
  const response = await axiosInstance.post<{
    statusCode: number;
    message: string;
    data: { rejected: number; failed: number };
    timestamp: string;
  }>(organizationQueries.bulkRejectOrganizations.endpoint, data);
  return response.data;
};

