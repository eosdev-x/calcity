import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { siteConfig } from '../config/site';

export function NotFound() {
  return (
    <div className="min-h-screen bg-surface py-16">
      <SEO title="Page Not Found" path="/404" noindex />
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto card text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-tertiary mb-2">
            404 Error
          </p>
          <h1 className="text-3xl font-semibold text-on-surface mb-3">We can't find that page</h1>
          <p className="text-on-surface-variant mb-6">
            The page you&apos;re looking for doesn&apos;t exist or has been moved. Head back to {siteConfig.name}
            to keep exploring.
          </p>
          <Link to="/" className="btn-primary inline-flex justify-center">
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
