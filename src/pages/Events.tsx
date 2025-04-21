
import { Calendar, MapPin, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

import { useEvents } from '../context/EventContext';

export function Events() {
  // Get events from context instead of using static data
  const { events } = useEvents();

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
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
          ))}
        </div>
      </div>
    </div>
  );
}