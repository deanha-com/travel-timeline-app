import React, { useState, useEffect } from 'react';
import { Plane, Plus } from 'lucide-react';
import TravelTimeline from './components/TravelTimeline';
import AddJourneyModal from './components/AddJourneyModal';
import EditJourneyModal from './components/EditJourneyModal';
import ProfileModal from './components/ProfileModal';
import { travelData as initialTravelData, TravelEntry } from './data/travels';
import { storage } from './utils/storage';
import { UserProfile } from './types/user';
import { connectDB } from './utils/db';

// Initialize MongoDB connection
// connectDB().catch(console.error);

function App() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<TravelEntry | null>(null);
  const [travels, setTravels] = useState<TravelEntry[]>(initialTravelData);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const initializeApp = async () => {
      const savedProfile = await storage.getProfile();
      if (savedProfile) {
        setProfile(savedProfile);
        document.documentElement.classList.toggle('dark', savedProfile.theme === 'dark');
        const savedTravels = await storage.getTravels(savedProfile.id);
        if (savedTravels.length > 0) {
          setTravels(savedTravels);
        }
      } else {
        const newProfile = await storage.createProfile({});
        setProfile(newProfile);
      }
    };

    initializeApp();
  }, []);

  useEffect(() => {
    if (profile) {
      storage.saveTravels(profile.id, travels);
    }
  }, [travels, profile]);

  const handleAddJourney = (newEntry: TravelEntry) => {
    setTravels(prev => [...prev, newEntry]);
  };

  const handleEditEntry = (entry: TravelEntry) => {
    setSelectedEntry(entry);
    setIsEditModalOpen(true);
  };

  const handleUpdateEntry = (updatedEntry: TravelEntry) => {
    setTravels(prev => prev.map(entry => 
      entry.id === updatedEntry.id ? updatedEntry : entry
    ));
  };

  const handleDeleteEntry = (id: string) => {
    setTravels(prev => prev.filter(entry => entry.id !== id));
  };

  const handleImport = async (importedEntries: TravelEntry[]) => {
    setTravels(importedEntries);
    if (profile) {
      await storage.saveTravels(profile.id, importedEntries);
    }
  };

  const handleSaveHome = async (home: { country: string; city: string; flagCode: string }) => {
    if (profile) {
      const updatedProfile = { ...profile, homeLocation: home };
      setProfile(updatedProfile);
      await storage.saveProfile(updatedProfile);
      // Update any existing home entries
      const updatedTravels = travels.map(entry => 
        entry.isHome ? { ...entry, ...home } : entry
      );
      setTravels(updatedTravels);
      await storage.saveTravels(profile.id, updatedTravels);
    }
  };

  const handleThemeChange = (theme: 'light' | 'dark') => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Plane className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Travel Timeline</h1>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Journey
              </button>
              <button
                onClick={() => setIsProfileModalOpen(true)}
                className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {profile?.name ? profile.name[0].toUpperCase() : 'P'}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="py-8">
        <TravelTimeline 
          travels={travels}
          onEditEntry={handleEditEntry}
        />
      </main>

      <AddJourneyModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddJourney}
        homeLocation={profile?.homeLocation}
      />

      <EditJourneyModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedEntry(null);
        }}
        onUpdate={handleUpdateEntry}
        onDelete={handleDeleteEntry}
        entry={selectedEntry}
        homeLocation={profile?.homeLocation}
      />

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onSaveHome={handleSaveHome}
        currentHome={profile?.homeLocation}
        onImport={handleImport}
        travels={travels}
        onThemeChange={handleThemeChange}
      />
    </div>
  );
}

export default App;