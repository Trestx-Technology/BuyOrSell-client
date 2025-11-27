// Organization Types

export interface Organization {
  _id: string;
  owner: string;
  type: string;
  country: string;
  emirate: string;
  tradeLicenseNumber: string;
  tradeLicenseExpiry: string;
  trn: string;
  legalName: string;
  tradeName: string;
  reraNumber?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  poBox?: string | null;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  website?: string;
  logoUrl?: string;
  coverImageUrl?: string;
  locations?: OrganizationLocation[];
  tags?: string[];
  verified?: boolean;
  brands?: string[];
  dealershipCodes?: string[];
  languages?: string[];
  businessHours?: BusinessHours[];
  certificates?: Certificate[];
  documents?: Document[];
  status?: 'active' | 'inactive' | 'pending' | 'suspended';
  blocked?: boolean;
  blockedReason?: string[];
  ratingAvg?: number;
  ratingCount?: number;
  followersCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface OrganizationLocation {
  _id?: string;
  name: string;
  address: string;
  city: string;
  emirate: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  phone?: string;
  email?: string;
}

export interface BusinessHours {
  day: string;
  open: string;
  close: string;
  isClosed?: boolean;
}

export interface Certificate {
  _id?: string;
  name: string;
  issuedBy: string;
  issueDate: string;
  expiryDate?: string;
  certificateUrl?: string;
}

export interface Document {
  _id?: string;
  name: string;
  type: string;
  documentUrl: string;
  uploadedAt: string;
}

// Request/Response Types

export interface CreateOrganizationPayload {
  type: string;
  country: string;
  emirate: string;
  tradeLicenseNumber: string;
  tradeLicenseExpiry: string;
  trn: string;
  legalName: string;
  tradeName: string;
  reraNumber?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  poBox?: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  website?: string;
  locations?: Omit<OrganizationLocation, '_id'>[];
  tags?: string[];
  brands?: string[];
  dealershipCodes?: string[];
  languages?: string[];
  businessHours?: BusinessHours[];
}

export interface UpdateOrganizationPayload extends Partial<CreateOrganizationPayload> {
  logoUrl?: string;
  coverImageUrl?: string;
  certificates?: Omit<Certificate, '_id'>[];
  documents?: Omit<Document, '_id'>[];
}

export interface OrganizationResponse {
  statusCode: number;
  message: string;
  data: Organization;
  timestamp: string;
}

export interface OrganizationsListResponse {
  statusCode: number;
  message: string;
  data: {
    organizations: Organization[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  timestamp: string;
}

export interface VerifyOrganizationPayload {
  verified: boolean;
  verifiedBy?: string;
  verificationNotes?: string;
}

export interface BlockOrganizationPayload {
  blocked: boolean;
  blockedReason: string[];
  blockedBy?: string;
  blockNotes?: string;
}

export interface UploadImageResponse {
  statusCode: number;
  message: string;
  data: {
    url: string;
    key: string;
  };
  timestamp: string;
}

