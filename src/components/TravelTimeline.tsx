import React from 'react';
import { TravelEntry } from '../data/travels';
import { groupTravelsByJourney, getEffectiveExitDate } from '../utils/timelineUtils';
import JourneyGroup from './JourneyGroup';

interface TravelTimelineProps {
  travels: TravelEntry[];
  onEditEntry: (entry: TravelEntry) => void;
}

const TravelTimeline: React.FC<TravelTimelineProps> = ({ travels, onEditEntry }) => {
  const calculateDuration = (entry: TravelEntry, allEntries: TravelEntry[]) => {
    const start = new Date(entry.entryDate);
    const end = new Date(getEffectiveExitDate(entry, allEntries));
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const journeys = groupTravelsByJourney(travels);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="relative">
        {journeys.map((journey, index) => (
          <JourneyGroup
            key={journey.id}
            journey={journey}
            isLast={index === journeys.length - 1}
            formatDate={formatDate}
            calculateDuration={calculateDuration}
            onEditEntry={onEditEntry}
            allEntries={travels}
          />
        ))}
      </div>
    </div>
  );
};

export default TravelTimeline;