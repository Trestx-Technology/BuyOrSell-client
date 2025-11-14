export interface User {
  _id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phoneNo: string;
  countryCode?: string;
  age?: number;
  image?: string;
  isVerified?: boolean;
  phoneVerified?: boolean;
  emailVerified?: boolean;
  role?: {
    _id?: string;
    name?: string;
    description?: string;
    permissions?: Record<string, unknown>;
    createdAt?: string;
    updatedAt?: string;
  };
  isSeller?: boolean;
  status?: string;
  hashedPassword?: string;
  dob?: string;
  gender?: "MALE" | "FEMALE" | "OTHER";
  deviceKey?: string;
  socialType?: string;
  documents?: Array<{
    name: string;
    url: string;
    value?: string;
  }>;
  userType?: string;
  userTypeId?: string;
  userTypeKey?: string;
  userTypeLabel?: string;
  userTypeDetails?: Record<string, unknown>;
  firstLoggedIn?: boolean;
  lastActiveAt?: string;
  blockedBy?: string;
  loggedIn?: boolean;
  appleDeviceId?: string;
  isEmarati?: boolean;
  emaratiDetails?: string;
  emaratiStatus?: "PENDING" | "VERIFIED" | "REJECTED";
  blockedReason?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateUserPayload {
  name?: string;
  firstName: string;
  lastName: string;
  phoneNo?: string;
  countryCode?: string;
  email: string;
  age?: number;
  role?: string;
  password?: string;
  isVerified?: boolean;
  phoneVerified?: boolean;
  emailVerified?: boolean;
  isSeller?: boolean;
  image?: string;
  verifyEmail?: boolean;
  dob?: string;
  gender?: "MALE" | "FEMALE" | "OTHER";
  deviceKey?: string;
  socialType?: string;
  documents?: Array<{
    name: string;
    url: string;
    value?: string;
  }>;
  userType?: string;
  firstLoggedIn?: boolean;
  appleDeviceId?: string;
  isEmarati?: boolean;
  emaratiDetails?: string;
}

export interface UpdateUserPayload {
  name?: string;
  firstName?: string;
  lastName?: string;
  image?: string;
  phoneNo?: string;
  email?: string;
  age?: number;
  gender?: "MALE" | "FEMALE" | "OTHER";
  role?: string;
  isVerified?: boolean;
  phoneVerified?: boolean;
  emailVerified?: boolean;
  isSeller?: boolean;
  countryCode?: string;
  deviceKey?: string;
  status?: string;
  documents?: Array<{
    name: string;
    url: string;
    value?: string;
  }>;
  userType?: string;
  firstLoggedIn?: boolean;
  lastActiveAt?: string;
  blockedBy?: string;
  loggedIn?: boolean;
  appleDeviceId?: string;
  userTypeId?: string;
  userTypeKey?: string;
  userTypeLabel?: string;
  userTypeDetails?: Record<string, unknown>;
}

export interface UserResponse {
  statusCode: number;
  timestamp: string;
  message?: string;
  data: User;
}

export interface UsersListResponse {
  statusCode: number;
  timestamp: string;
  message?: string;
  data: User[];
  total?: number;
  page?: number;
  limit?: number;
}

export interface SendEmailOtpResponse {
  statusCode: number;
  timestamp: string;
  message?: string;
  data?: string;
}

export interface SendPhoneOtpResponse {
  statusCode: number;
  timestamp: string;
  message?: string;
  data?: string;
}

export interface VerifyEmailResponse {
  statusCode: number;
  timestamp: string;
  message?: string;
}

export interface VerifyPhoneResponse {
  statusCode: number;
  timestamp: string;
  message?: string;
}

export interface AddUserTypePayload {
  documents?: Array<{
    name: string;
    url: string;
    value?: string;
  }>;
  userType: "SELLER" | "BUYER" | "RERA_LANDLORD" | "RERA_AGENT";
  userTypeId?: string;
  userTypeKey?: string;
  userTypeLabel?: string;
  userTypeDetails?: Record<string, unknown>;
}

export interface UpdateEmaratiPayload {
  status: "PENDING" | "VERIFIED" | "REJECTED";
  details?: string;
}

export interface BlockUserPayload {
  blockedBy?: string;
  blockedByName?: string;
  blockedAt?: string;
  reason?: string;
  blocking: boolean;
}

export interface AssignRolePayload {
  roleId: string;
}

export interface BlockHistory {
  _id: string;
  blockedBy: string;
  blockedByName?: string;
  blockedAt: string;
  reason?: string;
  blocking: boolean;
  createdAt?: string;
}

export interface BlockHistoryResponse {
  statusCode: number;
  timestamp: string;
  message?: string;
  data: BlockHistory[];
}

