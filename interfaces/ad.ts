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

export type ProductExtraFields = Record<string, any>;

export type AD = {
  _id: string;
  title: string;
  description: string;
  price: number;
  stockQuantity: number;
  availability: string;
  images: string[];
  blurredImages?: string[]; // optional if not always present
  tags: any[];
  category: AdCategory | AdCategoryWithoutParent; // accepts both structures
  brand: AdBrand | string | null; // some responses have brand as object, others as string or null
  owner: AdOwner;
  extraFields: ProductExtraFields;
  featuredStatus?: string; // present in some APIs
  isFeatured?: boolean;
  status: AdStatus;
  connectionTypes: ["call", "chat", "whatsapp"];
  topChoice: boolean;
  deal: boolean;
  location: AdLocation; // can be string address or object with country/city/state/area
  relatedCategories: string[];
  subscriptionId?: string;
  documents?: Document[];
  userType?: string;
  contactPhoneNumber?: string;
  blockedReason?: string[];
  statusHistory?: StatusHistory[];
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
  banner: string | null;
  image: string | null;
  children: AdCategory[];
  fields: CategoryField[];
  childIDs: string[];
  bgColor?: string;
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
  excludeFor?: string[];
  relatedTo?: string;
  searchable?: boolean;
  filter?: string[];
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
  address?: string | null;
  coordinates?: string | null;
  zipCode?: string | null;
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

// Ad filters type
export interface AdFilters {
  page?: number;
  limit?: number;
  category?: string;
  status?: "live" | "rejected" | "pending";
  featured?: boolean;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  sortBy?: "price" | "createdAt" | "updatedAt" | "title";
  sortOrder?: "asc" | "desc";
  owner?: string;
  tags?: string[];
}