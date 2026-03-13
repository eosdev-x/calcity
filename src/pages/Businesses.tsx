import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { MapPin, Phone, Globe, Star, Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Business } from '../types/business';
import { BusinessHoursStatus } from '../components/BusinessHoursStatus';
import { useBusinesses } from '../context/BusinessContext';
import { getTierBadge } from '../hooks/useBusinessPermissions';

export function Businesses() {
  const location = useLocation();
  
  // State for search, filter, and sort functionality
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [sortOption, setSortOption] = useState<'name' | 'rating'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filteredBusinesses, setFilteredBusinesses] = useState<Business[]>([]);
  
  // Get businesses from context instead of using static data
  const { businesses } = useBusinesses();

  const tierPriority: Record<Business['subscription_tier'], number> = {
    spotlight: 0,
    premium: 1,
    basic: 2,
  };

  const getTierBorder = (tier: Business['subscription_tier']) => {
    if (tier === 'spotlight') return 'border border-tertiary/50';
    if (tier === 'premium') return 'border border-primary/30';
    return 'border border-transparent';
  };
  
  // Parse search parameters from URL when component mounts or URL changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search');
    if (searchParam) {
      setSearchTerm(searchParam);
    }
  }, [location.search]);

  // Extract unique categories for the filter dropdown
  const categories = Array.from(new Set(businesses.map(business => business.category)));

  // Filter and sort businesses when dependencies change
  useEffect(() => {
    let results = [...businesses];
    
    // Apply search filter
    if (searchTerm) {
      results = results.filter(business => 
        business.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply category filter
    if (selectedCategory) {
      results = results.filter(business => business.category === selectedCategory);
    }
    
    // Apply sorting
    results.sort((a, b) => {
      const tierDiff = tierPriority[a.subscription_tier] - tierPriority[b.subscription_tier];
      if (tierDiff !== 0) {
        return tierDiff;
      }
      if (sortOption === 'name') {
        return sortDirection === 'asc' 
          ? a.name.localeCompare(b.name) 
          : b.name.localeCompare(a.name);
      } else {
        return sortDirection === 'asc' 
          ? a.rating - b.rating 
          : b.rating - a.rating;
      }
    });
    
    setFilteredBusinesses(results);
  }, [businesses, searchTerm, selectedCategory, sortOption, sortDirection]);

  // Toggle sort direction
  const toggleSortDirection = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="min-h-screen bg-surface py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-display font-bold text-on-surface">
            Local Businesses
          </h1>
          <Link to="/businesses/new" className="btn-primary">
            Add Your Business
          </Link>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-surface-container-low rounded-xl shadow-sm p-6 mb-8 border border-outline-variant">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Search Input - Now takes more space on larger screens */}
            <div className="relative flex-grow md:max-w-xl">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-on-surface-variant" />
              </div>
              <input
                type="text"
                placeholder="Search businesses by name..."
                className="pl-10 w-full h-12 rounded-xl border border-outline bg-surface-container-high text-on-surface focus:ring-primary focus:border-primary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              {/* Category Filter */}
              <div className="relative w-full sm:w-56">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SlidersHorizontal className="h-5 w-5 text-on-surface-variant" />
                </div>
                <select
                  className="pl-10 w-full h-12 rounded-xl border border-outline bg-surface-container-high text-on-surface focus:ring-primary focus:border-primary appearance-none cursor-pointer pr-10"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  aria-label="Filter by category"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-on-surface-variant" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              {/* Sort Options */}
              <div className="flex items-center space-x-2 h-12">
                <label className="text-on-surface-variant text-sm font-medium whitespace-nowrap">Sort by:</label>
                <select
                  className="rounded-xl border border-outline bg-surface-container-high text-on-surface focus:ring-primary focus:border-primary h-full"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value as 'name' | 'rating')}
                >
                  <option value="name">Name</option>
                  <option value="rating">Rating</option>
                </select>
                <button 
                  onClick={toggleSortDirection}
                  className="p-2 h-full rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors duration-[var(--md-sys-motion-duration-short3)]"
                  aria-label={`Sort ${sortDirection === 'asc' ? 'ascending' : 'descending'}`}
                >
                  <ArrowUpDown className={`h-5 w-5 text-on-surface-variant ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 text-on-surface-variant">
          Found {filteredBusinesses.length} business{filteredBusinesses.length !== 1 ? 'es' : ''}
        </div>

        {/* Business Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBusinesses.length > 0 ? (
            filteredBusinesses.map((business) => {
              const badge = getTierBadge(business.subscription_tier);
              return (
            <div
              key={business.id}
              className={`card hover:shadow-md transition-shadow duration-[var(--md-sys-motion-duration-medium2)] ${getTierBorder(
                business.subscription_tier
              )}`}
            >
              <Link to={`/businesses/${business.id}`}>
                <img
                  src={business.image || ''}
                  alt={business.name}
                  className="w-full h-48 object-cover rounded-t-xl mb-4 hover:opacity-90 transition-opacity duration-[var(--md-sys-motion-duration-short3)]"
                />
              </Link>
              <div className="flex items-center justify-between mb-2">
                <Link to={`/businesses/${business.id}`}>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-semibold hover:text-primary transition-colors duration-[var(--md-sys-motion-duration-short3)]">
                      {business.name}
                    </h3>
                    {badge && (
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${badge.className}`}
                      >
                        {badge.text}
                      </span>
                    )}
                    {business.is_featured && (
                      <Star className="w-4 h-4 text-primary fill-current" aria-label="Featured business" />
                    )}
                  </div>
                </Link>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-on-surface-variant fill-current" />
                  <span className="ml-1">{business.rating}</span>
                </div>
              </div>
              
              <p className="text-on-surface-variant mb-2">
                {business.category}
              </p>

              <BusinessHoursStatus hours={business.hours} className="mb-4" />

              <div className="space-y-2 mb-4">
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(business.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-on-surface-variant hover:text-primary transition-colors duration-[var(--md-sys-motion-duration-short3)]"
                >
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <span className="hover:underline">{business.address}</span>
                </a>
                <a
                  href={`tel:${business.phone.replace(/[^\d]/g, '')}`}
                  className="flex items-center space-x-2 text-on-surface-variant hover:text-primary transition-colors duration-[var(--md-sys-motion-duration-short3)]"
                >
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <span className="hover:underline">{business.phone}</span>
                </a>
                {business.website && (
                  <a
                    href={`https://${business.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-on-surface-variant hover:text-primary transition-colors duration-[var(--md-sys-motion-duration-short3)]"
                  >
                    <Globe className="w-4 h-4 flex-shrink-0" />
                    <span className="hover:underline">{business.website}</span>
                  </a>
                )}
              </div>

              <Link 
                to={`/businesses/${business.id}`}
                className="btn-secondary w-full block text-center"
              >
                View Details
              </Link>
            </div>
          );
          })) : (
            <div className="col-span-3 text-center py-12">
              <p className="text-xl text-on-surface-variant">
                No businesses found matching your search criteria.
              </p>
              <button 
                className="mt-4 btn-secondary"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('');
                  setSortOption('name');
                  setSortDirection('asc');
                }}
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
