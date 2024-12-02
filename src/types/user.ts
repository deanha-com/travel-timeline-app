export interface UserProfile {
  id: string;
  name: string;
  email: string;
  theme: 'light' | 'dark';
  homeLocation: {
    country: string;
    city: string;
    flagCode: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface UserSettings {
  theme: 'light' | 'dark';
}