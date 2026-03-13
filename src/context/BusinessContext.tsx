import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Business } from '../types/business';
import { supabase } from '../lib/supabase';

interface BusinessContextType {
  businesses: Business[];
  loading: boolean;
  addBusiness: (business: Omit<Business, 'id'>) => Promise<Business | null>;
  getBusinessById: (id: string) => Business | undefined;
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

export function useBusinesses() {
  const context = useContext(BusinessContext);
  if (context === undefined) {
    throw new Error('useBusinesses must be used within a BusinessProvider');
  }
  return context;
}

interface BusinessProviderProps {
  children: ReactNode;
}

export function BusinessProvider({ children }: BusinessProviderProps) {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchBusinesses = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('status', 'active');

      if (!isMounted) return;

      if (error) {
        setBusinesses([]);
      } else {
        setBusinesses(data ?? []);
      }
      setLoading(false);
    };

    fetchBusinesses();

    return () => {
      isMounted = false;
    };
  }, []);

  const addBusiness = async (business: Omit<Business, 'id'>) => {
    const { data, error } = await supabase
      .from('businesses')
      .insert(business)
      .select('*')
      .single();

    if (error) {
      return null;
    }

    setBusinesses(prevBusinesses => [...prevBusinesses, data]);
    return data;
  };

  const getBusinessById = (id: string) => {
    return businesses.find(business => business.id === id);
  };

  return (
    <BusinessContext.Provider value={{ businesses, loading, addBusiness, getBusinessById }}>
      {children}
    </BusinessContext.Provider>
  );
}
