import type { SiteConfig } from '../config/site';
import type { Business } from '../types/business';
import type { Event } from '../types/event';

type BreadcrumbItem = {
  name: string;
  path: string;
};

const absoluteUrl = (siteConfig: SiteConfig, path: string) => {
  return `https://${siteConfig.domain}${path}`;
};

const toOpeningHours = (hours: Record<string, string>) => {
  return Object.entries(hours)
    .filter(([, value]) => value)
    .map(([day, value]) => `${day} ${value}`);
};

export const buildWebSiteJsonLd = (siteConfig: SiteConfig) => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: siteConfig.name,
  url: `https://${siteConfig.domain}`,
  description: siteConfig.seo.defaultDescription,
  potentialAction: {
    '@type': 'SearchAction',
    target: `https://${siteConfig.domain}/businesses?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
});

export const buildLocalBusinessJsonLd = (business: Business, siteConfig: SiteConfig) => {
  const openingHours = toOpeningHours(business.hours);
  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: business.name,
    url: absoluteUrl(siteConfig, `/businesses/${business.id}`),
    telephone: business.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: business.address,
      addressLocality: business.city,
      addressRegion: business.state,
      postalCode: business.zip || undefined,
      addressCountry: 'US',
    },
  };

  if (business.image) {
    jsonLd.image = business.image;
  }

  if (openingHours.length > 0) {
    jsonLd.openingHours = openingHours;
  }

  if (business.review_count > 0) {
    jsonLd.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: business.rating,
      reviewCount: business.review_count,
    };
  }

  return jsonLd;
};

export const buildEventJsonLd = (event: Event, siteConfig: SiteConfig) => {
  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    startDate: event.date,
    endDate: event.end_date || undefined,
    description: event.description,
    url: absoluteUrl(siteConfig, `/events/${event.id}`),
    location: {
      '@type': 'Place',
      name: event.location,
      address: event.address
        ? {
          '@type': 'PostalAddress',
          streetAddress: event.address,
          addressLocality: siteConfig.city,
          addressRegion: siteConfig.state,
          addressCountry: 'US',
        }
        : undefined,
    },
  };

  if (event.image) {
    jsonLd.image = event.image;
  }

  if (event.price) {
    jsonLd.offers = {
      '@type': 'Offer',
      price: event.price,
      priceCurrency: 'USD',
      url: event.ticket_url || absoluteUrl(siteConfig, `/events/${event.id}`),
      availability: 'https://schema.org/InStock',
    };
  }

  return jsonLd;
};

export const buildTouristDestinationJsonLd = (siteConfig: SiteConfig) => ({
  '@context': 'https://schema.org',
  '@type': 'TouristDestination',
  name: `${siteConfig.city}, ${siteConfig.state}`,
  description: siteConfig.seo.pages.guideDescription,
  url: absoluteUrl(siteConfig, '/guide'),
});

export const buildEventsItemListJsonLd = (events: Event[], siteConfig: SiteConfig) => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  itemListElement: events.map((event, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: event.title,
    url: absoluteUrl(siteConfig, `/events/${event.id}`),
  })),
});

export const buildBreadcrumbListJsonLd = (items: BreadcrumbItem[], siteConfig: SiteConfig) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: absoluteUrl(siteConfig, item.path),
  })),
});
