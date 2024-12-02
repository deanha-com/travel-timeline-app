import React from 'react';
import { Plane, Home, Edit2 } from 'lucide-react';
import { TravelEntry } from '../data/travels';
import { getEffectiveExitDate } from '../utils/timelineUtils';

interface TimelineEntryProps {
  entry: TravelEntry;
  isLast: boolean;
  formatDate: (date: string) => string;
  calculateDuration: (entry: TravelEntry, allEntries: TravelEntry[]) => number;
  onEdit: (entry: TravelEntry) => void;
  allEntries: TravelEntry[];
}

const TimelineEntry: React.FC<TimelineEntryProps> = ({
  entry,
  isLast,
  formatDate,
  calculateDuration,
  onEdit,
  allEntries,
}) => {
  const effectiveExitDate = getEffectiveExitDate(entry, allEntries);

  return (
    <div className="mb-8 flex gap-8 items-start">
      <div className="w-32 text-right text-sm text-gray-600">
        {formatDate(entry.entryDate)}
      </div>
      
      <div className="relative">
        <div 
          className={`w-6 h-6 rounded-full ${
            entry.isHome ? 'bg-emerald-500' : 'bg-blue-500'
          } flex items-center justify-center`}
        >
          {entry.isHome ? (
            <Home className="w-4 h-4 text-white" />
          ) : (
            <Plane className="w-4 h-4 text-white" />
          )}
        </div>
        {!isLast && (
          <div className="absolute top-6 bottom-0 left-3 w-0.5 border-l-2 border-dotted border-gray-300" />
        )}
      </div>

      <div className="flex-1 bg-white rounded-lg shadow-md p-6 transition-all hover:shadow-lg">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-3">
            <img 
              src={`https://flagcdn.com/${entry.flagCode}.svg`}
              alt={`${entry.country} flag`}
              className="w-6 h-4 object-cover rounded-sm shadow-sm"
            />
            <h3 className="text-xl font-semibold text-gray-900">
              {entry.city}, {entry.country}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            {!entry.isHome && (
              <span className="text-sm font-medium px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                {calculateDuration(entry, allEntries)} days
              </span>
            )}
            <button
              onClick={() => onEdit(entry)}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              title="Edit entry"
            >
              <Edit2 className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>
        
        <div className="text-sm text-gray-600">
          <p>Entry: {formatDate(entry.entryDate)}</p>
          {!entry.isHome && <p>Exit: {formatDate(effectiveExitDate)}</p>}
        </div>
        
        {entry.isHome && (
          <div className="mt-2 inline-flex items-center gap-1 text-sm text-emerald-600">
            <Home className="w-4 h-4" />
            <span>Home Country</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default TimelineEntry;