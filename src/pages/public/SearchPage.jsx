import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import {
  Search,
  Filter,
  Grid,
  List,
  SlidersHorizontal,
  X,
  MapPin,
  Heart,
  Star,
  Sparkles,
  ArrowUpDown,
  RefreshCw,
  ArrowUpRight,
  Sliders,
} from 'lucide-react'
import productService from '../../services/productService'
import wishlistService from '../../services/wishlistService'
import { PRODUCT_CATEGORIES, PRODUCT_CONDITIONS } from '../../utils/constants'
import { formatCredits } from '../../utils/formatters'
import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'
import SellerLevelBadge from '../../components/common/SellerLevelBadge'
import Pagination from '../../components/common/Pagination'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import EmptyState from '../../components/common/EmptyState'
import DemoDisclaimer from '../../components/common/DemoDisclaimer'
import toast from 'react-hot-toast'

const MOCK_SEARCH_RESULTS = [
  {
    id: 1,
    title: 'iPhone 14 Pro 128GB Deep Purple — Unlocked',
    priceInCredits: 750,
    category: 'Electronics',
    condition: 'LIKE_NEW',
    description: 'Flawless condition, always kept in case with screen protector. Battery health 92%. Includes original box and fast charger.',
    primaryImageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop',
    city: 'Downtown',
    distance: 2.3,
    createdAt: '2026-10-04T10:00:00Z',
    seller: { id: 101, displayName: 'TechHub Deals', sellerLevel: 'PLATINUM', averageRating: 4.9, trustScore: 99 },
  },
  {
    id: 2,
    title: 'Sony Alpha a7 III Mirrorless Camera + 28-70mm Lens',
    priceInCredits: 1350,
    category: 'Electronics',
    condition: 'GOOD',
    description: 'Low shutter count under 12k. Shipped with 2 extra batteries and dual charger.',
    primaryImageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop',
    city: 'North Side',
    distance: 4.1,
    createdAt: '2026-10-03T15:30:00Z',
    seller: { id: 106, displayName: 'Lens Craft', sellerLevel: 'GOLD', averageRating: 4.8, trustScore: 97 },
  },
  {
    id: 3,
    title: 'Trek Marlin 7 Mountain Bike Large Frame 29" Wheels',
    priceInCredits: 620,
    category: 'Sports & Outdoors',
    condition: 'GOOD',
    description: 'Recently serviced hydraulic brakes and Shimano 1x10 drivetrain.',
    primaryImageUrl: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&auto=format&fit=crop',
    city: 'East End',
    distance: 1.8,
    createdAt: '2026-10-05T08:15:00Z',
    seller: { id: 105, displayName: 'Alex Rivera', sellerLevel: 'SILVER', averageRating: 4.7, trustScore: 94 },
  },
  {
    id: 4,
    title: 'Modern Velvet Sofa 3-Seater Emerald Green',
    priceInCredits: 480,
    category: 'Furniture',
    condition: 'LIKE_NEW',
    description: 'Only 6 months old. Moving out of state. Non-smoking, pet-free home.',
    primaryImageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop',
    city: 'South Suburbs',
    distance: 5.5,
    createdAt: '2026-10-02T12:00:00Z',
    seller: { id: 104, displayName: 'Office Upgrade Co.', sellerLevel: 'PLATINUM', averageRating: 5.0, trustScore: 100 },
  },
]

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  // State from URL
  const queryParam = searchParams.get('q') || ''
  const categoryParam = searchParams.get('category') || ''
  const minPriceParam = searchParams.get('minPrice') || ''
  const maxPriceParam = searchParams.get('maxPrice') || ''
  const conditionParam = searchParams.get('condition') || ''
  const distanceParam = searchParams.get('distance') || '25'
  const sortByParam = searchParams.get('sortBy') || 'newest'
  const pageParam = parseInt(searchParams.get('page') || '0', 10)

  // Local Form Controls
  const [q, setQ] = useState(queryParam)
  const [category, setCategory] = useState(categoryParam)
  const [minPrice, setMinPrice] = useState(minPriceParam)
  const [maxPrice, setMaxPrice] = useState(maxPriceParam)
  const [condition, setCondition] = useState(conditionParam)
  const [maxDistance, setMaxDistance] = useState(distanceParam)
  const [sortBy, setSortBy] = useState(sortByParam)
  const [viewMode, setViewMode] = useState('grid') // 'grid' | 'list'
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  // Data State
  const [products, setProducts] = useState([])
  const [totalItems, setTotalItems] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [wishlistIds, setWishlistIds] = useState(new Set())

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const res = await productService.searchProducts({
        q: queryParam,
        category: categoryParam,
        minPrice: minPriceParam || undefined,
        maxPrice: maxPriceParam || undefined,
        condition: conditionParam || undefined,
        radius: distanceParam || undefined,
        sortBy: sortByParam,
        page: pageParam,
        size: 12,
      })

      if (res.data && res.data.content) {
        setProducts(res.data.content)
        setTotalItems(res.data.totalElements || res.data.content.length)
        setTotalPages(res.data.totalPages || 1)
      } else {
        throw new Error('Empty API response')
      }
    } catch {
      // Fallback mock filtering
      let filtered = [...MOCK_SEARCH_RESULTS]
      if (queryParam) {
        filtered = filtered.filter((p) =>
          p.title.toLowerCase().includes(queryParam.toLowerCase()) ||
          p.description.toLowerCase().includes(queryParam.toLowerCase())
        )
      }
      if (categoryParam) {
        filtered = filtered.filter((p) => p.category === categoryParam)
      }
      if (conditionParam) {
        filtered = filtered.filter((p) => p.condition === conditionParam)
      }
      if (minPriceParam) {
        filtered = filtered.filter((p) => (p.priceInCredits || p.price) >= Number(minPriceParam))
      }
      if (maxPriceParam) {
        filtered = filtered.filter((p) => (p.priceInCredits || p.price) <= Number(maxPriceParam))
      }

      setProducts(filtered)
      setTotalItems(filtered.length)
      setTotalPages(1)
    } finally {
      setLoading(false)
    }
  }, [queryParam, categoryParam, minPriceParam, maxPriceParam, conditionParam, distanceParam, sortByParam, pageParam])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  useEffect(() => {
    setQ(queryParam)
    setCategory(categoryParam)
    setMinPrice(minPriceParam)
    setMaxPrice(maxPriceParam)
    setCondition(conditionParam)
    setMaxDistance(distanceParam)
    setSortBy(sortByParam)
  }, [queryParam, categoryParam, minPriceParam, maxPriceParam, conditionParam, distanceParam, sortByParam])

  const applyFilters = (newParams = {}) => {
    const params = new URLSearchParams()
    const nextQ = newParams.q !== undefined ? newParams.q : q
    const nextCat = newParams.category !== undefined ? newParams.category : category
    const nextMin = newParams.minPrice !== undefined ? newParams.minPrice : minPrice
    const nextMax = newParams.maxPrice !== undefined ? newParams.maxPrice : maxPrice
    const nextCond = newParams.condition !== undefined ? newParams.condition : condition
    const nextDist = newParams.distance !== undefined ? newParams.distance : maxDistance
    const nextSort = newParams.sortBy !== undefined ? newParams.sortBy : sortBy

    if (nextQ) params.set('q', nextQ)
    if (nextCat) params.set('category', nextCat)
    if (nextMin) params.set('minPrice', nextMin)
    if (nextMax) params.set('maxPrice', nextMax)
    if (nextCond) params.set('condition', nextCond)
    if (nextDist) params.set('distance', nextDist)
    if (nextSort) params.set('sortBy', nextSort)
    params.set('page', '0')

    setSearchParams(params)
    setShowMobileFilters(false)
  }

  const resetFilters = () => {
    setQ('')
    setCategory('')
    setMinPrice('')
    setMaxPrice('')
    setCondition('')
    setMaxDistance('25')
    setSortBy('newest')
    setSearchParams(new URLSearchParams())
    setShowMobileFilters(false)
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

  return (
    <div className="min-h-screen bg-plaster text-near-black flex flex-col justify-between">
      <Navbar />

      <main className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
        
        {/* Editorial Search Header */}
        <div className="space-y-4 text-center md:text-left hairline-b border-near-black/15 pb-8">
          <div className="furniture-text text-accent">MARKETPLACE DISCOVERY</div>
          <h1 className="font-bodoni text-3xl sm:text-4xl md:text-5xl font-semibold uppercase tracking-tight">
            DISCOVER & COMPARE PRODUCTS
          </h1>
          <p className="text-xs sm:text-sm text-near-black/60 font-light max-w-2xl">
            Browse verified marketplace listings, compare merchant offers, and find the best value for your credits.
          </p>

          {/* Top Search Controls Bar */}
          <form
            onSubmit={(e) => { e.preventDefault(); applyFilters(); }}
            className="pt-4 flex flex-col sm:flex-row items-center gap-2 max-w-3xl"
          >
            <div className="relative flex-1 w-full flex items-center pl-3 bg-paper hairline-all">
              <Search className="w-4 h-4 text-near-black/40 shrink-0" />
              <input
                type="text"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by keywords..."
                className="w-full px-3 py-2.5 text-sm text-near-black bg-transparent outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto bg-near-black text-plaster hover:bg-accent hover:text-white furniture-text px-6 py-2.5 transition-colors"
            >
              SEARCH
            </button>
          </form>
        </div>

        {/* Layout Grid: Sidebar Filters + Results */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block bg-paper p-6 hairline-all space-y-6">
            <div className="flex items-center justify-between hairline-b border-near-black/10 pb-3">
              <span className="furniture-text font-bold text-near-black">FILTERS</span>
              <button
                onClick={resetFilters}
                className="furniture-text text-[10px] text-accent hover:underline"
              >
                RESET ALL
              </button>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <label className="furniture-text text-[10px] text-near-black/60 block">CATEGORY</label>
              <select
                value={category}
                onChange={(e) => applyFilters({ category: e.target.value })}
                className="w-full bg-plaster border border-near-black/20 text-xs p-2.5 text-near-black outline-none"
              >
                <option value="">ALL CATEGORIES</option>
                {PRODUCT_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat.toUpperCase()}</option>
                ))}
              </select>
            </div>

            {/* Condition Filter */}
            <div className="space-y-2">
              <label className="furniture-text text-[10px] text-near-black/60 block">CONDITION</label>
              <select
                value={condition}
                onChange={(e) => applyFilters({ condition: e.target.value })}
                className="w-full bg-plaster border border-near-black/20 text-xs p-2.5 text-near-black outline-none"
              >
                <option value="">ALL CONDITIONS</option>
                {PRODUCT_CONDITIONS.map((cond) => (
                  <option key={cond.value} value={cond.value}>{cond.label.toUpperCase()}</option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div className="space-y-2">
              <label className="furniture-text text-[10px] text-near-black/60 block">PRICE RANGE (MC)</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  onBlur={() => applyFilters()}
                  className="w-full bg-plaster border border-near-black/20 text-xs p-2 text-near-black outline-none"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  onBlur={() => applyFilters()}
                  className="w-full bg-plaster border border-near-black/20 text-xs p-2 text-near-black outline-none"
                />
              </div>
            </div>
          </div>

          {/* Results Column */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* View Mode & Sort Bar */}
            <div className="bg-paper p-4 hairline-all flex flex-wrap items-center justify-between gap-4">
              <div className="furniture-text text-xs text-near-black/70">
                SHOWING <span className="font-bold text-accent">{products.length}</span> OF <span className="font-bold text-near-black">{totalItems}</span> PRODUCTS
              </div>

              <div className="flex items-center gap-4">
                {/* Sort Dropdown */}
                <div className="flex items-center gap-2">
                  <span className="furniture-text text-[10px] text-near-black/60">SORT BY:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => applyFilters({ sortBy: e.target.value })}
                    className="bg-plaster border border-near-black/20 text-xs p-1.5 text-near-black outline-none"
                  >
                    <option value="newest">NEWEST ARRIVALS</option>
                    <option value="price_asc">PRICE: LOW TO HIGH</option>
                    <option value="price_desc">PRICE: HIGH TO LOW</option>
                  </select>
                </div>

                {/* View Toggle */}
                <div className="flex items-center border border-near-black/20 bg-plaster">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 ${viewMode === 'grid' ? 'bg-near-black text-white' : 'text-near-black/60'}`}
                    aria-label="Grid View"
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 ${viewMode === 'list' ? 'bg-near-black text-white' : 'text-near-black/60'}`}
                    aria-label="List View"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Products List/Grid */}
            {loading ? (
              <div className="py-20 flex justify-center">
                <LoadingSpinner size="lg" />
              </div>
            ) : products.length === 0 ? (
              <EmptyState
                title="NO PRODUCTS FOUND"
                description="Try adjusting your keywords or clearing selected filters."
                actionLabel="RESET ALL FILTERS"
                onAction={resetFilters}
              />
            ) : (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
                {products.map((prod) => (
                  <div
                    key={prod.id}
                    className={`group bg-paper hairline-all transition-all duration-300 hover:shadow-md flex ${
                      viewMode === 'list' ? 'flex-col sm:flex-row items-center justify-between p-4 gap-6' : 'flex-col justify-between'
                    }`}
                  >
                    <div className={viewMode === 'list' ? 'flex items-center gap-6 w-full' : ''}>
                      {/* Thumbnail */}
                      <div className={`relative bg-plaster overflow-hidden ${viewMode === 'list' ? 'w-32 h-32 shrink-0' : 'aspect-square w-full'}`}>
                        <img
                          src={prod.primaryImageUrl || prod.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop'}
                          alt={prod.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <button
                          onClick={(e) => toggleWishlist(prod.id, e)}
                          className="absolute top-2 right-2 p-1.5 bg-plaster/90 hover:bg-white hairline-all text-near-black hover:text-accent transition-colors"
                        >
                          <Heart className={`w-3.5 h-3.5 ${wishlistIds.has(prod.id) ? 'fill-accent text-accent' : ''}`} />
                        </button>
                      </div>

                      {/* Content */}
                      <div className="p-4 space-y-2 flex-1">
                        <div className="flex items-center justify-between text-[10px] furniture-text text-near-black/50">
                          <span>{prod.category || 'GENERAL'}</span>
                          {prod.city && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-accent" />
                              {prod.city}
                            </span>
                          )}
                        </div>

                        <h3 className="font-bodoni font-medium text-lg text-near-black group-hover:text-accent transition-colors line-clamp-1">
                          {prod.title}
                        </h3>

                        {prod.description && (
                          <p className="text-xs text-near-black/60 font-light line-clamp-2 leading-relaxed">
                            {prod.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Footer / Price */}
                    <div className={`p-4 pt-0 flex items-center justify-between ${viewMode === 'list' ? 'w-full sm:w-auto shrink-0 border-t sm:border-t-0 sm:border-l border-near-black/10 sm:pl-6' : ''}`}>
                      <div>
                        <div className="furniture-text text-[9px] text-near-black/50">PRICE</div>
                        <div className="font-bodoni text-xl font-bold text-accent">
                          {formatCredits(prod.priceInCredits || prod.price)}
                        </div>
                      </div>

                      <Link
                        to={`/products/${prod.id}`}
                        className="bg-near-black text-plaster hover:bg-accent hover:text-white furniture-text px-4 py-2 text-xs transition-colors flex items-center gap-1 ml-4"
                      >
                        <span>VIEW</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pt-8">
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
