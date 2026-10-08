import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Heart, ShoppingBag, Trash2, TrendingDown, ArrowUpRight } from 'lucide-react'
import wishlistService from '../../services/wishlistService'
import { formatCredits } from '../../utils/formatters'
import DemoDisclaimer from '../../components/common/DemoDisclaimer'
import EmptyState from '../../components/common/EmptyState'
import toast from 'react-hot-toast'

const MOCK_WISHLIST = [
  {
    id: 'w1',
    productId: '1',
    title: 'MacBook Air M2 16GB / 512GB Space Gray',
    price: 1100,
    originalPrice: 1250,
    priceDropped: true,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop',
    category: 'Electronics',
    condition: 'LIKE_NEW',
  },
  {
    id: 'w2',
    productId: '2',
    title: 'Specialized Allez Road Bike 54cm',
    price: 520,
    originalPrice: 520,
    priceDropped: false,
    image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&auto=format&fit=crop',
    category: 'Sports & Outdoors',
    condition: 'GOOD',
  },
  {
    id: 'w3',
    productId: '3',
    title: 'Sony Alpha a7 III Mirrorless Camera Body',
    price: 1350,
    originalPrice: 1450,
    priceDropped: true,
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop',
    category: 'Electronics',
    condition: 'GOOD',
  },
]

export default function BuyerWishlist() {
  const [wishlist, setWishlist] = useState(MOCK_WISHLIST)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    async function loadWishlist() {
      setLoading(true)
      try {
        const res = await wishlistService.getWishlist()
        if (res.data?.content?.length > 0) {
          setWishlist(res.data.content)
        }
      } catch {
        // Fallback mock
      } finally {
        setLoading(false)
      }
    }
    loadWishlist()
  }, [])

  const handleRemove = async (productId, e) => {
    e.preventDefault()
    try {
      await wishlistService.removeFromWishlist(productId)
      setWishlist((prev) => prev.filter((item) => item.productId !== productId && item.id !== productId))
      toast.success('Removed from wishlist')
    } catch {
      setWishlist((prev) => prev.filter((item) => item.productId !== productId && item.id !== productId))
      toast.success('Removed from wishlist')
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F7F4] text-[#070707] pb-16">
      <DemoDisclaimer />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#070707]/10 pb-6 gap-4">
          <div>
            <span className="furniture-subtitle text-xs text-[#EF6F79]">SAVED COLLECTIONS</span>
            <h1 className="font-serif text-3xl md:text-4xl text-[#070707] mt-1 tracking-tight flex items-center gap-3">
              <Heart className="w-7 h-7 text-[#EF6F79] fill-[#EF6F79]" /> Saved Wishlist
            </h1>
            <p className="text-xs text-[#070707]/60 mt-1 max-w-lg">
              Track items you're monitoring and receive immediate live price-drop alerts.
            </p>
          </div>

          <span className="furniture-subtitle text-[11px] bg-[#F1F1ED] text-[#070707] px-4 py-2 border border-[#070707]/10 self-start md:self-auto">
            {wishlist.length} {wishlist.length === 1 ? 'ITEM SAVED' : 'ITEMS SAVED'}
          </span>
        </div>

        {wishlist.length === 0 ? (
          <EmptyState
            title="Your wishlist is empty"
            description="Explore the Nexora marketplace and click the heart icon on any product offer to save it."
            actionLabel="Browse Marketplace"
            onAction={() => navigate('/search')}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {wishlist.map((item) => {
              const pId = item.productId || item.id
              const hasDrop = item.priceDropped || (item.originalPrice && item.originalPrice > item.price)
              const savings = hasDrop ? (item.originalPrice || item.price * 1.15) - item.price : 0

              return (
                <div
                  key={pId}
                  className="group bg-white border border-[#070707]/10 p-5 hover:border-[#070707]/30 transition-all duration-300 flex flex-col justify-between relative"
                >
                  <div>
                    <div className="relative aspect-[4/3] bg-[#F1F1ED] overflow-hidden mb-4 border border-[#070707]/5">
                      <img
                        src={item.image || item.images?.[0]}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                      {/* Price Drop Indicator Badge */}
                      {hasDrop && (
                        <div className="absolute top-3 left-3 bg-[#EF6F79] text-white text-[10px] font-mono uppercase font-bold px-2.5 py-1 tracking-wider flex items-center gap-1.5 shadow-sm">
                          <TrendingDown className="w-3.5 h-3.5" />
                          <span>PRICE DROP • SAVE {formatCredits(savings)}</span>
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={(e) => handleRemove(pId, e)}
                        className="absolute top-3 right-3 p-2 bg-[#070707]/80 hover:bg-[#EF6F79] text-white transition-colors"
                        title="Remove from wishlist"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-[#070707]/60 mb-2 font-mono uppercase tracking-wider">
                      <span className="text-[#EF6F79] font-semibold">{item.category}</span>
                      <span>{item.condition?.replace('_', ' ')}</span>
                    </div>

                    <h3 className="font-serif text-lg text-[#070707] group-hover:text-[#EF6F79] transition-colors line-clamp-2 leading-snug">
                      {item.title}
                    </h3>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#070707]/10">
                    <div className="flex items-baseline justify-between mb-4">
                      <div>
                        <span className="text-2xl font-bold font-mono text-[#070707]">{formatCredits(item.price)}</span>
                        {hasDrop && (
                          <span className="text-xs font-mono text-[#070707]/40 line-through ml-2">
                            {formatCredits(item.originalPrice || item.price + savings)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <Link
                        to={`/products/${pId}`}
                        className="py-3 bg-[#F1F1ED] hover:bg-[#E4E5E0] text-[#070707] furniture-subtitle text-center border border-[#070707]/10 transition-colors flex items-center justify-center gap-1"
                      >
                        <span>VIEW DETAILS</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>

                      <button
                        type="button"
                        onClick={() => navigate(`/checkout/${pId}`)}
                        className="py-3 bg-[#070707] hover:bg-[#EF6F79] text-white furniture-subtitle transition-colors flex items-center justify-center gap-1.5"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" /> BUY NOW
                      </button>
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
