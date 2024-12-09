import React from 'react';
import { Hero } from '../components/Hero';
import { AttractionCard } from '../components/AttractionCard';
import { EventCard } from '../components/EventCard';
import { BusinessCard } from '../components/BusinessCard';
import { attractions } from '../data/attractions';
import { events } from '../data/events';
import { businesses } from '../data/businesses';

export const Home: React.FC = () => {
  // Get only the first 3 businesses for the featured section
  const featuredBusinesses = businesses.slice(0, 3);

  return (
    <div>
      <Hero />

      {/* Attractions Section */}
      <section id="attractions" className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white fade-in">
            Discover Our Attractions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {attractions.map((attraction, index) => (
              <div
                key={attraction.id}
                className="fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <AttractionCard attraction={attraction} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section id="events" className="py-16 bg-white dark:bg-gray-800 transition-colors duration-200">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white fade-in">
            Upcoming Events
          </h2>
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

      {/* Featured Businesses Section */}
      <section id="featured-businesses" className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white fade-in">
            Featured Local Businesses
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredBusinesses.map((business, index) => (
              <div
                key={business.id}
                className="fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <BusinessCard business={business} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-white dark:bg-gray-800 transition-colors duration-200">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white fade-in">
            Contact Us
          </h2>
          <div className="max-w-xl mx-auto">
            <div className="bg-gray-100 dark:bg-gray-700 p-8 rounded-lg transition-colors duration-200">
              <p className="text-center mb-6 text-gray-800 dark:text-gray-200">
                Have questions about California City? We're here to help!
              </p>
              <div className="space-y-4 text-center text-gray-800 dark:text-gray-200">
                <p>City Hall: (760) 373-8661</p>
                <p>21000 Hacienda Blvd</p>
                <p>California City, CA 93505</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
