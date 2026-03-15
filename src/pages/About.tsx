import { Link } from 'react-router-dom';
import {
  Building2,
  Calendar,
  Check,
  MapPin,
  Users,
  Star,
  Search,
  ArrowRight,
  Shield,
  BarChart3,
  Compass,
} from 'lucide-react';
import { SEO } from '../components/SEO';
import { siteConfig } from '../config/site';

export function About() {
  const visitorSteps = [
    {
      title: 'Browse businesses by category',
      description: `Find local favorites across ${siteConfig.city} - from dining to services and everything in between.`,
      icon: Search,
    },
    {
      title: 'Discover local events',
      description: "See what's happening this week and plan your next community outing.",
      icon: Calendar,
    },
    {
      title: 'Use the visitor guide',
      description: 'Plan a desert escape with trip tips, must-see spots, and local know-how.',
      icon: Compass,
    },
  ];

  const ownerSteps = [
    {
      title: 'Create a free account',
      description: 'Set up your profile in minutes to start reaching new customers.',
      icon: Users,
    },
    {
      title: 'Submit your business listing',
      description: 'Add your name, address, hours, photos, and a helpful description.',
      icon: Building2,
    },
    {
      title: 'Get discovered',
      description: 'Show up in local searches and connect with residents and visitors.',
      icon: MapPin,
    },
    {
      title: 'Upgrade for premium features',
      description: 'Unlock featured placement, galleries, and performance insights.',
      icon: BarChart3,
    },
  ];

  const plans = [
    {
      name: 'Free Listing',
      price: 'Free',
      description: 'Basic listing with the essentials.',
      features: [
        'Business name, address & phone',
        'Business hours display',
        'Business description',
        'Category listing',
        'Generic placeholder photo',
      ],
    },
    {
      name: 'Basic Listing',
      price: '$4.99/month',
      description: 'A stronger presence for growing businesses.',
      features: [
        'Everything in Free',
        'Upload up to 3 photos',
        'Website link',
        'Services list',
        'Higher search priority',
      ],
    },
    {
      name: 'Premium Listing',
      price: '$14.99/month',
      description: 'Stand out with rich visuals and social reach.',
      features: [
        'Everything in Basic',
        'Photo gallery (up to 10)',
        'Featured in search results',
        'Business description & services',
        'Direct website link',
        'Premium badge',
      ],
    },
    {
      name: 'Spotlight Listing',
      price: '$29.99/month',
      description: 'Maximum visibility across CalCity.info.',
      features: [
        'Everything in Premium',
        'Top of search results',
        'Homepage spotlight rotation',
        'Monthly event promotion',
        'Social media cross-promotion',
        'Analytics dashboard',
      ],
      highlight: true,
    },
  ];

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <SEO
        title={siteConfig.seo.pages.aboutTitle}
        description={siteConfig.seo.pages.aboutDescription}
        path="/about"
      />

      {/* Hero */}
      <section className="relative bg-surface-container-low overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-tertiary/10" />
        <div className="container mx-auto px-4 py-16 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-primary font-semibold mb-3">Community-powered directory</p>
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
                About {siteConfig.name}
              </h1>
              <p className="text-lg text-on-surface-variant mb-6">
                Our mission is to connect the {siteConfig.city} community with trusted local businesses, events,
                and resources - so neighbors and visitors can discover what makes our desert city special.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/businesses" className="btn-primary flex items-center">
                  Explore Businesses
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
                <Link to="/events" className="btn-outline flex items-center">
                  View Events
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="card">
                <Building2 className="w-6 h-6 text-primary mb-3" />
                <h3 className="text-lg font-semibold mb-2">Local Businesses</h3>
                <p className="text-on-surface-variant">
                  Discover shops, services, dining, and more from every corner of {siteConfig.city}.
                </p>
              </div>
              <div className="card">
                <Calendar className="w-6 h-6 text-primary mb-3" />
                <h3 className="text-lg font-semibold mb-2">Community Events</h3>
                <p className="text-on-surface-variant">
                  Stay in the know on festivals, markets, and gatherings across Kern County.
                </p>
              </div>
              <div className="card sm:col-span-2">
                <Users className="w-6 h-6 text-primary mb-3" />
                <h3 className="text-lg font-semibold mb-2">Built for Neighbors</h3>
                <p className="text-on-surface-variant">
                  CalCity.info is shaped by locals who care about community, visibility, and small-town pride.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What is CalCity.info */}
      <section className="py-16 bg-surface">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-10 items-start">
            <div>
              <h2 className="text-3xl font-display font-bold mb-4">What is {siteConfig.name}?</h2>
              <p className="text-on-surface-variant text-lg mb-4">
                {siteConfig.name} is a community-powered local business directory and events hub for {siteConfig.city},
                {siteConfig.state}. It's free to browse, so anyone can discover what's nearby, plan an afternoon out, or
                map the perfect desert weekend.
              </p>
              <p className="text-on-surface-variant text-lg">
                Business owners can list for free or upgrade to featured plans for more visibility, richer storytelling,
                and tools that help connect with both residents and visitors.
              </p>
            </div>
            <div className="card bg-surface-container-low">
              <div className="flex items-start gap-3">
                <Shield className="w-6 h-6 text-primary mt-1" />
                <div>
                  <h3 className="text-lg font-semibold mb-2">Safe, trustworthy listings</h3>
                  <p className="text-on-surface-variant">
                    Every listing is designed to be clear, accurate, and helpful, with details you can rely on.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 mt-6">
                <Star className="w-6 h-6 text-primary mt-1" />
                <div>
                  <h3 className="text-lg font-semibold mb-2">Boost local visibility</h3>
                  <p className="text-on-surface-variant">
                    Highlight what makes your business unique and show up in searches across the region.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-surface-container-low">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
            <div>
              <h2 className="text-3xl font-display font-bold mb-3">How it works</h2>
              <p className="text-on-surface-variant text-lg">
                Whether you're exploring town or growing a local business, here's how to get started.
              </p>
            </div>
            <Link to="/businesses" className="btn-outline flex items-center">
              Start browsing
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="card">
              <h3 className="text-xl font-semibold mb-6 flex items-center">
                <Compass className="w-5 h-5 text-primary mr-2" />
                For residents and visitors
              </h3>
              <div className="space-y-4">
                {visitorSteps.map((step, index) => (
                  <div key={step.title} className="flex items-start gap-4">
                    <div className="w-9 h-9 rounded-full bg-primary text-on-primary flex items-center justify-center font-semibold">
                      {index + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <step.icon className="w-5 h-5 text-on-surface-variant" />
                        <h4 className="text-lg font-semibold">{step.title}</h4>
                      </div>
                      <p className="text-on-surface-variant">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h3 className="text-xl font-semibold mb-6 flex items-center">
                <Building2 className="w-5 h-5 text-primary mr-2" />
                For business owners
              </h3>
              <div className="space-y-4">
                {ownerSteps.map((step, index) => (
                  <div key={step.title} className="flex items-start gap-4">
                    <div className="w-9 h-9 rounded-full bg-primary text-on-primary flex items-center justify-center font-semibold">
                      {index + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <step.icon className="w-5 h-5 text-on-surface-variant" />
                        <h4 className="text-lg font-semibold">{step.title}</h4>
                      </div>
                      <p className="text-on-surface-variant">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Plans */}
      <section className="py-16 bg-surface">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
            <div>
              <h2 className="text-3xl font-display font-bold mb-3">Our plans</h2>
              <p className="text-on-surface-variant text-lg">
                Choose the visibility that fits your business, from free listings to full spotlight coverage.
              </p>
            </div>
            <Link to="/pricing" className="btn-primary flex items-center">
              View pricing
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`card overflow-hidden ${plan.highlight ? 'shadow-md' : ''}`}
              >
                <div className="p-6 bg-surface-container">
                  <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                  <p className="text-3xl font-bold text-on-surface mb-2">{plan.price}</p>
                </div>
                <div className="p-6 bg-surface-container-low">
                  <ul className="space-y-4">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center space-x-2">
                        <Check className="w-5 h-5 text-on-surface-variant flex-shrink-0" />
                        <span className="text-on-surface-variant">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About California City */}
      <section className="py-16 bg-surface-container-low">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 items-start">
            <div>
              <h2 className="text-3xl font-display font-bold mb-4">About {siteConfig.city}</h2>
              <p className="text-on-surface-variant text-lg mb-4">
                Located in the western Mojave Desert, {siteConfig.city} is known for its vast desert landscapes and wide-open skies.
                With a population around 14,000 and founded in 1958, the city blends small-town community with big-sky adventure.
              </p>
              <p className="text-on-surface-variant text-lg mb-4">
                It's a gateway to desert recreation - from off-roading and hiking to unforgettable stargazing nights.
                {siteConfig.city}, {siteConfig.state} is also close to Edwards Air Force Base and Red Rock Canyon,
                making it a perfect base for exploring the high desert.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/guide" className="btn-outline flex items-center">
                  Visitor guide
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
                <Link to="/events" className="btn-outline flex items-center">
                  Local events
                </Link>
              </div>
            </div>
            <div className="card">
              <h3 className="text-xl font-semibold mb-4">Why people love it here</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <p className="font-semibold">Desert landscapes</p>
                    <p className="text-on-surface-variant">Golden sunsets, open vistas, and space to roam.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <p className="font-semibold">Night skies</p>
                    <p className="text-on-surface-variant">Clear stargazing and quiet evenings under the stars.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Building2 className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <p className="font-semibold">Local pride</p>
                    <p className="text-on-surface-variant">A growing community with a welcoming, small-town feel.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-surface">
        <div className="container mx-auto px-4">
          <div className="card bg-surface-container-high flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h2 className="text-3xl font-display font-bold mb-2">Ready to get started?</h2>
              <p className="text-on-surface-variant text-lg">
                Browse local favorites, plan your visit, or showcase your business in {siteConfig.city}.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/businesses" className="btn-primary flex items-center">
                Browse businesses
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
              <Link to="/businesses/new" className="btn-outline">Submit your business</Link>
              <Link to="/events" className="btn-outline">View events</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
