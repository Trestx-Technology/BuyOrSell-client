import { axiosInstance } from '@/services/axios-api-client';
import { jobseekerQueries } from './index';
import type {
  JobseekerProfileResponse,
  WorkExperienceResponse,
  SingleWorkExperienceResponse,
  EducationResponse,
  SingleEducationResponse,
  SkillsResponse,
  SingleSkillResponse,
  CertificationsResponse,
  SingleCertificationResponse,
  PortfolioResponse,
  SinglePortfolioItemResponse,
  JobApplicationsResponse,
  SingleJobApplicationResponse,
  SavedJobsResponse,
  ResumeUploadResponse,
  DeleteResponse,
  UpdateJobseekerProfilePayload,
  CreateWorkExperiencePayload,
  UpdateWorkExperiencePayload,
  CreateEducationPayload,
  UpdateEducationPayload,
  CreateSkillPayload,
  UpdateSkillPayload,
  CreateCertificationPayload,
  UpdateCertificationPayload,
  CreatePortfolioItemPayload,
  UpdatePortfolioItemPayload,
  UpdateJobPreferencesPayload,
  ApplyToJobPayload,
  SaveJobPayload,
} from '@/interfaces/job.types';

// ============================================================================
// GENERAL PROFILE SERVICES
// ============================================================================

export const createJobseekerProfile = async (
  data: Partial<UpdateJobseekerProfilePayload>,
): Promise<JobseekerProfileResponse> => {
  const response = await axiosInstance.post<JobseekerProfileResponse>(
    jobseekerQueries.createJobseekerProfile.endpoint,
    data,
  );
  return response.data;
};

export const getJobseekerProfileById = async (
  id: string,
): Promise<JobseekerProfileResponse> => {
  const response = await axiosInstance.get<JobseekerProfileResponse>(
    jobseekerQueries.getJobseekerProfileById(id).endpoint,
  );
  return response.data;
};

export const updateJobseekerProfileById = async (
  id: string,
  data: UpdateJobseekerProfilePayload,
): Promise<JobseekerProfileResponse> => {
  const response = await axiosInstance.patch<JobseekerProfileResponse>(
    jobseekerQueries.updateJobseekerProfile(id).endpoint,
    data,
  );
  return response.data;
};

export const deleteJobseekerProfile = async (id: string): Promise<DeleteResponse> => {
  const response = await axiosInstance.delete<DeleteResponse>(
    jobseekerQueries.deleteJobseekerProfile(id).endpoint,
  );
  return response.data;
};

export const updateJobseekerProfilePartialById = async (
  id: string,
  data: Partial<UpdateJobseekerProfilePayload>,
): Promise<JobseekerProfileResponse> => {
  const response = await axiosInstance.patch<JobseekerProfileResponse>(
    jobseekerQueries.updateJobseekerProfilePartial(id).endpoint,
    data,
  );
  return response.data;
};

export const banJobseekerProfile = async (id: string): Promise<DeleteResponse> => {
  const response = await axiosInstance.patch<DeleteResponse>(
    jobseekerQueries.banJobseekerProfile(id).endpoint,
  );
  return response.data;
};

export const unbanJobseekerProfile = async (id: string): Promise<DeleteResponse> => {
  const response = await axiosInstance.patch<DeleteResponse>(
    jobseekerQueries.unbanJobseekerProfile(id).endpoint,
  );
  return response.data;
};

export const blockJobseekerProfile = async (id: string): Promise<DeleteResponse> => {
  const response = await axiosInstance.patch<DeleteResponse>(
    jobseekerQueries.blockJobseekerProfile(id).endpoint,
  );
  return response.data;
};

export const unblockJobseekerProfile = async (id: string): Promise<DeleteResponse> => {
  const response = await axiosInstance.patch<DeleteResponse>(
    jobseekerQueries.unblockJobseekerProfile(id).endpoint,
  );
  return response.data;
};

// ============================================================================
// CURRENT USER PROFILE SERVICES (/me)
// ============================================================================

export const getJobseekerProfile = async (): Promise<JobseekerProfileResponse> => {
  const response = await axiosInstance.get<JobseekerProfileResponse>(
    jobseekerQueries.getJobseekerProfile.endpoint,
  );
  return response.data;
};

export const updateJobseekerProfilePartialMe = async (
  data: Partial<UpdateJobseekerProfilePayload>,
): Promise<JobseekerProfileResponse> => {
  const response = await axiosInstance.patch<JobseekerProfileResponse>(
    jobseekerQueries.updateJobseekerProfilePartialMe.endpoint,
    data,
  );
  return response.data;
};

// ============================================================================
// PROFILE BY USER ID SERVICES
// ============================================================================

export const getJobseekerProfileByUserId = async (
  userId: string,
  params?: { similarJobs?: boolean },
): Promise<JobseekerProfileResponse> => {
  const response = await axiosInstance.get<JobseekerProfileResponse>(
    jobseekerQueries.getJobseekerProfileByUserId(userId).endpoint,
    { params },
  );
  return response.data;
};

export const updateJobseekerProfilePartialByUserId = async (
  userId: string,
  data: Partial<UpdateJobseekerProfilePayload>,
): Promise<JobseekerProfileResponse> => {
  const response = await axiosInstance.patch<JobseekerProfileResponse>(
    jobseekerQueries.updateJobseekerProfilePartialByUserId(userId).endpoint,
    data,
  );
  return response.data;
};

// ============================================================================
// AWARDS BY USER ID SERVICES
// ============================================================================

export const appendAwardsByUserId = async (
  userId: string,
  data: Array<Record<string, unknown>>,
): Promise<JobseekerProfileResponse> => {
  const response = await axiosInstance.post<JobseekerProfileResponse>(
    jobseekerQueries.appendAwardsByUserId(userId).endpoint,
    data,
  );
  return response.data;
};

export const replaceAwardsByUserId = async (
  userId: string,
  data: Array<Record<string, unknown>>,
): Promise<JobseekerProfileResponse> => {
  const response = await axiosInstance.patch<JobseekerProfileResponse>(
    jobseekerQueries.replaceAwardsByUserId(userId).endpoint,
    data,
  );
  return response.data;
};

// ============================================================================
// CERTIFICATIONS BY USER ID SERVICES
// ============================================================================

export const appendCertificationsByUserId = async (
  userId: string,
  data: CreateCertificationPayload[],
): Promise<JobseekerProfileResponse> => {
  const response = await axiosInstance.post<JobseekerProfileResponse>(
    jobseekerQueries.appendCertificationsByUserId(userId).endpoint,
    data,
  );
  return response.data;
};

export const replaceCertificationsByUserId = async (
  userId: string,
  data: CreateCertificationPayload[],
): Promise<JobseekerProfileResponse> => {
  const response = await axiosInstance.patch<JobseekerProfileResponse>(
    jobseekerQueries.replaceCertificationsByUserId(userId).endpoint,
    data,
  );
  return response.data;
};

// ============================================================================
// EDUCATIONS BY USER ID SERVICES
// ============================================================================

export const appendEducationsByUserId = async (
  userId: string,
  data: CreateEducationPayload[],
): Promise<JobseekerProfileResponse> => {
  const response = await axiosInstance.post<JobseekerProfileResponse>(
    jobseekerQueries.appendEducationsByUserId(userId).endpoint,
    data,
  );
  return response.data;
};

export const replaceEducationsByUserId = async (
  userId: string,
  data: CreateEducationPayload[],
): Promise<JobseekerProfileResponse> => {
  const response = await axiosInstance.patch<JobseekerProfileResponse>(
    jobseekerQueries.replaceEducationsByUserId(userId).endpoint,
    data,
  );
  return response.data;
};

// ============================================================================
// EXPERIENCES BY USER ID SERVICES
// ============================================================================

export const appendExperiencesByUserId = async (
  userId: string,
  data: CreateWorkExperiencePayload[],
): Promise<JobseekerProfileResponse> => {
  const response = await axiosInstance.post<JobseekerProfileResponse>(
    jobseekerQueries.appendExperiencesByUserId(userId).endpoint,
    data,
  );
  return response.data;
};

export const replaceExperiencesByUserId = async (
  userId: string,
  data: CreateWorkExperiencePayload[],
): Promise<JobseekerProfileResponse> => {
  const response = await axiosInstance.patch<JobseekerProfileResponse>(
    jobseekerQueries.replaceExperiencesByUserId(userId).endpoint,
    data,
  );
  return response.data;
};

// ============================================================================
// LANGUAGES BY USER ID SERVICES
// ============================================================================

export const appendLanguagesByUserId = async (
  userId: string,
  data: Array<Record<string, unknown>>,
): Promise<JobseekerProfileResponse> => {
  const response = await axiosInstance.post<JobseekerProfileResponse>(
    jobseekerQueries.appendLanguagesByUserId(userId).endpoint,
    data,
  );
  return response.data;
};

export const replaceLanguagesByUserId = async (
  userId: string,
  data: Array<Record<string, unknown>>,
): Promise<JobseekerProfileResponse> => {
  const response = await axiosInstance.patch<JobseekerProfileResponse>(
    jobseekerQueries.replaceLanguagesByUserId(userId).endpoint,
    data,
  );
  return response.data;
};

// ============================================================================
// LINKS BY USER ID SERVICES
// ============================================================================

export const appendLinksByUserId = async (
  userId: string,
  data: Array<Record<string, unknown>>,
): Promise<JobseekerProfileResponse> => {
  const response = await axiosInstance.post<JobseekerProfileResponse>(
    jobseekerQueries.appendLinksByUserId(userId).endpoint,
    data,
  );
  return response.data;
};

export const replaceLinksByUserId = async (
  userId: string,
  data: Array<Record<string, unknown>>,
): Promise<JobseekerProfileResponse> => {
  const response = await axiosInstance.patch<JobseekerProfileResponse>(
    jobseekerQueries.replaceLinksByUserId(userId).endpoint,
    data,
  );
  return response.data;
};

// ============================================================================
// PROJECTS BY USER ID SERVICES
// ============================================================================

export const appendProjectsByUserId = async (
  userId: string,
  data: CreatePortfolioItemPayload[],
): Promise<JobseekerProfileResponse> => {
  const response = await axiosInstance.post<JobseekerProfileResponse>(
    jobseekerQueries.appendProjectsByUserId(userId).endpoint,
    data,
  );
  return response.data;
};

export const replaceProjectsByUserId = async (
  userId: string,
  data: CreatePortfolioItemPayload[],
): Promise<JobseekerProfileResponse> => {
  const response = await axiosInstance.patch<JobseekerProfileResponse>(
    jobseekerQueries.replaceProjectsByUserId(userId).endpoint,
    data,
  );
  return response.data;
};

// ============================================================================
// PUBLICATIONS BY USER ID SERVICES
// ============================================================================

export const appendPublicationsByUserId = async (
  userId: string,
  data: Array<Record<string, unknown>>,
): Promise<JobseekerProfileResponse> => {
  const response = await axiosInstance.post<JobseekerProfileResponse>(
    jobseekerQueries.appendPublicationsByUserId(userId).endpoint,
    data,
  );
  return response.data;
};

export const replacePublicationsByUserId = async (
  userId: string,
  data: Array<Record<string, unknown>>,
): Promise<JobseekerProfileResponse> => {
  const response = await axiosInstance.patch<JobseekerProfileResponse>(
    jobseekerQueries.replacePublicationsByUserId(userId).endpoint,
    data,
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
    data,
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
}): Promise<{ statusCode: number; timestamp: string; message?: string; data: unknown[] }> => {
  const response = await axiosInstance.get<{
    statusCode: number;
    timestamp: string;
    message?: string;
    data: unknown[];
  }>(jobseekerQueries.searchJobseekerProfiles.endpoint, { params });
  return response.data;
};

export const searchJobseekerProfilesAI = async (params?: {
  page?: number;
  limit?: number;
  query?: string;
  [key: string]: unknown;
}): Promise<{ statusCode: number; timestamp: string; message?: string; data: unknown[] }> => {
  const response = await axiosInstance.get<{
    statusCode: number;
    timestamp: string;
    message?: string;
    data: unknown[];
  }>(jobseekerQueries.searchJobseekerProfilesAI.endpoint, { params });
  return response.data;
};

// ============================================================================
// LEGACY PROFILE SERVICES
// ============================================================================

export const updateJobseekerProfile = async (
  data: UpdateJobseekerProfilePayload,
): Promise<JobseekerProfileResponse> => {
  const response = await axiosInstance.patch<JobseekerProfileResponse>(
    jobseekerQueries.updateJobseekerProfilePartialMe.endpoint,
    data,
  );
  return response.data;
};

// ============================================================================
// WORK EXPERIENCE SERVICES
// ============================================================================

export const getWorkExperience = async (): Promise<WorkExperienceResponse> => {
  const response = await axiosInstance.get<WorkExperienceResponse>(
    jobseekerQueries.getWorkExperience.endpoint,
  );
  return response.data;
};

export const addWorkExperience = async (
  data: CreateWorkExperiencePayload,
): Promise<SingleWorkExperienceResponse> => {
  const response = await axiosInstance.post<SingleWorkExperienceResponse>(
    jobseekerQueries.addWorkExperience.endpoint,
    data,
  );
  return response.data;
};

export const updateWorkExperience = async (
  id: string,
  data: UpdateWorkExperiencePayload,
): Promise<SingleWorkExperienceResponse> => {
  const response = await axiosInstance.put<SingleWorkExperienceResponse>(
    jobseekerQueries.updateWorkExperience(id).endpoint,
    data,
  );
  return response.data;
};

export const deleteWorkExperience = async (id: string): Promise<DeleteResponse> => {
  const response = await axiosInstance.delete<DeleteResponse>(
    jobseekerQueries.deleteWorkExperience(id).endpoint,
  );
  return response.data;
};

// ============================================================================
// EDUCATION SERVICES
// ============================================================================

export const getEducation = async (): Promise<EducationResponse> => {
  const response = await axiosInstance.get<EducationResponse>(
    jobseekerQueries.getEducation.endpoint,
  );
  return response.data;
};

export const addEducation = async (
  data: CreateEducationPayload,
): Promise<SingleEducationResponse> => {
  const response = await axiosInstance.post<SingleEducationResponse>(
    jobseekerQueries.addEducation.endpoint,
    data,
  );
  return response.data;
};

export const updateEducation = async (
  id: string,
  data: UpdateEducationPayload,
): Promise<SingleEducationResponse> => {
  const response = await axiosInstance.put<SingleEducationResponse>(
    jobseekerQueries.updateEducation(id).endpoint,
    data,
  );
  return response.data;
};

export const deleteEducation = async (id: string): Promise<DeleteResponse> => {
  const response = await axiosInstance.delete<DeleteResponse>(
    jobseekerQueries.deleteEducation(id).endpoint,
  );
  return response.data;
};

// ============================================================================
// SKILLS SERVICES
// ============================================================================

export const getSkills = async (): Promise<SkillsResponse> => {
  const response = await axiosInstance.get<SkillsResponse>(
    jobseekerQueries.getSkills.endpoint,
  );
  return response.data;
};

export const addSkill = async (data: CreateSkillPayload): Promise<SingleSkillResponse> => {
  const response = await axiosInstance.post<SingleSkillResponse>(
    jobseekerQueries.addSkill.endpoint,
    data,
  );
  return response.data;
};

export const updateSkill = async (
  id: string,
  data: UpdateSkillPayload,
): Promise<SingleSkillResponse> => {
  const response = await axiosInstance.put<SingleSkillResponse>(
    jobseekerQueries.updateSkill(id).endpoint,
    data,
  );
  return response.data;
};

export const deleteSkill = async (id: string): Promise<DeleteResponse> => {
  const response = await axiosInstance.delete<DeleteResponse>(
    jobseekerQueries.deleteSkill(id).endpoint,
  );
  return response.data;
};

// ============================================================================
// CERTIFICATIONS SERVICES
// ============================================================================

export const getCertifications = async (): Promise<CertificationsResponse> => {
  const response = await axiosInstance.get<CertificationsResponse>(
    jobseekerQueries.getCertifications.endpoint,
  );
  return response.data;
};

export const addCertification = async (
  data: CreateCertificationPayload,
): Promise<SingleCertificationResponse> => {
  const response = await axiosInstance.post<SingleCertificationResponse>(
    jobseekerQueries.addCertification.endpoint,
    data,
  );
  return response.data;
};

export const updateCertification = async (
  id: string,
  data: UpdateCertificationPayload,
): Promise<SingleCertificationResponse> => {
  const response = await axiosInstance.put<SingleCertificationResponse>(
    jobseekerQueries.updateCertification(id).endpoint,
    data,
  );
  return response.data;
};

export const deleteCertification = async (id: string): Promise<DeleteResponse> => {
  const response = await axiosInstance.delete<DeleteResponse>(
    jobseekerQueries.deleteCertification(id).endpoint,
  );
  return response.data;
};

// ============================================================================
// PORTFOLIO SERVICES
// ============================================================================

export const getPortfolio = async (): Promise<PortfolioResponse> => {
  const response = await axiosInstance.get<PortfolioResponse>(
    jobseekerQueries.getPortfolio.endpoint,
  );
  return response.data;
};

export const addPortfolioItem = async (
  data: CreatePortfolioItemPayload,
): Promise<SinglePortfolioItemResponse> => {
  const response = await axiosInstance.post<SinglePortfolioItemResponse>(
    jobseekerQueries.addPortfolioItem.endpoint,
    data,
  );
  return response.data;
};

export const updatePortfolioItem = async (
  id: string,
  data: UpdatePortfolioItemPayload,
): Promise<SinglePortfolioItemResponse> => {
  const response = await axiosInstance.put<SinglePortfolioItemResponse>(
    jobseekerQueries.updatePortfolioItem(id).endpoint,
    data,
  );
  return response.data;
};

export const deletePortfolioItem = async (id: string): Promise<DeleteResponse> => {
  const response = await axiosInstance.delete<DeleteResponse>(
    jobseekerQueries.deletePortfolioItem(id).endpoint,
  );
  return response.data;
};

// ============================================================================
// JOB PREFERENCES SERVICES
// ============================================================================

export const updateJobPreferences = async (
  data: UpdateJobPreferencesPayload,
): Promise<JobseekerProfileResponse> => {
  const response = await axiosInstance.put<JobseekerProfileResponse>(
    jobseekerQueries.updateJobPreferences.endpoint,
    data,
  );
  return response.data;
};

// ============================================================================
// JOB APPLICATIONS SERVICES
// ============================================================================

export const getJobApplications = async (params?: {
  page?: number;
  limit?: number;
  status?: string;
}): Promise<JobApplicationsResponse> => {
  const response = await axiosInstance.get<JobApplicationsResponse>(
    jobseekerQueries.getJobApplications.endpoint,
    { params },
  );
  return response.data;
};

export const getJobApplicationById = async (
  id: string,
): Promise<SingleJobApplicationResponse> => {
  const response = await axiosInstance.get<SingleJobApplicationResponse>(
    jobseekerQueries.getJobApplicationById(id).endpoint,
  );
  return response.data;
};

export const applyToJob = async (data: ApplyToJobPayload): Promise<SingleJobApplicationResponse> => {
  const response = await axiosInstance.post<SingleJobApplicationResponse>(
    jobseekerQueries.applyToJob.endpoint,
    data,
  );
  return response.data;
};

export const withdrawApplication = async (id: string): Promise<DeleteResponse> => {
  const response = await axiosInstance.delete<DeleteResponse>(
    jobseekerQueries.withdrawApplication(id).endpoint,
  );
  return response.data;
};

// ============================================================================
// SAVED JOBS SERVICES
// ============================================================================

export const getSavedJobs = async (params?: {
  page?: number;
  limit?: number;
}): Promise<SavedJobsResponse> => {
  const response = await axiosInstance.get<SavedJobsResponse>(
    jobseekerQueries.getSavedJobs.endpoint,
    { params },
  );
  return response.data;
};

export const saveJob = async (data: SaveJobPayload): Promise<{ statusCode: number; timestamp: string; message?: string; data: { jobId: string } }> => {
  const response = await axiosInstance.post<{ statusCode: number; timestamp: string; message?: string; data: { jobId: string } }>(
    jobseekerQueries.saveJob.endpoint,
    data,
  );
  return response.data;
};

export const unsaveJob = async (id: string): Promise<DeleteResponse> => {
  const response = await axiosInstance.delete<DeleteResponse>(
    jobseekerQueries.unsaveJob(id).endpoint,
  );
  return response.data;
};

// ============================================================================
// RESUME SERVICES
// ============================================================================

export const uploadResume = async (file: File): Promise<ResumeUploadResponse> => {
  const formData = new FormData();
  formData.append('resume', file);
  
  const response = await axiosInstance.post<ResumeUploadResponse>(
    jobseekerQueries.uploadResume.endpoint,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  return response.data;
};

export const deleteResume = async (): Promise<DeleteResponse> => {
  const response = await axiosInstance.delete<DeleteResponse>(
    jobseekerQueries.deleteResume.endpoint,
  );
  return response.data;
};
