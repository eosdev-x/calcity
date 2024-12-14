import React from 'react';
import { AttractionCard } from '../components/AttractionCard';
import { attractions } from '../data/attractions';

export const Attractions: React.FC = () => {
  return (
    <div className="pt-16">
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-8 text-gray-900 dark:text-white fade-in">
            Local Attractions
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-center max-w-2xl mx-auto mb-12 fade-in">
            Discover the unique attractions that make California City special, from our vast desert landscapes to our rich aerospace heritage.
          </p>
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
    </div>
  );
};

export default Attractions;
