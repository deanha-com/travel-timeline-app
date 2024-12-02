import React, { useState, useEffect } from 'react';
import { X, Home, Search, Moon, Sun, Download, Upload, Save } from 'lucide-react';
import { countries } from '../data/countries';
import { UserProfile } from '../types/user';
import { storage } from '../utils/storage';
import { TravelEntry } from '../data/travels';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveHome: (homeLocation: { country: string; city: string; flagCode: string }) => void;
  currentHome?: { country: string; city: string; flagCode: string };
  onImport: (entries: TravelEntry[]) => void;
  travels: TravelEntry[];
  onThemeChange: (theme: 'light' | 'dark') => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  onSaveHome,
  currentHome,
  onImport,
  travels,
  onThemeChange,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'home' | 'settings'>('profile');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [countrySearch, setCountrySearch] = useState('');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);

  useEffect(() => {
    const savedProfile = storage.getProfile();
    if (savedProfile) {
      setProfile(savedProfile);
    } else {
      const newProfile = storage.createProfile({});
      setProfile(newProfile);
    }
  }, []);

  useEffect(() => {
    if (currentHome) {
      setCountrySearch(currentHome.country);
    }
  }, [currentHome]);

  const filteredCountries = countries.filter(country =>
    country?.name.toLowerCase().includes(countrySearch?.toLowerCase())
  );

  const handleCountrySelect = (country: { name: string; code: string }) => {
    if (profile) {
      const updatedProfile = {
        ...profile,
        homeLocation: {
          ...profile?.homeLocation,
          country: country.name,
          flagCode: country.code
        }
      };
      setProfile(updatedProfile);
      storage.saveProfile(updatedProfile);
      onSaveHome(updatedProfile.homeLocation);
    }
    setCountrySearch(country.name);
    setShowCountryDropdown(false);
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (profile) {
      storage.saveProfile(profile);
    }
  };

  const handleExport = () => {
    const data = storage.exportData();
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'travel-timeline-backup.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);
        storage.importData(data);
        if (data.profile) {
          setProfile(data.profile);
          onSaveHome(data.profile?.homeLocation);
          onThemeChange(data.profile.theme);
        }
        if (data.travels) {
          onImport(data.travels);
        }
      } catch (error) {
        alert('Invalid backup file format');
      }
    };
    reader.readAsText(file);
  };

  if (!isOpen || !profile) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-4 mb-6">
          <h2 className="text-xl font-semibold">Profile Settings</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-3 py-1 rounded-md ${
                activeTab === 'profile' ? 'bg-blue-100 text-blue-700' : 'text-gray-600'
              }`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab('home')}
              className={`px-3 py-1 rounded-md ${
                activeTab === 'home' ? 'bg-blue-100 text-blue-700' : 'text-gray-600'
              }`}
            >
              Home Location
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-3 py-1 rounded-md ${
                activeTab === 'settings' ? 'bg-blue-100 text-blue-700' : 'text-gray-600'
              }`}
            >
              Settings
            </button>
          </div>
        </div>

        {activeTab === 'profile' && (
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={profile.name}
                onChange={(e) => setProfile(prev => prev ? ({ ...prev, name: e.target.value }) : null)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={profile.email}
                onChange={(e) => setProfile(prev => prev ? ({ ...prev, email: e.target.value }) : null)}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Profile
            </button>
          </form>
        )}

        {activeTab === 'home' && (
          <div className="space-y-4">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={countrySearch}
                  onChange={(e) => {
                    setCountrySearch(e.target.value);
                    setShowCountryDropdown(true);
                  }}
                  onFocus={() => setShowCountryDropdown(true)}
                />
                <Search className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
              </div>
              
              {showCountryDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                  {filteredCountries.map((country) => (
                    <button
                      key={country.code}
                      type="button"
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2"
                      onClick={() => handleCountrySelect(country)}
                    >
                      <img
                        src={`https://flagcdn.com/${country.code}.svg`}
                        alt={`${country.name} flag`}
                        className="w-6 h-4 object-cover rounded-sm"
                      />
                      {country.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={profile?.homeLocation?.city}
                onChange={(e) => {
                  if (profile) {
                    const updatedProfile = {
                      ...profile,
                      homeLocation: {
                        ...profile?.homeLocation,
                        city: e.target.value
                      }
                    };
                    setProfile(updatedProfile);
                    storage.saveProfile(updatedProfile);
                    onSaveHome(updatedProfile?.homeLocation);
                  }
                }}
              />
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Theme</h3>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => {
                    if (profile) {
                      const updatedProfile = { ...profile, theme: 'light' as const };
                      setProfile(updatedProfile);
                      storage.saveProfile(updatedProfile);
                      onThemeChange('light');
                    }
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md ${
                    profile.theme === 'light' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  <Sun className="w-4 h-4" />
                  Light
                </button>
                <button
                  onClick={() => {
                    if (profile) {
                      const updatedProfile = { ...profile, theme: 'dark' as const };
                      setProfile(updatedProfile);
                      storage.saveProfile(updatedProfile);
                      onThemeChange('dark');
                    }
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md ${
                    profile.theme === 'dark' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  <Moon className="w-4 h-4" />
                  Dark
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Data Management</h3>
              <div className="flex gap-4">
                <button
                  onClick={handleExport}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  <Download className="w-4 h-4" />
                  Export Backup
                </button>
                <label className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 cursor-pointer">
                  <Upload className="w-4 h-4" />
                  Import Backup
                  <input
                    type="file"
                    onChange={handleImport}
                    accept="application/json"
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileModal;