import React, { useState } from 'react';
import { Calendar, MapPin, X } from 'lucide-react';
import { format } from 'date-fns';
import { Event } from '../types';

interface EventCardProps {
  event: Event;
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <div 
        className="bg-white rounded-lg shadow-md overflow-hidden h-[400px] cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02]"
        onClick={() => setIsExpanded(true)}
      >
        {event.imageUrl && (
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-48 object-cover"
          />
        )}
        <div className="p-4 h-[calc(100%-12rem)] flex flex-col">
          <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
          <div className="flex items-center text-gray-500 mb-2">
            <Calendar className="w-4 h-4 mr-2" />
            <span className="text-sm">
              {format(event.date, 'MMMM d, yyyy')}
            </span>
          </div>
          <div className="flex items-center text-gray-500 mb-4">
            <MapPin className="w-4 h-4 mr-2" />
            <span className="text-sm">{event.location}</span>
          </div>
          <p className="text-gray-600 line-clamp-3 overflow-hidden">{event.description}</p>
        </div>
      </div>

      {/* Detailed View Overlay */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => setIsExpanded(false)}
          style={{
            animation: 'fadeIn 0.3s ease-in-out'
          }}
        >
          <div 
            className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
            style={{
              animation: 'fadeIn 0.3s ease-in-out'
            }}
          >
            <button
              onClick={() => setIsExpanded(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            {event.imageUrl && (
              <img
                src={event.imageUrl}
                alt={event.title}
                className="w-full h-64 object-cover"
              />
            )}
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">{event.title}</h2>
              <div className="flex items-center text-gray-500 mb-4">
                <Calendar className="w-5 h-5 mr-2" />
                <span className="text-lg">
                  {format(event.date, 'MMMM d, yyyy')}
                </span>
              </div>
              <div className="flex items-center text-gray-500 mb-6">
                <MapPin className="w-5 h-5 mr-2" />
                <span className="text-lg">{event.location}</span>
              </div>
              <p className="text-gray-600 text-lg leading-relaxed">{event.description}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};