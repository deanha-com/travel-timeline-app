import { UserProfile } from '../types/user';
import { TravelEntry } from '../data/travels';
import { User } from '../models/User';
import { Travel } from '../models/Travel';

const STORAGE_KEYS = {
  USER_PROFILE: 'travel_timeline_user_profile',
  TRAVELS: 'travel_timeline_travels'
};

// Toggle for using localStorage or MongoDB
const USE_LOCAL_STORAGE = 'true';

// Helper to convert MongoDB document to UserProfile
const convertToUserProfile = (doc: any): UserProfile => ({
  id: doc._id.toString(),
  name: doc.name || '',
  email: doc.email || '',
  theme: doc.theme || 'light',
  homeLocation: doc.homeLocation || {
    country: "United Kingdom",
    city: "London",
    flagCode: "gb"
  },
  createdAt: doc.createdAt.toISOString(),
  updatedAt: doc.updatedAt.toISOString()
});

// Helper to convert MongoDB travel document to TravelEntry
const convertToTravelEntry = (doc: any): TravelEntry => ({
  id: doc._id.toString(),
  country: doc.country,
  city: doc.city,
  entryDate: doc.entryDate.toISOString().split('T')[0],
  exitDate: doc.exitDate ? doc.exitDate.toISOString().split('T')[0] : undefined,
  isHome: doc.isHome,
  flagCode: doc.flagCode
});

export const storage = {
  getProfile: async (): Promise<UserProfile | null> => {
    try {
      if (USE_LOCAL_STORAGE) {
        const localData = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
        return localData ? JSON.parse(localData) : null;
      } else {
        const user = await User.findOne();
        return user ? convertToUserProfile(user) : null;
      }
    } catch (error) {
      console.error('Error getting profile:', error);
      return null;
    }
  },

  saveProfile: async (profile: UserProfile): Promise<void> => {
    try {
      if (USE_LOCAL_STORAGE) {
        localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify({
          ...profile,
          updatedAt: new Date().toISOString()
        }));
      } else {
        await User.findByIdAndUpdate(
          profile.id,
          {
            name: profile.name,
            email: profile.email,
            theme: profile.theme,
            homeLocation: profile.homeLocation,
            updatedAt: new Date()
          },
          { upsert: true }
        );
      }
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  },

  createProfile: async (profile: Partial<UserProfile>): Promise<UserProfile> => {
    try {
      if (USE_LOCAL_STORAGE) {
        const newProfile: UserProfile = {
          id: `${Date.now()}`, // Simple unique ID for local storage
          name: profile.name || '',
          email: profile.email || '',
          theme: profile.theme || 'light',
          homeLocation: profile.homeLocation || {
            country: "United Kingdom",
            city: "London",
            flagCode: "gb"
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(newProfile));
        return newProfile;
      } else {
        const newUser = await User.create({
          name: profile.name || '',
          email: profile.email || '',
          theme: profile.theme || 'light',
          homeLocation: profile.homeLocation || {
            country: "United Kingdom",
            city: "London",
            flagCode: "gb"
          }
        });
        return convertToUserProfile(newUser);
      }
    } catch (error) {
      console.error('Error creating profile:', error);
      throw error;
    }
  },

  saveTravels: async (userId: string, travels: TravelEntry[]): Promise<void> => {
    try {
      if (USE_LOCAL_STORAGE) {
        localStorage.setItem(STORAGE_KEYS.TRAVELS, JSON.stringify(travels));
      } else {
        await Travel.deleteMany({ userId }); // Clear existing entries
        await Travel.insertMany(
          travels.map(travel => ({
            userId,
            country: travel.country,
            city: travel.city,
            entryDate: new Date(travel.entryDate),
            exitDate: travel.exitDate ? new Date(travel.exitDate) : undefined,
            isHome: travel.isHome,
            flagCode: travel.flagCode
          }))
        );
      }
    } catch (error) {
      console.error('Error saving travels:', error);
    }
  },

  getTravels: async (userId: string): Promise<TravelEntry[]> => {
    try {
      if (USE_LOCAL_STORAGE) {
        const localData = localStorage.getItem(STORAGE_KEYS.TRAVELS);
        return localData ? JSON.parse(localData) : [];
      } else {
        const travels = await Travel.find({ userId }).sort({ entryDate: 1 });
        return travels.map(convertToTravelEntry);
      }
    } catch (error) {
      console.error('Error getting travels:', error);
      return [];
    }
  },

  exportData: async (userId: string) => {
    try {
      const profile = await storage.getProfile();
      const travels = await storage.getTravels(userId);

      return {
        profile,
        travels
      };
    } catch (error) {
      console.error('Error exporting data:', error);
      return {
        profile: null,
        travels: []
      };
    }
  },

  importData: async (data: { profile?: UserProfile; travels?: TravelEntry[] }) => {
    try {
      if (data.profile) {
        await storage.saveProfile(data.profile);
      }
      if (data.travels && data.profile) {
        await storage.saveTravels(data.profile.id, data.travels);
      }
    } catch (error) {
      console.error('Error importing data:', error);
    }
  }
};
