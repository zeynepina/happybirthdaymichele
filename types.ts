
export enum TabType {
  OVERVIEW = 'overview',
  PLANNER = 'planner',
  EXPERIENCES = 'experiences',
  GUIDE = 'guide'
}

export interface ItineraryDay {
  day: number;
  title: string;
  activities: {
    time: string;
    description: string;
    location: string;
  }[];
}

export interface Experience {
  id: string;
  title: string;
  description: string;
  notes?: string;
  imageUrl?: string;
  category: 'Auto' | 'Food' | 'History';
}
