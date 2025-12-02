// Master Skills Catalog Types
// This is separate from jobseeker skills - this is a master catalog of available skills

// ============================================================================
// SKILL DATA TYPES
// ============================================================================

export interface Skill {
  _id: string;
  name: string;
  category?: string;
  level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  createdAt?: string;
  updatedAt?: string;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface SingleSkillResponse {
  statusCode: number;
  timestamp: string;
  message?: string;
  data: Skill;
}

export interface SkillsListResponse {
  statusCode: number;
  timestamp: string;
  message?: string;
  data: Skill[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface DeleteSkillResponse {
  statusCode: number;
  timestamp: string;
  message?: string;
}

// ============================================================================
// API PAYLOAD TYPES
// ============================================================================

export interface CreateSkillPayload {
  name: string;
  category?: string;
  level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export interface UpdateSkillPayload extends Partial<CreateSkillPayload> {
  _id?: string;
}

export interface SkillsListParams {
  page?: number;
  limit?: number;
}

export interface SearchSkillsParams {
  q?: string;
  category?: string;
  page?: number;
  limit?: number;
}

