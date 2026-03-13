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
import { useEvents } from '../context/EventContext';

export function EventDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const { events, loading } = useEvents();

  const event = useMemo(() => {
    return events.find(e => e.id === id) || null;
  }, [events, id]);

  if (loading) return null;

  if (!event) {
    navigate('/events');
    return null;
  }

  const capacity = Math.max(50, event.view_count + 100);
  const registeredCount = Math.min(event.view_count, capacity);
  const registrationProgress = capacity > 0 ? (registeredCount / capacity) * 100 : 0;

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
    if (event.ticket_url) {
      window.open(event.ticket_url, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-surface py-12">
      <div className="container mx-auto px-4">
        {/* Navigation */}
        <button
          onClick={() => navigate('/events')}
          className="flex items-center text-on-surface-variant hover:text-primary mb-6 transition-colors duration-[var(--md-sys-motion-duration-short3)]"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Events
        </button>

        {/* Hero Image */}
        <div className="relative h-[400px] rounded-xl overflow-hidden mb-8">
          <img
            src={event.image || ''}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-scrim/70 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="flex items-center justify-between">
              <h1 className="text-4xl font-display font-bold text-inverse-on-surface mb-2">
                {event.title}
              </h1>
              <div className="flex gap-4">
                <button
                  onClick={handleShare}
                  className="p-2 rounded-full bg-scrim/20 hover:bg-scrim/30 text-inverse-on-surface transition-colors duration-[var(--md-sys-motion-duration-short3)]"
                  aria-label="Share event"
                >
                  <Share2 className="w-5 h-5" />
                </button>
                <button
                  onClick={handleBookmark}
                  className={`p-2 rounded-full transition-colors duration-[var(--md-sys-motion-duration-short3)] ${
                    isBookmarked 
                      ? 'bg-primary text-on-primary' 
                      : 'bg-scrim/20 hover:bg-scrim/30 text-inverse-on-surface'
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
              <p className="text-on-surface-variant whitespace-pre-line">
                {event.description}
              </p>
            </div>

            <div className="card">
              <h2 className="text-2xl font-semibold mb-4">Event Details</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Calendar className="w-5 h-5 text-on-surface-variant mr-3 mt-1" />
                  <div>
                    <h3 className="font-semibold">Date</h3>
                    <p className="text-on-surface-variant">
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
                  <Clock className="w-5 h-5 text-on-surface-variant mr-3 mt-1" />
                  <div>
                    <h3 className="font-semibold">Time</h3>
                    <p className="text-on-surface-variant">{event.time}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-on-surface-variant mr-3 mt-1" />
                  <div>
                    <h3 className="font-semibold">Location</h3>
                    <p className="text-on-surface-variant">{event.location}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Tag className="w-5 h-5 text-on-surface-variant mr-3 mt-1" />
                  <div>
                    <h3 className="font-semibold">Category & Tags</h3>
                    <p className="text-on-surface-variant mb-2">{event.category}</p>
                    <div className="flex flex-wrap gap-2">
                      {event.tags.map(tag => (
                        <span 
                          key={tag}
                          className="px-3 py-1 bg-secondary-container text-on-secondary-container rounded-lg text-sm"
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
                  <Users className="w-5 h-5 text-on-surface-variant mr-2" />
                  <span className="text-on-surface-variant">
                    {registeredCount} / {capacity} registered
                  </span>
                </div>
              </div>
              <div className="w-full bg-surface-container rounded-full h-2 mb-6">
                <div 
                  className="bg-primary h-2 rounded-full"
                  style={{ width: `${registrationProgress}%` }}
                />
              </div>
              <button
                onClick={handleRegister}
                className="btn-primary w-full mb-4"
                disabled={!event.ticket_url}
              >
                Register Now
              </button>
            </div>

            {/* Organizer Card */}
            <div className="card">
              <h3 className="text-xl font-semibold mb-4">Event Organizer</h3>
              <p className="text-on-surface font-medium mb-4">
                {event.organizer_name}
              </p>
              <div className="space-y-3">
                <a 
                  href={`mailto:${event.organizer_email}`}
                  className="flex items-center text-on-surface-variant hover:text-primary transition-colors duration-[var(--md-sys-motion-duration-short3)]"
                >
                  <Mail className="w-5 h-5 mr-2" />
                  {event.organizer_email}
                </a>
                {event.organizer_phone && (
                  <a 
                    href={`tel:${event.organizer_phone}`}
                    className="flex items-center text-on-surface-variant hover:text-primary transition-colors duration-[var(--md-sys-motion-duration-short3)]"
                  >
                    <Phone className="w-5 h-5 mr-2" />
                    {event.organizer_phone}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
