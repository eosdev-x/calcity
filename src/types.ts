export interface Attraction {
  id: string;
  name: string;
  description: string;
  location: string;
  imageUrl: string;
  type: 'recreation' | 'aerospace' | 'nature';
  details?: {
    hours?: string;
    admission?: string;
    amenities?: string[];
    activities?: string[];
  };
  rating?: number;
  reviews?: number;
}
