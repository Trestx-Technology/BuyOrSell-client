import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createEmployerProfile,
  getEmployerProfileById,
  updateEmployerProfile,
  deleteEmployerProfile,
  searchEmployerProfiles,
} from '@/app/api/employer-profiles/employer-profiles.services';
import {
  SingleEmployerProfileResponse,
  EmployerProfilesListResponse,
  DeleteEmployerProfileResponse,
  CreateEmployerProfilePayload,
  UpdateEmployerProfilePayload,
  SearchEmployerProfilesParams,
} from '@/interfaces/employer-profiles.types';
import { employerProfilesQueries } from '@/app/api/employer-profiles/index';

// ============================================================================
// EMPLOYER PROFILE QUERY HOOKS
// ============================================================================

export const useGetEmployerProfileById = (id: string) => {
  return useQuery<SingleEmployerProfileResponse, Error>({
    queryKey: employerProfilesQueries.getEmployerProfileById(id).Key,
    queryFn: () => getEmployerProfileById(id),
    enabled: !!id,
  });
};

export const useSearchEmployerProfiles = (params: SearchEmployerProfilesParams) => {
  return useQuery<EmployerProfilesListResponse, Error>({
    queryKey: [...employerProfilesQueries.searchEmployerProfiles.Key, params],
    queryFn: () => searchEmployerProfiles(params),
    enabled: !!params.q || params.q === '',
  });
};

// ============================================================================
// EMPLOYER PROFILE MUTATION HOOKS
// ============================================================================

export const useCreateEmployerProfile = () => {
  const queryClient = useQueryClient();

  return useMutation<SingleEmployerProfileResponse, Error, CreateEmployerProfilePayload>({
    mutationFn: createEmployerProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: employerProfilesQueries.searchEmployerProfiles.Key,
      });
    },
  });
};

export const useUpdateEmployerProfile = () => {
  const queryClient = useQueryClient();

  return useMutation<
    SingleEmployerProfileResponse,
    Error,
    { id: string; data: UpdateEmployerProfilePayload }
  >({
    mutationFn: ({ id, data }) => updateEmployerProfile(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: employerProfilesQueries.getEmployerProfileById(variables.id).Key,
      });
      queryClient.invalidateQueries({
        queryKey: employerProfilesQueries.searchEmployerProfiles.Key,
      });
    },
  });
};

export const useDeleteEmployerProfile = () => {
  const queryClient = useQueryClient();

  return useMutation<DeleteEmployerProfileResponse, Error, string>({
    mutationFn: deleteEmployerProfile,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: employerProfilesQueries.getEmployerProfileById(id).Key,
      });
      queryClient.invalidateQueries({
        queryKey: employerProfilesQueries.searchEmployerProfiles.Key,
      });
    },
  });
};

