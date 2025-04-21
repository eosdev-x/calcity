import { Business } from '../types/business';

// Mock function to simulate API call for submitting a new business
export async function submitBusiness(business: Omit<Business, 'id'>): Promise<Business> {
  // In a real application, this would be an API call to a backend service
  // For now, we'll simulate a successful response with a delay
  
  return new Promise((resolve) => {
    setTimeout(() => {
      // Generate a random ID for the new business
      const newBusiness: Business = {
        ...business,
        id: Math.floor(Math.random() * 10000) + 100, // Random ID between 100 and 10100
      };
      
      // In a real app, we would save this to a database
      console.log('Business submitted:', newBusiness);
      
      resolve(newBusiness);
    }, 800); // Simulate network delay
  });
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
