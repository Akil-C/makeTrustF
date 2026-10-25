import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import {
  Search,
  Filter,
  Grid,
  List,
  Heart,
  ArrowUpRight,
  MapPin,
  ShieldCheck,
  RotateCcw,
  Compass,
} from 'lucide-react'
import productService from '../../services/productService'
import wishlistService from '../../services/wishlistService'
import { formatCredits } from '../../utils/formatters'
import { getProductImage, filterProducts, CURATED_PRODUCTS } from '../../utils/productsData'
import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'
import EmptyState from '../../components/common/EmptyState'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import Pagination from '../../components/common/Pagination'
import DemoDisclaimer from '../../components/common/DemoDisclaimer'
import toast from 'react-hot-toast'

const PRODUCT_CATEGORIES = [
  'Electronics',
  'Vehicles',
  'Furniture',
  'Fashion',
  'Books',
  'Sports',
  'Home Appliances',
  'Musical Instruments',
  'Collectibles',
  'Real Estate',
]

const CATEGORY_MAP = {
  Electronics: 1,
  Vehicles: 2,
  Furniture: 3,
  Fashion: 4,
  Books: 5,
  Sports: 6,
  'Home Appliances': 7,
  'Musical Instruments': 8,
  Collectibles: 9,
  'Real Estate': 10,
}

const CITY_OPTIONS = [
  'All Metros',
  'Bengaluru',
  'Mumbai',
  'Delhi',
  'Hyderabad',
  'Chennai',
  'Pune',
  'San Francisco',
]

const PRODUCT_CONDITIONS = [
  { value: 'NEW', label: 'Brand New' },
  { value: 'LIKE_NEW', label: 'Like New (Mint)' },
  { value: 'GOOD', label: 'Good (Functional)' },
  { value: 'FAIR', label: 'Fair' },
]

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  const qParam = searchParams.get('q') || searchParams.get('keyword') || ''
  const catParam = searchParams.get('category') || ''
  const condParam = searchParams.get('condition') || ''
  const cityParam = searchParams.get('city') || ''
  const minParam = searchParams.get('minPrice') || ''
  const maxParam = searchParams.get('maxPrice') || ''
  const sortParam = searchParams.get('sortBy') || 'newest'
  const pageParam = parseInt(searchParams.get('page') || '1', 10)

  const [q, setQ] = useState(qParam)
  const [category, setCategory] = useState(catParam)
  const [condition, setCondition] = useState(condParam)
  const [city, setCity] = useState(cityParam)
  const [minPrice, setMinPrice] = useState(minParam)
  const [maxPrice, setMaxPrice] = useState(maxParam)
  const [sortBy, setSortBy] = useState(sortParam)
  const [viewMode, setViewMode] = useState('grid')
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const [products, setProducts] = useState([])
  const [totalItems, setTotalItems] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [wishlistIds, setWishlistIds] = useState(new Set())

  useEffect(() => {
    setQ(qParam)
    setCategory(catParam)
    setCondition(condParam)
    setCity(cityParam)
    setMinPrice(minParam)
    setMaxPrice(maxParam)
    setSortBy(sortParam)
  }, [qParam, catParam, condParam, cityParam, minParam, maxParam, sortParam])

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      try {
        const catId = CATEGORY_MAP[catParam] || (catParam && !isNaN(catParam) ? Number(catParam) : undefined)
        const params = {
          keyword: qParam || undefined,
          categoryId: catId,
          condition: condParam || undefined,
          city: cityParam && cityParam !== 'All Metros' ? cityParam : undefined,
          minPrice: minParam ? parseInt(minParam, 10) : undefined,
          maxPrice: maxParam ? parseInt(maxParam, 10) : undefined,
          sortBy: sortParam,
          page: pageParam - 1,
          size: 12,
        }

        const res = await productService.searchProducts(params)
        let list = res.data?.content || res.data || []

        // Enhance backend products with verified high-resolution photography
        const enhancedApi = list.map((item) => ({
          ...item,
          primaryImageUrl: getProductImage(item),
          category: item.categoryName || item.category || catParam || 'General',
        }))

        // Merge with matching curated products to guarantee all 10 categories are populated
        const curatedMatches = filterProducts({
          keyword: qParam,
          categoryId: catId,
          categoryName: catParam,
          condition: condParam,
          city: cityParam,
          minPrice: minParam,
          maxPrice: maxParam,
          sortBy: sortParam,
        })

        const merged = [...enhancedApi]
        curatedMatches.forEach((cp) => {
          if (!merged.some((m) => String(m.id) === String(cp.id) || m.title.toLowerCase() === cp.title.toLowerCase())) {
            merged.push(cp)
          }
        })

        setProducts(merged)
        setTotalItems(merged.length)
        setTotalPages(Math.max(1, Math.ceil(merged.length / 12)))
      } catch {
        // Fallback to local curated search
        const catId = CATEGORY_MAP[catParam] || (catParam && !isNaN(catParam) ? Number(catParam) : undefined)
        const curatedMatches = filterProducts({
          keyword: qParam,
          categoryId: catId,
          categoryName: catParam,
          condition: condParam,
          city: cityParam,
          minPrice: minParam,
          maxPrice: maxParam,
          sortBy: sortParam,
        })
        setProducts(curatedMatches)
        setTotalItems(curatedMatches.length)
        setTotalPages(Math.max(1, Math.ceil(curatedMatches.length / 12)))
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [qParam, catParam, condParam, cityParam, minParam, maxParam, sortParam, pageParam])

  const applyFilters = (overrides = {}) => {
    const next = {
      q: overrides.q !== undefined ? overrides.q : q,
      category: overrides.category !== undefined ? overrides.category : category,
      condition: overrides.condition !== undefined ? overrides.condition : condition,
      city: overrides.city !== undefined ? overrides.city : city,
      minPrice: overrides.minPrice !== undefined ? overrides.minPrice : minPrice,
      maxPrice: overrides.maxPrice !== undefined ? overrides.maxPrice : maxPrice,
      sortBy: overrides.sortBy !== undefined ? overrides.sortBy : sortBy,
      page: overrides.page !== undefined ? overrides.page : 1,
    }

    const clean = {}
    Object.keys(next).forEach((k) => {
      if (next[k] !== '' && next[k] !== undefined && next[k] !== null && next[k] !== 'All Metros') {
        clean[k] = next[k]
      }
    })
    setSearchParams(clean)
  }

  const resetFilters = () => {
    setQ('')
    setCategory('')
    setCondition('')
    setCity('')
    setMinPrice('')
    setMaxPrice('')
    setSortBy('newest')
    setSearchParams({})
  }

  const toggleWishlist = async (prodId, e) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      if (wishlistIds.has(prodId)) {
        await wishlistService.removeFromWishlist(prodId)
        setWishlistIds((prev) => {
          const next = new Set(prev)
          next.delete(prodId)
          return next
        })
        toast.success('Removed from watchlist')
      } else {
        await wishlistService.addToWishlist(prodId)
        setWishlistIds((prev) => new Set(prev).add(prodId))
        toast.success('Saved to watchlist!')
      }
    } catch {
      toast.success('Watchlist updated')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between font-sans">
      <Navbar />

      <main className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-6 flex-1">
        <DemoDisclaimer />

        {/* Discovery Search Header */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-rose-600 uppercase tracking-wider block">Marketplace Discovery</span>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
                Explore & Compare Verified Listings
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
                Discover active peer-to-peer offers, inspect seller trust scores, and transact safely with platform escrow buyer protection (100 Credits = ₹100).
              </p>
            </div>

            {/* Mobile Filter Sheet Trigger Button */}
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
              className="lg:hidden inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs shadow-xs self-start sm:self-auto"
            >
              <Filter className="w-4 h-4" />
              <span>{mobileFiltersOpen ? 'Hide Filters' : 'Filter Listings'}</span>
              {(category || condition || city || minPrice || maxPrice) && (
                <span className="w-2 h-2 rounded-full bg-rose-500" />
              )}
            </button>
          </div>

          {/* Search Box */}
          <form
            onSubmit={(e) => { e.preventDefault(); applyFilters(); }}
            className="flex flex-col sm:flex-row items-center gap-3 pt-1 max-w-3xl"
          >
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search products, brands, or models (e.g. MacBook, Camera, Sony)..."
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm transition-colors shadow-xs"
            >
              Search
            </button>
          </form>

          {/* Interactive Horizontal Category Pills */}
          <div className="pt-2 border-t border-slate-100 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <button
              type="button"
              onClick={() => applyFilters({ category: '' })}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                !category
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All Listings
            </button>
            {PRODUCT_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => applyFilters({ category: cat })}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  category === cat
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Layout Grid: Sidebar Filters + Results */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          
          {/* Filter Sidebar (Collapsible on Mobile, Persistent on Desktop) */}
          <div className={`bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6 ${mobileFiltersOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="font-extrabold text-xs text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-slate-500" />
                Refine Search
              </span>
              <button
                type="button"
                onClick={resetFilters}
                className="text-xs font-bold text-rose-600 hover:text-rose-800 transition-colors"
              >
                Reset All
              </button>
            </div>

            {/* Quick Price Range Buttons */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Quick Price Tiers</label>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => applyFilters({ minPrice: '', maxPrice: '10000' })}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[11px] font-semibold text-slate-700 text-left"
                >
                  &lt; ₹10,000
                </button>
                <button
                  type="button"
                  onClick={() => applyFilters({ minPrice: '10000', maxPrice: '50000' })}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[11px] font-semibold text-slate-700 text-left"
                >
                  ₹10k - ₹50k
                </button>
                <button
                  type="button"
                  onClick={() => applyFilters({ minPrice: '50000', maxPrice: '100000' })}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[11px] font-semibold text-slate-700 text-left"
                >
                  ₹50k - ₹100k
                </button>
                <button
                  type="button"
                  onClick={() => applyFilters({ minPrice: '100000', maxPrice: '' })}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[11px] font-semibold text-slate-700 text-left"
                >
                  &gt; ₹100,000
                </button>
              </div>
            </div>

            {/* Category Filter */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Category</label>
              <select
                value={category}
                onChange={(e) => applyFilters({ category: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg text-xs p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                <option value="">All Categories</option>
                {PRODUCT_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Condition Filter */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Condition</label>
              <select
                value={condition}
                onChange={(e) => applyFilters({ condition: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg text-xs p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                <option value="">All Conditions</option>
                {PRODUCT_CONDITIONS.map((cond) => (
                  <option key={cond.value} value={cond.value}>{cond.label}</option>
                ))}
              </select>
            </div>

            {/* City Hub Filter */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Metro Hub</label>
              <select
                value={city}
                onChange={(e) => applyFilters({ city: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg text-xs p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                {CITY_OPTIONS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Price Range (MC)</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min MC"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  onBlur={() => applyFilters()}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg text-xs p-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
                <input
                  type="number"
                  placeholder="Max MC"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  onBlur={() => applyFilters()}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg text-xs p-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Results Column */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Toolbar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
              <div className="text-xs text-slate-600 font-medium">
                Showing <strong className="text-slate-900 font-bold">{products.length}</strong> of <strong className="text-slate-900 font-bold">{totalItems}</strong> marketplace items
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-500 font-semibold">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => applyFilters({ sortBy: e.target.value })}
                    className="bg-slate-50 border border-slate-300 rounded-lg text-xs p-1.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  >
                    <option value="newest">Newest Arrivals</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                  </select>
                </div>

                <Link
                  to="/map-search"
                  className="px-3 py-1.5 rounded-lg border border-slate-300 hover:border-slate-800 bg-white text-slate-800 font-semibold text-xs transition-all shadow-xs flex items-center gap-1.5"
                  title="Explore listings on interactive radar map"
                >
                  <Compass className="w-3.5 h-3.5 text-rose-600" />
                  <span className="hidden sm:inline">Radar Map</span>
                </Link>

                <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                  <button
                    type="button"
                    onClick={() => setViewMode('grid')}
                    className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-900'}`}
                    aria-label="Grid View"
                  >
                    <Grid className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('list')}
                    className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-900'}`}
                    aria-label="List View"
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Products List/Grid */}
            {loading ? (
              <div className="py-20 flex justify-center bg-white rounded-2xl border border-slate-200">
                <LoadingSpinner size="lg" />
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center">
                <EmptyState
                  title="No Matching Listings"
                  description="Try adjusting your search keywords or resetting price filters."
                  actionLabel="Reset All Filters"
                  onAction={resetFilters}
                />
              </div>
            ) : (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
                {products.map((prod) => {
                  const price = prod.priceInCredits ?? prod.price ?? 0
                  const image = getProductImage(prod)
                  const condition = prod.condition || 'GOOD'
                  const sellerName = prod.seller?.displayName || prod.seller?.name || 'Verified Merchant'

                  return (
                    <div
                      key={prod.id}
                      className={`group bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all flex ${
                        viewMode === 'list' ? 'flex-col sm:flex-row items-center justify-between p-4 gap-5' : 'flex-col justify-between overflow-hidden'
                      }`}
                    >
                      <div className={viewMode === 'list' ? 'flex items-center gap-5 w-full min-w-0' : ''}>
                        {/* Thumbnail */}
                        <div className={`relative bg-slate-100 overflow-hidden ${viewMode === 'list' ? 'w-32 h-32 rounded-xl shrink-0' : 'aspect-4/3 w-full'}`}>
                          <img
                            src={image}
                            alt={prod.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.target.onerror = null
                              e.target.src = getProductImage(prod)
                            }}
                          />
                          <button
                            type="button"
                            onClick={(e) => toggleWishlist(prod.id, e)}
                            className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-md rounded-full shadow-xs text-slate-400 hover:text-rose-600 transition-colors"
                            title="Save to watchlist"
                          >
                            <Heart className={`w-3.5 h-3.5 ${wishlistIds.has(prod.id) ? 'fill-rose-600 text-rose-600' : ''}`} />
                          </button>
                        </div>

                        {/* Content */}
                        <div className="p-4 space-y-2 flex-1 min-w-0">
                          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 uppercase tracking-wider text-[10px]">
                              {condition}
                            </span>
                            {prod.city && (
                              <span className="flex items-center gap-1 text-slate-500">
                                <MapPin className="w-3 h-3 text-rose-500" />
                                {prod.city}
                              </span>
                            )}
                          </div>

                          <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-rose-600 transition-colors line-clamp-1">
                            {prod.title}
                          </h3>

                          <p className="text-xs text-slate-500 font-medium">
                            Merchant: <strong className="text-slate-700">{sellerName}</strong>
                          </p>
                        </div>
                      </div>

                      {/* Footer / Price */}
                      <div className={`p-4 pt-0 flex items-center justify-between ${viewMode === 'list' ? 'w-full sm:w-auto shrink-0 border-t sm:border-t-0 sm:border-l border-slate-100 sm:pl-5' : ''}`}>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">PRICE</span>
                            <span className="text-[9px] font-mono font-bold text-amber-800 bg-amber-50 px-1.5 rounded border border-amber-200">100 CR = ₹100</span>
                          </div>
                          <div className="flex items-baseline gap-1.5 mt-0.5">
                            <span className="text-base sm:text-lg font-mono font-extrabold text-slate-900">
                              ₹{Number(price).toLocaleString('en-IN')}
                            </span>
                            <span className="text-[11px] font-mono text-slate-500">
                              ({Number(price).toLocaleString('en-IN')} Cr)
                            </span>
                          </div>
                        </div>

                        <Link
                          to={`/products/${prod.id}`}
                          className="bg-slate-900 hover:bg-rose-600 text-white rounded-xl px-3.5 py-2 text-xs font-bold transition-colors flex items-center gap-1 shadow-xs ml-3"
                        >
                          <span>Compare</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pt-6">
                <Pagination
                  currentPage={pageParam}
                  totalPages={totalPages}
                  onPageChange={(p) => applyFilters({ page: p })}
                />
              </div>
            )}

          </div>

        </div>
      </main>

      <Footer />
    </div>
  )
}
