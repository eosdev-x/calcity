import { Business } from '../types/business';
import { supabase } from '../lib/supabase';

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export async function submitBusiness(business: Omit<Business, 'id'>): Promise<Business> {
  const payload: Omit<Business, 'id'> = {
    ...business,
    slug: business.slug || slugify(business.name)
  };

  const { data, error } = await supabase
    .from('businesses')
    .insert(payload)
    .select('*')
    .single();

  if (error || !data) {
    throw new Error(error?.message || 'Failed to submit business');
  }

  return data;
}

// Mock function to get business categories
export function getBusinessCategories(): string[] {
  // In a real application, this would be fetched from the backend
  return [
    'Restaurant',
    'Automotive',
    'Lodging',
    'Outdoor Recreation',
    'Grocery',
    'Technology',
    'Healthcare',
    'Real Estate',
    'Education',
    'Retail',
    'Professional Services',
    'Arts & Entertainment'
  ];
}
