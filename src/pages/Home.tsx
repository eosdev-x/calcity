
import { Link } from 'react-router-dom';
import { Calendar, Building2, MapPin, Clock, Phone, Globe, Star, Compass, Info, Sun, Car } from 'lucide-react';
import { WeatherWidget } from '../components/WeatherWidget';
import { GlobalSearch } from '../components/GlobalSearch';
import { useEvents } from '../context/EventContext';
import { useBusinesses } from '../context/BusinessContext';
import { BusinessHoursStatus } from '../components/BusinessHoursStatus';

export function Home() {
  // Get events and businesses from context
  const { events } = useEvents();
  const { businesses } = useBusinesses();
  
  // Get upcoming events (sorted by date)
  const upcomingEvents = [...events]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .filter(event => new Date(event.date) >= new Date())
    .slice(0, 3);
  
  // Get featured businesses (could be based on rating or premium status)
  const featuredBusinesses = [...businesses]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);
    
  // Visitor guide attractions
  const attractions = [
    {
      name: "Central Park",
      description: "26-acre lake with walking trails and picnic areas",
      image: "https://images.unsplash.com/photo-1576437557195-47f5a8bcdf4a?auto=format&fit=crop&q=80"
    },
    {
      name: "Desert Observatory",
      description: "Experience the beauty of the desert night sky",
      image: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a"
    }
  ];
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative min-h-[800px] bg-cover bg-center"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1577303610524-3b00c10b1e65?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bW9qYXZlJTIwY2F8ZW58MHx8MHx8fDA%3D")'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-desert-900/70 to-desert-900/50" />
        <div className="container mx-auto px-4 py-12 h-full flex flex-col items-center relative">
          <div className="self-end mb-8">
            <WeatherWidget />
          </div>
          
          <div className="max-w-2xl text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
              Welcome to California City
            </h1>
            <p className="text-xl text-desert-100 mb-8">
              Discover the beauty and opportunity of the Mojave Desert's hidden gem
            </p>
          </div>

          {/* Global Search Component */}
          <div className="w-full max-w-3xl mb-8">
            <GlobalSearch />
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="py-16 bg-desert-50 dark:bg-night-desert-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card">
              <Calendar className="w-8 h-8 text-desert-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Upcoming Events</h3>
              <p className="text-desert-700 dark:text-desert-300 mb-4">
                Stay updated with local community events and gatherings
              </p>
              <Link to="/events" className="btn-secondary">View Events</Link>
            </div>

            <div className="card">
              <Building2 className="w-8 h-8 text-desert-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Local Businesses</h3>
              <p className="text-desert-700 dark:text-desert-300 mb-4">
                Support and discover local businesses in our community
              </p>
              <Link to="/businesses" className="btn-secondary">Browse Directory</Link>
            </div>

            <div className="card">
              <MapPin className="w-8 h-8 text-desert-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Visitor Guide</h3>
              <p className="text-desert-700 dark:text-desert-300 mb-4">
                Essential information for visitors and newcomers
              </p>
              <Link to="/guide" className="btn-secondary">Learn More</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-16 bg-white dark:bg-night-desert-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-display font-bold">
              Upcoming Events
            </h2>
            <Link to="/events" className="btn-secondary flex items-center">
              View All Events
              <Calendar className="ml-2 w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((event) => (
                <div key={event.id} className="card hover:shadow-lg transition-shadow duration-300">
                  <div className="relative">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <div className="absolute top-2 right-2 bg-desert-500 text-white text-xs font-bold px-2 py-1 rounded">
                      {event.category}
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-xl font-semibold mb-2 line-clamp-1">{event.title}</h3>
                    
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center space-x-2 text-desert-700 dark:text-desert-300 text-sm">
                        <Calendar className="w-4 h-4 flex-shrink-0" />
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-desert-700 dark:text-desert-300 text-sm">
                        <Clock className="w-4 h-4 flex-shrink-0" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-desert-700 dark:text-desert-300 text-sm">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        <span className="line-clamp-1">{event.location}</span>
                      </div>
                    </div>

                    <Link 
                      to={`/events/${event.id}`}
                      className="btn-primary w-full block text-center text-sm"
                    >
                      Learn More
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <p className="text-xl text-desert-600 dark:text-desert-400">
                  No upcoming events at this time.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* Local Businesses Section */}
      <section className="py-16 bg-desert-50 dark:bg-night-desert-100">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-display font-bold">
              Local Businesses
            </h2>
            <Link to="/businesses" className="btn-secondary flex items-center">
              Explore All Businesses
              <Building2 className="ml-2 w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredBusinesses.map((business) => (
              <div key={business.id} className="card hover:shadow-lg transition-shadow duration-300">
                <div className="relative">
                  <img
                    src={business.image}
                    alt={business.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  {business.rating >= 4.5 && (
                    <div className="absolute top-2 right-2 bg-desert-500 text-white text-xs font-bold px-2 py-1 rounded flex items-center">
                      <Star className="w-3 h-3 mr-1 fill-current" />
                      Premium
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-semibold line-clamp-1">{business.name}</h3>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-desert-400 fill-current" />
                      <span className="ml-1">{business.rating}</span>
                    </div>
                  </div>
                  
                  <p className="text-desert-600 dark:text-desert-400 mb-2">
                    {business.category}
                  </p>

                  <BusinessHoursStatus hours={business.hours} className="mb-3" />
                  
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center space-x-2 text-desert-700 dark:text-desert-300 text-sm">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span className="line-clamp-1">{business.address}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-desert-700 dark:text-desert-300 text-sm">
                      <Phone className="w-4 h-4 flex-shrink-0" />
                      <span>{business.phone}</span>
                    </div>
                  </div>

                  <Link 
                    to={`/businesses/${business.id}`}
                    className="btn-secondary w-full block text-center text-sm"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Visitor Guide Preview Section */}
      <section className="py-16 bg-white dark:bg-night-desert-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-display font-bold">
              Plan Your Visit
            </h2>
            <Link to="/guide" className="btn-secondary flex items-center">
              View Full Guide
              <MapPin className="ml-2 w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Weather Widget */}
            <div className="card">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Sun className="w-5 h-5 text-desert-400 mr-2" />
                Current Weather
              </h3>
              <WeatherWidget />
              
              <div className="mt-4 pt-4 border-t border-desert-200 dark:border-night-desert-300">
                <h4 className="font-medium mb-2">Best Time to Visit</h4>
                <p className="text-desert-700 dark:text-desert-300 text-sm">
                  Spring (March-May) and Fall (September-November) offer the most pleasant temperatures. Summer can be very hot, while winter nights can be quite cold.
                </p>
              </div>
            </div>
            
            {/* Top Attractions */}
            <div className="card">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Compass className="w-5 h-5 text-desert-400 mr-2" />
                Top Attractions
              </h3>
              
              <div className="space-y-4">
                {attractions.map((attraction, index) => (
                  <div key={index} className="flex">
                    <img 
                      src={attraction.image} 
                      alt={attraction.name}
                      className="w-20 h-20 object-cover rounded-md mr-3"
                    />
                    <div>
                      <h4 className="font-medium">{attraction.name}</h4>
                      <p className="text-desert-700 dark:text-desert-300 text-sm">
                        {attraction.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t border-desert-200 dark:border-night-desert-300">
                <h4 className="font-medium mb-2">Must-See Attractions</h4>
                <p className="text-desert-700 dark:text-desert-300 text-sm">
                  Don't miss Central Park with its 26-acre lake, the California City Municipal Airport, and the Tierra Del Sol Golf Course.
                </p>
              </div>
            </div>
            
            {/* Essential Information */}
            <div className="card">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Info className="w-5 h-5 text-desert-400 mr-2" />
                Essential Information
              </h3>
              
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium flex items-center">
                    <Car className="w-4 h-4 text-desert-400 mr-2" />
                    Getting Here
                  </h4>
                  <p className="text-desert-700 dark:text-desert-300 text-sm ml-6">
                    Accessible via Highway 14 and Highway 58. Nearest airports: Mojave (30 min) and LAX (2 hours).
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium flex items-center">
                    <MapPin className="w-4 h-4 text-desert-400 mr-2" />
                    Important Locations
                  </h4>
                  <ul className="text-desert-700 dark:text-desert-300 text-sm ml-6 space-y-1">
                    <li>Police: 21130 Hacienda Blvd</li>
                    <li>Medical Center: 8001 Cal City Blvd</li>
                    <li>Visitor Center: 13200 Central Park</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium flex items-center">
                    <Calendar className="w-4 h-4 text-desert-400 mr-2" />
                    Annual Events
                  </h4>
                  <ul className="text-desert-700 dark:text-desert-300 text-sm ml-6 space-y-1">
                    <li>Spring Desert Festival (April)</li>
                    <li>Desert Star-Gazing Night (August)</li>
                    <li>Fall Arts & Crafts Fair (October)</li>
                  </ul>
                </div>
              </div>
              
              <Link 
                to="/guide"
                className="btn-primary w-full block text-center text-sm mt-4"
              >
                Plan Your Visit
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Why Choose California City Section */}
      <section className="py-16 bg-desert-50 dark:bg-night-desert-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-display font-bold text-center mb-12">
            Why Choose California City?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <img
                src="https://images.unsplash.com/photo-1682687220742-aba13b6e50ba"
                alt="Desert landscape"
                className="rounded-lg shadow-desert mb-6"
              />
              <h3 className="text-xl font-semibold mb-2">Natural Beauty</h3>
              <p className="text-desert-700 dark:text-desert-300">
                Experience the stunning Mojave Desert landscape and breathtaking sunsets
              </p>
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1682687220198-88e9bdea9931"
                alt="Community event"
                className="rounded-lg shadow-desert mb-6"
              />
              <h3 className="text-xl font-semibold mb-2">Strong Community</h3>
              <p className="text-desert-700 dark:text-desert-300">
                Join a welcoming community that supports local businesses and events
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}