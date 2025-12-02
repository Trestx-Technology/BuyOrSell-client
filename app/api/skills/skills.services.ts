import { axiosInstance } from '@/services/axios-api-client';
import { skillsQueries } from './index';
import type {
  SingleSkillResponse,
  SkillsListResponse,
  DeleteSkillResponse,
  CreateSkillPayload,
  UpdateSkillPayload,
  SkillsListParams,
  SearchSkillsParams,
} from '@/interfaces/skills.types';

// ============================================================================
// SKILL CRUD OPERATIONS
// ============================================================================

export const createSkill = async (
  payload: CreateSkillPayload,
): Promise<SingleSkillResponse> => {
  const response = await axiosInstance.post<SingleSkillResponse>(
    skillsQueries.createSkill.endpoint,
    payload,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  return response.data;
};

export const getAllSkills = async (
  params?: SkillsListParams,
): Promise<SkillsListResponse> => {
  const response = await axiosInstance.get<SkillsListResponse>(
    skillsQueries.getAllSkills.endpoint,
    { params },
  );
  return response.data;
};

export const getSkillById = async (id: string): Promise<SingleSkillResponse> => {
  const response = await axiosInstance.get<SingleSkillResponse>(
    skillsQueries.getSkillById(id).endpoint,
  );
  return response.data;
};

export const updateSkill = async (
  id: string,
  payload: UpdateSkillPayload,
): Promise<SingleSkillResponse> => {
  const response = await axiosInstance.patch<SingleSkillResponse>(
    skillsQueries.updateSkill(id).endpoint,
    payload,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  return response.data;
};

export const deleteSkill = async (id: string): Promise<DeleteSkillResponse> => {
  const response = await axiosInstance.delete<DeleteSkillResponse>(
    skillsQueries.deleteSkill(id).endpoint,
  );
  return response.data;
};

// ============================================================================
// SKILL SEARCH
// ============================================================================

export const searchSkills = async (
  params: SearchSkillsParams,
): Promise<SkillsListResponse> => {
  const response = await axiosInstance.get<SkillsListResponse>(
    skillsQueries.searchSkills.endpoint,
    { params },
  );
  return response.data;
};

