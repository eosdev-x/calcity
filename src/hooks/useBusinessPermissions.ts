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
    borderClass:
      tier === 'spotlight'
        ? 'border border-tertiary/50'
        : tier === 'premium'
          ? 'border border-primary/30'
          : 'border border-transparent',
    isFeatured: tier !== 'basic',
    isSpotlight: tier === 'spotlight',
  };
}

// Standalone helper for components that don't use the full hook
export function getTierBadge(tier: 'basic' | 'premium' | 'spotlight') {
  if (tier === 'spotlight') {
    return { text: '⭐ Spotlight', className: 'bg-tertiary-container text-on-tertiary-container' };
  }
  if (tier === 'premium') {
    return { text: '✨ Premium', className: 'bg-secondary-container text-on-secondary-container' };
  }
  return null;
}
