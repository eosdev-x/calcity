
import { Link } from 'react-router-dom';
import { Calendar, Building2, MapPin } from 'lucide-react';
import { WeatherWidget } from '../components/WeatherWidget';
import { GlobalSearch } from '../components/GlobalSearch';

export function Home() {
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

      {/* Featured Section */}
      <section className="py-16 bg-white dark:bg-night-desert-50">
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