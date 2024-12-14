import React, { useState } from 'react';
import { MapPin, X, Clock, Ticket, Star, Activity } from 'lucide-react';
import { Attraction } from '../types';

interface AttractionCardProps {
  attraction: Attraction;
}

export const AttractionCard: React.FC<AttractionCardProps> = ({ attraction }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'recreation': return 'bg-green-100 text-green-800';
      case 'aerospace': return 'bg-blue-100 text-blue-800';
      case 'nature': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <div 
        className="bg-white rounded-lg shadow-lg overflow-hidden h-[400px] cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl relative group"
        onClick={() => setIsExpanded(true)}
      >
        <div className="relative">
          <img
            src={attraction.imageUrl}
            alt={attraction.name}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(attraction.type)}`}>
            {attraction.type.charAt(0).toUpperCase() + attraction.type.slice(1)}
          </span>
        </div>
        <div className="p-4 h-[calc(100%-12rem)] flex flex-col">
          <h3 className="text-xl font-semibold mb-2 text-gray-900">{attraction.name}</h3>
          <p className="text-gray-600 mb-4 line-clamp-3 overflow-hidden">{attraction.description}</p>
          <div className="flex items-center justify-between text-gray-500 mt-auto">
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              <span className="text-sm">{attraction.location}</span>
            </div>
            {attraction.rating && (
              <div className="flex items-center">
                <Star className="w-4 h-4 mr-1 text-yellow-500 fill-current" />
                <span className="text-sm font-medium">{attraction.rating}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Detailed View Overlay */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-overlay-fade-in"
          onClick={() => setIsExpanded(false)}
        >
          <div 
            className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto relative animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsExpanded(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="relative">
              <img
                src={attraction.imageUrl}
                alt={attraction.name}
                className="w-full h-80 object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
                <h2 className="text-3xl font-bold text-white mb-2">{attraction.name}</h2>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(attraction.type)}`}>
                  {attraction.type.charAt(0).toUpperCase() + attraction.type.slice(1)}
                </span>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-700 text-lg mb-6">{attraction.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {attraction.details?.hours && (
                  <div className="flex items-start">
                    <Clock className="w-5 h-5 mr-3 text-gray-500 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Hours</h4>
                      <p className="text-gray-600">{attraction.details.hours}</p>
                    </div>
                  </div>
                )}
                {attraction.details?.admission && (
                  <div className="flex items-start">
                    <Ticket className="w-5 h-5 mr-3 text-gray-500 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Admission</h4>
                      <p className="text-gray-600">{attraction.details.admission}</p>
                    </div>
                  </div>
                )}
              </div>

              {attraction.details?.activities && (
                <div className="mb-6">
                  <div className="flex items-center mb-3">
                    <Activity className="w-5 h-5 mr-2 text-gray-500" />
                    <h4 className="font-semibold text-gray-900">Activities</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {attraction.details.activities.map((activity, index) => (
                      <span 
                        key={index}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                      >
                        {activity}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center text-gray-500">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span>{attraction.location}</span>
                </div>
                {attraction.rating && (
                  <div className="flex items-center">
                    <Star className="w-5 h-5 mr-1 text-yellow-500 fill-current" />
                    <span className="font-medium">{attraction.rating}</span>
                    {attraction.reviews && (
                      <span className="text-gray-500 ml-1">({attraction.reviews} reviews)</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};