import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getJobsByOrganization,
  getJobsByCategory,
  searchJobs,
  getFeaturedJobs,
  getRecentJobs,
  getMyJobs,
  updateJobStatus,
  getJobApplicants,
  getJobApplicantById,
  updateApplicantStatus,
  filterJobs,
} from '@/app/api/job/job.services';
import {
  JobsListResponse,
  SingleJobResponse,
  JobApplicantsListResponse,
  SingleJobApplicantResponse,
  CreateJobPayload,
  UpdateJobPayload,
  UpdateJobStatusPayload,
  UpdateApplicantStatusPayload,
  JobFilters,
  JobSearchParams,
  JobFilterPayload,
} from '@/interfaces/job.types';
import { jobQueries } from '@/app/api/job/index';

// ============================================================================
// JOB QUERY HOOKS
// ============================================================================

export const useGetAllJobs = (params?: JobFilters) => {
  return useQuery<JobsListResponse, Error>({
    queryKey: [...jobQueries.getAllJobs.Key, params],
    queryFn: () => getAllJobs(params),
  });
};

export const useGetJobById = (id: string) => {
  return useQuery<SingleJobResponse, Error>({
    queryKey: jobQueries.getJobById(id).Key,
    queryFn: () => getJobById(id),
    enabled: !!id,
  });
};

export const useGetJobsByOrganization = (
  organizationId: string,
  params?: {
    page?: number;
    limit?: number;
    status?: string;
  },
) => {
  return useQuery<JobsListResponse, Error>({
    queryKey: [...jobQueries.getJobsByOrganization(organizationId).Key, params],
    queryFn: () => getJobsByOrganization(organizationId, params),
    enabled: !!organizationId,
  });
};

export const useGetJobsByCategory = (
  categoryId: string,
  params?: {
    page?: number;
    limit?: number;
    salaryMin?: number;
    salaryMax?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  },
) => {
  return useQuery<JobsListResponse, Error>({
    queryKey: [...jobQueries.getJobsByCategory(categoryId).Key, params],
    queryFn: () => getJobsByCategory(categoryId, params),
    enabled: !!categoryId,
  });
};

export const useSearchJobs = (params: JobSearchParams) => {
  return useQuery<JobsListResponse, Error>({
    queryKey: [...jobQueries.searchJobs.Key, params],
    queryFn: () => searchJobs(params),
    enabled: !!params.query,
  });
};

export const useGetFeaturedJobs = (params?: {
  page?: number;
  limit?: number;
  category?: string;
}) => {
  return useQuery<JobsListResponse, Error>({
    queryKey: [...jobQueries.getFeaturedJobs.Key, params],
    queryFn: () => getFeaturedJobs(params),
  });
};

export const useGetRecentJobs = (params?: {
  page?: number;
  limit?: number;
  category?: string;
}) => {
  return useQuery<JobsListResponse, Error>({
    queryKey: [...jobQueries.getRecentJobs.Key, params],
    queryFn: () => getRecentJobs(params),
  });
};

export const useGetMyJobs = (params?: {
  page?: number;
  limit?: number;
  status?: 'live' | 'closed' | 'draft' | 'pending' | 'rejected';
}) => {
  return useQuery<JobsListResponse, Error>({
    queryKey: [...jobQueries.getMyJobs.Key, params],
    queryFn: () => getMyJobs(params),
  });
};

export const useGetJobApplicants = (
  id: string,
  params?: {
    page?: number;
    limit?: number;
    status?: 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'accepted';
  },
) => {
  return useQuery<JobApplicantsListResponse, Error>({
    queryKey: [...jobQueries.getJobApplicants(id).Key, params],
    queryFn: () => getJobApplicants(id, params),
    enabled: !!id,
  });
};

export const useGetJobApplicantById = (jobId: string, applicantId: string) => {
  return useQuery<SingleJobApplicantResponse, Error>({
    queryKey: jobQueries.getJobApplicantById(jobId, applicantId).Key,
    queryFn: () => getJobApplicantById(jobId, applicantId),
    enabled: !!jobId && !!applicantId,
  });
};

// ============================================================================
// JOB MUTATION HOOKS
// ============================================================================

export const useCreateJob = () => {
  const queryClient = useQueryClient();

  return useMutation<SingleJobResponse, Error, CreateJobPayload>({
    mutationFn: createJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: jobQueries.getAllJobs.Key });
      queryClient.invalidateQueries({ queryKey: jobQueries.getMyJobs.Key });
      queryClient.invalidateQueries({ queryKey: jobQueries.getFeaturedJobs.Key });
      queryClient.invalidateQueries({ queryKey: jobQueries.getRecentJobs.Key });
    },
  });
};

export const useUpdateJob = () => {
  const queryClient = useQueryClient();

  return useMutation<SingleJobResponse, Error, { id: string; data: UpdateJobPayload }>({
    mutationFn: ({ id, data }) => updateJob(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: jobQueries.getAllJobs.Key });
      queryClient.invalidateQueries({
        queryKey: jobQueries.getJobById(variables.id).Key,
      });
      queryClient.invalidateQueries({ queryKey: jobQueries.getMyJobs.Key });
      queryClient.invalidateQueries({ queryKey: jobQueries.getFeaturedJobs.Key });
      queryClient.invalidateQueries({ queryKey: jobQueries.getRecentJobs.Key });
    },
  });
};

export const useDeleteJob = () => {
  const queryClient = useQueryClient();

  return useMutation<
    { statusCode: number; timestamp: string; message?: string },
    Error,
    string
  >({
    mutationFn: deleteJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: jobQueries.getAllJobs.Key });
      queryClient.invalidateQueries({ queryKey: jobQueries.getMyJobs.Key });
      queryClient.invalidateQueries({ queryKey: jobQueries.getFeaturedJobs.Key });
      queryClient.invalidateQueries({ queryKey: jobQueries.getRecentJobs.Key });
    },
  });
};

export const useUpdateJobStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<
    SingleJobResponse,
    Error,
    { id: string; data: UpdateJobStatusPayload }
  >({
    mutationFn: ({ id, data }) => updateJobStatus(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: jobQueries.getAllJobs.Key });
      queryClient.invalidateQueries({
        queryKey: jobQueries.getJobById(variables.id).Key,
      });
      queryClient.invalidateQueries({ queryKey: jobQueries.getMyJobs.Key });
      queryClient.invalidateQueries({
        queryKey: jobQueries.getJobApplicants(variables.id).Key,
      });
    },
  });
};

export const useUpdateApplicantStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<
    SingleJobApplicantResponse,
    Error,
    { jobId: string; applicantId: string; data: UpdateApplicantStatusPayload }
  >({
    mutationFn: ({ jobId, applicantId, data }) =>
      updateApplicantStatus(jobId, applicantId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: jobQueries.getJobApplicants(variables.jobId).Key,
      });
      queryClient.invalidateQueries({
        queryKey: jobQueries.getJobApplicantById(
          variables.jobId,
          variables.applicantId,
        ).Key,
      });
    },
  });
};

export const useFilterJobs = () => {
  return useMutation<JobsListResponse, Error, JobFilterPayload>({
    mutationFn: filterJobs,
  });
};

