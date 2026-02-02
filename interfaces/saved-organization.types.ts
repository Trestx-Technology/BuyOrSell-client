import { Organization } from "./organization.types";

export interface SavedOrganization {
  _id: string;
  user: any; // Using any or specific User type if available, to match populated object
  organization: Organization; // Changed from organizationId to organization
  notes?: string;
  createdAt: string;
  updatedAt: string;
  organizationObjectId?: string;
  userObjectId?: string;
}

export interface CreateSavedOrganizationPayload {
  organizationId: string;
  userId: string;
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
  data: SavedOrganization[]; // Corrected to be an array directly
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
