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
  return useQuery<SavedJobsCountResponse, Error>({
    queryKey: savedJobsQueries.getSavedJobsCount.Key,
    queryFn: () => getSavedJobsCount(),
    enabled: enabled !== false,
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
  enabled?: boolean
) => {
  return useQuery<SavedJobsListResponse, Error>({
    queryKey: [...savedJobsQueries.getMySavedJobs.Key, params],
    queryFn: () => getMySavedJobs(params),
    enabled: enabled !== false,
  });
};

// ============================================================================
// SAVED JOBS MUTATION HOOKS (WITH OPTIMISTIC UPDATES)
// ============================================================================

type SavedJobContext = {
  previousCheck?: CheckSavedJobResponse;
  previousCount?: SavedJobsCountResponse;
};

export const useSaveJob = () => {
  const queryClient = useQueryClient();

  return useMutation<SavedJobResponse, Error, SaveJobPayload, SavedJobContext>({
    mutationFn: (payload) => saveJob(payload),
    onMutate: async (variables) => {
      // Cancel any outgoing refetches to avoid overwriting optimistic update
      await queryClient.cancelQueries({
        queryKey: [...savedJobsQueries.checkSavedJob.Key, variables.jobId],
      });
      await queryClient.cancelQueries({
        queryKey: savedJobsQueries.getMySavedJobs.Key,
      });
      await queryClient.cancelQueries({
        queryKey: savedJobsQueries.getSavedJobsCount.Key,
      });

      // Snapshot the previous values
      const previousCheck = queryClient.getQueryData<CheckSavedJobResponse>([
        ...savedJobsQueries.checkSavedJob.Key,
        variables.jobId,
      ]);
      const previousCount = queryClient.getQueryData<SavedJobsCountResponse>(
        savedJobsQueries.getSavedJobsCount.Key
      );

      // Optimistically update to the new value
      queryClient.setQueryData<CheckSavedJobResponse>(
        [...savedJobsQueries.checkSavedJob.Key, variables.jobId],
        {
          statusCode: 200,
          message: "Job is saved",
          data: {
            isSaved: true,
            savedJobId: "optimistic-id",
          },
        }
      );

      // Optimistically update count
      if (previousCount) {
        queryClient.setQueryData<SavedJobsCountResponse>(
          savedJobsQueries.getSavedJobsCount.Key,
          {
            ...previousCount,
            data: {
              count: previousCount.data.count + 1,
            },
          }
        );
      }

      // Return context with the snapshotted values
      return { previousCheck, previousCount };
    },
    onSuccess: (data, variables) => {
      // Update with real data from server
      queryClient.setQueryData<CheckSavedJobResponse>(
        [...savedJobsQueries.checkSavedJob.Key, variables.jobId],
        {
          statusCode: 200,
          message: "Job is saved",
          data: {
            isSaved: true,
            savedJobId: data.data._id,
          },
        }
      );

      // Invalidate queries to refetch with real data
      queryClient.invalidateQueries({
        queryKey: savedJobsQueries.getMySavedJobs.Key,
      });
      queryClient.invalidateQueries({
        queryKey: savedJobsQueries.getSavedJobsCount.Key,
      });
      // Invalidate ads queries to update isSaved state in job listings
      queryClient.invalidateQueries({
        queryKey: adQueries.ads.Key,
      });
      queryClient.invalidateQueries({
        queryKey: adQueries.filterAds.Key,
      });
      queryClient.invalidateQueries({
        queryKey: ["ad", variables.jobId],
      });
    },
    onError: (error, variables, context) => {
      // Rollback optimistic updates on error
      if (context?.previousCheck) {
        queryClient.setQueryData<CheckSavedJobResponse>(
          [...savedJobsQueries.checkSavedJob.Key, variables.jobId],
          context.previousCheck
        );
      }
      if (context?.previousCount) {
        queryClient.setQueryData<SavedJobsCountResponse>(
          savedJobsQueries.getSavedJobsCount.Key,
          context.previousCount
        );
      }
    },
  });
};

export const useDeleteSavedJob = () => {
  const queryClient = useQueryClient();

  return useMutation<
    { statusCode: number; message: string },
    Error,
    { savedJobId: string; jobId: string },
    SavedJobContext
  >({
    mutationFn: ({ savedJobId }) => deleteSavedJob(savedJobId),
    onMutate: async (variables) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: [...savedJobsQueries.checkSavedJob.Key, variables.jobId],
      });
      await queryClient.cancelQueries({
        queryKey: savedJobsQueries.getMySavedJobs.Key,
      });
      await queryClient.cancelQueries({
        queryKey: savedJobsQueries.getSavedJobsCount.Key,
      });

      // Snapshot the previous values
      const previousCheck = queryClient.getQueryData<CheckSavedJobResponse>([
        ...savedJobsQueries.checkSavedJob.Key,
        variables.jobId,
      ]);
      const previousCount = queryClient.getQueryData<SavedJobsCountResponse>(
        savedJobsQueries.getSavedJobsCount.Key
      );

      // Optimistically update to the new value
      queryClient.setQueryData<CheckSavedJobResponse>(
        [...savedJobsQueries.checkSavedJob.Key, variables.jobId],
        {
          statusCode: 200,
          message: "Job is not saved",
          data: {
            isSaved: false,
          },
        }
      );

      // Optimistically update count
      if (previousCount && previousCount.data.count > 0) {
        queryClient.setQueryData<SavedJobsCountResponse>(
          savedJobsQueries.getSavedJobsCount.Key,
          {
            ...previousCount,
            data: {
              count: previousCount.data.count - 1,
            },
          }
        );
      }

      // Return context with the snapshotted values
      return { previousCheck, previousCount };
    },
    onSuccess: (_, variables) => {
      // Invalidate queries to refetch with real data
      queryClient.invalidateQueries({
        queryKey: [...savedJobsQueries.checkSavedJob.Key, variables.jobId],
      });
      queryClient.invalidateQueries({
        queryKey: savedJobsQueries.getMySavedJobs.Key,
      });
      queryClient.invalidateQueries({
        queryKey: savedJobsQueries.getSavedJobsCount.Key,
      });
      // Invalidate ads queries to update isSaved state in job listings
      queryClient.invalidateQueries({
        queryKey: adQueries.ads.Key,
      });
      queryClient.invalidateQueries({
        queryKey: adQueries.filterAds.Key,
      });
      queryClient.invalidateQueries({
        queryKey: ["ad", variables.jobId],
      });
    },
    onError: (error, variables, context) => {
      // Rollback optimistic updates on error
      if (context?.previousCheck) {
        queryClient.setQueryData<CheckSavedJobResponse>(
          [...savedJobsQueries.checkSavedJob.Key, variables.jobId],
          context.previousCheck
        );
      }
      if (context?.previousCount) {
        queryClient.setQueryData<SavedJobsCountResponse>(
          savedJobsQueries.getSavedJobsCount.Key,
          context.previousCount
        );
      }
    },
  });
};

export const useDeleteSavedJobByJobAndSeeker = () => {
  const queryClient = useQueryClient();

  return useMutation<
    { statusCode: number; message: string },
    Error,
    { jobSeekerId: string; jobId: string },
    SavedJobContext
  >({
    mutationFn: ({ jobSeekerId, jobId }) =>
      deleteSavedJobByJobAndSeeker(jobSeekerId, jobId),
    onMutate: async (variables) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: [...savedJobsQueries.checkSavedJob.Key, variables.jobId],
      });
      await queryClient.cancelQueries({
        queryKey: savedJobsQueries.getMySavedJobs.Key,
      });
      await queryClient.cancelQueries({
        queryKey: savedJobsQueries.getSavedJobsCount.Key,
      });

      // Snapshot the previous values
      const previousCheck = queryClient.getQueryData<CheckSavedJobResponse>([
        ...savedJobsQueries.checkSavedJob.Key,
        variables.jobId,
      ]);
      const previousCount = queryClient.getQueryData<SavedJobsCountResponse>(
        savedJobsQueries.getSavedJobsCount.Key
      );

      // Optimistically update to the new value
      queryClient.setQueryData<CheckSavedJobResponse>(
        [...savedJobsQueries.checkSavedJob.Key, variables.jobId],
        {
          statusCode: 200,
          message: "Job is not saved",
          data: {
            isSaved: false,
          },
        }
      );

      // Optimistically update count
      if (previousCount && previousCount.data.count > 0) {
        queryClient.setQueryData<SavedJobsCountResponse>(
          savedJobsQueries.getSavedJobsCount.Key,
          {
            ...previousCount,
            data: {
              count: previousCount.data.count - 1,
            },
          }
        );
      }

      // Return context with the snapshotted values
      return { previousCheck, previousCount };
    },
    onSuccess: (_, variables) => {
      // Invalidate queries to refetch with real data
      queryClient.invalidateQueries({
        queryKey: [...savedJobsQueries.checkSavedJob.Key, variables.jobId],
      });
      queryClient.invalidateQueries({
        queryKey: savedJobsQueries.getMySavedJobs.Key,
      });
      queryClient.invalidateQueries({
        queryKey: savedJobsQueries.getSavedJobsCount.Key,
      });
      // Invalidate ads queries to update isSaved state in job listings
      queryClient.invalidateQueries({
        queryKey: adQueries.ads.Key,
      });
      queryClient.invalidateQueries({
        queryKey: adQueries.filterAds.Key,
      });
      queryClient.invalidateQueries({
        queryKey: ["ad", variables.jobId],
      });
    },
    onError: (error, variables, context) => {
      // Rollback optimistic updates on error
      if (context?.previousCheck) {
        queryClient.setQueryData<CheckSavedJobResponse>(
          [...savedJobsQueries.checkSavedJob.Key, variables.jobId],
          context.previousCheck
        );
      }
      if (context?.previousCount) {
        queryClient.setQueryData<SavedJobsCountResponse>(
          savedJobsQueries.getSavedJobsCount.Key,
          context.previousCount
        );
      }
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
