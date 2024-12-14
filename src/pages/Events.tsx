import React from 'react';
import { EventCard } from '../components/EventCard';
import { events } from '../data/events';

export const Events: React.FC = () => {
  return (
    <div className="pt-16">
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-8 text-gray-900 dark:text-white fade-in">
            Upcoming Events
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-center max-w-2xl mx-auto mb-12 fade-in">
            Stay updated with the latest events happening in California City. From stargazing nights to community gatherings, there's always something exciting happening.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {events.map((event, index) => (
              <div
                key={event.id}
                className="fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <EventCard event={event} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Events;
