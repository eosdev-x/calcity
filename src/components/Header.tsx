import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserProfileDropdown } from './auth/UserProfileDropdown';
import logo from '../assets/logo.svg';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, profile, isLoading } = useAuth();

  return (
    <header className="bg-surface-container-low elevation-2 sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center -my-2">
            <img src={logo} alt="CalCity.info" className="h-16 w-auto max-h-[calc(100%-0.5rem)]" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/events" className="nav-link">Events</Link>
            <Link to="/businesses" className="nav-link">Businesses</Link>
            <Link to="/pricing" className="nav-link">Pricing</Link>
            {!isLoading && user && (
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
            )}
            {!isLoading && profile?.role === 'admin' && (
              <Link to="/admin" className="nav-link">Admin</Link>
            )}
            
            {/* Authentication */}
            {!isLoading && (
              user ? (
                <UserProfileDropdown />
              ) : (
                <div className="flex items-center space-x-4">
                  <Link 
                    to="/auth/login" 
                    className="text-on-surface-variant hover:text-primary transition-colors duration-[var(--md-sys-motion-duration-short3)]"
                  >
                    Log in
                  </Link>
                  <Link 
                    to="/auth/signup" 
                    className="btn-primary py-1 px-3 text-sm flex items-center"
                  >
                    <LogIn className="w-4 h-4 mr-1" />
                    Sign up
                  </Link>
                </div>
              )
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-on-surface" />
            ) : (
              <Menu className="w-6 h-6 text-on-surface" />
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
              {!isLoading && profile?.role === 'admin' && (
                <Link
                  to="/admin"
                  className="block nav-link py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin
                </Link>
              )}
              
              {/* Authentication for mobile */}
              {!isLoading && !user && (
                <>
                  <Link
                    to="/auth/login"
                    className="block nav-link py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Log in
                  </Link>
                  <Link
                    to="/auth/signup"
                    className="block nav-link py-2 text-on-surface-variant font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign up
                  </Link>
                </>
              )}
              
              {!isLoading && user && (
                <div className="pt-2 flex items-center justify-end">
                  <div className="pr-2">
                    <UserProfileDropdown />
                  </div>
                </div>
              )}
            </div>
          )}
      </nav>
    </header>
  );
}
