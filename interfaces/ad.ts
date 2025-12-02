/* eslint-disable @typescript-eslint/no-explicit-any */
export type AdStatus = "live" | "rejected" | "created";

export type AdSearchType = {
  adCount: number;
  name: string;
  category: string;
};

export interface GetAdSearchResponseType {
  statusCode: number;
  timestamp: string;
  data: AdSearchType[];
}

export type ProductExtraField = {
  name: string;
  type: string;
  value: string | string[] | number | boolean | null;
  optionalArray?: string[];
  icon?: string; // Optional icon URL or identifier
}

export type ProductExtraFields = ProductExtraField[] | Record<string, any>;

export interface AdOrganization {
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
  locations?: any[];
  tags?: any[];
  verified?: boolean;
  brands?: any[];
  dealershipCodes?: any[];
  languages?: any[];
  businessHours?: any[];
  certificates?: any[];
  documents?: any[];
  status?: string;
  blocked?: boolean;
  blockedReason?: any[];
  ratingAvg?: number;
  ratingCount?: number;
  followersCount?: number;
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export type AD = {
  _id: string;
  title: string;
  description: string;
  price: number;
  views?: number; // Number of views
  adType?: "JOB" | "AD"; // Type of ad
  stockQuantity: number;
  availability: string;
  images: string[];
  blurredImages?: string[]; // optional if not always present
  tags: any[];
  category: AdCategory | AdCategoryWithoutParent; // accepts both structures
  brand: AdBrand | string | null; // some responses have brand as object, others as string or null
  owner: AdOwner | null; // Owner can be null
  organization?: AdOrganization; // Organization info for job ads
  extraFields?: ProductExtraFields; // Optional, not present in all ads
  featuredStatus?: string; // present in some APIs
  isFeatured?: boolean;
  status: AdStatus;
  connectionTypes: ("call" | "chat" | "whatsapp")[]; // Array of connection types
  topChoice: boolean;
  deal: boolean;
  validity?: string; // Validity date for the ad
  location?: AdLocation | string; // can be string address or object with country/city/state/area
  address?: AdLocation; // Alternative location field name
  relatedCategories: string[];
  subscriptionId?: string;
  documents?: Document[];
  userType?: string;
  contactPhoneNumber?: string;
  blockedReason?: string[];
  statusHistory?: StatusHistory[];
  upForExchange?: boolean; // Exchange availability flag
  isExchangable?: boolean; // Exchange availability (note spelling)
  exchanged?: boolean; // Whether item has been exchanged
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export interface AdCategory {
  parentID: string;
  name: string;
  desc: string;
  icon: string | null;
  banner: string | null;
  image: string | null;
  children: AdCategory[]; // adjust if you type children later
  fields: CategoryField[];
  childIDs: string[];
  bgColor?: string;
  mobileImage?: string | null;
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdCategoryWithoutParent {
  // when parentID is absent
  name: string;
  desc: string;
  icon: string | null;
  banner?: string | null; // Optional, not always present
  image?: string | null; // Optional, not always present
  children: AdCategory[];
  fields: CategoryField[];
  childIDs: string[];
  bgColor?: string | null;
  mobileImage?: string | null;
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryField {
  name: string;
  type: string;
  default: string | boolean;
  optionalArray: string[];
  secureInput: boolean;
  isOptional: boolean;
  hidden: boolean;
  dependsOn: string | null;
  required: boolean;
  min: number | null;
  max: number | null;
  excludeFor?: string | string[];
  relatedTo?: string;
  searchable?: boolean;
  filter?: string[];
  icon?: string;
  colorMap?: string;
}

export interface AdBrand {
  name: string;
  description: string;
  logo: string;
  isActive: boolean;
  categoryId: string;
  _id: string;
}

export interface AdOwner {
  name?: string;
  firstName: string;
  lastName: string;
  phoneNo: string;
  countryCode: string;
  email: string;
  age: number;
  image?: string;
  status: string;
  hashedPassword: string;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  role: AdOwnerRole;
  isSeller?: boolean;
  resetPasswordToken?: string | null;
  resetPasswordExpires?: string | null;
  deviceKey?: string;
  documents?: any[];
  blockedReason?: string[];
  loggedIn?: boolean;
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdOwnerRole {
  name: string;
  permissions: {
    none: string;
  };
  _id: string;
  updatedAt: string;
}

export interface StatusHistory {
  status: string;
  reason: string;
  updatedBy: string;
  updatedByName: string;
  updatedAt: string;
}

export interface AdLocation {
  country?: string;
  state?: string;
  city?: string;
  area?: string;
  street?: string;
  address?: string | null;
  coordinates?: number[]  | null; // Can be array of [lng, lat] or string
  zipCode?: string | null;
  type?: string; // e.g., "Point" for GeoJSON
}

export type GetLiveAdsResponse = {
  statusCode: number;
  timestamp: string;
  data: {
    adds: AD[];
    total: number;
  };
};

export interface PostAdPayload {
  title: string;
  description: string;
  price: number;
  images: string[];
  video?: string;
  contactPhoneNumber?: string;
  extraFields: ProductExtraFields;
  address: AdLocation;
  owner: string;
  category: string;
  deal: boolean;
  discountPercentage?: number;
  connectionTypes: ("chat" | "call" | "whatsapp")[] | undefined;
  relatedCategories: string[];
  featuredStatus: "created" | "rejected" | "live";
  documents: Document[];
  status: AdStatus;
  userType: "RERA_LANDLORD" | "RERA_AGENT";
  tags: any[];
  stockQuantity: number;
  availability: string;
  organizationId?: string;
}

export interface PostAdResponse {
  statusCode: number;
  timestamp: string;
  data: AD;
}

export interface Document {
  name: string;
  url: string;
  value: string;
}

export interface GetAdsByIdResponse {
  statusCode: number;
  timestamp: string;
  data: AD | null;
}

// Response type for ads list (generic)
export interface GetAdsResponse {
  statusCode: number;
  timestamp: string;
  data: {
    adds: AD[];
    total: number;
    page?: number;
    limit?: number;
    totalPages?: number;
  };
}

// Response type for upload images
export interface UploadAdImagesResponse {
  statusCode: number;
  timestamp: string;
  data: {
    urls: string[];
  };
}

// Response type for update status
export interface UpdateAdStatusResponse {
  statusCode: number;
  timestamp: string;
  data: AD;
  message?: string;
}

// Response type for delete ad
export interface DeleteAdResponse {
  statusCode: number;
  timestamp: string;
  message: string;
}

// Ad filters type - matches /ad API query parameters
export interface AdFilters {
  // Pagination
  page?: number;
  limit?: number;
  
  // String filters
  category?: string;
  brand?: string;
  search?: string;
  status?: string;
  location?: string;
  neighbourhood?: string;
  state?: string;
  userId?: string;
  organizationName?: string;
  sort?: string; // e.g., "createdAt:desc"
  
  // Boolean dropdown filters (all dropdowns except adType are boolean)
  deal?: boolean;
  topChoice?: boolean;
  isFeatured?: boolean;
  hasVideo?: boolean;
  
  // String dropdown filter (only non-boolean dropdown)
  adType?: "JOB" | "AD";
  
  // Date filters
  currentDate?: string; // ISO date-time string
  fromDate?: string; // ISO date-time string
  toDate?: string; // ISO date-time string
  
  // Legacy/alternative field names
  featured?: boolean; // Alias for isFeatured
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "price" | "createdAt" | "updatedAt" | "title";
  sortOrder?: "asc" | "desc";
  owner?: string;
  tags?: string[];
}

// Filter API payload interface
export interface AdFilterPayload {
  category?: string;
  organizationId?: string;
  organizationName?: string;
  brand?: string;
  adType?: "JOB" | "AD";
  search?: string;
  status?: string;
  deal?: boolean;
  currentDate?: string; // ISO date-time string
  fromDate?: string; // ISO date-time string
  toDate?: string; // ISO date-time string
  topChoice?: boolean;
  priceFrom?: number;
  priceTo?: number;
  city?: string;
  neighbourhood?: string;
  age?: number;
  usage?: string[];
  condition?: string[];
  adsPosted?: string; // ISO date-time string
  extraFields?: Record<string, string | string[] | number | boolean>;
  coordinates?: number[];
  distance?: number;
  isFeatured?: boolean;
  dealType?: string;
  state?: string;
  hasVideo?: boolean;
  page?: number;
  limit?: number;
}