import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';

interface GalleryImage {
  url: string;
  alt: string;
}

interface BusinessGalleryProps {
  images: GalleryImage[];
  className?: string;
}

export function BusinessGallery({ images, className }: BusinessGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const openModal = (index: number) => setSelectedImage(index);
  const closeModal = () => setSelectedImage(null);

  const navigateImage = (direction: 'prev' | 'next') => {
    if (selectedImage === null) return;
    
    const newIndex = direction === 'prev' 
      ? (selectedImage - 1 + images.length) % images.length
      : (selectedImage + 1) % images.length;
    
    setSelectedImage(newIndex);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (selectedImage === null) return;

    switch (e.key) {
      case 'ArrowLeft':
        navigateImage('prev');
        break;
      case 'ArrowRight':
        navigateImage('next');
        break;
      case 'Escape':
        closeModal();
        break;
    }
  };

  return (
    <div className={className}>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => openModal(index)}
            className="relative aspect-square overflow-hidden rounded-lg group"
          >
            <img
              src={image.url}
              alt={image.alt}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
        ))}
      </div>

      {/* Modal */}
      {selectedImage !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          onClick={closeModal}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          <div className="relative w-full max-w-6xl px-4">
            <img
              src={images[selectedImage].url}
              alt={images[selectedImage].alt}
              className="w-full h-auto max-h-[90vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            <button
              onClick={closeModal}
              className={clsx(
                "absolute top-4 right-4 p-2 rounded-full",
                "bg-white/10 hover:bg-white/20 transition-colors",
                "text-white"
              )}
            >
              <X className="w-6 h-6" />
            </button>

            <div className="absolute inset-y-0 left-4 flex items-center">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigateImage('prev');
                }}
                className={clsx(
                  "p-2 rounded-full",
                  "bg-white/10 hover:bg-white/20 transition-colors",
                  "text-white"
                )}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            </div>

            <div className="absolute inset-y-0 right-4 flex items-center">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigateImage('next');
                }}
                className={clsx(
                  "p-2 rounded-full",
                  "bg-white/10 hover:bg-white/20 transition-colors",
                  "text-white"
                )}
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">
              {selectedImage + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}