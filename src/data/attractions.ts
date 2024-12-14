import { Attraction } from '../types';

export const attractions: Attraction[] = [
  {
    id: '1',
    name: 'California City Central Park',
    description: 'Experience the raw beauty of the Mojave Desert at California City Central Park. This vast recreational area offers miles of scenic hiking trails, peaceful picnic spots, and breathtaking desert vistas. Perfect for outdoor enthusiasts and nature photographers, the park showcases the unique charm of high desert landscapes.',
    location: '10350 California City Blvd',
    imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800',
    type: 'recreation',
    details: {
      hours: 'Sunrise to Sunset, Daily',
      admission: 'Free',
      amenities: ['Parking', 'Picnic Tables', 'Walking Trails', 'Restrooms'],
      activities: ['Hiking', 'Photography', 'Bird Watching', 'Picnicking']
    },
    rating: 4.5,
    reviews: 128
  },
  {
    id: '2',
    name: 'Edwards Air Force Base',
    description: 'Discover aerospace history at Edwards Air Force Base, a legendary facility where countless aviation milestones were achieved. Home to NASA\'s Armstrong Flight Research Center, this historic site continues to push the boundaries of flight technology and space exploration. Witness test flights and learn about the future of aviation.',
    location: 'Edwards AFB',
    imageUrl: 'https://images.unsplash.com/photo-1517976487492-5750f3195933',
    type: 'aerospace',
    details: {
      hours: 'Tours available Tuesday-Thursday, 9:00 AM - 2:00 PM',
      admission: 'Free with advance registration',
      amenities: ['Visitor Center', 'Museum', 'Gift Shop'],
      activities: ['Guided Tours', 'Museum Visits', 'Aircraft Viewing']
    },
    rating: 4.8,
    reviews: 256
  },
  {
    id: '3',
    name: 'Desert Tortoise Natural Area',
    description: 'Step into a protected sanctuary at the Desert Tortoise Natural Area, where you can observe these fascinating creatures in their natural habitat. This pristine preserve showcases the diverse ecosystem of the Mojave Desert, featuring rare desert plants, wildlife viewing opportunities, and educational nature trails.',
    location: 'Mojave Desert Preserve',
    imageUrl: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35',
    type: 'nature',
    details: {
      hours: '8:00 AM - 5:00 PM, March through October',
      admission: '$5 per vehicle',
      amenities: ['Interpretive Center', 'Nature Trails', 'Information Kiosks'],
      activities: ['Wildlife Viewing', 'Nature Walks', 'Educational Programs', 'Photography']
    },
    rating: 4.6,
    reviews: 95
  }
];