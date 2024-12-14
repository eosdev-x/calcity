import React, { useState } from 'react';
import { MapPin, X } from 'lucide-react';
import { Attraction } from '../types';

interface AttractionCardProps {
  attraction: Attraction;
}

export const AttractionCard: React.FC<AttractionCardProps> = ({ attraction }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <div 
        className="bg-white rounded-lg shadow-md overflow-hidden h-[400px] cursor-pointer transition-all duration-300 hover:scale-[1.02] relative"
        onClick={() => setIsExpanded(true)}
      >
        <img
          src={attraction.imageUrl}
          alt={attraction.name}
          className="w-full h-48 object-cover"
        />
        <div className="p-4 h-[calc(100%-12rem)] flex flex-col">
          <h3 className="text-xl font-semibold mb-2">{attraction.name}</h3>
          <p className="text-gray-600 mb-4 line-clamp-3 overflow-hidden">{attraction.description}</p>
          <div className="flex items-center text-gray-500 mt-auto">
            <MapPin className="w-4 h-4 mr-2" />
            <span className="text-sm">{attraction.location}</span>
          </div>
        </div>
      </div>

      {/* Detailed View Overlay */}
      {isExpanded && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-overlay-fade-in">
          <div 
            className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsExpanded(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={attraction.imageUrl}
              alt={attraction.name}
              className="w-full h-64 object-cover"
            />
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">{attraction.name}</h2>
              <p className="text-gray-600 mb-6">{attraction.description}</p>
              <div className="flex items-center text-gray-500">
                <MapPin className="w-5 h-5 mr-2" />
                <span>{attraction.location}</span>
              </div>
              {attraction.website && (
                <a
                  href={attraction.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block text-blue-600 hover:underline"
                >
                  Visit Website
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};