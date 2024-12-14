import React from 'react';
import { Menu, X } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { Link, useLocation } from 'react-router-dom';

const NavLink: React.FC<{ to: string; children: React.ReactNode }> = ({
  to,
  children,
}) => (
  <Link
    to={to}
    className="text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white button-hover px-3 py-2 rounded-md text-sm font-medium"
  >
    {children}
  </Link>
);

const MobileNavLink: React.FC<{ to: string; children: React.ReactNode }> = ({
  to,
  children,
}) => (
  <Link
    to={to}
    className="text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white block px-3 py-2 rounded-md text-base font-medium button-hover"
  >
    {children}
  </Link>
);

export const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg fixed w-full z-50 transition-colors duration-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-gray-900 dark:text-white">California City</Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink to="/attractions">Attractions</NavLink>
            <NavLink to="/events">Events</NavLink>
            <NavLink to="/businesses">Businesses</NavLink>
            <NavLink to="/contact">Contact</NavLink>
            <ThemeToggle />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white button-hover"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <MobileNavLink to="/attractions">Attractions</MobileNavLink>
              <MobileNavLink to="/events">Events</MobileNavLink>
              <MobileNavLink to="/businesses">Businesses</MobileNavLink>
              <MobileNavLink to="/contact">Contact</MobileNavLink>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};