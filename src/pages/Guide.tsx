import React from 'react';
import { MapPin, Info, Calendar, Compass, Sun, Car } from 'lucide-react';
import { WeatherWidget } from '../components/WeatherWidget';

export function Guide() {
  const sections = [
    {
      title: "Getting Here",
      icon: Car,
      content: "California City is easily accessible via Highway 14 and Highway 58. The nearest major airports are Mojave Air & Space Port (30 minutes) and Los Angeles International Airport (LAX, 2 hours)."
    },
    {
      title: "Best Time to Visit",
      icon: Sun,
      content: "Spring (March-May) and Fall (September-November) offer the most pleasant temperatures. Summer can be very hot, while winter nights can be quite cold. Always bring sun protection and plenty of water."
    },
    {
      title: "Must-See Attractions",
      icon: Compass,
      content: "Don't miss Central Park with its 26-acre lake, the California City Municipal Airport, and the Tierra Del Sol Golf Course. The surrounding desert offers excellent opportunities for off-road adventures and stargazing."
    }
  ];

  const tips = [
    "Carry plenty of water, especially during summer months",
    "Wear sun protection and appropriate desert attire",
    "Check weather conditions before outdoor activities",
    "Respect private property and follow off-road vehicle regulations",
    "Support local businesses during your visit"
  ];

  return (
    <div className="min-h-screen bg-desert-50 dark:bg-night-desert-50">
      {/* Hero Section */}
      <section className="relative h-[500px] overflow-hidden">
        {/* Background Image */}
        <img 
          src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1600&auto=format&fit=crop&q=80" 
          alt="" 
          className="absolute inset-0 w-full h-full object-cover"
          aria-hidden="true"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-desert-900/80 to-desert-900/60" />
        
        {/* Content */}
        <div className="container mx-auto px-4 h-full flex items-center relative">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-4">
              Visitor Guide
            </h1>
            <p className="text-xl text-desert-100">
              Everything you need to know about visiting California City
            </p>
          </div>
        </div>
      </section>

      {/* Current Weather */}
      <section className="py-8 bg-desert-100 dark:bg-night-desert-200">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-semibold text-center mb-4">Current Weather</h2>
          <WeatherWidget />
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {sections.map((section) => (
              <div key={section.title} className="card">
                <section.icon className="w-8 h-8 text-desert-400 mb-4" />
                <h3 className="text-xl font-semibold mb-4">{section.title}</h3>
                <p className="text-desert-700 dark:text-desert-300">
                  {section.content}
                </p>
              </div>
            ))}
          </div>

          {/* Visitor Tips */}
          <div className="card">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-6 flex items-center">
                <Info className="w-6 h-6 text-desert-400 mr-2" />
                Essential Tips for Visitors
              </h2>
              <ul className="space-y-4">
                {tips.map((tip, index) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-block w-6 h-6 rounded-full bg-desert-400 text-white flex items-center justify-center mr-3 mt-0.5">
                      {index + 1}
                    </span>
                    <span className="text-desert-700 dark:text-desert-300">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Local Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div className="card">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <MapPin className="w-6 h-6 text-desert-400 mr-2" />
                Important Locations
              </h3>
              <ul className="space-y-3 text-desert-700 dark:text-desert-300">
                <li>Police Department: 21130 Hacienda Blvd</li>
                <li>Fire Station: 20890 Hacienda Blvd</li>
                <li>Medical Center: 8001 Cal City Blvd</li>
                <li>City Hall: 21000 Hacienda Blvd</li>
                <li>Visitor Center: 13200 Central Park</li>
              </ul>
            </div>

            <div className="card">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Calendar className="w-6 h-6 text-desert-400 mr-2" />
                Annual Events
              </h3>
              <ul className="space-y-3 text-desert-700 dark:text-desert-300">
                <li>Spring Desert Festival (April)</li>
                <li>Independence Day Celebration (July)</li>
                <li>Desert Star-Gazing Night (August)</li>
                <li>Fall Arts & Crafts Fair (October)</li>
                <li>Winter Holiday Parade (December)</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}