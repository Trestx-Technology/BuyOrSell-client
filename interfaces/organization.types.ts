// Organization Types

export interface Organization {
  _id: string;
  owner: {
    _id: string;
    firstName: string;
    lastName: string;
    image: string;
    phoneNo: string;
    email: string;
  };
  type: string;
  country: string;
  emirate: string;
  tradeLicenseNumber: string;
  tradeLicenseExpiry: string;
  trn: string;
  legalName: string;
  tradeName: string;
  legalNameAr?: string;
  tradeNameAr?: string;
  reraNumber?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  poBox?: string | null;
  addressLine1Ar?: string;
  addressLine2Ar?: string;
  cityAr?: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  contactNameAr?: string;
  website?: string;
  logoUrl?: string;
  coverImageUrl?: string;
  locations?: OrganizationLocation[];
  locationsAr?: OrganizationLocation[];
  tags?: string[];
  tagsAr?: string[];
  verified?: boolean;
  brands?: string[];
  brandsAr?: string[];
  dealershipCodes?: string[];
  languages?: string[];
  businessHours?: BusinessHours[];
  certificates?: Certificate[];
  documents?: Document[];
  status?:
    | "active"
    | "inactive"
    | "pending"
    | "suspended"
    | "APPROVED"
    | "DRAFT"
    | "REJECTED";
  blocked?: boolean;
  blockedReason?: string[];
  ratingAvg?: number;
  ratingCount?: number;
  followersCount?: number;
  isFollowing?: boolean;
  isSaved?: boolean;
  totalAds?: number;
  activeAds?: number;
  expiredAds?: number;
  totalJobsPosted?: number;
  featuredJobs?: any[];
  latestJobs?: any[];
  createdAt: string;
  updatedAt: string;
  __v?: number;
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
  day: number;
  open: string;
  close: string;
  closed?: boolean;
  allDay?: boolean;
}

export interface Certificate {
  _id?: string;
  name: string;
  issuedBy: string;
  issueDate: string;
  expiryDate?: string;
  certificateUrl?: string;
  fileId?: string;
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
  logoUrl?: string;
  locations?: Omit<OrganizationLocation, "_id">[];
  tags?: string[];
  brands?: string[];
  dealershipCodes?: string[];
  languages?: string[];
  businessHours?: BusinessHours[];
  certificates?: Omit<Certificate, "_id">[];
}

export interface UpdateOrganizationPayload
  extends Partial<CreateOrganizationPayload> {
  logoUrl?: string;
  coverImageUrl?: string;
  certificates?: Omit<Certificate, "_id">[];
  documents?: Omit<Document, "_id">[];
}

export interface OrganizationResponse {
  statusCode: number;
  message: string;
  data: Organization[];
  timestamp: string;
}
export interface OrganizationByIdResponse {
  statusCode: number;
  message: string;
  data: Organization;
  timestamp: string;
}

export interface OrganizationsListResponse {
  statusCode: number;
  message: string;
  data: {
    items: Organization[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
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
  blockedReason?: string[];
}

export interface BlockHistoryItem {
  _id: string;
  blocked: boolean;
  blockedReason?: string[];
  blockedBy?: string;
  blockedAt: string;
  unblockedAt?: string;
}

export interface OrganizationFollower {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNo?: string;
  profileImage?: string;
  followedAt: string;
}

export interface FollowersListResponse {
  statusCode: number;
  message: string;
  data: {
    followers: OrganizationFollower[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  timestamp: string;
}

export interface FollowersCountResponse {
  statusCode: number;
  message: string;
  data: {
    count: number;
  };
  timestamp: string;
}

export interface BulkApprovePayload {
  organizationIds: string[];
}

export interface BulkRejectPayload {
  organizationIds: string[];
  rejectionReason?: string;
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
