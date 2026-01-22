import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  applyToJob,
  getJobApplicants,
  getMyApplications,
  acceptApplication,
  rejectApplication,
  updateApplicationStatus,
  getSimilarJobs,
} from "@/app/api/job-applications/job-applications.services";
import {
  ApplyToJobPayload,
  AcceptApplicationPayload,
  RejectApplicationPayload,
  UpdateApplicationStatusPayload,
  JobApplicationsResponse,
  SingleJobApplicationResponse,
  SimilarJobsParams,
  JobsListResponse,
  JobApplicantsListResponse,
} from "@/interfaces/job.types";
import { jobApplicationQueries } from "@/app/api/job-applications/index";
import { useIsAuthenticated } from "./useAuth";
// ============================================================================
// JOB APPLICATIONS QUERY HOOKS
// ============================================================================

export const useGetJobApplicants = (
  jobId: string,
  params?: {
    page?: number;
    limit?: number;
    status?: string;
  },
  enabled?: boolean
) => {
  return useQuery<JobApplicantsListResponse, Error>({
    queryKey: [...jobApplicationQueries.getJobApplicants(jobId).Key, params],
    queryFn: () => getJobApplicants(jobId, params),
    enabled: enabled !== false && !!jobId,
  });
};

export const useGetMyApplications = (params?: {
  page?: number;
  limit?: number;
  status?: string;
}) => {
  const isAuthenticated = useIsAuthenticated();
  return useQuery<JobApplicationsResponse, Error>({
    queryKey: [...jobApplicationQueries.getMyApplications.Key, params],
    queryFn: () => getMyApplications(params),
    enabled: isAuthenticated,
  });
};

export const useGetSimilarJobs = (params?: SimilarJobsParams) => {
  return useQuery<JobsListResponse, Error>({
    queryKey: [...jobApplicationQueries.getSimilarJobs.Key, params],
    queryFn: () => getSimilarJobs(params),
  });
};

// ============================================================================
// JOB APPLICATIONS MUTATION HOOKS
// ============================================================================

export const useApplyToJob = () => {
  const queryClient = useQueryClient();

  return useMutation<
    SingleJobApplicationResponse,
    Error,
    { jobId: string; payload: ApplyToJobPayload }
  >({
    mutationFn: ({ jobId, payload }) => applyToJob(jobId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: jobApplicationQueries.getMyApplications.Key,
      });
      queryClient.invalidateQueries({
        queryKey: jobApplicationQueries.getSimilarJobs.Key,
      });
      // Invalidate job applicants query to update the count
      queryClient.invalidateQueries({
        queryKey: jobApplicationQueries.getJobApplicants(variables.jobId).Key,
      });
    },
  });
};

export const useAcceptApplication = () => {
  const queryClient = useQueryClient();

  return useMutation<
    SingleJobApplicationResponse,
    Error,
    { applicationId: string; payload: AcceptApplicationPayload; jobId?: string }
  >({
    mutationFn: ({ applicationId, payload }) =>
      acceptApplication(applicationId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: jobApplicationQueries.getMyApplications.Key,
      });
      // Invalidate job applicants query if jobId is provided
      if (variables.jobId) {
        queryClient.invalidateQueries({
          queryKey: jobApplicationQueries.getJobApplicants(variables.jobId).Key,
        });
      }
      // Also invalidate all job applicants queries (for cases where jobId might not be passed)
      queryClient.invalidateQueries({
        queryKey: ["job-applicants"],
      });
    },
  });
};

export const useRejectApplication = () => {
  const queryClient = useQueryClient();

  return useMutation<
    SingleJobApplicationResponse,
    Error,
    { applicationId: string; payload: RejectApplicationPayload; jobId?: string }
  >({
    mutationFn: ({ applicationId, payload }) =>
      rejectApplication(applicationId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: jobApplicationQueries.getMyApplications.Key,
      });
      // Invalidate job applicants query if jobId is provided
      if (variables.jobId) {
        queryClient.invalidateQueries({
          queryKey: jobApplicationQueries.getJobApplicants(variables.jobId).Key,
        });
      }
      // Also invalidate all job applicants queries (for cases where jobId might not be passed)
      queryClient.invalidateQueries({
        queryKey: ["job-applicants"],
      });
    },
  });
};

export const useUpdateApplicationStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<
    SingleJobApplicationResponse,
    Error,
    {
      applicationId: string;
      payload: UpdateApplicationStatusPayload;
      jobId?: string;
    }
  >({
    mutationFn: ({ applicationId, payload }) =>
      updateApplicationStatus(applicationId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: jobApplicationQueries.getMyApplications.Key,
      });
      // Invalidate job applicants query if jobId is provided
      if (variables.jobId) {
        queryClient.invalidateQueries({
          queryKey: jobApplicationQueries.getJobApplicants(variables.jobId).Key,
        });
      }
    },
  });
};
