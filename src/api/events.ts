import { Event } from '../types/event';

// Mock function to simulate API call for submitting a new event
export async function submitEvent(event: Omit<Event, 'id'>): Promise<Event> {
  // In a real application, this would be an API call to a backend service
  // For now, we'll simulate a successful response with a delay
  
  return new Promise((resolve) => {
    setTimeout(() => {
      // Generate a random ID for the new event
      const newEvent: Event = {
        ...event,
        id: Math.floor(Math.random() * 10000) + 100, // Random ID between 100 and 10100
      };
      
      // In a real app, we would save this to a database
      console.log('Event submitted:', newEvent);
      
      resolve(newEvent);
    }, 800); // Simulate network delay
  });
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
