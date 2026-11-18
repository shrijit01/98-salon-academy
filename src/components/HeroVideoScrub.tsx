import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDown, Sparkles, AlertCircle, Play, Pause } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface HeroVideoScrubProps {
  onOpenBooking: () => void;
}

export const HeroVideoScrub: React.FC<HeroVideoScrubProps> = ({ onOpenBooking }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoWrapperRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const progressTextRef = useRef<HTMLDivElement | null>(null);

  const [isVideoReady, setIsVideoReady] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [currentChapter, setCurrentChapter] = useState('01 / Arrival');
  const [isPlayingManually, setIsPlayingManually] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // References for RAF video seeking loop
  const targetTimeRef = useRef<number>(0);
  const rafIdRef = useRef<number | null>(null);
  const lastSetTimeRef = useRef<number>(0);

  // Video chapters based on scroll progress
  const updateChapter = useCallback((progress: number) => {
    if (progress < 0.25) {
      setCurrentChapter('01 / The Corridor Promenade');
    } else if (progress < 0.55) {
      setCurrentChapter('02 / Entrance & Archways');
    } else if (progress < 0.85) {
      setCurrentChapter('03 / The Styling Sanctuaries');
    } else {
      setCurrentChapter('04 / Products & Artistry');
    }
  }, []);

  // RAF loop that smoothly interpolates video currentTime
  const startRafLoop = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    const render = () => {
      if (video && video.duration && !isPlayingManually) {
        const target = targetTimeRef.current;
        const current = video.currentTime;
        const diff = target - current;

        // If not actively seeking and there is a noticeable discrepancy
        if (!video.seeking && Math.abs(diff) > 0.02) {
          // Smooth leap toward target
          const step = diff * 0.22;
          const newTime = Math.abs(diff) < 0.04 ? target : current + step;

          if (Math.abs(newTime - lastSetTimeRef.current) > 0.01) {
            try {
              video.currentTime = Math.max(0, Math.min(video.duration, newTime));
              lastSetTimeRef.current = video.currentTime;
            } catch {
              // Ignore seek interruption errors
            }
          }
        }
      }
      rafIdRef.current = requestAnimationFrame(render);
    };

    rafIdRef.current = requestAnimationFrame(render);
  }, [isPlayingManually]);

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;

    let trigger: ScrollTrigger | null = null;

    const onMetadataLoaded = () => {
      setIsVideoReady(true);
      setLoadError(false);

      // Force initial frame
      try {
        video.currentTime = 0.001;
      } catch {
        // ignore
      }

      // Initialize ScrollTrigger pinned sequence
      // Use +=350vh for an immersive, comfortable scrub distance
      trigger = ScrollTrigger.create({
        trigger: container,
        start: 'top top',
        end: '+=350%',
        pin: true,
        scrub: 0.5,
        anticipatePin: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          setScrollProgress(progress);
          updateChapter(progress);

          if (video.duration && !isPlayingManually) {
            targetTimeRef.current = progress * (video.duration - 0.05);
          }

          // Subtle fadeout of hero intro text as user journeys in
          if (overlayRef.current) {
            const opacity = Math.max(0, 1 - progress * 2.8);
            overlayRef.current.style.opacity = opacity.toString();
            overlayRef.current.style.pointerEvents = opacity < 0.1 ? 'none' : 'auto';
          }
        },
      });

      startRafLoop();
    };

    const onError = () => {
      setLoadError(true);
    };

    // Video events
    video.addEventListener('loadedmetadata', onMetadataLoaded);
    video.addEventListener('error', onError);

    // If metadata already loaded
    if (video.readyState >= 1) {
      onMetadataLoaded();
    }

    return () => {
      video.removeEventListener('loadedmetadata', onMetadataLoaded);
      video.removeEventListener('error', onError);
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
      if (trigger) {
        trigger.kill();
      }
    };
  }, [isPlayingManually, startRafLoop, updateChapter]);

  // Toggle manual playback fallback for users
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setIsPlayingManually(true);
    } else {
      video.pause();
      setIsPlayingManually(false);
    }
  };

  return (
    <section
      ref={containerRef}
      id="home"
      className="relative w-full h-screen bg-[#1A1918] text-[#FAF8F5] overflow-hidden select-none"
    >
      {/* 
        WATERMARK-SAFE CROPPING SYSTEM
        The container hides overflow and anchors the video to the top.
        CSS variable --video-zoom scales the video (1.24x) from top 12%,
        ensuring bottom-right AI watermarks are safely cropped out on all viewports.
      */}
      <div
        ref={videoWrapperRef}
        className="video-scrub-container relative w-full h-full overflow-hidden"
      >
        <video
          ref={videoRef}
          src="/assets/salon-walkthrough.mp4"
          poster="/assets/corridor.jpg"
          preload="auto"
          muted
          playsInline
          style={{
            transform: 'scale(var(--video-zoom, 1.24))',
            transformOrigin: 'center var(--video-origin-y, 12%)',
          }}
          className="video-scrub-element w-full h-full object-cover pointer-events-none"
        />

        {/* Static reduced-motion fallback */}
        <div
          className="video-reduced-motion-fallback hidden absolute inset-0 w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url('/assets/salon-interior.jpg')` }}
        />

        {/* Subtle cinematic gradient overlays for luxury contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1918]/80 via-transparent to-[#1A1918]/40 pointer-events-none" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#1A1918]/20 to-[#1A1918]/60 pointer-events-none" />
      </div>

      {/* Loading state indicator */}
      {!isVideoReady && !loadError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#1A1918]/80 backdrop-blur-xs z-30 transition-opacity duration-700">
          <div className="w-12 h-12 rounded-full border border-[#C5A880]/30 border-t-[#C5A880] animate-spin mb-4" />
          <p className="font-serif tracking-widest text-xs uppercase text-[#EDE5D8]">
            Curating Salon Ambience...
          </p>
        </div>
      )}

      {/* Error fallback */}
      {loadError && (
        <div className="absolute top-6 right-6 z-40 bg-[#1A1918]/90 border border-amber-500/30 px-4 py-2 rounded-xs flex items-center space-x-2 text-xs text-amber-200">
          <AlertCircle className="w-4 h-4 text-amber-400" />
          <span>Using architectural still presentation</span>
        </div>
      )}

      {/* 
        HERO OVERLAY — MINIMAL & ELEGANT
        Strict adherence to project guidelines:
        - Top left: 98 SALON & ACADEMY, small subtitle: A BEAUTY EXPERIENCE IN REWA
        - Bottom left: Beauty is an experience. Discover yours.
        - Small scroll indicator: SCROLL TO EXPLORE ↓
        - Does not obstruct the video.
      */}
      <div
        ref={overlayRef}
        className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between p-6 sm:p-10 md:p-16 transition-opacity duration-300"
      >
        {/* Top left editorial branding */}
        <div className="pt-20 sm:pt-24 max-w-lg pointer-events-auto">
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-[#FAF8F5]/10 backdrop-blur-md border border-[#FAF8F5]/15 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880] animate-pulse" />
            <span className="text-[10px] tracking-[0.25em] uppercase font-sans text-[#FAF8F5]/90 font-medium">
              Rewa, Madhya Pradesh
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-light tracking-tight text-[#FAF8F5] leading-[1.05]">
            98 SALON &amp; ACADEMY
          </h1>
          <p className="text-xs sm:text-sm tracking-[0.28em] uppercase text-[#C5A880] font-sans font-medium mt-2">
            A BEAUTY EXPERIENCE IN REWA
          </p>

          <p className="text-xs sm:text-sm text-[#FAF8F5]/70 mt-3 font-hindi tracking-wide">
            98 सैलून &amp; एकेडमी — सौंदर्य, आत्मविश्वास और रचनात्मकता
          </p>
        </div>

        {/* Bottom content bar */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pointer-events-auto">
          {/* Bottom left signature quote */}
          <div className="max-w-md">
            <p className="text-lg sm:text-2xl font-serif text-[#FAF8F5] italic leading-snug">
              &ldquo;Beauty is an experience. <br className="hidden sm:inline" />
              Discover yours.&rdquo;
            </p>
            <p className="text-xs text-[#FAF8F5]/60 mt-1.5 tracking-wider uppercase font-sans">
              Hair • Skin • Makeup • Nails • Academy
            </p>

            <div className="mt-4 flex items-center space-x-3">
              <button
                onClick={onOpenBooking}
                className="px-5 py-2.5 bg-[#C5A880] hover:bg-[#B89766] text-[#1A1918] font-sans text-xs tracking-widest uppercase font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-[#C5A880]/20 flex items-center space-x-2 cursor-pointer"
              >
                <span>Book Appointment</span>
                <Sparkles className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={togglePlay}
                title={isPlayingManually ? "Pause manual video" : "Play continuous preview"}
                className="p-2.5 bg-[#FAF8F5]/10 hover:bg-[#FAF8F5]/20 text-[#FAF8F5] backdrop-blur-md border border-[#FAF8F5]/20 text-xs transition-colors cursor-pointer"
              >
                {isPlayingManually ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Small scroll indicator */}
          <div className="flex items-center space-x-3 text-[#FAF8F5]/70">
            <span className="text-[11px] tracking-[0.25em] uppercase font-sans font-medium">
              SCROLL TO EXPLORE
            </span>
            <div className="w-8 h-8 rounded-full border border-[#FAF8F5]/30 flex items-center justify-center animate-bounce">
              <ArrowDown className="w-3.5 h-3.5 text-[#C5A880]" />
            </div>
          </div>
        </div>
      </div>

      {/* 
        INTERACTIVE WALKTHROUGH HUD (Heads-Up Display)
        Subtle chapter badge & scrub progress tracker
      */}
      <div className="absolute bottom-6 right-6 sm:bottom-10 sm:right-10 z-20 pointer-events-none flex flex-col items-end">
        <div className="bg-[#1A1918]/60 backdrop-blur-md border border-[#FAF8F5]/15 px-3 py-1.5 text-right">
          <p className="text-[10px] tracking-[0.2em] uppercase text-[#C5A880] font-mono">
            WALKTHROUGH JOURNEY
          </p>
          <p
            ref={progressTextRef}
            className="text-xs sm:text-sm font-serif text-[#FAF8F5] tracking-wide"
          >
            {currentChapter}
          </p>
        </div>

        {/* Minimal progress line */}
        <div className="w-32 h-[2px] bg-white/20 mt-2 overflow-hidden">
          <div
            className="h-full bg-[#C5A880] transition-all duration-150 ease-out"
            style={{ width: `${Math.round(scrollProgress * 100)}%` }}
          />
        </div>
      </div>
    </section>
  );
};
