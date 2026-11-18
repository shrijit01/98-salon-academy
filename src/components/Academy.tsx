import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { generateAcademyWhatsAppUrl } from '../utils/whatsapp';

export const Academy: React.FC = () => {
  const handleAcademyEnquiry = () => {
    window.open(generateAcademyWhatsAppUrl('Beauty & Hair Styling Mentorship'), '_blank');
  };

  return (
    <section id="academy" className="relative py-28 sm:py-36 lg:py-44 bg-[#F5F2EC] text-[#161514] border-t border-[#E8E2D8] overflow-hidden">
      {/* Subtle Oversized Editorial Background Typography */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 text-[140px] sm:text-[200px] lg:text-[280px] font-serif font-light text-[#DFD5C6]/25 select-none pointer-events-none leading-none z-0">
        ACADEMY
      </div>

      <div className="relative w-full max-w-[1600px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 z-10">
        {/* Asymmetrical Editorial Composition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
          {/* Left Column: Academy Narrative */}
          <div className="lg:col-span-6 flex flex-col justify-start">
            <span className="text-[10px] tracking-[0.3em] uppercase font-sans text-[#9C7E55] font-medium block mb-3">
              06 / ACADEMY &amp; EDUCATION
            </span>

            <h2 className="text-4xl sm:text-6xl font-serif font-light text-[#161514] leading-[1.0] tracking-[-0.02em]">
              LEARN THE ART
              <br />
              <span className="italic font-normal text-[#9C7E55]">
                OF BEAUTY.
              </span>
            </h2>

            <div className="mt-10 sm:mt-12 max-w-xl space-y-6">
              <p className="text-lg sm:text-xl text-[#2A2825] font-serif font-light leading-relaxed">
                Explore the academy side of 98 Salon &amp; Academy, bringing beauty, creativity and practical learning together.
              </p>

              <p className="text-sm text-[#646059] font-sans font-light leading-relaxed">
                Our education studio provides focused practical training in modern hair design, skin therapies, bridal aesthetics, and salon craft. Students gain hands-on experience within our active Rewa studio.
              </p>
            </div>

            <div className="mt-12 pt-8 border-t border-[#DFD5C6] flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <button
                onClick={handleAcademyEnquiry}
                className="group inline-flex items-center space-x-2 text-xs tracking-[0.2em] uppercase font-medium text-[#161514] hover:text-[#9C7E55] transition-colors cursor-pointer"
              >
                <span className="border-b border-[#DFD5C6] group-hover:border-[#9C7E55] transition-colors pb-0.5">
                  Course Enquiry via WhatsApp
                </span>
                <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-[#9C7E55]" />
              </button>

              <span className="text-xs text-[#646059] font-sans font-light">
                Direct coordinator assistance: 088157 07200
              </span>
            </div>
          </div>

          {/* Right Column: Authentic Academy Photography */}
          <div className="lg:col-span-6 relative mt-4 lg:mt-0">
            <div className="group relative aspect-[4/3] overflow-hidden bg-[#DFD5C6] border border-[#DFD5C6] shadow-md cursor-pointer">
              <img
                src="/frames/frame_180.jpg"
                alt="Hair styling training and masterclass session at 98 Salon & Academy Rewa"
                className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 text-white text-[10px] tracking-widest uppercase font-sans flex items-center justify-between z-10 transition-transform duration-300 group-hover:-translate-y-1">
                <span className="font-medium">Masterclass Styling Session</span>
                <span className="text-[#C5A880]">Rewa Academy</span>
              </div>
            </div>
            <p className="mt-4 text-[11px] tracking-wide text-[#646059] font-sans font-light">
              Master educator demonstrating precision styling on the student training floor at 98 Academy.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
