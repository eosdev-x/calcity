import React from 'react';
import { MapPin } from 'lucide-react';
import { Attraction } from '../types';

interface AttractionCardProps {
  attraction: Attraction;
}

export const AttractionCard: React.FC<AttractionCardProps> = ({ attraction }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img
        src={attraction.imageUrl}
        alt={attraction.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{attraction.name}</h3>
        <p className="text-gray-600 mb-4">{attraction.description}</p>
        <div className="flex items-center text-gray-500">
          <MapPin className="w-4 h-4 mr-2" />
          <span className="text-sm">{attraction.location}</span>
        </div>
      </div>
    </div>
  );
};