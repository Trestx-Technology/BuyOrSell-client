// Employer Profile Types

import { EmployerProfile } from './job.types';

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface SingleEmployerProfileResponse {
  statusCode: number;
  timestamp: string;
  message?: string;
  data: EmployerProfile;
}

export interface EmployerProfilesListResponse {
  statusCode: number;
  timestamp: string;
  message?: string;
  data: EmployerProfile[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface DeleteEmployerProfileResponse {
  statusCode: number;
  timestamp: string;
  message?: string;
}

// ============================================================================
// API PAYLOAD TYPES
// ============================================================================

export interface CreateEmployerProfilePayload {
  name: string;
  website?: string;
  location?: string;
  about?: string;
}

export interface UpdateEmployerProfilePayload extends Partial<CreateEmployerProfilePayload> {
  _id?: string;
}

export interface SearchEmployerProfilesParams {
  q?: string;
  page?: number;
  limit?: number;
}

