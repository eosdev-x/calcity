import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, LogOut, Settings, ChevronDown, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function UserProfileDropdown() {
  const { user, profile, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle sign out
  const handleSignOut = async () => {
    try {
      console.log('Signing out...');
      await signOut();
      console.log('Sign out successful');
      setIsOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Error during sign out:', error);
    }
  };

  // Get user initials for avatar
  const getInitials = () => {
    if (profile?.full_name) {
      return profile.full_name
        .split(' ')
        .map(name => name[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
    }
    
    return user?.email?.substring(0, 2).toUpperCase() || 'U';
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 focus:outline-none"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {profile?.avatar_url ? (
          <img
            src={profile.avatar_url}
            alt={profile.full_name || 'User'}
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center text-sm font-medium">
            {getInitials()}
          </div>
        )}
        <span className="hidden md:block text-sm font-medium text-on-surface">
          {profile?.full_name || user?.email?.split('@')[0] || 'User'}
        </span>
        <ChevronDown className="w-4 h-4 text-on-surface-variant" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-surface-container-high rounded-xl elevation-2 py-1 z-50 border border-outline-variant">
          <div className="px-4 py-2 border-b border-outline-variant">
            <p className="text-sm font-medium text-on-surface">
              {profile?.full_name || 'User'}
            </p>
            <p className="text-xs text-on-surface-variant truncate">
              {user?.email}
            </p>
          </div>
          
          <Link
            to="/profile"
            className="block px-4 py-2 text-sm text-on-surface-variant hover:bg-surface-container-high flex items-center transition-colors duration-[var(--md-sys-motion-duration-short3)]"
            onClick={() => setIsOpen(false)}
          >
            <User className="w-4 h-4 mr-2" />
            Your Profile
          </Link>

          <Link
            to="/dashboard"
            className="block px-4 py-2 text-sm text-on-surface-variant hover:bg-surface-container-high flex items-center transition-colors duration-[var(--md-sys-motion-duration-short3)]"
            onClick={() => setIsOpen(false)}
          >
            <LayoutDashboard className="w-4 h-4 mr-2" />
            Dashboard
          </Link>
          
          <Link
            to="/profile/settings"
            className="block px-4 py-2 text-sm text-on-surface-variant hover:bg-surface-container-high flex items-center transition-colors duration-[var(--md-sys-motion-duration-short3)]"
            onClick={() => setIsOpen(false)}
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Link>
          
          <button
            onClick={handleSignOut}
            className="block w-full text-left px-4 py-2 text-sm text-error hover:bg-error-container flex items-center transition-colors duration-[var(--md-sys-motion-duration-short3)]"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
