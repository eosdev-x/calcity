import React from 'react';
import { Compass } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <div className="relative h-[600px] bg-cover bg-center" style={{
      backgroundImage: 'url("https://images.unsplash.com/photo-1682686580024-580519d4b2d2")'
    }}>
      <div className="absolute inset-0 bg-black/50">
        <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center text-white">
          <Compass className="w-16 h-16 mb-6" />
          <h1 className="text-5xl md:text-6xl font-bold text-center mb-4">
            Welcome to California City
          </h1>
          <p className="text-xl md:text-2xl text-center max-w-2xl">
            Discover the beauty of the Mojave Desert, our rich aerospace heritage,
            and a vibrant community spirit
          </p>
        </div>
      </div>
    </div>
  );
};