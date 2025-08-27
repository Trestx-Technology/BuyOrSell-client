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

export interface SocialLoginPayload {
  firstName: string;
  lastName: string;
  email: string;
  verifyEmail: boolean;
  countryCode: string;
  deviceKey: string | null;
  socialType: "google" | "apple";
}
