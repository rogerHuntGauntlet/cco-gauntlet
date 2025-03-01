// This file is excluded from routes with _ prefix
export interface DataSource {
  id: string;
  name: string;
  description: string;
  icon: JSX.Element;
}

export interface Preferences {
  notificationFrequency: string;
  dataPrivacy: string;
  aiSuggestions: boolean;
}

export interface UserData {
  name: string;
  email: string;
  isAuthenticated: boolean;
  dataSources?: string[];
  preferences?: Preferences;
  userProject?: string;
  onboardingComplete: boolean;
} 