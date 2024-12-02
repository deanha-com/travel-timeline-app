import React from 'react';
import { Calendar } from 'lucide-react';
import { Journey } from '../utils/timelineUtils';
import TimelineEntry from './TimelineEntry';
import { TravelEntry } from '../data/travels';

interface JourneyGroupProps {
  journey: Journey;
  isLast: boolean;
  formatDate: (date: string) => string;
  calculateDuration: (entry: TravelEntry, allEntries: TravelEntry[]) => number;
  onEditEntry: (entry: TravelEntry) => void;
  allEntries: TravelEntry[];
}

const JourneyGroup: React.FC<JourneyGroupProps> = ({
  journey,
  isLast,
  formatDate,
  calculateDuration,
  onEditEntry,
  allEntries,
}) => {
  const totalDays = journey.trips.reduce((acc, trip) => acc + calculateDuration(trip, allEntries), 0);

  return (
    <div className="mb-16 relative">
      <div className="mb-8 flex items-center gap-2 ml-40">
        <Calendar className="w-5 h-5 text-purple-600" />
        <h2 className="text-lg font-semibold text-purple-600">
          Journey {journey.trips.length === 1 ? 'to' : 'through'} {journey.trips.map(t => t.country).join(', ')}
        </h2>
        <span className="text-sm text-gray-500">
          ({totalDays} days total)
        </span>
      </div>

      {journey.trips.map((entry, index) => (
        <TimelineEntry
          key={entry.id}
          entry={entry}
          isLast={index === journey.trips.length - 1}
          formatDate={formatDate}
          calculateDuration={calculateDuration}
          onEdit={onEditEntry}
          allEntries={allEntries}
        />
      ))}
    </div>
  );
};

export default JourneyGroup;