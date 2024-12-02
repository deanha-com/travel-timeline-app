import { TravelEntry } from '../data/travels';

export interface Journey {
  id: string;
  trips: TravelEntry[];
  startDate: string;
  endDate: string;
}

export const getEffectiveExitDate = (entry: TravelEntry, allEntries: TravelEntry[]): string => {
  if (entry.exitDate) return entry.exitDate;
  
  // Find the next entry's entry date
  const sortedEntries = allEntries.sort((a, b) => 
    new Date(a.entryDate).getTime() - new Date(b.entryDate).getTime()
  );
  
  const currentIndex = sortedEntries.findIndex(e => e.id === entry.id);
  if (currentIndex < sortedEntries.length - 1) {
    return sortedEntries[currentIndex + 1].entryDate;
  }
  
  // If no next entry, use current date
  return new Date().toISOString().split('T')[0];
};

export const groupTravelsByJourney = (travels: TravelEntry[]): Journey[] => {
  const journeys: Journey[] = [];
  let currentJourney: TravelEntry[] = [];
  const sortedTravels = [...travels].sort((a, b) => 
    new Date(a.entryDate).getTime() - new Date(b.entryDate).getTime()
  );
  
  sortedTravels.forEach((travel) => {
    currentJourney.push(travel);
    
    if (travel.isHome) {
      if (currentJourney.length > 0) {
        journeys.push({
          id: `journey-${journeys.length + 1}`,
          trips: [...currentJourney],
          startDate: currentJourney[0].entryDate,
          endDate: getEffectiveExitDate(currentJourney[currentJourney.length - 1], sortedTravels)
        });
      }
      currentJourney = [];
    }
  });

  // Add remaining trips if journey doesn't end at home
  if (currentJourney.length > 0) {
    journeys.push({
      id: `journey-${journeys.length + 1}`,
      trips: [...currentJourney],
      startDate: currentJourney[0].entryDate,
      endDate: getEffectiveExitDate(currentJourney[currentJourney.length - 1], sortedTravels)
    });
  }

  return journeys;
};