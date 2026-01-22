import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  findAllOrganizations,
  createOrganization,
  getOrganizationById,
  updateOrganization,
  deleteOrganization,
  getMyOrganization,
  updateMyOrganization,
  approveOrganization,
  rejectOrganization,
  submitOrganization,
  blockOrganization,
  getBlockHistory,
  followOrganization,
  unfollowOrganization,
  getFollowers,
  getFollowersCount,
  bulkApproveOrganizations,
  bulkRejectOrganizations,
} from "@/app/api/organization/organization.services";
import {
  CreateOrganizationPayload,
  UpdateOrganizationPayload,
  OrganizationResponse,
  OrganizationsListResponse,
  BlockOrganizationPayload,
  OrganizationByIdResponse,
  BulkApprovePayload,
  BulkRejectPayload,
  BlockHistoryItem,
  OrganizationFollower,
} from "@/interfaces/organization.types";
import { organizationQueries } from "@/app/api/organization/index";
import { useAuthStore } from "@/stores/authStore";
import { useIsAuthenticated } from "./useAuth";

// ============================================================================
// QUERY HOOKS
// ============================================================================

// Get all organizations with pagination, search and sorting
export const useOrganizations = (params?: {
  search?: string;
  type?: string;
  emirate?: string;
  verified?: boolean;
  status?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}) => {
  return useQuery<OrganizationsListResponse, Error>({
    queryKey: [...organizationQueries.findAllOrganizations(params).Key],
    queryFn: () => findAllOrganizations(params),
  });
};

// Get organization by ID
export const useOrganizationById = (id: string) => {
  return useQuery<OrganizationByIdResponse, Error>({
    queryKey: [...organizationQueries.getOrganizationById(id).Key],
    queryFn: () => getOrganizationById(id),
    enabled: !!id,
  });
};

// Get my organization
export const useMyOrganization = (enabled?: boolean) => {
  const isAuthenticated = useIsAuthenticated();
  return useQuery<OrganizationResponse, Error>({
    queryKey: [...organizationQueries.getMyOrganization.Key],
    queryFn: () => getMyOrganization(),
    enabled: isAuthenticated || !enabled,
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
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      queryClient.invalidateQueries({
        queryKey: organizationQueries.getMyOrganization.Key,
      });
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
        queryKey: organizationQueries.getOrganizationById(variables.id).Key,
      });
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      queryClient.invalidateQueries({
        queryKey: organizationQueries.getMyOrganization.Key,
      });
    },
  });
};

// Update my organization
export const useUpdateMyOrganization = () => {
  const queryClient = useQueryClient();

  return useMutation<OrganizationResponse, Error, UpdateOrganizationPayload>({
    mutationFn: updateMyOrganization,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: organizationQueries.getMyOrganization.Key,
      });
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
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
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      queryClient.invalidateQueries({
        queryKey: organizationQueries.getMyOrganization.Key,
      });
    },
  });
};

// Approve organization (Admin only)
export const useApproveOrganization = () => {
  const queryClient = useQueryClient();

  return useMutation<OrganizationResponse, Error, string>({
    mutationFn: approveOrganization,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: organizationQueries.getOrganizationById(id).Key,
      });
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
    },
  });
};

// Reject organization (Admin only)
export const useRejectOrganization = () => {
  const queryClient = useQueryClient();

  return useMutation<
    OrganizationResponse,
    Error,
    { id: string; rejectionReason?: string }
  >({
    mutationFn: ({ id, rejectionReason }) =>
      rejectOrganization(id, { rejectionReason }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: organizationQueries.getOrganizationById(variables.id).Key,
      });
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
    },
  });
};

// Submit organization for review
export const useSubmitOrganization = () => {
  const queryClient = useQueryClient();

  return useMutation<OrganizationResponse, Error, string>({
    mutationFn: submitOrganization,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: organizationQueries.getOrganizationById(id).Key,
      });
      queryClient.invalidateQueries({
        queryKey: organizationQueries.getMyOrganization.Key,
      });
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
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
        queryKey: organizationQueries.getOrganizationById(variables.id).Key,
      });
      queryClient.invalidateQueries({
        queryKey: organizationQueries.getBlockHistory(variables.id).Key,
      });
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
    },
  });
};

// Get block history for an organization (admin only)
export const useBlockHistory = (id: string) => {
  return useQuery<
    {
      statusCode: number;
      message: string;
      data: BlockHistoryItem[];
      timestamp: string;
    },
    Error
  >({
    queryKey: [...organizationQueries.getBlockHistory(id).Key],
    queryFn: () => getBlockHistory(id),
    enabled: !!id,
  });
};

// Follow an organization
export const useFollowOrganization = () => {
  const queryClient = useQueryClient();

  return useMutation<OrganizationResponse, Error, string>({
    mutationFn: followOrganization,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: organizationQueries.getOrganizationById(id).Key,
      });
      queryClient.invalidateQueries({
        queryKey: organizationQueries.getFollowersCount(id).Key,
      });
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
    },
  });
};

// Unfollow an organization
export const useUnfollowOrganization = () => {
  const queryClient = useQueryClient();

  return useMutation<OrganizationResponse, Error, string>({
    mutationFn: unfollowOrganization,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: organizationQueries.getOrganizationById(id).Key,
      });
      queryClient.invalidateQueries({
        queryKey: organizationQueries.getFollowersCount(id).Key,
      });
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
    },
  });
};

// Get organization followers list with pagination
export const useFollowers = (
  id: string,
  params?: { page?: number; limit?: number }
) => {
  return useQuery<
    {
      statusCode: number;
      message: string;
      data: {
        followers: OrganizationFollower[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      };
      timestamp: string;
    },
    Error
  >({
    queryKey: [...organizationQueries.getFollowers(id, params).Key],
    queryFn: () => getFollowers(id, params),
    enabled: !!id,
  });
};

// Get organization followers count
export const useFollowersCount = (id: string) => {
  return useQuery<
    {
      statusCode: number;
      message: string;
      data: { count: number };
      timestamp: string;
    },
    Error
  >({
    queryKey: [...organizationQueries.getFollowersCount(id).Key],
    queryFn: () => getFollowersCount(id),
    enabled: !!id,
  });
};

// Bulk approve submitted organizations (Admin only)
export const useBulkApproveOrganizations = () => {
  const queryClient = useQueryClient();

  return useMutation<
    {
      statusCode: number;
      message: string;
      data: { approved: number; failed: number };
      timestamp: string;
    },
    Error,
    BulkApprovePayload
  >({
    mutationFn: bulkApproveOrganizations,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
    },
  });
};

// Bulk reject submitted organizations (Admin only)
export const useBulkRejectOrganizations = () => {
  const queryClient = useQueryClient();

  return useMutation<
    {
      statusCode: number;
      message: string;
      data: { rejected: number; failed: number };
      timestamp: string;
    },
    Error,
    BulkRejectPayload
  >({
    mutationFn: bulkRejectOrganizations,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
    },
  });
};
