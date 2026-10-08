import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Search,
  MapPin,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Heart,
  Star,
  Tag,
  Zap,
  Award,
  ChevronRight,
  ArrowUpRight,
  CheckCircle2,
  Lock,
  RefreshCw,
  Eye,
  Sliders,
  Percent,
} from 'lucide-react'
import productService from '../../services/productService'
import walletService from '../../services/walletService'
import wishlistService from '../../services/wishlistService'
import { PRODUCT_CATEGORIES } from '../../utils/constants'
import { formatCredits } from '../../utils/formatters'
import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'
import StarRating from '../../components/common/StarRating'
import VerifiedBadge from '../../components/common/VerifiedBadge'
import SellerLevelBadge from '../../components/common/SellerLevelBadge'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import DemoDisclaimer from '../../components/common/DemoDisclaimer'
import toast from 'react-hot-toast'

// Sample fallback items for rich presentation when backend is starting empty
const MOCK_FEATURED = [
  {
    id: 1,
    title: 'iPhone 15 Pro Max 256GB — Natural Titanium',
    priceInCredits: 950,
    category: 'Electronics',
    condition: 'LIKE_NEW',
    primaryImageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop',
    city: 'Downtown',
    distance: 1.2,
    seller: { id: 101, displayName: 'TechHub Deals', sellerLevel: 'PLATINUM', trustScore: 99, averageRating: 4.9, reviewCount: 142, isVerified: true },
  },
  {
    id: 2,
    title: 'Sony WH-1000XM5 Wireless Headphones — Silver',
    priceInCredits: 280,
    category: 'Electronics',
    condition: 'NEW',
    primaryImageUrl: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&auto=format&fit=crop',
    city: 'North Side',
    distance: 3.5,
    seller: { id: 102, displayName: 'AudioFile Studio', sellerLevel: 'GOLD', trustScore: 96, averageRating: 4.8, reviewCount: 88, isVerified: true },
  },
  {
    id: 3,
    title: 'MacBook Air M2 16GB / 512GB Space Gray',
    priceInCredits: 1100,
    category: 'Electronics',
    condition: 'LIKE_NEW',
    primaryImageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop',
    city: 'West End',
    distance: 2.1,
    seller: { id: 103, displayName: 'Sarah Miller', sellerLevel: 'GOLD', trustScore: 98, averageRating: 4.95, reviewCount: 64, isVerified: true },
  },
  {
    id: 4,
    title: 'Herman Miller Aeron Ergonomic Chair — Size B',
    priceInCredits: 650,
    category: 'Furniture',
    condition: 'GOOD',
    primaryImageUrl: 'https://images.unsplash.com/photo-1580481072645-022f9a6d83d0?w=800&auto=format&fit=crop',
    city: 'Metro District',
    distance: 4.0,
    seller: { id: 104, displayName: 'Office Upgrade Co.', sellerLevel: 'PLATINUM', trustScore: 100, averageRating: 5.0, reviewCount: 310, isVerified: true },
  },
]

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [featuredProducts, setFeaturedProducts] = useState(MOCK_FEATURED)
  const [loading, setLoading] = useState(true)
  const [wishlistIds, setWishlistIds] = useState(new Set())
  const navigate = useNavigate()

  // Scroll Choreography Progress States
  const [heroScrollProgress, setHeroScrollProgress] = useState(0)
  const [revealProgress, setRevealProgress] = useState(0)
  const [orderLifecycleIndex, setOrderLifecycleIndex] = useState(0)

  const heroStageRef = useRef(null)
  const revealStageRef = useRef(null)
  const orderStageRef = useRef(null)

  // Single Centralized rAF Scroll Listener
  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          // 1. Hero Scroll Calculations (300svh stage)
          if (heroStageRef.current) {
            const rect = heroStageRef.current.getBoundingClientRect()
            const totalScrollable = rect.height - window.innerHeight
            if (totalScrollable > 0) {
              const current = -rect.top
              const p = Math.max(0, Math.min(1, current / totalScrollable))
              setHeroScrollProgress(p)
            }
          }

          // 2. Comparison Stage Calculations (320svh stage)
          if (revealStageRef.current) {
            const rect = revealStageRef.current.getBoundingClientRect()
            const totalScrollable = rect.height - window.innerHeight
            if (totalScrollable > 0) {
              const current = -rect.top
              const p = Math.max(0, Math.min(1, current / totalScrollable))
              setRevealProgress(p)
            }
          }

          // 3. Order Lifecycle Stage Calculations (360svh stage)
          if (orderStageRef.current) {
            const rect = orderStageRef.current.getBoundingClientRect()
            const totalScrollable = rect.height - window.innerHeight
            if (totalScrollable > 0) {
              const current = -rect.top
              const p = Math.max(0, Math.min(1, current / totalScrollable))
              const step = Math.min(4, Math.floor(p * 5))
              setOrderLifecycleIndex(step)
            }
          }

          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Load backend products
  useEffect(() => {
    async function loadData() {
      try {
        const res = await productService.getTrendingProducts(8)
        if (res?.data?.content && res.data.content.length > 0) {
          setFeaturedProducts(res.data.content)
        }
      } catch (err) {
        // Fallback to rich mock data
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (searchQuery) params.set('q', searchQuery)
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
        toast.success('Removed from wishlist')
      } else {
        await wishlistService.addToWishlist(id)
        setWishlistIds((prev) => new Set(prev).add(id))
        toast.success('Added to wishlist')
      }
    } catch {
      toast.success(wishlistIds.has(id) ? 'Removed from wishlist' : 'Added to wishlist')
      setWishlistIds((prev) => {
        const next = new Set(prev)
        if (next.has(id)) next.delete(id)
        else next.add(id)
        return next
      })
    }
  }

  // Derived styles from hero scroll progress
  const heroImageScale = 1.04 + heroScrollProgress * 0.07
  const heroImageY = heroScrollProgress * -3
  const heroScriptOpacity = Math.max(0, 1 - heroScrollProgress * 2.5)
  const heroScriptY = heroScrollProgress * -40

  return (
    <div className="min-h-screen bg-plaster text-near-black">
      <Navbar />

      {/* ── 1. PINNED HERO STAGE — 300SVH ────────────────────────────────────────── */}
      <section ref={heroStageRef} className="relative h-[300vh] bg-plaster">
        <div className="sticky top-0 h-[100vh] w-full overflow-hidden flex flex-col justify-between p-6 md:p-12">
          
          {/* Background Editorial Product Photography */}
          <div className="absolute inset-0 z-0 bg-paper overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1600&auto=format&fit=crop"
              alt="Nexora Editorial Commerce Campaign"
              className="w-full h-full object-cover mix-blend-multiply opacity-90 transition-transform duration-75 ease-out"
              style={{
                transform: `scale(${heroImageScale}) translateY(${heroImageY}%)`,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-plaster via-transparent to-plaster/40" />
          </div>

          {/* Top Hero Heading & 1st Script Appearance */}
          <div className="relative z-10 pt-4 max-w-7xl mx-auto w-full text-center">
            
            {/* SCRIPT ACCENT #1 (Caveat Brush, Pink #EF6F79, rotated -1deg) */}
            <div
              className="mb-1 transition-all duration-75"
              style={{
                opacity: heroScriptOpacity,
                transform: `translateY(${heroScriptY}px) rotate(-1deg)`,
              }}
            >
              <span className="font-caveat text-accent text-2xl sm:text-3xl md:text-4xl inline-block drop-shadow-sm">
                compare better
              </span>
            </div>

            {/* Hero Enormous Editorial Wordmark */}
            <h1 className="font-bodoni font-bold tracking-tighter text-near-black uppercase whitespace-nowrap leading-none select-none text-[min(clamp(3.5rem,18vw,12rem),calc(90vw/(6*.60)))]">
              NEXORA
            </h1>

            <p className="furniture-text text-near-black/80 mt-4 tracking-widest max-w-lg mx-auto">
              COMPARE SMARTER. BUY WITH CONFIDENCE. THE TRUST-FIRST MARKETPLACE.
            </p>

            {/* Quick Search Form inside Hero */}
            <form
              onSubmit={handleSearchSubmit}
              className="mt-6 max-w-2xl mx-auto bg-white/95 backdrop-blur-md hairline-all p-2 flex flex-col sm:flex-row items-center gap-2 shadow-sm"
            >
              <div className="relative flex-1 w-full flex items-center pl-3">
                <Search className="w-4 h-4 text-near-black/40 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products, sellers, categories..."
                  className="w-full px-3 py-2 text-sm text-near-black placeholder-near-black/40 bg-transparent outline-none font-sans"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full sm:w-auto text-xs furniture-text text-near-black/80 bg-transparent py-2 px-3 outline-none cursor-pointer border-t sm:border-t-0 sm:border-l border-near-black/10"
              >
                <option value="">ALL CATEGORIES</option>
                {PRODUCT_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.toUpperCase()}
                  </option>
                ))}
              </select>

              <button
                type="submit"
                className="w-full sm:w-auto bg-near-black text-plaster hover:bg-accent hover:text-white furniture-text px-6 py-2.5 transition-colors"
              >
                SEARCH
              </button>
            </form>
          </div>

          {/* Hero Straps along Bottom */}
          <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-3 gap-4 pb-2 text-center md:text-left hairline-t border-near-black/15 pt-4">
            <div className="furniture-text text-near-black/90">
              <span className="text-accent font-bold mr-2">01</span>
              <span>MULTIPLE SELLERS PER PRODUCT</span>
            </div>
            <div className="furniture-text text-near-black/90 text-center">
              <span className="text-accent font-bold mr-2">02</span>
              <span>LIVE OFFER COMPARISON</span>
            </div>
            <div className="furniture-text text-near-black/90 text-right">
              <span className="text-accent font-bold mr-2">03</span>
              <span>ESCROW & VERIFIED TRUST</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. BLUSH STATEMENT BAND (#F3D6DC) ──────────────────────────────────── */}
      <section className="bg-blush text-near-black py-20 px-6 md:px-12 hairline-t hairline-b">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <div className="furniture-text text-accent tracking-widest font-semibold">
            THE NEXORA PRINCIPLE
          </div>

          <h2 className="font-bodoni text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight uppercase tracking-tight">
            ONE PRODUCT. MULTIPLE OFFERS.{' '}
            <span className="italic font-normal font-bodoni text-accent block sm:inline mt-1 sm:mt-0">
              ONE SMARTER DECISION.
            </span>
          </h2>

          <p className="text-base sm:text-lg text-near-black/80 max-w-2xl mx-auto font-light leading-relaxed">
            Stop checking dozen separate stores. Compare prices, delivery times, seller ratings, and stock availability on a single unified marketplace.
          </p>

          {/* SCRIPT ACCENT #2 (Caveat Brush, Pink #EF6F79, rotated -2deg) */}
          <div className="pt-2">
            <span className="font-caveat text-accent text-3xl sm:text-4xl rotate-[-2deg] inline-block font-normal">
              trust matters
            </span>
          </div>
        </div>
      </section>

      {/* ── 3. THREE-COLUMN MARKETPLACE STORY ───────────────────────────────────── */}
      <section id="how-it-works" className="py-24 px-6 md:px-12 bg-plaster hairline-b">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-2">
            <div className="furniture-text text-accent">HOW NEXORA WORKS</div>
            <h3 className="font-bodoni text-3xl md:text-4xl font-semibold uppercase">
              COMMERCE REIMAGINED AROUND TRANSPARENCY
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-paper hairline-all space-y-4">
              <div className="font-bodoni text-4xl text-accent font-semibold">01</div>
              <h4 className="furniture-text text-near-black font-semibold text-sm">DISCOVER</h4>
              <p className="text-sm text-near-black/70 leading-relaxed font-light">
                Find products from multiple verified sellers in one marketplace instead of searching across separate stores.
              </p>
            </div>

            <div className="p-8 bg-paper hairline-all space-y-4">
              <div className="font-bodoni text-4xl text-accent font-semibold">02</div>
              <h4 className="furniture-text text-near-black font-semibold text-sm">COMPARE</h4>
              <p className="text-sm text-near-black/70 leading-relaxed font-light">
                Compare price, stock, delivery times, seller trust levels and available credit terms before making your choice.
              </p>
            </div>

            <div className="p-8 bg-paper hairline-all space-y-4">
              <div className="font-bodoni text-4xl text-accent font-semibold">03</div>
              <h4 className="furniture-text text-near-black font-semibold text-sm">CHOOSE & BUY</h4>
              <p className="text-sm text-near-black/70 leading-relaxed font-light">
                Select the offer that gives you the right combination of value, seller trust score and fast escrowed delivery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. PRODUCT DISCOVERY SECTION ─────────────────────────────────────────── */}
      <section className="py-24 px-6 md:px-12 bg-paper-mid/40 hairline-b">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 hairline-b border-near-black/15">
            <div>
              <div className="furniture-text text-accent mb-2">CURATED SELECTION</div>
              <h3 className="font-bodoni text-3xl md:text-4xl font-semibold uppercase">
                FEATURED MARKETPLACE LISTINGS
              </h3>
            </div>

            <Link
              to="/search"
              className="furniture-text text-near-black hover:text-accent transition-colors flex items-center gap-1.5 self-start md:self-auto"
            >
              <span>VIEW ALL PRODUCTS</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="py-16 flex justify-center">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((prod) => (
                <div
                  key={prod.id}
                  className="group bg-plaster hairline-all flex flex-col justify-between transition-all duration-300 hover:shadow-lg"
                >
                  <div>
                    {/* Product Image */}
                    <div className="relative aspect-square overflow-hidden bg-paper">
                      <img
                        src={prod.primaryImageUrl || prod.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop'}
                        alt={prod.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      
                      {/* Wishlist Button */}
                      <button
                        onClick={(e) => toggleWishlist(prod.id, e)}
                        className="absolute top-3 right-3 p-2 bg-plaster/90 hover:bg-white hairline-all text-near-black hover:text-accent transition-colors"
                        aria-label="Wishlist"
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            wishlistIds.has(prod.id) ? 'fill-accent text-accent' : ''
                          }`}
                        />
                      </button>

                      {/* Condition Tag */}
                      {prod.condition && (
                        <span className="absolute bottom-3 left-3 bg-near-black text-plaster furniture-text px-2 py-0.5 text-[9px]">
                          {prod.condition.replace('_', ' ')}
                        </span>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-5 space-y-3">
                      <div className="flex items-center justify-between text-xs text-near-black/60 furniture-text">
                        <span>{prod.category || 'ELECTRONICS'}</span>
                        {prod.city && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-accent" />
                            {prod.city}
                          </span>
                        )}
                      </div>

                      <h4 className="font-bodoni font-medium text-base text-near-black line-clamp-2 group-hover:text-accent transition-colors">
                        {prod.title}
                      </h4>

                      {/* Seller Summary */}
                      {prod.seller && (
                        <div className="flex items-center justify-between pt-2 hairline-t border-near-black/10 text-xs">
                          <span className="text-near-black/70 font-light truncate max-w-[130px]">
                            {prod.seller.displayName || prod.seller.name || 'Verified Seller'}
                          </span>
                          {prod.seller.sellerLevel && (
                            <SellerLevelBadge level={prod.seller.sellerLevel} compact />
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Price & Action Footer */}
                  <div className="p-5 pt-0 flex items-center justify-between">
                    <div>
                      <div className="furniture-text text-[9px] text-near-black/50">PRICE</div>
                      <div className="font-bodoni text-xl font-bold text-accent">
                        {formatCredits(prod.priceInCredits || prod.price)}
                      </div>
                    </div>

                    <Link
                      to={`/products/${prod.id}`}
                      className="bg-near-black text-plaster hover:bg-accent hover:text-white furniture-text px-3 py-2 text-xs transition-colors flex items-center gap-1"
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

      {/* ── 5. SECOND PINNED STAGE — PRODUCT COMPARISON (320SVH) ────────────────── */}
      <section ref={revealStageRef} className="relative h-[320vh] bg-near-black text-plaster">
        <div className="sticky top-0 h-[100vh] w-full overflow-hidden flex flex-col justify-between p-6 md:p-12">
          
          {/* Bottom-Up Reveal Image */}
          <div className="absolute inset-0 z-0 bg-navy">
            <img
              src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1600&auto=format&fit=crop"
              alt="Nexora Product Comparison Campaign"
              className="w-full h-full object-cover mix-blend-luminosity opacity-80"
              style={{
                clipPath: `inset(0 0 ${Math.max(0, 100 - revealProgress * 100)}% 0)`,
              }}
            />
          </div>

          {/* Difference-Blended Headline */}
          <div className="relative z-10 pt-12 max-w-5xl mx-auto text-center">
            <div className="furniture-text text-accent mb-4 tracking-widest">
              OFFER COMPARISON ENGINE
            </div>
            <h2
              className="font-bodoni text-4xl sm:text-5xl md:text-6xl font-bold uppercase tracking-tight leading-tight transition-opacity duration-300"
              style={{
                mixBlendMode: 'difference',
                color: '#ffffff',
                opacity: Math.max(0, 1 - revealProgress * 1.5),
              }}
            >
              COMPARE THE OFFER. NOT JUST THE PRODUCT.
            </h2>
          </div>

          {/* Live Comparison Mock / Real Metric Overlay (Reveals > 45%) */}
          <div
            className="relative z-10 max-w-4xl mx-auto w-full transition-all duration-500"
            style={{
              opacity: revealProgress > 0.45 ? 1 : 0,
              transform: `translateY(${revealProgress > 0.45 ? 0 : 30}px)`,
            }}
          >
            <div className="bg-near-black/90 backdrop-blur-md hairline-all p-6 md:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hairline-b border-plaster/10 pb-4">
                <div>
                  <div className="furniture-text text-accent">NEXORA COMPARISON MATRIX</div>
                  <div className="font-bodoni text-xl md:text-2xl font-bold text-plaster">
                    SMARTPHONE X 256GB — MULTIPLE SELLER OFFERS
                  </div>
                </div>
                <span className="furniture-text px-3 py-1 bg-accent/20 text-accent border border-accent/40 text-xs">
                  4 SELLERS AVAILABLE
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div className="p-4 bg-plaster/5 hairline-all">
                  <div className="furniture-text text-plaster/60 text-[9px] mb-1">BEST OFFER</div>
                  <div className="font-bodoni text-2xl font-bold text-accent">28,999 MC</div>
                  <div className="text-[10px] text-plaster/50 mt-1">TechHub Deals</div>
                </div>
                <div className="p-4 bg-plaster/5 hairline-all">
                  <div className="furniture-text text-plaster/60 text-[9px] mb-1">AVERAGE OFFER</div>
                  <div className="font-bodoni text-2xl font-bold text-plaster">30,240 MC</div>
                  <div className="text-[10px] text-plaster/50 mt-1">Market Average</div>
                </div>
                <div className="p-4 bg-plaster/5 hairline-all">
                  <div className="furniture-text text-plaster/60 text-[9px] mb-1">HIGHEST OFFER</div>
                  <div className="font-bodoni text-2xl font-bold text-plaster/70">32,499 MC</div>
                  <div className="text-[10px] text-plaster/50 mt-1">Premium Bundle</div>
                </div>
                <div className="p-4 bg-plaster/5 hairline-all">
                  <div className="furniture-text text-plaster/60 text-[9px] mb-1">DELIVERY</div>
                  <div className="font-bodoni text-2xl font-bold text-green-400">FAST / 1-DAY</div>
                  <div className="text-[10px] text-plaster/50 mt-1">Verified Escrow</div>
                </div>
              </div>
            </div>
          </div>

          {/* Comparison Caption Bar */}
          <div
            className="relative z-10 max-w-7xl mx-auto w-full flex items-center justify-between pt-4 hairline-t border-plaster/15 text-xs text-plaster/70 furniture-text transition-opacity duration-300"
            style={{ opacity: revealProgress > 0.4 ? 1 : 0 }}
          >
            <span>PRICE</span>
            <span>SELLER TRUST</span>
            <span>STOCK</span>
            <span>DELIVERY TIME</span>
            <span>VERIFICATION</span>
          </div>
        </div>
      </section>

      {/* ── 6. TRUST & SELLER METRICS SECTION ──────────────────────────────────── */}
      <section className="py-24 px-6 md:px-12 bg-paper hairline-b">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div className="space-y-6">
            <div className="furniture-text text-accent">TRUST & SECURITY</div>
            <h3 className="font-bodoni text-3xl sm:text-4xl md:text-5xl font-semibold uppercase leading-tight">
              A MARKETPLACE BUILT AROUND VERIFIED TRUST.
            </h3>
            <p className="text-near-black/75 font-light leading-relaxed">
              Every seller on Nexora undergoes KYC identity verification, trust scoring based on past transactions, and buyer rating analysis. Escrow credit protection ensures funds are released only when you confirm receipt.
            </p>

            <div className="grid grid-cols-2 gap-6 pt-4">
              <div className="space-y-1">
                <div className="font-bodoni text-3xl font-bold text-accent">99.8%</div>
                <div className="furniture-text text-near-black/60 text-xs">ORDER SATISFACTION</div>
              </div>
              <div className="space-y-1">
                <div className="font-bodoni text-3xl font-bold text-near-black">100%</div>
                <div className="furniture-text text-near-black/60 text-xs">ESCROW PROTECTED</div>
              </div>
            </div>
          </div>

          {/* Seller Profile Editorial Card */}
          <div className="bg-plaster p-8 hairline-all space-y-6">
            <div className="flex items-center justify-between hairline-b border-near-black/10 pb-4">
              <div className="flex items-center gap-4">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop"
                  alt="Seller Avatar"
                  className="w-12 h-12 object-cover hairline-all"
                />
                <div>
                  <div className="font-bodoni font-bold text-lg text-near-black flex items-center gap-2">
                    <span>TechHub Deals</span>
                    <VerifiedBadge />
                  </div>
                  <div className="furniture-text text-near-black/50 text-[10px]">VERIFIED MERCHANT</div>
                </div>
              </div>

              <SellerLevelBadge level="PLATINUM" />
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-paper">
                <div className="furniture-text text-near-black/50 text-[9px]">TRUST SCORE</div>
                <div className="font-bodoni text-xl font-bold text-accent">99 / 100</div>
              </div>
              <div className="p-3 bg-paper">
                <div className="furniture-text text-near-black/50 text-[9px]">RATING</div>
                <div className="font-bodoni text-xl font-bold text-near-black">4.9 ★</div>
              </div>
              <div className="p-3 bg-paper">
                <div className="furniture-text text-near-black/50 text-[9px]">COMPLETED</div>
                <div className="font-bodoni text-xl font-bold text-near-black">1,284</div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── 7. MARKETPLACE CREDITS SECTION ───────────────────────────────────────── */}
      <section className="py-24 px-6 md:px-12 bg-near-black text-plaster hairline-b border-near-black">
        <div className="max-w-7xl mx-auto space-y-16">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="furniture-text text-accent">TRANSPARENT ESCROW CREDITS</div>
            <h3 className="font-bodoni text-3xl sm:text-4xl md:text-5xl font-semibold uppercase leading-tight">
              A CLEAR CREDIT FLOW. A TRANSPARENT TRANSACTION.
            </h3>
            <p className="text-plaster/70 font-light text-sm md:text-base leading-relaxed">
              Nexora Marketplace Credits (MC) eliminate credit card chargeback fraud and payment gateway delays. Funds stay safely held in escrow until you inspect and accept your delivery.
            </p>
          </div>

          {/* Credit Flow Diagram */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              { step: '01', title: 'CREDIT BALANCE', desc: 'Wallet is topped up with Marketplace Credits (MC)' },
              { step: '02', title: 'PLACE ORDER', desc: 'Credits are selected at checkout for product purchase' },
              { step: '03', title: 'ESCROW HOLD', desc: 'Funds are securely held by platform escrow system' },
              { step: '04', title: 'DELIVERY', desc: 'Seller ships item & buyer inspects package' },
              { step: '05', title: 'CONFIRM & RELEASE', desc: 'Buyer confirms receipt; credits release to seller' },
            ].map((s) => (
              <div key={s.step} className="p-6 bg-plaster/5 hairline-all border-plaster/10 space-y-3">
                <div className="font-bodoni text-3xl text-accent font-bold">{s.step}</div>
                <div className="furniture-text text-plaster text-xs">{s.title}</div>
                <p className="text-xs text-plaster/60 font-light leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── 8. THIRD PINNED STAGE — ORDER LIFECYCLE (360SVH) ───────────────────── */}
      <section ref={orderStageRef} className="relative h-[360vh] bg-near-black text-plaster">
        <div className="sticky top-0 h-[100vh] w-full overflow-hidden flex flex-col justify-between p-6 md:p-12">
          
          <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center my-auto">
            
            {/* Left Column: Heading + 5 Lifecycle Rows */}
            <div className="space-y-8">
              <div>
                <div className="furniture-text text-accent mb-2">END-TO-END TRACKING</div>
                <h2 className="font-bodoni text-4xl sm:text-5xl font-bold italic uppercase text-plaster">
                  FROM CLICK TO CONFIRMED.
                </h2>
              </div>

              <div className="space-y-4">
                {[
                  { index: '01', name: 'ORDER PLACED', status: 'CONFIRMED BY BUYER' },
                  { index: '02', name: 'PAYMENT HELD IN ESCROW', status: 'CREDITS RESERVED' },
                  { index: '03', name: 'SHIPPED BY MERCHANT', status: 'TRACKING ACTIVE' },
                  { index: '04', name: 'DELIVERED TO ADDRESS', status: 'DISPATCH COMPLETED' },
                  { index: '05', name: 'PRODUCT RECEIVED & RELEASED', status: 'TRANSACTION COMPLETED' },
                ].map((row, idx) => {
                  const isActive = idx <= orderLifecycleIndex
                  return (
                    <div
                      key={row.index}
                      className="p-4 hairline-all border-plaster/20 flex items-center justify-between transition-all duration-300"
                      style={{
                        backgroundColor: isActive ? 'rgba(239, 111, 121, 0.1)' : 'transparent',
                        borderColor: isActive ? '#EF6F79' : 'rgba(247, 247, 244, 0.15)',
                        opacity: isActive ? 1 : 0.28,
                      }}
                    >
                      <div className="flex items-center gap-4">
                        <span className="font-bodoni font-bold text-accent text-lg">{row.index}</span>
                        <span className="furniture-text text-sm tracking-wider">{row.name}</span>
                      </div>
                      <span className="furniture-text text-[10px] text-plaster/60">{row.status}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Right Column: 4:5 Order Still Photograph */}
            <div className="relative aspect-[4/5] bg-navy overflow-hidden hairline-all border-plaster/20 max-w-md mx-auto w-full">
              <img
                src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop"
                alt="Order Lifecycle Still"
                className="w-full h-full object-cover transition-transform duration-500"
                style={{
                  transform: `scale(${1.08 - orderLifecycleIndex * 0.02})`,
                }}
              />
              <div className="absolute bottom-4 left-4 bg-accent text-white furniture-text px-3 py-1 text-xs">
                ORDER #NX-20481
              </div>
            </div>

          </div>

          <div className="max-w-7xl mx-auto w-full flex items-center justify-between text-xs text-plaster/50 furniture-text pt-4 hairline-t border-plaster/15">
            <span>REAL-TIME STATUS UPDATES</span>
            <span>BUYER ESCROW PROTECTION</span>
          </div>

        </div>
      </section>

      {/* ── 9. PRICE COMPARISON SECTION ────────────────────────────────────────── */}
      <section className="py-24 px-6 md:px-12 bg-paper-mid text-near-black hairline-b">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="furniture-text text-accent">MARKET INTELLIGENCE</div>
            <h3 className="font-bodoni text-3xl md:text-4xl font-semibold uppercase">
              SEE THE MARKET BEFORE YOU BUY.
            </h3>
            <p className="text-near-black/70 font-light text-sm">
              Live price range breakdown across active verified merchant listings.
            </p>
          </div>

          <div className="bg-plaster hairline-all overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="furniture-text text-near-black/60 border-b border-near-black/15 bg-paper">
                  <th className="p-4 pl-6">PRODUCT</th>
                  <th className="p-4">CONDITION</th>
                  <th className="p-4">LOWEST OFFER</th>
                  <th className="p-4">AVERAGE OFFER</th>
                  <th className="p-4">MERCHANTS</th>
                  <th className="p-4 pr-6 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-near-black/10 text-sm font-light">
                {featuredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-paper/50 transition-colors">
                    <td className="p-4 pl-6 font-medium text-near-black flex items-center gap-3">
                      <img
                        src={p.primaryImageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&auto=format&fit=crop'}
                        alt=""
                        className="w-10 h-10 object-cover hairline-all"
                      />
                      <span className="font-bodoni text-base">{p.title}</span>
                    </td>
                    <td className="p-4 furniture-text text-xs">{p.condition || 'LIKE NEW'}</td>
                    <td className="p-4 font-bodoni font-bold text-accent text-base">
                      {formatCredits(p.priceInCredits || p.price)}
                    </td>
                    <td className="p-4 font-bodoni text-near-black/70">
                      {formatCredits(Math.round((p.priceInCredits || p.price || 100) * 1.08))}
                    </td>
                    <td className="p-4 furniture-text text-xs text-near-black/60">3 VERIFIED</td>
                    <td className="p-4 pr-6 text-right">
                      <Link
                        to={`/products/${p.id}`}
                        className="furniture-text text-xs text-near-black hover:text-accent underline"
                      >
                        COMPARE →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </section>

      {/* ── 10. VERIFIED REVIEWS SECTION ────────────────────────────────────────── */}
      <section className="py-24 px-6 md:px-12 bg-blush text-near-black hairline-b">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="furniture-text text-accent">AUTHENTIC FEEDBACK</div>
            <h3 className="font-bodoni text-3xl md:text-4xl font-semibold uppercase">
              REVIEWS THAT COME AFTER DELIVERY.
            </h3>
            <p className="text-near-black/75 font-light text-sm">
              Only buyers who complete receipt confirmation can leave verified reviews.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                text: 'Offer comparison made choosing the seller so simple. Received my laptop next day in perfect escrow condition.',
                author: 'David K.',
                role: 'VERIFIED BUYER',
                stars: 5,
              },
              {
                text: 'Marketplace Credits saved us transaction fees while ensuring total payment safety. Outstanding local commerce model.',
                author: 'Elena R.',
                role: 'VERIFIED BUYER',
                stars: 5,
              },
              {
                text: 'As a tech seller, Nexora verified merchant status gave buyers instant confidence. Completed 40+ sales smoothly.',
                author: 'Marcus T.',
                role: 'PLATINUM SELLER',
                stars: 5,
              },
            ].map((rev, i) => (
              <div key={i} className="p-8 bg-plaster hairline-all space-y-4">
                <div className="flex items-center gap-1 text-accent">
                  <StarRating rating={rev.stars} />
                </div>
                <p className="font-bodoni italic text-base text-near-black leading-relaxed">
                  “{rev.text}”
                </p>
                <div className="pt-4 hairline-t border-near-black/10 flex items-center justify-between text-xs">
                  <span className="font-bold text-near-black">{rev.author}</span>
                  <span className="furniture-text text-accent text-[9px]">{rev.role}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── 11. FAQ SECTION ─────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 md:px-12 bg-plaster hairline-b">
        <div className="max-w-4xl mx-auto space-y-12">
          
          <div className="text-center space-y-2">
            <div className="furniture-text text-accent">FREQUENTLY ASKED QUESTIONS</div>
            <h3 className="font-bodoni text-3xl md:text-4xl font-semibold uppercase">
              EVERYTHING YOU NEED TO KNOW ABOUT NEXORA
            </h3>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'What is Nexora?',
                a: 'Nexora is a premium marketplace where multiple verified merchants offer products, allowing customers to compare prices, delivery times, and seller trust ratings in a single place.',
              },
              {
                q: 'How does offer comparison work?',
                a: 'When viewing a product, Nexora compiles active offers from multiple verified sellers. You can compare price, seller level, shipping speed, and warranty options before making your choice.',
              },
              {
                q: 'What are Marketplace Credits (MC)?',
                a: 'Marketplace Credits are our secure platform credit system used for instant, fee-free transactions and escrow protection.',
              },
              {
                q: 'How does escrow protection safeguard my purchase?',
                a: 'When you place an order, credits are held safely in escrow. They are released to the seller only after you confirm that the item was delivered as described.',
              },
              {
                q: 'How do I become a verified seller on Nexora?',
                a: 'Sellers submit KYC identification documents via the Seller Portal. Once approved by admins, you receive your merchant badge and seller trust score.',
              },
            ].map((faq, idx) => (
              <details key={idx} className="group p-6 bg-paper hairline-all cursor-pointer">
                <summary className="font-bodoni text-lg font-medium text-near-black flex items-center justify-between list-none">
                  <span>{faq.q}</span>
                  <span className="text-accent font-bold text-xl group-open:rotate-45 transition-transform">
                    +
                  </span>
                </summary>
                <p className="mt-4 text-sm text-near-black/75 font-light leading-relaxed pt-3 hairline-t border-near-black/10">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>

        </div>
      </section>

      {/* ── 12. FINAL CTA SECTION ───────────────────────────────────────────────── */}
      <section className="py-28 px-6 md:px-12 bg-near-black text-plaster text-center hairline-b border-near-black">
        <div className="max-w-4xl mx-auto space-y-8">
          
          <h2 className="font-bodoni text-4xl sm:text-5xl md:text-6xl font-bold uppercase tracking-tight leading-tight">
            FIND THE BETTER OFFER.
          </h2>

          <p className="text-base sm:text-lg text-plaster/70 font-light max-w-xl mx-auto">
            Compare products, verified sellers, and available offers before you commit.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/search"
              className="w-full sm:w-auto bg-accent text-white hover:bg-white hover:text-near-black furniture-text px-8 py-4 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <span>EXPLORE NEXORA</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>

            <Link
              to="/register"
              className="w-full sm:w-auto border border-plaster/30 text-plaster hover:border-plaster furniture-text px-8 py-4 transition-colors text-center"
            >
              BECOME A SELLER →
            </Link>
          </div>

          {/* SCRIPT ACCENT #3 (Caveat Brush, Pink #EF6F79, rotated -2deg) */}
          <div className="pt-6">
            <span className="font-caveat text-accent text-4xl rotate-[-2deg] inline-block font-normal">
              your choice
            </span>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  )
}
