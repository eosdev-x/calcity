import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { MapPin, Phone, Globe, Star, Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Business } from '../types/business';
import { BusinessHoursStatus } from '../components/BusinessHoursStatus';
import { useBusinesses } from '../context/BusinessContext';

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
    <div className="min-h-screen bg-desert-50 dark:bg-night-desert-50 py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-display font-bold text-desert-800 dark:text-desert-100">
            Local Businesses
          </h1>
          <Link to="/businesses/new" className="btn-primary">
            Add Your Business
          </Link>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white dark:bg-night-desert-100 rounded-lg shadow-desert p-4 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-desert-400" />
              </div>
              <input
                type="text"
                placeholder="Search businesses by name..."
                className="pl-10 w-full rounded-md border-desert-300 dark:border-night-desert-300 bg-white dark:bg-night-desert-200 text-desert-800 dark:text-desert-100 focus:ring-desert-500 focus:border-desert-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SlidersHorizontal className="h-5 w-5 text-desert-400" />
              </div>
              <select
                className="pl-10 w-full rounded-md border-desert-300 dark:border-night-desert-300 bg-white dark:bg-night-desert-200 text-desert-800 dark:text-desert-100 focus:ring-desert-500 focus:border-desert-500"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Options */}
            <div className="flex items-center space-x-4">
              <label className="text-desert-700 dark:text-desert-300 text-sm font-medium">Sort by:</label>
              <select
                className="rounded-md border-desert-300 dark:border-night-desert-300 bg-white dark:bg-night-desert-200 text-desert-800 dark:text-desert-100 focus:ring-desert-500 focus:border-desert-500"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as 'name' | 'rating')}
              >
                <option value="name">Name</option>
                <option value="rating">Rating</option>
              </select>
              <button 
                onClick={toggleSortDirection}
                className="p-2 rounded-md bg-desert-100 dark:bg-night-desert-300 hover:bg-desert-200 dark:hover:bg-night-desert-400 transition-colors"
                aria-label={`Sort ${sortDirection === 'asc' ? 'ascending' : 'descending'}`}
              >
                <ArrowUpDown className={`h-5 w-5 text-desert-600 dark:text-desert-300 ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 text-desert-700 dark:text-desert-300">
          Found {filteredBusinesses.length} business{filteredBusinesses.length !== 1 ? 'es' : ''}
        </div>

        {/* Business Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBusinesses.length > 0 ? (
            filteredBusinesses.map((business) => (
            <div key={business.id} className="card hover:shadow-lg transition-shadow duration-300">
              <Link to={`/businesses/${business.id}`}>
                <img
                  src={business.image}
                  alt={business.name}
                  className="w-full h-48 object-cover rounded-t-lg mb-4 hover:opacity-90 transition-opacity"
                />
              </Link>
              <div className="flex items-center justify-between mb-2">
                <Link to={`/businesses/${business.id}`}>
                  <h3 className="text-xl font-semibold hover:text-desert-600 dark:hover:text-desert-400 transition-colors">{business.name}</h3>
                </Link>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-desert-400 fill-current" />
                  <span className="ml-1">{business.rating}</span>
                </div>
              </div>
              
              <p className="text-desert-600 dark:text-desert-400 mb-2">
                {business.category}
              </p>

              <BusinessHoursStatus hours={business.hours} className="mb-4" />

              <div className="space-y-2 mb-4">
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(business.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-desert-700 dark:text-desert-300 hover:text-desert-500 dark:hover:text-desert-400 transition-colors"
                >
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <span className="hover:underline">{business.address}</span>
                </a>
                <a
                  href={`tel:${business.phone.replace(/[^\d]/g, '')}`}
                  className="flex items-center space-x-2 text-desert-700 dark:text-desert-300 hover:text-desert-500 dark:hover:text-desert-400 transition-colors"
                >
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <span className="hover:underline">{business.phone}</span>
                </a>
                <a
                  href={`https://${business.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-desert-700 dark:text-desert-300 hover:text-desert-500 dark:hover:text-desert-400 transition-colors"
                >
                  <Globe className="w-4 h-4 flex-shrink-0" />
                  <span className="hover:underline">{business.website}</span>
                </a>
              </div>

              <Link 
                to={`/businesses/${business.id}`}
                className="btn-secondary w-full block text-center"
              >
                View Details
              </Link>
            </div>
          ))) : (
            <div className="col-span-3 text-center py-12">
              <p className="text-xl text-desert-600 dark:text-desert-400">
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