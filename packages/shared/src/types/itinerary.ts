export interface Itinerary {
  destination: string;
  days: number;
  budget: number;
  activities: Activity[];
}

export interface Activity {
  name: string;
  description: string;
  cost: number;
  duration: number;
  location: Location;
}

export interface Location {
  name: string;
  coordinates: {
    lat: number;
    lng: number;
  };
} 