import React, { useState } from 'react';
import { X, Plus, Home, Search } from 'lucide-react';
import { TravelEntry } from '../data/travels';
import { countries } from '../data/countries';

interface AddJourneyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (entry: TravelEntry) => void;
  homeLocation?: { country: string; city: string; flagCode: string };
}

const AddJourneyModal: React.FC<AddJourneyModalProps> = ({ isOpen, onClose, onAdd, homeLocation }) => {
  const [formData, setFormData] = useState<Omit<TravelEntry, 'id'>>({
    country: '',
    city: '',
    entryDate: '',
    exitDate: '',
    isHome: false,
    flagCode: ''
  });
  const [countrySearch, setCountrySearch] = useState('');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);

  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(countrySearch.toLowerCase())
  );

  const handleCountrySelect = (country: { name: string; code: string }) => {
    setFormData(prev => ({
      ...prev,
      country: country.name,
      flagCode: country.code
    }));
    setCountrySearch(country.name);
    setShowCountryDropdown(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: TravelEntry = {
      ...formData,
      id: crypto.randomUUID()
    };

    if (newEntry.isHome && homeLocation) {
      newEntry.country = homeLocation.country;
      newEntry.city = homeLocation.city;
      newEntry.flagCode = homeLocation.flagCode;
    }

    onAdd(newEntry);
    setFormData({
      country: '',
      city: '',
      entryDate: '',
      exitDate: '',
      isHome: false,
      flagCode: ''
    });
    setCountrySearch('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-semibold mb-4">Add New Journey Entry</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <input
              type="checkbox"
              id="isHome"
              className="rounded text-blue-600"
              checked={formData.isHome}
              onChange={(e) => setFormData(prev => ({ ...prev, isHome: e.target.checked }))}
            />
            <label htmlFor="isHome" className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <Home className="w-4 h-4" />
              This is a return to home
            </label>
          </div>

          {!formData.isHome && (
            <>
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
                
                {showCountryDropdown && countrySearch && (
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
                  value={formData.city}
                  onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Entry Date
            </label>
            <input
              type="date"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={formData.entryDate}
              onChange={(e) => setFormData(prev => ({ ...prev, entryDate: e.target.value }))}
            />
          </div>

          {!formData.isHome && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Exit Date
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={formData.exitDate != '' ? formData.exitDate : formData.entryDate}
                onChange={(e) => setFormData(prev => ({ ...prev, exitDate: e.target.value }))}
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Journey
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddJourneyModal;