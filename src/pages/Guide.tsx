
import { MapPin, Info, Calendar, Compass, Sun, Car } from 'lucide-react';
import { WeatherWidget } from '../components/WeatherWidget';
import { siteConfig } from '../config/site';
import { SEO } from '../components/SEO';
import { Helmet } from 'react-helmet-async';
import { buildBreadcrumbListJsonLd, buildTouristDestinationJsonLd } from '../utils/jsonLd';

export function Guide() {
  const sections = [
    {
      title: "Getting Here",
      icon: Car,
      content: siteConfig.guide.gettingHere
    },
    {
      title: "Best Time to Visit",
      icon: Sun,
      content: siteConfig.guide.bestTimeToVisit
    },
    {
      title: "Must-See Attractions",
      icon: Compass,
      content: siteConfig.guide.attractions
    }
  ];

  const tips = [
    "Carry plenty of water, especially during summer months",
    "Wear sun protection and appropriate desert attire",
    "Check weather conditions before outdoor activities",
    "Respect private property and follow off-road vehicle regulations",
    "Support local businesses during your visit"
  ];

  const touristJsonLd = buildTouristDestinationJsonLd(siteConfig);
  const breadcrumbsJsonLd = buildBreadcrumbListJsonLd(
    [
      { name: siteConfig.seo.pages.homeTitle, path: '/' },
      { name: siteConfig.seo.pages.guideTitle, path: '/guide' },
    ],
    siteConfig
  );

  return (
    <div className="min-h-screen bg-surface ">
      <SEO
        title={siteConfig.seo.pages.guideTitle}
        description={siteConfig.seo.pages.guideDescription}
        path="/guide"
        type="website"
      />
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(touristJsonLd)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbsJsonLd)}
        </script>
      </Helmet>
      {/* Hero Section */}
      <section className="relative h-[500px] overflow-hidden">
        {/* Background Image */}
        <img 
          src="https://mbazrezahuojknfgcwou.supabase.co/storage/v1/object/public/site-images/guide/hero-desert-highway.png" 
          alt="" 
          className="absolute inset-0 w-full h-full object-cover"
          aria-hidden="true"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-scrim/80 to-scrim/60" />
        
        {/* Content */}
        <div className="container mx-auto px-4 py-12 h-full flex flex-col relative">
          {siteConfig.features.weather && (
            <div className="self-end mb-8">
              <WeatherWidget />
            </div>
          )}
          
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-display font-bold text-inverse-on-surface mb-4">
              Visitor Guide
            </h1>
            <p className="text-xl text-inverse-on-surface">
              Everything you need to know about visiting {siteConfig.city}
            </p>
          </div>
        </div>
      </section>



      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {sections.map((section) => (
              <div key={section.title} className="card">
                <section.icon className="w-8 h-8 text-on-surface-variant mb-4" />
                <h3 className="text-xl font-semibold mb-4">{section.title}</h3>
                <p className="text-on-surface-variant">
                  {section.content}
                </p>
              </div>
            ))}
          </div>

          {/* Visitor Tips */}
          <div className="card">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-6 flex items-center">
                <Info className="w-6 h-6 text-on-surface-variant mr-2" />
                Essential Tips for Visitors
              </h2>
              <ul className="space-y-4">
                {tips.map((tip, index) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-block w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center mr-3 mt-0.5">
                      {index + 1}
                    </span>
                    <span className="text-on-surface-variant">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Local Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div className="card">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <MapPin className="w-6 h-6 text-on-surface-variant mr-2" />
                Important Locations
              </h3>
              <ul className="space-y-3 text-on-surface-variant">
                {siteConfig.guide.importantLocations.map((location) => (
                  <li key={location.name}>{location.name}: {location.detail}</li>
                ))}
              </ul>
            </div>

            <div className="card">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Calendar className="w-6 h-6 text-on-surface-variant mr-2" />
                Annual Events
              </h3>
              <ul className="space-y-3 text-on-surface-variant">
                {siteConfig.guide.annualEvents.map((event) => (
                  <li key={`${event.name}-${event.month}`}>
                    {event.name} ({event.month})
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
