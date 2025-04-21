export interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  image: string;
  category: string;
  tags: string[];
  organizer: {
    name: string;
    email: string;
    phone: string;
  };
  registrationUrl?: string;
  capacity?: number;
  registeredCount?: number;
}