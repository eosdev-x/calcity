export interface SiteConfig {
  // Identity
  name: string;
  city: string;
  state: string;
  tagline: string;
  domain: string;

  // SEO
  seo: {
    defaultDescription: string;
    defaultImage?: string;
    twitterHandle?: string;
    pages: {
      homeTitle: string;
      homeDescription: string;
      eventsTitle: string;
      eventsDescription: string;
      businessesTitle: string;
      businessesDescription: string;
      guideTitle: string;
      guideDescription: string;
      pricingTitle: string;
      pricingDescription: string;
      termsTitle: string;
      privacyTitle: string;
      contactTitle: string;
      contactDescription: string;
      loginTitle: string;
      signupTitle: string;
      forgotPasswordTitle: string;
      resetPasswordTitle: string;
      authCallbackTitle: string;
      dashboardTitle: string;
      adminTitle: string;
      profileTitle: string;
      eventSubmissionTitle: string;
      eventCalendarTitle: string;
      businessCreationTitle: string;
      paymentTitle: string;
      paymentSuccessTitle: string;
      paymentCancelTitle: string;
    };
  };

  // Theme
  seedColor: string;

  // Features
  features: {
    chat: boolean;
    weather: boolean;
    events: boolean;
    businesses: boolean;
    guide: boolean;
  };

  // Chat
  chatBotName: string;
  chatSystemPrompt: string;
  chatWorkerUrl: string;

  // Weather
  weather: {
    lat: number;
    lon: number;
    name: string;
  };

  // Stripe price IDs
  stripe: {
    freePriceId: string | null;
    basicPriceId: string;
    premiumPriceId: string;
    spotlightPriceId: string;
  };

  // Guide content
  guide: {
    gettingHere: string;
    bestTimeToVisit: string;
    attractions: string;
    attractionsList: { name: string; description: string; image: string }[];
    importantLocations: { name: string; detail: string }[];
    annualEvents: { name: string; month: string }[];
  };

  // Legal
  legal: {
    arbitrationLocation: string;
    address: string;
    zipCode: string;
  };

  // Contact
  contact: {
    phone?: string;
    email?: string;
  };

  // Social links
  social: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };

  // Default business city/state for forms
  defaults: {
    city: string;
    state: string;
  };
}

export const siteConfig: SiteConfig = {
  name: 'CalCity.info',
  city: 'California City',
  state: 'CA',
  tagline: "Discover the beauty and opportunity of the Mojave Desert's hidden gem",
  domain: 'calcity.info',

  seo: {
    defaultDescription: 'Discover California City, CA — local businesses, events, visitor guide, and community info for the Mojave Desert\'s hidden gem.',
    defaultImage: '',
    twitterHandle: '',
    pages: {
      homeTitle: 'Home',
      homeDescription: 'Discover California City, CA — local businesses, events, visitor guide, and community info for the Mojave Desert\'s hidden gem.',
      eventsTitle: 'Events',
      eventsDescription: 'Find upcoming events, festivals, and community gatherings in California City, CA.',
      businessesTitle: 'Local Businesses',
      businessesDescription: 'Explore local businesses, services, and restaurants in California City, CA.',
      guideTitle: 'Visitor Guide',
      guideDescription: 'Plan your trip with a visitor guide to California City, CA, including attractions, tips, and travel info.',
      pricingTitle: 'Pricing',
      pricingDescription: 'Compare listing plans and promotion options for California City businesses.',
      termsTitle: 'Terms of Service',
      privacyTitle: 'Privacy Policy',
      contactTitle: 'Contact',
      contactDescription: 'Send a message to the CalCity.info team.',
      loginTitle: 'Log In',
      signupTitle: 'Sign Up',
      forgotPasswordTitle: 'Forgot Password',
      resetPasswordTitle: 'Reset Password',
      authCallbackTitle: 'Authentication',
      dashboardTitle: 'Dashboard',
      adminTitle: 'Admin',
      profileTitle: 'Profile',
      eventSubmissionTitle: 'Submit Event',
      eventCalendarTitle: 'Event Calendar',
      businessCreationTitle: 'Create Business Profile',
      paymentTitle: 'Payment',
      paymentSuccessTitle: 'Payment Success',
      paymentCancelTitle: 'Payment Cancelled',
    },
  },

  seedColor: '#C47451',

  features: {
    chat: true,
    weather: true,
    events: true,
    businesses: true,
    guide: true,
  },

  chatBotName: 'CalCityBot',
  chatSystemPrompt: 'You are a helpful assistant for California City, CA. Help visitors learn about local businesses, events, and attractions.',
  chatWorkerUrl: 'https://venice.imtux.workers.dev/',

  weather: { lat: 35.1258, lon: -117.9859, name: 'California City' },

  stripe: {
    freePriceId: null,
    basicPriceId: import.meta.env.VITE_STRIPE_BASIC_PRICE_ID || 'price_1TASQfRpRbHjjRj8mXv5x9rB',
    premiumPriceId: import.meta.env.VITE_STRIPE_PREMIUM_PRICE_ID || 'price_1TASRPRpRbHjjRj8rZMNIJ4i',
    spotlightPriceId: import.meta.env.VITE_STRIPE_SPOTLIGHT_PRICE_ID || 'price_1TASSRRpRbHjjRj8nfJz5gSc',
  },

  guide: {
    gettingHere: 'California City is easily accessible via Highway 14 and Highway 58. The nearest major airports are Mojave Air & Space Port (30 minutes) and Los Angeles International Airport (LAX, 2 hours).',
    bestTimeToVisit: 'Spring (March-May) and Fall (September-November) offer the most pleasant temperatures. Summer can be very hot, while winter nights can be quite cold. Always bring sun protection and plenty of water.',
    attractions: "Don't miss Central Park with its 26-acre lake, the California City Municipal Airport, and the Tierra Del Sol Golf Course. The surrounding desert offers excellent opportunities for off-road adventures and stargazing.",
    attractionsList: [
      {
        name: 'Central Park',
        description: '26-acre lake with walking trails and picnic areas',
        image: 'https://images.unsplash.com/photo-1588714477688-cf28a50e94f7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGFya3xlbnwwfHwwfHx8MA%3D%3D?auto=format&fit=crop&q=80',
      },
      {
        name: 'Desert Observatory',
        description: 'Experience the beauty of the desert night sky',
        image: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a',
      },
    ],
    importantLocations: [
      { name: 'City Hall', detail: '21000 Hacienda Blvd' },
      { name: 'Post Office', detail: '7949 California City Blvd' },
      { name: 'Medical Center', detail: '8001 Cal City Blvd' },
      { name: 'Fire Station', detail: '21000 Hacienda Blvd' },
    ],
    annualEvents: [
      { name: 'Spring Desert Festival', month: 'April' },
      { name: 'Independence Day Celebration', month: 'July' },
      { name: 'Desert Star-Gazing Night', month: 'August' },
      { name: 'Fall Arts & Crafts Fair', month: 'October' },
      { name: 'Winter Holiday Parade', month: 'December' },
    ],
  },

  legal: {
    arbitrationLocation: 'Kern County, California',
    address: '123 Main Street',
    zipCode: '93505',
  },

  contact: {
    phone: '(555) 123-4567',
    email: 'info@calcity.info',
  },

  social: {},

  defaults: {
    city: 'California City',
    state: 'CA',
  },
};
