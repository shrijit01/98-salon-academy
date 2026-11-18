import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface SalonExperienceProps {
  onOpenLightbox: (imageSrc: string) => void;
}

export const SalonExperience: React.FC<SalonExperienceProps> = ({ onOpenLightbox }) => {
  const containerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.experience-parallax').forEach((el) => {
        gsap.fromTo(
          el,
          { y: 20 },
          {
            y: -20,
            ease: 'none',
            scrollTrigger: {
              trigger: el,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1,
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      id="experience"
      className="py-28 sm:py-36 lg:py-44 bg-[#161514] text-[#FAF8F5] relative overflow-hidden"
    >
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 sm:mb-24 pb-8 border-b border-[#2A2826]">
          <div>
            <span className="text-[10px] tracking-[0.3em] uppercase font-sans text-[#C5A880] font-medium block mb-3">
              04 / ARCHITECTURAL SPACE
            </span>
            <h2 className="text-4xl sm:text-6xl font-serif font-light text-[#FAF8F5] tracking-[-0.02em]">
              THE SALON EXPERIENCE
            </h2>
            <p className="text-xs text-[#FAF8F5]/50 font-sans tracking-wide mt-2">
              Our actual space in Rewa, designed for calm focus and professional care.
            </p>
          </div>

          <div className="mt-6 lg:mt-0 max-w-md">
            <p className="text-xs sm:text-sm text-[#FAF8F5]/70 font-sans font-light leading-relaxed">
              Every detail is rooted in authentic craftsmanship: custom arched backlit mirrors, hydraulic styling chairs, and a serene gallery promenade.
            </p>
          </div>
        </div>

        {/* Large Architectural Photography Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Main Feature: Primary Styling Studio Hall (Col 7) */}
          <div
            className="lg:col-span-7 group cursor-pointer"
            onClick={() => onOpenLightbox('/frames/frame_100.jpg')}
          >
            <div className="relative aspect-[16/10] sm:aspect-[16/11] overflow-hidden bg-[#22201E]">
              <img
                src="/frames/frame_100.jpg"
                alt="Actual 98 Salon interior styling stations with arched backlit mirrors and leather chairs"
                className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                loading="lazy"
              />
            </div>

            <div className="mt-6 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[#2A2826] pb-4">
              <div>
                <h3 className="font-serif text-2xl text-[#FAF8F5]">
                  Arched Mirror Stations &amp; Leather Styling Chairs
                </h3>
                <p className="text-xs text-[#FAF8F5]/60 mt-1 font-sans font-light">
                  Warm indirect backlight framing every client station, paired with hydraulic recliners.
                </p>
              </div>
              <span className="text-[10px] tracking-[0.2em] uppercase font-mono text-[#C5A880] shrink-0">
                PRIMARY HALL
              </span>
            </div>
          </div>

          {/* Right Column: Stacked Architectural Photographs (Col 5) */}
          <div className="lg:col-span-5 flex flex-col space-y-12">
            {/* Formulation Library View */}
            <div
              className="group cursor-pointer"
              onClick={() => onOpenLightbox('/frames/frame_140.jpg')}
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-[#22201E]">
                <img
                  src="/frames/frame_140.jpg"
                  alt="Actual 98 Salon formulation library and product display shelves"
                  className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              <div className="mt-4 flex items-baseline justify-between border-b border-[#2A2826] pb-3">
                <p className="font-serif text-lg text-[#FAF8F5]">
                  Illuminated Formulation Bar
                </p>
                <span className="text-[10px] tracking-[0.2em] uppercase font-mono text-[#C5A880]">
                  FORMULATIONS
                </span>
              </div>
            </div>

            {/* Night Facade View */}
            <div
              className="group cursor-pointer"
              onClick={() => onOpenLightbox('/frames/frame_001.jpg')}
            >
              <div className="relative aspect-[16/9] overflow-hidden bg-[#22201E]">
                <img
                  src="/frames/frame_001.jpg"
                  alt="Exterior night view of 98 Salon & Academy along Allahabad Road, Rewa"
                  className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              <div className="mt-4 flex items-baseline justify-between border-b border-[#2A2826] pb-3">
                <p className="font-serif text-lg text-[#FAF8F5]">
                  Storefront &amp; Signage on Allahabad Road
                </p>
                <span className="text-[10px] tracking-[0.2em] uppercase font-mono text-[#C5A880]">
                  EXTERIOR
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
