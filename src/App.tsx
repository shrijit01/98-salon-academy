import { useEffect, useState } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { ScissorCutIntro } from './components/ScissorCutIntro';
import { Navbar } from './components/Navbar';
import { HeroCanvasScrub } from './components/HeroCanvasScrub';
import { Introduction } from './components/Introduction';
import { Services } from './components/Services';
import { Products } from './components/Products';
import { SalonExperience } from './components/SalonExperience';
import { Gallery } from './components/Gallery';
import { Academy } from './components/Academy';
import { AppointmentSection } from './components/AppointmentSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { AppointmentModal } from './components/AppointmentModal';
import { Lightbox } from './components/Lightbox';
import { CustomCursor } from './components/CustomCursor';
import { ScrollProgress } from './components/ScrollProgress';
import { REAL_SALON_GALLERY, type GalleryImage } from './data/salonData';

gsap.registerPlugin(ScrollTrigger);

export function App() {
  const [isIntroComplete, setIsIntroComplete] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('98_intro_played') === 'true';
    }
    return false;
  });
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedService, setSelectedService] = useState('Hair');
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);

  const handleIntroComplete = () => {
    setIsIntroComplete(true);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('98_intro_played', 'true');
    }
  };

  const handleReplayIntro = () => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setIsIntroComplete(false);
  };

  // Initialize Lenis smooth scroll and sync with GSAP
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    (window as any).__lenis = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(tickerCallback);
    };
  }, []);

  const handleOpenBooking = (service?: string) => {
    if (service) setSelectedService(service);
    setIsBookingOpen(true);
  };

  const handleOpenLightboxBySrc = (src: string) => {
    const index = REAL_SALON_GALLERY.findIndex((img) => img.src === src);
    if (index !== -1) {
      setActiveGalleryIndex(index);
    } else {
      setActiveGalleryIndex(0);
    }
    setIsLightboxOpen(true);
  };

  const handleOpenLightboxByImage = (image: GalleryImage) => {
    const index = REAL_SALON_GALLERY.findIndex((img) => img.id === image.id);
    if (index !== -1) {
      setActiveGalleryIndex(index);
    } else {
      setActiveGalleryIndex(0);
    }
    setIsLightboxOpen(true);
  };

  const handleNextImage = () => {
    setActiveGalleryIndex((prev) => (prev + 1) % REAL_SALON_GALLERY.length);
  };

  const handlePrevImage = () => {
    setActiveGalleryIndex((prev) => (prev - 1 + REAL_SALON_GALLERY.length) % REAL_SALON_GALLERY.length);
  };

  const handleExploreServices = () => {
    const el = document.getElementById('services');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen bg-[#FAF8F5] text-[#1A1918] selection:bg-[#C5A880]/30 selection:text-[#1A1918]">
      {/* SIGNATURE FIRST-LOAD INTRO: The Scissor Cut */}
      {!isIntroComplete && (
        <ScissorCutIntro onComplete={handleIntroComplete} />
      )}

      {/* Top scroll progress indicator */}
      <ScrollProgress />

      {/* Desktop subtle custom cursor */}
      <CustomCursor />

      {/* Transparent-to-ivory responsive header navigation */}
      <Navbar
        onOpenBooking={() => handleOpenBooking()}
        onReplayIntro={handleReplayIntro}
      />

      <main>
        {/* CENTERPIECE: Scroll-controlled frame-by-frame canvas sequence (frame 001 to frame 190) */}
        <HeroCanvasScrub
          onOpenBooking={() => handleOpenBooking()}
          isIntroComplete={isIntroComplete}
        />

        {/* Editorial Introduction with authentic corridor photography */}
        <Introduction
          onExploreServices={handleExploreServices}
          onOpenBooking={() => handleOpenBooking()}
        />

        {/* Services Showcase: Hair, Skin, Makeup, Nails */}
        <Services onSelectServiceForBooking={(srv) => handleOpenBooking(srv)} />

        {/* Products Showcase: Haircare, Cleansing, Styling, Skincare, Nails */}
        <Products onOpenBooking={() => handleOpenBooking('Products & Treatments')} />

        {/* The Salon Experience: Arched Mirrors, Barber Chairs, Real Interior Assets */}
        <SalonExperience onOpenLightbox={handleOpenLightboxBySrc} />

        {/* Photo Gallery with Lightbox */}
        <Gallery onSelectImage={handleOpenLightboxByImage} />

        {/* Academy Section */}
        <Academy />

        {/* Appointment Booking Enquiry Section */}
        <AppointmentSection prefilledService={selectedService} />

        {/* Contact, Address & Location Details with Google Maps */}
        <ContactSection />
      </main>

      {/* Editorial Footer */}
      <Footer onReplayIntro={handleReplayIntro} />

      {/* Fast Appointment Enquiry Drawer/Modal */}
      <AppointmentModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        initialService={selectedService}
      />

      {/* Fullscreen Lightbox Modal */}
      <Lightbox
        isOpen={isLightboxOpen}
        activeImage={REAL_SALON_GALLERY[activeGalleryIndex] || null}
        onClose={() => setIsLightboxOpen(false)}
        onNext={handleNextImage}
        onPrev={handlePrevImage}
      />
    </div>
  );
}

export default App;
