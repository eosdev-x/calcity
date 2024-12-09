import { Attraction } from '../types';

export const attractions: Attraction[] = [
  {
    id: '1',
    name: 'California City Central Park',
    description: 'A vast desert park offering hiking trails, picnic areas, and stunning views of the Mojave landscape.',
    location: '10350 California City Blvd',
    imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800',
    type: 'recreation'
  },
  {
    id: '2',
    name: 'Edwards Air Force Base',
    description: 'Historic military aviation facility and test flight center, showcasing aerospace innovation.',
    location: 'Edwards AFB',
    imageUrl: 'https://images.unsplash.com/photo-1517976487492-5750f3195933',
    type: 'aerospace'
  },
  {
    id: '3',
    name: 'Desert Tortoise Natural Area',
    description: 'Protected habitat featuring native desert wildlife and flora, perfect for nature enthusiasts.',
    location: 'Mojave Desert Preserve',
    imageUrl: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35',
    type: 'nature'
  }
];