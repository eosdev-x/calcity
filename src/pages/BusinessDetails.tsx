import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Phone, 
  Globe, 
  
  Clock,
  ArrowLeft,
  Facebook,
  Twitter,
  Instagram,
  Check
} from 'lucide-react';
import { BusinessGallery } from '../components/BusinessGallery';
import { BusinessHoursStatus } from '../components/BusinessHoursStatus';
import { useBusinesses } from '../context/BusinessContext';
import { useAuth } from '../context/AuthContext';
import { useBusinessPermissions } from '../hooks/useBusinessPermissions';
import { useAnalytics } from '../hooks/useAnalytics';
import { siteConfig } from '../config/site';
import { SEO } from '../components/SEO';
import { Helmet } from 'react-helmet-async';
import { buildBreadcrumbListJsonLd, buildLocalBusinessJsonLd } from '../utils/jsonLd';
import { truncateText } from '../utils/seo';

function UpgradeCard({ label }: { label: string }) {
  return (
    <div className="rounded-xl border border-outline-variant bg-surface-container-low p-6 text-on-surface-variant">
      <p className="text-sm font-medium text-on-surface mb-1">{label}</p>
      <p className="text-sm">Upgrade to Premium to unlock.</p>
    </div>
  );
}

export function BusinessDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { businesses, loading } = useBusinesses();
  const { user } = useAuth();
  const { trackView } = useAnalytics();

  const business = businesses.find(b => b.id === id);
  const permissions = useBusinessPermissions(business?.subscription_tier ?? 'free');
  const isOwner = user?.id === business?.owner_id;
  const hasSocialLinks = Boolean(
    business?.social_media?.facebook ||
      business?.social_media?.twitter ||
      business?.social_media?.instagram
  );

  useEffect(() => {
    if (business?.status === 'active') {
      void trackView(business.id);
    }
  }, [business?.id, business?.status, trackView]);

  if (loading) {
    return null;
  }

  if (!business) {
    navigate('/businesses');
    return null;
  }

  const description = truncateText(business.description || siteConfig.seo.defaultDescription, 160);
  const businessJsonLd = buildLocalBusinessJsonLd(business, siteConfig);
  const breadcrumbsJsonLd = buildBreadcrumbListJsonLd(
    [
      { name: siteConfig.seo.pages.homeTitle, path: '/' },
      { name: siteConfig.seo.pages.businessesTitle, path: '/businesses' },
      { name: business.name, path: `/businesses/${business.id}` },
    ],
    siteConfig
  );

  return (
    <div className="min-h-screen bg-surface py-12">
      <SEO
        title={business.name}
        description={description}
        path={`/businesses/${business.id}`}
        type="website"
        image={business.image || undefined}
      />
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(businessJsonLd)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbsJsonLd)}
        </script>
      </Helmet>
      <div className="container mx-auto px-4">
        {/* Navigation */}
        <button
          onClick={() => navigate('/businesses')}
          className="flex items-center text-on-surface-variant hover:text-primary mb-6 transition-colors duration-[var(--md-sys-motion-duration-short3)]"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Businesses
        </button>

        {/* Hero Section */}
        <div className="relative h-[400px] rounded-xl overflow-hidden mb-8">
          <img
            src={business.image || ''}
            alt={business.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-scrim/70 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h1 className="text-4xl font-display font-bold text-inverse-on-surface">
                    {business.name}
                  </h1>
                  {permissions.hasBadge && (
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${permissions.badgeClass}`}
                    >
                      {permissions.badgeText}
                    </span>
                  )}
                </div>
                <div className="flex items-center text-inverse-on-surface">
                  <span className="text-inverse-on-surface">{business.category}</span>
                </div>
              </div>
              <BusinessHoursStatus hours={business.hours} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {permissions.canShowDescription ? (
              <div className="card mb-8">
                <h2 className="text-2xl font-semibold mb-4">About</h2>
                <p className="text-on-surface-variant">
                  {business.description || ''}
                </p>
              </div>
            ) : (
              isOwner && (
                <div className="mb-8">
                  <UpgradeCard label="About" />
                </div>
              )
            )}

            {permissions.canShowAmenities ? (
              business.amenities.length > 0 && (
                <div className="card mb-8">
                  <h2 className="text-2xl font-semibold mb-6">Amenities</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {business.amenities.map((amenity) => (
                      <div 
                        key={amenity}
                        className="flex items-center text-on-surface-variant"
                      >
                        <Check className="w-5 h-5 text-on-surface-variant mr-2" />
                        {amenity}
                      </div>
                    ))}
                  </div>
                </div>
              )
            ) : (
              isOwner && (
                <div className="mb-8">
                  <UpgradeCard label="Amenities" />
                </div>
              )
            )}

            {permissions.canShowServices ? (
              business.services.length > 0 && (
                <div className="card mb-8">
                  <h2 className="text-2xl font-semibold mb-6">Services</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {business.services.map((service) => (
                      <div 
                        key={service}
                        className="flex items-center text-on-surface-variant"
                      >
                        <Check className="w-5 h-5 text-on-surface-variant mr-2" />
                        {service}
                      </div>
                    ))}
                  </div>
                </div>
              )
            ) : (
              isOwner && (
                <div className="mb-8">
                  <UpgradeCard label="Services" />
                </div>
              )
            )}

            {permissions.canShowGallery ? (
              business.gallery && business.gallery.length > 0 && (
                <div className="card">
                  <h2 className="text-2xl font-semibold mb-6">Gallery</h2>
                  <BusinessGallery images={business.gallery.slice(0, permissions.maxPhotos)} />
                </div>
              )
            ) : (
              isOwner && <UpgradeCard label="Gallery" />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Contact Information */}
            <div className="card">
              <h3 className="text-xl font-semibold mb-4">Contact & Location</h3>
              <div className="space-y-4">
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(business.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-on-surface-variant hover:text-primary transition-colors duration-[var(--md-sys-motion-duration-short3)]"
                >
                  <MapPin className="w-5 h-5 text-on-surface-variant mr-2" />
                  <span className="hover:underline">{business.address}</span>
                </a>
                <a
                  href={`tel:${business.phone.replace(/[^\d]/g, '')}`}
                  className="flex items-center text-on-surface-variant hover:text-primary transition-colors duration-[var(--md-sys-motion-duration-short3)]"
                >
                  <Phone className="w-5 h-5 text-on-surface-variant mr-2" />
                  <span className="hover:underline">{business.phone}</span>
                </a>
                {permissions.canShowWebsite && business.website && (
                  <a
                    href={`https://${business.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-on-surface-variant hover:text-primary transition-colors duration-[var(--md-sys-motion-duration-short3)]"
                  >
                    <Globe className="w-5 h-5 text-on-surface-variant mr-2" />
                    <span className="hover:underline truncate">{business.website}</span>
                  </a>
                )}
                {!permissions.canShowWebsite && isOwner && (
                  <UpgradeCard label="Website link" />
                )}
              </div>

              {permissions.canShowSocial && hasSocialLinks && (
                <div className="mt-6 pt-6 border-t border-outline-variant">
                  <h4 className="font-semibold mb-4">Social Media</h4>
                  <div className="flex space-x-4">
                    {business.social_media.facebook && (
                      <a
                        href={business.social_media.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-on-surface-variant hover:text-primary transition-colors duration-[var(--md-sys-motion-duration-short3)]"
                      >
                        <Facebook className="w-6 h-6" />
                      </a>
                    )}
                    {business.social_media.twitter && (
                      <a
                        href={business.social_media.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-on-surface-variant hover:text-primary transition-colors duration-[var(--md-sys-motion-duration-short3)]"
                      >
                        <Twitter className="w-6 h-6" />
                      </a>
                    )}
                    {business.social_media.instagram && (
                      <a
                        href={business.social_media.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-on-surface-variant hover:text-primary transition-colors duration-[var(--md-sys-motion-duration-short3)]"
                      >
                        <Instagram className="w-6 h-6" />
                      </a>
                    )}
                  </div>
                </div>
              )}
              {!permissions.canShowSocial && isOwner && (
                <div className="mt-6 pt-6 border-t border-outline-variant">
                  <UpgradeCard label="Social media links" />
                </div>
              )}
            </div>

            {/* Business Hours */}
            <div className="card">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Clock className="w-5 h-5 text-on-surface-variant mr-2" />
                Business Hours
              </h3>
              <div className="space-y-2">
                {Object.entries(business.hours).map(([day, hours]) => (
                  <div
                    key={day}
                    className="flex justify-between text-on-surface-variant"
                  >
                    <span>{day}</span>
                    <span>{hours}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
