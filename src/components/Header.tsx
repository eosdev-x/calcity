import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <header className="bg-white dark:bg-night-desert-100 shadow-desert sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-display font-bold text-desert-800 dark:text-desert-100">
            CalCity.info
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/events" className="nav-link">Events</Link>
            <Link to="/businesses" className="nav-link">Businesses</Link>
            <Link to="/pricing" className="nav-link">Pricing</Link>
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-desert-800 dark:text-desert-100" />
            ) : (
              <Menu className="w-6 h-6 text-desert-800 dark:text-desert-100" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 space-y-4 pb-4">
            <Link
              to="/events"
              className="block nav-link py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Events
            </Link>
            <Link
              to="/businesses"
              className="block nav-link py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Businesses
            </Link>
            <Link
              to="/pricing"
              className="block nav-link py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </Link>
            <div className="pt-2">
              <ThemeToggle />
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}