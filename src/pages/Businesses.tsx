import React from 'react';
import { BusinessCard } from '../components/BusinessCard';
import { businesses } from '../data/businesses';

export const Businesses: React.FC = () => {
  return (
    <div>
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-8 text-gray-900 dark:text-white fade-in">
            Local Businesses
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {businesses.map((business, index) => (
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
    </div>
  );
};
