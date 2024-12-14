export interface Event {
  id: string;
  title: string;
  date: Date;
  description: string;
  location: string;
  imageUrl?: string;
}

export interface Business {
  id: string;
  name: string;
  category: string;
  description: string;
  address: string;
  phone: string;
  website?: string;
  imageUrl?: string;
}

export interface Attraction {
  id: string;
  name: string;
  description: string;
  location: string;
  imageUrl: string;
  type: 'nature' | 'aerospace' | 'recreation' | 'historical';
  website?: string;
}