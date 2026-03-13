import React from 'react';
import { Link } from 'react-router-dom';
import { List, ArrowLeft } from 'lucide-react';
import { EventCalendar } from '../components/EventCalendar';
import { useEvents } from '../context/EventContext';
import { siteConfig } from '../config/site';

export function EventCalendarView() {
  const { events, loading } = useEvents();

  if (loading) {
    return null;
  }

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
            Browse upcoming events in {siteConfig.city} by date
          </p>
        </div>
        
        {/* Calendar View */}
        <EventCalendar events={events} />
      </div>
    </div>
  );
}
