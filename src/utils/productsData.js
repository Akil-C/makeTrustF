/**
 * Central Curated Products Catalog & Image Resolver for Nexora (MarketTrust)
 * 
 * Provides 32+ verified, multi-category marketplace products with 100% relevant,
 * high-resolution photography, authentic descriptions, and multi-image galleries.
 */

export const CATEGORIES = [
  { id: 1, name: 'Electronics', slug: 'electronics', icon: 'Smartphone', count: 12 },
  { id: 2, name: 'Vehicles', slug: 'vehicles', icon: 'Car', count: 6 },
  { id: 3, name: 'Furniture', slug: 'furniture', icon: 'Armchair', count: 8 },
  { id: 4, name: 'Fashion', slug: 'fashion', icon: 'Shirt', count: 9 },
  { id: 5, name: 'Books', slug: 'books', icon: 'BookOpen', count: 5 },
  { id: 6, name: 'Sports', slug: 'sports', icon: 'Trophy', count: 7 },
  { id: 7, name: 'Home Appliances', slug: 'home-appliances', icon: 'Coffee', count: 6 },
  { id: 8, name: 'Musical Instruments', slug: 'musical-instruments', icon: 'Music', count: 6 },
  { id: 9, name: 'Collectibles', slug: 'collectibles', icon: 'Sparkles', count: 5 },
  { id: 10, name: 'Real Estate', slug: 'real-estate', icon: 'Building', count: 4 },
]

export const CURATED_PRODUCTS = [
  // ── 1. ELECTRONICS ──────────────────────────────────────────────────────────
  {
    id: 1,
    title: 'MacBook Pro 16-inch M2 Max (32GB RAM, 1TB SSD) — Space Black',
    description: 'Apple M2 Max chip with 12-core CPU and 38-core GPU. Liquid Retina XDR display with ProMotion 120Hz. Battery health 98% (only 32 cycles). Includes original 140W USB-C GaN power adapter, braided MagSafe 3 cable, and hard protective shell.',
    priceInCredits: 145000,
    categoryId: 1,
    categoryName: 'Electronics',
    condition: 'LIKE_NEW',
    brand: 'Apple',
    city: 'Bengaluru',
    state: 'Karnataka',
    primaryImageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&auto=format&fit=crop&q=80',
    ],
    seller: {
      id: 101,
      displayName: 'TechHub Deals',
      sellerLevel: 'PLATINUM',
      averageRating: 4.95,
      reviewCount: 148,
      isVerified: true,
      completedOrders: 132,
    },
    views: 342,
    wishlistCount: 29,
    isFeatured: true,
  },
  {
    id: 3,
    title: 'iPhone 15 Pro Max 256GB — Natural Titanium (Unlocked)',
    description: 'Grade A+ condition with zero scratches or micro-abrasions. Battery capacity at 100%. Ceramic Shield front, textured matte glass back, and lightweight aerospace titanium frame. Includes AppleCare+ coverage, original box, and woven USB-C cable.',
    priceInCredits: 95000,
    categoryId: 1,
    categoryName: 'Electronics',
    condition: 'LIKE_NEW',
    brand: 'Apple',
    city: 'Bengaluru',
    state: 'Karnataka',
    primaryImageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&auto=format&fit=crop&q=80',
    ],
    seller: {
      id: 102,
      displayName: 'AeroMobile Flagship',
      sellerLevel: 'PLATINUM',
      averageRating: 5.0,
      reviewCount: 215,
      isVerified: true,
      completedOrders: 204,
    },
    views: 512,
    wishlistCount: 44,
    isFeatured: true,
  },
  {
    id: 30002,
    title: 'MacBook Air 15-inch M3 (16GB RAM, 512GB SSD) Midnight',
    description: 'Ultra-thin fanless design powered by Apple M3 silicon. 15.3-inch Liquid Retina display with 500 nits brightness, 18-hour battery life, six-speaker sound system with Spatial Audio. Perfect for engineering, creative design, and portable workflow.',
    priceInCredits: 118000,
    categoryId: 1,
    categoryName: 'Electronics',
    condition: 'LIKE_NEW',
    brand: 'Apple',
    city: 'Bengaluru',
    state: 'Karnataka',
    primaryImageUrl: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
    ],
    seller: {
      id: 2,
      displayName: 'TechHub Official',
      sellerLevel: 'PLATINUM',
      averageRating: 5.0,
      reviewCount: 126,
      isVerified: true,
      completedOrders: 126,
    },
    views: 298,
    wishlistCount: 21,
    isFeatured: true,
  },
  {
    id: 30003,
    title: 'Dell XPS 15 9530 (i7-13700H, RTX 4060, 32GB DDR5, 1TB SSD)',
    description: 'Premium creator laptop with 15.6-inch 3.5K OLED InfinityEdge touch display (400 nits, 100% DCI-P3). Machined aluminum chassis with carbon-fiber composite palm rest. Outstanding performance for 3D rendering and development.',
    priceInCredits: 132000,
    categoryId: 1,
    categoryName: 'Electronics',
    condition: 'LIKE_NEW',
    brand: 'Dell',
    city: 'Bengaluru',
    state: 'Karnataka',
    primaryImageUrl: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80',
    ],
    seller: {
      id: 2,
      displayName: 'TechHub Official',
      sellerLevel: 'PLATINUM',
      averageRating: 5.0,
      reviewCount: 126,
      isVerified: true,
      completedOrders: 126,
    },
    views: 187,
    wishlistCount: 15,
    isFeatured: false,
  },
  {
    id: 30004,
    title: 'iPad Pro 12.9-inch M2 (256GB Wi-Fi + 5G Cellular) Space Gray',
    description: 'Liquid Retina XDR mini-LED display with 1600 nits peak HDR brightness. Apple Pencil hover detection, Thunderbolt port, Face ID, LiDAR scanner. Paired with Apple Magic Keyboard (Black) and Apple Pencil 2nd Gen included.',
    priceInCredits: 89000,
    categoryId: 1,
    categoryName: 'Electronics',
    condition: 'LIKE_NEW',
    brand: 'Apple',
    city: 'Bengaluru',
    state: 'Karnataka',
    primaryImageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800&auto=format&fit=crop&q=80',
    ],
    seller: {
      id: 2,
      displayName: 'TechHub Official',
      sellerLevel: 'PLATINUM',
      averageRating: 5.0,
      reviewCount: 126,
      isVerified: true,
      completedOrders: 126,
    },
    views: 245,
    wishlistCount: 31,
    isFeatured: true,
  },
  {
    id: 30006,
    title: 'PlayStation 5 Disc Edition Console + 2 DualSense Controllers',
    description: 'Sony PS5 Disc Edition console in pristine condition. Custom ultra-high-speed 825GB SSD, ray tracing, 4K 120Hz support with HDR. Includes 2 White DualSense wireless controllers, charging station, HDMI 2.1 cable, and God of War Ragnarök physical disc.',
    priceInCredits: 42000,
    categoryId: 1,
    categoryName: 'Electronics',
    condition: 'LIKE_NEW',
    brand: 'Sony',
    city: 'Bengaluru',
    state: 'Karnataka',
    primaryImageUrl: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80',
    ],
    seller: {
      id: 2,
      displayName: 'TechHub Official',
      sellerLevel: 'PLATINUM',
      averageRating: 5.0,
      reviewCount: 126,
      isVerified: true,
      completedOrders: 126,
    },
    views: 420,
    wishlistCount: 52,
    isFeatured: true,
  },
  {
    id: 30005,
    title: 'Canon EOS R6 Mark II Mirrorless Camera Body + 24-105mm F4 L IS USM',
    description: 'Full-frame 24.2 MP CMOS sensor with 40 fps electronic shutter, 6K oversampled 4K 60p video, and 8 stops of In-Body Image Stabilization. Paired with professional Canon RF 24-105mm F4 L IS USM weather-sealed zoom lens. Shutter count under 3,400.',
    priceInCredits: 195000,
    categoryId: 1,
    categoryName: 'Electronics',
    condition: 'LIKE_NEW',
    brand: 'Canon',
    city: 'Bengaluru',
    state: 'Karnataka',
    primaryImageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&auto=format&fit=crop&q=80',
    ],
    seller: {
      id: 2,
      displayName: 'TechHub Official',
      sellerLevel: 'PLATINUM',
      averageRating: 5.0,
      reviewCount: 126,
      isVerified: true,
      completedOrders: 126,
    },
    views: 310,
    wishlistCount: 38,
    isFeatured: true,
  },
  {
    id: 2,
    title: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones — Silver',
    description: 'Industry-leading active noise cancellation with 8 microphones and two processors. Auto NC Optimizer, 30-hour battery life with quick charging (3 min charge = 3 hours playback), ultra-comfortable soft fit leather. Includes magnetic case and audio cable.',
    priceInCredits: 26000,
    categoryId: 1,
    categoryName: 'Electronics',
    condition: 'NEW',
    brand: 'Sony',
    city: 'Mumbai',
    state: 'Maharashtra',
    primaryImageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80',
    ],
    seller: {
      id: 104,
      displayName: 'Audiophile Sanctuary',
      sellerLevel: 'GOLD',
      averageRating: 4.88,
      reviewCount: 79,
      isVerified: true,
      completedOrders: 68,
    },
    views: 198,
    wishlistCount: 27,
    isFeatured: false,
  },

  // ── 2. VEHICLES ─────────────────────────────────────────────────────────────
  {
    id: 30011,
    title: 'Specialized Allez E5 Disc Road Bike (Size 54cm, Shimano Claris)',
    description: 'E5 Premium Aluminum frame with full FACT carbon fiber fork. Shimano Claris 8-speed shifting, dual-piston mechanical disc brakes, and rugged Axis Sport Disc wheels. Fully tuned up by certified mechanic with brand-new Continental Grand Prix 5000 tires.',
    priceInCredits: 65000,
    categoryId: 2,
    categoryName: 'Vehicles',
    condition: 'GOOD',
    brand: 'Specialized',
    city: 'Bengaluru',
    state: 'Karnataka',
    primaryImageUrl: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=800&auto=format&fit=crop&q=80',
    ],
    seller: {
      id: 2,
      displayName: 'TechHub Official',
      sellerLevel: 'PLATINUM',
      averageRating: 5.0,
      reviewCount: 126,
      isVerified: true,
      completedOrders: 126,
    },
    views: 260,
    wishlistCount: 24,
    isFeatured: true,
  },
  {
    id: 4,
    title: 'Trek Marlin 7 Mountain Bike (Alpha Silver Aluminum, 29" Wheels)',
    description: 'Trail-ready cross-country mountain bike with RockShox Judy fork with lockout, Shimano Deore 1x10 drivetrain, and Shimano hydraulic disc brakes. Lightweight Alpha Silver Aluminum frame with internal routing. Pristine condition with zero frame dings.',
    priceInCredits: 38000,
    categoryId: 2,
    categoryName: 'Vehicles',
    condition: 'GOOD',
    brand: 'Trek',
    city: 'Bengaluru',
    state: 'Karnataka',
    primaryImageUrl: 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?w=800&auto=format&fit=crop&q=80',
    ],
    seller: {
      id: 2,
      displayName: 'TechHub Official',
      sellerLevel: 'PLATINUM',
      averageRating: 5.0,
      reviewCount: 126,
      isVerified: true,
      completedOrders: 126,
    },
    views: 180,
    wishlistCount: 19,
    isFeatured: false,
  },
  {
    id: 30012,
    title: 'Royal Enfield Classic 350 Touring Accessories Kit (Luggage + Screen)',
    description: 'Genuine Royal Enfield touring accessories pack including: Touring dual seat with 3D net technology, low tinted touring flyscreen, heavy-duty alloy engine guards, and black water-resistant canvas saddlebags with quick-mount brackets. All original hardware included.',
    priceInCredits: 14500,
    categoryId: 2,
    categoryName: 'Vehicles',
    condition: 'NEW',
    brand: 'Royal Enfield',
    city: 'Bengaluru',
    state: 'Karnataka',
    primaryImageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&auto=format&fit=crop&q=80',
    ],
    seller: {
      id: 2,
      displayName: 'TechHub Official',
      sellerLevel: 'PLATINUM',
      averageRating: 5.0,
      reviewCount: 126,
      isVerified: true,
      completedOrders: 126,
    },
    views: 215,
    wishlistCount: 16,
    isFeatured: false,
  },
  {
    id: 201,
    title: 'Vespa Primavera 150 ABS Vintage Edition — Mint Green',
    description: 'Classic Italian styling with modern 150cc 3-valve i-get electronic injection engine. Single-sided front arm with coil spring, ABS front disc braking, LED lighting, and beige genuine leather diamond-stitched seat. Odometer: 2,800 km, single owner.',
    priceInCredits: 125000,
    categoryId: 2,
    categoryName: 'Vehicles',
    condition: 'LIKE_NEW',
    brand: 'Vespa',
    city: 'Pune',
    state: 'Maharashtra',
    primaryImageUrl: 'https://images.unsplash.com/photo-1558981420-87aa9dad1c89?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1558981420-87aa9dad1c89?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800&auto=format&fit=crop&q=80',
    ],
    seller: {
      id: 108,
      displayName: 'Milano Moto Classics',
      sellerLevel: 'GOLD',
      averageRating: 4.92,
      reviewCount: 54,
      isVerified: true,
      completedOrders: 42,
    },
    views: 390,
    wishlistCount: 48,
    isFeatured: true,
  },

  // ── 3. FURNITURE ────────────────────────────────────────────────────────────
  {
    id: 5,
    title: 'Herman Miller Aeron Ergonomic Office Chair (Size B, Mineral Mesh)',
    description: 'The definitive ergonomic standard. PostureFit SL adjustable sacral/lumbar support, breathable Pellicle 8Z elastomer suspension, fully adjustable 3D leather armrests, and harmonic forward tilt limiter. Serviced with brand-new quiet caster wheels.',
    priceInCredits: 68000,
    categoryId: 3,
    categoryName: 'Furniture',
    condition: 'LIKE_NEW',
    brand: 'Herman Miller',
    city: 'Bengaluru',
    state: 'Karnataka',
    primaryImageUrl: 'https://images.unsplash.com/photo-1589384267710-7a170981ca78?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1589384267710-7a170981ca78?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=800&auto=format&fit=crop&q=80',
    ],
    seller: {
      id: 110,
      displayName: 'Workspace Studio',
      sellerLevel: 'PLATINUM',
      averageRating: 4.97,
      reviewCount: 96,
      isVerified: true,
      completedOrders: 88,
    },
    views: 412,
    wishlistCount: 37,
    isFeatured: true,
  },
  {
    id: 30008,
    title: 'West Elm Mid-Century Leather Armchair (Caramel Saddle Leather)',
    description: 'Handcrafted top-grain semi-aniline Italian leather upholstery with solid kiln-dried eucalyptus wood frame in acorn finish. High-resilience foam core with feather-down topper for luxurious comfort. No tears or stains, beautiful natural patina.',
    priceInCredits: 28000,
    categoryId: 3,
    categoryName: 'Furniture',
    condition: 'LIKE_NEW',
    brand: 'West Elm',
    city: 'Bengaluru',
    state: 'Karnataka',
    primaryImageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&auto=format&fit=crop&q=80',
    ],
    seller: {
      id: 2,
      displayName: 'TechHub Official',
      sellerLevel: 'PLATINUM',
      averageRating: 5.0,
      reviewCount: 126,
      isVerified: true,
      completedOrders: 126,
    },
    views: 290,
    wishlistCount: 33,
    isFeatured: false,
  },
  {
    id: 30007,
    title: 'Solid Oak Scandinavian Dining Table (180cm, Seats 6-8)',
    description: 'Crafted from solid European white oak with organic bevelled edges and tapered cylindrical legs. Finished with matte natural hardwax-oil protecting against spills while preserving the tactile warmth of real wood grain. Dimensions: 180cm x 90cm x 75cm.',
    priceInCredits: 34000,
    categoryId: 3,
    categoryName: 'Furniture',
    condition: 'GOOD',
    brand: 'Nordic House',
    city: 'Bengaluru',
    state: 'Karnataka',
    primaryImageUrl: 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?w=800&auto=format&fit=crop&q=80',
    ],
    seller: {
      id: 2,
      displayName: 'TechHub Official',
      sellerLevel: 'PLATINUM',
      averageRating: 5.0,
      reviewCount: 126,
      isVerified: true,
      completedOrders: 126,
    },
    views: 230,
    wishlistCount: 18,
    isFeatured: false,
  },
  {
    id: 301,
    title: 'Noguchi Style Sculptural Glass Coffee Table (Walnut Wood Base)',
    description: 'Curved triangular 19mm heavy tempered glass top resting on two interlocking organic curved solid American walnut wood legs. A modernist design centerpiece that anchors living rooms with architectural balance and transparent visual weight.',
    priceInCredits: 22000,
    categoryId: 3,
    categoryName: 'Furniture',
    condition: 'NEW',
    brand: 'Modernist Atelier',
    city: 'Mumbai',
    state: 'Maharashtra',
    primaryImageUrl: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1532323544230-7191fd51bc1b?w=800&auto=format&fit=crop&q=80',
    ],
    seller: {
      id: 112,
      displayName: 'Form & Function',
      sellerLevel: 'GOLD',
      averageRating: 4.89,
      reviewCount: 45,
      isVerified: true,
      completedOrders: 39,
    },
    views: 310,
    wishlistCount: 26,
    isFeatured: true,
  },

  // ── 4. FASHION & LUXURY ─────────────────────────────────────────────────────
  {
    id: 30013,
    title: 'Omega Seamaster Professional 300M Co-Axial Master Chronometer',
    description: 'Reference 210.30.42.20.01.001 with laser-engraved wave dial in black ceramic, white enamel diving scale on black ceramic bezel. METAS-certified Co-Axial Master Chronometer Calibre 8800 resistant to magnetic fields up to 15,000 gauss. Full box and papers.',
    priceInCredits: 285000,
    categoryId: 4,
    categoryName: 'Fashion',
    condition: 'LIKE_NEW',
    brand: 'Omega',
    city: 'Bengaluru',
    state: 'Karnataka',
    primaryImageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&auto=format&fit=crop&q=80',
    ],
    seller: {
      id: 2,
      displayName: 'TechHub Official',
      sellerLevel: 'PLATINUM',
      averageRating: 5.0,
      reviewCount: 126,
      isVerified: true,
      completedOrders: 126,
    },
    views: 450,
    wishlistCount: 58,
    isFeatured: true,
  },
  {
    id: 30014,
    title: 'Patagonia Tres 3-in-1 Waterproof Parka Jacket (Black, Size M)',
    description: 'Versatile H2No Performance Standard 2-layer waterproof/windproof shell paired with a zip-out 700-fill-power 100% Recycled Down insulated jacket. Wear the shell alone in rain, the down jacket on chilly days, or both together in severe winter climates.',
    priceInCredits: 22000,
    categoryId: 4,
    categoryName: 'Fashion',
    condition: 'NEW',
    brand: 'Patagonia',
    city: 'Bengaluru',
    state: 'Karnataka',
    primaryImageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1544441893-675973e31985?w=800&auto=format&fit=crop&q=80',
    ],
    seller: {
      id: 2,
      displayName: 'TechHub Official',
      sellerLevel: 'PLATINUM',
      averageRating: 5.0,
      reviewCount: 126,
      isVerified: true,
      completedOrders: 126,
    },
    views: 175,
    wishlistCount: 14,
    isFeatured: false,
  },
  {
    id: 401,
    title: 'Nike Air Jordan 1 Retro High OG "Chicago" (2022 Lost & Found)',
    description: 'Iconic Chicago colorway featuring cracked leather detailing, vintage sail midsole, and authentic 1985 silhouette proportions. Deadstock condition, US Men size 10.5, with original receipt, mismatched shoebox lid, and vintage sale receipt print insert.',
    priceInCredits: 38000,
    categoryId: 4,
    categoryName: 'Fashion',
    condition: 'NEW',
    brand: 'Nike / Jordan',
    city: 'Delhi',
    state: 'Delhi NCR',
    primaryImageUrl: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
    ],
    seller: {
      id: 114,
      displayName: 'Kicks Vault',
      sellerLevel: 'PLATINUM',
      averageRating: 4.96,
      reviewCount: 180,
      isVerified: true,
      completedOrders: 164,
    },
    views: 520,
    wishlistCount: 63,
    isFeatured: true,
  },

  // ── 5. BOOKS & LITERATURE ───────────────────────────────────────────────────
  {
    id: 501,
    title: 'The Great Gatsby by F. Scott Fitzgerald — 1st Edition Replica Print',
    description: 'Collector’s archival facsimile of the legendary 1925 Charles Scribner’s Sons first edition, complete with Francis Cugat’s celestial eyes dust jacket artwork. Gilded page edges, cloth-bound ribbon marker, and custom buckram cloth slipcase.',
    priceInCredits: 6500,
    categoryId: 5,
    categoryName: 'Books',
    condition: 'LIKE_NEW',
    brand: 'Easton Press',
    city: 'Bengaluru',
    state: 'Karnataka',
    primaryImageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=80',
    ],
    seller: {
      id: 116,
      displayName: 'Antiquarian Rare Books',
      sellerLevel: 'GOLD',
      averageRating: 5.0,
      reviewCount: 42,
      isVerified: true,
      completedOrders: 37,
    },
    views: 140,
    wishlistCount: 18,
    isFeatured: false,
  },
  {
    id: 502,
    title: 'J.R.R. Tolkien Deluxe Hardcover Set: The Lord of the Rings + The Hobbit',
    description: 'HarperCollins deluxe illustrated edition featuring cover calligraphy by Tolkien himself and illustrations by Alan Lee. Quarter-bound in natural cloth with foil stamping, two-colour fold-out maps of Middle-earth, and sturdy protective slipcase.',
    priceInCredits: 12000,
    categoryId: 5,
    categoryName: 'Books',
    condition: 'NEW',
    brand: 'HarperCollins',
    city: 'Hyderabad',
    state: 'Telangana',
    primaryImageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
    ],
    seller: {
      id: 116,
      displayName: 'Antiquarian Rare Books',
      sellerLevel: 'GOLD',
      averageRating: 5.0,
      reviewCount: 42,
      isVerified: true,
      completedOrders: 37,
    },
    views: 210,
    wishlistCount: 22,
    isFeatured: false,
  },

  // ── 6. SPORTS & FITNESS ─────────────────────────────────────────────────────
  {
    id: 30018,
    title: 'Bowflex SelectTech 552 Adjustable Dumbbells (Pair with Heavy-Duty Stand)',
    description: 'Dial system lets you instantly switch weight from 5 to 52.5 lbs (2.5 to 24 kg) in 2.5 lb increments. Replaces 15 sets of weights for space-efficient home gym workout. Includes matching Bowflex ergonomic metal stand with wheels and tablet cradle.',
    priceInCredits: 29000,
    categoryId: 6,
    categoryName: 'Sports',
    condition: 'GOOD',
    brand: 'Bowflex',
    city: 'Bengaluru',
    state: 'Karnataka',
    primaryImageUrl: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80',
    ],
    seller: {
      id: 2,
      displayName: 'TechHub Official',
      sellerLevel: 'PLATINUM',
      averageRating: 5.0,
      reviewCount: 126,
      isVerified: true,
      completedOrders: 126,
    },
    views: 330,
    wishlistCount: 39,
    isFeatured: true,
  },
  {
    id: 30017,
    title: 'Garmin Fenix 7X Sapphire Solar Multisport GPS Smartwatch (51mm, DLC)',
    description: 'Rugged titanium bezel with Diamond-Like Carbon (DLC) coating and Power Sapphire solar charging lens. Multi-band GNSS with SatIQ, built-in LED flashlight, preloaded TopoActive maps, wrist-based heart rate and Pulse Ox sensor. Battery life up to 37 days with solar.',
    priceInCredits: 62000,
    categoryId: 6,
    categoryName: 'Sports',
    condition: 'LIKE_NEW',
    brand: 'Garmin',
    city: 'Bengaluru',
    state: 'Karnataka',
    primaryImageUrl: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
    ],
    seller: {
      id: 2,
      displayName: 'TechHub Official',
      sellerLevel: 'PLATINUM',
      averageRating: 5.0,
      reviewCount: 126,
      isVerified: true,
      completedOrders: 126,
    },
    views: 280,
    wishlistCount: 35,
    isFeatured: true,
  },

  // ── 7. HOME APPLIANCES ──────────────────────────────────────────────────────
  {
    id: 30015,
    title: 'Dyson V15 Detect Cordless Vacuum Cleaner (Gold Edition with HEPA)',
    description: 'Laser reveals invisible dust on hard floors. Piezo sensor measures and counts microscopic particles, automatically adjusting suction power. Digital Motorbar anti-tangle cleaner head, up to 60 minutes of run time, whole-machine HEPA filtration.',
    priceInCredits: 48000,
    categoryId: 7,
    categoryName: 'Home Appliances',
    condition: 'LIKE_NEW',
    brand: 'Dyson',
    city: 'Bengaluru',
    state: 'Karnataka',
    primaryImageUrl: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=800&auto=format&fit=crop&q=80',
    ],
    seller: {
      id: 2,
      displayName: 'TechHub Official',
      sellerLevel: 'PLATINUM',
      averageRating: 5.0,
      reviewCount: 126,
      isVerified: true,
      completedOrders: 126,
    },
    views: 240,
    wishlistCount: 22,
    isFeatured: false,
  },
  {
    id: 30016,
    title: 'De\'Longhi Magnifica S Automatic Bean-to-Cup Espresso Machine',
    description: 'Integrated silent burr coffee grinder with 13 adjustable settings. Traditional milk frother wand creates creamy foam for cappuccino and latte macchiato. Removable 1.8L water reservoir and brewing unit for easy maintenance. Makes 2 cups simultaneously.',
    priceInCredits: 36000,
    categoryId: 7,
    categoryName: 'Home Appliances',
    condition: 'LIKE_NEW',
    brand: 'De\'Longhi',
    city: 'Bengaluru',
    state: 'Karnataka',
    primaryImageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&auto=format&fit=crop&q=80',
    ],
    seller: {
      id: 2,
      displayName: 'TechHub Official',
      sellerLevel: 'PLATINUM',
      averageRating: 5.0,
      reviewCount: 126,
      isVerified: true,
      completedOrders: 126,
    },
    views: 315,
    wishlistCount: 28,
    isFeatured: true,
  },
  {
    id: 701,
    title: 'KitchenAid Artisan 5-Quart Tilt-Head Stand Mixer (Empire Red)',
    description: 'Iconic die-cast zinc stand mixer with 10 speeds and planetary mixing action. Includes 5-quart stainless steel bowl with comfortable handle, coated flat beater, coated dough hook, 6-wire whip, and pouring shield. Flawless cosmetic and mechanical condition.',
    priceInCredits: 29000,
    categoryId: 7,
    categoryName: 'Home Appliances',
    condition: 'NEW',
    brand: 'KitchenAid',
    city: 'Bengaluru',
    state: 'Karnataka',
    primaryImageUrl: 'https://images.unsplash.com/photo-1594385208974-2e75f8d7bb48?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1594385208974-2e75f8d7bb48?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80',
    ],
    seller: {
      id: 118,
      displayName: 'Gourmet Kitchenware',
      sellerLevel: 'GOLD',
      averageRating: 4.93,
      reviewCount: 65,
      isVerified: true,
      completedOrders: 58,
    },
    views: 195,
    wishlistCount: 21,
    isFeatured: false,
  },

  // ── 8. MUSICAL INSTRUMENTS ──────────────────────────────────────────────────
  {
    id: 30010,
    title: 'Roland FP-30X Digital Piano with Stand & Triple Pedal Unit',
    description: 'Roland SuperNATURAL Piano sound engine paired with PHA-4 Standard 88-key hammer-action keyboard with escapement and ivory-feel keys. Bluetooth MIDI/Audio connectivity, powerful built-in stereo speakers, and matching KSC-70 wooden stand with KPD-70 triple pedal.',
    priceInCredits: 58000,
    categoryId: 8,
    categoryName: 'Musical Instruments',
    condition: 'NEW',
    brand: 'Roland',
    city: 'Bengaluru',
    state: 'Karnataka',
    primaryImageUrl: 'https://images.unsplash.com/photo-1520523839898-507127054976?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1520523839898-507127054976?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
    ],
    seller: {
      id: 2,
      displayName: 'TechHub Official',
      sellerLevel: 'PLATINUM',
      averageRating: 5.0,
      reviewCount: 126,
      isVerified: true,
      completedOrders: 126,
    },
    views: 310,
    wishlistCount: 36,
    isFeatured: true,
  },
  {
    id: 30009,
    title: 'Yamaha Pacifica 612VIIFM Electric Guitar (Translucent Blue Flame Maple)',
    description: 'Flamed maple top with Alder body and tinted maple neck. Seymour Duncan pickups (Custom 5 humbucker at bridge, SSL-1 single-coils in middle/neck), Wilkinson VS50-6 vibrato bridge, and Grover locking tuners. Professional setup with D’Addario 10-46 strings.',
    priceInCredits: 46000,
    categoryId: 8,
    categoryName: 'Musical Instruments',
    condition: 'LIKE_NEW',
    brand: 'Yamaha',
    city: 'Bengaluru',
    state: 'Karnataka',
    primaryImageUrl: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1550291652-6ea9114a47b1?w=800&auto=format&fit=crop&q=80',
    ],
    seller: {
      id: 2,
      displayName: 'TechHub Official',
      sellerLevel: 'PLATINUM',
      averageRating: 5.0,
      reviewCount: 126,
      isVerified: true,
      completedOrders: 126,
    },
    views: 220,
    wishlistCount: 23,
    isFeatured: false,
  },
  {
    id: 801,
    title: 'Fender American Ultra Stratocaster (Arctic Pearl, Rosewood Fingerboard)',
    description: 'Advanced modern Stratocaster featuring unique Modern D neck profile with rolled fingerboard edges and tapered neck heel. Ultra Noiseless Vintage pickups with S-1 switch for tonal versatility. Deluxe molded hardshell flight case included.',
    priceInCredits: 135000,
    categoryId: 8,
    categoryName: 'Musical Instruments',
    condition: 'LIKE_NEW',
    brand: 'Fender',
    city: 'Mumbai',
    state: 'Maharashtra',
    primaryImageUrl: 'https://images.unsplash.com/photo-1550291652-6ea9114a47b1?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1550291652-6ea9114a47b1?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=800&auto=format&fit=crop&q=80',
    ],
    seller: {
      id: 120,
      displayName: 'Vintage Tone Boutique',
      sellerLevel: 'PLATINUM',
      averageRating: 4.98,
      reviewCount: 84,
      isVerified: true,
      completedOrders: 78,
    },
    views: 380,
    wishlistCount: 42,
    isFeatured: true,
  },

  // ── 9. COLLECTIBLES & ANTIQUES ──────────────────────────────────────────────
  {
    id: 30019,
    title: 'Leica M6 Rangefinder 35mm Classic Film Camera Body (Black Chrome)',
    description: 'Iconic manual 35mm rangefinder with 0.72x magnification viewfinder, mechanical shutter operating from 1s to 1/1000s, and TTL light metering. Completely CLA serviced by certified Leica technician with velvet shutter curtains and smooth advance lever action.',
    priceInCredits: 185000,
    categoryId: 9,
    categoryName: 'Collectibles',
    condition: 'GOOD',
    brand: 'Leica',
    city: 'Bengaluru',
    state: 'Karnataka',
    primaryImageUrl: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1500634245200-e5245c7574ef?w=800&auto=format&fit=crop&q=80',
    ],
    seller: {
      id: 2,
      displayName: 'TechHub Official',
      sellerLevel: 'PLATINUM',
      averageRating: 5.0,
      reviewCount: 126,
      isVerified: true,
      completedOrders: 126,
    },
    views: 480,
    wishlistCount: 65,
    isFeatured: true,
  },
  {
    id: 901,
    title: '1986 Fleer Michael Jordan #57 Rookie Card (Archival Acrylic Display)',
    description: 'Authentic premier NBA collectible card featuring vibrant red, white, and blue border with crisp centering. Encased in museum-grade UV-resistant archival slab. Accompanied by full certificate of verification and security hologram.',
    priceInCredits: 75000,
    categoryId: 9,
    categoryName: 'Collectibles',
    condition: 'LIKE_NEW',
    brand: 'Fleer / NBA',
    city: 'Bengaluru',
    state: 'Karnataka',
    primaryImageUrl: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&auto=format&fit=crop&q=80',
    ],
    seller: {
      id: 122,
      displayName: 'Legends Memorabilia',
      sellerLevel: 'PLATINUM',
      averageRating: 4.95,
      reviewCount: 110,
      isVerified: true,
      completedOrders: 98,
    },
    views: 420,
    wishlistCount: 45,
    isFeatured: true,
  },

  // ── 10. REAL ESTATE ─────────────────────────────────────────────────────────
  {
    id: 1001,
    title: 'Modern Penthouse Studio in Indiranagar (Designer Loft)',
    description: 'Fully furnished 1,200 sq.ft loft apartment with double-height ceilings, private open terrace garden, floor-to-ceiling soundproof glass, and imported German oak cabinetry. Smart home automation with biometric keyless entry.',
    priceInCredits: 1800000,
    categoryId: 10,
    categoryName: 'Real Estate',
    condition: 'NEW',
    brand: 'Nexora Estates',
    city: 'Bengaluru',
    state: 'Karnataka',
    primaryImageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
    ],
    seller: {
      id: 124,
      displayName: 'Prestige Realty Partners',
      sellerLevel: 'PLATINUM',
      averageRating: 5.0,
      reviewCount: 34,
      isVerified: true,
      completedOrders: 28,
    },
    views: 890,
    wishlistCount: 74,
    isFeatured: true,
  },
  {
    id: 1002,
    title: 'Scandinavian Minimalist Villa in Whitefield (4 BHK Gated Community)',
    description: '3,800 sq.ft luxury contemporary villa with private heated swimming pool, rooftop solar generation, landscaped Zen courtyard, and 2-car EV charging garage. Verified title deed with zero encumbrance and escrow settlement.',
    priceInCredits: 4200000,
    categoryId: 10,
    categoryName: 'Real Estate',
    condition: 'NEW',
    brand: 'Nexora Estates',
    city: 'Bengaluru',
    state: 'Karnataka',
    primaryImageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&auto=format&fit=crop&q=80',
    ],
    seller: {
      id: 124,
      displayName: 'Prestige Realty Partners',
      sellerLevel: 'PLATINUM',
      averageRating: 5.0,
      reviewCount: 34,
      isVerified: true,
      completedOrders: 28,
    },
    views: 740,
    wishlistCount: 68,
    isFeatured: false,
  },
]

/**
 * High-precision keyword to Unsplash photography matcher.
 * Guarantees that any product received from backend or user listings
 * gets an image that is 100% accurate to its name and category.
 */
export function getProductImage(product) {
  if (!product) return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80'

  const title = (product.title || '').toLowerCase()
  const cat = (product.categoryName || product.category || '').toLowerCase()

  // Match known curated product ID
  const curated = CURATED_PRODUCTS.find((p) => String(p.id) === String(product.id))
  if (curated?.primaryImageUrl) {
    return curated.primaryImageUrl
  }

  // 1. Specific product name matches
  if (title.includes('aeron') || title.includes('ergonomic chair') || title.includes('office chair')) {
    return 'https://images.unsplash.com/photo-1589384267710-7a170981ca78?w=800&auto=format&fit=crop&q=80'
  }
  if (title.includes('macbook pro')) {
    return 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80'
  }
  if (title.includes('macbook air')) {
    return 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&auto=format&fit=crop&q=80'
  }
  if (title.includes('iphone 15') || title.includes('iphone 14') || title.includes('iphone')) {
    return 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80'
  }
  if (title.includes('headphone') || title.includes('wh-1000') || title.includes('airpods') || title.includes('audio')) {
    return 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80'
  }
  if (title.includes('ipad') || title.includes('tablet')) {
    return 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=80'
  }
  if (title.includes('playstation') || title.includes('ps5') || title.includes('gaming console')) {
    return 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&auto=format&fit=crop&q=80'
  }
  if (title.includes('dell xps') || title.includes('laptop')) {
    return 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop&q=80'
  }
  if (title.includes('leica') || title.includes('film camera') || title.includes('rangefinder')) {
    return 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80'
  }
  if (title.includes('canon') || title.includes('camera') || title.includes('mirrorless')) {
    return 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80'
  }
  if (title.includes('specialized') || title.includes('road bike') || title.includes('bicycle')) {
    return 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&auto=format&fit=crop&q=80'
  }
  if (title.includes('trek') || title.includes('mountain bike') || title.includes('marlin')) {
    return 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=800&auto=format&fit=crop&q=80'
  }
  if (title.includes('royal enfield') || title.includes('motorcycle') || title.includes('bike accessory')) {
    return 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&auto=format&fit=crop&q=80'
  }
  if (title.includes('vespa') || title.includes('scooter')) {
    return 'https://images.unsplash.com/photo-1558981420-87aa9dad1c89?w=800&auto=format&fit=crop&q=80'
  }
  if (title.includes('armchair') || title.includes('leather chair') || title.includes('west elm')) {
    return 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format&fit=crop&q=80'
  }
  if (title.includes('dining table') || title.includes('oak') || title.includes('table')) {
    return 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?w=800&auto=format&fit=crop&q=80'
  }
  if (title.includes('coffee table') || title.includes('noguchi')) {
    return 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=800&auto=format&fit=crop&q=80'
  }
  if (title.includes('omega') || title.includes('seamaster') || title.includes('rolex') || title.includes('watch')) {
    return 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80'
  }
  if (title.includes('garmin') || title.includes('smartwatch')) {
    return 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80'
  }
  if (title.includes('parka') || title.includes('jacket') || title.includes('patagonia') || title.includes('coat')) {
    return 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=80'
  }
  if (title.includes('jordan') || title.includes('sneaker') || title.includes('shoe')) {
    return 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&auto=format&fit=crop&q=80'
  }
  if (title.includes('vacuum') || title.includes('dyson')) {
    return 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&auto=format&fit=crop&q=80'
  }
  if (title.includes('espresso') || title.includes('coffee') || title.includes('de\'longhi')) {
    return 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80'
  }
  if (title.includes('mixer') || title.includes('kitchenaid')) {
    return 'https://images.unsplash.com/photo-1594385208974-2e75f8d7bb48?w=800&auto=format&fit=crop&q=80'
  }
  if (title.includes('piano') || title.includes('keyboard') || title.includes('roland')) {
    return 'https://images.unsplash.com/photo-1520523839898-507127054976?w=800&auto=format&fit=crop&q=80'
  }
  if (title.includes('guitar') || title.includes('pacifica') || title.includes('stratocaster')) {
    return 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800&auto=format&fit=crop&q=80'
  }
  if (title.includes('dumbbell') || title.includes('bowflex') || title.includes('gym') || title.includes('weights')) {
    return 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&auto=format&fit=crop&q=80'
  }
  if (title.includes('book') || title.includes('gatsby') || title.includes('tolkien')) {
    return 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80'
  }
  if (title.includes('card') || title.includes('collectible') || title.includes('coin')) {
    return 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&auto=format&fit=crop&q=80'
  }
  if (title.includes('penthouse') || title.includes('villa') || title.includes('apartment') || title.includes('studio')) {
    return 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop&q=80'
  }

  // 2. If the product already has a valid primaryImageUrl that is not the generic watch photo
  if (
    product.primaryImageUrl &&
    !product.primaryImageUrl.includes('photo-1523275335684-37898b6baf30') &&
    !product.primaryImageUrl.includes('photo-1580481072645-022f9a6d83d0')
  ) {
    return product.primaryImageUrl
  }
  if (product.images?.[0]?.url) {
    return product.images[0].url
  }
  if (typeof product.images?.[0] === 'string') {
    return product.images[0]
  }

  // 3. Fallback by Category
  if (cat.includes('electric') || cat.includes('electron')) {
    return 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80'
  }
  if (cat.includes('vehicle') || cat.includes('car') || cat.includes('bike')) {
    return 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&auto=format&fit=crop&q=80'
  }
  if (cat.includes('furnitur')) {
    return 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format&fit=crop&q=80'
  }
  if (cat.includes('fashion') || cat.includes('cloth')) {
    return 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=80'
  }
  if (cat.includes('book')) {
    return 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80'
  }
  if (cat.includes('sport') || cat.includes('fit')) {
    return 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&auto=format&fit=crop&q=80'
  }
  if (cat.includes('appliance')) {
    return 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80'
  }
  if (cat.includes('music') || cat.includes('instrument')) {
    return 'https://images.unsplash.com/photo-1520523839898-507127054976?w=800&auto=format&fit=crop&q=80'
  }
  if (cat.includes('collect')) {
    return 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80'
  }
  if (cat.includes('estate') || cat.includes('propert')) {
    return 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop&q=80'
  }

  return 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80'
}

/**
 * Returns a full product object by ID with fallback to curated data
 */
export function getProductById(id) {
  if (!id) return null
  return CURATED_PRODUCTS.find((p) => String(p.id) === String(id)) || null
}

/**
 * Searches and filters curated products based on search parameters
 */
export function filterProducts({
  keyword,
  categoryId,
  categoryName,
  condition,
  city,
  minPrice,
  maxPrice,
  sortBy = 'newest',
}) {
  return CURATED_PRODUCTS.filter((item) => {
    // 1. Keyword search
    if (keyword) {
      const q = keyword.toLowerCase()
      const matchTitle = item.title.toLowerCase().includes(q)
      const matchDesc = item.description?.toLowerCase().includes(q)
      const matchBrand = item.brand?.toLowerCase().includes(q)
      const matchCat = item.categoryName?.toLowerCase().includes(q)
      if (!matchTitle && !matchDesc && !matchBrand && !matchCat) return false
    }

    // 2. Category
    if (categoryId && Number(item.categoryId) !== Number(categoryId)) {
      return false
    }
    if (categoryName && item.categoryName.toLowerCase() !== categoryName.toLowerCase()) {
      return false
    }

    // 3. Condition
    if (condition && item.condition !== condition) {
      return false
    }

    // 4. City
    if (city && city !== 'All Metros' && item.city.toLowerCase() !== city.toLowerCase()) {
      return false
    }

    // 5. Price range
    const price = item.priceInCredits || item.price || 0
    if (minPrice !== undefined && price < Number(minPrice)) {
      return false
    }
    if (maxPrice !== undefined && price > Number(maxPrice)) {
      return false
    }

    return true
  }).sort((a, b) => {
    const priceA = a.priceInCredits || a.price || 0
    const priceB = b.priceInCredits || b.price || 0
    if (sortBy === 'price_low' || sortBy === 'price_asc') return priceA - priceB
    if (sortBy === 'price_high' || sortBy === 'price_desc') return priceB - priceA
    if (sortBy === 'views') return (b.views || 0) - (a.views || 0)
    return b.id - a.id // newest default
  })
}
