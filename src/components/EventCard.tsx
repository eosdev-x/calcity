import React from 'react';
import { Calendar, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { Event } from '../types';

interface EventCardProps {
  event: Event;
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {event.imageUrl && (
        <img
          src={event.imageUrl}
          alt={event.title}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-4">
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
        <p className="text-gray-600">{event.description}</p>
      </div>
    </div>
  );
};