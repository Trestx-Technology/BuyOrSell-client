import { axiosInstance } from "@/services/axios-api-client";
import { jobseekerQueries } from "./index";
import type {
  JobseekerProfileResponse,
  JobseekerProfilesListResponse,
  DeleteResponse,
  UpdateJobseekerProfilePayload,
  CreateWorkExperiencePayload,
  CreateEducationPayload,
  CreateCertificationPayload,
  CreatePortfolioItemPayload,
} from "@/interfaces/job.types";

// ============================================================================
// GENERAL PROFILE SERVICES
// ============================================================================

export const createJobseekerProfile = async (
  data: Partial<UpdateJobseekerProfilePayload>
): Promise<JobseekerProfileResponse> => {
  const response = await axiosInstance.post<JobseekerProfileResponse>(
    jobseekerQueries.createJobseekerProfile.endpoint,
    data
  );
  return response.data;
};

export const getJobseekerProfileById = async (
  id: string
): Promise<JobseekerProfileResponse> => {
  const response = await axiosInstance.get<JobseekerProfileResponse>(
    jobseekerQueries.getJobseekerProfileById(id).endpoint
  );
  return response.data;
};

export const updateJobseekerProfileById = async (
  id: string,
  data: UpdateJobseekerProfilePayload
): Promise<JobseekerProfileResponse> => {
  const response = await axiosInstance.patch<JobseekerProfileResponse>(
    jobseekerQueries.updateJobseekerProfile(id).endpoint,
    data
  );
  return response.data;
};

export const deleteJobseekerProfile = async (
  id: string
): Promise<DeleteResponse> => {
  const response = await axiosInstance.delete<DeleteResponse>(
    jobseekerQueries.deleteJobseekerProfile(id).endpoint
  );
  return response.data;
};

export const updateJobseekerProfilePartialById = async (
  id: string,
  data: Partial<UpdateJobseekerProfilePayload>
): Promise<JobseekerProfileResponse> => {
  const response = await axiosInstance.patch<JobseekerProfileResponse>(
    jobseekerQueries.updateJobseekerProfilePartial(id).endpoint,
    data
  );
  return response.data;
};

export const banJobseekerProfile = async (
  id: string
): Promise<DeleteResponse> => {
  const response = await axiosInstance.patch<DeleteResponse>(
    jobseekerQueries.banJobseekerProfile(id).endpoint
  );
  return response.data;
};

export const unbanJobseekerProfile = async (
  id: string
): Promise<DeleteResponse> => {
  const response = await axiosInstance.patch<DeleteResponse>(
    jobseekerQueries.unbanJobseekerProfile(id).endpoint
  );
  return response.data;
};

export const blockJobseekerProfile = async (
  id: string
): Promise<DeleteResponse> => {
  const response = await axiosInstance.patch<DeleteResponse>(
    jobseekerQueries.blockJobseekerProfile(id).endpoint
  );
  return response.data;
};

export const unblockJobseekerProfile = async (
  id: string
): Promise<DeleteResponse> => {
  const response = await axiosInstance.patch<DeleteResponse>(
    jobseekerQueries.unblockJobseekerProfile(id).endpoint
  );
  return response.data;
};

// ============================================================================
// CURRENT USER PROFILE SERVICES (/me)
// ============================================================================

export const getJobseekerProfile =
  async (): Promise<JobseekerProfileResponse> => {
    const response = await axiosInstance.get<JobseekerProfileResponse>(
      jobseekerQueries.getJobseekerProfile.endpoint
    );
    return response.data;
  };

export const crateOrUpdateJobseekerProfilePartialMe = async (
  data: Partial<UpdateJobseekerProfilePayload>
): Promise<JobseekerProfileResponse> => {
  const response = await axiosInstance.patch<JobseekerProfileResponse>(
    jobseekerQueries.crateOrUpdateJobseekerProfilePartialMe.endpoint,
    data
  );
  return response.data;
};

// ============================================================================
// PROFILE BY USER ID SERVICES
// ============================================================================

export const getJobseekerProfileByUserId = async (
  userId: string,
  params?: { similarJobs?: boolean }
): Promise<JobseekerProfileResponse> => {
  const response = await axiosInstance.get<JobseekerProfileResponse>(
    jobseekerQueries.getJobseekerProfileByUserId(userId).endpoint,
    { params }
  );
  return response.data;
};

export const updateJobseekerProfilePartialByUserId = async (
  userId: string,
  data: Partial<UpdateJobseekerProfilePayload>
): Promise<JobseekerProfileResponse> => {
  const response = await axiosInstance.patch<JobseekerProfileResponse>(
    jobseekerQueries.updateJobseekerProfilePartialByUserId(userId).endpoint,
    data
  );
  return response.data;
};

// ============================================================================
// AWARDS BY USER ID SERVICES
// ============================================================================

export const appendAwardsByUserId = async (
  userId: string,
  data: Array<Record<string, unknown>>
): Promise<JobseekerProfileResponse> => {
  const response = await axiosInstance.post<JobseekerProfileResponse>(
    jobseekerQueries.appendAwardsByUserId(userId).endpoint,
    data
  );
  return response.data;
};

export const replaceAwardsByUserId = async (
  userId: string,
  data: Array<Record<string, unknown>>
): Promise<JobseekerProfileResponse> => {
  const response = await axiosInstance.patch<JobseekerProfileResponse>(
    jobseekerQueries.replaceAwardsByUserId(userId).endpoint,
    data
  );
  return response.data;
};

// ============================================================================
// CERTIFICATIONS BY USER ID SERVICES
// ============================================================================

export const appendCertificationsByUserId = async (
  userId: string,
  data: CreateCertificationPayload[]
): Promise<JobseekerProfileResponse> => {
  const response = await axiosInstance.post<JobseekerProfileResponse>(
    jobseekerQueries.appendCertificationsByUserId(userId).endpoint,
    data
  );
  return response.data;
};

export const replaceCertificationsByUserId = async (
  userId: string,
  data: CreateCertificationPayload[]
): Promise<JobseekerProfileResponse> => {
  const response = await axiosInstance.patch<JobseekerProfileResponse>(
    jobseekerQueries.replaceCertificationsByUserId(userId).endpoint,
    data
  );
  return response.data;
};

// ============================================================================
// EDUCATIONS BY USER ID SERVICES
// ============================================================================

export const appendEducationsByUserId = async (
  userId: string,
  data: CreateEducationPayload[]
): Promise<JobseekerProfileResponse> => {
  const response = await axiosInstance.post<JobseekerProfileResponse>(
    jobseekerQueries.appendEducationsByUserId(userId).endpoint,
    data
  );
  return response.data;
};

export const replaceEducationsByUserId = async (
  userId: string,
  data: CreateEducationPayload[]
): Promise<JobseekerProfileResponse> => {
  const response = await axiosInstance.patch<JobseekerProfileResponse>(
    jobseekerQueries.replaceEducationsByUserId(userId).endpoint,
    data
  );
  return response.data;
};

// ============================================================================
// EXPERIENCES BY USER ID SERVICES
// ============================================================================

export const appendExperiencesByUserId = async (
  userId: string,
  data: CreateWorkExperiencePayload[]
): Promise<JobseekerProfileResponse> => {
  const response = await axiosInstance.post<JobseekerProfileResponse>(
    jobseekerQueries.appendExperiencesByUserId(userId).endpoint,
    data
  );
  return response.data;
};

export const replaceExperiencesByUserId = async (
  userId: string,
  data: CreateWorkExperiencePayload[]
): Promise<JobseekerProfileResponse> => {
  const response = await axiosInstance.patch<JobseekerProfileResponse>(
    jobseekerQueries.replaceExperiencesByUserId(userId).endpoint,
    data
  );
  return response.data;
};

// ============================================================================
// LANGUAGES BY USER ID SERVICES
// ============================================================================

export const appendLanguagesByUserId = async (
  userId: string,
  data: Array<Record<string, unknown>>
): Promise<JobseekerProfileResponse> => {
  const response = await axiosInstance.post<JobseekerProfileResponse>(
    jobseekerQueries.appendLanguagesByUserId(userId).endpoint,
    data
  );
  return response.data;
};

export const replaceLanguagesByUserId = async (
  userId: string,
  data: Array<Record<string, unknown>>
): Promise<JobseekerProfileResponse> => {
  const response = await axiosInstance.patch<JobseekerProfileResponse>(
    jobseekerQueries.replaceLanguagesByUserId(userId).endpoint,
    data
  );
  return response.data;
};

// ============================================================================
// LINKS BY USER ID SERVICES
// ============================================================================

export const appendLinksByUserId = async (
  userId: string,
  data: Array<Record<string, unknown>>
): Promise<JobseekerProfileResponse> => {
  const response = await axiosInstance.post<JobseekerProfileResponse>(
    jobseekerQueries.appendLinksByUserId(userId).endpoint,
    data
  );
  return response.data;
};

export const replaceLinksByUserId = async (
  userId: string,
  data: Array<Record<string, unknown>>
): Promise<JobseekerProfileResponse> => {
  const response = await axiosInstance.patch<JobseekerProfileResponse>(
    jobseekerQueries.replaceLinksByUserId(userId).endpoint,
    data
  );
  return response.data;
};

// ============================================================================
// PROJECTS BY USER ID SERVICES
// ============================================================================

export const appendProjectsByUserId = async (
  userId: string,
  data: CreatePortfolioItemPayload[]
): Promise<JobseekerProfileResponse> => {
  const response = await axiosInstance.post<JobseekerProfileResponse>(
    jobseekerQueries.appendProjectsByUserId(userId).endpoint,
    data
  );
  return response.data;
};

export const replaceProjectsByUserId = async (
  userId: string,
  data: CreatePortfolioItemPayload[]
): Promise<JobseekerProfileResponse> => {
  const response = await axiosInstance.patch<JobseekerProfileResponse>(
    jobseekerQueries.replaceProjectsByUserId(userId).endpoint,
    data
  );
  return response.data;
};

// ============================================================================
// PUBLICATIONS BY USER ID SERVICES
// ============================================================================

export const appendPublicationsByUserId = async (
  userId: string,
  data: Array<Record<string, unknown>>
): Promise<JobseekerProfileResponse> => {
  const response = await axiosInstance.post<JobseekerProfileResponse>(
    jobseekerQueries.appendPublicationsByUserId(userId).endpoint,
    data
  );
  return response.data;
};

export const replacePublicationsByUserId = async (
  userId: string,
  data: Array<Record<string, unknown>>
): Promise<JobseekerProfileResponse> => {
  const response = await axiosInstance.patch<JobseekerProfileResponse>(
    jobseekerQueries.replacePublicationsByUserId(userId).endpoint,
    data
  );
  return response.data;
};

// ============================================================================
// RESUME SERVICES
// ============================================================================

export const createProfileFromResume = async (data: {
  resumeText?: string;
  linkedInUrl?: string;
}): Promise<JobseekerProfileResponse> => {
  const response = await axiosInstance.post<JobseekerProfileResponse>(
    jobseekerQueries.createProfileFromResume.endpoint,
    data
  );
  return response.data;
};

// ============================================================================
// SEARCH SERVICES
// ============================================================================

export const searchJobseekerProfiles = async (params?: {
  page?: number;
  limit?: number;
  [key: string]: unknown;
}): Promise<JobseekerProfilesListResponse> => {
  const response = await axiosInstance.get<JobseekerProfilesListResponse>(
    jobseekerQueries.searchJobseekerProfiles.endpoint,
    { params }
  );
  return response.data;
};
