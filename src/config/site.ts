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
      aboutTitle: string;
      aboutDescription: string;
      resourcesTitle: string;
      resourcesDescription: string;
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
      aboutTitle: 'About',
      aboutDescription: 'Learn how CalCity.info connects California City, CA with local businesses, events, and community resources.',
      resourcesTitle: 'Community Resources',
      resourcesDescription: 'Essential city services, department contacts, and community resources for California City, CA residents and visitors.',
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
    premiumPriceId: import.meta.env.VITE_STRIPE_PREMIUM_PRICE_ID || 'price_1TAveRRpRbHjjRj85ycm5SRB',
    spotlightPriceId: import.meta.env.VITE_STRIPE_SPOTLIGHT_PRICE_ID || 'price_1TAvdgRpRbHjjRj85WrDuMHH',
  },

  guide: {
    gettingHere: 'California City is located in the western Mojave Desert in Kern County. From Los Angeles, take I-5 North to CA-14 North through Palmdale and Lancaster (about 100 miles, ~2 hours). From Bakersfield, take CA-58 East to CA-14 South (about 65 miles, ~1 hour). From Las Vegas, take I-15 South to CA-58 West to CA-14 South (about 230 miles, ~3.5 hours). The nearest regional airport is Mojave Air & Space Port, just 25 minutes south. LAX is approximately 2 hours away.',
    bestTimeToVisit: 'Spring (March–May) is the best time to visit — temperatures are comfortable in the 70s–80s°F, and the desert wildflowers bloom after winter rains. Fall (September–November) is equally pleasant with warm days and cool nights perfect for stargazing. Summer (June–August) brings intense heat, often exceeding 100°F — plan outdoor activities for early morning or evening. Winter (December–February) offers mild days in the 50s–60s°F but nights can drop near freezing. Always bring sun protection, layers, and plenty of water regardless of season.',
    attractions: "California City offers a unique desert experience. Explore Central Park and its 26-acre lake for fishing, walking trails, and picnics. Thrill-seekers love Cal City MX Park, one of the premier motocross facilities in Southern California. The Desert Tortoise Natural Area, a 40-square-mile preserve northeast of town, protects the endangered desert tortoise in its native habitat. The region's dark skies make it exceptional for stargazing — the Mojave Desert is one of the best spots in California for astrophotography. Golfers can enjoy the Silver Saddle Golf Course, and the surrounding open desert terrain is popular for off-road riding and exploration.",
    attractionsList: [
      {
        name: 'Central Park & Lake',
        description: '26-acre lake with fishing, walking trails, picnic areas, and playgrounds — the heart of Cal City recreation',
        image: 'https://mbazrezahuojknfgcwou.supabase.co/storage/v1/object/public/site-images/guide/central-park-lake.png',
      },
      {
        name: 'Cal City MX Park',
        description: 'Premier motocross facility with jumps from 10–110 ft, peewee track, open practice Saturdays & Sundays',
        image: 'https://mbazrezahuojknfgcwou.supabase.co/storage/v1/object/public/site-images/guide/mx-park.png',
      },
      {
        name: 'Desert Tortoise Natural Area',
        description: '40-square-mile preserve protecting endangered desert tortoises — self-guided nature trails and wildlife viewing',
        image: 'https://mbazrezahuojknfgcwou.supabase.co/storage/v1/object/public/site-images/guide/desert-tortoise.png',
      },
      {
        name: 'Mojave Desert Stargazing',
        description: 'World-class dark skies for stargazing and astrophotography — Milky Way visible with the naked eye',
        image: 'https://mbazrezahuojknfgcwou.supabase.co/storage/v1/object/public/site-images/guide/desert-stargazing.png',
      },
    ],
    importantLocations: [
      { name: 'City Hall', detail: '21000 Hacienda Blvd — (760) 373-8661' },
      { name: 'Police Department', detail: '21000 Hacienda Blvd — (760) 373-4800' },
      { name: 'Fire Station', detail: '21000 Hacienda Blvd — (760) 373-7344' },
      { name: 'Post Office', detail: '7949 California City Blvd' },
      { name: 'Library', detail: '9507 California City Blvd — (760) 373-4757' },
      { name: 'Medical Center', detail: '8001 Cal City Blvd' },
      { name: 'Cal City MX Park', detail: '24510 168th St — (760) 977-9774' },
    ],
    annualEvents: [
      { name: 'Cal City MX Park Open Practice', month: 'Weekly (Sat & Sun)' },
      { name: 'Kern County Fair', month: 'September–October' },
      { name: 'Red Rock Canyon Star Parties', month: 'Various (2 hrs away)' },
    ],
  },

  legal: {
    arbitrationLocation: 'Kern County, California',
    address: '21000 Hacienda Blvd',
    zipCode: '93505',
  },

  contact: {
    phone: '(760) 373-8661',
    email: 'help@tux.st',
  },

  social: {},

  defaults: {
    city: 'California City',
    state: 'CA',
  },
};
