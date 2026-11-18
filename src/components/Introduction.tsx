import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface IntroductionProps {
  onExploreServices: () => void;
  onOpenBooking: () => void;
}

export const Introduction: React.FC<IntroductionProps> = ({ onExploreServices, onOpenBooking }) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const textColRef = useRef<HTMLDivElement | null>(null);
  const imageColRef = useRef<HTMLDivElement | null>(null);
  const imageFrameRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // 1. Text reveal animation
      gsap.fromTo(
        textColRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: textColRef.current,
            start: 'top 85%',
          },
        }
      );

      // 2. Cinematic photograph expanding reveal
      if (imageFrameRef.current) {
        gsap.fromTo(
          imageFrameRef.current,
          {
            clipPath: 'inset(12% 8% 12% 8%)',
            scale: 1.08,
            opacity: 0.8,
          },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            scale: 1.0,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: imageColRef.current,
              start: 'top 85%',
              end: 'bottom 60%',
              scrub: 1,
            },
          }
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative py-28 sm:py-36 lg:py-48 bg-[#FAF8F5] text-[#161514] border-t border-[#E8E2D8] overflow-hidden"
    >
      {/* Subtle Oversized Editorial Background Typography */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[160px] sm:text-[220px] lg:text-[320px] font-serif font-light text-[#E8E2D8]/20 select-none pointer-events-none leading-none z-0">
        98
      </div>

      <div className="relative w-full max-w-[1600px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 z-10">
        {/* Subtle Editorial Header Label */}
        <div className="flex items-center space-x-3 mb-12 sm:mb-16">
          <span className="text-[10px] tracking-[0.3em] uppercase font-sans text-[#9C7E55] font-medium">
            01 / INTRODUCTION
          </span>
          <span className="text-xs text-[#9C7E55] font-hindi">
            • रीवा का प्रतिष्ठित सैलून
          </span>
        </div>

        {/* Asymmetrical Editorial Composition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
          {/* Left Column: Pure Typography */}
          <div ref={textColRef} className="lg:col-span-7 flex flex-col justify-start">
            <h2 className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-serif font-light text-[#161514] leading-[1.0] tracking-[-0.02em]">
              MORE THAN A SALON.
              <br />
              <span className="italic font-normal text-[#9C7E55]">
                A PLACE TO FEEL YOUR BEST.
              </span>
            </h2>

            <div className="mt-12 sm:mt-16 max-w-xl space-y-6">
              <p className="text-lg sm:text-xl text-[#2A2825] font-serif font-light leading-relaxed">
                Discover 98 Salon &amp; Academy, where beauty, creativity and professional care come together. Explore hair, skin, makeup and nail services in a welcoming salon environment.
              </p>

              <p className="text-sm text-[#646059] font-sans font-light leading-relaxed">
                Located on Allahabad Road beside Bikaner Express in Bara, Rewa, our studio provides attentive personal consultations, architectural styling stations, and a peaceful atmosphere designed to rejuvenate.
              </p>
            </div>

            <div className="mt-12 flex items-center space-x-8 pt-8 border-t border-[#E8E2D8]">
              <button
                onClick={onExploreServices}
                className="group inline-flex items-center space-x-2 text-xs tracking-[0.2em] uppercase font-medium text-[#161514] hover:text-[#9C7E55] transition-colors cursor-pointer"
              >
                <span>Explore Services</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1.5 text-[#9C7E55]" />
              </button>

              <button
                onClick={onOpenBooking}
                className="group inline-flex items-center space-x-1 text-xs tracking-[0.2em] uppercase font-medium text-[#646059] hover:text-[#161514] transition-colors cursor-pointer"
              >
                <span className="border-b border-[#E8E2D8] group-hover:border-[#161514] transition-colors pb-0.5">
                  Book Visit
                </span>
                <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </div>
          </div>

          {/* Right Column: Authentic Photograph with Tactile Hover Interaction */}
          <div ref={imageColRef} className="lg:col-span-5 flex flex-col justify-start">
            <div
              ref={imageFrameRef}
              className="group relative aspect-[3/4] w-full overflow-hidden bg-[#161514] border border-[#E8E2D8] transition-all duration-700 ease-out shadow-md cursor-pointer"
            >
              <img
                src="/frames/frame_100.jpg"
                alt="98 Salon & Academy Interior Styling Stations with Arched Mirrors in Rewa"
                className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

              {/* Standout tactile image hover caption with sliding arrow */}
              <div className="absolute bottom-4 left-4 right-4 text-white text-[10px] tracking-widest uppercase font-sans flex items-center justify-between z-10 transition-transform duration-300 group-hover:-translate-y-1">
                <span className="font-medium">Arched Mirrors &amp; Styling Floor</span>
                <div className="flex items-center space-x-1.5 text-[#C5A880]">
                  <span>Rewa Studio</span>
                  <ArrowUpRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>
            </div>

            <p className="text-[11px] text-[#646059] font-sans mt-3 font-light tracking-wide">
              Architectural styling stations and natural illumination inside 98 Salon &amp; Academy, Rewa.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
