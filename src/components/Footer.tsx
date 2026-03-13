
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import logo from '../assets/logo.svg';

export function Footer() {
  return (
    <footer className="bg-surface-container mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col">
            <Link to="/" className="inline-block mb-3">
              <img src={logo} alt="CalCity.info" className="h-16 w-auto max-w-[90%]" />
            </Link>
            <p className="text-on-surface-variant mt-1">
              Your comprehensive guide to California City, California.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-on-surface">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/events" className="nav-link">Events</Link></li>
              <li><Link to="/businesses" className="nav-link">Businesses</Link></li>
              <li><Link to="/pricing" className="nav-link">Pricing</Link></li>
              <li><Link to="/guide" className="nav-link">Visitor Guide</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-on-surface">Contact</h4>
            <ul className="space-y-2">
              <li>
                <a 
                  href="mailto:info@calcity.info" 
                  className="flex items-center space-x-2 nav-link"
                >
                  <Mail className="w-4 h-4" />
                  <span>info@calcity.info</span>
                </a>
              </li>
              <li>
                <a 
                  href="tel:+15551234567" 
                  className="flex items-center space-x-2 nav-link"
                >
                  <Phone className="w-4 h-4" />
                  <span>(555) 123-4567</span>
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-on-surface">Follow Us</h4>
            <div className="flex space-x-4">
              <a 
                href="https://facebook.com/calcityinfo" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="nav-link"
              >
                <Facebook className="w-6 h-6" />
              </a>
              <a 
                href="https://twitter.com/calcityinfo" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="nav-link"
              >
                <Twitter className="w-6 h-6" />
              </a>
              <a 
                href="https://instagram.com/calcityinfo" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="nav-link"
              >
                <Instagram className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-outline-variant">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-on-surface-variant">
              © 2025 CalCity.info. All rights reserved.
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
