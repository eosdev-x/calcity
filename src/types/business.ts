export interface Business {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  category: string;
  address: string;
  city: string;
  state: string;
  zip: string | null;
  phone: string;
  email: string | null;
  hours: Record<string, string>;
  image: string | null;
  description: string | null;
  website: string | null;
  social_media: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
  };
  gallery: { url: string; alt: string; storagePath?: string }[];
  amenities: string[];
  services: string[];
  subscription_tier: "free" | "basic" | "premium" | "spotlight";
  is_hiring: boolean;
  is_featured: boolean;
  is_spotlight: boolean;
  review_count: number;
  view_count: number;
  status: "pending" | "active" | "rejected" | "suspended" | "archived";
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
}

export interface Job {
  id: string;
  business_id: string;
  owner_id: string;
  title: string;
  description: string | null;
  job_type: 'full-time' | 'part-time' | 'seasonal' | 'contract';
  apply_url: string | null;
  created_at: string;
  updated_at: string;
  expires_at: string;
}
