import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Heart, ShoppingBag, Trash2, TrendingDown, ArrowRight, ShieldCheck } from 'lucide-react'
import wishlistService from '../../services/wishlistService'
import { formatCredits } from '../../utils/formatters'
import { getProductImage } from '../../utils/productsData'
import DemoDisclaimer from '../../components/common/DemoDisclaimer'
import EmptyState from '../../components/common/EmptyState'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import toast from 'react-hot-toast'

export default function BuyerWishlist() {
  const [wishlist, setWishlist] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    async function loadWishlist() {
      setLoading(true)
      try {
        const res = await wishlistService.getWishlist()
        const items = Array.isArray(res.data) ? res.data : (res.data?.content || [])
        setWishlist(items)
      } catch {
        setWishlist([])
      } finally {
        setLoading(false)
      }
    }
    loadWishlist()
  }, [])

  const handleRemove = async (productId, e) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      await wishlistService.removeFromWishlist(productId)
      setWishlist((prev) => prev.filter((item) => (item.product?.id ?? item.productId ?? item.id) !== productId))
      toast.success('Removed from wishlist')
    } catch {
      setWishlist((prev) => prev.filter((item) => (item.product?.id ?? item.productId ?? item.id) !== productId))
      toast.success('Removed from wishlist')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16 font-sans">
      <DemoDisclaimer />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header Section */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Buyer Collection</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1 flex items-center gap-2.5">
              <Heart className="w-7 h-7 text-rose-600 fill-rose-600" />
              <span>Saved Watchlist</span>
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Items you are monitoring. Track live pricing movements and checkout instantly with escrow buyer protection.
            </p>
          </div>

          <div className="self-start md:self-auto px-4 py-2 bg-slate-100 rounded-xl text-xs font-bold text-slate-700 border border-slate-200">
            {wishlist.length} {wishlist.length === 1 ? 'Item Saved' : 'Items Saved'}
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl p-16 border border-slate-200 flex justify-center items-center">
            <LoadingSpinner size="lg" />
          </div>
        ) : wishlist.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 border border-slate-200 shadow-xs text-center">
            <EmptyState
              icon={Heart}
              title="Your Watchlist is Empty"
              description="Save items you like across the marketplace to track prices and buy when you're ready."
              actionLabel="Discover Products"
              onAction={() => navigate('/search')}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.map((item) => {
              const p = item.product || item
              const productId = p.id || item.productId
              const title = p.title || 'Marketplace Product'
              const price = p.priceInCredits ?? p.price ?? 0
              const image = getProductImage(p)
              const condition = p.condition || 'GOOD'
              const sellerName = p.seller?.displayName || p.sellerName || 'Verified Seller'

              return (
                <div
                  key={item.id || productId}
                  className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col hover:border-slate-300 hover:shadow-sm transition-all group"
                >
                  {/* Product Image & Badges */}
                  <div className="relative aspect-4/3 bg-slate-100 overflow-hidden">
                    <img
                      src={image}
                      alt={title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src = getProductImage(p)
                      }}
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-bold uppercase tracking-wider">
                        {condition}
                      </span>
                      {item.priceDrop && (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500 text-white text-[11px] font-bold flex items-center gap-1 shadow-xs">
                          <TrendingDown className="w-3 h-3" />
                          Price Drop
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={(e) => handleRemove(productId, e)}
                      title="Remove from watchlist"
                      className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-md text-slate-500 hover:text-rose-600 hover:bg-white shadow-xs transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Product Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <p className="text-xs text-slate-500 font-medium">Sold by {sellerName}</p>
                      <Link
                        to={`/products/${productId}`}
                        className="text-base font-bold text-slate-900 hover:text-rose-600 transition-colors line-clamp-2 mt-0.5"
                      >
                        {title}
                      </Link>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Agreed Price</span>
                        <span className="text-xl font-mono font-extrabold text-slate-900">{formatCredits(price)}</span>
                      </div>

                      <Link
                        to={`/checkout/${productId}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Escrow Buy</span>
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
