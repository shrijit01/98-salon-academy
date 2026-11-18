import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { SALON_INFO } from '../data/salonData';
import { generateGeneralWhatsAppUrl } from '../utils/whatsapp';

export const ContactSection: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(SALON_INFO.address.full);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section id="contact" className="py-28 sm:py-36 bg-[#FAF8F5] text-[#161514] border-t border-[#E8E2D8]">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-8 border-b border-[#E8E2D8]">
          <div>
            <span className="text-[10px] tracking-[0.3em] uppercase font-sans text-[#9C7E55] font-medium block mb-3">
              08 / LOCATION &amp; STUDIO
            </span>
            <h2 className="text-4xl sm:text-6xl font-serif font-light text-[#161514] tracking-[-0.02em]">
              VISIT 98 SALON &amp; ACADEMY
            </h2>
            <p className="text-xs text-[#9C7E55] font-hindi mt-1">
              रीवा में आपका स्वागत है — संपर्क एवं स्थान विवरण
            </p>
          </div>

          <p className="mt-6 md:mt-0 text-xs sm:text-sm text-[#646059] max-w-xs font-sans font-light leading-relaxed">
            Conveniently situated on Allahabad Road in Rewa. Ample parking and quiet second-floor privacy.
          </p>
        </div>

        {/* Asymmetrical Studio Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          {/* Left Column: Address, Phone & Actions */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-12">
            <div>
              <h3 className="font-serif text-3xl text-[#161514] font-light">
                Studio Address
              </h3>

              <div className="mt-6 text-sm sm:text-base text-[#2A2825] font-serif font-light leading-relaxed">
                <p>98 SALON &amp; ACADEMY</p>
                <p>First Floor, Allahabad Road,</p>
                <p>Beside Bikaner Express, Bara, Indira Nagar,</p>
                <p>Rewa, Madhya Pradesh 486001.</p>
              </div>

              <div className="mt-4">
                <button
                  onClick={handleCopyAddress}
                  className="text-[11px] tracking-wider uppercase font-sans text-[#9C7E55] hover:text-[#161514] transition-colors cursor-pointer"
                >
                  {copied ? '✓ Address Copied to Clipboard' : 'Copy Full Address'}
                </button>
              </div>
            </div>

            <div className="pt-8 border-t border-[#E8E2D8] space-y-6">
              <div>
                <span className="text-[10px] tracking-[0.2em] uppercase font-sans text-[#646059] block mb-1">
                  TELEPHONE
                </span>
                <a
                  href={`tel:${SALON_INFO.phoneRaw}`}
                  className="font-mono text-xl sm:text-2xl text-[#161514] hover:text-[#9C7E55] transition-colors block"
                >
                  {SALON_INFO.phone}
                </a>
              </div>

              <div>
                <span className="text-[10px] tracking-[0.2em] uppercase font-sans text-[#646059] block mb-1">
                  HOURS
                </span>
                <p className="text-xs sm:text-sm text-[#2A2825] font-sans font-light">
                  {SALON_INFO.hours}
                </p>
              </div>
            </div>

            <div className="pt-8 border-t border-[#E8E2D8] flex flex-wrap gap-4">
              <a
                href={`tel:${SALON_INFO.phoneRaw}`}
                className="px-6 py-3 border border-[#161514] hover:bg-[#161514] hover:text-[#FAF8F5] text-[#161514] text-[11px] tracking-[0.2em] uppercase font-medium transition-colors"
              >
                Call Studio
              </a>

              <a
                href={generateGeneralWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 border border-[#E8E2D8] hover:border-[#161514] text-[#161514] text-[11px] tracking-[0.2em] uppercase font-medium transition-colors"
              >
                WhatsApp Us
              </a>

              <a
                href={SALON_INFO.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 text-[11px] tracking-[0.2em] uppercase font-medium text-[#9C7E55] hover:text-[#161514] transition-colors flex items-center space-x-1"
              >
                <span>Google Maps</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Right Column: Clean Map View */}
          <div className="lg:col-span-7">
            <div className="relative aspect-[16/11] overflow-hidden bg-[#E8E2D8] border border-[#E8E2D8]">
              <iframe
                title="Google Maps Location of 98 Salon & Academy Rewa"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3629.831557997576!2d81.3060!3d24.5360!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39845a7061d31061%3A0x6b7724a7375276e0!2sBikaner%20Express!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                className="w-full h-full border-0 filter grayscale contrast-125"
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className="mt-3 flex items-center justify-between text-[11px] text-[#646059] font-sans font-light">
              <span>Beside Bikaner Express, Allahabad Road, Rewa</span>
              <span className="font-mono text-[10px]">PIN: 486001</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
