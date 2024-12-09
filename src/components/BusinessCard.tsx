import React from 'react';
import { Phone, Globe, MapPin } from 'lucide-react';
import { Business } from '../types';

interface BusinessCardProps {
  business: Business;
}

export const BusinessCard: React.FC<BusinessCardProps> = ({ business }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {business.imageUrl && (
        <img
          src={business.imageUrl}
          alt={business.name}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-4">
        <div className="mb-4">
          <h3 className="text-xl font-semibold">{business.name}</h3>
          <span className="text-sm text-gray-500">{business.category}</span>
        </div>
        <p className="text-gray-600 mb-4">{business.description}</p>
        <div className="space-y-2">
          <div className="flex items-center text-gray-500">
            <MapPin className="w-4 h-4 mr-2" />
            <span className="text-sm">{business.address}</span>
          </div>
          <div className="flex items-center text-gray-500">
            <Phone className="w-4 h-4 mr-2" />
            <span className="text-sm">{business.phone}</span>
          </div>
          {business.website && (
            <div className="flex items-center text-blue-500">
              <Globe className="w-4 h-4 mr-2" />
              <a
                href={business.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm hover:underline"
              >
                Visit Website
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};