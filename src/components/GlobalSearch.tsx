import { useState, useEffect, useRef } from 'react';
import { Search, X, Building2, Calendar, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useBusinesses } from '../context/BusinessContext';
import { useEvents } from '../context/EventContext';
import { Business } from '../types/business';
import { Event } from '../types/event';

type SearchResultType = 'business' | 'event';

interface SearchResult {
  id: number;
  title: string;
  type: SearchResultType;
  subtitle: string;
  image: string;
  isPremium?: boolean;
}

export function GlobalSearch() {
  const navigate = useNavigate();
  const { businesses } = useBusinesses();
  const { events } = useEvents();
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'businesses' | 'events'>('all');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  // Load search history from localStorage on mount
  useEffect(() => {
    const storedHistory = localStorage.getItem('searchHistory');
    if (storedHistory) {
      try {
        setSearchHistory(JSON.parse(storedHistory));
      } catch (error) {
        console.error('Failed to parse search history:', error);
      }
    }
  }, []);

  // Save search history to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
  }, [searchHistory]);

  // Handle click outside to close results
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Search functionality
  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    
    // Simulate search delay for real-time feel
    const timer = setTimeout(() => {
      const query = searchTerm.toLowerCase().trim();
      
      // Search businesses
      const businessResults: SearchResult[] = activeFilter !== 'events' 
        ? businesses
            .filter(business => 
              business.name.toLowerCase().includes(query) || 
              business.description.toLowerCase().includes(query) ||
              business.category.toLowerCase().includes(query)
            )
            .slice(0, 5)
            .map(business => mapBusinessToSearchResult(business))
        : [];
      
      // Search events
      const eventResults: SearchResult[] = activeFilter !== 'businesses'
        ? events
            .filter(event => 
              event.title.toLowerCase().includes(query) || 
              event.description.toLowerCase().includes(query) ||
              event.category.toLowerCase().includes(query) ||
              event.tags.some(tag => tag.toLowerCase().includes(query))
            )
            .slice(0, 5)
            .map(event => mapEventToSearchResult(event))
        : [];
      
      // Combine and sort results
      const combinedResults = [...businessResults, ...eventResults]
        .sort((a, b) => a.title.localeCompare(b.title))
        .slice(0, 8); // Limit to 8 total results
      
      setResults(combinedResults);
      setIsSearching(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchTerm, businesses, events, activeFilter]);

  // Map business to search result format
  const mapBusinessToSearchResult = (business: Business): SearchResult => ({
    id: business.id,
    title: business.name,
    type: 'business',
    subtitle: business.category,
    image: business.image,
    isPremium: false // In a real app, this would be determined by the business tier
  });

  // Map event to search result format
  const mapEventToSearchResult = (event: Event): SearchResult => ({
    id: event.id,
    title: event.title,
    type: 'event',
    subtitle: `${event.date} • ${event.category}`,
    image: event.image
  });

  // Handle search submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) return;
    
    // Add to search history if not already present
    if (!searchHistory.includes(searchTerm)) {
      setSearchHistory(prev => [searchTerm, ...prev].slice(0, 5));
    }
    
    // Navigate to appropriate page based on filter
    if (activeFilter === 'businesses') {
      navigate(`/businesses?search=${encodeURIComponent(searchTerm)}`);
    } else if (activeFilter === 'events') {
      navigate(`/events?search=${encodeURIComponent(searchTerm)}`);
    } else {
      // For 'all', we'll show a combined results page (not implemented yet)
      // For now, just navigate to businesses with the search term
      navigate(`/businesses?search=${encodeURIComponent(searchTerm)}`);
    }
    
    setShowResults(false);
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm('');
    setResults([]);
  };

  return (
    <div 
      ref={searchRef}
      className="w-full max-w-3xl mx-auto relative z-10"
    >
      <form 
        onSubmit={handleSearchSubmit}
        className="relative"
      >
        {/* Filter tabs - moved above search field */}
        <div className="flex justify-center mb-3 space-x-3">
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`px-5 py-2 rounded-full text-base font-medium transition-colors duration-[var(--md-sys-motion-duration-short3)] ${
              activeFilter === 'all' 
                ? 'bg-primary text-on-primary' 
                : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('businesses')}
            className={`px-5 py-2 rounded-full text-base font-medium transition-colors duration-[var(--md-sys-motion-duration-short3)] ${
              activeFilter === 'businesses' 
                ? 'bg-primary text-on-primary' 
                : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            <Building2 className="inline-block w-4 h-4 mr-1" />
            Businesses
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('events')}
            className={`px-5 py-2 rounded-full text-base font-medium transition-colors duration-[var(--md-sys-motion-duration-short3)] ${
              activeFilter === 'events' 
                ? 'bg-primary text-on-primary' 
                : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            <Calendar className="inline-block w-4 h-4 mr-1" />
            Events
          </button>
        </div>
        
        <div className="relative flex items-center">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowResults(true);
            }}
            onFocus={() => setShowResults(true)}
            placeholder="Search businesses, events, and more..."
            className="w-full h-14 pl-12 pr-12 rounded-full border border-outline bg-surface-container-high 
                      text-on-surface placeholder-on-surface-variant shadow-sm focus:outline-none focus:ring-2 
                      focus:ring-primary focus:border-primary text-lg"
          />
          <Search className="absolute left-4 w-6 h-6 text-on-surface-variant" />
          {searchTerm && (
            <button
              type="button"
              onClick={clearSearch}
            className="absolute right-14 w-6 h-6 text-on-surface-variant hover:text-primary transition-colors duration-[var(--md-sys-motion-duration-short3)]"
            >
              <X size={20} />
            </button>
          )}
          <button
            type="submit"
            className="absolute right-3 bg-primary hover:bg-primary/90 text-on-primary rounded-full p-2 transition-colors duration-[var(--md-sys-motion-duration-short3)]"
          >
            <ArrowRight size={20} />
          </button>
        </div>
      </form>
      
      {/* Search results dropdown */}
      {showResults && (searchTerm || searchHistory.length > 0) && (
        <div className="absolute w-full mt-2 bg-surface-container-high rounded-xl elevation-2 border border-outline-variant max-h-96 overflow-y-auto">
          {isSearching ? (
            <div className="p-4 text-center text-on-surface-variant">
              <div className="animate-pulse">Searching...</div>
            </div>
          ) : (
            <>
              {searchTerm && results.length === 0 ? (
                <div className="p-4 text-center text-on-surface-variant">
                  No results found for "{searchTerm}"
                </div>
              ) : (
                <>
                  {/* Search results */}
                  {results.length > 0 && (
                    <div className="divide-y divide-outline-variant">
                      {results.map((result) => (
                        <Link
                          key={`${result.type}-${result.id}`}
                          to={result.type === 'business' ? `/businesses/${result.id}` : `/events/${result.id}`}
                          className="flex items-center p-3 hover:bg-surface-container transition-colors duration-[var(--md-sys-motion-duration-short3)]"
                          onClick={() => setShowResults(false)}
                        >
                          <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                            <img 
                              src={result.image} 
                              alt={result.title} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="ml-3 flex-grow">
                            <div className="flex items-center">
                              <h4 className="font-medium text-on-surface">{result.title}</h4>
                              {result.isPremium && (
                                <span className="ml-2 px-2 py-0.5 bg-secondary-container text-on-secondary-container text-xs rounded-lg">
                                  Premium
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-on-surface-variant">{result.subtitle}</p>
                          </div>
                          <div className="ml-2 flex-shrink-0">
                            {result.type === 'business' ? (
                              <Building2 className="w-4 h-4 text-on-surface-variant" />
                            ) : (
                              <Calendar className="w-4 h-4 text-on-surface-variant" />
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                  
                  {/* Search history (show only if no current results or search term) */}
                  {(!searchTerm || results.length === 0) && searchHistory.length > 0 && (
                    <div className="p-2">
                      <h4 className="text-xs uppercase text-on-surface-variant font-semibold px-2 py-1">
                        Recent Searches
                      </h4>
                      <div className="divide-y divide-outline-variant">
                        {searchHistory.map((term, index) => (
                          <button
                            key={index}
                            className="w-full text-left px-3 py-2 hover:bg-surface-container transition-colors duration-[var(--md-sys-motion-duration-short3)] text-on-surface-variant"
                            onClick={() => {
                              setSearchTerm(term);
                              // Don't hide results to show the search results for this term
                            }}
                          >
                            <Search className="inline-block w-3 h-3 mr-2 text-on-surface-variant" />
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
