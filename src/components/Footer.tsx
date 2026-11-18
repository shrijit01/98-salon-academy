import React from 'react';
import { ArrowUp } from 'lucide-react';
import { SALON_INFO } from '../data/salonData';

interface FooterProps {
  onReplayIntro?: () => void;
}

const CURRENT_YEAR = 2026;

export const Footer: React.FC<FooterProps> = ({ onReplayIntro }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#161514] text-[#FAF8F5] pt-24 pb-14 border-t border-[#262422] select-none">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16">
        {/* Main Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 pb-20 border-b border-[#262422]">
          {/* Brand Column */}
          <div className="md:col-span-5 flex flex-col justify-between">
            <div>
              <h3 className="font-serif text-3xl sm:text-4xl font-light tracking-[0.02em] text-[#FAF8F5]">
                98 SALON &amp; ACADEMY
              </h3>
              <p className="font-hindi text-base text-[#C5A880] mt-1 font-light">
                98 सैलून &amp; एकेडमी
              </p>

              <p className="mt-6 text-sm text-[#FAF8F5]/70 max-w-sm font-serif italic leading-relaxed">
                Beauty. Confidence. Creativity.
              </p>

              <p className="mt-2 text-xs text-[#FAF8F5]/50 max-w-sm font-sans font-light leading-relaxed">
                A luxury beauty sanctuary and practical education studio in Rewa, Madhya Pradesh.
              </p>
            </div>

            <div className="mt-8 flex items-center space-x-6 text-xs text-[#FAF8F5]/60 font-sans">
              <a
                href={SALON_INFO.instagramPlaceholder}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#FAF8F5] transition-colors"
              >
                Instagram
              </a>
              <span className="text-[#FAF8F5]/20">•</span>
              <a
                href={SALON_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#FAF8F5] transition-colors"
              >
                WhatsApp
              </a>
              <span className="text-[#FAF8F5]/20">•</span>
              <a
                href={`tel:${SALON_INFO.phoneRaw}`}
                className="hover:text-[#FAF8F5] transition-colors font-mono"
              >
                088157 07200
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-3">
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#C5A880] font-sans font-medium block mb-6">
              NAVIGATION
            </span>
            <ul className="space-y-3 text-[11px] tracking-[0.2em] uppercase font-sans font-light">
              <li>
                <a href="#home" className="text-[#FAF8F5]/70 hover:text-[#FAF8F5] transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#about" className="text-[#FAF8F5]/70 hover:text-[#FAF8F5] transition-colors">
                  Our Salon
                </a>
              </li>
              <li>
                <a href="#services" className="text-[#FAF8F5]/70 hover:text-[#FAF8F5] transition-colors">
                  Services
                </a>
              </li>
              <li>
                <a href="#products" className="text-[#FAF8F5]/70 hover:text-[#FAF8F5] transition-colors">
                  Products
                </a>
              </li>
              <li>
                <a href="#gallery" className="text-[#FAF8F5]/70 hover:text-[#FAF8F5] transition-colors">
                  Gallery
                </a>
              </li>
              <li>
                <a href="#academy" className="text-[#FAF8F5]/70 hover:text-[#FAF8F5] transition-colors">
                  Academy
                </a>
              </li>
              <li>
                <a href="#contact" className="text-[#FAF8F5]/70 hover:text-[#FAF8F5] transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Location Details */}
          <div className="md:col-span-4">
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#C5A880] font-sans font-medium block mb-6">
              STUDIO LOCATION
            </span>
            <div className="space-y-3 text-xs text-[#FAF8F5]/70 font-sans font-light leading-relaxed">
              <p className="text-sm text-[#FAF8F5] font-serif font-light">
                First Floor, Allahabad Road,
                <br />
                Beside Bikaner Express, Bara, Indira Nagar,
                <br />
                Rewa, Madhya Pradesh 486001.
              </p>
              <p className="pt-2">
                Tuesday – Sunday: 10:00 AM – 8:00 PM
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright, Replay Intro & Back to Top */}
        <div className="pt-10 flex flex-col sm:flex-row items-center justify-between gap-6 text-[11px] text-[#FAF8F5]/50 font-sans font-light">
          <p>
            &copy; {CURRENT_YEAR} 98 Salon &amp; Academy. All rights reserved. Rewa, Madhya Pradesh.
          </p>

          <div className="flex items-center space-x-6">
            {onReplayIntro && (
              <button
                onClick={onReplayIntro}
                className="group inline-flex items-center space-x-1.5 text-[10px] tracking-[0.2em] uppercase text-[#C5A880] hover:text-[#FAF8F5] transition-colors cursor-pointer"
              >
                <span>Replay Scissor Cut Intro</span>
              </button>
            )}

            <button
              onClick={scrollToTop}
              className="group flex items-center space-x-2 text-[10px] tracking-[0.25em] uppercase hover:text-[#FAF8F5] transition-colors cursor-pointer"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 text-[#C5A880]" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
