import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Business } from '../types/business';

// Initial businesses data
const initialBusinesses: Business[] = [
  {
    id: 1,
    name: "Desert Oasis Cafe",
    category: "Restaurant",
    rating: 4.5,
    address: "123 Main St, California City",
    phone: "(555) 123-4567",
    website: "www.desertoasiscafe.com",
    image: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba",
    description: "A cozy cafe serving fresh, locally-sourced breakfast and lunch in a relaxed desert atmosphere. Known for our homemade pastries and specialty coffee drinks.",
    hours: {
      Monday: "7:00 AM - 3:00 PM",
      Tuesday: "7:00 AM - 3:00 PM",
      Wednesday: "7:00 AM - 3:00 PM",
      Thursday: "7:00 AM - 3:00 PM",
      Friday: "7:00 AM - 3:00 PM",
      Saturday: "8:00 AM - 4:00 PM",
      Sunday: "8:00 AM - 2:00 PM"
    },
    amenities: [
      "Wi-Fi",
      "Outdoor Seating",
      "Wheelchair Accessible",
      "Pet Friendly",
      "Parking Available"
    ],
    socialMedia: {
      facebook: "https://facebook.com/desertoasiscafe",
      instagram: "https://instagram.com/desertoasiscafe",
      twitter: "https://twitter.com/desertoasiscafe"
    }
  },
  {
    id: 2,
    name: "Mojave Motors",
    category: "Automotive",
    rating: 4.8,
    address: "456 Desert Ave, California City",
    phone: "(555) 234-5678",
    website: "www.mojavemotors.com",
    image: "https://images.unsplash.com/photo-1682687220198-88e9bdea9931",
    description: "Full-service auto repair and maintenance facility specializing in desert-ready vehicles. ASE certified mechanics with over 20 years of experience.",
    hours: {
      Monday: "8:00 AM - 6:00 PM",
      Tuesday: "8:00 AM - 6:00 PM",
      Wednesday: "8:00 AM - 6:00 PM",
      Thursday: "8:00 AM - 6:00 PM",
      Friday: "8:00 AM - 6:00 PM",
      Saturday: "9:00 AM - 3:00 PM",
      Sunday: "Closed"
    },
    amenities: [
      "Loaner Cars",
      "Waiting Room",
      "Free Wi-Fi",
      "Coffee Bar",
      "Early Bird Drop-off"
    ],
    socialMedia: {
      facebook: "https://facebook.com/mojavemotors",
      instagram: "https://instagram.com/mojavemotors"
    }
  },
  {
    id: 3,
    name: "Desert View Inn",
    category: "Lodging",
    rating: 4.6,
    address: "789 Sunset Blvd, California City",
    phone: "(555) 345-6789",
    website: "www.desertviewinn.com",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945",
    description: "Boutique desert hotel offering comfortable accommodations with stunning views of the Mojave landscape. Features modern amenities while maintaining a rustic charm.",
    hours: {
      Monday: "24/7",
      Tuesday: "24/7",
      Wednesday: "24/7",
      Thursday: "24/7",
      Friday: "24/7",
      Saturday: "24/7",
      Sunday: "24/7"
    },
    amenities: [
      "Pool",
      "Free Breakfast",
      "Desert View Rooms",
      "Business Center",
      "Fitness Room",
      "EV Charging"
    ],
    socialMedia: {
      facebook: "https://facebook.com/desertviewinn",
      instagram: "https://instagram.com/desertviewinn",
      twitter: "https://twitter.com/desertviewinn"
    }
  },
  {
    id: 4,
    name: "Desert Trails Outfitters",
    category: "Outdoor Recreation",
    rating: 4.9,
    address: "321 Adventure Way, California City",
    phone: "(555) 456-7890",
    website: "www.deserttrailsoutfitters.com",
    image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800",
    description: "Premier outdoor adventure company offering guided tours, equipment rentals, and expert instruction for desert exploration. Specializing in off-road experiences and stargazing tours.",
    hours: {
      Monday: "9:00 AM - 5:00 PM",
      Tuesday: "9:00 AM - 5:00 PM",
      Wednesday: "9:00 AM - 5:00 PM",
      Thursday: "9:00 AM - 5:00 PM",
      Friday: "9:00 AM - 5:00 PM",
      Saturday: "8:00 AM - 6:00 PM",
      Sunday: "8:00 AM - 6:00 PM"
    },
    amenities: [
      "Equipment Rental",
      "Guided Tours",
      "Safety Training",
      "Maps & Guides",
      "First Aid Station",
      "Expert Instructors"
    ],
    socialMedia: {
      facebook: "https://facebook.com/deserttrailsoutfitters",
      instagram: "https://instagram.com/deserttrailsoutfitters"
    }
  },
  {
    id: 5,
    name: "Desert Bloom Market",
    category: "Grocery",
    rating: 4.7,
    address: "567 Palm Drive, California City",
    phone: "(555) 567-8901",
    website: "www.desertbloommarket.com",
    image: "https://images.unsplash.com/photo-1578916171728-46686eac8d58",
    description: "Local market offering fresh produce, organic goods, and desert-inspired local products. Features a juice bar and deli with healthy meal options.",
    hours: {
      Monday: "7:00 AM - 9:00 PM",
      Tuesday: "7:00 AM - 9:00 PM",
      Wednesday: "7:00 AM - 9:00 PM",
      Thursday: "7:00 AM - 9:00 PM",
      Friday: "7:00 AM - 9:00 PM",
      Saturday: "8:00 AM - 9:00 PM",
      Sunday: "8:00 AM - 8:00 PM"
    },
    amenities: [
      "Fresh Produce",
      "Organic Section",
      "Juice Bar",
      "Deli Counter",
      "Local Products",
      "Curbside Pickup"
    ],
    socialMedia: {
      facebook: "https://facebook.com/desertbloommarket",
      instagram: "https://instagram.com/desertbloommarket",
      twitter: "https://twitter.com/desertbloom"
    }
  },
  {
    id: 6,
    name: "Desert Tech Solutions",
    category: "Technology",
    rating: 4.8,
    address: "890 Innovation Court, California City",
    phone: "(555) 678-9012",
    website: "www.deserttechsolutions.com",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c",
    description: "Full-service technology company providing IT support, web development, and digital solutions for desert businesses. Specializing in remote work solutions and solar-powered systems.",
    hours: {
      Monday: "9:00 AM - 6:00 PM",
      Tuesday: "9:00 AM - 6:00 PM",
      Wednesday: "9:00 AM - 6:00 PM",
      Thursday: "9:00 AM - 6:00 PM",
      Friday: "9:00 AM - 5:00 PM",
      Saturday: "By Appointment",
      Sunday: "Closed"
    },
    amenities: [
      "Remote Support",
      "On-site Service",
      "Training Room",
      "Device Sales",
      "Solar Solutions",
      "Free Consultations"
    ],
    socialMedia: {
      facebook: "https://facebook.com/deserttechsolutions",
      twitter: "https://twitter.com/deserttech",
      instagram: "https://instagram.com/deserttechsolutions"
    }
  }
];

interface BusinessContextType {
  businesses: Business[];
  addBusiness: (business: Business) => void;
  getBusinessById: (id: number) => Business | undefined;
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
  const [businesses, setBusinesses] = useState<Business[]>(initialBusinesses);

  // Load businesses from localStorage on mount
  useEffect(() => {
    const storedBusinesses = localStorage.getItem('businesses');
    if (storedBusinesses) {
      try {
        setBusinesses(JSON.parse(storedBusinesses));
      } catch (error) {
        console.error('Failed to parse stored businesses:', error);
      }
    }
  }, []);

  // Save businesses to localStorage when they change
  useEffect(() => {
    localStorage.setItem('businesses', JSON.stringify(businesses));
  }, [businesses]);

  // Add a new business to the list
  const addBusiness = (business: Business) => {
    setBusinesses(prevBusinesses => [...prevBusinesses, business]);
  };

  // Get a business by ID
  const getBusinessById = (id: number) => {
    return businesses.find(business => business.id === id);
  };

  return (
    <BusinessContext.Provider value={{ businesses, addBusiness, getBusinessById }}>
      {children}
    </BusinessContext.Provider>
  );
}
