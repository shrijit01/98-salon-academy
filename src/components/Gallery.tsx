import React, { useState } from 'react';
import { REAL_SALON_GALLERY, type GalleryImage } from '../data/salonData';

interface GalleryProps {
  onSelectImage: (image: GalleryImage) => void;
}

export const Gallery: React.FC<GalleryProps> = ({ onSelectImage }) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'interior' | 'promenade' | 'facade' | 'academy'>('all');

  const filteredImages =
    activeFilter === 'all'
      ? REAL_SALON_GALLERY
      : REAL_SALON_GALLERY.filter((img) => img.category === activeFilter);

  return (
    <section id="gallery" className="py-28 sm:py-36 lg:py-44 bg-[#FAF8F5] text-[#161514] border-t border-[#E8E2D8]">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-8 border-b border-[#E8E2D8]">
          <div>
            <span className="text-[10px] tracking-[0.3em] uppercase font-sans text-[#9C7E55] font-medium block mb-3">
              05 / CURATED ARCHIVE
            </span>
            <h2 className="text-4xl sm:text-6xl font-serif font-light text-[#161514] tracking-[-0.02em]">
              SALON &amp; ATMOSPHERE GALLERY
            </h2>
            <p className="text-xs text-[#9C7E55] font-hindi mt-1">
              प्रवेश गलियारा • मुख्य स्टाइलिंग कक्ष • बाह्य स्वरूप
            </p>
          </div>

          {/* Minimalist Text Category Filter */}
          <div className="mt-8 md:mt-0 flex flex-wrap gap-6 sm:gap-8">
            {[
              { id: 'all', label: 'All' },
              { id: 'interior', label: 'Styling Floor' },
              { id: 'promenade', label: 'Promenade' },
              { id: 'facade', label: 'Facade' },
              { id: 'academy', label: 'Academy' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id as any)}
                className={`text-[11px] tracking-[0.2em] uppercase font-sans font-medium transition-colors cursor-pointer pb-1 ${
                  activeFilter === tab.id
                    ? 'text-[#161514] border-b border-[#161514]'
                    : 'text-[#646059] hover:text-[#161514]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Art-Directed Editorial Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12">
          {filteredImages.map((image, idx) => (
            <div
              key={image.id}
              onClick={() => onSelectImage(image)}
              className="gallery-card group cursor-pointer flex flex-col justify-between"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-[#E8E2D8]">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              <div className="pt-4 border-b border-[#E8E2D8] pb-3 flex items-baseline justify-between">
                <div>
                  <h3 className="font-serif text-xl text-[#161514] group-hover:text-[#9C7E55] transition-colors">
                    {image.title}
                  </h3>
                  <p className="text-xs text-[#646059] mt-1 font-sans font-light line-clamp-1">
                    {image.caption}
                  </p>
                </div>

                <span className="text-[10px] font-mono text-[#9C7E55] pl-4 shrink-0">
                  0{idx + 1}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
