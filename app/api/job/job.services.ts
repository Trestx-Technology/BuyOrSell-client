import { axiosInstance } from '@/services/axios-api-client';
import { jobQueries } from './index';
import type {
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

// ============================================================================
// JOB CRUD OPERATIONS
// ============================================================================

export const getAllJobs = async (params?: JobFilters): Promise<JobsListResponse> => {
  const response = await axiosInstance.get<JobsListResponse>(
    jobQueries.getAllJobs.endpoint,
    { params },
  );
  return response.data;
};

export const getJobById = async (id: string): Promise<SingleJobResponse> => {
  const response = await axiosInstance.get<SingleJobResponse>(
    jobQueries.getJobById(id).endpoint,
  );
  return response.data;
};

export const createJob = async (payload: CreateJobPayload): Promise<SingleJobResponse> => {
  const response = await axiosInstance.post<SingleJobResponse>(
    jobQueries.createJob.endpoint,
    payload,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  return response.data;
};

export const updateJob = async (
  id: string,
  payload: UpdateJobPayload,
): Promise<SingleJobResponse> => {
  const response = await axiosInstance.put<SingleJobResponse>(
    jobQueries.updateJob(id).endpoint,
    payload,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  return response.data;
};

export const deleteJob = async (id: string): Promise<{
  statusCode: number;
  timestamp: string;
  message?: string;
}> => {
  const response = await axiosInstance.delete<{
    statusCode: number;
    timestamp: string;
    message?: string;
  }>(jobQueries.deleteJob(id).endpoint);
  return response.data;
};

// ============================================================================
// JOB QUERIES
// ============================================================================

export const getJobsByOrganization = async (
  organizationId: string,
  params?: {
    page?: number;
    limit?: number;
    status?: string;
  },
): Promise<JobsListResponse> => {
  const response = await axiosInstance.get<JobsListResponse>(
    jobQueries.getJobsByOrganization(organizationId).endpoint,
    { params },
  );
  return response.data;
};

export const getJobsByCategory = async (
  categoryId: string,
  params?: {
    page?: number;
    limit?: number;
    salaryMin?: number;
    salaryMax?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  },
): Promise<JobsListResponse> => {
  const response = await axiosInstance.get<JobsListResponse>(
    jobQueries.getJobsByCategory(categoryId).endpoint,
    { params },
  );
  return response.data;
};

export const searchJobs = async (params: JobSearchParams): Promise<JobsListResponse> => {
  const response = await axiosInstance.get<JobsListResponse>(
    jobQueries.searchJobs.endpoint,
    { params },
  );
  return response.data;
};

export const getFeaturedJobs = async (params?: {
  page?: number;
  limit?: number;
  category?: string;
}): Promise<JobsListResponse> => {
  const response = await axiosInstance.get<JobsListResponse>(
    jobQueries.getFeaturedJobs.endpoint,
    { params },
  );
  return response.data;
};

export const getRecentJobs = async (params?: {
  page?: number;
  limit?: number;
  category?: string;
}): Promise<JobsListResponse> => {
  const response = await axiosInstance.get<JobsListResponse>(
    jobQueries.getRecentJobs.endpoint,
    { params },
  );
  return response.data;
};

export const getMyJobs = async (params?: {
  page?: number;
  limit?: number;
  status?: 'live' | 'closed' | 'draft' | 'pending' | 'rejected';
}): Promise<JobsListResponse> => {
  const response = await axiosInstance.get<JobsListResponse>(
    jobQueries.getMyJobs.endpoint,
    { params },
  );
  return response.data;
};

// ============================================================================
// JOB STATUS
// ============================================================================

export const updateJobStatus = async (
  id: string,
  payload: UpdateJobStatusPayload,
): Promise<SingleJobResponse> => {
  const response = await axiosInstance.patch<SingleJobResponse>(
    jobQueries.updateJobStatus(id).endpoint,
    payload,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  return response.data;
};

// ============================================================================
// JOB APPLICANTS
// ============================================================================

export const getJobApplicants = async (
  id: string,
  params?: {
    page?: number;
    limit?: number;
    status?: 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'accepted';
  },
): Promise<JobApplicantsListResponse> => {
  const response = await axiosInstance.get<JobApplicantsListResponse>(
    jobQueries.getJobApplicants(id).endpoint,
    { params },
  );
  return response.data;
};

export const getJobApplicantById = async (
  jobId: string,
  applicantId: string,
): Promise<SingleJobApplicantResponse> => {
  const response = await axiosInstance.get<SingleJobApplicantResponse>(
    jobQueries.getJobApplicantById(jobId, applicantId).endpoint,
  );
  return response.data;
};

export const updateApplicantStatus = async (
  jobId: string,
  applicantId: string,
  payload: UpdateApplicantStatusPayload,
): Promise<SingleJobApplicantResponse> => {
  const response = await axiosInstance.patch<SingleJobApplicantResponse>(
    jobQueries.updateApplicantStatus(jobId, applicantId).endpoint,
    payload,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  return response.data;
};

// ============================================================================
// JOB FILTERS
// ============================================================================

export const filterJobs = async (payload: JobFilterPayload): Promise<JobsListResponse> => {
  const response = await axiosInstance.post<JobsListResponse>(
    jobQueries.filterJobs.endpoint,
    payload,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  return response.data;
};

