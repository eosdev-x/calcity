import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Share2, 
  Bookmark, 
  Tag, 
  Mail, 
  Phone,
  ArrowLeft,
  Users
} from 'lucide-react';
import { Event } from '../types/event';

// This would typically come from a central data store or API
const events: Event[] = [
  {
    id: 1,
    title: "Desert Arts Festival",
    date: "2024-04-15",
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
    date: "2024-04-22",
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
    date: "2024-05-15",
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
    date: "2024-05-01",
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
    date: "2024-05-08",
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
    date: "2024-05-20",
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

export function EventDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isBookmarked, setIsBookmarked] = useState(false);

  const event = useMemo(() => {
    const foundEvent = events.find(e => e.id === Number(id));
    if (!foundEvent) {
      navigate('/events');
      return null;
    }
    return {
      ...foundEvent,
      capacity: 500,
      registeredCount: Math.floor(Math.random() * 300) + 100, // Mock data
      registrationUrl: `https://example.com/register/${foundEvent.id}`
    };
  }, [id, navigate]);

  if (!event) return null;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: event.description,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // In a real app, this would save to a backend or local storage
  };

  const handleRegister = () => {
    window.open(event.registrationUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-desert-50 dark:bg-night-desert-50 py-12">
      <div className="container mx-auto px-4">
        {/* Navigation */}
        <button
          onClick={() => navigate('/events')}
          className="flex items-center text-desert-600 dark:text-desert-400 hover:text-desert-800 dark:hover:text-desert-200 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Events
        </button>

        {/* Hero Image */}
        <div className="relative h-[400px] rounded-xl overflow-hidden mb-8">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-desert-900/70 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="flex items-center justify-between">
              <h1 className="text-4xl font-display font-bold text-white mb-2">
                {event.title}
              </h1>
              <div className="flex gap-4">
                <button
                  onClick={handleShare}
                  className="p-2 rounded-full bg-desert-100/20 hover:bg-desert-100/30 text-white transition-colors"
                  aria-label="Share event"
                >
                  <Share2 className="w-5 h-5" />
                </button>
                <button
                  onClick={handleBookmark}
                  className={`p-2 rounded-full transition-colors ${
                    isBookmarked 
                      ? 'bg-desert-400 text-white' 
                      : 'bg-desert-100/20 hover:bg-desert-100/30 text-white'
                  }`}
                  aria-label="Bookmark event"
                >
                  <Bookmark className="w-5 h-5" fill={isBookmarked ? 'currentColor' : 'none'} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="card mb-8">
              <h2 className="text-2xl font-semibold mb-4">About This Event</h2>
              <p className="text-desert-700 dark:text-desert-300 whitespace-pre-line">
                {event.description}
              </p>
            </div>

            <div className="card">
              <h2 className="text-2xl font-semibold mb-4">Event Details</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Calendar className="w-5 h-5 text-desert-400 mr-3 mt-1" />
                  <div>
                    <h3 className="font-semibold">Date</h3>
                    <p className="text-desert-700 dark:text-desert-300">
                      {new Date(event.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Clock className="w-5 h-5 text-desert-400 mr-3 mt-1" />
                  <div>
                    <h3 className="font-semibold">Time</h3>
                    <p className="text-desert-700 dark:text-desert-300">{event.time}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-desert-400 mr-3 mt-1" />
                  <div>
                    <h3 className="font-semibold">Location</h3>
                    <p className="text-desert-700 dark:text-desert-300">{event.location}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Tag className="w-5 h-5 text-desert-400 mr-3 mt-1" />
                  <div>
                    <h3 className="font-semibold">Category & Tags</h3>
                    <p className="text-desert-700 dark:text-desert-300 mb-2">{event.category}</p>
                    <div className="flex flex-wrap gap-2">
                      {event.tags.map(tag => (
                        <span 
                          key={tag}
                          className="px-3 py-1 bg-desert-100 dark:bg-night-desert-400 
                                   text-desert-700 dark:text-desert-300 rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Registration Card */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Users className="w-5 h-5 text-desert-400 mr-2" />
                  <span className="text-desert-700 dark:text-desert-300">
                    {event.registeredCount} / {event.capacity} registered
                  </span>
                </div>
              </div>
              <div className="w-full bg-desert-100 dark:bg-night-desert-400 rounded-full h-2 mb-6">
                <div 
                  className="bg-desert-400 h-2 rounded-full"
                  style={{ width: `${(event.registeredCount! / event.capacity!) * 100}%` }}
                />
              </div>
              <button
                onClick={handleRegister}
                className="btn-primary w-full mb-4"
              >
                Register Now
              </button>
            </div>

            {/* Organizer Card */}
            <div className="card">
              <h3 className="text-xl font-semibold mb-4">Event Organizer</h3>
              <p className="text-desert-800 dark:text-desert-100 font-medium mb-4">
                {event.organizer.name}
              </p>
              <div className="space-y-3">
                <a 
                  href={`mailto:${event.organizer.email}`}
                  className="flex items-center text-desert-700 dark:text-desert-300 hover:text-desert-500"
                >
                  <Mail className="w-5 h-5 mr-2" />
                  {event.organizer.email}
                </a>
                <a 
                  href={`tel:${event.organizer.phone}`}
                  className="flex items-center text-desert-700 dark:text-desert-300 hover:text-desert-500"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  {event.organizer.phone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}