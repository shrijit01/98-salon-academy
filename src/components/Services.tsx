import React, { useState, useRef } from 'react';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { SERVICES_DATA } from '../data/salonData';

interface ServicesProps {
  onSelectServiceForBooking: (serviceName: string) => void;
}

// Authentic photography mapped to disciplines
const DISCIPLINE_IMAGES: Record<string, { src: string; caption: string; space: string }> = {
  hair: {
    src: '/frames/frame_100.jpg',
    caption: 'Precision cutting, custom balayage, keratin restoration & bespoke textures.',
    space: 'Primary Styling Hall & Arched Backlit Mirrors',
  },
  skin: {
    src: '/frames/frame_140.jpg',
    caption: 'Clinical hydra-facials, deep dermal rejuvenation & botanical barrier care.',
    space: 'Formulation Suite & Treatment Bar',
  },
  makeup: {
    src: '/frames/frame_085.jpg',
    caption: 'Bridal occasion glamour, HD airbrush artistry & evening styling.',
    space: 'Illuminated Artistry Mirrors',
  },
  nails: {
    src: '/frames/frame_060.jpg',
    caption: 'Gel extensions, cuticle architecture & delicate minimalist nail art.',
    space: 'Salon Floor Promenade',
  },
};

export const Services: React.FC<ServicesProps> = ({ onSelectServiceForBooking }) => {
  const [activeTab, setActiveTab] = useState<string>(SERVICES_DATA[0].id);
  const activeService = SERVICES_DATA.find((s) => s.id === activeTab) || SERVICES_DATA[0];

  // 3D perspective tilt state on image hover
  const [tilt, setTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const imageFrameRef = useRef<HTMLDivElement | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = imageFrameRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 14;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -14;
    setTilt({ x, y });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <section
      id="services"
      className="py-28 sm:py-36 lg:py-44 bg-[#F5F2EC] text-[#161514] border-t border-[#E8E2D8] overflow-hidden"
    >
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 sm:mb-20 pb-8 border-b border-[#DFD5C6]">
          <div>
            <div className="flex items-center space-x-3 mb-3">
              <span className="text-[10px] tracking-[0.3em] uppercase font-sans text-[#9C7E55] font-medium">
                02 / SERVICES DIRECTORY
              </span>
              <span className="text-[10px] tracking-widest uppercase font-mono text-[#646059]">
                // 4 DISCIPLINES
              </span>
            </div>
            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-light text-[#161514] tracking-[-0.02em]">
              SALON SERVICES &amp; RITUALS
            </h2>
            <p className="text-xs text-[#9C7E55] font-hindi mt-1">
              हेयर • स्किन • मेकअप • नेल्स — रीवा में उच्च स्तरीय सेवाएँ
            </p>
          </div>

          <p className="mt-6 md:mt-0 text-xs sm:text-sm text-[#646059] max-w-md font-sans font-light leading-relaxed">
            Tailored beauty rituals executed with quiet precision. Explore each discipline below to view curated treatments, authentic interior spaces, and personalized consultation options.
          </p>
        </div>

        {/* 
          AWWWARDS-INSPIRED INTERACTIVE SERVICE EXPLORER
          Left: Vertical Typography Discipline List with animated underline & shift
          Right: Dynamic Photographic Stage with masked transition & 3D tilt
        */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Interactive Vertical List */}
          <div className="lg:col-span-5 flex flex-col justify-between order-2 lg:order-1">
            <div className="space-y-4">
              {SERVICES_DATA.map((service) => {
                const isActive = activeTab === service.id;
                return (
                  <div
                    key={service.id}
                    onMouseEnter={() => setActiveTab(service.id)}
                    onClick={() => setActiveTab(service.id)}
                    className={`group relative p-6 sm:p-7 transition-all duration-300 cursor-pointer border ${
                      isActive
                        ? 'border-[#161514] bg-[#FAF8F5] shadow-sm translate-x-1 sm:translate-x-2'
                        : 'border-[#DFD5C6] bg-transparent hover:border-[#9C7E55]/60 hover:bg-[#FAF8F5]/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-[10px] tracking-wider uppercase text-[#9C7E55]">
                        DISCIPLINE {service.categoryNumber}
                      </span>
                      <span className="text-[10px] font-mono tracking-widest text-[#646059]">
                        {service.items.length} RITUALS
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <h3
                        className={`font-serif text-3xl sm:text-4xl text-[#161514] font-light transition-all duration-300 ${
                          isActive ? 'text-[#161514] translate-x-1' : 'text-[#161514]/70 group-hover:text-[#161514]'
                        }`}
                      >
                        {service.category}
                      </h3>
                      <ArrowUpRight
                        className={`w-5 h-5 transition-all duration-300 ${
                          isActive
                            ? 'opacity-100 text-[#9C7E55] translate-x-0'
                            : 'opacity-0 -translate-x-2 text-[#646059] group-hover:opacity-60 group-hover:translate-x-0'
                        }`}
                      />
                    </div>

                    <p className="mt-2 text-xs text-[#646059] font-sans font-light line-clamp-1">
                      {service.subtitle}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Active Service Inclusions */}
            <div className="mt-10 pt-8 border-t border-[#DFD5C6]">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] tracking-[0.25em] uppercase font-sans text-[#646059] font-medium">
                  {activeService.category} OFFERINGS &amp; CONSULTATION:
                </span>
                <span className="text-[10px] font-mono text-[#9C7E55]">
                  SELECT TO PREFILL
                </span>
              </div>

              <div className="space-y-2.5">
                {activeService.items.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => onSelectServiceForBooking(`${activeService.category} - ${item}`)}
                    className="w-full text-left group flex items-baseline justify-between text-xs sm:text-sm text-[#2A2825] hover:text-[#9C7E55] transition-colors py-2 border-b border-[#DFD5C6]/60 cursor-pointer"
                  >
                    <span className="font-sans font-light group-hover:translate-x-1.5 transition-transform duration-200">
                      {item}
                    </span>
                    <span className="text-[10px] font-mono text-[#646059] group-hover:text-[#9C7E55]">
                      BOOK ↗
                    </span>
                  </button>
                ))}
              </div>

              <div className="mt-8">
                <button
                  onClick={() => onSelectServiceForBooking(activeService.category)}
                  className="w-full group inline-flex items-center justify-center space-x-3 py-4 bg-[#161514] hover:bg-[#2A2825] text-[#FAF8F5] font-sans text-[11px] tracking-[0.25em] uppercase font-medium transition-all duration-300 cursor-pointer text-center shadow-md"
                >
                  <span>Book {activeService.category} Consultation</span>
                  <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-[#C5A880]" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Expansive Photographic Stage with 3D Depth Tilt */}
          <div className="lg:col-span-7 order-1 lg:order-2">
            <div
              ref={imageFrameRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="relative aspect-[16/11] lg:aspect-[16/12] w-full bg-[#161514] overflow-hidden transition-transform duration-200 ease-out shadow-xl"
              style={{
                perspective: '1000px',
                transform: `rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)`,
              }}
            >
              {/* Dynamic Photographic Layer with smooth crossfade */}
              {Object.entries(DISCIPLINE_IMAGES).map(([key, media]) => {
                const isSelected = activeTab === key;
                return (
                  <div
                    key={key}
                    className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                      isSelected ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-105 pointer-events-none z-0'
                    }`}
                  >
                    <img
                      src={media.src}
                      alt={media.caption}
                      className="w-full h-full object-cover object-bottom transition-transform duration-1000"
                    />

                    {/* Gradient overlays for editorial text legibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#161514]/85 via-transparent to-black/20 pointer-events-none" />

                    {/* Stage Editorial Details */}
                    <div className="absolute bottom-0 inset-x-0 p-6 sm:p-10 text-[#FAF8F5] z-20 flex flex-col justify-end">
                      <div className="flex items-center space-x-2 text-[10px] tracking-[0.25em] uppercase font-sans text-[#C5A880] mb-2 font-medium">
                        <Sparkles className="w-3 h-3 text-[#C5A880]" />
                        <span>{media.space}</span>
                      </div>

                      <h4 className="font-serif text-2xl sm:text-4xl text-[#FAF8F5] font-light leading-snug">
                        {activeService.title}
                      </h4>

                      <p className="mt-2 text-xs sm:text-sm text-[#FAF8F5]/80 font-sans font-light max-w-lg">
                        {media.caption}
                      </p>
                    </div>
                  </div>
                );
              })}

              {/* Discipline Number Watermark */}
              <div className="absolute top-6 right-8 text-[60px] sm:text-[90px] font-serif font-light text-white/10 pointer-events-none select-none z-20 leading-none">
                0{activeService.categoryNumber}
              </div>
            </div>

            {/* Bottom Caption & Hindi Subtext */}
            <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-[#646059] font-sans font-light">
              <span>98 SALON &amp; ACADEMY — REWA STUDIO</span>
              <span className="font-hindi text-[11px] text-[#9C7E55] mt-1 sm:mt-0">
                अनुभवी स्टाइलिस्ट्स द्वारा व्यक्तिगत सौंदर्य परामर्श
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
