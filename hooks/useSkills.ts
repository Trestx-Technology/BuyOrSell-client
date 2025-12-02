import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createSkill,
  getAllSkills,
  getSkillById,
  updateSkill,
  deleteSkill,
  searchSkills,
} from '@/app/api/skills/skills.services';
import {
  SingleSkillResponse,
  SkillsListResponse,
  DeleteSkillResponse,
  CreateSkillPayload,
  UpdateSkillPayload,
  SkillsListParams,
  SearchSkillsParams,
} from '@/interfaces/skills.types';
import { skillsQueries } from '@/app/api/skills/index';

// ============================================================================
// SKILL QUERY HOOKS
// ============================================================================

export const useGetAllSkills = (params?: SkillsListParams) => {
  return useQuery<SkillsListResponse, Error>({
    queryKey: [...skillsQueries.getAllSkills.Key, params],
    queryFn: () => getAllSkills(params),
  });
};

export const useGetSkillById = (id: string) => {
  return useQuery<SingleSkillResponse, Error>({
    queryKey: skillsQueries.getSkillById(id).Key,
    queryFn: () => getSkillById(id),
    enabled: !!id,
  });
};

export const useSearchSkills = (params: SearchSkillsParams) => {
  return useQuery<SkillsListResponse, Error>({
    queryKey: [...skillsQueries.searchSkills.Key, params],
    queryFn: () => searchSkills(params),
    enabled: !!params.q || params.q === '',
  });
};

// ============================================================================
// SKILL MUTATION HOOKS
// ============================================================================

export const useCreateSkill = () => {
  const queryClient = useQueryClient();

  return useMutation<SingleSkillResponse, Error, CreateSkillPayload>({
    mutationFn: createSkill,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: skillsQueries.getAllSkills.Key });
      queryClient.invalidateQueries({ queryKey: skillsQueries.searchSkills.Key });
    },
  });
};

export const useUpdateSkill = () => {
  const queryClient = useQueryClient();

  return useMutation<
    SingleSkillResponse,
    Error,
    { id: string; data: UpdateSkillPayload }
  >({
    mutationFn: ({ id, data }) => updateSkill(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: skillsQueries.getSkillById(variables.id).Key,
      });
      queryClient.invalidateQueries({ queryKey: skillsQueries.getAllSkills.Key });
      queryClient.invalidateQueries({ queryKey: skillsQueries.searchSkills.Key });
    },
  });
};

export const useDeleteSkill = () => {
  const queryClient = useQueryClient();

  return useMutation<DeleteSkillResponse, Error, string>({
    mutationFn: deleteSkill,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: skillsQueries.getSkillById(id).Key,
      });
      queryClient.invalidateQueries({ queryKey: skillsQueries.getAllSkills.Key });
      queryClient.invalidateQueries({ queryKey: skillsQueries.searchSkills.Key });
    },
  });
};

