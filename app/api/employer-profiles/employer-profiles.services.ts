import { axiosInstance } from '@/services/axios-api-client';
import { employerProfilesQueries } from './index';
import type {
  SingleEmployerProfileResponse,
  EmployerProfilesListResponse,
  DeleteEmployerProfileResponse,
  CreateEmployerProfilePayload,
  UpdateEmployerProfilePayload,
  SearchEmployerProfilesParams,
} from '@/interfaces/employer-profiles.types';

// ============================================================================
// EMPLOYER PROFILE CRUD OPERATIONS
// ============================================================================

export const createEmployerProfile = async (
  payload: CreateEmployerProfilePayload,
): Promise<SingleEmployerProfileResponse> => {
  const response = await axiosInstance.post<SingleEmployerProfileResponse>(
    employerProfilesQueries.createEmployerProfile.endpoint,
    payload,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  return response.data;
};

export const getEmployerProfileById = async (
  id: string,
): Promise<SingleEmployerProfileResponse> => {
  const response = await axiosInstance.get<SingleEmployerProfileResponse>(
    employerProfilesQueries.getEmployerProfileById(id).endpoint,
  );
  return response.data;
};

export const updateEmployerProfile = async (
  id: string,
  payload: UpdateEmployerProfilePayload,
): Promise<SingleEmployerProfileResponse> => {
  const response = await axiosInstance.patch<SingleEmployerProfileResponse>(
    employerProfilesQueries.updateEmployerProfile(id).endpoint,
    payload,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  return response.data;
};

export const deleteEmployerProfile = async (
  id: string,
): Promise<DeleteEmployerProfileResponse> => {
  const response = await axiosInstance.delete<DeleteEmployerProfileResponse>(
    employerProfilesQueries.deleteEmployerProfile(id).endpoint,
  );
  return response.data;
};

// ============================================================================
// EMPLOYER PROFILE SEARCH
// ============================================================================

export const searchEmployerProfiles = async (
  params: SearchEmployerProfilesParams,
): Promise<EmployerProfilesListResponse> => {
  const response = await axiosInstance.get<EmployerProfilesListResponse>(
    employerProfilesQueries.searchEmployerProfiles.endpoint,
    { params },
  );
  return response.data;
};

