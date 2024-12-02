export interface TravelEntry {
  id: string;
  country: string;
  city: string;
  entryDate: string;
  exitDate?: string;
  isHome?: boolean;
  flagCode: string;
}

export const travelData: TravelEntry[] = [
  {
    id: "1",
    country: "United States",
    city: "New York",
    entryDate: "2023-01-15",
    flagCode: "us"
  },
  {
    id: "2",
    country: "Japan",
    city: "Tokyo",
    entryDate: "2023-02-02",
    flagCode: "jp"
  },
  {
    id: "3",
    country: "Singapore",
    city: "Singapore",
    entryDate: "2023-02-16",
    isHome: true,
    flagCode: "sg"
  },
  {
    id: "4",
    country: "France",
    city: "Paris",
    entryDate: "2023-05-01",
    flagCode: "fr"
  },
  {
    id: "5",
    country: "Singapore",
    city: "Singapore",
    entryDate: "2023-05-16",
    isHome: true,
    flagCode: "sg"
  }
];