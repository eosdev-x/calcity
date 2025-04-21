export interface Business {
  id: number;
  name: string;
  category: string;
  rating: number;
  address: string;
  phone: string;
  website: string;
  image: string;
  description: string;
  hours: {
    [key: string]: string;
  };
  amenities: string[];
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
  };
  gallery?: {
    url: string;
    alt: string;
  }[];
}