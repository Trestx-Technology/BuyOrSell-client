import { Organization } from "./organization.types";

export interface SavedOrganization {
  _id: string;
  userId: string;
  organizationId: string | Organization;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSavedOrganizationPayload {
  organizationId: string;
  notes?: string;
}

export interface UpdateSavedOrganizationPayload {
  notes?: string;
}

export interface SavedOrganizationResponse {
  statusCode: number;
  message: string;
  data: SavedOrganization;
  timestamp: string;
}

export interface SavedOrganizationsListResponse {
  statusCode: number;
  message: string;
  data: {
    items: SavedOrganization[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  timestamp: string;
}

export interface CheckSavedOrganizationResponse {
  statusCode: number;
  message: string;
  data: {
    isSaved: boolean;
    savedOrganizationId?: string;
  };
  timestamp: string;
}

export interface SavedOrganizationsCountResponse {
  statusCode: number;
  message: string;
  data: {
    count: number;
  };
  timestamp: string;
}
