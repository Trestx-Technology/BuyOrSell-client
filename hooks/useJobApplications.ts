import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  applyToJob,
  getMyApplications,
  acceptApplication,
  rejectApplication,
  updateApplicationStatus,
  getSimilarJobs,
} from '@/app/api/job-applications/job-applications.services';
import {
  ApplyToJobPayload,
  AcceptApplicationPayload,
  RejectApplicationPayload,
  UpdateApplicationStatusPayload,
  JobApplicationsResponse,
  SingleJobApplicationResponse,
  SimilarJobsParams,
  JobsListResponse,
} from '@/interfaces/job.types';
import { jobApplicationQueries } from '@/app/api/job-applications/index';

// ============================================================================
// JOB APPLICATIONS QUERY HOOKS
// ============================================================================

export const useGetMyApplications = (params?: {
  page?: number;
  limit?: number;
  status?: string;
}) => {
  return useQuery<JobApplicationsResponse, Error>({
    queryKey: [...jobApplicationQueries.getMyApplications.Key, params],
    queryFn: () => getMyApplications(params),
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: jobApplicationQueries.getMyApplications.Key });
      queryClient.invalidateQueries({ queryKey: jobApplicationQueries.getSimilarJobs.Key });
    },
  });
};

export const useAcceptApplication = () => {
  const queryClient = useQueryClient();

  return useMutation<
    SingleJobApplicationResponse,
    Error,
    { applicationId: string; payload: AcceptApplicationPayload }
  >({
    mutationFn: ({ applicationId, payload }) => acceptApplication(applicationId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: jobApplicationQueries.getMyApplications.Key });
    },
  });
};

export const useRejectApplication = () => {
  const queryClient = useQueryClient();

  return useMutation<
    SingleJobApplicationResponse,
    Error,
    { applicationId: string; payload: RejectApplicationPayload }
  >({
    mutationFn: ({ applicationId, payload }) => rejectApplication(applicationId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: jobApplicationQueries.getMyApplications.Key });
    },
  });
};

export const useUpdateApplicationStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<
    SingleJobApplicationResponse,
    Error,
    { applicationId: string; payload: UpdateApplicationStatusPayload }
  >({
    mutationFn: ({ applicationId, payload }) => updateApplicationStatus(applicationId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: jobApplicationQueries.getMyApplications.Key });
    },
  });
};

