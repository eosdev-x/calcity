import React from 'react';
import { MapPin, Phone, Globe, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Business } from '../types/business';
import { BusinessHoursStatus } from '../components/BusinessHoursStatus';

export function Businesses() {
  const businesses: Business[] = [
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

  return (
    <div className="min-h-screen bg-desert-50 dark:bg-night-desert-50 py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-display font-bold text-desert-800 dark:text-desert-100">
            Local Businesses
          </h1>
          <button className="btn-primary">
            Add Your Business
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {businesses.map((business) => (
            <div key={business.id} className="card">
              <img
                src={business.image}
                alt={business.name}
                className="w-full h-48 object-cover rounded-t-lg mb-4"
              />
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-semibold">{business.name}</h3>
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
          ))}
        </div>
      </div>
    </div>
  );
}