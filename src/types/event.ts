export interface Event {
  id: string;
  organizer_id: string;
  business_id: string | null;
  title: string;
  slug: string;
  description: string;
  category: string;
  tags: string[];
  date: string;
  end_date: string | null;
  time: string;
  end_time: string | null;
  location: string;
  address: string | null;
  image: string | null;
  ticket_url: string | null;
  price: string | null;
  is_promoted: boolean;
  is_featured: boolean;
  organizer_name: string;
  organizer_email: string;
  organizer_phone: string | null;
  status: "pending" | "approved" | "rejected" | "cancelled";
  view_count: number;
  created_at: string;
  updated_at: string;
}
