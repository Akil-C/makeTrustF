import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Search,
  MapPin,
  ShieldCheck,
  ArrowRight,
  Heart,
  ChevronRight,
  ArrowUpRight,
  Lock,
  Truck,
  Check,
  Activity,
  Compass,
} from 'lucide-react'
import productService from '../../services/productService'
import wishlistService from '../../services/wishlistService'
import { PRODUCT_CATEGORIES } from '../../utils/constants'
import { formatCredits } from '../../utils/formatters'
import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'
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
    title: 'Sony WH-1000XM5 Wireless Headphones',
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

// Escrow transaction study stages
const TRANSACTION_STUDY_STAGES = [
  {
    step: '01',
    code: 'STAGE_AUTH',
    title: 'CREDIT AUTHORIZATION',
    headline: '1:1 Rupee Credit Reservation',
    description:
      'Buyer deposits 100 Credits = ₹100 INR into the isolated order custody ledger. Zero counterparty bank exposure.',
    badge: 'PROTOCOL LOCK // ACTIVE',
    telemetry: 'LEDGER_STATUS // RESERVED',
    hash: '0x4F8B2A91D',
  },
  {
    step: '02',
    code: 'STAGE_CUSTODY',
    title: 'COLD ESCROW VAULT',
    headline: 'Isolated Platform Protection',
    description:
      'Funds are securely held in platform escrow custody. Seller is cryptographically authorized to package and dispatch.',
    badge: 'VAULT STATUS // FROZEN',
    telemetry: 'ESCROW_BALANCE // 145,000 MC',
    hash: '0x992E77C1B',
  },
  {
    step: '03',
    code: 'STAGE_DISPATCH',
    title: 'VERIFIED COURIER TRANSIT',
    headline: 'Waypoint Telemetry Active',
    description:
      'Seller ships via verified courier with integrated tracking. Automated state updates broadcast to buyer and seller.',
    badge: 'LOGISTICS // IN_TRANSIT',
    telemetry: 'TRACKING // TRK-88291039',
    hash: '0x331D8804A',
  },
  {
    step: '04',
    code: 'STAGE_SETTLE',
    title: 'DOORSTEP ACCEPTANCE',
    headline: 'Buyer Inspection & Disbursement',
    description:
      'Buyer inspects physical condition within 48h window. Tapping "Confirm Delivery" irrevocably disburses payout to merchant.',
    badge: 'SETTLEMENT // RELEASED',
    telemetry: 'DISBURSEMENT // COMPLETE',
    hash: '0x77EA0129F',
  },
]

export default function HomePage() {
  const [scrollY, setScrollY] = useState(0)
  const [mounted, setMounted] = useState(false)

  // Transaction study state
  const [studyStage, setStudyStage] = useState(0)
  const [studyProgress, setStudyProgress] = useState(0)
  const studyRef = useRef(null)

  // Catalog & Search state
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [featuredProducts, setFeaturedProducts] = useState(MOCK_FEATURED)
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('ALL')
  const [loading, setLoading] = useState(true)
  const [wishlistIds, setWishlistIds] = useState(new Set())
  const navigate = useNavigate()

  // Multi-offer comparison state
  const [activeCompIdx, setActiveCompIdx] = useState(0)

  // Check prefers-reduced-motion
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    // Check reduced motion
    if (typeof window !== 'undefined' && window.matchMedia) {
      setPrefersReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    }

    // Mount reveal triggered via requestAnimationFrame as required
    const rafId = requestAnimationFrame(() => {
      setMounted(true)
    })

    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrollY(window.scrollY)

          // Computed study scroll calculation
          if (studyRef.current) {
            const rect = studyRef.current.getBoundingClientRect()
            const total = rect.height - window.innerHeight
            if (total > 0) {
              const current = -rect.top
              const p = Math.max(0, Math.min(1, current / total))
              setStudyProgress(p)
              const step = Math.min(3, Math.floor(p * 4))
              setStudyStage(step)
            }
          }
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Load catalog items with fallback
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

  // Filter catalog items by domain category
  const filteredProducts = activeCategoryFilter === 'ALL'
    ? featuredProducts
    : featuredProducts.filter((p) => {
        const cat = (p.categoryName || p.category || '').toUpperCase()
        return cat.includes(activeCategoryFilter.toUpperCase())
      })

  // Scroll factor for hero split-wordmark (over 0 to 600px of scroll)
  const heroFactor = Math.min(1, Math.max(0, scrollY / 600))
  const upperY = prefersReducedMotion ? 0 : -heroFactor * 20
  const upperX = prefersReducedMotion ? 0 : heroFactor * 1.5
  const lowerY = prefersReducedMotion ? 0 : heroFactor * 20
  const lowerX = prefersReducedMotion ? 0 : heroFactor * 1.5
  const subjectY = prefersReducedMotion ? 0 : -heroFactor * 24
  const subjectScale = prefersReducedMotion ? 1 : 1 + heroFactor * 0.12

  const currentComp = COMPARISON_DATASETS[activeCompIdx]
  const currentStudyStage = TRANSACTION_STUDY_STAGES[studyStage]

  return (
    <div className="min-h-screen bg-[#E7E3DA] text-[#1A1917] font-sans selection:bg-[#1A1917] selection:text-[#E7E3DA]">
      <Navbar />

      {/* ── TECHNICAL STATUS BAR ──────────────────────────────────────────────── */}
      <aside aria-label="System status" className="w-full bg-[#DCD7CB] border-b border-[rgba(26,25,23,0.16)] text-[#6E6A61] text-[10px] tracking-[0.2em] font-medium uppercase px-4 sm:px-8 py-2 overflow-x-auto scrollbar-hide">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6 whitespace-nowrap">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-[#1A1917] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#9B3418] animate-pulse" />
              NEXORA ARCHITECTURE // V2.5.0
            </span>
            <span className="text-[rgba(26,25,23,0.2)]">/</span>
            <span>ESCROW LEDGER // CUSTODY ACTIVE</span>
            <span className="text-[rgba(26,25,23,0.2)]">/</span>
            <span>STANDARD // 100 CREDITS = ₹100 INR</span>
          </div>
          <div className="flex items-center gap-4 text-[#4A4741]">
            <span>NODE // BENGALURU (12.9716° N, 77.5946° E)</span>
            <span className="text-[rgba(26,25,23,0.2)]">/</span>
            <span className="text-[#9B3418] font-bold">STATUS // VERIFIED</span>
          </div>
        </div>
      </aside>

      <DemoDisclaimer />

      {/* ── HERO SECTION: SPLIT WORDMARK & EDITORIAL STAGE ────────────────────── */}
      <section className="relative min-h-[calc(100vh-80px)] border-b border-[rgba(26,25,23,0.16)] overflow-hidden bg-[#E7E3DA] flex flex-col justify-between p-4 sm:p-8 md:p-12">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center flex-1 my-auto">
          
          {/* Left Column: Typographic Messaging & Console (7 cols) */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 z-20">
            
            {/* Small Technical Eyebrow */}
            <div className="flex items-center gap-3 text-[11px] font-bold tracking-[0.25em] text-[#6E6A61] uppercase border-b border-[rgba(26,25,23,0.16)] pb-3">
              <span className="w-1.5 h-1.5 bg-[#9B3418]" />
              <span className="text-[#1A1917]">NEXORA / MARKETPLACE</span>
              <span className="text-[rgba(26,25,23,0.2)]">/</span>
              <span>SYSTEM 01 // TRUST LAYER</span>
            </div>

            {/* Oversized Editorial Headline */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] xl:text-[6.2rem] font-black tracking-tighter leading-[0.88] text-[#1A1917] uppercase select-none">
                BUY WITH<br />
                CONFIDENCE.<br />
                <span className="text-[#4A4741]">SELL WITH</span><br />
                <span className="italic font-serif font-normal text-[#9B3418]">ACCOUNTABILITY.</span>
              </h1>
            </div>

            {/* Concise Supporting Statement */}
            <p className="text-sm sm:text-base text-[#4A4741] leading-relaxed max-w-xl font-normal">
              A marketplace architecture designed around cryptographic custody and verified merchant accountability. Every transaction is backed by cold escrow protection. Fixed valuation: 100 Credits = ₹100 INR.
            </p>

            {/* Action Buttons: Sharp Rectangular Editorial CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <Link
                to="/search"
                className="group relative bg-[#1A1917] text-[#E7E3DA] px-7 py-4 rounded-none font-bold text-xs tracking-[0.18em] uppercase transition-all duration-300 hover:bg-[#4A4741] flex items-center justify-center gap-2 border border-[#1A1917]"
              >
                <span>EXPLORE MARKETPLACE</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <Link
                to="/register"
                className="group relative bg-transparent text-[#1A1917] px-7 py-4 rounded-none font-bold text-xs tracking-[0.18em] uppercase transition-all duration-300 hover:bg-[#1A1917] hover:text-[#E7E3DA] border border-[#1A1917] flex items-center justify-center gap-2"
              >
                <span>BECOME A SELLER</span>
                <span className="text-[#9B3418] group-hover:text-[#E7E3DA]">→</span>
              </Link>
            </div>

            {/* Minimalist Architectural Search Console */}
            <form
              onSubmit={handleSearchSubmit}
              className="border border-[rgba(26,25,23,0.16)] bg-[#DCD7CB] p-2 flex flex-col sm:flex-row items-stretch gap-2 max-w-xl"
            >
              <div className="relative flex-1 bg-[#E7E3DA] border border-[rgba(26,25,23,0.16)] flex items-center px-3 py-2.5">
                <Search className="w-3.5 h-3.5 text-[#6E6A61] shrink-0 mr-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Query products, specifications, verified sellers..."
                  className="w-full bg-transparent text-[#1A1917] placeholder-[#6E6A61] text-xs font-medium outline-none"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full sm:w-auto bg-[#E7E3DA] border border-[rgba(26,25,23,0.16)] px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-[#1A1917] outline-none cursor-pointer"
              >
                <option value="">ALL DOMAINS</option>
                {PRODUCT_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.toUpperCase()}
                  </option>
                ))}
              </select>

              <button
                type="submit"
                className="bg-[#1A1917] text-[#E7E3DA] hover:bg-[#4A4741] px-5 py-2.5 text-xs font-bold tracking-[0.15em] uppercase transition-colors shrink-0 flex items-center justify-center gap-1.5"
              >
                <span>SEARCH</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </form>

          </div>

          {/* Right Column: SIGNATURE SPLIT NEXORA WORDMARK & CUT-OUT SUBJECT (5 cols) */}
          <div className="lg:col-span-5 relative flex flex-col items-end justify-center min-h-[360px] sm:min-h-[460px] lg:min-h-[580px] select-none py-6">
            
            {/* Upper Wordmark Line: NEX */}
            <div
              className="text-right text-[#1A1917] font-black tracking-tighter uppercase leading-[0.78] z-0 transition-transform duration-75 ease-out select-none"
              style={{
                fontSize: 'clamp(5rem, 16vw, 12rem)',
                transform: mounted
                  ? `translateY(${upperY}vh) translateX(${upperX}vw)`
                  : 'translateY(-24px)',
                opacity: mounted ? 1 : 0,
                transitionProperty: mounted && !prefersReducedMotion ? 'none' : 'all',
                transitionDuration: '1.1s',
                transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              NEX
            </div>

            {/* Cut-Out Subject Passing Through the Gap */}
            <div
              className="relative my-2 sm:my-3 z-10 flex items-center justify-center transition-transform duration-75 ease-out"
              style={{
                transform: mounted
                  ? `translateY(${subjectY}vh) scale(${subjectScale})`
                  : 'translateY(12px) scale(0.92)',
                opacity: mounted ? 1 : 0,
                transitionProperty: mounted && !prefersReducedMotion ? 'none' : 'all',
                transitionDuration: '1.2s',
                transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=1200&auto=format&fit=crop&q=80"
                alt="Precision Verified Marketplace Exhibit"
                className="object-contain mix-blend-multiply drop-shadow-2xl transition-all"
                style={{
                  height: 'min(36vh, 290px)',
                  width: 'auto',
                  maxWidth: '90vw',
                }}
              />
              {/* Construction Crosshair Overlay */}
              <span className="absolute top-0 right-0 font-mono text-[8px] text-[#6E6A61] tracking-widest">+ [FIG. 01]</span>
              <span className="absolute bottom-0 left-0 font-mono text-[8px] text-[#6E6A61] tracking-widest">+ [ESCROW_VAULT]</span>
            </div>

            {/* Lower Wordmark Line: ORA */}
            <div
              className="text-right text-[#1A1917] font-black tracking-tighter uppercase leading-[0.78] z-20 transition-transform duration-75 ease-out select-none"
              style={{
                fontSize: 'clamp(5rem, 16vw, 12rem)',
                transform: mounted
                  ? `translateY(${lowerY}vh) translateX(${lowerX}vw)`
                  : 'translateY(24px)',
                opacity: mounted ? 1 : 0,
                transitionProperty: mounted && !prefersReducedMotion ? 'none' : 'all',
                transitionDuration: '1.1s',
                transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              ORA
            </div>

          </div>

        </div>

        {/* Hero Bottom Hairline Coordinates & Straps */}
        <div className="max-w-7xl mx-auto w-full pt-8 border-t border-[rgba(26,25,23,0.16)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-[10px] font-mono text-[#6E6A61] uppercase tracking-[0.2em]">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[#9B3418]" />
            <span>NEXORA ESCROW CUSTODY PROTOCOL // VERIFIED DEPLOYMENT</span>
          </div>
          <div className="flex items-center gap-6 text-[#4A4741]">
            <span>100 CREDITS = ₹100 INR</span>
            <span>DOORSTEP 48H INSPECTION</span>
            <span>ZERO ANONYMOUS SELLERS</span>
          </div>
        </div>
      </section>

      {/* ── SECTION 01 — TRUST ARCHITECTURE ──────────────────────────────────── */}
      <section id="trust" className="py-20 sm:py-28 px-4 sm:px-8 border-b border-[rgba(26,25,23,0.16)] bg-[#E7E3DA]">
        <div className="max-w-7xl mx-auto space-y-14">
          
          <div className="flex items-center justify-between text-[11px] tracking-[0.22em] text-[#6E6A61] uppercase font-semibold border-b border-[rgba(26,25,23,0.16)] pb-4">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#9B3418]" />
              <span className="text-[#1A1917]">01 // TRUST</span>
            </div>
            <div>VERIFIED IDENTITY ARCHITECTURE</div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            <div className="lg:col-span-6 space-y-6">
              <div className="text-xs font-mono font-bold tracking-[0.25em] text-[#9B3418] uppercase">
                [ ARCHITECTURAL ACCOUNTABILITY ]
              </div>
              <h2 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight uppercase text-[#1A1917] leading-[0.92]">
                A MARKETPLACE<br />
                BUILT AROUND<br />
                <span className="italic font-serif font-normal text-[#9B3418]">ACCOUNTABILITY.</span>
              </h2>
              <p className="text-sm sm:text-base text-[#4A4741] leading-relaxed font-normal max-w-lg">
                Conventional marketplaces rely on trust placed in anonymous strangers. Nexora operates on cryptographic custody: funds never touch a seller until you inspect the item and submit confirmation.
              </p>
            </div>

            <div className="lg:col-span-6 space-y-6">
              <div className="border border-[rgba(26,25,23,0.16)] bg-[#DCD7CB] p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between border-b border-[rgba(26,25,23,0.16)] pb-4">
                  <div className="text-xs font-bold uppercase tracking-wider text-[#1A1917]">
                    MERCHANT REPUTATION MATRIX
                  </div>
                  <span className="text-[10px] font-mono text-[#9B3418] border border-[#9B3418]/30 px-2 py-0.5 uppercase">
                    KYC CERTIFIED
                  </span>
                </div>

                <div className="space-y-4 text-xs font-mono text-[#4A4741]">
                  <div className="flex items-start justify-between">
                    <span className="text-[#6E6A61]">IDENTITY PROTOCOL:</span>
                    <span className="font-bold text-[#1A1917] text-right">GOVERNMENT ID & BIOMETRIC SELFIE</span>
                  </div>
                  <div className="flex items-start justify-between">
                    <span className="text-[#6E6A61]">REPUTATION INDEX:</span>
                    <span className="font-bold text-[#9B3418] text-right">100-POINT ALGORITHM</span>
                  </div>
                  <div className="flex items-start justify-between">
                    <span className="text-[#6E6A61]">DEFAULT PROTECTION:</span>
                    <span className="font-bold text-[#1A1917] text-right">100% CUSTODY VAULT REFUND</span>
                  </div>
                  <div className="flex items-start justify-between">
                    <span className="text-[#6E6A61]">SETTLEMENT RULE:</span>
                    <span className="font-bold text-[#1A1917] text-right">FIXED 100 CREDITS = ₹100 INR</span>
                  </div>
                </div>
              </div>

              {/* Factual Performance Telemetry */}
              <div className="grid grid-cols-2 sm:grid-cols-4 border border-[rgba(26,25,23,0.16)] divide-x divide-y sm:divide-y-0 divide-[rgba(26,25,23,0.16)] bg-[#DCD7CB] text-center p-2">
                <div className="p-3 space-y-1">
                  <div className="text-xl sm:text-2xl font-mono font-extrabold text-[#1A1917]">99.8%</div>
                  <div className="text-[9px] font-mono text-[#6E6A61] uppercase">FULFILLMENT</div>
                </div>
                <div className="p-3 space-y-1">
                  <div className="text-xl sm:text-2xl font-mono font-extrabold text-[#9B3418]">₹0.00</div>
                  <div className="text-[9px] font-mono text-[#6E6A61] uppercase">BUYER DEFAULT</div>
                </div>
                <div className="p-3 space-y-1">
                  <div className="text-xl sm:text-2xl font-mono font-extrabold text-[#1A1917]">100%</div>
                  <div className="text-[9px] font-mono text-[#6E6A61] uppercase">ESCROW VAULT</div>
                </div>
                <div className="p-3 space-y-1">
                  <div className="text-xl sm:text-2xl font-mono font-extrabold text-[#1A1917]">1:1</div>
                  <div className="text-[9px] font-mono text-[#6E6A61] uppercase">INR VALUATION</div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ── SECTION 02 — PROTECTED TRANSACTIONS (ESCROW LIFECYCLE) ─────────────── */}
      <section id="how-it-works" className="py-20 sm:py-28 px-4 sm:px-8 border-b border-[rgba(26,25,23,0.16)] bg-[#DCD7CB]">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="flex items-center justify-between text-[11px] tracking-[0.22em] text-[#6E6A61] uppercase font-semibold border-b border-[rgba(26,25,23,0.16)] pb-4">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#9B3418]" />
              <span className="text-[#1A1917]">02 // PROTECTED TRANSACTIONS</span>
            </div>
            <div>ESCROW PROTOCOL LIFECYCLE</div>
          </div>

          <div className="max-w-3xl space-y-3">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight uppercase text-[#1A1917] leading-tight">
              FROM PAYMENT AUTHORIZATION<br />
              TO DOORSTEP ACCEPTANCE.
            </h2>
            <p className="text-sm sm:text-base text-[#4A4741] leading-relaxed">
              Funds never transfer directly from buyer to merchant. Nexora acts as a cryptographic custodian until physical goods are inspected and verified.
            </p>
          </div>

          {/* Linear Sequence Hairline Grid */}
          <div className="grid grid-cols-1 md:grid-cols-5 border border-[rgba(26,25,23,0.16)] divide-y md:divide-y-0 md:divide-x divide-[rgba(26,25,23,0.16)] bg-[#E7E3DA]">
            {[
              { step: '01', title: 'PAYMENT', desc: 'Buyer authorizes purchase with credits (100 Credits = ₹100 INR).' },
              { step: '02', title: 'SECURED', desc: '100% of order credits locked into cold escrow custody ledger.' },
              { step: '03', title: 'DELIVERY', desc: 'Merchant ships via verified courier or coordinates SafePoint exchange.' },
              { step: '04', title: 'CONFIRM', desc: 'Buyer conducts 48h doorstep inspection of specs and condition.' },
              { step: '05', title: 'RELEASE', desc: 'Buyer taps Confirm. Escrow vault disburses payout to merchant.' },
            ].map((st) => (
              <div key={st.step} className="p-6 space-y-3 hover:bg-[#DCD7CB]/40 transition-colors">
                <div className="text-[10px] font-mono text-[#9B3418] font-bold">
                  STAGE // {st.step}
                </div>
                <div className="text-base font-bold uppercase tracking-wider text-[#1A1917]">
                  {st.title}
                </div>
                <p className="text-xs text-[#4A4741] leading-relaxed font-normal">
                  {st.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── SECTION 03 — COMPUTED TRANSACTION STUDY (PINNED STAGE) ─────────────── */}
      <section ref={studyRef} className="relative h-[220vh] bg-[#DCD7CB] border-b border-[rgba(26,25,23,0.16)]">
        <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between p-4 sm:p-8 md:p-12">
          
          {/* Study Header */}
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between text-[11px] font-mono tracking-[0.22em] text-[#6E6A61] uppercase border-b border-[rgba(26,25,23,0.16)] pb-3">
            <span className="text-[#1A1917] font-bold">03 // COMPUTED TRANSACTION STUDY</span>
            <span className="text-[#9B3418]">
              PROGRESS // {Math.round(studyProgress * 100)}%
            </span>
            <span>MODEL // NX-ESCROW-20481</span>
          </div>

          {/* Centerpiece Architecture: Calibration Stage */}
          <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center flex-1 my-auto">
            
            {/* Left Study Readout */}
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-block px-2.5 py-1 text-[10px] font-mono text-[#9B3418] border border-[#9B3418]/30 font-bold uppercase">
                {currentStudyStage.badge}
              </div>

              <div className="space-y-1">
                <div className="text-[10px] font-mono text-[#6E6A61] uppercase tracking-wider">
                  VERIFIED STAGE 0{studyStage + 1} OF 04
                </div>
                <h3 className="text-2xl sm:text-4xl font-black uppercase text-[#1A1917] leading-tight">
                  {currentStudyStage.title}
                </h3>
              </div>

              <p className="text-sm text-[#4A4741] leading-relaxed max-w-md font-normal">
                {currentStudyStage.description}
              </p>

              {/* Technical Marker Readouts */}
              <div className="border border-[rgba(26,25,23,0.16)] bg-[#E7E3DA] p-4 space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-[#6E6A61]">HASH POINTER:</span>
                  <span className="font-bold text-[#1A1917]">{currentStudyStage.hash}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6E6A61]">TELEMETRY:</span>
                  <span className="font-bold text-[#9B3418]">{currentStudyStage.telemetry}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6E6A61]">CONVERSION:</span>
                  <span className="font-bold text-[#1A1917]">100 CREDITS = ₹100 INR</span>
                </div>
              </div>
            </div>

            {/* Right: Technical Subject with Construction Crosshairs */}
            <div className="lg:col-span-7 relative flex items-center justify-center p-6 border border-[rgba(26,25,23,0.16)] bg-[#E7E3DA] min-h-[340px] sm:min-h-[420px]">
              
              {/* Construction Lines & Crosshairs */}
              <div className="absolute top-3 left-3 text-[9px] font-mono text-[#6E6A61]">+ [X: 01.29 Y: 44.10]</div>
              <div className="absolute top-3 right-3 text-[9px] font-mono text-[#6E6A61]">+ [INSPECTION_WINDOW]</div>
              <div className="absolute bottom-3 left-3 text-[9px] font-mono text-[#6E6A61]">+ [CALIBRATED_GRID]</div>
              <div className="absolute bottom-3 right-3 text-[9px] font-mono text-[#6E6A61]">+ [NX_CUSTODY]</div>

              {/* Centered Exhibit Photograph */}
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80"
                  alt="Transaction Study Object"
                  className="max-h-[260px] sm:max-h-[320px] w-auto object-contain mix-blend-multiply drop-shadow-xl"
                />
                <div className="absolute -bottom-4 right-0 bg-[#1A1917] text-[#E7E3DA] text-[9px] font-mono px-2 py-0.5 uppercase tracking-wider">
                  CUSTODY // 145,000 MC RESERVED
                </div>
              </div>

            </div>

          </div>

          {/* Stage Step Indicator */}
          <div className="max-w-7xl mx-auto w-full pt-4 border-t border-[rgba(26,25,23,0.16)] grid grid-cols-4 text-[10px] font-mono uppercase tracking-wider">
            {TRANSACTION_STUDY_STAGES.map((s, idx) => (
              <div
                key={s.code}
                onClick={() => setStudyStage(idx)}
                className={`cursor-pointer transition-colors ${
                  idx === studyStage ? 'text-[#9B3418] font-bold' : 'text-[#6E6A61] hover:text-[#1A1917]'
                }`}
              >
                0{idx + 1} // {s.title}
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── SECTION 04 — DISCOVERY (MULTI-OFFER & CATALOG) ─────────────────────── */}
      <section id="marketplace" className="py-20 sm:py-28 px-4 sm:px-8 border-b border-[rgba(26,25,23,0.16)] bg-[#E7E3DA]">
        <div className="max-w-7xl mx-auto space-y-14">
          
          <div className="flex items-center justify-between text-[11px] tracking-[0.22em] text-[#6E6F76] uppercase font-semibold border-b border-[rgba(26,25,23,0.16)] pb-4">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#9B3418]" />
              <span className="text-[#1A1917]">04 // DISCOVERY</span>
            </div>
            <div>MULTI-OFFER INTELLIGENCE</div>
          </div>

          {/* Multi-Offer Comparison Engine */}
          <div className="space-y-6">
            <div className="max-w-3xl space-y-2">
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight uppercase text-[#1A1917] leading-tight">
                ONE PRODUCT. MULTIPLE OFFERS.<br />
                <span className="italic font-serif font-normal text-[#9B3418]">ONE SMARTER DECISION.</span>
              </h2>
              <p className="text-sm text-[#4A4741]">
                Compare verified quotes from multiple merchants side-by-side on a single catalog viewport:
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
                    className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all border ${
                      active
                        ? 'bg-[#1A1917] text-[#E7E3DA] border-[#1A1917]'
                        : 'bg-[#DCD7CB] text-[#4A4741] border-[rgba(26,25,23,0.16)] hover:border-[#1A1917]'
                    }`}
                  >
                    <span className="text-[10px] font-mono text-[#9B3418] mr-2">[{item.specCode}]</span>
                    <span>{item.title}</span>
                  </button>
                )
              })}
            </div>

            {/* Offer Comparison Columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 border border-[rgba(26,25,23,0.16)] divide-y md:divide-y-0 md:divide-x divide-[rgba(26,25,23,0.16)] bg-[#DCD7CB]">
              {currentComp.offers.map((offer, oIdx) => (
                <div key={offer.merchant} className="p-6 space-y-5 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="font-bold text-[#1A1917]">{offer.merchant}</span>
                      <span className="text-[10px] text-[#9B3418] border border-[#9B3418]/30 px-2 py-0.5">
                        {offer.status}
                      </span>
                    </div>

                    <div>
                      <div className="text-[10px] font-mono text-[#6E6A61] uppercase">ESCROW QUOTE</div>
                      <div className="text-2xl sm:text-3xl font-mono font-extrabold text-[#1A1917]">
                        ₹{offer.price.toLocaleString('en-IN')}
                      </div>
                      <div className="text-[11px] font-mono text-[#6E6A61]">
                        {offer.price.toLocaleString('en-IN')} Credits • 100 CR = ₹100
                      </div>
                    </div>

                    <div className="space-y-2 text-xs font-mono text-[#4A4741] border-t border-[rgba(26,25,23,0.16)] pt-3">
                      <div className="flex justify-between">
                        <span className="text-[#6E6A61]">CONDITION:</span>
                        <span className="font-bold text-[#1A1917]">{offer.condition}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#6E6A61]">TRUST SCORE:</span>
                        <span className="font-bold text-[#9B3418]">{offer.trustScore} / 100</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#6E6A61]">DISPATCH:</span>
                        <span className="font-bold text-[#1A1917] truncate max-w-[140px]">{offer.fulfillment}</span>
                      </div>
                    </div>
                  </div>

                  <Link
                    to={currentComp.link}
                    className="w-full block text-center py-3 text-xs font-bold uppercase tracking-wider transition-colors border border-[#1A1917] bg-[#1A1917] text-[#E7E3DA] hover:bg-[#4A4741]"
                  >
                    SELECT THIS OFFER →
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Active Marketplace Catalog Grid */}
          <div className="space-y-8 pt-8 border-t border-[rgba(26,25,23,0.16)]">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h3 className="text-2xl sm:text-3xl font-black uppercase text-[#1A1917]">
                  VERIFIED MARKETPLACE CATALOG
                </h3>
                <p className="text-xs sm:text-sm text-[#4A4741] mt-1">
                  High-value products authenticated by KYC-verified merchants. Backed by 48h doorstep inspection.
                </p>
              </div>

              {/* Domain Filter Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide text-[11px] font-mono uppercase">
                {['ALL', 'Electronics', 'Vehicles', 'Musical Instruments', 'Furniture', 'Fashion'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategoryFilter(cat)}
                    className={`px-3 py-1.5 border transition-colors whitespace-nowrap ${
                      activeCategoryFilter === cat
                        ? 'bg-[#1A1917] text-[#E7E3DA] border-[#1A1917]'
                        : 'bg-[#DCD7CB] text-[#4A4741] border-[rgba(26,25,23,0.16)] hover:border-[#1A1917]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="py-20 flex justify-center">
                <LoadingSpinner size="lg" />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredProducts.map((prod) => (
                  <div
                    key={prod.id}
                    className="group border border-[rgba(26,25,23,0.16)] bg-[#DCD7CB] flex flex-col justify-between transition-all duration-300 hover:border-[#1A1917]"
                  >
                    <div>
                      {/* Product Image Frame */}
                      <div className="relative aspect-square overflow-hidden bg-[#E7E3DA] border-b border-[rgba(26,25,23,0.16)]">
                        <img
                          src={getProductImage(prod)}
                          alt={prod.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                          onError={(e) => {
                            e.target.onerror = null
                            e.target.src = getProductImage(prod)
                          }}
                        />

                        {/* Wishlist Button */}
                        <button
                          onClick={(e) => toggleWishlist(prod.id, e)}
                          className="absolute top-2.5 right-2.5 p-2 bg-[#E7E3DA]/90 hover:bg-[#1A1917] hover:text-[#E7E3DA] text-[#1A1917] border border-[rgba(26,25,23,0.16)] transition-colors z-10"
                          aria-label="Save listing"
                        >
                          <Heart
                            className={`w-3.5 h-3.5 ${
                              wishlistIds.has(prod.id) ? 'fill-[#9B3418] text-[#9B3418]' : ''
                            }`}
                          />
                        </button>

                        {/* Condition Tag */}
                        {prod.condition && (
                          <span className="absolute bottom-2.5 left-2.5 bg-[#1A1917] text-[#E7E3DA] text-[9px] font-mono tracking-wider px-2 py-0.5 uppercase">
                            {prod.condition.replace('_', ' ')}
                          </span>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-4 space-y-2">
                        <div className="flex items-center justify-between text-[10px] font-mono text-[#6E6A61] uppercase">
                          <span>{prod.category || 'ELECTRONICS'}</span>
                          {prod.city && (
                            <span className="flex items-center gap-1 text-[#4A4741]">
                              <MapPin className="w-3 h-3 text-[#9B3418]" />
                              {prod.city}
                            </span>
                          )}
                        </div>

                        <h4 className="font-bold text-sm text-[#1A1917] line-clamp-2 group-hover:text-[#9B3418] transition-colors leading-snug">
                          {prod.title}
                        </h4>

                        {prod.seller && (
                          <div className="pt-2 border-t border-[rgba(26,25,23,0.16)] flex items-center justify-between text-[10px] font-mono text-[#6E6A61]">
                            <span className="truncate max-w-[120px] text-[#4A4741]">
                              {prod.seller.displayName || prod.seller.name || 'Verified Merchant'}
                            </span>
                            <span className="text-[#9B3418] font-bold">
                              {prod.seller.sellerLevel || 'PLATINUM'}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Footer / Dual Price */}
                    <div className="p-4 pt-0 border-t border-[rgba(26,25,23,0.16)] flex items-end justify-between mt-2">
                      <div>
                        <div className="text-[8px] font-mono text-[#6E6A61] uppercase">VALUATION</div>
                        <div className="text-base font-mono font-extrabold text-[#1A1917]">
                          ₹{Number(prod.priceInCredits || prod.price || 0).toLocaleString('en-IN')}
                        </div>
                        <div className="text-[10px] font-mono text-[#6E6A61]">
                          {Number(prod.priceInCredits || prod.price || 0).toLocaleString('en-IN')} Credits
                        </div>
                      </div>

                      <Link
                        to={`/products/${prod.id}`}
                        className="bg-[#1A1917] text-[#E7E3DA] hover:bg-[#4A4741] px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1"
                      >
                        <span>VIEW</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </section>

      {/* ── SECTION 05 — MATERIAL / PRACTICE (CORE PRINCIPLES) ────────────────── */}
      <section className="py-20 sm:py-28 px-4 sm:px-8 border-b border-[rgba(26,25,23,0.16)] bg-[#DCD7CB]">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="flex items-center justify-between text-[11px] tracking-[0.22em] text-[#6E6A61] uppercase font-semibold border-b border-[rgba(26,25,23,0.16)] pb-4">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#9B3418]" />
              <span className="text-[#1A1917]">05 // PRACTICE</span>
            </div>
            <div>ARCHITECTURAL PRINCIPLES</div>
          </div>

          <div className="max-w-3xl space-y-2">
            <h2 className="text-3xl sm:text-4xl font-black uppercase text-[#1A1917]">
              CORE REPUTATION & CUSTODY STANDARDS.
            </h2>
            <p className="text-sm text-[#4A4741]">
              Hairline-ruled principles governing every peer-to-peer transaction on Nexora:
            </p>
          </div>

          {/* Hairline-Ruled Rows */}
          <div className="border-t border-[rgba(26,25,23,0.16)] divide-y divide-[rgba(26,25,23,0.16)]">
            {[
              {
                label: 'TRUST ARCHITECTURE',
                description: '100-point dynamic seller score calculated from dispatch velocity, cancellation ratios, and zero dispute infractions.',
                classification: 'CORE PROTOCOL',
              },
              {
                label: 'CUSTODIAL ESCROW',
                description: 'Buyer credits are isolated in cold platform custody. Funds are never exposed to counterparty bank transfer risks.',
                classification: 'SECURITY LAYER',
              },
              {
                label: 'MULTI-OFFER DISCOVERY',
                description: 'Consolidated product viewports allow buyers to compare competing merchant quotes, condition grades, and delivery terms.',
                classification: 'CATALOG ENGINE',
              },
              {
                label: 'DOORSTEP INSPECTION',
                description: 'Mandatory 48-hour physical inspection window. Payout is released solely upon buyer confirmation.',
                classification: 'BUYER GUARANTEE',
              },
              {
                label: 'FIXED VALUATION',
                description: 'Guaranteed 1:1 Rupee standard where 100 Credits = ₹100 INR. Zero conversion fees, zero floating tokens.',
                classification: 'STANDARD SPEC',
              },
            ].map((row) => (
              <div
                key={row.label}
                className="py-5 sm:py-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-baseline hover:bg-[#E7E3DA]/40 transition-colors px-2"
              >
                <div className="md:col-span-4 font-bold text-sm uppercase tracking-wider text-[#1A1917]">
                  {row.label}
                </div>
                <div className="md:col-span-6 text-xs sm:text-sm text-[#4A4741] font-normal leading-relaxed">
                  {row.description}
                </div>
                <div className="md:col-span-2 text-right font-mono text-[10px] text-[#9B3418] uppercase tracking-wider">
                  [{row.classification}]
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── SECTION 06 — MARKETPLACE WORK TABLE ───────────────────────────────── */}
      <section className="py-20 sm:py-28 px-4 sm:px-8 border-b border-[rgba(26,25,23,0.16)] bg-[#E7E3DA]">
        <div className="max-w-7xl mx-auto space-y-10">
          
          <div className="flex items-center justify-between text-[11px] tracking-[0.22em] text-[#6E6F76] uppercase font-semibold border-b border-[rgba(26,25,23,0.16)] pb-4">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#9B3418]" />
              <span className="text-[#1A1917]">06 // MARKETPLACE WORK TABLE</span>
            </div>
            <div>ACTIVE LISTING INDEX</div>
          </div>

          <div className="max-w-2xl space-y-2">
            <h2 className="text-3xl sm:text-4xl font-black uppercase text-[#1A1917]">
              VERIFIED LISTING TELEMETRY.
            </h2>
            <p className="text-sm text-[#4A4741]">
              Live comparison of lowest merchant quotes across active verified listings:
            </p>
          </div>

          {/* Full-Width Architectural Table */}
          <div className="border border-[rgba(26,25,23,0.16)] bg-[#DCD7CB] overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[rgba(26,25,23,0.16)] text-[10px] font-mono tracking-[0.2em] text-[#6E6A61] uppercase bg-[#E7E3DA]">
                  <th className="p-4 pl-6">ITEM SPECIFICATION</th>
                  <th className="p-4">DOMAIN</th>
                  <th className="p-4">CONDITION</th>
                  <th className="p-4">OFFER QUOTE</th>
                  <th className="p-4">MERCHANTS</th>
                  <th className="p-4 pr-6 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(26,25,23,0.16)] text-xs font-mono">
                {featuredProducts.slice(0, 8).map((p) => {
                  const lowest = Number(p.priceInCredits || p.price || 100)
                  return (
                    <tr key={p.id} className="hover:bg-[#E7E3DA]/60 transition-colors">
                      <td className="p-4 pl-6 font-sans font-bold text-[#1A1917] flex items-center gap-3">
                        <img
                          src={getProductImage(p)}
                          alt={p.title}
                          className="w-10 h-10 object-cover border border-[rgba(26,25,23,0.16)] shrink-0"
                        />
                        <span className="line-clamp-1">{p.title}</span>
                      </td>
                      <td className="p-4 text-[#4A4741] uppercase text-[11px]">
                        {p.categoryName || p.category || 'ELECTRONICS'}
                      </td>
                      <td className="p-4 text-[#4A4741] uppercase text-[11px]">
                        {p.condition?.replace('_', ' ') || 'LIKE NEW'}
                      </td>
                      <td className="p-4 font-bold text-[#1A1917] text-sm">
                        ₹{lowest.toLocaleString('en-IN')}
                      </td>
                      <td className="p-4 text-[#9B3418] font-semibold">
                        3 VERIFIED
                      </td>
                      <td className="p-4 pr-6 text-right font-sans">
                        <Link
                          to={`/products/${p.id}`}
                          className="text-xs font-bold uppercase tracking-wider text-[#1A1917] hover:text-[#9B3418] underline"
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

      {/* ── SECTION 07 — FOOTER / CLOSE & CROPPED FINAL WORDMARK ───────────────── */}
      <section className="bg-[#DCD7CB] text-[#1A1917] pt-24 sm:pt-32 border-b border-[rgba(26,25,23,0.16)] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
          
          <div className="flex items-center justify-between text-[11px] font-mono tracking-[0.25em] text-[#6E6A61] uppercase border-b border-[rgba(26,25,23,0.16)] pb-4">
            <span className="text-[#9B3418]">NEXORA DEPLOYED // PRODUCTION</span>
            <span>100 CREDITS = ₹100 INR ESCROW</span>
          </div>

          <div className="space-y-6 max-w-4xl">
            <h2 className="text-4xl sm:text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.88] text-[#1A1917]">
              READY TO<br />
              TRADE WITH<br />
              <span className="italic font-serif font-normal text-[#9B3418]">MORE TRUST.</span>
            </h2>

            <p className="text-sm sm:text-base text-[#4A4741] max-w-xl font-normal leading-relaxed">
              Explore thousands of verified listings across electronics, vehicles, musical instruments, and luxury goods with guaranteed cryptographic escrow custody.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
            <Link
              to="/search"
              className="group bg-[#1A1917] text-[#E7E3DA] hover:bg-[#4A4741] px-8 py-5 text-xs font-bold tracking-[0.2em] uppercase transition-all flex items-center justify-center gap-3 border border-[#1A1917]"
            >
              <span>EXPLORE ALL LISTINGS</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              to="/register"
              className="border border-[#1A1917] text-[#1A1917] hover:bg-[#1A1917] hover:text-[#E7E3DA] px-8 py-5 text-xs font-bold tracking-[0.2em] uppercase transition-colors text-center"
            >
              BECOME A VERIFIED SELLER →
            </Link>
          </div>

          {/* Technical Edge Footnote */}
          <div className="pt-10 border-t border-[rgba(26,25,23,0.16)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-[10px] font-mono text-[#6E6A61] uppercase tracking-wider">
            <div>NEXORA ARCHITECTURE // BENGALURU • MUMBAI • DELHI • HYDERABAD • CHENNAI</div>
            <div className="text-[#9B3418]">ESCROW PROTOCOL GUARANTEE: 100% BUYER REVERSAL PROTECTION</div>
          </div>

          {/* Signature Massive Cropped Nexora Bookend Wordmark */}
          <div className="overflow-hidden pt-6 select-none pointer-events-none">
            <div className="text-[clamp(80px,22vw,320px)] font-black text-[#1A1917]/10 tracking-tighter leading-[0.72] translate-y-[22%] uppercase text-center">
              NEXORA
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  )
}
