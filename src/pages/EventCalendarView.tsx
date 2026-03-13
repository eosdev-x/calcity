import React from 'react';
import { Link } from 'react-router-dom';
import { List, ArrowLeft } from 'lucide-react';
import { EventCalendar } from '../components/EventCalendar';
import { Event } from '../types/event';

// This would typically come from a central data store or API
const events: Event[] = [
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

export function EventCalendarView() {
  return (
    <div className="min-h-screen bg-surface py-12">
      <div className="container mx-auto px-4">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/events"
            className="flex items-center text-on-surface-variant hover:text-primary transition-colors duration-[var(--md-sys-motion-duration-short3)]"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Events
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link
              to="/events"
              className="flex items-center px-3 py-2 rounded-xl bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-colors duration-[var(--md-sys-motion-duration-short3)]"
            >
              <List className="w-4 h-4 mr-2" />
              List View
            </Link>
            <Link
              to="/events/new"
              className="btn-primary"
            >
              Submit Event
            </Link>
          </div>
        </div>
        
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-display font-bold text-on-surface mb-2">
            Event Calendar
          </h1>
          <p className="text-on-surface-variant">
            Browse upcoming events in California City by date
          </p>
        </div>
        
        {/* Calendar View */}
        <EventCalendar events={events} />
      </div>
    </div>
  );
}
