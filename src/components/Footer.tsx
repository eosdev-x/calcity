
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import logo from '../assets/logo.png';
import { siteConfig } from '../config/site';

export function Footer() {
  const hasSocialLinks = Boolean(
    siteConfig.social.facebook || siteConfig.social.twitter || siteConfig.social.instagram
  );
  const quickLinks = [
    { label: 'Events', to: '/events', enabled: siteConfig.features.events },
    { label: 'Businesses', to: '/businesses', enabled: siteConfig.features.businesses },
    { label: 'Pricing', to: '/pricing', enabled: siteConfig.features.businesses },
    { label: 'Visitor Guide', to: '/guide', enabled: siteConfig.features.guide },
    { label: 'Contact', to: '/contact', enabled: true },
  ].filter((link) => link.enabled);

  return (
    <footer className="bg-surface-container mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col md:flex-1">
            <Link to="/" className="inline-block mb-3">
              <img src={logo} alt={siteConfig.name} className="h-16 w-auto" />
            </Link>
            <p className="text-on-surface-variant mt-1">
              Your comprehensive guide to {siteConfig.city}, {siteConfig.state}.
            </p>
          </div>

          <div className="md:flex-1 md:flex md:justify-center">
            <ul className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
              {quickLinks.map((link, index) => (
                <li key={link.to} className="flex items-center">
                  {index > 0 && <span className="mx-2 text-outline-variant">•</span>}
                  <Link to={link.to} className="nav-link">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {hasSocialLinks && (
            <div className="md:flex-1 md:flex md:justify-end">
              <div className="flex space-x-4">
                {siteConfig.social.facebook && (
                  <a 
                    href={siteConfig.social.facebook}
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="nav-link"
                  >
                    <Facebook className="w-6 h-6" />
                  </a>
                )}
                {siteConfig.social.twitter && (
                  <a 
                    href={siteConfig.social.twitter}
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="nav-link"
                  >
                    <Twitter className="w-6 h-6" />
                  </a>
                )}
                {siteConfig.social.instagram && (
                  <a 
                    href={siteConfig.social.instagram}
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="nav-link"
                  >
                    <Instagram className="w-6 h-6" />
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 pt-8 border-t border-outline-variant">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-on-surface-variant">
              © 2025 {siteConfig.name}. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <Link to="/privacy" className="nav-link">Privacy Policy</Link>
              <Link to="/terms" className="nav-link">Terms of Service</Link>
              <div className="ml-2">
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
