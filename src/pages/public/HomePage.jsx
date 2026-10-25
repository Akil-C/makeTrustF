import { useState, useEffect } from 'react'
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
  Package,
  Truck,
  Coins,
  Check,
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
import { CURATED_PRODUCTS, getProductImage } from '../../utils/productsData'
import toast from 'react-hot-toast'

// Curated verified marketplace items showcasing rich multi-category catalog
const MOCK_FEATURED = CURATED_PRODUCTS.slice(0, 12)

// Comparison engine showcase datasets
const COMPARISON_DATASETS = [
  {
    id: 'macbook',
    title: 'Apple MacBook Pro 16" M3 Max',
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
    link: '/products/30001',
    offers: [
      { seller: 'TechHub Official', level: 'PLATINUM', trust: 99, price: 245000, speed: '1-Day Escrow Express', badge: 'Best Offer' },
      { seller: 'Silicon City Deals', level: 'GOLD', trust: 96, price: 248500, speed: '2-Day Tracked Delivery' },
      { seller: 'Metro Gadget Store', level: 'SILVER', trust: 92, price: 252000, speed: 'Local Verified Pickup' },
    ],
  },
  {
    id: 'sony',
    title: 'Sony WH-1000XM5 Wireless Headphones',
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    link: '/products/30003',
    offers: [
      { seller: 'AudioPhile Zone', level: 'PLATINUM', trust: 99, price: 24999, speed: 'Same-Day Dispatch', badge: 'Best Offer' },
      { seller: 'SoundScape Retail', level: 'GOLD', trust: 95, price: 26500, speed: '2-Day Escrow Express' },
      { seller: 'Acoustic Labs', level: 'BRONZE', trust: 90, price: 27200, speed: 'Tracked Courier' },
    ],
  },
  {
    id: 'piano',
    title: 'Roland FP-30X Digital Piano Bundle',
    category: 'Musical Instruments',
    image: 'https://images.unsplash.com/photo-1520523839898-507121c2014b?w=800&auto=format&fit=crop&q=80',
    link: '/products/30009',
    offers: [
      { seller: 'Harmony Musical Hub', level: 'PLATINUM', trust: 98, price: 68500, speed: 'Insured Freight Courier', badge: 'Best Offer' },
      { seller: 'Melody Vault India', level: 'GOLD', trust: 94, price: 71000, speed: '2-Day Delivery' },
      { seller: 'Classic Soundworks', level: 'SILVER', trust: 91, price: 73500, speed: 'Local Studio Pickup' },
    ],
  },
]

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [featuredProducts, setFeaturedProducts] = useState(MOCK_FEATURED)
  const [loading, setLoading] = useState(true)
  const [wishlistIds, setWishlistIds] = useState(new Set())
  const navigate = useNavigate()

  // Interactive Comparison Showcase State
  const [selectedComparisonIdx, setSelectedComparisonIdx] = useState(0)

  // Interactive Order Lifecycle State
  const [activeStep, setActiveStep] = useState(1)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // Auto-progress order lifecycle steps smoothly
  useEffect(() => {
    if (!isAutoPlaying) return
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev >= 4 ? 0 : prev + 1))
    }, 4000)
    return () => clearInterval(timer)
  }, [isAutoPlaying])

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
          // Merge with curated items to ensure minimum 12 products across multiple categories
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

  const currentComp = COMPARISON_DATASETS[selectedComparisonIdx]
  const bestOffer = currentComp.offers[0]
  const avgOffer = Math.round(currentComp.offers.reduce((acc, o) => acc + o.price, 0) / currentComp.offers.length)
  const maxOffer = currentComp.offers[currentComp.offers.length - 1].price

  return (
    <div className="min-h-screen bg-plaster text-near-black">
      <Navbar />

      {/* ── 1. MODERN HIGH-IMPACT HERO SECTION ─────────────────────────────────── */}
      <section className="relative min-h-[85vh] lg:min-h-[90vh] bg-plaster flex flex-col justify-between p-6 md:p-12 overflow-hidden border-b border-near-black/10">
        
        {/* Background Editorial Product Photography */}
        <div className="absolute inset-0 z-0 bg-paper overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1600&auto=format&fit=crop"
            alt="Nexora Editorial Commerce Campaign"
            className="w-full h-full object-cover mix-blend-multiply opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-plaster via-plaster/60 to-plaster/40" />
        </div>

        {/* Top Hero Heading & 1st Script Appearance */}
        <div className="relative z-10 pt-6 sm:pt-10 max-w-7xl mx-auto w-full text-center">
          
          {/* SCRIPT ACCENT #1 (Caveat Brush, Pink #EF6F79, rotated -1deg) */}
          <div className="mb-2">
            <span className="font-caveat text-accent text-2xl sm:text-3xl md:text-4xl inline-block drop-shadow-sm -rotate-1">
              compare better
            </span>
          </div>

          {/* Hero Enormous Editorial Wordmark */}
          <h1 className="font-bodoni font-bold tracking-tighter text-near-black uppercase whitespace-nowrap leading-none select-none text-[min(clamp(3.5rem,18vw,11rem),calc(90vw/(6*.60)))]">
            NEXORA
          </h1>

          <p className="furniture-text text-near-black/85 mt-4 tracking-widest max-w-xl mx-auto text-xs sm:text-sm">
            COMPARE SMARTER. BUY WITH CONFIDENCE. THE TRUST-FIRST MARKETPLACE.
          </p>

          {/* Quick Search Form inside Hero */}
          <form
            onSubmit={handleSearchSubmit}
            className="mt-8 max-w-2xl mx-auto bg-white p-2 flex flex-col sm:flex-row items-center gap-2 shadow-lg rounded-2xl border border-slate-200"
          >
            <div className="relative flex-1 w-full flex items-center pl-3">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, brands, verified sellers..."
                className="w-full px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 bg-transparent outline-none font-sans"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full sm:w-auto text-xs font-semibold text-slate-700 bg-slate-50 py-2.5 px-3 outline-none cursor-pointer border sm:border-0 border-slate-200 rounded-xl"
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
              className="w-full sm:w-auto bg-slate-900 text-white hover:bg-rose-600 font-bold text-xs px-6 py-3 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5" />
              <span>SEARCH</span>
            </button>
          </form>

          {/* Quick Category Discovery Pills */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto">
            {['Electronics', 'Vehicles', 'Furniture', 'Musical Instruments', 'Fashion', 'Collectibles'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => navigate(`/search?category=${encodeURIComponent(cat)}`)}
                className="text-[11px] font-semibold text-slate-700 hover:text-slate-950 bg-white/80 hover:bg-white px-3 py-1.5 rounded-full border border-slate-200/90 shadow-2xs transition-all hover:scale-105"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Hero Straps along Bottom */}
        <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-3 gap-4 pb-2 pt-8 text-center md:text-left border-t border-near-black/15">
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
            <span>ESCROW & VERIFIED TRUST (100 CR = ₹100)</span>
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
            <span className="font-caveat text-accent text-3xl sm:text-4xl -rotate-2 inline-block font-normal">
              trust matters
            </span>
          </div>
        </div>
      </section>

      {/* ── 3. THREE-COLUMN MARKETPLACE STORY ───────────────────────────────────── */}
      <section id="how-it-works" className="py-20 px-6 md:px-12 bg-plaster hairline-b">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-2">
            <div className="furniture-text text-accent">HOW NEXORA WORKS</div>
            <h3 className="font-bodoni text-3xl md:text-4xl font-semibold uppercase">
              COMMERCE REIMAGINED AROUND TRANSPARENCY
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-paper hairline-all space-y-4 rounded-xl shadow-xs hover:shadow-md transition-shadow">
              <div className="font-bodoni text-4xl text-accent font-semibold">01</div>
              <h4 className="furniture-text text-near-black font-semibold text-sm">DISCOVER</h4>
              <p className="text-sm text-near-black/70 leading-relaxed font-light">
                Find products from multiple verified sellers in one marketplace instead of searching across separate stores.
              </p>
            </div>

            <div className="p-8 bg-paper hairline-all space-y-4 rounded-xl shadow-xs hover:shadow-md transition-shadow">
              <div className="font-bodoni text-4xl text-accent font-semibold">02</div>
              <h4 className="furniture-text text-near-black font-semibold text-sm">COMPARE</h4>
              <p className="text-sm text-near-black/70 leading-relaxed font-light">
                Compare price, stock, delivery times, seller trust levels and available credit terms before making your choice.
              </p>
            </div>

            <div className="p-8 bg-paper hairline-all space-y-4 rounded-xl shadow-xs hover:shadow-md transition-shadow">
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
      <section className="py-20 px-6 md:px-12 bg-paper-mid/40 hairline-b">
        <div className="max-w-7xl mx-auto space-y-10">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 hairline-b border-near-black/15">
            <div>
              <div className="furniture-text text-accent mb-2">CURATED SELECTION</div>
              <h3 className="font-bodoni text-3xl md:text-4xl font-semibold uppercase">
                FEATURED MARKETPLACE LISTINGS
              </h3>
            </div>

            <Link
              to="/search"
              className="furniture-text text-near-black hover:text-accent transition-colors flex items-center gap-1.5 self-start md:self-auto font-semibold text-xs"
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
                  className="group bg-plaster hairline-all flex flex-col justify-between transition-all duration-300 hover:shadow-xl rounded-xl overflow-hidden"
                >
                  <div>
                    {/* Product Image */}
                    <div className="relative aspect-square overflow-hidden bg-paper">
                      <img
                        src={getProductImage(prod)}
                        alt={prod.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.target.onerror = null
                          e.target.src = getProductImage(prod)
                        }}
                      />
                      
                      {/* Wishlist Button */}
                      <button
                        onClick={(e) => toggleWishlist(prod.id, e)}
                        className="absolute top-3 right-3 p-2 bg-plaster/90 hover:bg-white hairline-all text-near-black hover:text-accent transition-colors rounded-lg shadow-xs"
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
                        <span className="absolute bottom-3 left-3 bg-near-black text-plaster furniture-text px-2 py-0.5 text-[9px] rounded">
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
                      <div className="furniture-text text-[9px] text-near-black/50">PRICE (100 CR = ₹100)</div>
                      <div className="font-bodoni text-xl font-bold text-accent">
                        {formatCredits(prod.priceInCredits || prod.price)}
                      </div>
                    </div>

                    <Link
                      to={`/products/${prod.id}`}
                      className="bg-near-black text-plaster hover:bg-accent hover:text-white furniture-text px-3 py-2 text-xs transition-colors flex items-center gap-1 rounded-lg"
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

      {/* ── 5. INTERACTIVE OFFER COMPARISON ENGINE ──────────────────────────────── */}
      <section className="py-20 px-6 md:px-12 bg-near-black text-plaster hairline-b border-near-black">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center max-w-4xl mx-auto space-y-3">
            <div className="furniture-text text-accent tracking-widest">
              OFFER COMPARISON ENGINE
            </div>
            <h2 className="font-bodoni text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-tight leading-tight">
              COMPARE THE OFFER. NOT JUST THE PRODUCT.
            </h2>
            <p className="text-sm sm:text-base text-plaster/70 font-light max-w-2xl mx-auto">
              Select an item to explore how Nexora consolidates multiple verified seller quotes, delivery speeds, and warranty options side-by-side.
            </p>
          </div>

          {/* Interactive Item Selector Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {COMPARISON_DATASETS.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedComparisonIdx(idx)}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${
                  selectedComparisonIdx === idx
                    ? 'bg-accent text-white shadow-lg ring-2 ring-accent/30'
                    : 'bg-plaster/10 text-plaster/70 hover:bg-plaster/20 hover:text-white'
                }`}
              >
                <span>{item.title.split('(')[0].trim()}</span>
              </button>
            ))}
          </div>

          {/* Main Comparison Matrix Display */}
          <div className="bg-near-black/90 backdrop-blur-md hairline-all border-plaster/20 p-6 md:p-8 rounded-2xl space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hairline-b border-plaster/10 pb-5">
              <div className="flex items-center gap-4">
                <img
                  src={currentComp.image}
                  alt={currentComp.title}
                  className="w-16 h-16 rounded-xl object-cover border border-plaster/20"
                />
                <div>
                  <div className="furniture-text text-accent text-xs">SELECTED PRODUCT MATRIX</div>
                  <h3 className="font-bodoni text-xl md:text-2xl font-bold text-plaster">
                    {currentComp.title}
                  </h3>
                </div>
              </div>
              <span className="furniture-text px-3 py-1.5 bg-accent/20 text-accent border border-accent/40 text-xs rounded-full">
                {currentComp.offers.length} VERIFIED SELLERS COMPETING
              </span>
            </div>

            {/* Price Overview Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="p-4 bg-plaster/5 hairline-all rounded-xl border border-plaster/10">
                <div className="furniture-text text-plaster/60 text-[9px] mb-1">BEST OFFER</div>
                <div className="font-bodoni text-2xl font-bold text-accent">₹{bestOffer.price.toLocaleString('en-IN')}</div>
                <div className="text-[10px] text-plaster/50 mt-1">{bestOffer.seller}</div>
              </div>
              <div className="p-4 bg-plaster/5 hairline-all rounded-xl border border-plaster/10">
                <div className="furniture-text text-plaster/60 text-[9px] mb-1">AVERAGE OFFER</div>
                <div className="font-bodoni text-2xl font-bold text-plaster">₹{avgOffer.toLocaleString('en-IN')}</div>
                <div className="text-[10px] text-plaster/50 mt-1">Market Benchmark</div>
              </div>
              <div className="p-4 bg-plaster/5 hairline-all rounded-xl border border-plaster/10">
                <div className="furniture-text text-plaster/60 text-[9px] mb-1">HIGHEST OFFER</div>
                <div className="font-bodoni text-2xl font-bold text-plaster/70">₹{maxOffer.toLocaleString('en-IN')}</div>
                <div className="text-[10px] text-plaster/50 mt-1">Full Service Bundle</div>
              </div>
              <div className="p-4 bg-plaster/5 hairline-all rounded-xl border border-plaster/10">
                <div className="furniture-text text-plaster/60 text-[9px] mb-1">ESCROW SAFETY</div>
                <div className="font-bodoni text-2xl font-bold text-emerald-400">100% PROTECTED</div>
                <div className="text-[10px] text-plaster/50 mt-1">Funds Released on Delivery</div>
              </div>
            </div>

            {/* Competing Seller Offers Table */}
            <div className="space-y-3">
              <div className="furniture-text text-xs text-plaster/60 uppercase tracking-wider">
                Active Merchant Quotes for this listing:
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currentComp.offers.map((offer, oIdx) => (
                  <div
                    key={offer.seller}
                    className={`p-5 rounded-xl border transition-all relative ${
                      oIdx === 0
                        ? 'bg-accent/10 border-accent/60 shadow-lg'
                        : 'bg-plaster/5 border-plaster/10 hover:border-plaster/30'
                    }`}
                  >
                    {offer.badge && (
                      <span className="absolute -top-2.5 right-4 bg-accent text-white font-bold text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                        {offer.badge}
                      </span>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-plaster text-sm">{offer.seller}</span>
                      <SellerLevelBadge level={offer.level} compact />
                    </div>
                    <div className="mt-3 flex items-baseline gap-2">
                      <span className="font-bodoni text-2xl font-bold text-white">
                        ₹{offer.price.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs text-plaster/50 font-mono">
                        ({offer.price.toLocaleString('en-IN')} Credits)
                      </span>
                    </div>
                    <div className="mt-2 text-xs text-plaster/70 flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-accent" />
                      <span>{offer.speed}</span>
                    </div>
                    <div className="mt-4 pt-3 border-t border-plaster/10 flex items-center justify-between text-xs">
                      <span className="text-emerald-400 font-semibold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        Trust Score {offer.trust}%
                      </span>
                      <Link
                        to={currentComp.link}
                        className="furniture-text text-accent hover:underline text-[11px] font-bold"
                      >
                        VIEW OFFER →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ── 6. TRUST & SELLER METRICS SECTION ──────────────────────────────────── */}
      <section className="py-20 px-6 md:px-12 bg-paper hairline-b">
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
          <div className="bg-plaster p-8 hairline-all space-y-6 rounded-2xl shadow-xs">
            <div className="flex items-center justify-between hairline-b border-near-black/10 pb-4">
              <div className="flex items-center gap-4">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop"
                  alt="Seller Avatar"
                  className="w-12 h-12 object-cover hairline-all rounded-xl"
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
              <div className="p-3 bg-paper rounded-xl">
                <div className="furniture-text text-near-black/50 text-[9px]">TRUST SCORE</div>
                <div className="font-bodoni text-xl font-bold text-accent">99 / 100</div>
              </div>
              <div className="p-3 bg-paper rounded-xl">
                <div className="furniture-text text-near-black/50 text-[9px]">RATING</div>
                <div className="font-bodoni text-xl font-bold text-near-black">4.9 ★</div>
              </div>
              <div className="p-3 bg-paper rounded-xl">
                <div className="furniture-text text-near-black/50 text-[9px]">COMPLETED</div>
                <div className="font-bodoni text-xl font-bold text-near-black">1,284</div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── 7. MARKETPLACE CREDITS SECTION ───────────────────────────────────────── */}
      <section className="py-20 px-6 md:px-12 bg-near-black text-plaster hairline-b border-near-black">
        <div className="max-w-7xl mx-auto space-y-16">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="furniture-text text-accent">TRANSPARENT ESCROW CREDITS (100 CREDITS = ₹100)</div>
            <h3 className="font-bodoni text-3xl sm:text-4xl md:text-5xl font-semibold uppercase leading-tight">
              A CLEAR CREDIT FLOW. 100 CREDITS = ₹100.
            </h3>
            <p className="text-plaster/70 font-light text-sm md:text-base leading-relaxed">
              Nexora Marketplace Credits operate at a fixed 1:1 Rupee valuation where 100 Credits = ₹100 (1 Credit = ₹1 INR). Funds stay safely held in escrow until you inspect and accept your delivery.
            </p>
          </div>

          {/* Credit Flow Diagram */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              { step: '01', title: '100 CR = ₹100', desc: 'Wallet is topped up with 1:1 Rupee-equivalent Marketplace Credits' },
              { step: '02', title: 'PLACE ORDER', desc: 'Credits are selected at checkout for product purchase' },
              { step: '03', title: 'ESCROW HOLD', desc: 'Funds are securely held by platform escrow system' },
              { step: '04', title: 'DELIVERY', desc: 'Seller ships item & buyer inspects package' },
              { step: '05', title: 'CONFIRM & RELEASE', desc: 'Buyer confirms receipt; credits release to seller' },
            ].map((s) => (
              <div key={s.step} className="p-6 bg-plaster/5 hairline-all border-plaster/10 space-y-3 rounded-xl">
                <div className="font-bodoni text-3xl text-accent font-bold">{s.step}</div>
                <div className="furniture-text text-plaster text-xs">{s.title}</div>
                <p className="text-xs text-plaster/60 font-light leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── 8. INTERACTIVE ORDER LIFECYCLE WALKTHROUGH ─────────────────────────── */}
      <section className="py-20 px-6 md:px-12 bg-near-black text-plaster border-b border-near-black">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Column: Heading + Interactive Lifecycle Steps */}
            <div className="space-y-6">
              <div>
                <div className="furniture-text text-accent mb-2">END-TO-END TRACKING</div>
                <h2 className="font-bodoni text-4xl sm:text-5xl font-bold italic uppercase text-plaster">
                  FROM CLICK TO CONFIRMED.
                </h2>
                <p className="text-xs sm:text-sm text-plaster/60 mt-2 font-light">
                  Click through each step of the verified escrow transaction pipeline:
                </p>
              </div>

              <div className="space-y-3">
                {[
                  { index: '01', name: 'ORDER PLACED', status: 'CONFIRMED BY BUYER', desc: 'Buyer selects product & initiates escrow purchase. Credits are locked into Cold Escrow.' },
                  { index: '02', name: 'PAYMENT HELD IN ESCROW', status: 'CREDITS RESERVED', desc: 'Platform escrow vault protects 100% of the funds. Merchant is notified to prepare dispatch.' },
                  { index: '03', name: 'SHIPPED BY MERCHANT', status: 'TRACKING ACTIVE', desc: 'Merchant ships via verified tracked courier or coordinates in-person verified pickup.' },
                  { index: '04', name: 'DELIVERED TO ADDRESS', status: 'DISPATCH COMPLETED', desc: 'Buyer receives delivery, inspects item condition, and verifies all specifications match.' },
                  { index: '05', name: 'PRODUCT RECEIVED & RELEASED', status: 'TRANSACTION COMPLETED', desc: 'Buyer confirms delivery on Nexora. Escrow instantly disburses payment to merchant.' },
                ].map((row, idx) => {
                  const isActive = idx === activeStep
                  const isDone = idx < activeStep
                  return (
                    <div
                      key={row.index}
                      onClick={() => { setActiveStep(idx); setIsAutoPlaying(false); }}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        isActive
                          ? 'bg-accent/15 border-accent shadow-md ring-1 ring-accent/30'
                          : isDone
                          ? 'bg-plaster/5 border-emerald-500/30'
                          : 'bg-transparent border-plaster/10 opacity-40 hover:opacity-80'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className={`font-bodoni font-bold text-lg ${isActive ? 'text-accent' : isDone ? 'text-emerald-400' : 'text-plaster/50'}`}>
                            {row.index}
                          </span>
                          <span className="furniture-text text-sm tracking-wider font-semibold">{row.name}</span>
                        </div>
                        <span className={`furniture-text text-[10px] ${isActive ? 'text-accent' : isDone ? 'text-emerald-400' : 'text-plaster/50'}`}>
                          {row.status}
                        </span>
                      </div>
                      {isActive && (
                        <p className="mt-2.5 text-xs text-plaster/80 leading-relaxed font-light pl-7">
                          {row.desc}
                        </p>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Right Column: 4:5 Order Still Photograph */}
            <div className="relative aspect-[4/5] bg-navy overflow-hidden rounded-2xl border border-plaster/20 max-w-md mx-auto w-full shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop"
                alt="Order Lifecycle Still"
                className="w-full h-full object-cover transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
              <div className="absolute top-4 left-4 bg-accent text-white furniture-text px-3 py-1 text-xs rounded-full shadow-sm">
                ORDER #NX-20481
              </div>
              <div className="absolute bottom-5 left-5 right-5 p-4 bg-black/60 backdrop-blur-md rounded-xl border border-white/10 text-xs text-plaster">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-accent">Active Escrow Protection</span>
                  <span className="font-mono text-emerald-400">STATUS OK</span>
                </div>
                <div className="text-[11px] text-plaster/70">
                  Step {activeStep + 1} of 5: Verified Escrow Protocol Active
                </div>
              </div>
            </div>

          </div>

          <div className="w-full flex items-center justify-between text-xs text-plaster/50 furniture-text pt-4 border-t border-plaster/15">
            <span>REAL-TIME STATUS UPDATES</span>
            <span>BUYER ESCROW PROTECTION</span>
          </div>

        </div>
      </section>

      {/* ── 9. PRICE COMPARISON TABLE ────────────────────────────────────────── */}
      <section className="py-20 px-6 md:px-12 bg-paper-mid text-near-black hairline-b">
        <div className="max-w-7xl mx-auto space-y-10">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="furniture-text text-accent">MARKET INTELLIGENCE</div>
            <h3 className="font-bodoni text-3xl md:text-4xl font-semibold uppercase">
              SEE THE MARKET BEFORE YOU BUY.
            </h3>
            <p className="text-near-black/70 font-light text-sm">
              Live price range breakdown across active verified merchant listings.
            </p>
          </div>

          <div className="bg-plaster hairline-all overflow-x-auto rounded-xl shadow-xs">
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
                {featuredProducts.slice(0, 8).map((p) => (
                  <tr key={p.id} className="hover:bg-paper/50 transition-colors">
                    <td className="p-4 pl-6 font-medium text-near-black flex items-center gap-3">
                      <img
                        src={getProductImage(p)}
                        alt={p.title}
                        className="w-10 h-10 object-cover hairline-all rounded-lg shrink-0"
                        onError={(e) => {
                          e.target.onerror = null
                          e.target.src = getProductImage(p)
                        }}
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
                        className="furniture-text text-xs text-near-black hover:text-accent underline font-semibold"
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
      <section className="py-20 px-6 md:px-12 bg-blush text-near-black hairline-b">
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
              <div key={i} className="p-8 bg-plaster hairline-all space-y-4 rounded-xl shadow-xs">
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
      <section className="py-20 px-6 md:px-12 bg-plaster hairline-b">
        <div className="max-w-4xl mx-auto space-y-10">
          
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
                q: 'What is the conversion rate for Marketplace Credits?',
                a: 'Marketplace Credits operate at a fixed conversion rate of 100 Credits = ₹100 (1 Credit = ₹1 INR). Zero exchange markups, zero hidden processing fees.',
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
              <details key={idx} className="group p-6 bg-paper hairline-all rounded-xl cursor-pointer">
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
      <section className="py-24 px-6 md:px-12 bg-near-black text-plaster text-center hairline-b border-near-black">
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
              className="w-full sm:w-auto bg-accent text-white hover:bg-white hover:text-near-black furniture-text px-8 py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 font-bold text-xs"
            >
              <span>EXPLORE NEXORA</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>

            <Link
              to="/register"
              className="w-full sm:w-auto border border-plaster/30 text-plaster hover:border-plaster furniture-text px-8 py-4 rounded-xl transition-colors text-center font-bold text-xs"
            >
              BECOME A SELLER →
            </Link>
          </div>

          {/* SCRIPT ACCENT #3 (Caveat Brush, Pink #EF6F79, rotated -2deg) */}
          <div className="pt-4">
            <span className="font-caveat text-accent text-4xl -rotate-2 inline-block font-normal">
              your choice
            </span>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  )
}
