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
  crateOrUpdateJobseekerProfilePartialMe,
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
} from "@/app/api/jobseeker/jobseeker.services";
import {
  JobseekerProfileResponse,
  JobseekerProfilesListResponse,
  DeleteResponse,
  UpdateJobseekerProfilePayload,
  CreateWorkExperiencePayload,
  CreateEducationPayload,
  CreateCertificationPayload,
  CreatePortfolioItemPayload,
} from "@/interfaces/job.types";
import { jobseekerQueries } from "@/app/api/jobseeker/index";

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

  return useMutation<
    JobseekerProfileResponse,
    Error,
    Partial<UpdateJobseekerProfilePayload>
  >({
    mutationFn: createJobseekerProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["jobseeker", "profile"],
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
        queryKey: ["jobseeker", "profile"],
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
        queryKey: ["jobseeker", "profile"],
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
        queryKey: ["jobseeker", "profile"],
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

export const useCrateOrUpdateJobseekerProfilePartialMe = () => {
  const queryClient = useQueryClient();

  return useMutation<
    JobseekerProfileResponse,
    Error,
    Partial<UpdateJobseekerProfilePayload>
  >({
    mutationFn: crateOrUpdateJobseekerProfilePartialMe,
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
  params?: { similarJobs?: boolean }
) => {
  return useQuery<JobseekerProfileResponse, Error>({
    queryKey: [
      ...jobseekerQueries.getJobseekerProfileByUserId(userId).Key,
      params,
    ],
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
    mutationFn: ({ userId, data }) =>
      updateJobseekerProfilePartialByUserId(userId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: jobseekerQueries.getJobseekerProfileByUserId(variables.userId)
          .Key,
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
        queryKey: jobseekerQueries.getJobseekerProfileByUserId(variables.userId)
          .Key,
      });
      // Also invalidate the /me endpoint to update data in other components
      queryClient.invalidateQueries({
        queryKey: jobseekerQueries.getJobseekerProfile.Key,
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
        queryKey: jobseekerQueries.getJobseekerProfileByUserId(variables.userId)
          .Key,
      });
      // Also invalidate the /me endpoint to update data in other components
      queryClient.invalidateQueries({
        queryKey: jobseekerQueries.getJobseekerProfile.Key,
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
    mutationFn: ({ userId, data }) =>
      appendCertificationsByUserId(userId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: jobseekerQueries.getJobseekerProfileByUserId(variables.userId)
          .Key,
      });
      // Also invalidate the /me endpoint to update data in other components
      queryClient.invalidateQueries({
        queryKey: jobseekerQueries.getJobseekerProfile.Key,
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
    mutationFn: ({ userId, data }) =>
      replaceCertificationsByUserId(userId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: jobseekerQueries.getJobseekerProfileByUserId(variables.userId)
          .Key,
      });
      // Also invalidate the /me endpoint to update data in other components
      queryClient.invalidateQueries({
        queryKey: jobseekerQueries.getJobseekerProfile.Key,
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
        queryKey: jobseekerQueries.getJobseekerProfileByUserId(variables.userId)
          .Key,
      });
      // Also invalidate the /me endpoint to update data in other components
      queryClient.invalidateQueries({
        queryKey: jobseekerQueries.getJobseekerProfile.Key,
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
        queryKey: jobseekerQueries.getJobseekerProfileByUserId(variables.userId)
          .Key,
      });
      // Also invalidate the /me endpoint to update data in other components
      queryClient.invalidateQueries({
        queryKey: jobseekerQueries.getJobseekerProfile.Key,
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
        queryKey: jobseekerQueries.getJobseekerProfileByUserId(variables.userId)
          .Key,
      });
      // Also invalidate the /me endpoint to update data in other components
      queryClient.invalidateQueries({
        queryKey: jobseekerQueries.getJobseekerProfile.Key,
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
        queryKey: jobseekerQueries.getJobseekerProfileByUserId(variables.userId)
          .Key,
      });
      // Also invalidate the /me endpoint to update data in other components
      queryClient.invalidateQueries({
        queryKey: jobseekerQueries.getJobseekerProfile.Key,
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
        queryKey: jobseekerQueries.getJobseekerProfileByUserId(variables.userId)
          .Key,
      });
      // Also invalidate the /me endpoint to update data in other components
      queryClient.invalidateQueries({
        queryKey: jobseekerQueries.getJobseekerProfile.Key,
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
        queryKey: jobseekerQueries.getJobseekerProfileByUserId(variables.userId)
          .Key,
      });
      // Also invalidate the /me endpoint to update data in other components
      queryClient.invalidateQueries({
        queryKey: jobseekerQueries.getJobseekerProfile.Key,
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
        queryKey: jobseekerQueries.getJobseekerProfileByUserId(variables.userId)
          .Key,
      });
      // Also invalidate the /me endpoint to update data in other components
      queryClient.invalidateQueries({
        queryKey: jobseekerQueries.getJobseekerProfile.Key,
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
        queryKey: jobseekerQueries.getJobseekerProfileByUserId(variables.userId)
          .Key,
      });
      // Also invalidate the /me endpoint to update data in other components
      queryClient.invalidateQueries({
        queryKey: jobseekerQueries.getJobseekerProfile.Key,
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
        queryKey: jobseekerQueries.getJobseekerProfileByUserId(variables.userId)
          .Key,
      });
      // Also invalidate the /me endpoint to update data in other components
      queryClient.invalidateQueries({
        queryKey: jobseekerQueries.getJobseekerProfile.Key,
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
        queryKey: jobseekerQueries.getJobseekerProfileByUserId(variables.userId)
          .Key,
      });
      // Also invalidate the /me endpoint to update data in other components
      queryClient.invalidateQueries({
        queryKey: jobseekerQueries.getJobseekerProfile.Key,
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
        queryKey: jobseekerQueries.getJobseekerProfileByUserId(variables.userId)
          .Key,
      });
      // Also invalidate the /me endpoint to update data in other components
      queryClient.invalidateQueries({
        queryKey: jobseekerQueries.getJobseekerProfile.Key,
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
        queryKey: jobseekerQueries.getJobseekerProfileByUserId(variables.userId)
          .Key,
      });
      // Also invalidate the /me endpoint to update data in other components
      queryClient.invalidateQueries({
        queryKey: jobseekerQueries.getJobseekerProfile.Key,
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
  return useQuery<JobseekerProfilesListResponse, Error>({
    queryKey: [...jobseekerQueries.searchJobseekerProfiles.Key, params],
    queryFn: () => searchJobseekerProfiles(params),
  });
};
