import React, { useState, useEffect } from 'react';
import { X, Save, Trash2, Home, Search } from 'lucide-react';
import { TravelEntry } from '../data/travels';
import { countries } from '../data/countries';

interface EditJourneyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (entry: TravelEntry) => void;
  onDelete: (id: string) => void;
  entry: TravelEntry | null;
  homeLocation?: { country: string; city: string; flagCode: string };
}

const EditJourneyModal: React.FC<EditJourneyModalProps> = ({
  isOpen,
  onClose,
  onUpdate,
  onDelete,
  entry,
  homeLocation,
}) => {
  const [formData, setFormData] = useState<TravelEntry | null>(null);
  const [countrySearch, setCountrySearch] = useState('');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);

  useEffect(() => {
    if (entry) {
      setFormData(entry);
      setCountrySearch(entry.country);
    }
  }, [entry]);

  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(countrySearch.toLowerCase())
  );

  const handleCountrySelect = (country: { name: string; code: string }) => {
    if (formData) {
      setFormData({
        ...formData,
        country: country.name,
        flagCode: country.code
      });
    }
    setCountrySearch(country.name);
    setShowCountryDropdown(false);
  };

  if (!isOpen || !formData) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.isHome && homeLocation) {
      onUpdate({
        ...formData,
        country: homeLocation.country,
        city: homeLocation.city,
        flagCode: homeLocation.flagCode
      });
    } else {
      onUpdate(formData);
    }
    onClose();
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this entry?')) {
      onDelete(formData.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-semibold mb-4">Edit Journey Entry</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <input
              type="checkbox"
              id="isHome"
              className="rounded text-blue-600"
              checked={formData.isHome || false}
              onChange={(e) => setFormData(prev => prev ? ({ ...prev, isHome: e.target.checked }) : null)}
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
                  onChange={(e) => setFormData(prev => prev ? ({ ...prev, city: e.target.value }) : null)}
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
              onChange={(e) => setFormData(prev => prev ? ({ ...prev, entryDate: e.target.value }) : null)}
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
                value={formData.exitDate}
                onChange={(e) => setFormData(prev => prev ? ({ ...prev, exitDate: e.target.value }) : null)}
              />
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="px-4 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 flex items-center justify-center"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditJourneyModal;