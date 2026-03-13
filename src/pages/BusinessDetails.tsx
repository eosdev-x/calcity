import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Phone, 
  Globe, 
  Star, 
  Clock,
  ArrowLeft,
  Facebook,
  Twitter,
  Instagram,
  Check
} from 'lucide-react';
import { Business } from '../types/business';
import { BusinessGallery } from '../components/BusinessGallery';
import { BusinessHoursStatus } from '../components/BusinessHoursStatus';

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
    },
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1554118811-1e0d58224f24",
        alt: "Coffee being poured into a cup"
      },
      {
        url: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8",
        alt: "Outdoor seating area"
      },
      {
        url: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085",
        alt: "Fresh pastries display"
      },
      {
        url: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf",
        alt: "Interior dining area"
      },
      {
        url: "https://images.unsplash.com/photo-1442512595331-e89e73853f31",
        alt: "Breakfast plate with eggs and toast"
      },
      {
        url: "https://images.unsplash.com/photo-1509042239860-f550ce710b93",
        alt: "Latte art in coffee cup"
      }
    ]
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
    },
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1486006920555-c77dcf18193c",
        alt: "Auto repair shop interior"
      },
      {
        url: "https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f",
        alt: "Mechanic working on car"
      },
      {
        url: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7",
        alt: "Luxury car in service bay"
      },
      {
        url: "https://images.unsplash.com/photo-1562426795-0750914b3c88",
        alt: "Diagnostic equipment"
      },
      {
        url: "https://images.unsplash.com/photo-1632823471565-1ecdf5c900cb",
        alt: "Tire service area"
      }
    ]
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
    },
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1566073771259-6a8506099945",
        alt: "Hotel exterior at sunset"
      },
      {
        url: "https://images.unsplash.com/photo-1582719508461-905c673771fd",
        alt: "Luxurious hotel room"
      },
      {
        url: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7",
        alt: "Swimming pool area"
      },
      {
        url: "https://images.unsplash.com/photo-1621293954908-907159247fc8",
        alt: "Hotel lobby"
      },
      {
        url: "https://images.unsplash.com/photo-1617859047452-8510bcf207fd",
        alt: "Breakfast buffet"
      },
      {
        url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
        alt: "Fitness center"
      }
    ]
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
    },
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800",
        alt: "Desert trail adventure"
      },
      {
        url: "https://images.unsplash.com/photo-1533240332313-0db49b459ad6",
        alt: "Off-road vehicles"
      },
      {
        url: "https://images.unsplash.com/photo-1464207687429-7505649dae38",
        alt: "Stargazing equipment"
      },
      {
        url: "https://images.unsplash.com/photo-1527856263669-12c3a0af2aa6",
        alt: "Hiking group"
      },
      {
        url: "https://images.unsplash.com/photo-1502943693086-33b5b1cfdf2f",
        alt: "Desert camping setup"
      }
    ]
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
    },
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1578916171728-46686eac8d58",
        alt: "Fresh produce display"
      },
      {
        url: "https://images.unsplash.com/photo-1534723452862-4c874018d66d",
        alt: "Juice bar counter"
      },
      {
        url: "https://images.unsplash.com/photo-1579113800032-c38bd7635818",
        alt: "Organic section"
      },
      {
        url: "https://images.unsplash.com/photo-1581515286348-98549702050f",
        alt: "Deli counter"
      },
      {
        url: "https://images.unsplash.com/photo-1595665593673-bf1ad72905c0",
        alt: "Local products shelf"
      }
    ]
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
    },
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1497366216548-37526070297c",
        alt: "Modern office space"
      },
      {
        url: "https://images.unsplash.com/photo-1581092921461-39b21c886d10",
        alt: "IT support team"
      },
      {
        url: "https://images.unsplash.com/photo-1531482615713-2afd69097998",
        alt: "Training session"
      },
      {
        url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c",
        alt: "Team collaboration"
      },
      {
        url: "https://images.unsplash.com/photo-1591696205602-2f950c417cb9",
        alt: "Solar panel installation"
      }
    ]
  }
];

export function BusinessDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const business = businesses.find(b => b.id === Number(id));

  if (!business) {
    navigate('/businesses');
    return null;
  }

  return (
    <div className="min-h-screen bg-surface py-12">
      <div className="container mx-auto px-4">
        {/* Navigation */}
        <button
          onClick={() => navigate('/businesses')}
          className="flex items-center text-on-surface-variant hover:text-primary mb-6 transition-colors duration-[var(--md-sys-motion-duration-short3)]"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Businesses
        </button>

        {/* Hero Section */}
        <div className="relative h-[400px] rounded-xl overflow-hidden mb-8">
          <img
            src={business.image}
            alt={business.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-scrim/70 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-display font-bold text-inverse-on-surface mb-2">
                  {business.name}
                </h1>
                <div className="flex items-center text-inverse-on-surface">
                  <Star className="w-5 h-5 text-inverse-on-surface fill-current mr-1" />
                  <span className="mr-2">{business.rating}</span>
                  <span className="text-inverse-on-surface">• {business.category}</span>
                </div>
              </div>
              <BusinessHoursStatus hours={business.hours} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="card mb-8">
              <h2 className="text-2xl font-semibold mb-4">About</h2>
              <p className="text-on-surface-variant">
                {business.description}
              </p>
            </div>

            <div className="card mb-8">
              <h2 className="text-2xl font-semibold mb-6">Amenities</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {business.amenities.map((amenity) => (
                  <div 
                    key={amenity}
                    className="flex items-center text-on-surface-variant"
                  >
                    <Check className="w-5 h-5 text-on-surface-variant mr-2" />
                    {amenity}
                  </div>
                ))}
              </div>
            </div>

            {business.gallery && business.gallery.length > 0 && (
              <div className="card">
                <h2 className="text-2xl font-semibold mb-6">Gallery</h2>
                <BusinessGallery images={business.gallery} />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Contact Information */}
            <div className="card">
              <h3 className="text-xl font-semibold mb-4">Contact & Location</h3>
              <div className="space-y-4">
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(business.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-on-surface-variant hover:text-primary transition-colors duration-[var(--md-sys-motion-duration-short3)]"
                >
                  <MapPin className="w-5 h-5 text-on-surface-variant mr-2" />
                  <span className="hover:underline">{business.address}</span>
                </a>
                <a
                  href={`tel:${business.phone.replace(/[^\d]/g, '')}`}
                  className="flex items-center text-on-surface-variant hover:text-primary transition-colors duration-[var(--md-sys-motion-duration-short3)]"
                >
                  <Phone className="w-5 h-5 text-on-surface-variant mr-2" />
                  <span className="hover:underline">{business.phone}</span>
                </a>
                <a
                  href={`https://${business.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-on-surface-variant hover:text-primary transition-colors duration-[var(--md-sys-motion-duration-short3)]"
                >
                  <Globe className="w-5 h-5 text-on-surface-variant mr-2" />
                  <span className="hover:underline">{business.website}</span>
                </a>
              </div>

              {business.socialMedia && (
                <div className="mt-6 pt-6 border-t border-outline-variant">
                  <h4 className="font-semibold mb-4">Social Media</h4>
                  <div className="flex space-x-4">
                    {business.socialMedia.facebook && (
                      <a
                        href={business.socialMedia.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-on-surface-variant hover:text-primary transition-colors duration-[var(--md-sys-motion-duration-short3)]"
                      >
                        <Facebook className="w-6 h-6" />
                      </a>
                    )}
                    {business.socialMedia.twitter && (
                      <a
                        href={business.socialMedia.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-on-surface-variant hover:text-primary transition-colors duration-[var(--md-sys-motion-duration-short3)]"
                      >
                        <Twitter className="w-6 h-6" />
                      </a>
                    )}
                    {business.socialMedia.instagram && (
                      <a
                        href={business.socialMedia.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-on-surface-variant hover:text-primary transition-colors duration-[var(--md-sys-motion-duration-short3)]"
                      >
                        <Instagram className="w-6 h-6" />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Business Hours */}
            <div className="card">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Clock className="w-5 h-5 text-on-surface-variant mr-2" />
                Business Hours
              </h3>
              <div className="space-y-2">
                {Object.entries(business.hours).map(([day, hours]) => (
                  <div
                    key={day}
                    className="flex justify-between text-on-surface-variant"
                  >
                    <span>{day}</span>
                    <span>{hours}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
