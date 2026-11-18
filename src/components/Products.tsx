import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';
import { PRODUCTS_DATA } from '../data/salonData';

interface ProductsProps {
  onOpenBooking: () => void;
}

export const Products: React.FC<ProductsProps> = ({ onOpenBooking }) => {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -420 : 420;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section id="products" className="py-28 sm:py-36 lg:py-44 bg-[#FAF8F5] text-[#161514] border-t border-[#E8E2D8] overflow-hidden">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-8 border-b border-[#E8E2D8]">
          <div>
            <span className="text-[10px] tracking-[0.3em] uppercase font-sans text-[#9C7E55] font-medium block mb-3">
              03 / SALON FORMULATIONS
            </span>
            <h2 className="text-4xl sm:text-6xl font-serif font-light text-[#161514] tracking-[-0.02em]">
              THE ART OF BEAUTY
              <br />
              <span className="italic font-normal text-[#9C7E55]">
                IS IN THE DETAILS.
              </span>
            </h2>
          </div>

          <div className="mt-8 md:mt-0 flex items-end justify-between md:justify-end gap-6">
            <p className="text-xs sm:text-sm text-[#646059] max-w-xs font-sans font-light leading-relaxed">
              Carefully chosen haircare, styling, skincare, and nail formulations applied during treatments.
            </p>

            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={() => scroll('left')}
                aria-label="Scroll products left"
                className="w-10 h-10 border border-[#E8E2D8] hover:border-[#161514] text-[#161514] transition-colors flex items-center justify-center cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scroll('right')}
                aria-label="Scroll products right"
                className="w-10 h-10 border border-[#E8E2D8] hover:border-[#161514] text-[#161514] transition-colors flex items-center justify-center cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Minimalist Horizontal Showcase */}
        <div
          ref={scrollContainerRef}
          className="flex space-x-8 overflow-x-auto pb-8 scrollbar-none"
        >
          {PRODUCTS_DATA.map((product, idx) => (
            <div
              key={product.id}
              className="w-[280px] sm:w-[360px] shrink-0 flex flex-col justify-between group"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-[#E8E2D8]">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              <div className="pt-6 border-b border-[#E8E2D8] pb-6 flex flex-col justify-between flex-grow">
                <div>
                  <div className="flex items-center justify-between text-[10px] tracking-[0.25em] uppercase font-mono text-[#9C7E55] mb-2">
                    <span>{product.category}</span>
                    <span>0{idx + 1}</span>
                  </div>

                  <h3 className="font-serif text-2xl text-[#161514] leading-snug">
                    {product.title}
                  </h3>

                  <p className="text-xs text-[#646059] mt-3 font-sans font-light leading-relaxed">
                    {product.description}
                  </p>
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] tracking-wider uppercase font-sans text-[#646059] border border-[#E8E2D8] px-2.5 py-1"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quiet Inquiry Action with Micro-interaction */}
        <div className="mt-8 pt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs text-[#646059]">
          <span>Only authentic salon products used in professional treatments.</span>
          <button
            onClick={onOpenBooking}
            className="group inline-flex items-center space-x-1.5 text-xs tracking-[0.2em] uppercase font-medium text-[#161514] hover:text-[#9C7E55] transition-colors cursor-pointer"
          >
            <span className="border-b border-[#E8E2D8] group-hover:border-[#9C7E55] transition-colors pb-0.5">
              Inquire About Products &amp; Formulations
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-[#9C7E55]" />
          </button>
        </div>
      </div>
    </section>
  );
};
