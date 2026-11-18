export interface ServiceItem {
  id: string;
  category: 'HAIR' | 'SKIN' | 'MAKEUP' | 'NAILS';
  categoryNumber: string;
  title: string;
  subtitle: string;
  description: string;
  items: string[];
  image: string;
  badge?: string;
}

export interface ProductItem {
  id: string;
  category: string;
  title: string;
  description: string;
  tags: string[];
  image: string;
}

export interface GalleryImage {
  id: string;
  title: string;
  category: 'interior' | 'corridor' | 'exterior' | 'artistry' | 'promenade' | 'facade' | 'academy';
  src: string;
  alt: string;
  caption: string;
  isRealSalonPhoto?: boolean;
}

export const SALON_INFO = {
  name: "98 SALON & ACADEMY",
  nameHindi: "98 सैलून & एकेडमी",
  tagline: "A Beauty Experience in Rewa",
  philosophy: "Beauty is an experience. Discover yours.",
  phone: "088157 07200",
  phoneRaw: "08815707200",
  phoneIntl: "+918815707200",
  address: {
    line1: "First Floor, Allahabad Road",
    line2: "Beside Bikaner Express, Bara, Indira Nagar",
    city: "Rewa",
    state: "Madhya Pradesh",
    pincode: "486001",
    full: "First Floor, Allahabad Road, Beside Bikaner Express, Bara, Indira Nagar, Rewa, Madhya Pradesh 486001",
  },
  hours: "Tuesday – Sunday: 10:00 AM – 8:00 PM (Monday: Flexible/Enquire)",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Bikaner+Express+Allahabad+Road+Bara+Indira+Nagar+Rewa+Madhya+Pradesh+486001",
  whatsappUrl: "https://wa.me/918815707200",
  instagramPlaceholder: "https://instagram.com/98salonandrewa",
};

export const SERVICES_DATA: ServiceItem[] = [
  {
    id: "hair",
    category: "HAIR",
    categoryNumber: "01",
    title: "Sculpted Hair Design & Care",
    subtitle: "Precision cuts, bespoke coloring, and restorative rituals",
    description: "Every cut, texture, and hue is tailored to accentuate bone structure and natural movement. From structural trims to deep hydration therapy.",
    items: [
      "Precision Haircuts & Re-styling",
      "Executive & Classic Grooming",
      "Creative & Global Hair Colouring",
      "Balayage, Ombré & Highlights",
      "Restorative Keratin & Botoplex Rituals",
      "Spa Scalp Therapy & Deep Conditioning"
    ],
    image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=1200&q=80",
    badge: "Signature Craft"
  },
  {
    id: "skin",
    category: "SKIN",
    categoryNumber: "02",
    title: "Dermal Wellness & Radiance",
    subtitle: "Clinical clarity meets restorative salon therapies",
    description: "Revitalize fatigued skin with personalized facials, botanical hydrations, and purification treatments designed for radiant, long-lasting glow.",
    items: [
      "Signature Glow & Hydrating Facials",
      "Deep Pore Cleansing & Exfoliation",
      "Brightening & Anti-Pigmentation Therapies",
      "Acne Defense & Soothing Treatments",
      "Botanical Face Masks & Peels",
      "Youthful Firming & Collagen Boosts"
    ],
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1200&q=80",
    badge: "Radiance Care"
  },
  {
    id: "makeup",
    category: "MAKEUP",
    categoryNumber: "03",
    title: "Editorial & Bridal Artistry",
    subtitle: "Luminous occasion aesthetics and bridal perfection",
    description: "Elevating personal elegance for life's most unforgettable celebrations. From subtle dewy day looks to high-definition bridal majesty.",
    items: [
      "Bespoke Bridal Makeup & Styling",
      "Reception & Engagement Glamour",
      "Subtle Day & Evening Party Looks",
      "HD & Airbrush Finish Artistry",
      "Saree & Dupatta Draping",
      "Editorial & Portrait Photo Sessions"
    ],
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1200&q=80",
    badge: "Occasion Glamour"
  },
  {
    id: "nails",
    category: "NAILS",
    categoryNumber: "04",
    title: "Nail Architecture & Lounging",
    subtitle: "Architectural extensions, couture art, and restorative pampering",
    description: "Immaculate hand and feet grooming complemented by artistic gel extensions, delicate minimalist nail art, and therapeutic foot spas.",
    items: [
      "Luxury Spa Manicures & Pedicures",
      "Acrylic & Gel Nail Extensions",
      "Custom Minimalist & Chrome Nail Art",
      "Gel Polish & Overlay Strengthening",
      "Cuticle Nourishment & Paraffin Dip",
      "Precision Reshaping & French Tips"
    ],
    image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=1200&q=80",
    badge: "Fine Artistry"
  }
];

export const PRODUCTS_DATA: ProductItem[] = [
  {
    id: "haircare",
    category: "HAIR REPAIR",
    title: "Restorative Haircare Complexes",
    description: "Formulated for deep strand fortification, moisture replenishment, and anti-frizz shine.",
    tags: ["Sulfate-Free", "Keratin Enriched", "Thermal Defense"],
    image: "/frames/frame_140.jpg"
  },
  {
    id: "shampoo",
    category: "CLEANSING",
    title: "Botanical Shampoos & Conditioners",
    description: "Gentle balancing cleansers infused with natural extracts to nurture scalp health.",
    tags: ["Scalp Balance", "Gentle Cleanser", "Lustrous Feel"],
    image: "/frames/frame_142.jpg"
  },
  {
    id: "styling",
    category: "STYLING",
    title: "Professional Styling Elixirs",
    description: "Lightweight serums, shaping pomades, and gloss oils for flexible all-day hold.",
    tags: ["Weightless Finish", "UV Protection", "High Gloss"],
    image: "/frames/frame_145.jpg"
  },
  {
    id: "skincare",
    category: "DERMAL",
    title: "Skin Radiance & Hydration Formulations",
    description: "Antioxidant serums and rich barrier balms designed for deep hydration in changing weather.",
    tags: ["Hydra Barrier", "Non-Comedogenic", "Pure Glow"],
    image: "/frames/frame_138.jpg"
  },
  {
    id: "nailcare",
    category: "NAIL ESSENTIALS",
    title: "Couture Cuticle & Nail Formulations",
    description: "High-pigment longwear polishes and restorative cuticle oils for pristine fingertips.",
    tags: ["Longwear Gel", "Vitamin Infused", "Chip Resistant"],
    image: "/frames/frame_150.jpg"
  }
];

export const REAL_SALON_GALLERY: GalleryImage[] = [
  {
    id: "walkthrough-interior",
    title: "Grand Styling Sanctuary",
    category: "interior",
    src: "/frames/frame_100.jpg",
    alt: "98 Salon & Academy grand interior styling floor with arched illuminated mirrors",
    caption: "Full view of the primary styling hall with custom arched backlight mirrors, leather recliners, and marble reflection floors.",
    isRealSalonPhoto: true
  },
  {
    id: "formulations-library",
    title: "Illuminated Formulation Bar",
    category: "interior",
    src: "/frames/frame_140.jpg",
    alt: "98 Salon professional haircare, styling, and restorative formulation library",
    caption: "Curated haircare complexes, moisture-replenishing serums, and styling elixirs on lit display shelves.",
    isRealSalonPhoto: true
  },
  {
    id: "walkthrough-academy",
    title: "Academy Masterclass Studio",
    category: "academy",
    src: "/frames/frame_180.jpg",
    alt: "Master educator demonstrating professional hair styling at 98 Academy Rewa",
    caption: "Hands-on student training floor at 98 Academy featuring precision heat styling, sectioning, and professional technique demonstration.",
    isRealSalonPhoto: true
  },
  {
    id: "promenade-entrance",
    title: "The Entrance Promenade",
    category: "promenade",
    src: "/frames/frame_060.jpg",
    alt: "The entrance glass doors and welcoming styling floor",
    caption: "The serene entrance glass doorway opening into the main styling floor and architectural stations.",
    isRealSalonPhoto: true
  },
  {
    id: "exterior-facade",
    title: "Illuminated Night Facade",
    category: "facade",
    src: "/frames/frame_001.jpg",
    alt: "The night exterior of 98 Salon & Academy along Allahabad Road, Rewa",
    caption: "Our contemporary storefront and glowing signature signage on Allahabad Road, Bara, Rewa.",
    isRealSalonPhoto: true
  },
  {
    id: "styling-close",
    title: "Vanity Mirror Stations",
    category: "interior",
    src: "/frames/frame_085.jpg",
    alt: "Backlit arched styling mirrors and barber stations",
    caption: "Bespoke arched backlight mirrors framing private client stations with ergonomic hydraulic recliners.",
    isRealSalonPhoto: true
  }
];
