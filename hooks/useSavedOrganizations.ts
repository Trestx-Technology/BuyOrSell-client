import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  saveOrganization,
  getMySavedOrganizations,
  getSavedOrganizationsByUserId,
  checkOrganizationSaved,
  getSavedOrganizationsCount,
  getSavedOrganizationDetail,
  updateSavedOrganization,
  removeSavedOrganization,
  removeSavedOrganizationByUserAndOrg,
} from "@/app/api/saved-organization/saved-organization.services";
import {
  CreateSavedOrganizationPayload,
  UpdateSavedOrganizationPayload,
  SavedOrganizationResponse,
  SavedOrganizationsListResponse,
  CheckSavedOrganizationResponse,
  SavedOrganizationsCountResponse,
} from "@/interfaces/saved-organization.types";
import { savedOrganizationQueries } from "@/app/api/saved-organization/index";
import { useIsAuthenticated } from "./useAuth";

// ============================================================================
// QUERY HOOKS
// ============================================================================

// Get all saved organizations for the authenticated user
export const useMySavedOrganizations = () => {
  const isAuthenticated = useIsAuthenticated();
  return useQuery<SavedOrganizationsListResponse, Error>({
    queryKey: [...savedOrganizationQueries.findAllSavedOrganizations().Key],
    queryFn: () => getMySavedOrganizations(),
    enabled: isAuthenticated,
  });
};

// Check if an organization is saved
export const useCheckOrganizationSaved = (organizationId: string) => {
  const isAuthenticated = useIsAuthenticated();
  return useQuery<CheckSavedOrganizationResponse, Error>({
    queryKey: [...savedOrganizationQueries.checkSavedOrganization(organizationId).Key],
    queryFn: () => checkOrganizationSaved(organizationId),
    enabled: isAuthenticated && !!organizationId,
  });
};

// Get count of saved organizations
export const useSavedOrganizationsCount = () => {
  const isAuthenticated = useIsAuthenticated();
  return useQuery<SavedOrganizationsCountResponse, Error>({
    queryKey: [...savedOrganizationQueries.getSavedOrganizationsCount.Key],
    queryFn: () => getSavedOrganizationsCount(),
    enabled: isAuthenticated,
  });
};

// ============================================================================
// MUTATION HOOKS
// ============================================================================

// Save an organization
export const useSaveOrganization = () => {
  const queryClient = useQueryClient();

  return useMutation<SavedOrganizationResponse, Error, CreateSavedOrganizationPayload>({
    mutationFn: saveOrganization,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: savedOrganizationQueries.checkSavedOrganization(variables.organizationId).Key,
      });
      queryClient.invalidateQueries({
        queryKey: savedOrganizationQueries.findAllSavedOrganizations().Key,
      });
      queryClient.invalidateQueries({
        queryKey: savedOrganizationQueries.getSavedOrganizationsCount.Key,
      });
    },
  });
};

// Remove a saved organization by ID
export const useRemoveSavedOrganization = () => {
  const queryClient = useQueryClient();

  return useMutation<{ statusCode: number; message?: string }, Error, string>({
    mutationFn: removeSavedOrganization,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: savedOrganizationQueries.findAllSavedOrganizations().Key,
      });
      queryClient.invalidateQueries({
        queryKey: savedOrganizationQueries.getSavedOrganizationsCount.Key,
      });
      // Note: Detail query and check query might need specific IDs to invalidate
      queryClient.invalidateQueries({ queryKey: ["saved-organizations"] });
    },
  });
};

// Remove a saved organization by user and organization ID
export const useRemoveSavedOrganizationByUserAndOrg = () => {
  const queryClient = useQueryClient();

  return useMutation<
    { statusCode: number; message?: string },
    Error,
    { userId: string; organizationId: string }
  >({
    mutationFn: ({ userId, organizationId }) =>
      removeSavedOrganizationByUserAndOrg(userId, organizationId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: savedOrganizationQueries.checkSavedOrganization(variables.organizationId).Key,
      });
      queryClient.invalidateQueries({
        queryKey: savedOrganizationQueries.findAllSavedOrganizations().Key,
      });
      queryClient.invalidateQueries({
        queryKey: savedOrganizationQueries.getSavedOrganizationsCount.Key,
      });
    },
  });
};
