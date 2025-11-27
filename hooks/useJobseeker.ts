import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getJobseekerProfile,
  updateJobseekerProfile,
  getWorkExperience,
  addWorkExperience,
  updateWorkExperience,
  deleteWorkExperience,
  getEducation,
  addEducation,
  updateEducation,
  deleteEducation,
  getSkills,
  addSkill,
  updateSkill,
  deleteSkill,
  getCertifications,
  addCertification,
  updateCertification,
  deleteCertification,
  getPortfolio,
  addPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem,
  updateJobPreferences,
  getJobApplications,
  getJobApplicationById,
  applyToJob,
  withdrawApplication,
  getSavedJobs,
  saveJob,
  unsaveJob,
  uploadResume,
  deleteResume,
} from '@/app/api/jobseeker/jobseeker.services';
import {
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
import { jobseekerQueries } from '@/app/api/jobseeker/index';

// ============================================================================
// PROFILE QUERY HOOKS
// ============================================================================

export const useGetJobseekerProfile = () => {
  return useQuery<JobseekerProfileResponse, Error>({
    queryKey: jobseekerQueries.getJobseekerProfile.Key,
    queryFn: getJobseekerProfile,
  });
};

// ============================================================================
// PROFILE MUTATION HOOKS
// ============================================================================

export const useUpdateJobseekerProfile = () => {
  const queryClient = useQueryClient();

  return useMutation<JobseekerProfileResponse, Error, UpdateJobseekerProfilePayload>({
    mutationFn: updateJobseekerProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: jobseekerQueries.getJobseekerProfile.Key,
      });
    },
  });
};

// ============================================================================
// WORK EXPERIENCE QUERY HOOKS
// ============================================================================

export const useGetWorkExperience = () => {
  return useQuery<WorkExperienceResponse, Error>({
    queryKey: jobseekerQueries.getWorkExperience.Key,
    queryFn: getWorkExperience,
  });
};

// ============================================================================
// WORK EXPERIENCE MUTATION HOOKS
// ============================================================================

export const useAddWorkExperience = () => {
  const queryClient = useQueryClient();

  return useMutation<SingleWorkExperienceResponse, Error, CreateWorkExperiencePayload>({
    mutationFn: addWorkExperience,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: jobseekerQueries.getWorkExperience.Key,
      });
      queryClient.invalidateQueries({
        queryKey: jobseekerQueries.getJobseekerProfile.Key,
      });
    },
  });
};

export const useUpdateWorkExperience = () => {
  const queryClient = useQueryClient();

  return useMutation<
    SingleWorkExperienceResponse,
    Error,
    { id: string; data: UpdateWorkExperiencePayload }
  >({
    mutationFn: ({ id, data }) => updateWorkExperience(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: jobseekerQueries.getWorkExperience.Key,
      });
      queryClient.invalidateQueries({
        queryKey: jobseekerQueries.getJobseekerProfile.Key,
      });
    },
  });
};

export const useDeleteWorkExperience = () => {
  const queryClient = useQueryClient();

  return useMutation<DeleteResponse, Error, string>({
    mutationFn: deleteWorkExperience,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: jobseekerQueries.getWorkExperience.Key,
      });
      queryClient.invalidateQueries({
        queryKey: jobseekerQueries.getJobseekerProfile.Key,
      });
    },
  });
};

// ============================================================================
// EDUCATION QUERY HOOKS
// ============================================================================

export const useGetEducation = () => {
  return useQuery<EducationResponse, Error>({
    queryKey: jobseekerQueries.getEducation.Key,
    queryFn: getEducation,
  });
};

// ============================================================================
// EDUCATION MUTATION HOOKS
// ============================================================================

export const useAddEducation = () => {
  const queryClient = useQueryClient();

  return useMutation<SingleEducationResponse, Error, CreateEducationPayload>({
    mutationFn: addEducation,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: jobseekerQueries.getEducation.Key,
      });
      queryClient.invalidateQueries({
        queryKey: jobseekerQueries.getJobseekerProfile.Key,
      });
    },
  });
};

export const useUpdateEducation = () => {
  const queryClient = useQueryClient();

  return useMutation<
    SingleEducationResponse,
    Error,
    { id: string; data: UpdateEducationPayload }
  >({
    mutationFn: ({ id, data }) => updateEducation(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: jobseekerQueries.getEducation.Key,
      });
      queryClient.invalidateQueries({
        queryKey: jobseekerQueries.getJobseekerProfile.Key,
      });
    },
  });
};

export const useDeleteEducation = () => {
  const queryClient = useQueryClient();

  return useMutation<DeleteResponse, Error, string>({
    mutationFn: deleteEducation,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: jobseekerQueries.getEducation.Key,
      });
      queryClient.invalidateQueries({
        queryKey: jobseekerQueries.getJobseekerProfile.Key,
      });
    },
  });
};

// ============================================================================
// SKILLS QUERY HOOKS
// ============================================================================

export const useGetSkills = () => {
  return useQuery<SkillsResponse, Error>({
    queryKey: jobseekerQueries.getSkills.Key,
    queryFn: getSkills,
  });
};

// ============================================================================
// SKILLS MUTATION HOOKS
// ============================================================================

export const useAddSkill = () => {
  const queryClient = useQueryClient();

  return useMutation<SingleSkillResponse, Error, CreateSkillPayload>({
    mutationFn: addSkill,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: jobseekerQueries.getSkills.Key,
      });
      queryClient.invalidateQueries({
        queryKey: jobseekerQueries.getJobseekerProfile.Key,
      });
    },
  });
};

export const useUpdateSkill = () => {
  const queryClient = useQueryClient();

  return useMutation<SingleSkillResponse, Error, { id: string; data: UpdateSkillPayload }>({
    mutationFn: ({ id, data }) => updateSkill(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: jobseekerQueries.getSkills.Key,
      });
      queryClient.invalidateQueries({
        queryKey: jobseekerQueries.getJobseekerProfile.Key,
      });
    },
  });
};

export const useDeleteSkill = () => {
  const queryClient = useQueryClient();

  return useMutation<DeleteResponse, Error, string>({
    mutationFn: deleteSkill,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: jobseekerQueries.getSkills.Key,
      });
      queryClient.invalidateQueries({
        queryKey: jobseekerQueries.getJobseekerProfile.Key,
      });
    },
  });
};

// ============================================================================
// CERTIFICATIONS QUERY HOOKS
// ============================================================================

export const useGetCertifications = () => {
  return useQuery<CertificationsResponse, Error>({
    queryKey: jobseekerQueries.getCertifications.Key,
    queryFn: getCertifications,
  });
};

// ============================================================================
// CERTIFICATIONS MUTATION HOOKS
// ============================================================================

export const useAddCertification = () => {
  const queryClient = useQueryClient();

  return useMutation<SingleCertificationResponse, Error, CreateCertificationPayload>({
    mutationFn: addCertification,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: jobseekerQueries.getCertifications.Key,
      });
      queryClient.invalidateQueries({
        queryKey: jobseekerQueries.getJobseekerProfile.Key,
      });
    },
  });
};

export const useUpdateCertification = () => {
  const queryClient = useQueryClient();

  return useMutation<
    SingleCertificationResponse,
    Error,
    { id: string; data: UpdateCertificationPayload }
  >({
    mutationFn: ({ id, data }) => updateCertification(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: jobseekerQueries.getCertifications.Key,
      });
      queryClient.invalidateQueries({
        queryKey: jobseekerQueries.getJobseekerProfile.Key,
      });
    },
  });
};

export const useDeleteCertification = () => {
  const queryClient = useQueryClient();

  return useMutation<DeleteResponse, Error, string>({
    mutationFn: deleteCertification,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: jobseekerQueries.getCertifications.Key,
      });
      queryClient.invalidateQueries({
        queryKey: jobseekerQueries.getJobseekerProfile.Key,
      });
    },
  });
};

// ============================================================================
// PORTFOLIO QUERY HOOKS
// ============================================================================

export const useGetPortfolio = () => {
  return useQuery<PortfolioResponse, Error>({
    queryKey: jobseekerQueries.getPortfolio.Key,
    queryFn: getPortfolio,
  });
};

// ============================================================================
// PORTFOLIO MUTATION HOOKS
// ============================================================================

export const useAddPortfolioItem = () => {
  const queryClient = useQueryClient();

  return useMutation<SinglePortfolioItemResponse, Error, CreatePortfolioItemPayload>({
    mutationFn: addPortfolioItem,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: jobseekerQueries.getPortfolio.Key,
      });
      queryClient.invalidateQueries({
        queryKey: jobseekerQueries.getJobseekerProfile.Key,
      });
    },
  });
};

export const useUpdatePortfolioItem = () => {
  const queryClient = useQueryClient();

  return useMutation<
    SinglePortfolioItemResponse,
    Error,
    { id: string; data: UpdatePortfolioItemPayload }
  >({
    mutationFn: ({ id, data }) => updatePortfolioItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: jobseekerQueries.getPortfolio.Key,
      });
      queryClient.invalidateQueries({
        queryKey: jobseekerQueries.getJobseekerProfile.Key,
      });
    },
  });
};

export const useDeletePortfolioItem = () => {
  const queryClient = useQueryClient();

  return useMutation<DeleteResponse, Error, string>({
    mutationFn: deletePortfolioItem,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: jobseekerQueries.getPortfolio.Key,
      });
      queryClient.invalidateQueries({
        queryKey: jobseekerQueries.getJobseekerProfile.Key,
      });
    },
  });
};

// ============================================================================
// JOB PREFERENCES MUTATION HOOKS
// ============================================================================

export const useUpdateJobPreferences = () => {
  const queryClient = useQueryClient();

  return useMutation<JobseekerProfileResponse, Error, UpdateJobPreferencesPayload>({
    mutationFn: updateJobPreferences,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: jobseekerQueries.getJobseekerProfile.Key,
      });
    },
  });
};

// ============================================================================
// JOB APPLICATIONS QUERY HOOKS
// ============================================================================

export const useGetJobApplications = (params?: {
  page?: number;
  limit?: number;
  status?: string;
}) => {
  return useQuery<JobApplicationsResponse, Error>({
    queryKey: [...jobseekerQueries.getJobApplications.Key, params],
    queryFn: () => getJobApplications(params),
  });
};

export const useGetJobApplicationById = (id: string) => {
  return useQuery<SingleJobApplicationResponse, Error>({
    queryKey: jobseekerQueries.getJobApplicationById(id).Key,
    queryFn: () => getJobApplicationById(id),
    enabled: !!id,
  });
};

// ============================================================================
// JOB APPLICATIONS MUTATION HOOKS
// ============================================================================

export const useApplyToJob = () => {
  const queryClient = useQueryClient();

  return useMutation<SingleJobApplicationResponse, Error, ApplyToJobPayload>({
    mutationFn: applyToJob,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: jobseekerQueries.getJobApplications.Key,
      });
    },
  });
};

export const useWithdrawApplication = () => {
  const queryClient = useQueryClient();

  return useMutation<DeleteResponse, Error, string>({
    mutationFn: withdrawApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: jobseekerQueries.getJobApplications.Key,
      });
    },
  });
};

// ============================================================================
// SAVED JOBS QUERY HOOKS
// ============================================================================

export const useGetSavedJobs = (params?: {
  page?: number;
  limit?: number;
}) => {
  return useQuery<SavedJobsResponse, Error>({
    queryKey: [...jobseekerQueries.getSavedJobs.Key, params],
    queryFn: () => getSavedJobs(params),
  });
};

// ============================================================================
// SAVED JOBS MUTATION HOOKS
// ============================================================================

export const useSaveJob = () => {
  const queryClient = useQueryClient();

  return useMutation<
    { statusCode: number; timestamp: string; message?: string; data: { jobId: string } },
    Error,
    SaveJobPayload
  >({
    mutationFn: saveJob,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: jobseekerQueries.getSavedJobs.Key,
      });
    },
  });
};

export const useUnsaveJob = () => {
  const queryClient = useQueryClient();

  return useMutation<DeleteResponse, Error, string>({
    mutationFn: unsaveJob,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: jobseekerQueries.getSavedJobs.Key,
      });
    },
  });
};

// ============================================================================
// RESUME MUTATION HOOKS
// ============================================================================

export const useUploadResume = () => {
  const queryClient = useQueryClient();

  return useMutation<ResumeUploadResponse, Error, File>({
    mutationFn: uploadResume,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: jobseekerQueries.getJobseekerProfile.Key,
      });
    },
  });
};

export const useDeleteResume = () => {
  const queryClient = useQueryClient();

  return useMutation<DeleteResponse, Error, void>({
    mutationFn: deleteResume,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: jobseekerQueries.getJobseekerProfile.Key,
      });
    },
  });
};

