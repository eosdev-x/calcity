import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Event } from '../types/event';

// Initial events data
const initialEvents: Event[] = [
  {
    id: 1,
    title: "Desert Arts Festival",
    date: "2025-04-15",
    time: "10:00 AM - 6:00 PM",
    location: "Central Park",
    description: "Annual arts and crafts festival featuring local artists",
    image: "https://images.unsplash.com/photo-1603228254119-e6a4d095dc59?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8YXJ0JTIwZmVzdGl2YWx8ZW58MHx8MHx8fDA%3D",
    category: "Arts & Culture",
    tags: ["art", "festival", "family-friendly"],
    organizer: {
      name: "California City Arts Council",
      email: "arts@calcity.org",
      phone: "(555) 123-4567"
    }
  },
  {
    id: 2,
    title: "Community Cleanup Day",
    date: "2025-04-22",
    time: "8:00 AM - 12:00 PM",
    location: "City Hall",
    description: "Join us in keeping our desert community beautiful",
    image: "https://plus.unsplash.com/premium_photo-1681152760811-5f0f6e0b7f0a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y29tbXVuaXR5JTIwY2xlYW4lMjB1cHxlbnwwfHwwfHx8MA%3D%3D",
    category: "Community",
    tags: ["volunteer", "environment"],
    organizer: {
      name: "City Hall",
      email: "community@calcity.org",
      phone: "(555) 234-5678"
    }
  },
  {
    id: 3,
    title: "Stargazing Night",
    date: "2025-05-15",
    time: "8:00 PM - 11:00 PM",
    location: "Desert Observatory",
    description: "Experience the beauty of the desert night sky with professional astronomers",
    image: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a",
    category: "Science & Nature",
    tags: ["astronomy", "education", "night-event"],
    organizer: {
      name: "Desert Astronomy Club",
      email: "stars@calcity.org",
      phone: "(555) 345-6789"
    }
  },
  {
    id: 4,
    title: "Desert Food Truck Festival",
    date: "2025-05-01",
    time: "11:00 AM - 8:00 PM",
    location: "Central Park",
    description: "A gathering of the region's best food trucks featuring local and international cuisine",
    image: "https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb",
    category: "Food & Drink",
    tags: ["food", "festival", "family-friendly"],
    organizer: {
      name: "CalCity Food Collective",
      email: "food@calcity.org",
      phone: "(555) 456-7890"
    }
  },
  {
    id: 5,
    title: "Desert Adventure Race",
    date: "2025-05-08",
    time: "6:00 AM - 2:00 PM",
    location: "Galileo Hill Park",
    description: "Challenge yourself in this exciting desert terrain race featuring multiple categories",
    image: "https://images.unsplash.com/photo-1721327473745-f70f87ba675e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8ZGVzZXJ0JTIwcmFjZXxlbnwwfHwwfHx8MA%3D%3D",
    category: "Sports",
    tags: ["race", "outdoor", "fitness"],
    organizer: {
      name: "CalCity Sports Association",
      email: "sports@calcity.org",
      phone: "(555) 567-8901"
    }
  },
  {
    id: 6,
    title: "Desert Wildlife Photography Workshop",
    date: "2025-05-20",
    time: "9:00 AM - 4:00 PM",
    location: "Desert Tortoise Natural Area",
    description: "Learn wildlife photography techniques while exploring local desert fauna",
    image: "https://images.unsplash.com/photo-1469827160215-9d29e96e72f4",
    category: "Education",
    tags: ["photography", "wildlife", "workshop"],
    organizer: {
      name: "Desert Photography Society",
      email: "photo@calcity.org",
      phone: "(555) 678-9012"
    }
  }
];

interface EventContextType {
  events: Event[];
  addEvent: (event: Event) => void;
  getEventById: (id: number) => Event | undefined;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export function useEvents() {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
}

interface EventProviderProps {
  children: ReactNode;
}

export function EventProvider({ children }: EventProviderProps) {
  const [events, setEvents] = useState<Event[]>(initialEvents);

  // Load events from localStorage on mount
  useEffect(() => {
    const storedEvents = localStorage.getItem('events');
    if (storedEvents) {
      try {
        setEvents(JSON.parse(storedEvents));
      } catch (error) {
        console.error('Failed to parse stored events:', error);
      }
    }
  }, []);

  // Save events to localStorage when they change
  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
  }, [events]);

  // Add a new event to the list
  const addEvent = (event: Event) => {
    setEvents(prevEvents => [...prevEvents, event]);
  };

  // Get an event by ID
  const getEventById = (id: number) => {
    return events.find(event => event.id === id);
  };

  return (
    <EventContext.Provider value={{ events, addEvent, getEventById }}>
      {children}
    </EventContext.Provider>
  );
}
