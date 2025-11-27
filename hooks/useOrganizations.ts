import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  findAllOrganizations,
  createOrganization,
  getOrganizationById,
  updateOrganization,
  deleteOrganization,
  getMyOrganization,
  updateMyOrganization,
  verifyOrganization,
  blockOrganization,
  unblockOrganization,
  uploadLogo,
  uploadCoverImage,
} from '@/app/api/organization/organization.services';
import {
  CreateOrganizationPayload,
  UpdateOrganizationPayload,
  OrganizationResponse,
  OrganizationsListResponse,
  VerifyOrganizationPayload,
  BlockOrganizationPayload,
  UploadImageResponse,
} from '@/interfaces/organization.types';
import { organizationQueries } from '@/app/api/organization/index';

// ============================================================================
// QUERY HOOKS
// ============================================================================

// Get all organizations
export const useOrganizations = (params?: {
  filter?: string;
  page?: number;
  limit?: number;
  type?: string;
  emirate?: string;
  verified?: boolean;
}) => {
  return useQuery<OrganizationsListResponse, Error>({
    queryKey: [...organizationQueries.findAllOrganizations.Key, params],
    queryFn: () => findAllOrganizations(params),
  });
};

// Get organization by ID
export const useOrganizationById = (id: string) => {
  return useQuery<OrganizationResponse, Error>({
    queryKey: [...organizationQueries.getOrganizationById(id).Key],
    queryFn: () => getOrganizationById(id),
    enabled: !!id,
  });
};

// Get my organization
export const useMyOrganization = () => {
  return useQuery<OrganizationResponse, Error>({
    queryKey: [...organizationQueries.getMyOrganization.Key],
    queryFn: () => getMyOrganization(),
  });
};

// ============================================================================
// MUTATION HOOKS
// ============================================================================

// Create organization
export const useCreateOrganization = () => {
  const queryClient = useQueryClient();
  
  return useMutation<OrganizationResponse, Error, CreateOrganizationPayload>({
    mutationFn: createOrganization,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: organizationQueries.findAllOrganizations.Key });
      queryClient.invalidateQueries({ queryKey: organizationQueries.getMyOrganization.Key });
    },
  });
};

// Update organization
export const useUpdateOrganization = () => {
  const queryClient = useQueryClient();
  
  return useMutation<
    OrganizationResponse,
    Error,
    { id: string; data: UpdateOrganizationPayload }
  >({
    mutationFn: ({ id, data }) => updateOrganization(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: organizationQueries.getOrganizationById(variables.id).Key 
      });
      queryClient.invalidateQueries({ queryKey: organizationQueries.findAllOrganizations.Key });
    },
  });
};

// Update my organization
export const useUpdateMyOrganization = () => {
  const queryClient = useQueryClient();
  
  return useMutation<OrganizationResponse, Error, UpdateOrganizationPayload>({
    mutationFn: updateMyOrganization,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: organizationQueries.getMyOrganization.Key });
      queryClient.invalidateQueries({ queryKey: organizationQueries.findAllOrganizations.Key });
    },
  });
};

// Delete organization
export const useDeleteOrganization = () => {
  const queryClient = useQueryClient();
  
  return useMutation<
    { statusCode: number; timestamp: string; message?: string },
    Error,
    string
  >({
    mutationFn: deleteOrganization,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: organizationQueries.findAllOrganizations.Key });
    },
  });
};

// Verify organization
export const useVerifyOrganization = () => {
  const queryClient = useQueryClient();
  
  return useMutation<
    OrganizationResponse,
    Error,
    { id: string; data: VerifyOrganizationPayload }
  >({
    mutationFn: ({ id, data }) => verifyOrganization(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: organizationQueries.getOrganizationById(variables.id).Key 
      });
      queryClient.invalidateQueries({ queryKey: organizationQueries.findAllOrganizations.Key });
    },
  });
};

// Block organization
export const useBlockOrganization = () => {
  const queryClient = useQueryClient();
  
  return useMutation<
    OrganizationResponse,
    Error,
    { id: string; data: BlockOrganizationPayload }
  >({
    mutationFn: ({ id, data }) => blockOrganization(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: organizationQueries.getOrganizationById(variables.id).Key 
      });
      queryClient.invalidateQueries({ queryKey: organizationQueries.findAllOrganizations.Key });
    },
  });
};

// Unblock organization
export const useUnblockOrganization = () => {
  const queryClient = useQueryClient();
  
  return useMutation<OrganizationResponse, Error, string>({
    mutationFn: unblockOrganization,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ 
        queryKey: organizationQueries.getOrganizationById(id).Key 
      });
      queryClient.invalidateQueries({ queryKey: organizationQueries.findAllOrganizations.Key });
    },
  });
};

// Upload logo
export const useUploadLogo = () => {
  const queryClient = useQueryClient();
  
  return useMutation<UploadImageResponse, Error, File>({
    mutationFn: uploadLogo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: organizationQueries.getMyOrganization.Key });
    },
  });
};

// Upload cover image
export const useUploadCoverImage = () => {
  const queryClient = useQueryClient();
  
  return useMutation<UploadImageResponse, Error, File>({
    mutationFn: uploadCoverImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: organizationQueries.getMyOrganization.Key });
    },
  });
};

