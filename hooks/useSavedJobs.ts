import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  saveJob,
  getSavedJobById,
  updateSavedJob,
  deleteSavedJob,
  checkSavedJob,
  getSavedJobsCount,
  getSavedJobsByJobSeeker,
  deleteSavedJobByJobAndSeeker,
  getMySavedJobs,
  SaveJobPayload,
  UpdateSavedJobPayload,
  SavedJobResponse,
  SavedJobsListResponse,
  CheckSavedJobResponse,
  SavedJobsCountResponse,
} from "@/app/api/saved-jobs/saved-jobs.services";
import { savedJobsQueries } from "@/app/api/saved-jobs/index";
import { adQueries } from "@/app/api/ad/index";
import { useIsAuthenticated } from "./useAuth";

// ============================================================================
// SAVED JOBS QUERY HOOKS
// ============================================================================

export const useGetSavedJobById = (id: string, enabled?: boolean) => {
  return useQuery<SavedJobResponse, Error>({
    queryKey: savedJobsQueries.getSavedJobById(id).Key,
    queryFn: () => getSavedJobById(id),
    enabled: enabled !== false && !!id,
  });
};

export const useCheckSavedJob = (jobId: string, enabled?: boolean) => {
  return useQuery<CheckSavedJobResponse, Error>({
    queryKey: [...savedJobsQueries.checkSavedJob.Key, jobId],
    queryFn: () => checkSavedJob(jobId),
    enabled: enabled !== false && !!jobId,
  });
};

export const useGetSavedJobsCount = (enabled?: boolean) => {
  const isAuthenticated = useIsAuthenticated();
  return useQuery<SavedJobsCountResponse, Error>({
    queryKey: savedJobsQueries.getSavedJobsCount.Key,
    queryFn: () => getSavedJobsCount(),
    enabled: enabled !== false || isAuthenticated,
  });
};

export const useGetSavedJobsByJobSeeker = (
  jobSeekerId: string,
  params?: {
    page?: number;
    limit?: number;
  },
  enabled?: boolean
) => {
  return useQuery<SavedJobsListResponse, Error>({
    queryKey: [
      ...savedJobsQueries.getSavedJobsByJobSeeker(jobSeekerId).Key,
      params,
    ],
    queryFn: () => getSavedJobsByJobSeeker(jobSeekerId, params),
    enabled: enabled !== false && !!jobSeekerId,
  });
};

export const useGetMySavedJobs = (
  params?: {
    page?: number;
    limit?: number;
  },
  enabled?: boolean,
) => {
  const isAuthenticated = useIsAuthenticated();
  return useQuery<SavedJobsListResponse, Error>({
    queryKey: [...savedJobsQueries.getMySavedJobs.Key, params],
    queryFn: () => getMySavedJobs(params),
    enabled: enabled !== false && isAuthenticated,
  });
};

// ============================================================================
// SAVED JOBS MUTATION HOOKS
// ============================================================================

export const useSaveJob = () => {
  const queryClient = useQueryClient();

  return useMutation<SavedJobResponse, Error, SaveJobPayload>({
    mutationFn: (payload) => saveJob(payload),
    onSuccess: (_, variables) => {
      // Invalidate queries to ensure fresh data eventually
      queryClient.invalidateQueries({
        queryKey: savedJobsQueries.getMySavedJobs.Key,
      });
      queryClient.invalidateQueries({
        queryKey: savedJobsQueries.getSavedJobsCount.Key,
      });
      queryClient.invalidateQueries({
        queryKey: [...savedJobsQueries.checkSavedJob.Key, variables.jobId],
      });
      queryClient.invalidateQueries({ queryKey: adQueries.ads.Key });
    },
  });
};

export const useDeleteSavedJob = () => {
  const queryClient = useQueryClient();

  return useMutation<
    { statusCode: number; message: string },
    Error,
    { savedJobId: string; jobId: string }
  >({
    mutationFn: ({ savedJobId }) => deleteSavedJob(savedJobId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: savedJobsQueries.getMySavedJobs.Key,
      });
      queryClient.invalidateQueries({
        queryKey: savedJobsQueries.getSavedJobsCount.Key,
      });
      queryClient.invalidateQueries({
        queryKey: [...savedJobsQueries.checkSavedJob.Key, variables.jobId],
      });
      queryClient.invalidateQueries({ queryKey: adQueries.ads.Key });
    },
  });
};

export const useDeleteSavedJobByJobAndSeeker = () => {
  const queryClient = useQueryClient();

  return useMutation<
    { statusCode: number; message: string },
    Error,
    { jobSeekerId: string; jobId: string }
  >({
    mutationFn: ({ jobSeekerId, jobId }) =>
      deleteSavedJobByJobAndSeeker(jobSeekerId, jobId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: savedJobsQueries.getMySavedJobs.Key,
      });
      queryClient.invalidateQueries({
        queryKey: savedJobsQueries.getSavedJobsCount.Key,
      });
      queryClient.invalidateQueries({
        queryKey: [...savedJobsQueries.checkSavedJob.Key, variables.jobId],
      });
      queryClient.invalidateQueries({ queryKey: adQueries.ads.Key });
    },
  });
};

export const useUpdateSavedJob = () => {
  const queryClient = useQueryClient();

  return useMutation<
    SavedJobResponse,
    Error,
    { id: string; payload: UpdateSavedJobPayload }
  >({
    mutationFn: ({ id, payload }) => updateSavedJob(id, payload),
    onSuccess: (data) => {
      // Invalidate queries to refetch with updated data
      queryClient.invalidateQueries({
        queryKey: savedJobsQueries.getSavedJobById(data.data._id).Key,
      });
      queryClient.invalidateQueries({
        queryKey: savedJobsQueries.getMySavedJobs.Key,
      });
    },
  });
};
