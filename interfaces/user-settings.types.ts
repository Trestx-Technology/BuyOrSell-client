export interface UserSettingsPayload {
  userId: string;
  language?: string;
  notificationsEnabled?: boolean;
  darkMode?: boolean;
}

export interface UserSettings {
  _id?: string;
  userId: string;
  language?: string;
  notificationsEnabled?: boolean;
  darkMode?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserSettingsResponse {
  statusCode: number;
  timestamp: string;
  message?: string;
  data: UserSettings;
}
