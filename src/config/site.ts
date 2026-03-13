export interface SiteConfig {
  // Identity
  name: string;
  city: string;
  state: string;
  tagline: string;
  domain: string;

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
    basicPriceId: string;
    premiumPriceId: string;
    spotlightPriceId: string;
  };

  // Guide content
  guide: {
    gettingHere: string;
    attractions: string;
    importantLocations: { name: string; detail: string }[];
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
    basicPriceId: import.meta.env.VITE_STRIPE_BASIC_PRICE_ID || 'price_1TASQfRpRbHjjRj8mXv5x9rB',
    premiumPriceId: import.meta.env.VITE_STRIPE_PREMIUM_PRICE_ID || 'price_1TASRPRpRbHjjRj8rZMNIJ4i',
    spotlightPriceId: import.meta.env.VITE_STRIPE_SPOTLIGHT_PRICE_ID || 'price_1TASSRRpRbHjjRj8nfJz5gSc',
  },

  guide: {
    gettingHere: 'California City is easily accessible via Highway 14 and Highway 58. The nearest major airports are Mojave Air & Space Port (30 minutes) and Los Angeles International Airport (LAX, 2 hours).',
    attractions: "Don't miss Central Park with its 26-acre lake, the California City Municipal Airport, and the Tierra Del Sol Golf Course. The surrounding desert offers excellent opportunities for off-road adventures and stargazing.",
    importantLocations: [
      { name: 'City Hall', detail: '21000 Hacienda Blvd' },
      { name: 'Post Office', detail: '7949 California City Blvd' },
      { name: 'Medical Center', detail: '8001 Cal City Blvd' },
      { name: 'Fire Station', detail: '21000 Hacienda Blvd' },
    ],
  },

  social: {},

  defaults: {
    city: 'California City',
    state: 'CA',
  },
};
