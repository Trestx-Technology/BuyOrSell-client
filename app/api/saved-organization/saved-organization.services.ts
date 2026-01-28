import { axiosInstance } from '@/services/axios-api-client';
import { savedOrganizationQueries } from './index';
import type {
  CreateSavedOrganizationPayload,
  UpdateSavedOrganizationPayload,
  SavedOrganizationResponse,
  SavedOrganizationsListResponse,
  CheckSavedOrganizationResponse,
  SavedOrganizationsCountResponse,
} from '@/interfaces/saved-organization.types';

// ============================================================================
// SAVED ORGANIZATIONS SERVICES
// ============================================================================

// Save an organization
export const saveOrganization = async (
  data: CreateSavedOrganizationPayload,
): Promise<SavedOrganizationResponse> => {
  const response = await axiosInstance.post<SavedOrganizationResponse>(
    savedOrganizationQueries.saveOrganization.endpoint,
    data,
  );
  return response.data;
};

// Get all saved organizations for the authenticated user
export const getMySavedOrganizations = async (): Promise<SavedOrganizationsListResponse> => {
  const response = await axiosInstance.get<SavedOrganizationsListResponse>(
    savedOrganizationQueries.findAllSavedOrganizations().endpoint,
  );
  return response.data;
};

// Get all saved organizations for a specific user
export const getSavedOrganizationsByUserId = async (
  userId: string,
): Promise<SavedOrganizationsListResponse> => {
  const response = await axiosInstance.get<SavedOrganizationsListResponse>(
    savedOrganizationQueries.findAllSavedOrganizations(userId).endpoint,
  );
  return response.data;
};

// Check if an organization is saved
export const checkOrganizationSaved = async (
  organizationId: string,
): Promise<CheckSavedOrganizationResponse> => {
  const response = await axiosInstance.get<CheckSavedOrganizationResponse>(
    savedOrganizationQueries.checkSavedOrganization(organizationId).endpoint,
    { params: { organizationId } },
  );
  return response.data;
};

// Get count of saved organizations
export const getSavedOrganizationsCount = async (): Promise<SavedOrganizationsCountResponse> => {
  const response = await axiosInstance.get<SavedOrganizationsCountResponse>(
    savedOrganizationQueries.getSavedOrganizationsCount.endpoint,
  );
  return response.data;
};

// Get a saved organization by ID
export const getSavedOrganizationDetail = async (
  id: string,
): Promise<SavedOrganizationResponse> => {
  const response = await axiosInstance.get<SavedOrganizationResponse>(
    savedOrganizationQueries.getSavedOrganizationDetail(id).endpoint,
  );
  return response.data;
};

// Update notes for a saved organization
export const updateSavedOrganization = async (
  id: string,
  data: UpdateSavedOrganizationPayload,
): Promise<SavedOrganizationResponse> => {
  const response = await axiosInstance.put<SavedOrganizationResponse>(
    savedOrganizationQueries.updateSavedOrganization(id).endpoint,
    data,
  );
  return response.data;
};

// Remove a saved organization by ID
export const removeSavedOrganization = async (id: string): Promise<{
  statusCode: number;
  message?: string;
}> => {
  const response = await axiosInstance.delete<{
    statusCode: number;
    message?: string;
  }>(savedOrganizationQueries.deleteSavedOrganization(id).endpoint);
  return response.data;
};

// Remove a saved organization by user and organization ID
export const removeSavedOrganizationByUserAndOrg = async (
  userId: string,
  organizationId: string,
): Promise<{
  statusCode: number;
  message?: string;
}> => {
  const response = await axiosInstance.delete<{
    statusCode: number;
    message?: string;
  }>(savedOrganizationQueries.deleteSavedOrganizationByUserAndOrg(userId, organizationId).endpoint);
  return response.data;
};
