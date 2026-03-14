export function useBusinessPermissions(tier: 'free' | 'basic' | 'premium' | 'spotlight') {
  return {
    canShowDescription: true,
    canShowWebsite: tier !== 'free',
    canShowGallery: tier === 'premium' || tier === 'spotlight',
    canShowSocial: tier === 'premium' || tier === 'spotlight',
    canShowAmenities: tier === 'premium' || tier === 'spotlight',
    canShowServices: tier !== 'free',
    maxPhotos:
      tier === 'free'
        ? 0
        : tier === 'basic'
          ? 3
          : tier === 'premium'
            ? 10
            : 30,
    hasBadge: tier === 'premium' || tier === 'spotlight',
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
    isFeatured: tier === 'premium' || tier === 'spotlight',
    isSpotlight: tier === 'spotlight',
  };
}

// Standalone helper for components that don't use the full hook
export function getTierBadge(tier: 'free' | 'basic' | 'premium' | 'spotlight') {
  if (tier === 'spotlight') {
    return { text: '⭐ Spotlight', className: 'bg-tertiary-container text-on-tertiary-container' };
  }
  if (tier === 'premium') {
    return { text: '✨ Premium', className: 'bg-secondary-container text-on-secondary-container' };
  }
  return null;
}
