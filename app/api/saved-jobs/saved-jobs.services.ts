import { axiosInstance } from "@/services/axios-api-client";
import { savedJobsQueries } from "./index";

// ============================================================================
// SAVED JOBS TYPES
// ============================================================================

export interface SaveJobPayload {
  jobSeekerId: string;
  jobId: string;
  notes?: string;
  notesAr?: string;
}

export interface UpdateSavedJobPayload {
  notes?: string;
  notesAr?: string;
}

export interface SavedJobResponse {
  statusCode: number;
  message: string;
  data: {
    _id: string;
    jobSeekerId: string;
    jobId: string;
    notes?: string;
    notesAr?: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface SavedJobsListResponse {
  statusCode: number;
  message: string;
  data: {
    items: Array<{
      _id: string;
      jobSeekerId: string;
      jobId: string;
      notes?: string;
      notesAr?: string;
      createdAt: string;
      updatedAt: string;
      job?: unknown;
    }>;
    total: number;
    page: number;
    limit: number;
  };
}

export interface CheckSavedJobResponse {
  statusCode: number;
  message: string;
  data: {
    isSaved: boolean;
    savedJobId?: string;
  };
}

export interface SavedJobsCountResponse {
  statusCode: number;
  message: string;
  data: {
    count: number;
  };
}

// ============================================================================
// SAVED JOBS SERVICES
// ============================================================================

export const saveJob = async (
  payload: SaveJobPayload
): Promise<SavedJobResponse> => {
  const response = await axiosInstance.post<SavedJobResponse>(
    savedJobsQueries.saveJob.endpoint,
    payload,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

export const getSavedJobById = async (
  id: string
): Promise<SavedJobResponse> => {
  const response = await axiosInstance.get<SavedJobResponse>(
    savedJobsQueries.getSavedJobById(id).endpoint
  );
  return response.data;
};

export const updateSavedJob = async (
  id: string,
  payload: UpdateSavedJobPayload
): Promise<SavedJobResponse> => {
  const response = await axiosInstance.put<SavedJobResponse>(
    savedJobsQueries.updateSavedJob(id).endpoint,
    payload,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

export const deleteSavedJob = async (
  id: string
): Promise<{ statusCode: number; message: string }> => {
  const response = await axiosInstance.delete<{
    statusCode: number;
    message: string;
  }>(savedJobsQueries.deleteSavedJob(id).endpoint);
  return response.data;
};

export const checkSavedJob = async (
  jobId: string
): Promise<CheckSavedJobResponse> => {
  const response = await axiosInstance.get<CheckSavedJobResponse>(
    savedJobsQueries.checkSavedJob.endpoint,
    { params: { jobId } }
  );
  return response.data;
};

export const getSavedJobsCount = async (): Promise<SavedJobsCountResponse> => {
  const response = await axiosInstance.get<SavedJobsCountResponse>(
    savedJobsQueries.getSavedJobsCount.endpoint
  );
  return response.data;
};

export const getSavedJobsByJobSeeker = async (
  jobSeekerId: string,
  params?: {
    page?: number;
    limit?: number;
  }
): Promise<SavedJobsListResponse> => {
  const response = await axiosInstance.get<SavedJobsListResponse>(
    savedJobsQueries.getSavedJobsByJobSeeker(jobSeekerId).endpoint,
    { params }
  );
  return response.data;
};

export const deleteSavedJobByJobAndSeeker = async (
  jobSeekerId: string,
  jobId: string
): Promise<{ statusCode: number; message: string }> => {
  const response = await axiosInstance.delete<{
    statusCode: number;
    message: string;
  }>(
    savedJobsQueries.deleteSavedJobByJobAndSeeker(jobSeekerId, jobId).endpoint
  );
  return response.data;
};

export const getMySavedJobs = async (params?: {
  page?: number;
  limit?: number;
}): Promise<SavedJobsListResponse> => {
  const response = await axiosInstance.get<SavedJobsListResponse>(
    savedJobsQueries.getMySavedJobs.endpoint,
    { params }
  );
  return response.data;
};
