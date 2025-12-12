import { axiosInstance } from '@/services/axios-api-client';
import { jobApplicationQueries } from './index';
import type {
  ApplyToJobPayload,
  AcceptApplicationPayload,
  RejectApplicationPayload,
  UpdateApplicationStatusPayload,
  JobApplicationsResponse,
  SingleJobApplicationResponse,
  SimilarJobsParams,
  JobsListResponse,
} from '@/interfaces/job.types';

// ============================================================================
// JOB APPLICATIONS SERVICES
// ============================================================================

export const applyToJob = async (
  jobId: string,
  payload: ApplyToJobPayload,
): Promise<SingleJobApplicationResponse> => {
  const response = await axiosInstance.post<SingleJobApplicationResponse>(
    jobApplicationQueries.applyToJob(jobId).endpoint,
    payload,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  return response.data;
};

export const getMyApplications = async (params?: {
  page?: number;
  limit?: number;
  status?: string;
}): Promise<JobApplicationsResponse> => {
  const response = await axiosInstance.get<JobApplicationsResponse>(
    jobApplicationQueries.getMyApplications.endpoint,
    { params },
  );
  return response.data;
};

export const acceptApplication = async (
  applicationId: string,
  payload: AcceptApplicationPayload,
): Promise<SingleJobApplicationResponse> => {
  const response = await axiosInstance.post<SingleJobApplicationResponse>(
    jobApplicationQueries.acceptApplication(applicationId).endpoint,
    payload,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  return response.data;
};

export const rejectApplication = async (
  applicationId: string,
  payload: RejectApplicationPayload,
): Promise<SingleJobApplicationResponse> => {
  const response = await axiosInstance.post<SingleJobApplicationResponse>(
    jobApplicationQueries.rejectApplication(applicationId).endpoint,
    payload,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  return response.data;
};

export const updateApplicationStatus = async (
  applicationId: string,
  payload: UpdateApplicationStatusPayload,
): Promise<SingleJobApplicationResponse> => {
  const response = await axiosInstance.patch<SingleJobApplicationResponse>(
    jobApplicationQueries.updateApplicationStatus(applicationId).endpoint,
    payload,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  return response.data;
};

export const getSimilarJobs = async (
  params?: SimilarJobsParams,
): Promise<JobsListResponse> => {
  const response = await axiosInstance.get<JobsListResponse>(
    jobApplicationQueries.getSimilarJobs.endpoint,
    { params },
  );
  return response.data;
};

