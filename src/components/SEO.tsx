import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { siteConfig } from '../config/site';

export type SEOProps = {
  title?: string;
  description?: string;
  path?: string;
  type?: 'website' | 'article' | 'event' | 'product';
  image?: string;
  noindex?: boolean;
};

export function SEO({
  title,
  description,
  path,
  type = 'website',
  image,
  noindex = false,
}: SEOProps) {
  const location = useLocation();
  const resolvedPath = path ?? location.pathname;
  const canonicalUrl = `https://${siteConfig.domain}${resolvedPath}`;
  const metaTitle = title || siteConfig.name;
  const resolvedDescription = description ?? (noindex ? undefined : siteConfig.seo.defaultDescription);
  const defaultImage = siteConfig.seo.defaultImage?.trim() ? siteConfig.seo.defaultImage : undefined;
  const resolvedImage = image || defaultImage;
  const robots = noindex ? 'noindex, nofollow' : 'index, follow';

  return (
    <Helmet>
      <title>{metaTitle}</title>
      <meta name="robots" content={robots} />
      {resolvedDescription && <meta name="description" content={resolvedDescription} />}
      <link rel="canonical" href={canonicalUrl} />

      <meta property="og:title" content={metaTitle} />
      {resolvedDescription && <meta property="og:description" content={resolvedDescription} />}
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={type} />
      {resolvedImage && <meta property="og:image" content={resolvedImage} />}
      <meta property="og:site_name" content={siteConfig.name} />
      <meta property="og:locale" content="en_US" />

      <meta name="twitter:card" content={resolvedImage ? 'summary_large_image' : 'summary'} />
      {siteConfig.seo.twitterHandle && (
        <meta name="twitter:site" content={siteConfig.seo.twitterHandle} />
      )}
      {siteConfig.seo.twitterHandle && (
        <meta name="twitter:creator" content={siteConfig.seo.twitterHandle} />
      )}
      <meta name="twitter:title" content={metaTitle} />
      {resolvedDescription && <meta name="twitter:description" content={resolvedDescription} />}
      {resolvedImage && <meta name="twitter:image" content={resolvedImage} />}
    </Helmet>
  );
}
