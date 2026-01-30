export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  verifyEmail: boolean;
  countryCode: string;
  deviceKey?: string | null;
}

export interface loginResponse {
  statusCode: number;
  timestamp: string;
  data: {
    accessToken: string;
    refreshToken: string;
    user: User;
  };
}

export interface GoogleSignInPayload {
  platform: string;
  idToken: string;
  accessToken: string;
}

export interface AppleSignInPayload {
  platform: string;
  idToken: string;
  appleAuthDevice: string;
  fullName?: string;
}

export interface SocialLoginPayload {
  firstName: string;
  lastName: string;
  phoneNo?: string;
  email: string;
  age?: number;
  image?: string;
  dob?: string;
  verifyEmail: boolean;
  countryCode: string;
  deviceKey: string | null;
  socialType: "google" | "apple" | "twitter";
  documents?: {
    name: string;
    url: string;
  };
  appleDeviceId?: string;
}
