/* eslint-disable @typescript-eslint/no-explicit-any */
export type AdStatus = "live" | "rejected" | "created";

export type AdSearchType = {
  adCount: number;
  name: string;
  category: string;
};

export interface KeywordSearchResult {
  adCount: number;
  name: string;
  category: string;
}

export interface GetKeywordSearchResponse {
  statusCode: number;
  timestamp: string;
  data: KeywordSearchResult[];
}

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
};

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
  legalNameAr?: string;
  tradeName: string;
  tradeNameAr?: string;
  reraNumber?: string;
  addressLine1: string;
  addressLine1Ar?: string;
  addressLine2?: string;
  addressLine2Ar?: string;
  city: string;
  cityAr?: string;
  poBox?: string | null;
  contactName: string;
  contactNameAr?: string;
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
  isFollowing?: boolean;
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export type AD = {
  _id: string;
  title: string;
  titleAr?: string;
  description: string;
  descriptionAr?: string;
  price: number;
  minSalary?: number;
  maxSalary?: number;
  jobMode?: string;
  jobModeAr?: string;
  jobShift?: string;
  jobShiftAr?: string;
  views?: number; // Number of views
  adType?: "JOB" | "AD"; // Type of ad
  stockQuantity: number;
  availability: string;
  availabilityAr?: string;
  images: string[];
  videoUrl?: string;
  blurredImages?: string[]; // optional if not always present
  tags: any[];
  tagsAr?: string[]; // Arabic tags
  category: AdCategory | AdCategoryWithoutParent; // accepts both structures
  brand: AdBrand | string | null; // some responses have brand as object, others as string or null
  owner: AdOwner | null; // Owner can be null
  organization?: AdOrganization; // Organization info for job ads
  extraFields?: ProductExtraFields; // Optional, not present in all ads
  featuredStatus?: string; // present in some APIs
  featuredStatusAr?: string;
  isFeatured?: boolean;
  isAddedInCollection?: boolean;
  collectionIds?: string[]; // Array of collection IDs the ad belongs to
  status: AdStatus;
  statusAr?: string;
  connectionTypes: ("call" | "chat" | "whatsapp")[]; // Array of connection types
  topChoice: boolean;
  deal: boolean;
  validity?: string; // Validity date for the ad
  location?: AdLocation | string; // can be string address or object with country/city/state/area
  address?: AdLocation; // Alternative location field name
  addressAr?: AdLocation | string; // Arabic address
  relatedCategories: string[];
  subscriptionId?: string;
  documents?: Document[];
  userType?: string;
  userTypeAr?: string;
  contactPhoneNumber?: string;
  blockedReason?: string[];
  statusHistory?: StatusHistory[];
  upForExchange?: boolean; // Exchange availability flag
  isExchangable?: boolean; // Exchange availability (note spelling)
  exchangeWith?: {
    title: string;
    titleAr?: string;
    description?: string;
    descriptionAr?: string;
    imageUrl?: string;
    _id?: string;
  };
  exchanged?: boolean; // Whether item has been exchanged
  discountedPrice?: number; // Discounted price when deal is active
  dealValidThru?: string; // ISO 8601 date string for deal validity
  dealValidThrough?: string; // Alternative field name for deal validity
  dealPercentage?: number; // Discount percentage (calculated or provided)
  slug?: string; // URL slug for the ad
  slugAr?: string; // Arabic URL slug for the ad
  searchTokens?: string[]; // Search tokens for the ad
  isSaved?: boolean; // Whether the current user has saved this job/ad
  isApplied?: boolean; // Whether the current user has applied to this job
  savedJobId?: string; // ID of the saved job record (if saved)
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export interface CategoryAdsCount {
  categoryId: string;
  categoryName: string;
  categoryNameAr: string;
  description: string;
  descriptionAr: string;
  icon: string;
  banner: string;
  image: string;
  mobileImage: string;
  bgColor: string;
  slug: string;
  slugAr: string;
  parentID: string;
  childIDs: string[];
  sequence: number;
  relatedTo: string;
  fields: {
    name: string;
    type: string;
  }[];
  count: number;
}

export interface GetCategoryAdsCountResponse {
  statusCode: number;
  timestamp: string;
  data: CategoryAdsCount[];
}

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
  nameAr?: string;
  firstName: string;
  firstNameAr?: string;
  lastName: string;
  lastNameAr?: string;
  phoneNo: string;
  countryCode: string;
  email: string;
  age?: number;
  gender?: string;
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
  emaratiStatus?: string;
  recentlyViewed?: any[];
  activeAddOns?: any[];
  loggedIn?: boolean;
  lastActiveAt?: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdOwnerRole {
  name: string;
  nameAr?: string;
  description?: string;
  descriptionAr?: string;
  permissions: Record<string, any>;
  _id: string;
  createdAt?: string;
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
  countryAr?: string;
  state?: string;
  stateAr?: string;
  city?: string;
  cityAr?: string;
  area?: string;
  street?: string;
  address?: string | null;
  addressAr?: string | null;
  coordinates?: number[] | null; // Can be array of [lng, lat] or string
  zipCode?: string | null;
  type?: string; // e.g., "Point" for GeoJSON
}

export type GetLiveAdsResponse = {
  statusCode?: number;
  timestamp?: string;
  data?: {
    ads?: AD[];
    adds?: AD[]; // Legacy field for backward compatibility
    total?: number;
    page?: number;
    limit?: number;
  };
  // Handle case where API returns array directly or different structure
  ads?: AD[];
  adds?: AD[]; // Legacy field for backward compatibility
  total?: number;
  page?: number;
  limit?: number;
};

export interface PostAdPayload {
  title: string;
  description: string;
  price: number;
  images: string[];
  minSalary?: number;
  maxSalary?: number;
  jobMode?: string;
  jobShift?: string;
  videoUrl?: string;
  contactPhoneNumber?: string;
  extraFields: ProductExtraFields;
  address: AdLocation;
  owner: string;
  category: string;
  deal: boolean;
  discountedPrice?: number;
  dealValidThru?: string; // ISO 8601 date string
  isExchangable?: boolean;
  exchangeWith?: {
    title: string;
    titleAr?: string;
    description?: string;
    descriptionAr?: string;
    imageUrl?: string;
    _id?: string;
  };
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
  adType: "AD" | "JOB";
  isFeatured?: boolean;
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
  upForExchange?: boolean;
  isExchangable?: boolean;

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
  upForExchange?: boolean;
  isExchangable?: boolean;
  discountedPrice?: boolean;
  page?: number;
  limit?: number;
}

export interface RenewAdPayload {
  days: number;
}
