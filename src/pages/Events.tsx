
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
    <div className="min-h-screen bg-desert-50 dark:bg-night-desert-50 py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-display font-bold text-desert-800 dark:text-desert-100">
            Upcoming Events
          </h1>
          <div className="flex items-center space-x-4">
            <Link 
              to="/events/calendar" 
              className="flex items-center px-3 py-2 rounded-md bg-desert-100 dark:bg-night-desert-300 text-desert-700 dark:text-desert-300 hover:bg-desert-200 dark:hover:bg-night-desert-400 transition-colors"
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
              className="w-full pl-10 pr-10 py-2 rounded-md border border-desert-300 dark:border-night-desert-300 
                        bg-white dark:bg-night-desert-200 text-desert-800 dark:text-desert-100 
                        focus:ring-desert-500 focus:border-desert-500"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-desert-400" />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-desert-400 hover:text-desert-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
        
        {/* Results count */}
        {searchTerm && (
          <div className="mb-4 text-desert-700 dark:text-desert-300">
            Found {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''} matching "{searchTerm}"
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.length > 0 ? filteredEvents.map((event) => (
            <div key={event.id} className="card">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-48 object-cover rounded-t-lg mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2 text-desert-700 dark:text-desert-300">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(event.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-2 text-desert-700 dark:text-desert-300">
                  <Clock className="w-4 h-4" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center space-x-2 text-desert-700 dark:text-desert-300">
                  <MapPin className="w-4 h-4" />
                  <span>{event.location}</span>
                </div>
              </div>

              <p className="text-desert-700 dark:text-desert-300 mb-4">
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
              <p className="text-xl text-desert-600 dark:text-desert-400">
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