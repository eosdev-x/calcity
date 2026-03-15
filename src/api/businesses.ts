import { Business } from '../types/business';
import { supabase } from '../lib/supabase';
import { slugify } from '../utils/slugify';

export async function submitBusiness(business: Omit<Business, 'id'>): Promise<Business> {
  const sanitizedBusiness = {
    ...business
  } as Omit<Business, 'id'> & { status?: Business['status']; approved_at?: string | null };
  delete sanitizedBusiness.status;
  delete sanitizedBusiness.approved_at;
  const payload: Omit<Business, 'id'> = {
    ...sanitizedBusiness,
    slug: sanitizedBusiness.slug || slugify(sanitizedBusiness.name),
    status: 'pending'
  };

  const { data, error } = await supabase
    .from('businesses')
    .insert(payload)
    .select('*')
    .single();

  if (error || !data) {
    throw new Error(error?.message || 'Failed to submit business');
  }

  // Notify admin of new submission (fire-and-forget, don't block on failure)
  fetch('/api/notify-submission', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ businessId: data.id }),
  }).catch(() => {});

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
