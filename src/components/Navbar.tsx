import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';
import { SALON_INFO } from '../data/salonData';

interface NavbarProps {
  onOpenBooking: () => void;
  onReplayIntro?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenBooking, onReplayIntro }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 60) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Services', href: '#services' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'Academy', href: '#academy' },
    { label: 'Contact', href: '#contact' },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    if (href === '#home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E8E2D8] text-[#161514] py-4'
            : 'bg-transparent text-[#FAF8F5] py-6 sm:py-7'
        }`}
      >
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 flex items-center justify-between">
          {/* Brand Logo */}
          <a
            href="#home"
            onClick={(e) => handleLinkClick(e, '#home')}
            className="group flex flex-col cursor-pointer shrink-0"
          >
            <span
              className={`font-serif tracking-[0.04em] text-xl sm:text-2xl font-light whitespace-nowrap transition-colors ${
                isScrolled ? 'text-[#161514]' : 'text-[#FAF8F5]'
              }`}
            >
              98 SALON &amp; ACADEMY
            </span>
            <span
              className={`text-[8.5px] tracking-[0.3em] uppercase font-sans -mt-0.5 whitespace-nowrap transition-colors ${
                isScrolled ? 'text-[#9C7E55]' : 'text-[#C5A880]'
              }`}
            >
              REWA • MADHYA PRADESH
            </span>
          </a>

          {/* Desktop Minimalist Links with Animated Underline */}
          <nav className="hidden lg:flex items-center gap-7 xl:gap-9">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className={`group relative text-[10px] xl:text-[11px] tracking-[0.25em] uppercase font-sans font-medium transition-colors py-1 cursor-pointer whitespace-nowrap ${
                  isScrolled
                    ? 'text-[#646059] hover:text-[#161514]'
                    : 'text-[#FAF8F5]/80 hover:text-[#FAF8F5]'
                }`}
              >
                <span>{link.label}</span>
                <span
                  className={`absolute bottom-0 left-0 w-0 h-[1.5px] transition-all duration-300 group-hover:w-full ${
                    isScrolled ? 'bg-[#9C7E55]' : 'bg-[#C5A880]'
                  }`}
                />
              </a>
            ))}
          </nav>

          {/* Right Action: Editorial Button with Slide Arrow */}
          <div className="hidden sm:flex items-center space-x-6 shrink-0">
            <a
              href={`tel:${SALON_INFO.phoneRaw}`}
              className={`hidden 2xl:inline text-[11px] font-mono tracking-wider transition-colors ${
                isScrolled ? 'text-[#646059] hover:text-[#161514]' : 'text-[#FAF8F5]/70 hover:text-[#FAF8F5]'
              }`}
            >
              {SALON_INFO.phone}
            </a>

            <button
              onClick={onOpenBooking}
              className={`group relative inline-flex items-center space-x-2 px-5 py-2.5 text-[10px] tracking-[0.25em] uppercase font-medium transition-all duration-300 cursor-pointer whitespace-nowrap border ${
                isScrolled
                  ? 'border-[#161514] bg-[#161514] text-[#FAF8F5] hover:bg-[#2A2825]'
                  : 'border-white/50 bg-white/10 backdrop-blur-sm text-[#FAF8F5] hover:border-white hover:bg-white hover:text-[#161514]'
              }`}
            >
              <span>Book Appointment</span>
              <ArrowRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1 text-[#C5A880] group-hover:text-inherit" />
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className={`lg:hidden p-2 transition-colors cursor-pointer ${
              isScrolled ? 'text-[#161514]' : 'text-[#FAF8F5]'
            }`}
          >
            {mobileMenuOpen ? <X className="w-6 h-6 stroke-1" /> : <Menu className="w-6 h-6 stroke-1" />}
          </button>
        </div>
      </header>

      {/* Mobile Editorial Full-Screen Drawer */}
      <div
        className={`fixed inset-0 z-40 bg-[#FAF8F5] text-[#161514] transition-all duration-500 flex flex-col justify-between p-8 sm:p-12 pt-28 lg:hidden ${
          mobileMenuOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <div className="flex flex-col space-y-5">
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#9C7E55] font-sans font-medium">
            INDEX
          </span>
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleLinkClick(e, link.href)}
              className="text-3xl font-serif font-light text-[#161514] hover:text-[#9C7E55] transition-colors py-1 cursor-pointer"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="pt-8 border-t border-[#E8E2D8] flex flex-col space-y-4">
          <p className="text-xs text-[#646059] leading-relaxed font-light">
            First Floor, Allahabad Road, Beside Bikaner Express, Bara, Rewa, MP 486001
          </p>

          <a href={`tel:${SALON_INFO.phoneRaw}`} className="font-mono text-sm text-[#161514]">
            {SALON_INFO.phone}
          </a>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenBooking();
            }}
            className="w-full py-3.5 bg-[#161514] text-[#FAF8F5] font-sans text-[11px] tracking-[0.25em] uppercase font-medium text-center transition-colors cursor-pointer mt-2"
          >
            Book Appointment
          </button>

          {onReplayIntro && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onReplayIntro();
              }}
              className="w-full py-2.5 border border-[#E8E2D8] hover:border-[#161514] text-[#646059] hover:text-[#161514] font-sans text-[10px] tracking-[0.2em] uppercase font-medium text-center transition-colors cursor-pointer"
            >
              Replay Scissor Cut Intro
            </button>
          )}
        </div>
      </div>
    </>
  );
};
