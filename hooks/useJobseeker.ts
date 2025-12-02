import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  // General Profile Services
  createJobseekerProfile,
  getJobseekerProfileById,
  updateJobseekerProfileById,
  deleteJobseekerProfile,
  updateJobseekerProfilePartialById,
  banJobseekerProfile,
  unbanJobseekerProfile,
  blockJobseekerProfile,
  unblockJobseekerProfile,
  // Current User Profile Services
  getJobseekerProfile,
  updateJobseekerProfilePartialMe,
  // Profile By User ID Services
  getJobseekerProfileByUserId,
  updateJobseekerProfilePartialByUserId,
  // Awards By User ID Services
  appendAwardsByUserId,
  replaceAwardsByUserId,
  // Certifications By User ID Services
  appendCertificationsByUserId,
  replaceCertificationsByUserId,
  // Educations By User ID Services
  appendEducationsByUserId,
  replaceEducationsByUserId,
  // Experiences By User ID Services
  appendExperiencesByUserId,
  replaceExperiencesByUserId,
  // Languages By User ID Services
  appendLanguagesByUserId,
  replaceLanguagesByUserId,
  // Links By User ID Services
  appendLinksByUserId,
  replaceLinksByUserId,
  // Projects By User ID Services
  appendProjectsByUserId,
  replaceProjectsByUserId,
  // Publications By User ID Services
  appendPublicationsByUserId,
  replacePublicationsByUserId,
  // Resume Services
  createProfileFromResume,
  // Search Services
  searchJobseekerProfiles,
  searchJobseekerProfilesAI,
  // Legacy Services
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
// GENERAL PROFILE QUERY HOOKS
// ============================================================================

export const useGetJobseekerProfileById = (id: string) => {
  return useQuery<JobseekerProfileResponse, Error>({
    queryKey: jobseekerQueries.getJobseekerProfileById(id).Key,
    queryFn: () => getJobseekerProfileById(id),
    enabled: !!id,
  });
};

// ============================================================================
// GENERAL PROFILE MUTATION HOOKS
// ============================================================================

export const useCreateJobseekerProfile = () => {
  const queryClient = useQueryClient();

  return useMutation<JobseekerProfileResponse, Error, Partial<UpdateJobseekerProfilePayload>>({
    mutationFn: createJobseekerProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['jobseeker', 'profile'],
      });
    },
  });
};

export const useUpdateJobseekerProfileById = () => {
  const queryClient = useQueryClient();

  return useMutation<
    JobseekerProfileResponse,
    Error,
    { id: string; data: UpdateJobseekerProfilePayload }
  >({
    mutationFn: ({ id, data }) => updateJobseekerProfileById(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: jobseekerQueries.getJobseekerProfileById(variables.id).Key,
      });
      queryClient.invalidateQueries({
        queryKey: ['jobseeker', 'profile'],
      });
    },
  });
};

export const useDeleteJobseekerProfile = () => {
  const queryClient = useQueryClient();

  return useMutation<DeleteResponse, Error, string>({
    mutationFn: deleteJobseekerProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['jobseeker', 'profile'],
      });
    },
  });
};

export const useUpdateJobseekerProfilePartialById = () => {
  const queryClient = useQueryClient();

  return useMutation<
    JobseekerProfileResponse,
    Error,
    { id: string; data: Partial<UpdateJobseekerProfilePayload> }
  >({
    mutationFn: ({ id, data }) => updateJobseekerProfilePartialById(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: jobseekerQueries.getJobseekerProfileById(variables.id).Key,
      });
      queryClient.invalidateQueries({
        queryKey: ['jobseeker', 'profile'],
      });
    },
  });
};

export const useBanJobseekerProfile = () => {
  const queryClient = useQueryClient();

  return useMutation<DeleteResponse, Error, string>({
    mutationFn: banJobseekerProfile,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: jobseekerQueries.getJobseekerProfileById(id).Key,
      });
    },
  });
};

export const useUnbanJobseekerProfile = () => {
  const queryClient = useQueryClient();

  return useMutation<DeleteResponse, Error, string>({
    mutationFn: unbanJobseekerProfile,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: jobseekerQueries.getJobseekerProfileById(id).Key,
      });
    },
  });
};

export const useBlockJobseekerProfile = () => {
  const queryClient = useQueryClient();

  return useMutation<DeleteResponse, Error, string>({
    mutationFn: blockJobseekerProfile,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: jobseekerQueries.getJobseekerProfileById(id).Key,
      });
    },
  });
};

export const useUnblockJobseekerProfile = () => {
  const queryClient = useQueryClient();

  return useMutation<DeleteResponse, Error, string>({
    mutationFn: unblockJobseekerProfile,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: jobseekerQueries.getJobseekerProfileById(id).Key,
      });
    },
  });
};

// ============================================================================
// CURRENT USER PROFILE QUERY HOOKS (/me)
// ============================================================================

export const useGetJobseekerProfile = () => {
  return useQuery<JobseekerProfileResponse, Error>({
    queryKey: jobseekerQueries.getJobseekerProfile.Key,
    queryFn: getJobseekerProfile,
  });
};

// ============================================================================
// CURRENT USER PROFILE MUTATION HOOKS (/me)
// ============================================================================

export const useUpdateJobseekerProfilePartialMe = () => {
  const queryClient = useQueryClient();

  return useMutation<
    JobseekerProfileResponse,
    Error,
    Partial<UpdateJobseekerProfilePayload>
  >({
    mutationFn: updateJobseekerProfilePartialMe,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: jobseekerQueries.getJobseekerProfile.Key,
      });
    },
  });
};

// ============================================================================
// PROFILE BY USER ID QUERY HOOKS
// ============================================================================

export const useGetJobseekerProfileByUserId = (
  userId: string,
  params?: { similarJobs?: boolean },
) => {
  return useQuery<JobseekerProfileResponse, Error>({
    queryKey: [...jobseekerQueries.getJobseekerProfileByUserId(userId).Key, params],
    queryFn: () => getJobseekerProfileByUserId(userId, params),
    enabled: !!userId,
  });
};

// ============================================================================
// PROFILE BY USER ID MUTATION HOOKS
// ============================================================================

export const useUpdateJobseekerProfilePartialByUserId = () => {
  const queryClient = useQueryClient();

  return useMutation<
    JobseekerProfileResponse,
    Error,
    { userId: string; data: Partial<UpdateJobseekerProfilePayload> }
  >({
    mutationFn: ({ userId, data }) => updateJobseekerProfilePartialByUserId(userId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: jobseekerQueries.getJobseekerProfileByUserId(variables.userId).Key,
      });
    },
  });
};

// ============================================================================
// AWARDS BY USER ID MUTATION HOOKS
// ============================================================================

export const useAppendAwardsByUserId = () => {
  const queryClient = useQueryClient();

  return useMutation<
    JobseekerProfileResponse,
    Error,
    { userId: string; data: Array<Record<string, unknown>> }
  >({
    mutationFn: ({ userId, data }) => appendAwardsByUserId(userId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: jobseekerQueries.getJobseekerProfileByUserId(variables.userId).Key,
      });
    },
  });
};

export const useReplaceAwardsByUserId = () => {
  const queryClient = useQueryClient();

  return useMutation<
    JobseekerProfileResponse,
    Error,
    { userId: string; data: Array<Record<string, unknown>> }
  >({
    mutationFn: ({ userId, data }) => replaceAwardsByUserId(userId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: jobseekerQueries.getJobseekerProfileByUserId(variables.userId).Key,
      });
    },
  });
};

// ============================================================================
// CERTIFICATIONS BY USER ID MUTATION HOOKS
// ============================================================================

export const useAppendCertificationsByUserId = () => {
  const queryClient = useQueryClient();

  return useMutation<
    JobseekerProfileResponse,
    Error,
    { userId: string; data: CreateCertificationPayload[] }
  >({
    mutationFn: ({ userId, data }) => appendCertificationsByUserId(userId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: jobseekerQueries.getJobseekerProfileByUserId(variables.userId).Key,
      });
      queryClient.invalidateQueries({
        queryKey: jobseekerQueries.getCertifications.Key,
      });
    },
  });
};

export const useReplaceCertificationsByUserId = () => {
  const queryClient = useQueryClient();

  return useMutation<
    JobseekerProfileResponse,
    Error,
    { userId: string; data: CreateCertificationPayload[] }
  >({
    mutationFn: ({ userId, data }) => replaceCertificationsByUserId(userId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: jobseekerQueries.getJobseekerProfileByUserId(variables.userId).Key,
      });
      queryClient.invalidateQueries({
        queryKey: jobseekerQueries.getCertifications.Key,
      });
    },
  });
};

// ============================================================================
// EDUCATIONS BY USER ID MUTATION HOOKS
// ============================================================================

export const useAppendEducationsByUserId = () => {
  const queryClient = useQueryClient();

  return useMutation<
    JobseekerProfileResponse,
    Error,
    { userId: string; data: CreateEducationPayload[] }
  >({
    mutationFn: ({ userId, data }) => appendEducationsByUserId(userId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: jobseekerQueries.getJobseekerProfileByUserId(variables.userId).Key,
      });
      queryClient.invalidateQueries({
        queryKey: jobseekerQueries.getEducation.Key,
      });
    },
  });
};

export const useReplaceEducationsByUserId = () => {
  const queryClient = useQueryClient();

  return useMutation<
    JobseekerProfileResponse,
    Error,
    { userId: string; data: CreateEducationPayload[] }
  >({
    mutationFn: ({ userId, data }) => replaceEducationsByUserId(userId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: jobseekerQueries.getJobseekerProfileByUserId(variables.userId).Key,
      });
      queryClient.invalidateQueries({
        queryKey: jobseekerQueries.getEducation.Key,
      });
    },
  });
};

// ============================================================================
// EXPERIENCES BY USER ID MUTATION HOOKS
// ============================================================================

export const useAppendExperiencesByUserId = () => {
  const queryClient = useQueryClient();

  return useMutation<
    JobseekerProfileResponse,
    Error,
    { userId: string; data: CreateWorkExperiencePayload[] }
  >({
    mutationFn: ({ userId, data }) => appendExperiencesByUserId(userId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: jobseekerQueries.getJobseekerProfileByUserId(variables.userId).Key,
      });
      queryClient.invalidateQueries({
        queryKey: jobseekerQueries.getWorkExperience.Key,
      });
    },
  });
};

export const useReplaceExperiencesByUserId = () => {
  const queryClient = useQueryClient();

  return useMutation<
    JobseekerProfileResponse,
    Error,
    { userId: string; data: CreateWorkExperiencePayload[] }
  >({
    mutationFn: ({ userId, data }) => replaceExperiencesByUserId(userId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: jobseekerQueries.getJobseekerProfileByUserId(variables.userId).Key,
      });
      queryClient.invalidateQueries({
        queryKey: jobseekerQueries.getWorkExperience.Key,
      });
    },
  });
};

// ============================================================================
// LANGUAGES BY USER ID MUTATION HOOKS
// ============================================================================

export const useAppendLanguagesByUserId = () => {
  const queryClient = useQueryClient();

  return useMutation<
    JobseekerProfileResponse,
    Error,
    { userId: string; data: Array<Record<string, unknown>> }
  >({
    mutationFn: ({ userId, data }) => appendLanguagesByUserId(userId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: jobseekerQueries.getJobseekerProfileByUserId(variables.userId).Key,
      });
    },
  });
};

export const useReplaceLanguagesByUserId = () => {
  const queryClient = useQueryClient();

  return useMutation<
    JobseekerProfileResponse,
    Error,
    { userId: string; data: Array<Record<string, unknown>> }
  >({
    mutationFn: ({ userId, data }) => replaceLanguagesByUserId(userId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: jobseekerQueries.getJobseekerProfileByUserId(variables.userId).Key,
      });
    },
  });
};

// ============================================================================
// LINKS BY USER ID MUTATION HOOKS
// ============================================================================

export const useAppendLinksByUserId = () => {
  const queryClient = useQueryClient();

  return useMutation<
    JobseekerProfileResponse,
    Error,
    { userId: string; data: Array<Record<string, unknown>> }
  >({
    mutationFn: ({ userId, data }) => appendLinksByUserId(userId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: jobseekerQueries.getJobseekerProfileByUserId(variables.userId).Key,
      });
    },
  });
};

export const useReplaceLinksByUserId = () => {
  const queryClient = useQueryClient();

  return useMutation<
    JobseekerProfileResponse,
    Error,
    { userId: string; data: Array<Record<string, unknown>> }
  >({
    mutationFn: ({ userId, data }) => replaceLinksByUserId(userId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: jobseekerQueries.getJobseekerProfileByUserId(variables.userId).Key,
      });
    },
  });
};

// ============================================================================
// PROJECTS BY USER ID MUTATION HOOKS
// ============================================================================

export const useAppendProjectsByUserId = () => {
  const queryClient = useQueryClient();

  return useMutation<
    JobseekerProfileResponse,
    Error,
    { userId: string; data: CreatePortfolioItemPayload[] }
  >({
    mutationFn: ({ userId, data }) => appendProjectsByUserId(userId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: jobseekerQueries.getJobseekerProfileByUserId(variables.userId).Key,
      });
      queryClient.invalidateQueries({
        queryKey: jobseekerQueries.getPortfolio.Key,
      });
    },
  });
};

export const useReplaceProjectsByUserId = () => {
  const queryClient = useQueryClient();

  return useMutation<
    JobseekerProfileResponse,
    Error,
    { userId: string; data: CreatePortfolioItemPayload[] }
  >({
    mutationFn: ({ userId, data }) => replaceProjectsByUserId(userId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: jobseekerQueries.getJobseekerProfileByUserId(variables.userId).Key,
      });
      queryClient.invalidateQueries({
        queryKey: jobseekerQueries.getPortfolio.Key,
      });
    },
  });
};

// ============================================================================
// PUBLICATIONS BY USER ID MUTATION HOOKS
// ============================================================================

export const useAppendPublicationsByUserId = () => {
  const queryClient = useQueryClient();

  return useMutation<
    JobseekerProfileResponse,
    Error,
    { userId: string; data: Array<Record<string, unknown>> }
  >({
    mutationFn: ({ userId, data }) => appendPublicationsByUserId(userId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: jobseekerQueries.getJobseekerProfileByUserId(variables.userId).Key,
      });
    },
  });
};

export const useReplacePublicationsByUserId = () => {
  const queryClient = useQueryClient();

  return useMutation<
    JobseekerProfileResponse,
    Error,
    { userId: string; data: Array<Record<string, unknown>> }
  >({
    mutationFn: ({ userId, data }) => replacePublicationsByUserId(userId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: jobseekerQueries.getJobseekerProfileByUserId(variables.userId).Key,
      });
    },
  });
};

// ============================================================================
// RESUME MUTATION HOOKS
// ============================================================================

export const useCreateProfileFromResume = () => {
  const queryClient = useQueryClient();

  return useMutation<
    JobseekerProfileResponse,
    Error,
    { resumeText?: string; linkedInUrl?: string }
  >({
    mutationFn: createProfileFromResume,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: jobseekerQueries.getJobseekerProfile.Key,
      });
    },
  });
};

// ============================================================================
// SEARCH QUERY HOOKS
// ============================================================================

export const useSearchJobseekerProfiles = (params?: {
  page?: number;
  limit?: number;
  [key: string]: unknown;
}) => {
  return useQuery<
    { statusCode: number; timestamp: string; message?: string; data: unknown[] },
    Error
  >({
    queryKey: [...jobseekerQueries.searchJobseekerProfiles.Key, params],
    queryFn: () => searchJobseekerProfiles(params),
  });
};

export const useSearchJobseekerProfilesAI = (params?: {
  page?: number;
  limit?: number;
  query?: string;
  [key: string]: unknown;
}) => {
  return useQuery<
    { statusCode: number; timestamp: string; message?: string; data: unknown[] },
    Error
  >({
    queryKey: [...jobseekerQueries.searchJobseekerProfilesAI.Key, params],
    queryFn: () => searchJobseekerProfilesAI(params),
  });
};

// ============================================================================
// LEGACY PROFILE MUTATION HOOKS
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
