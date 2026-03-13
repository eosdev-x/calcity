export function useBusinessPermissions(tier: 'basic' | 'premium' | 'spotlight') {
  return {
    canShowDescription: tier !== 'basic',
    canShowWebsite: tier !== 'basic',
    canShowGallery: tier !== 'basic',
    canShowSocial: tier !== 'basic',
    canShowAmenities: tier !== 'basic',
    canShowServices: tier !== 'basic',
    maxPhotos: tier === 'basic' ? 1 : tier === 'premium' ? 10 : 30,
    hasBadge: tier !== 'basic',
    badgeText: tier === 'spotlight' ? '⭐ Spotlight' : '✨ Premium',
    badgeClass:
      tier === 'spotlight'
        ? 'bg-tertiary-container text-on-tertiary-container'
        : 'bg-secondary-container text-on-secondary-container',
    isFeatured: tier !== 'basic',
    isSpotlight: tier === 'spotlight',
  };
}
