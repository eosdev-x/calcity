import { Event } from '../types/event';
import { supabase } from '../lib/supabase';

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export async function submitEvent(event: Omit<Event, 'id'>): Promise<Event> {
  const payload: Omit<Event, 'id'> = {
    ...event,
    slug: event.slug || slugify(event.title)
  };

  const { data, error } = await supabase
    .from('events')
    .insert(payload)
    .select('*')
    .single();

  if (error || !data) {
    throw new Error(error?.message || 'Failed to submit event');
  }

  return data;
}

// Mock function to get event categories
export function getEventCategories(): string[] {
  // In a real application, this would be fetched from the backend
  return [
    'Arts & Culture',
    'Community',
    'Science & Nature',
    'Food & Drink',
    'Sports',
    'Education',
    'Business',
    'Health & Wellness',
    'Technology',
    'Family & Kids',
    'Music',
    'Outdoors'
  ];
}

// Helper function to format date for input fields
export function formatDateForInput(date: Date): string {
  return date.toISOString().split('T')[0];
}

// Helper function to get the current date formatted for input fields
export function getCurrentDate(): string {
  return formatDateForInput(new Date());
}

// Helper function to get a date 1 year from now formatted for input fields
export function getOneYearFromNow(): string {
  const date = new Date();
  date.setFullYear(date.getFullYear() + 1);
  return formatDateForInput(date);
}
