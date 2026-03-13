-- CalCity Platform: Seed Data
-- Run AFTER 001_foundation.sql
-- Uses a placeholder owner_id — update once real admin account exists

-- We need a placeholder user for seed data ownership
-- After creating your admin account, update these records:
-- UPDATE businesses SET owner_id = '<your-admin-uuid>' WHERE owner_id = '7ca0e870-e015-4f7b-8f68-deaf3c896ee2';
-- UPDATE events SET organizer_id = '<your-admin-uuid>' WHERE organizer_id = '7ca0e870-e015-4f7b-8f68-deaf3c896ee2';

-- ============================================
-- Seed Businesses
-- ============================================
INSERT INTO public.businesses (owner_id, name, slug, category, address, phone, website, image, description, hours, amenities, social_media, rating, status, approved_at, subscription_tier)
VALUES
  (
    '7ca0e870-e015-4f7b-8f68-deaf3c896ee2',
    'Desert Oasis Cafe',
    'desert-oasis-cafe',
    'Restaurant',
    '123 Main St, California City',
    '(555) 123-4567',
    'www.desertoasiscafe.com',
    'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba',
    'A cozy cafe serving fresh, locally-sourced breakfast and lunch in a relaxed desert atmosphere. Known for our homemade pastries and specialty coffee drinks.',
    '{"Monday": "7:00 AM - 3:00 PM", "Tuesday": "7:00 AM - 3:00 PM", "Wednesday": "7:00 AM - 3:00 PM", "Thursday": "7:00 AM - 3:00 PM", "Friday": "7:00 AM - 3:00 PM", "Saturday": "8:00 AM - 4:00 PM", "Sunday": "8:00 AM - 2:00 PM"}',
    ARRAY['Wi-Fi', 'Outdoor Seating', 'Wheelchair Accessible', 'Pet Friendly', 'Parking Available'],
    '{"facebook": "https://facebook.com/desertoasiscafe", "instagram": "https://instagram.com/desertoasiscafe", "twitter": "https://twitter.com/desertoasiscafe"}',
    4.5,
    'active',
    now(),
    'premium'
  ),
  (
    '7ca0e870-e015-4f7b-8f68-deaf3c896ee2',
    'Mojave Motors',
    'mojave-motors',
    'Automotive',
    '456 Desert Ave, California City',
    '(555) 234-5678',
    'www.mojavemotors.com',
    'https://images.unsplash.com/photo-1682687220198-88e9bdea9931',
    'Full-service auto repair and maintenance facility specializing in desert-ready vehicles. ASE certified mechanics with over 20 years of experience.',
    '{"Monday": "8:00 AM - 6:00 PM", "Tuesday": "8:00 AM - 6:00 PM", "Wednesday": "8:00 AM - 6:00 PM", "Thursday": "8:00 AM - 6:00 PM", "Friday": "8:00 AM - 6:00 PM", "Saturday": "9:00 AM - 3:00 PM", "Sunday": "Closed"}',
    ARRAY['Loaner Cars', 'Waiting Room', 'Free Wi-Fi', 'Coffee Bar', 'Early Bird Drop-off'],
    '{"facebook": "https://facebook.com/mojavemotors", "instagram": "https://instagram.com/mojavemotors"}',
    4.8,
    'active',
    now(),
    'basic'
  ),
  (
    '7ca0e870-e015-4f7b-8f68-deaf3c896ee2',
    'Desert View Inn',
    'desert-view-inn',
    'Lodging',
    '789 Sunset Blvd, California City',
    '(555) 345-6789',
    'www.desertviewinn.com',
    'https://images.unsplash.com/photo-1566073771259-6a8506099945',
    'Boutique desert hotel offering comfortable accommodations with stunning views of the Mojave landscape. Features modern amenities while maintaining a rustic charm.',
    '{"Monday": "24/7", "Tuesday": "24/7", "Wednesday": "24/7", "Thursday": "24/7", "Friday": "24/7", "Saturday": "24/7", "Sunday": "24/7"}',
    ARRAY['Pool', 'Free Breakfast', 'Desert View Rooms', 'Business Center', 'Fitness Room', 'EV Charging'],
    '{"facebook": "https://facebook.com/desertviewinn", "instagram": "https://instagram.com/desertviewinn", "twitter": "https://twitter.com/desertviewinn"}',
    4.6,
    'active',
    now(),
    'spotlight'
  ),
  (
    '7ca0e870-e015-4f7b-8f68-deaf3c896ee2',
    'Desert Trails Outfitters',
    'desert-trails-outfitters',
    'Outdoor Recreation',
    '321 Adventure Way, California City',
    '(555) 456-7890',
    'www.deserttrailsoutfitters.com',
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800',
    'Premier outdoor adventure company offering guided tours, equipment rentals, and expert instruction for desert exploration. Specializing in off-road experiences and stargazing tours.',
    '{"Monday": "9:00 AM - 5:00 PM", "Tuesday": "9:00 AM - 5:00 PM", "Wednesday": "9:00 AM - 5:00 PM", "Thursday": "9:00 AM - 5:00 PM", "Friday": "9:00 AM - 5:00 PM", "Saturday": "8:00 AM - 6:00 PM", "Sunday": "8:00 AM - 6:00 PM"}',
    ARRAY['Equipment Rental', 'Guided Tours', 'Safety Training', 'Maps & Guides', 'First Aid Station', 'Expert Instructors'],
    '{"facebook": "https://facebook.com/deserttrailsoutfitters", "instagram": "https://instagram.com/deserttrailsoutfitters"}',
    4.9,
    'active',
    now(),
    'premium'
  ),
  (
    '7ca0e870-e015-4f7b-8f68-deaf3c896ee2',
    'Desert Bloom Market',
    'desert-bloom-market',
    'Grocery',
    '567 Palm Drive, California City',
    '(555) 567-8901',
    'www.desertbloommarket.com',
    'https://images.unsplash.com/photo-1578916171728-46686eac8d58',
    'Local market offering fresh produce, organic goods, and desert-inspired local products. Features a juice bar and deli with healthy meal options.',
    '{"Monday": "7:00 AM - 9:00 PM", "Tuesday": "7:00 AM - 9:00 PM", "Wednesday": "7:00 AM - 9:00 PM", "Thursday": "7:00 AM - 9:00 PM", "Friday": "7:00 AM - 9:00 PM", "Saturday": "8:00 AM - 9:00 PM", "Sunday": "8:00 AM - 8:00 PM"}',
    ARRAY['Fresh Produce', 'Organic Section', 'Juice Bar', 'Deli Counter', 'Local Products', 'Curbside Pickup'],
    '{"facebook": "https://facebook.com/desertbloommarket", "instagram": "https://instagram.com/desertbloommarket", "twitter": "https://twitter.com/desertbloom"}',
    4.7,
    'active',
    now(),
    'basic'
  ),
  (
    '7ca0e870-e015-4f7b-8f68-deaf3c896ee2',
    'Desert Tech Solutions',
    'desert-tech-solutions',
    'Technology',
    '890 Innovation Court, California City',
    '(555) 678-9012',
    'www.deserttechsolutions.com',
    'https://images.unsplash.com/photo-1497366216548-37526070297c',
    'Full-service technology company providing IT support, web development, and digital solutions for desert businesses. Specializing in remote work solutions and solar-powered systems.',
    '{"Monday": "9:00 AM - 6:00 PM", "Tuesday": "9:00 AM - 6:00 PM", "Wednesday": "9:00 AM - 6:00 PM", "Thursday": "9:00 AM - 6:00 PM", "Friday": "9:00 AM - 5:00 PM", "Saturday": "By Appointment", "Sunday": "Closed"}',
    ARRAY['Remote Support', 'On-site Service', 'Training Room', 'Device Sales', 'Solar Solutions', 'Free Consultations'],
    '{"facebook": "https://facebook.com/deserttechsolutions", "twitter": "https://twitter.com/deserttech", "instagram": "https://instagram.com/deserttechsolutions"}',
    4.8,
    'active',
    now(),
    'spotlight'
  )
ON CONFLICT DO NOTHING;

-- Set featured/spotlight flags based on tier
UPDATE public.businesses SET is_featured = true WHERE subscription_tier IN ('premium', 'spotlight');
UPDATE public.businesses SET is_spotlight = true WHERE subscription_tier = 'spotlight';

-- ============================================
-- Seed Events
-- ============================================
INSERT INTO public.events (organizer_id, title, slug, description, category, tags, date, time, location, image, organizer_name, organizer_email, organizer_phone, status, approved_at)
VALUES
  (
    '7ca0e870-e015-4f7b-8f68-deaf3c896ee2',
    'Desert Arts Festival',
    'desert-arts-festival-2025',
    'Annual arts and crafts festival featuring local artists',
    'Arts & Culture',
    ARRAY['art', 'festival', 'family-friendly'],
    '2025-04-15',
    '10:00 AM - 6:00 PM',
    'Central Park',
    'https://images.unsplash.com/photo-1603228254119-e6a4d095dc59?w=500&auto=format&fit=crop&q=60',
    'California City Arts Council',
    'arts@calcity.org',
    '(555) 123-4567',
    'approved',
    now()
  ),
  (
    '7ca0e870-e015-4f7b-8f68-deaf3c896ee2',
    'Community Cleanup Day',
    'community-cleanup-day-2025',
    'Join us in keeping our desert community beautiful',
    'Community',
    ARRAY['volunteer', 'environment'],
    '2025-04-22',
    '8:00 AM - 12:00 PM',
    'City Hall',
    'https://plus.unsplash.com/premium_photo-1681152760811-5f0f6e0b7f0a?w=500&auto=format&fit=crop&q=60',
    'City Hall',
    'community@calcity.org',
    '(555) 234-5678',
    'approved',
    now()
  ),
  (
    '7ca0e870-e015-4f7b-8f68-deaf3c896ee2',
    'Stargazing Night',
    'stargazing-night-2025',
    'Experience the beauty of the desert night sky with professional astronomers',
    'Science & Nature',
    ARRAY['astronomy', 'education', 'night-event'],
    '2025-05-15',
    '8:00 PM - 11:00 PM',
    'Desert Observatory',
    'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a',
    'Desert Astronomy Club',
    'stars@calcity.org',
    '(555) 345-6789',
    'approved',
    now()
  ),
  (
    '7ca0e870-e015-4f7b-8f68-deaf3c896ee2',
    'Desert Food Truck Festival',
    'desert-food-truck-festival-2025',
    'A gathering of the region''s best food trucks featuring local and international cuisine',
    'Food & Drink',
    ARRAY['food', 'festival', 'family-friendly'],
    '2025-05-01',
    '11:00 AM - 8:00 PM',
    'Central Park',
    'https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb',
    'CalCity Food Collective',
    'food@calcity.org',
    '(555) 456-7890',
    'approved',
    now()
  ),
  (
    '7ca0e870-e015-4f7b-8f68-deaf3c896ee2',
    'Desert Adventure Race',
    'desert-adventure-race-2025',
    'Challenge yourself in this exciting desert terrain race featuring multiple categories',
    'Sports',
    ARRAY['race', 'outdoor', 'fitness'],
    '2025-05-08',
    '6:00 AM - 2:00 PM',
    'Galileo Hill Park',
    'https://images.unsplash.com/photo-1721327473745-f70f87ba675e?w=500&auto=format&fit=crop&q=60',
    'CalCity Sports Association',
    'sports@calcity.org',
    '(555) 567-8901',
    'approved',
    now()
  ),
  (
    '7ca0e870-e015-4f7b-8f68-deaf3c896ee2',
    'Desert Wildlife Photography Workshop',
    'desert-wildlife-photography-workshop-2025',
    'Learn wildlife photography techniques while exploring local desert fauna',
    'Education',
    ARRAY['photography', 'wildlife', 'workshop'],
    '2025-05-20',
    '9:00 AM - 4:00 PM',
    'Desert Tortoise Natural Area',
    'https://images.unsplash.com/photo-1469827160215-9d29e96e72f4',
    'Desert Photography Society',
    'photo@calcity.org',
    '(555) 678-9012',
    'approved',
    now()
  )
ON CONFLICT DO NOTHING;
