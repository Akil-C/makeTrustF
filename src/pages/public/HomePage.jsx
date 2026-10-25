import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Search,
  MapPin,
  ShieldCheck,
  ArrowRight,
  Heart,
  Star,
  ChevronRight,
  ArrowUpRight,
  Lock,
  Eye,
  Truck,
  Check,
  Shield,
  Layers,
  Activity,
  SlidersHorizontal,
  ExternalLink,
} from 'lucide-react'
import productService from '../../services/productService'
import wishlistService from '../../services/wishlistService'
import { PRODUCT_CATEGORIES } from '../../utils/constants'
import { formatCredits } from '../../utils/formatters'
import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'
import StarRating from '../../components/common/StarRating'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import DemoDisclaimer from '../../components/common/DemoDisclaimer'
import { CURATED_PRODUCTS, getProductImage } from '../../utils/productsData'
import toast from 'react-hot-toast'

// Curated verified marketplace items showcasing rich multi-category catalog
const MOCK_FEATURED = CURATED_PRODUCTS.slice(0, 12)

// Multi-offer comparison datasets
const COMPARISON_DATASETS = [
  {
    id: 'macbook',
    specCode: 'NX-ELEC-0091',
    title: 'Apple MacBook Pro 16" M2 Max',
    subtitle: '12-Core CPU / 38-Core GPU / 32GB RAM / 1TB SSD',
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=900&auto=format&fit=crop&q=80',
    link: '/products/1',
    offers: [
      {
        merchant: 'TechHub Deals',
        level: 'PLATINUM',
        trustScore: 99,
        price: 145000,
        condition: 'LIKE NEW',
        fulfillment: '1-Day Escrow Express',
        status: 'BEST OFFER',
      },
      {
        merchant: 'Silicon Corridor Systems',
        level: 'GOLD',
        trustScore: 96,
        price: 149500,
        condition: 'LIKE NEW',
        fulfillment: '2-Day Insured Courier',
        status: 'VERIFIED',
      },
      {
        merchant: 'Indiranagar Premium Tech',
        level: 'SILVER',
        trustScore: 93,
        price: 153000,
        condition: 'GOOD',
        fulfillment: 'Local Safe-Exchange SafePoint',
        status: 'VERIFIED',
      },
    ],
  },
  {
    id: 'sony',
    specCode: 'NX-ELEC-0084',
    title: 'Sony WH-1000XM5 Noise Canceling',
    subtitle: 'Integrated V1 Processor / 30-Hour Battery / Silver',
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900&auto=format&fit=crop&q=80',
    link: '/products/30003',
    offers: [
      {
        merchant: 'AudioPhile Labs',
        level: 'PLATINUM',
        trustScore: 99,
        price: 24999,
        condition: 'BRAND NEW',
        fulfillment: 'Same-Day Dispatch',
        status: 'BEST OFFER',
      },
      {
        merchant: 'SoundScape Retailers',
        level: 'GOLD',
        trustScore: 95,
        price: 26500,
        condition: 'LIKE NEW',
        fulfillment: '2-Day Escrow Delivery',
        status: 'VERIFIED',
      },
      {
        merchant: 'Metro Acoustic Works',
        level: 'SILVER',
        trustScore: 91,
        price: 27900,
        condition: 'LIKE NEW',
        fulfillment: 'Verified Courier',
        status: 'VERIFIED',
      },
    ],
  },
  {
    id: 'piano',
    specCode: 'NX-INST-0042',
    title: 'Roland FP-30X Digital Piano Bundle',
    subtitle: 'PHA-4 Standard Keyboard / SuperNATURAL Sound Engine',
    category: 'Musical Instruments',
    image: 'https://images.unsplash.com/photo-1520523839898-507121c2014b?w=900&auto=format&fit=crop&q=80',
    link: '/products/30009',
    offers: [
      {
        merchant: 'Harmony Musical Hub',
        level: 'PLATINUM',
        trustScore: 98,
        price: 68500,
        condition: 'LIKE NEW',
        fulfillment: 'Insured Freight Transport',
        status: 'BEST OFFER',
      },
      {
        merchant: 'Koramangala Keyboards',
        level: 'GOLD',
        trustScore: 94,
        price: 71000,
        condition: 'GOOD',
        fulfillment: '2-Day Heavy Courier',
        status: 'VERIFIED',
      },
      {
        merchant: 'Classic Soundworks',
        level: 'SILVER',
        trustScore: 92,
        price: 73500,
        condition: 'LIKE NEW',
        fulfillment: 'Local Studio Pickup',
        status: 'VERIFIED',
      },
    ],
  },
]

// Escrow transaction protocol stages
const PROTOCOL_STAGES = [
  {
    step: '01',
    code: 'STAGE_AUTH',
    title: 'ORDER AUTHORIZATION',
    heading: 'Cryptographic Credit Authorization',
    summary:
      'Buyer authorizes purchase value using 1:1 Rupee-equivalent Marketplace Credits (100 Credits = ₹100 INR). Zero credit card exposure to counterparty.',
    detail:
      'Funds are debited into a cryptographic custody buffer. The counterparty never receives payment details, phone numbers, or bank account numbers.',
    badge: 'PROTOCOL LOCK // ACTIVE',
  },
  {
    step: '02',
    code: 'STAGE_HOLD',
    title: 'ESCROW VAULT LOCK',
    heading: '100% Funds Isolated in Cold Escrow',
    summary:
      'Platform escrow custody locks 100% of order value. Seller is verified and instructed to prepare dispatch with guaranteed payout protection.',
    detail:
      'Seller receives a cryptographically signed dispatch directive. Payout is guaranteed upon proof of delivery and buyer acceptance.',
    badge: 'CUSTODY STATUS // ISOLATED',
  },
  {
    step: '03',
    code: 'STAGE_TRANSIT',
    title: 'TRACKED COURIER / SAFEPOINT',
    heading: 'GPS-Tracked Dispatch or In-Person SafePoint',
    summary:
      'Seller dispatches via verified courier with real-time waypoint tracking, or schedules a safe-exchange at a verified public inspection hub.',
    detail:
      'Integrated tracking numbers attach automatically to the transaction audit trail. Automated SMS & WebSocket notifications update both parties.',
    badge: 'TELEMETRY // DISPATCHED',
  },
  {
    step: '04',
    code: 'STAGE_INSPECT',
    title: 'DOORSTEP INSPECTION',
    heading: 'Buyer Inspection & Specification Verification',
    summary:
      'Package arrives. Buyer is granted a comprehensive 48-hour inspection window to examine cosmetic condition, hardware specs, and serial integrity.',
    detail:
      'If the product does not match the listing specifications or exhibits unmentioned defects, buyer triggers an instantaneous dispute freeze.',
    badge: 'INSPECTION // 48H WINDOW',
  },
  {
    step: '05',
    code: 'STAGE_RELEASE',
    title: 'CONFIRMATION & DISBURSEMENT',
    heading: 'Irrevocable Release to Merchant Wallet',
    summary:
      'Buyer taps "Confirm Delivery" on Nexora. The escrow vault unlocks immediately, releasing 100% of net proceeds to the seller wallet.',
    detail:
      'Both parties build immutable on-chain reputation: buyer receives Trust Level points, seller receives verified review qualification.',
    badge: 'SETTLEMENT // COMPLETED',
  },
]

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [featuredProducts, setFeaturedProducts] = useState(MOCK_FEATURED)
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('ALL')
  const [loading, setLoading] = useState(true)
  const [wishlistIds, setWishlistIds] = useState(new Set())
  const navigate = useNavigate()

  // Interactive Comparison Matrix State
  const [activeCompIdx, setActiveCompIdx] = useState(0)

  // Interactive Escrow Protocol Lifecycle State
  const [activeProtocolStage, setActiveProtocolStage] = useState(0)
  const [isAutoProgressing, setIsAutoProgressing] = useState(true)

  // Auto-cycle protocol stages for visual demonstration
  useEffect(() => {
    if (!isAutoProgressing) return
    const timer = setInterval(() => {
      setActiveProtocolStage((prev) => (prev >= PROTOCOL_STAGES.length - 1 ? 0 : prev + 1))
    }, 4500)
    return () => clearInterval(timer)
  }, [isAutoProgressing])

  // Load products with catalog merging & verified photography
  useEffect(() => {
    async function loadData() {
      try {
        const res = await productService.getTrendingProducts(12)
        const apiProds = res?.data?.content || []
        if (apiProds.length > 0) {
          const enhancedApi = apiProds.map((p) => ({
            ...p,
            primaryImageUrl: getProductImage(p),
            category: p.categoryName || p.category || 'Electronics',
          }))
          const merged = [...enhancedApi]
          CURATED_PRODUCTS.forEach((cp) => {
            if (!merged.some((m) => String(m.id) === String(cp.id) || m.title.toLowerCase() === cp.title.toLowerCase())) {
              merged.push(cp)
            }
          })
          setFeaturedProducts(merged.slice(0, 12))
        } else {
          setFeaturedProducts(CURATED_PRODUCTS.slice(0, 12))
        }
      } catch (err) {
        setFeaturedProducts(CURATED_PRODUCTS.slice(0, 12))
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (searchQuery.trim()) params.set('q', searchQuery.trim())
    if (selectedCategory) params.set('category', selectedCategory)
    navigate(`/search?${params.toString()}`)
  }

  const toggleWishlist = async (id, e) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      if (wishlistIds.has(id)) {
        await wishlistService.removeFromWishlist(id)
        setWishlistIds((prev) => {
          const next = new Set(prev)
          next.delete(id)
          return next
        })
        toast.success('Removed from watchlist')
      } else {
        await wishlistService.addToWishlist(id)
        setWishlistIds((prev) => new Set(prev).add(id))
        toast.success('Item added to watchlist')
      }
    } catch {
      toast.success(wishlistIds.has(id) ? 'Removed from watchlist' : 'Item added to watchlist')
      setWishlistIds((prev) => {
        const next = new Set(prev)
        if (next.has(id)) next.delete(id)
        else next.add(id)
        return next
      })
    }
  }

  // Filter catalog items by selected category chip
  const filteredProducts = activeCategoryFilter === 'ALL'
    ? featuredProducts
    : featuredProducts.filter((p) => {
        const cat = (p.categoryName || p.category || '').toUpperCase()
        return cat.includes(activeCategoryFilter.toUpperCase())
      })

  const currentComp = COMPARISON_DATASETS[activeCompIdx]
  const currentStage = PROTOCOL_STAGES[activeProtocolStage]

  return (
    <div className="min-h-screen bg-[#EFEFEE] text-[#0D0D0F] font-sans selection:bg-[#0D0D0F] selection:text-[#EFEFEE]">
      <Navbar />

      {/* ── TECHNICAL STATUS BAR ──────────────────────────────────────────────── */}
      <aside aria-label="System status" className="w-full bg-[#E4E4E2] border-b border-[#0D0D0F]/12 text-[#6E6F76] text-[10px] tracking-[0.2em] font-medium uppercase px-4 sm:px-8 py-2 overflow-x-auto scrollbar-hide">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6 whitespace-nowrap">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-[#0D0D0F] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2F5BFF] animate-pulse" />
              NEXORA PROTOCOL // V2.4.0
            </span>
            <span className="text-[#0D0D0F]/20">/</span>
            <span>ESCROW LEDGER // ACTIVE</span>
            <span className="text-[#0D0D0F]/20">/</span>
            <span>SETTLEMENT // 100 CREDITS = ₹100 INR</span>
          </div>
          <div className="flex items-center gap-4 text-[#43444A]">
            <span>NODE // BENGALURU (12.9716° N, 77.5946° E)</span>
            <span className="text-[#0D0D0F]/20">/</span>
            <span className="text-[#2F5BFF] font-semibold">SECURITY HASH // SHA-256 VERIFIED</span>
          </div>
        </div>
      </aside>

      <DemoDisclaimer />

      {/* ── HERO SECTION: TYPOGRAPHIC EDITORIAL STAGE ─────────────────────────── */}
      <section className="relative border-b border-[#0D0D0F]/12 overflow-hidden bg-[#EFEFEE] pt-8 sm:pt-14 pb-12 sm:pb-20 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-10 sm:space-y-14">
          
          {/* Top Corner Metadata Anchors */}
          <div className="flex items-center justify-between text-[11px] tracking-[0.22em] text-[#6E6F76] uppercase font-semibold border-b border-[#0D0D0F]/12 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-1 h-1 bg-[#2F5BFF]" />
              <span>COMMERCE ARCHITECTURE // 01</span>
            </div>
            <div className="hidden sm:flex items-center gap-6">
              <span>ZERO COUNTERPARTY FRAUD</span>
              <span className="text-[#0D0D0F]/20">/</span>
              <span>KYC CERTIFIED MERCHANTS</span>
            </div>
            <div className="font-mono text-[#0D0D0F]">
              INDEX // 2026.10
            </div>
          </div>

          {/* Massive Typographic Headline Lockup */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-[11px] font-bold tracking-[0.25em] text-[#2F5BFF] uppercase">
              <span className="w-1.5 h-1.5 bg-[#2F5BFF]" />
              <span>THE TRUST-FIRST MARKETPLACE</span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-[7.5rem] xl:text-[8.5rem] font-extrabold tracking-tighter leading-[0.9] text-[#0D0D0F] uppercase select-none">
              BUY WITH<br />
              <span className="inline-block text-[#0D0D0F]">CONFIDENCE.</span><br />
              <span className="inline-block text-[#43444A]">SELL WITHOUT</span><br />
              THE RISK.
            </h1>

            {/* Concise Supporting Statement & Hairline Accent */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4 border-t border-[#0D0D0F]/12 items-baseline">
              <div className="lg:col-span-7">
                <p className="text-sm sm:text-base md:text-lg text-[#43444A] leading-relaxed max-w-2xl font-normal">
                  Nexora is an engineered marketplace architecture built for verified high-value transactions. Every transaction is held in cold cryptographic escrow until confirmed at your doorstep. Zero counterparty risk. Fixed 100 Credits = ₹100 valuation.
                </p>
              </div>

              {/* Action Buttons: Sharp Rectangular Editorial CTAs */}
              <div className="lg:col-span-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-start lg:justify-end gap-3">
                <Link
                  to="/search"
                  className="group relative bg-[#0D0D0F] text-[#EFEFEE] px-6 sm:px-8 py-4 rounded-none font-bold text-xs tracking-[0.15em] uppercase transition-all duration-300 hover:bg-[#43444A] flex items-center justify-center gap-2 border border-[#0D0D0F]"
                >
                  <span>EXPLORE LISTINGS</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>

                <Link
                  to="/register"
                  className="group relative bg-transparent text-[#0D0D0F] px-6 sm:px-8 py-4 rounded-none font-bold text-xs tracking-[0.15em] uppercase transition-all duration-300 hover:bg-[#0D0D0F] hover:text-[#EFEFEE] border border-[#0D0D0F] flex items-center justify-center gap-2"
                >
                  <span>BECOME A SELLER</span>
                  <span className="text-[#2F5BFF] group-hover:text-[#7C97FF]">→</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Architectural Search Console */}
          <div className="border border-[#0D0D0F]/12 bg-[#E4E4E2] p-4 sm:p-6 space-y-4 rounded-none">
            <div className="flex items-center justify-between text-[10px] tracking-[0.2em] font-bold text-[#6E6F76] uppercase border-b border-[#0D0D0F]/12 pb-2">
              <span className="flex items-center gap-2">
                <Search className="w-3.5 h-3.5 text-[#0D0D0F]" />
                SEARCH CONSOLE // REAL-TIME DISCOVERY
              </span>
              <span className="hidden sm:inline">PAN-INDIA VERIFIED CATALOG</span>
            </div>

            <form
              onSubmit={handleSearchSubmit}
              className="flex flex-col md:flex-row items-stretch gap-2"
            >
              <div className="relative flex-1 bg-[#EFEFEE] border border-[#0D0D0F]/12 flex items-center px-4 py-3">
                <Search className="w-4 h-4 text-[#6E6F76] shrink-0 mr-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Query products, specifications, brands, or verified sellers..."
                  className="w-full bg-transparent text-[#0D0D0F] placeholder-[#6E6F76] text-xs sm:text-sm font-medium outline-none"
                />
              </div>

              <div className="w-full md:w-56 bg-[#EFEFEE] border border-[#0D0D0F]/12 flex items-center px-3 py-3">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-transparent text-[#0D0D0F] text-xs font-bold uppercase tracking-wider outline-none cursor-pointer"
                >
                  <option value="">ALL DOMAINS</option>
                  {PRODUCT_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="bg-[#0D0D0F] text-[#EFEFEE] hover:bg-[#43444A] px-8 py-3 text-xs font-bold tracking-[0.18em] uppercase transition-colors shrink-0 flex items-center justify-center gap-2 border border-[#0D0D0F]"
              >
                <span>SEARCH</span>
                <span className="text-[#2F5BFF]">/</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Technical Category Index Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-[10px] tracking-[0.16em] uppercase font-semibold">
              <span className="text-[#6E6F76] mr-1">DOMAINS //</span>
              {['Electronics', 'Vehicles', 'Musical Instruments', 'Furniture', 'Fashion', 'Collectibles'].map((cat, idx) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => navigate(`/search?category=${encodeURIComponent(cat)}`)}
                  className="border border-[#0D0D0F]/12 bg-[#EFEFEE] hover:bg-[#0D0D0F] hover:text-[#EFEFEE] px-2.5 py-1 text-[#43444A] transition-colors"
                >
                  0{idx + 1} / {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Bottom Hero Tri-Column Technical Straps */}
          <div className="grid grid-cols-1 md:grid-cols-3 border-t border-[#0D0D0F]/12 divide-y md:divide-y-0 md:divide-x divide-[#0D0D0F]/12 pt-6">
            <div className="py-4 md:py-0 md:pr-6 space-y-1.5">
              <div className="text-[10px] font-bold tracking-[0.2em] text-[#2F5BFF] uppercase">
                01 // MULTI-MERCHANT AGGREGATION
              </div>
              <p className="text-xs text-[#43444A] leading-relaxed">
                Single product page unites competing offers from multiple verified merchants. Compare price, warranty, and seller reliability in one view.
              </p>
            </div>

            <div className="py-4 md:py-0 md:px-6 space-y-1.5">
              <div className="text-[10px] font-bold tracking-[0.2em] text-[#2F5BFF] uppercase">
                02 // CRYPTOGRAPHIC ESCROW VAULT
              </div>
              <p className="text-xs text-[#43444A] leading-relaxed">
                100% of purchase credits remain in cold platform custody. Funds are only disbursed after physical receipt and 48-hour buyer verification.
              </p>
            </div>

            <div className="py-4 md:py-0 md:pl-6 space-y-1.5">
              <div className="text-[10px] font-bold tracking-[0.2em] text-[#2F5BFF] uppercase">
                03 // IDENTITY & BIOMETRIC KYC
              </div>
              <p className="text-xs text-[#43444A] leading-relaxed">
                Zero anonymous merchants. Every seller submits government ID certification, address verification, and automated trust metrics.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ── SECTION 01: TRUST ARCHITECTURE (DARK TECHNICAL STAGE) ─────────────── */}
      <section className="bg-[#0D0D0F] text-[#EFEFEE] border-b border-[#0D0D0F] py-16 sm:py-24 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-14">
          
          {/* Header Metadata Anchor */}
          <div className="flex items-center justify-between text-[11px] tracking-[0.22em] text-[#6E6F76] uppercase font-semibold border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#7C97FF]" />
              <span className="text-[#EFEFEE]">SECTION 01 // ARCHITECTURE</span>
            </div>
            <div>VERIFIED TRUST ENGINE</div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left: Manifesto & Headline */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-bold tracking-[0.25em] text-[#7C97FF] uppercase block">
                [ TRUST LAYER SPECIFICATION ]
              </span>
              <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight uppercase leading-[0.95]">
                A MARKETPLACE<br />
                BUILT AROUND<br />
                <span className="text-[#7C97FF]">ACCOUNTABILITY.</span>
              </h2>

              <p className="text-sm sm:text-base text-[#6E6F76] leading-relaxed max-w-xl font-normal">
                Conventional peer-to-peer marketplaces rely on buyer risk: irreversible bank wires, untracked courier parcels, and anonymous throwaway accounts. Nexora inverts this dynamic. Trust is engineered mathematically into the transaction loop.
              </p>

              <div className="space-y-4 pt-4 border-t border-white/10">
                <div className="flex items-start gap-4">
                  <span className="font-mono text-xs font-bold text-[#7C97FF] shrink-0 pt-0.5">01/KYC</span>
                  <div>
                    <h3 className="text-xs font-bold tracking-wider uppercase text-white">Government ID Identity Verification</h3>
                    <p className="text-xs text-[#6E6F76] mt-0.5 leading-relaxed">
                      Sellers verify Aadhaar/PAN/Passport with biometric facial cross-validation before their listings become discoverable.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <span className="font-mono text-xs font-bold text-[#7C97FF] shrink-0 pt-0.5">02/SCORE</span>
                  <div>
                    <h3 className="text-xs font-bold tracking-wider uppercase text-white">Dynamic 100-Point Seller Trust Metric</h3>
                    <p className="text-xs text-[#6E6F76] mt-0.5 leading-relaxed">
                      Calculated from historical delivery speeds, cancellation rates, verified review ratios, and zero dispute infractions.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <span className="font-mono text-xs font-bold text-[#7C97FF] shrink-0 pt-0.5">03/AUDIT</span>
                  <div>
                    <h3 className="text-xs font-bold tracking-wider uppercase text-white">Immutable Escrow Audit Trails</h3>
                    <p className="text-xs text-[#6E6F76] mt-0.5 leading-relaxed">
                      Every transaction step is logged with unique idempotency keys, timestamped state transitions, and real-time ledger verification.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Live Merchant Trust Telemetry Card */}
            <div className="lg:col-span-5 bg-[#17171A] border border-white/10 p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 border border-white/20 bg-black flex items-center justify-center font-mono font-bold text-white text-xs">
                    TH
                  </div>
                  <div>
                    <div className="text-sm font-bold tracking-wider text-white uppercase flex items-center gap-2">
                      <span>TechHub Deals</span>
                      <span className="text-[10px] text-[#7C97FF] font-mono">[VERIFIED]</span>
                    </div>
                    <div className="text-[10px] font-mono text-[#6E6F76]">MERCHANT ID // NX-M-00101</div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-mono text-[#7C97FF] border border-[#7C97FF]/30 px-2 py-0.5">
                    PLATINUM TIER
                  </span>
                </div>
              </div>

              {/* 3 Core Trust Gauge Panels */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="border border-white/10 p-3 bg-black/40">
                  <div className="text-[9px] font-mono text-[#6E6F76] tracking-wider uppercase">TRUST SCORE</div>
                  <div className="text-2xl font-mono font-extrabold text-[#7C97FF] mt-1">99<span className="text-xs text-[#6E6F76]">/100</span></div>
                </div>
                <div className="border border-white/10 p-3 bg-black/40">
                  <div className="text-[9px] font-mono text-[#6E6F76] tracking-wider uppercase">SATISFACTION</div>
                  <div className="text-2xl font-mono font-extrabold text-white mt-1">4.95<span className="text-xs text-[#6E6F76]">★</span></div>
                </div>
                <div className="border border-white/10 p-3 bg-black/40">
                  <div className="text-[9px] font-mono text-[#6E6F76] tracking-wider uppercase">FULFILLED</div>
                  <div className="text-2xl font-mono font-extrabold text-white mt-1">132</div>
                </div>
              </div>

              {/* Security Status Checkpoints */}
              <div className="space-y-2 text-xs font-mono text-[#6E6F76] border-t border-white/10 pt-4">
                <div className="flex items-center justify-between">
                  <span>IDENTITY KYC STATUS</span>
                  <span className="text-emerald-400 font-bold">● AADHAAR VERIFIED</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>ESCROW DISPUTE RATE</span>
                  <span className="text-white font-bold">0.00% (ZERO DISPUTES)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>AVG DISPATCH LATENCY</span>
                  <span className="text-white font-bold">&lt; 4 HOURS</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>OFF-PLATFORM RISK LEVEL</span>
                  <span className="text-emerald-400 font-bold">MINIMAL // RISK_SCORE: 0</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/sellers/101"
                  className="w-full block text-center border border-white/20 hover:border-white text-white py-3 text-xs font-bold tracking-[0.16em] uppercase transition-colors"
                >
                  INSPECT MERCHANT PROFILE →
                </Link>
              </div>
            </div>

          </div>

          {/* 4 Performance Metrics Hairline Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 border-t border-white/10 divide-x divide-y md:divide-y-0 divide-white/10 pt-8">
            <div className="p-4 sm:p-6 space-y-1">
              <div className="text-3xl sm:text-4xl font-mono font-extrabold text-white">99.8%</div>
              <div className="text-[10px] font-mono text-[#6E6F76] uppercase tracking-wider">ORDER ACCEPTANCE RATIO</div>
            </div>
            <div className="p-4 sm:p-6 space-y-1">
              <div className="text-3xl sm:text-4xl font-mono font-extrabold text-[#7C97FF]">₹0.00</div>
              <div className="text-[10px] font-mono text-[#6E6F76] uppercase tracking-wider">COUNTERPARTY FRAUD LOSS</div>
            </div>
            <div className="p-4 sm:p-6 space-y-1">
              <div className="text-3xl sm:text-4xl font-mono font-extrabold text-white">100%</div>
              <div className="text-[10px] font-mono text-[#6E6F76] uppercase tracking-wider">ESCROW VAULT SECURED</div>
            </div>
            <div className="p-4 sm:p-6 space-y-1">
              <div className="text-3xl sm:text-4xl font-mono font-extrabold text-white">&lt; 15m</div>
              <div className="text-[10px] font-mono text-[#6E6F76] uppercase tracking-wider">AVERAGE INQUIRY RESPONSE</div>
            </div>
          </div>

        </div>
      </section>

      {/* ── SECTION 02: PROTECTED TRANSACTIONS / ESCROW LIFECYCLE ──────────────── */}
      <section className="bg-[#EFEFEE] border-b border-[#0D0D0F]/12 py-16 sm:py-24 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          
          {/* Section Header */}
          <div className="flex items-center justify-between text-[11px] tracking-[0.22em] text-[#6E6F76] uppercase font-semibold border-b border-[#0D0D0F]/12 pb-4">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#2F5BFF]" />
              <span className="text-[#0D0D0F]">SECTION 02 // PROTOCOL</span>
            </div>
            <div>ESCROW LIFECYCLE SPECIFICATION</div>
          </div>

          <div className="space-y-4 max-w-3xl">
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight uppercase text-[#0D0D0F] leading-tight">
              THE ZERO-RISK ESCROW LIFECYCLE.
            </h2>
            <p className="text-sm sm:text-base text-[#43444A] leading-relaxed">
              Funds never transfer directly from buyer to merchant. Nexora acts as a cryptographic custodian. Explore each stage of the automated transaction protocol below:
            </p>
          </div>

          {/* Interactive Stage Selector Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-5 border border-[#0D0D0F]/12 divide-x divide-y sm:divide-y-0 divide-[#0D0D0F]/12 bg-[#E4E4E2]">
            {PROTOCOL_STAGES.map((stg, idx) => {
              const isSelected = idx === activeProtocolStage
              return (
                <button
                  key={stg.code}
                  type="button"
                  onClick={() => {
                    setActiveProtocolStage(idx)
                    setIsAutoProgressing(false)
                  }}
                  className={`p-4 text-left transition-colors relative ${
                    isSelected
                      ? 'bg-[#0D0D0F] text-[#EFEFEE]'
                      : 'hover:bg-[#EFEFEE] text-[#43444A]'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono mb-2">
                    <span className={isSelected ? 'text-[#7C97FF]' : 'text-[#6E6F76]'}>
                      STAGE {stg.step}
                    </span>
                    {isSelected && <span className="w-1.5 h-1.5 bg-[#2F5BFF]" />}
                  </div>
                  <div className="text-xs font-bold uppercase tracking-wider line-clamp-1">
                    {stg.title}
                  </div>
                </button>
              )
            })}
          </div>

          {/* Detailed Stage Architecture Console */}
          <div className="border border-[#0D0D0F]/12 bg-[#E4E4E2] p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-6">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono text-[#2F5BFF] bg-[#2F5BFF]/10 px-2 py-0.5 border border-[#2F5BFF]/20 font-bold uppercase">
                  {currentStage.badge}
                </span>
                <span className="text-xs font-mono text-[#6E6F76]">
                  SEQUENCE // 0{activeProtocolStage + 1} OF 05
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold uppercase text-[#0D0D0F]">
                {currentStage.heading}
              </h3>

              <div className="space-y-3 text-sm text-[#43444A] leading-relaxed max-w-2xl">
                <p className="font-medium text-[#0D0D0F]">
                  {currentStage.summary}
                </p>
                <p className="text-xs text-[#6E6F76] font-mono leading-normal">
                  {currentStage.detail}
                </p>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-6 text-xs font-mono text-[#43444A] border-t border-[#0D0D0F]/12">
                <div>
                  <span className="text-[#6E6F76] block text-[10px]">VALUATION RULE</span>
                  <span className="font-bold text-[#0D0D0F]">100 CREDITS = ₹100 INR</span>
                </div>
                <div>
                  <span className="text-[#6E6F76] block text-[10px]">REVERSIBILITY</span>
                  <span className="font-bold text-[#0D0D0F]">100% REFUND ON MISREPRESENTATION</span>
                </div>
                <div>
                  <span className="text-[#6E6F76] block text-[10px]">ESCROW TYPE</span>
                  <span className="font-bold text-[#2F5BFF]">MUTUAL-CONFIRMATION VAULT</span>
                </div>
              </div>
            </div>

            {/* Stage Visual Terminal */}
            <div className="lg:col-span-4 bg-[#0D0D0F] text-[#EFEFEE] p-6 border border-[#0D0D0F] space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-[#7C97FF] font-bold">TERMINAL // ESCROW_STATUS</span>
                <span className="text-[10px] text-emerald-400">● RUNNING</span>
              </div>

              <div className="space-y-2 text-[11px] text-[#6E6F76]">
                <div className="flex justify-between">
                  <span>ORDER_REF</span>
                  <span className="text-white">NX-ORD-20481</span>
                </div>
                <div className="flex justify-between">
                  <span>VAULT_ALLOCATION</span>
                  <span className="text-white">145,000 MC (₹145,000)</span>
                </div>
                <div className="flex justify-between">
                  <span>MERCHANT_PAYOUT</span>
                  <span className="text-amber-400">PENDING CONFIRMATION</span>
                </div>
                <div className="flex justify-between">
                  <span>DOORSTEP_WINDOW</span>
                  <span className="text-white">48 HOURS ACTIVE</span>
                </div>
              </div>

              <div className="p-3 bg-white/5 border border-white/10 text-[10px] text-white/80 leading-relaxed">
                "Payment remains in cold storage until recipient physically unboxes, verifies specifications, and submits cryptographically authenticated signature."
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ── SECTION 03: MULTI-OFFER COMPARISON ENGINE ──────────────────────────── */}
      <section className="bg-[#E4E4E2] border-b border-[#0D0D0F]/12 py-16 sm:py-24 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="flex items-center justify-between text-[11px] tracking-[0.22em] text-[#6E6F76] uppercase font-semibold border-b border-[#0D0D0F]/12 pb-4">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#2F5BFF]" />
              <span className="text-[#0D0D0F]">SECTION 03 // INTELLIGENCE</span>
            </div>
            <div>LIVE OFFER AGGREGATION</div>
          </div>

          <div className="max-w-3xl space-y-3">
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight uppercase text-[#0D0D0F] leading-tight">
              ONE PRODUCT. MULTIPLE OFFERS.<br />
              <span className="text-[#43444A]">ONE SMARTER DECISION.</span>
            </h2>
            <p className="text-sm sm:text-base text-[#43444A] leading-relaxed">
              Stop toggling dozens of disparate tabs. Nexora aggregates competing offers from multiple verified sellers side-by-side with verified trust scores.
            </p>
          </div>

          {/* Product Toggle Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {COMPARISON_DATASETS.map((item, idx) => {
              const active = idx === activeCompIdx
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveCompIdx(idx)}
                  className={`px-5 py-3 text-xs font-bold uppercase tracking-wider transition-all border ${
                    active
                      ? 'bg-[#0D0D0F] text-[#EFEFEE] border-[#0D0D0F]'
                      : 'bg-[#EFEFEE] text-[#43444A] border-[#0D0D0F]/12 hover:border-[#0D0D0F]'
                  }`}
                >
                  <span className="text-[10px] font-mono text-[#2F5BFF] mr-2">[{item.specCode}]</span>
                  <span>{item.title}</span>
                </button>
              )
            })}
          </div>

          {/* Active Comparison Matrix */}
          <div className="border border-[#0D0D0F]/12 bg-[#EFEFEE] p-6 sm:p-8 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#0D0D0F]/12 pb-6">
              <div className="flex items-center gap-4">
                <img
                  src={currentComp.image}
                  alt={currentComp.title}
                  className="w-16 h-16 sm:w-20 sm:h-20 object-cover border border-[#0D0D0F]/12"
                />
                <div>
                  <div className="text-[10px] font-mono text-[#2F5BFF] uppercase tracking-wider">
                    SPECIFICATION ARCHIVE // {currentComp.specCode}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold uppercase text-[#0D0D0F]">
                    {currentComp.title}
                  </h3>
                  <div className="text-xs text-[#6E6F76] font-mono mt-0.5">
                    {currentComp.subtitle}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono">
                <div className="text-right">
                  <span className="text-[10px] text-[#6E6F76] block">COMPETING OFFERS</span>
                  <span className="font-bold text-[#0D0D0F]">{currentComp.offers.length} VERIFIED QUOTES</span>
                </div>
                <Link
                  to={currentComp.link}
                  className="bg-[#0D0D0F] text-[#EFEFEE] px-4 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-[#43444A] transition-colors"
                >
                  VIEW FULL LISTING →
                </Link>
              </div>
            </div>

            {/* Offer Comparison Columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {currentComp.offers.map((offer, oIdx) => (
                <div
                  key={offer.merchant}
                  className={`p-6 border transition-all flex flex-col justify-between space-y-6 ${
                    oIdx === 0
                      ? 'border-[#0D0D0F] bg-[#E4E4E2]'
                      : 'border-[#0D0D0F]/12 bg-[#EFEFEE]'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold uppercase tracking-wider text-[#0D0D0F]">
                        {offer.merchant}
                      </span>
                      {oIdx === 0 ? (
                        <span className="text-[10px] font-mono font-bold text-[#2F5BFF] border border-[#2F5BFF]/30 px-2 py-0.5">
                          BEST OFFER
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-[#6E6F76]">
                          VERIFIED QUOTE
                        </span>
                      )}
                    </div>

                    <div>
                      <div className="text-[10px] font-mono text-[#6E6F76] uppercase">PRICE / VALUATION</div>
                      <div className="text-2xl sm:text-3xl font-mono font-extrabold text-[#0D0D0F] mt-0.5">
                        ₹{offer.price.toLocaleString('en-IN')}
                      </div>
                      <div className="text-[11px] font-mono text-[#6E6F76] mt-0.5">
                        ({offer.price.toLocaleString('en-IN')} Credits • 100 CR = ₹100)
                      </div>
                    </div>

                    <div className="space-y-2 text-xs font-mono text-[#43444A] border-t border-[#0D0D0F]/10 pt-3">
                      <div className="flex justify-between">
                        <span className="text-[#6E6F76]">CONDITION:</span>
                        <span className="font-bold text-[#0D0D0F]">{offer.condition}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#6E6F76]">MERCHANT LEVEL:</span>
                        <span className="font-bold text-[#0D0D0F]">{offer.level}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#6E6F76]">TRUST SCORE:</span>
                        <span className="font-bold text-[#2F5BFF]">{offer.trustScore} / 100</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#6E6F76]">FULFILLMENT:</span>
                        <span className="font-bold text-[#0D0D0F] truncate max-w-[140px]">{offer.fulfillment}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Link
                      to={currentComp.link}
                      className={`w-full block text-center py-3 text-xs font-bold uppercase tracking-wider transition-colors border ${
                        oIdx === 0
                          ? 'bg-[#0D0D0F] text-[#EFEFEE] hover:bg-[#43444A] border-[#0D0D0F]'
                          : 'border-[#0D0D0F] text-[#0D0D0F] hover:bg-[#0D0D0F] hover:text-[#EFEFEE]'
                      }`}
                    >
                      SELECT THIS OFFER →
                    </Link>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>
      </section>

      {/* ── SECTION 04: CURATED MARKETPLACE CATALOG ────────────────────────────── */}
      <section className="bg-[#EFEFEE] border-b border-[#0D0D0F]/12 py-16 sm:py-24 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="flex items-center justify-between text-[11px] tracking-[0.22em] text-[#6E6F76] uppercase font-semibold border-b border-[#0D0D0F]/12 pb-4">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#2F5BFF]" />
              <span className="text-[#0D0D0F]">SECTION 04 // DISCOVERY</span>
            </div>
            <div>VERIFIED CATALOG</div>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight uppercase text-[#0D0D0F] leading-tight">
                ACTIVE MARKETPLACE LISTINGS.
              </h2>
              <p className="text-sm text-[#43444A]">
                Every item is authenticated by a verified merchant, backed by cold escrow protection, and supported by multi-offer comparison.
              </p>
            </div>

            <Link
              to="/search"
              className="group text-xs font-bold uppercase tracking-[0.18em] text-[#0D0D0F] hover:text-[#2F5BFF] transition-colors flex items-center gap-1.5 self-start md:self-auto border-b border-[#0D0D0F] pb-1"
            >
              <span>EXPLORE ALL {CURATED_PRODUCTS.length}+ LISTINGS</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide text-xs font-bold uppercase tracking-wider">
            {['ALL', 'Electronics', 'Vehicles', 'Musical Instruments', 'Furniture', 'Fashion'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategoryFilter(cat)}
                className={`px-4 py-2 border transition-colors whitespace-nowrap ${
                  activeCategoryFilter === cat
                    ? 'bg-[#0D0D0F] text-[#EFEFEE] border-[#0D0D0F]'
                    : 'bg-[#E4E4E2] text-[#43444A] border-[#0D0D0F]/12 hover:border-[#0D0D0F]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Product Grid: Sharp Architectural Cards (rounded-none, hairlines) */}
          {loading ? (
            <div className="py-20 flex justify-center">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((prod) => (
                <div
                  key={prod.id}
                  className="group bg-[#E4E4E2] border border-[#0D0D0F]/12 flex flex-col justify-between transition-all duration-300 hover:border-[#0D0D0F]"
                >
                  <div>
                    {/* Architectural Product Photography Viewport */}
                    <div className="relative aspect-square overflow-hidden bg-[#EFEFEE] border-b border-[#0D0D0F]/12">
                      <img
                        src={getProductImage(prod)}
                        alt={prod.title}
                        className="w-full h-full object-cover grayscale-20 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                        onError={(e) => {
                          e.target.onerror = null
                          e.target.src = getProductImage(prod)
                        }}
                      />

                      {/* Technical Corner Crop Marks */}
                      <div className="absolute top-2 left-2 text-[8px] font-mono text-[#0D0D0F]/60 select-none">+</div>
                      <div className="absolute top-2 right-2 text-[8px] font-mono text-[#0D0D0F]/60 select-none">+</div>

                      {/* Wishlist Button */}
                      <button
                        onClick={(e) => toggleWishlist(prod.id, e)}
                        className="absolute top-3 right-3 p-2 bg-[#EFEFEE]/90 hover:bg-[#0D0D0F] hover:text-[#EFEFEE] text-[#0D0D0F] border border-[#0D0D0F]/12 transition-colors z-10"
                        aria-label="Save listing"
                      >
                        <Heart
                          className={`w-3.5 h-3.5 ${
                            wishlistIds.has(prod.id) ? 'fill-[#2F5BFF] text-[#2F5BFF]' : ''
                          }`}
                        />
                      </button>

                      {/* Condition Badge */}
                      {prod.condition && (
                        <span className="absolute bottom-3 left-3 bg-[#0D0D0F] text-[#EFEFEE] text-[9px] font-mono tracking-wider px-2 py-0.5 uppercase">
                          {prod.condition.replace('_', ' ')}
                        </span>
                      )}
                    </div>

                    {/* Metadata & Product Info */}
                    <div className="p-5 space-y-3">
                      <div className="flex items-center justify-between text-[10px] font-mono text-[#6E6F76] uppercase">
                        <span>{prod.category || 'ELECTRONICS'}</span>
                        {prod.city && (
                          <span className="flex items-center gap-1 text-[#43444A]">
                            <MapPin className="w-3 h-3 text-[#2F5BFF]" />
                            {prod.city}
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-sm text-[#0D0D0F] line-clamp-2 leading-snug group-hover:text-[#2F5BFF] transition-colors">
                        {prod.title}
                      </h3>

                      {/* Merchant Credential Strip */}
                      {prod.seller && (
                        <div className="pt-2 border-t border-[#0D0D0F]/10 flex items-center justify-between text-[11px] font-mono text-[#6E6F76]">
                          <span className="truncate max-w-[130px] text-[#43444A]">
                            {prod.seller.displayName || prod.seller.name || 'Verified Merchant'}
                          </span>
                          <span className="text-[#2F5BFF] font-bold">
                            {prod.seller.sellerLevel || 'PLATINUM'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Dual Currency Price & Action Footer */}
                  <div className="p-5 pt-0 border-t border-[#0D0D0F]/10 flex items-end justify-between mt-2">
                    <div>
                      <div className="text-[9px] font-mono text-[#6E6F76] uppercase tracking-wider">
                        ESCROW VALUATION
                      </div>
                      <div className="text-lg font-mono font-extrabold text-[#0D0D0F]">
                        ₹{Number(prod.priceInCredits || prod.price || 0).toLocaleString('en-IN')}
                      </div>
                      <div className="text-[10px] font-mono text-[#6E6F76]">
                        {Number(prod.priceInCredits || prod.price || 0).toLocaleString('en-IN')} Credits
                      </div>
                    </div>

                    <Link
                      to={`/products/${prod.id}`}
                      className="bg-[#0D0D0F] text-[#EFEFEE] hover:bg-[#43444A] px-3.5 py-2 text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1 border border-[#0D0D0F]"
                    >
                      <span>VIEW</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* ── SECTION 05: MARKET PRICE SPREAD INTELLIGENCE ───────────────────────── */}
      <section className="bg-[#E4E4E2] border-b border-[#0D0D0F]/12 py-16 sm:py-24 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-10">
          
          <div className="flex items-center justify-between text-[11px] tracking-[0.22em] text-[#6E6F76] uppercase font-semibold border-b border-[#0D0D0F]/12 pb-4">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#2F5BFF]" />
              <span className="text-[#0D0D0F]">SECTION 05 // SPREAD ANALYSIS</span>
            </div>
            <div>MARKET PRICE BENCHMARK</div>
          </div>

          <div className="max-w-2xl space-y-2">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight uppercase text-[#0D0D0F]">
              SEE THE MARKET SPREAD BEFORE YOU COMMIT.
            </h2>
            <p className="text-sm text-[#43444A]">
              Live comparison of lowest merchant quotes versus market average across verified active listings:
            </p>
          </div>

          {/* Architectural Hairline Data Table */}
          <div className="border border-[#0D0D0F]/12 bg-[#EFEFEE] overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#0D0D0F]/12 text-[10px] font-mono tracking-[0.2em] text-[#6E6F76] uppercase bg-[#E4E4E2]">
                  <th className="p-4 pl-6">ITEM SPECIFICATION</th>
                  <th className="p-4">CONDITION</th>
                  <th className="p-4">LOWEST QUOTE</th>
                  <th className="p-4">MARKET AVG</th>
                  <th className="p-4">MERCHANTS</th>
                  <th className="p-4 pr-6 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0D0D0F]/10 text-xs font-mono">
                {featuredProducts.slice(0, 8).map((p) => {
                  const lowest = Number(p.priceInCredits || p.price || 100)
                  const avg = Math.round(lowest * 1.07)
                  return (
                    <tr key={p.id} className="hover:bg-[#E4E4E2]/60 transition-colors">
                      <td className="p-4 pl-6 font-sans font-bold text-[#0D0D0F] flex items-center gap-3">
                        <img
                          src={getProductImage(p)}
                          alt={p.title}
                          className="w-10 h-10 object-cover border border-[#0D0D0F]/12 shrink-0"
                        />
                        <span className="line-clamp-1">{p.title}</span>
                      </td>
                      <td className="p-4 text-[#43444A] uppercase text-[11px]">
                        {p.condition || 'LIKE NEW'}
                      </td>
                      <td className="p-4 font-bold text-[#0D0D0F] text-sm">
                        ₹{lowest.toLocaleString('en-IN')}
                      </td>
                      <td className="p-4 text-[#6E6F76]">
                        ₹{avg.toLocaleString('en-IN')}
                      </td>
                      <td className="p-4 text-[#2F5BFF] font-semibold">
                        3 VERIFIED
                      </td>
                      <td className="p-4 pr-6 text-right font-sans">
                        <Link
                          to={`/products/${p.id}`}
                          className="text-xs font-bold uppercase tracking-wider text-[#0D0D0F] hover:text-[#2F5BFF] underline"
                        >
                          COMPARE →
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

        </div>
      </section>

      {/* ── SECTION 06: VERIFIED REVIEWS ONLY POST-CONFIRMATION (DARK STAGE) ──── */}
      <section className="bg-[#0D0D0F] text-[#EFEFEE] border-b border-[#0D0D0F] py-16 sm:py-24 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="flex items-center justify-between text-[11px] tracking-[0.22em] text-[#6E6F76] uppercase font-semibold border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#7C97FF]" />
              <span className="text-[#EFEFEE]">SECTION 06 // VERIFICATION</span>
            </div>
            <div>POST-DELIVERY CONFIRMATION REVIEWS</div>
          </div>

          <div className="max-w-3xl space-y-3">
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight uppercase leading-tight">
              REVIEWS ONLY FOLLOW<br />
              <span className="text-[#7C97FF]">VERIFIED RECEIPT.</span>
            </h2>
            <p className="text-sm sm:text-base text-[#6E6F76] leading-relaxed">
              Zero fake reviews. On Nexora, feedback credentials are only unlocked after physical package receipt and buyer confirmation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote:
                  'Multi-offer comparison showed me three different quotes for the MacBook Pro M2 Max in Bangalore. Bought with Escrow Credits and verified the battery cycles at doorstep before releasing payment.',
                author: 'David K.',
                role: 'VERIFIED BUYER // BANGALORE',
                tx: 'TX // NX-884102',
                rating: 5,
              },
              {
                quote:
                  'As an audio merchant selling high-end synthesizers, Nexora verified KYC status immediately eliminated sketchy chargebacks. Every transaction holds credits safely until delivery confirmation.',
                author: 'Marcus T.',
                role: 'PLATINUM MERCHANT // AUDIO LABS',
                tx: 'TX // NX-772910',
                rating: 5,
              },
              {
                quote:
                  'Fixed conversion of 100 Credits = ₹100 INR made bookkeeping seamless. Inspection window gave total peace of mind for an expensive mirrorless camera purchase.',
                author: 'Elena R.',
                role: 'VERIFIED BUYER // MUMBAI',
                tx: 'TX // NX-993812',
                rating: 5,
              },
            ].map((rev, i) => (
              <div key={i} className="p-6 sm:p-8 bg-[#17171A] border border-white/10 space-y-6 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs font-mono text-[#6E6F76]">
                    <span>{rev.tx}</span>
                    <span className="text-amber-400">★★★★★</span>
                  </div>
                  <p className="text-sm text-[#EFEFEE] leading-relaxed font-normal">
                    “{rev.quote}”
                  </p>
                </div>

                <div className="border-t border-white/10 pt-4 text-xs font-mono">
                  <div className="font-bold text-white uppercase">{rev.author}</div>
                  <div className="text-[10px] text-[#7C97FF]">{rev.role}</div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── SECTION 07: SYSTEM SPECIFICATIONS / ACCORDION FAQ ──────────────────── */}
      <section className="bg-[#EFEFEE] border-b border-[#0D0D0F]/12 py-16 sm:py-24 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto space-y-12">
          
          <div className="flex items-center justify-between text-[11px] tracking-[0.22em] text-[#6E6F76] uppercase font-semibold border-b border-[#0D0D0F]/12 pb-4">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#2F5BFF]" />
              <span className="text-[#0D0D0F]">SECTION 07 // SYSTEM SPECS</span>
            </div>
            <div>FREQUENTLY ASKED QUESTIONS</div>
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight uppercase text-[#0D0D0F]">
              SYSTEM SPECIFICATIONS & FAQS.
            </h2>
            <p className="text-sm text-[#43444A]">
              Essential architectural details regarding transaction security, valuation, and verification:
            </p>
          </div>

          <div className="divide-y divide-[#0D0D0F]/12 border-y border-[#0D0D0F]/12">
            {[
              {
                q: '01 // HOW DOES CRYPTOGRAPHIC ESCROW SAFEGUARD BUYERS?',
                a: 'When you authorize an order, credits are reserved in an isolated platform escrow ledger. The merchant never receives payment directly. Credits are released solely after you inspect the physical goods at delivery and tap "Confirm Delivery". If goods are defective or counterfeit, funds are refunded in full.',
              },
              {
                q: '02 // WHAT IS THE EXACT CONVERSION VALUATION OF MARKETPLACE CREDITS?',
                a: 'Marketplace Credits operate at a fixed 1:1 Rupee valuation: 100 Credits = ₹100 INR (1 Credit = ₹1 INR). There are zero exchange markups, zero hidden processing penalties, and zero fluctuating tokens.',
              },
              {
                q: '03 // HOW DOES MULTI-MERCHANT AGGREGATION WORK?',
                a: 'Rather than browsing separate stores, Nexora groups identical models into single catalog viewports. Verified sellers compete directly on price, condition, delivery timeframe, and warranty terms.',
              },
              {
                q: '04 // HOW ARE MERCHANTS VETTED PRIOR TO LISTING?',
                a: 'Every seller must complete government identity KYC (Aadhaar, PAN, or Passport), biometric verification, and address proof before their listings are approved. Platform algorithms continuously monitor delivery latency and dispute rates.',
              },
              {
                q: '05 // WHAT HAPPENS IN THE EVENT OF AN ITEM DISPUTE?',
                a: 'If a received item does not match listing specifications or exhibits unmentioned damage, buyer taps "Raise Dispute" within the 48-hour inspection window. Funds remain locked in escrow while platform compliance mediates evidence or issues an immediate refund.',
              },
            ].map((faq, idx) => (
              <details key={idx} className="group py-5 cursor-pointer">
                <summary className="text-sm sm:text-base font-bold text-[#0D0D0F] flex items-center justify-between list-none uppercase tracking-wide">
                  <span>{faq.q}</span>
                  <span className="font-mono text-base text-[#2F5BFF] transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-xs sm:text-sm text-[#43444A] leading-relaxed max-w-3xl font-normal pt-2">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>

        </div>
      </section>

      {/* ── SECTION 08: FINAL EDITORIAL CALL TO ACTION ─────────────────────────── */}
      <section className="bg-[#0D0D0F] text-[#EFEFEE] py-24 sm:py-32 px-4 sm:px-8 border-b border-[#0D0D0F] relative overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-10">
          
          <div className="flex items-center justify-between text-[11px] tracking-[0.25em] text-[#6E6F76] uppercase font-mono border-b border-white/10 pb-4">
            <span className="text-[#7C97FF]">DEPLOYMENT // PRODUCTION</span>
            <span>PAN-INDIA ESCROW NETWORK</span>
          </div>

          <div className="space-y-6 max-w-4xl">
            <h2 className="text-4xl sm:text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9]">
              FIND THE BETTER OFFER.<br />
              <span className="text-[#7C97FF]">TRANSACT WITH ZERO RISK.</span>
            </h2>

            <p className="text-sm sm:text-base text-[#6E6F76] max-w-xl font-normal leading-relaxed">
              Explore thousands of verified listings across electronics, vehicles, musical instruments, and luxury goods with guaranteed escrow custody.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
            <Link
              to="/search"
              className="group bg-[#EFEFEE] text-[#0D0D0F] hover:bg-white px-8 py-5 text-xs font-bold tracking-[0.2em] uppercase transition-all flex items-center justify-center gap-3 border border-white"
            >
              <span>EXPLORE ALL LISTINGS</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              to="/register"
              className="border border-white/30 text-white hover:border-white px-8 py-5 text-xs font-bold tracking-[0.2em] uppercase transition-colors text-center"
            >
              BECOME A VERIFIED SELLER →
            </Link>
          </div>

          {/* Technical Edge Footnote */}
          <div className="pt-12 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-[10px] font-mono text-[#6E6F76] uppercase tracking-wider">
            <div>NEXORA ARCHITECTURE // BENGALURU • MUMBAI • DELHI • HYDERABAD • CHENNAI</div>
            <div className="text-[#7C97FF]">ESCROW PROTOCOL GUARANTEE: 100% BUYER REVERSAL PROTECTION</div>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  )
}
