
import { Link } from 'react-router-dom';
import { Calendar, Building2, MapPin, Clock, Phone, Compass, Info, Sun, Car } from 'lucide-react';
import { WeatherWidget } from '../components/WeatherWidget';
import { GlobalSearch } from '../components/GlobalSearch';
import { useEvents } from '../context/EventContext';
import { useBusinesses } from '../context/BusinessContext';
import { BusinessHoursStatus } from '../components/BusinessHoursStatus';
import { getTierBadge } from '../hooks/useBusinessPermissions';
import { siteConfig } from '../config/site';
import { SEO } from '../components/SEO';
import { Helmet } from 'react-helmet-async';
import { buildWebSiteJsonLd } from '../utils/jsonLd';

export function Home() {
  // Get events and businesses from context
  const { events } = useEvents();
  const { businesses } = useBusinesses();
  
  // Get upcoming events (sorted by date)
  const upcomingEvents = [...events]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .filter(event => new Date(event.date) >= new Date())
    .slice(0, 3);
  
  // Get featured businesses based on premium status
  const spotlightBusinesses = [...businesses]
    .filter(business => business.is_spotlight && business.status === 'active')
    .sort((a, b) => a.name.localeCompare(b.name))
    .slice(0, 6);

  const featuredBusinesses = [...businesses]
    .filter(business => business.is_featured && business.status === 'active')
    .sort((a, b) => a.name.localeCompare(b.name))
    .slice(0, 3);

  const webSiteJsonLd = buildWebSiteJsonLd(siteConfig);
    
  return (
    <div className="flex flex-col min-h-screen">
      <SEO
        title={siteConfig.seo.pages.homeTitle}
        description={siteConfig.seo.pages.homeDescription}
        path="/"
        type="website"
      />
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(webSiteJsonLd)}
        </script>
      </Helmet>
      {/* Hero Section */}
      <section 
        className="relative min-h-[800px] bg-cover bg-center"
        style={{
          backgroundImage: 'url("https://mbazrezahuojknfgcwou.supabase.co/storage/v1/object/public/site-images/hero/calcity-hero-sunset.png")'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-scrim/70 to-scrim/50" />
        <div className="container mx-auto px-4 py-12 h-full flex flex-col items-center relative">
          {siteConfig.features.weather && (
            <div className="self-end mb-8">
              <WeatherWidget />
            </div>
          )}
          
          <div className="max-w-2xl text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-display font-bold text-inverse-on-surface mb-6">
              Welcome to {siteConfig.city}
            </h1>
            <p className="text-xl text-inverse-on-surface mb-8">
              {siteConfig.tagline}
            </p>
          </div>

          {/* Global Search Component */}
          <div className="w-full max-w-3xl mb-8">
            <GlobalSearch />
          </div>
        </div>
      </section>

      {siteConfig.features.events && (
        <section className="py-16 bg-surface">
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
                  <div key={event.id} className="card hover:shadow-md transition-shadow duration-[var(--md-sys-motion-duration-medium2)]">
                    <Link to={`/events/${event.id}`}>
                      <div className="relative">
                        <img
                          src={event.image || ''}
                          alt={event.title}
                          className="w-full h-48 object-cover rounded-t-xl"
                        />
                        <div className="absolute top-2 right-2 bg-primary text-on-primary text-xs font-bold px-2 py-1 rounded">
                          {event.category}
                        </div>
                      </div>
                    </Link>
                    
                    <div className="p-4">
                      <Link to={`/events/${event.id}`}>
                        <h3 className="text-xl font-semibold mb-2 line-clamp-1 hover:text-primary transition-colors duration-[var(--md-sys-motion-duration-short3)]">{event.title}</h3>
                      </Link>
                      
                      <div className="space-y-2 mb-3">
                        <div className="flex items-center space-x-2 text-on-surface-variant text-sm">
                          <Calendar className="w-4 h-4 flex-shrink-0" />
                          <span>{new Date(event.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-on-surface-variant text-sm">
                          <Clock className="w-4 h-4 flex-shrink-0" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-on-surface-variant text-sm">
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
                  <p className="text-xl text-on-surface-variant">
                    No upcoming events at this time.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}
      
      {siteConfig.features.businesses && spotlightBusinesses.length > 0 && (
        <section className="py-16 bg-surface">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-display font-bold">
                Spotlight Businesses
              </h2>
              <Link to="/businesses" className="btn-secondary flex items-center">
                Explore All Businesses
                <Building2 className="ml-2 w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {spotlightBusinesses.map((business) => {
                const badge = getTierBadge(business.subscription_tier);
                return (
                  <div
                    key={business.id}
                    className="card hover:shadow-md transition-shadow duration-[var(--md-sys-motion-duration-medium2)] border border-tertiary/50"
                  >
                    <Link to={`/businesses/${business.id}`}>
                      <div className="relative">
                        <img
                          src={business.image || ''}
                          alt={business.name}
                          className="w-full h-64 object-cover rounded-t-xl"
                        />
                        {badge && (
                          <div
                            className={`absolute top-2 right-2 text-xs font-semibold px-3 py-1 rounded-full flex items-center ${badge.className}`}
                          >
                            {badge.text}
                          </div>
                        )}
                      </div>
                    </Link>

                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <Link to={`/businesses/${business.id}`}>
                        <h3 className="text-2xl font-semibold line-clamp-1 hover:text-primary transition-colors duration-[var(--md-sys-motion-duration-short3)]">
                          {business.name}
                        </h3>
                      </Link>
                    </div>

                    <p className="text-on-surface-variant mb-4">
                      {business.category}
                    </p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center space-x-2 text-on-surface-variant text-sm">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        <span className="line-clamp-1">{business.address}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-on-surface-variant text-sm">
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
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Local Businesses Section */}
      {siteConfig.features.businesses && featuredBusinesses.length > 0 && (
        <section className="py-16 bg-surface ">
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
                <div key={business.id} className="card hover:shadow-md transition-shadow duration-[var(--md-sys-motion-duration-medium2)]">
                  <Link to={`/businesses/${business.id}`}>
                    <div className="relative">
                      <img
                        src={business.image || ''}
                        alt={business.name}
                        className="w-full h-48 object-cover rounded-t-xl"
                      />
                      {business.is_featured && (
                        <div className="absolute top-2 right-2 bg-primary text-on-primary text-xs font-bold px-2 py-1 rounded flex items-center">
                          Featured
                        </div>
                      )}
                    </div>
                  </Link>
                  
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Link to={`/businesses/${business.id}`}>
                        <h3 className="text-xl font-semibold line-clamp-1 hover:text-primary transition-colors duration-[var(--md-sys-motion-duration-short3)]">{business.name}</h3>
                      </Link>
                    </div>
                    
                    <p className="text-on-surface-variant mb-2">
                      {business.category}
                    </p>

                    <BusinessHoursStatus hours={business.hours} className="mb-3" />
                    
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center space-x-2 text-on-surface-variant text-sm">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        <span className="line-clamp-1">{business.address}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-on-surface-variant text-sm">
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
      )}
      
      {siteConfig.features.guide && (
        <section className="py-16 bg-surface">
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
              {siteConfig.features.weather && (
                <div className="card">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <Sun className="w-5 h-5 text-on-surface-variant mr-2" />
                    Current Weather
                  </h3>
                  <WeatherWidget />
                  
                  <div className="mt-4 pt-4 border-t border-outline-variant">
                    <h4 className="font-medium mb-2">Best Time to Visit</h4>
                    <p className="text-on-surface-variant text-sm">
                      {siteConfig.guide.bestTimeToVisit}
                    </p>
                  </div>
                </div>
              )}
              
              {/* Top Attractions */}
              <div className="card">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Compass className="w-5 h-5 text-on-surface-variant mr-2" />
                  Top Attractions
                </h3>
                
                <div className="space-y-4">
                  {siteConfig.guide.attractionsList.map((attraction, index) => (
                    <div key={index} className="flex">
                      <Link to="/guide" className="flex-shrink-0">
                        <img 
                          src={attraction.image} 
                          alt={attraction.name}
                          className="w-20 h-20 object-cover rounded-xl mr-3 hover:opacity-90 transition-opacity duration-[var(--md-sys-motion-duration-short3)]"
                        />
                      </Link>
                      <div>
                        <Link to="/guide">
                          <h4 className="font-medium hover:text-primary transition-colors duration-[var(--md-sys-motion-duration-short3)]">{attraction.name}</h4>
                        </Link>
                        <p className="text-on-surface-variant text-sm">
                          {attraction.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 pt-4 border-t border-outline-variant">
                  <h4 className="font-medium mb-2">Must-See Attractions</h4>
                  <p className="text-on-surface-variant text-sm">
                    {siteConfig.guide.attractions}
                  </p>
                </div>
              </div>
              
              {/* Essential Information */}
              <div className="card">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Info className="w-5 h-5 text-on-surface-variant mr-2" />
                  Essential Information
                </h3>
                
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium flex items-center">
                      <Car className="w-4 h-4 text-on-surface-variant mr-2" />
                      Getting Here
                    </h4>
                    <p className="text-on-surface-variant text-sm ml-6">
                      {siteConfig.guide.gettingHere}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium flex items-center">
                      <MapPin className="w-4 h-4 text-on-surface-variant mr-2" />
                      Important Locations
                    </h4>
                    <ul className="text-on-surface-variant text-sm ml-6 space-y-1">
                      {siteConfig.guide.importantLocations.map((location) => (
                        <li key={location.name}>{location.name}: {location.detail}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium flex items-center">
                      <Calendar className="w-4 h-4 text-on-surface-variant mr-2" />
                      Annual Events
                    </h4>
                    <ul className="text-on-surface-variant text-sm ml-6 space-y-1">
                      {siteConfig.guide.annualEvents.slice(0, 3).map((event) => (
                        <li key={`${event.name}-${event.month}`}>
                          {event.name} ({event.month})
                        </li>
                      ))}
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
      )}
      
      {/* Why Choose Section */}
      <section className="py-16 bg-surface ">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-display font-bold text-center mb-12">
            Why Choose {siteConfig.city}?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <img
                src="https://mbazrezahuojknfgcwou.supabase.co/storage/v1/object/public/site-images/why-choose/natural-beauty.jpg"
                alt="Mojave Desert sunset near California City"
                className="rounded-xl shadow-sm mb-6"
              />
              <h3 className="text-xl font-semibold mb-2">Natural Beauty</h3>
              <p className="text-on-surface-variant ">
                Experience the stunning landscapes and breathtaking sunsets around {siteConfig.city}
              </p>
            </div>
            <div>
              <img
                src="https://mbazrezahuojknfgcwou.supabase.co/storage/v1/object/public/site-images/why-choose/strong-community.jpg"
                alt="California City community gathering"
                className="rounded-xl shadow-sm mb-6"
              />
              <h3 className="text-xl font-semibold mb-2">Strong Community</h3>
              <p className="text-on-surface-variant ">
                Join a welcoming community that supports local businesses and events
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
