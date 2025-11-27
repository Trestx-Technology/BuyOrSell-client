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
// PROFILE
// ============================================================================

export const getJobseekerProfile = async (): Promise<JobseekerProfileResponse> => {
  const response = await axiosInstance.get<JobseekerProfileResponse>(
    jobseekerQueries.getJobseekerProfile.endpoint,
  );
  return response.data;
};

export const updateJobseekerProfile = async (
  data: UpdateJobseekerProfilePayload,
): Promise<JobseekerProfileResponse> => {
  const response = await axiosInstance.put<JobseekerProfileResponse>(
    jobseekerQueries.updateJobseekerProfile.endpoint,
    data,
  );
  return response.data;
};

// ============================================================================
// WORK EXPERIENCE
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
// EDUCATION
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
// SKILLS
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
// CERTIFICATIONS
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
// PORTFOLIO
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
// JOB PREFERENCES
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
// JOB APPLICATIONS
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
// SAVED JOBS
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
// RESUME
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

