import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { type GalleryImage } from '../data/salonData';

interface LightboxProps {
  isOpen: boolean;
  activeImage: GalleryImage | null;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export const Lightbox: React.FC<LightboxProps> = ({
  isOpen,
  activeImage,
  onClose,
  onNext,
  onPrev,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose, onNext, onPrev]);

  if (!isOpen || !activeImage) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#161514]/95 backdrop-blur-md transition-opacity duration-300"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        aria-label="Close image modal"
        className="absolute top-6 right-6 z-50 p-3 border border-white/20 hover:border-white text-[#FAF8F5] transition-colors cursor-pointer bg-black/40"
      >
        <X className="w-5 h-5 stroke-[1.5]" />
      </button>

      {/* Prev / Next navigation */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
        }}
        aria-label="Previous image"
        className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-50 p-3.5 border border-white/20 hover:border-white text-[#FAF8F5] transition-colors cursor-pointer bg-black/40"
      >
        <ChevronLeft className="w-5 h-5 stroke-[1.5]" />
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        aria-label="Next image"
        className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-50 p-3.5 border border-white/20 hover:border-white text-[#FAF8F5] transition-colors cursor-pointer bg-black/40"
      >
        <ChevronRight className="w-5 h-5 stroke-[1.5]" />
      </button>

      {/* Content wrapper */}
      <div
        className="relative max-w-5xl max-h-[90vh] p-4 flex flex-col items-center select-none"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative border border-[#E8E2D8]/20 bg-[#161514]">
          <img
            src={activeImage.src}
            alt={activeImage.alt}
            className="max-h-[75vh] w-auto max-w-full object-contain"
          />
        </div>

        <div className="mt-5 text-center max-w-xl">
          <div className="flex items-center justify-center space-x-3 mb-1.5">
            <span className="text-[10px] tracking-[0.25em] uppercase font-sans text-[#C5A880]">
              {activeImage.category}
            </span>
            {activeImage.isRealSalonPhoto && (
              <>
                <span className="text-white/30">•</span>
                <span className="text-[10px] tracking-[0.2em] uppercase font-sans text-[#FAF8F5]/70">
                  Salon Interior, Rewa
                </span>
              </>
            )}
          </div>
          <p className="font-serif text-xl sm:text-2xl text-[#FAF8F5] font-light">
            {activeImage.title}
          </p>
        </div>
      </div>
    </div>
  );
};
