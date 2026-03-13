
import { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Search, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useEvents } from '../context/EventContext';
import { Event } from '../types/event';

export function Events() {
  const location = useLocation();
  const { events } = useEvents();
  
  // State for search functionality
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  
  // Parse search parameters from URL when component mounts or URL changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search');
    if (searchParam) {
      setSearchTerm(searchParam);
    }
  }, [location.search]);
  
  // Filter events based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredEvents(events);
      return;
    }
    
    const query = searchTerm.toLowerCase().trim();
    const filtered = events.filter(event => 
      event.title.toLowerCase().includes(query) || 
      event.description.toLowerCase().includes(query) || 
      event.category.toLowerCase().includes(query) ||
      event.tags.some(tag => tag.toLowerCase().includes(query))
    );
    
    setFilteredEvents(filtered);
  }, [events, searchTerm]);

  return (
    <div className="min-h-screen bg-surface py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-display font-bold text-on-surface">
            Upcoming Events
          </h1>
          <div className="flex items-center space-x-4">
            <Link 
              to="/events/calendar" 
              className="flex items-center px-3 py-2 rounded-xl bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-colors duration-[var(--md-sys-motion-duration-short3)]"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Calendar View
            </Link>
            <Link to="/events/new" className="btn-primary">
              Submit Event
            </Link>
          </div>
        </div>
        
        {/* Search bar */}
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search events by name, category, or tags..."
              className="w-full pl-10 pr-10 py-2 rounded-xl border border-outline bg-surface-container-high text-on-surface  
                        focus:ring-primary focus:border-primary"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors duration-[var(--md-sys-motion-duration-short3)]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
        
        {/* Results count */}
        {searchTerm && (
          <div className="mb-4 text-on-surface-variant">
            Found {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''} matching "{searchTerm}"
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.length > 0 ? filteredEvents.map((event) => (
            <div key={event.id} className="card hover:shadow-md transition-shadow duration-[var(--md-sys-motion-duration-medium2)]">
              <Link to={`/events/${event.id}`}>
                <img
                  src={event.image || ''}
                  alt={event.title}
                  className="w-full h-48 object-cover rounded-t-xl mb-4 hover:opacity-90 transition-opacity duration-[var(--md-sys-motion-duration-short3)]"
                />
              </Link>
              <Link to={`/events/${event.id}`}>
                <h3 className="text-xl font-semibold mb-2 hover:text-primary transition-colors duration-[var(--md-sys-motion-duration-short3)]">{event.title}</h3>
              </Link>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2 text-on-surface-variant">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(event.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-2 text-on-surface-variant">
                  <Clock className="w-4 h-4" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center space-x-2 text-on-surface-variant">
                  <MapPin className="w-4 h-4" />
                  <span>{event.location}</span>
                </div>
              </div>

              <p className="text-on-surface-variant mb-4">
                {event.description}
              </p>

              <Link 
                to={`/events/${event.id}`}
                className="btn-primary w-full block text-center"
              >
                Learn More
              </Link>
            </div>
          )) : (
            <div className="col-span-3 text-center py-12">
              <p className="text-xl text-on-surface-variant">
                No events found matching your search criteria.
              </p>
              {searchTerm && (
                <button 
                  className="mt-4 btn-secondary"
                  onClick={() => setSearchTerm('')}
                >
                  Clear Search
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
