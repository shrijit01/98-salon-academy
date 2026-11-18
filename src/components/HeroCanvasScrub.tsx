import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { Hero3DScissors } from './Hero3DScissors';

gsap.registerPlugin(ScrollTrigger);

interface HeroCanvasScrubProps {
  onOpenBooking: () => void;
  isIntroComplete?: boolean;
}

const TOTAL_FRAMES = 190;
const getFramePath = (index: number) => {
  const frameNum = String(index + 1).padStart(3, '0');
  return `/frames/frame_${frameNum}.jpg`;
};

export const HeroCanvasScrub: React.FC<HeroCanvasScrubProps> = ({
  onOpenBooking,
  isIntroComplete = true,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  // Line-by-line reveal references
  const line1Ref = useRef<HTMLSpanElement | null>(null);
  const line2Ref = useRef<HTMLSpanElement | null>(null);
  const sublineRef = useRef<HTMLParagraphElement | null>(null);
  const ctaGroupRef = useRef<HTMLDivElement | null>(null);

  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef<number>(0);
  const targetFrameRef = useRef<number>(0);
  const isRenderingRef = useRef<boolean>(false);

  // Mutable ref for zero-rerender 60 FPS WebGL 3D sync
  const scrollProgressRef = useRef<number>(0);

  const [isInitialReady, setIsInitialReady] = useState(false);

  // High-performance canvas frame drawer with calibrated watermark-safe cover scale
  const drawFrame = useCallback((frameIdx: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let img = imagesRef.current[frameIdx];

    // Fallback search to nearest loaded frame
    if (!img || !img.complete || img.naturalWidth === 0) {
      for (let offset = 1; offset < 25; offset++) {
        const prev = imagesRef.current[frameIdx - offset];
        if (prev && prev.complete && prev.naturalWidth > 0) {
          img = prev;
          break;
        }
        const next = imagesRef.current[frameIdx + offset];
        if (next && next.complete && next.naturalWidth > 0) {
          img = next;
          break;
        }
      }
    }

    if (!img || !img.complete || img.naturalWidth === 0) return;

    const canvasW = canvas.width;
    const canvasH = canvas.height;
    const imgW = img.naturalWidth;
    const imgH = img.naturalHeight;

    // Cover scale based on canvas buffer dimensions
    let scale = Math.max(canvasW / imgW, canvasH / imgH);

    // Calibrated crop zoom (1.28 desktop, 1.30 mobile) to safely crop the bottom-right watermark
    const isMobile = window.innerWidth < 768;
    const zoomFactor = isMobile ? 1.30 : 1.28;
    scale *= zoomFactor;

    const drawW = imgW * scale;
    const drawH = imgH * scale;

    // Center horizontally, anchor flush to top so bottom-right watermark is cropped out and top signage remains visible
    const drawX = (canvasW - drawW) / 2;
    const drawY = 0;

    // Ensure high-fidelity bicubic smoothing on every frame draw
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(img, drawX, drawY, drawW, drawH);
    currentFrameRef.current = frameIdx;
  }, []);

  // Request render frame loop
  const renderNextFrame = useCallback(() => {
    if (isRenderingRef.current) return;
    isRenderingRef.current = true;

    requestAnimationFrame(() => {
      const target = targetFrameRef.current;
      drawFrame(target);
      isRenderingRef.current = false;
    });
  }, [drawFrame]);

  // Handle canvas sizing on resize with devicePixelRatio support
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    const width = window.innerWidth;
    const height = window.innerHeight;

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (ctx) {
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
    }

    drawFrame(currentFrameRef.current);
  }, [drawFrame]);

  // Preload frames in smooth background batches
  useEffect(() => {
    imagesRef.current = new Array(TOTAL_FRAMES);

    let mounted = true;
    let firstLoadTriggered = false;

    // 1. Load initial frame immediately
    const firstImg = new Image();
    
    const onFirstLoad = () => {
      if (!mounted || firstLoadTriggered) return;
      firstLoadTriggered = true;
      setIsInitialReady(true);
      resizeCanvas();
      drawFrame(0);

      // 2. Preload remaining sequence in batches
      const batchSize = 12;
      let currentIndex = 1;

      const loadNextBatch = () => {
        if (!mounted || currentIndex >= TOTAL_FRAMES) return;

        const limit = Math.min(currentIndex + batchSize, TOTAL_FRAMES);
        let batchLoaded = 0;
        const countToLoad = limit - currentIndex;

        for (let i = currentIndex; i < limit; i++) {
          const img = new Image();
          img.onload = () => {
            batchLoaded++;
            if (batchLoaded === countToLoad) {
              currentIndex = limit;
              if ('requestIdleCallback' in window) {
                (window as any).requestIdleCallback(loadNextBatch);
              } else {
                setTimeout(loadNextBatch, 20);
              }
            }
          };
          img.onerror = () => {
            batchLoaded++;
            if (batchLoaded === countToLoad) {
              currentIndex = limit;
              setTimeout(loadNextBatch, 20);
            }
          };
          img.src = getFramePath(i);
          imagesRef.current[i] = img;
        }
      };

      loadNextBatch();
    };

    firstImg.onload = onFirstLoad;
    firstImg.onerror = onFirstLoad;
    firstImg.src = getFramePath(0);
    imagesRef.current[0] = firstImg;

    if (firstImg.complete && firstImg.naturalWidth > 0) {
      onFirstLoad();
    }

    window.addEventListener('resize', resizeCanvas, { passive: true });

    return () => {
      mounted = false;
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [drawFrame, resizeCanvas]);

  // Sophisticated line-by-line entrance animation
  useEffect(() => {
    if (!isInitialReady || !isIntroComplete) return;

    const tl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 1.1 } });

    tl.fromTo(
      line1Ref.current,
      { y: '110%', opacity: 0 },
      { y: '0%', opacity: 1, duration: 1.2 }
    )
      .fromTo(
        line2Ref.current,
        { y: '110%', opacity: 0 },
        { y: '0%', opacity: 1, duration: 1.2 },
        '-=0.9'
      )
      .fromTo(
        sublineRef.current,
        { y: 25, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9 },
        '-=0.7'
      )
      .fromTo(
        ctaGroupRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        '-=0.6'
      );
  }, [isInitialReady, isIntroComplete]);

  // Initialize GSAP ScrollTrigger for pinned frame scrubbing
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let trigger: ScrollTrigger | null = null;

    trigger = ScrollTrigger.create({
      id: 'hero-scrub-trigger',
      trigger: container,
      start: 'top top',
      end: '+=400%',
      pin: true,
      scrub: 0.5,
      anticipatePin: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        scrollProgressRef.current = progress;

        // Map progress (0.0 to 1.0) to frame index (0 to 189)
        const frameIndex = Math.min(
          TOTAL_FRAMES - 1,
          Math.max(0, Math.floor(progress * TOTAL_FRAMES))
        );

        targetFrameRef.current = frameIndex;
        renderNextFrame();

        // Fade out hero overlays as user scrolls into the salon interior
        if (overlayRef.current) {
          const opacity = Math.max(0, 1 - progress * 2.8);
          overlayRef.current.style.opacity = opacity.toString();
          overlayRef.current.style.pointerEvents = opacity < 0.1 ? 'none' : 'auto';
        }
      },
    });

    return () => {
      if (trigger) trigger.kill();
    };
  }, [renderNextFrame]);

  const handleScrollToSalon = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById('about');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={containerRef}
      id="home"
      className="relative w-full h-screen bg-[#161514] text-[#FAF8F5] overflow-hidden select-none"
    >
      {/* 
        LAYER 1: CANVAS FRAME-BY-FRAME SALON WALKTHROUGH SEQUENCE
        Controlled entirely by scroll position.
      */}
      <div className="relative w-full h-full overflow-hidden">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />

        {/* Luminous luxury subtle gradient overlays */}
        <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-[#161514]/85 via-[#161514]/40 to-transparent pointer-events-none z-10" />
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[#161514]/90 via-[#161514]/40 to-transparent pointer-events-none z-10" />
      </div>

      {/* Minimal Initial Frame Loading Indicator */}
      {!isInitialReady && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#161514] z-30 transition-opacity duration-700">
          <div className="w-7 h-7 border border-[#FAF8F5]/20 border-t-[#C5A880] animate-spin mb-4" />
          <p className="font-serif tracking-[0.25em] text-[11px] uppercase text-[#FAF8F5]/80">
            98 SALON &amp; ACADEMY
          </p>
        </div>
      )}

      {/* 
        LAYER 2: AWWWARDS-INSPIRED HERO COMPOSITION
        - Left 55%: Large minimal editorial typography with line-by-line reveal
        - Right 45%: Dedicated sculptural 3D chrome shears & ribbon visual
        - Bottom: Subtle Hindi heritage mark & quiet scroll indicator
      */}
      <div
        ref={overlayRef}
        className="absolute inset-0 pointer-events-none z-20 transition-opacity duration-300"
      >
        <div className="w-full max-w-[1600px] mx-auto h-full px-4 sm:px-8 md:px-12 lg:px-16 flex flex-col justify-between pt-24 sm:pt-28 pb-8 sm:pb-12">
          {/* Main Hero Spread: 2-Column Balanced Composition */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-auto w-full">
            {/* Left Column: Editorial Headline & Actions */}
            <div className="lg:col-span-7 flex flex-col justify-center pointer-events-auto">
              {/* Small Label */}
              <div className="flex items-center space-x-3 mb-4 sm:mb-6">
                <span className="w-2 h-2 rounded-full bg-[#C5A880] animate-pulse" />
                <span className="text-[10px] sm:text-[11px] tracking-[0.35em] uppercase font-sans text-[#C5A880] font-medium">
                  98 SALON &amp; ACADEMY · REWA
                </span>
              </div>

              {/* Main Headline with Line-by-Line Masked Reveal */}
              <h1 className="flex flex-col tracking-[-0.03em] leading-[0.92]">
                <div className="overflow-hidden pb-1">
                  <span
                    ref={line1Ref}
                    className="block font-serif text-5xl sm:text-7xl md:text-8xl lg:text-[76px] xl:text-[96px] 2xl:text-[112px] font-light text-[#FAF8F5]"
                  >
                    Your beauty.
                  </span>
                </div>
                <div className="overflow-hidden pb-2 sm:pb-3">
                  <span
                    ref={line2Ref}
                    className="block font-serif text-5xl sm:text-7xl md:text-8xl lg:text-[76px] xl:text-[96px] 2xl:text-[112px] font-light italic text-[#FAF8F5]"
                  >
                    Your moment.
                  </span>
                </div>
              </h1>

              {/* Supporting Line */}
              <p
                ref={sublineRef}
                className="mt-6 sm:mt-8 text-base sm:text-lg lg:text-xl text-[#FAF8F5]/85 font-sans font-light max-w-lg leading-relaxed"
              >
                Hair, skin and beauty experiences designed around you.
              </p>

              {/* Action Buttons with Micro-interactions */}
              <div
                ref={ctaGroupRef}
                className="mt-8 sm:mt-10 flex flex-wrap items-center gap-5 sm:gap-7"
              >
                {/* Primary CTA */}
                <button
                  onClick={onOpenBooking}
                  className="group relative inline-flex items-center space-x-3 px-7 py-3.5 bg-[#FAF8F5] text-[#161514] font-sans text-[11px] tracking-[0.22em] uppercase font-semibold overflow-hidden transition-all duration-300 hover:bg-[#C5A880] hover:text-[#161514] cursor-pointer shadow-lg"
                >
                  <span>Book an Appointment</span>
                  <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>

                {/* Secondary CTA */}
                <a
                  href="#about"
                  onClick={handleScrollToSalon}
                  className="group inline-flex items-center space-x-2 text-[#FAF8F5]/80 hover:text-[#FAF8F5] font-sans text-[11px] tracking-[0.22em] uppercase font-medium py-3 cursor-pointer transition-colors"
                >
                  <span className="border-b border-white/30 group-hover:border-white transition-colors pb-0.5">
                    Explore the Salon
                  </span>
                </a>
              </div>

              {/* Subtle Location & Phone Details */}
              <p className="mt-6 text-[10px] tracking-widest uppercase font-mono text-[#FAF8F5]/40">
                Allahabad Road, Beside Bikaner Express, Rewa · 088157 07200
              </p>
            </div>

            {/* Right Column: Dedicated 3D Interactive Sculptural Chrome Shears */}
            <div className="hidden lg:flex lg:col-span-5 items-center justify-center relative">
              {isIntroComplete && (
                <Hero3DScissors scrollProgressRef={scrollProgressRef} />
              )}
            </div>
          </div>

          {/* Bottom Bar: Hindi Heritage Tagline & Scroll Indicator */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pointer-events-auto border-t border-white/10 pt-4">
            <div className="flex items-center space-x-4">
              <span className="text-xs text-[#FAF8F5]/60 font-hindi font-light">
                98 सैलून &amp; एकेडमी — सौंदर्य, आत्मविश्वास और रचनात्मकता
              </span>
            </div>

            {/* Interactive Scroll Indicator */}
            <div className="flex items-center space-x-4 text-[#FAF8F5]/70">
              <span className="text-[10px] tracking-[0.3em] uppercase font-sans font-medium">
                SCROLL TO EXPLORE
              </span>
              <ArrowDown className="w-3.5 h-3.5 text-[#C5A880] animate-bounce" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
