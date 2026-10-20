import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  ShieldCheck,
  Star,
  ShoppingBag,
  Clock,
  CheckCircle2,
  MessageSquare,
  Award,
  Package,
  Calendar,
  ArrowUpRight,
  MapPin,
  TrendingUp,
} from 'lucide-react'
import sellerService from '../../services/sellerService'
import reviewService from '../../services/reviewService'
import productService from '../../services/productService'
import { formatCredits, formatDate } from '../../utils/formatters'
import { getProductImage } from '../../utils/productsData'
import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'
import SellerLevelBadge from '../../components/common/SellerLevelBadge'
import VerifiedBadge from '../../components/common/VerifiedBadge'
import StarRating from '../../components/common/StarRating'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import DemoDisclaimer from '../../components/common/DemoDisclaimer'

const MOCK_PROFILE = {
  id: 2,
  displayName: 'TechHub Official',
  bio: 'Specializing in verified pre-owned electronics, Apple workstations, and professional camera equipment. 100% verified fulfillment.',
  profileImageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop',
  sellerLevel: 'PLATINUM',
  trustScore: 99,
  averageRating: 5.0,
  reviewCount: 24,
  completedOrders: 126,
  responseRate: 98,
  isVerified: true,
}

export default function SellerProfilePage() {
  const { id } = useParams()
  const [profile, setProfile] = useState(null)
  const [products, setProducts] = useState([])
  const [reviews, setReviews] = useState([])
  const [activeTab, setActiveTab] = useState('products')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      try {
        const [profRes, revRes, prodRes] = await Promise.allSettled([
          sellerService.getSellerProfile(id),
          reviewService.getSellerReviews(id),
          productService.getRecentProducts(12),
        ])

        if (profRes.status === 'fulfilled' && profRes.value.data) {
          setProfile(profRes.value.data)
        } else {
          setProfile(MOCK_PROFILE)
        }

        if (revRes.status === 'fulfilled' && revRes.value.data?.content) {
          setReviews(revRes.value.data.content)
        }

        if (prodRes.status === 'fulfilled') {
          const list = prodRes.value.data?.content || prodRes.value.data || []
          // Match seller id if present, otherwise show catalog items for the storefront
          const sellerItems = list.filter((item) => String(item.seller?.id || item.sellerId) === String(id))
          setProducts(sellerItems.length > 0 ? sellerItems : list.slice(0, 8))
        }
      } catch {
        setProfile(MOCK_PROFILE)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans">
        <Navbar />
        <div className="py-24 flex justify-center my-auto">
          <LoadingSpinner size="lg" />
        </div>
        <Footer />
      </div>
    )
  }

  const p = profile || MOCK_PROFILE

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between font-sans">
      <Navbar />

      <main className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-6 flex-1">
        <DemoDisclaimer />

        {/* Merchant Header Card */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-4 sm:gap-5">
              <img
                src={p.profileImageUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop'}
                alt=""
                className="w-20 h-20 rounded-2xl object-cover border border-slate-200 shadow-xs shrink-0"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {p.displayName || p.name || 'Verified Merchant'}
                  </h1>
                  {p.isVerified && <VerifiedBadge />}
                </div>
                <div className="text-xs text-slate-500 flex items-center gap-2">
                  <span className="flex items-center gap-1 font-semibold text-emerald-700">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Government KYC Verified
                  </span>
                  <span>•</span>
                  <span>{p.city || 'Bengaluru, India'}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <SellerLevelBadge level={p.sellerLevel || 'PLATINUM'} />
              <Link
                to={`/buyer/chat`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Message Store</span>
              </Link>
            </div>
          </div>

          <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
            {p.bio || 'Verified storefront on Nexora Marketplace. All orders insured by platform escrow vault protection.'}
          </p>

          {/* 4 Stats Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Trust Score</span>
              <span className="text-2xl font-mono font-extrabold text-emerald-700 mt-0.5 block">{p.trustScore || 99} / 100</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Completed Escrows</span>
              <span className="text-2xl font-mono font-extrabold text-slate-900 mt-0.5 block">{p.completedOrders || 126}</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Customer Rating</span>
              <span className="text-2xl font-mono font-extrabold text-slate-900 mt-0.5 block flex items-center gap-1">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                {(p.averageRating || 5.0).toFixed(1)}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Response Velocity</span>
              <span className="text-2xl font-mono font-extrabold text-slate-900 mt-0.5 block">{p.responseRate || 98}%</span>
            </div>
          </div>
        </div>

        {/* Tabs & Content */}
        <div className="space-y-4">
          <div className="flex border-b border-slate-200 gap-4">
            <button
              type="button"
              onClick={() => setActiveTab('products')}
              className={`pb-3 text-xs sm:text-sm font-bold tracking-wide transition-all border-b-2 ${
                activeTab === 'products'
                  ? 'border-slate-900 text-slate-900'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Active Store Listings
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('reviews')}
              className={`pb-3 text-xs sm:text-sm font-bold tracking-wide transition-all border-b-2 ${
                activeTab === 'reviews'
                  ? 'border-slate-900 text-slate-900'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Customer Reviews ({reviews.length})
            </button>
          </div>

          {activeTab === 'products' ? (
            products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((item) => (
                  <Link
                    key={item.id}
                    to={`/products/${item.id}`}
                    className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
                  >
                    <div className="relative aspect-4/3 bg-slate-100 overflow-hidden">
                      <img
                        src={getProductImage(item)}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.onerror = null
                          e.target.src = getProductImage(item)
                        }}
                      />
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-slate-800 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs">
                        {item.condition?.replace('_', ' ') || 'LIKE NEW'}
                      </div>
                    </div>

                    <div className="p-4 space-y-2.5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                          <span className="truncate max-w-[120px]">{item.categoryName || item.category || 'Listing'}</span>
                          {item.city && (
                            <span className="flex items-center gap-0.5 text-slate-600">
                              <MapPin className="w-3 h-3 text-rose-500" />
                              {item.city}
                            </span>
                          )}
                        </div>
                        <h3 className="font-bold text-sm text-slate-900 group-hover:text-rose-600 transition-colors line-clamp-2 mt-1">
                          {item.title}
                        </h3>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                        <span className="font-mono font-bold text-base text-rose-600">
                          {formatCredits(item.priceInCredits || item.price)}
                        </span>
                        <span className="text-xs text-slate-500 group-hover:text-slate-900 font-bold flex items-center gap-0.5">
                          View
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs text-center text-slate-500 text-xs sm:text-sm py-12">
                <Package className="w-10 h-10 text-slate-400 mx-auto mb-2 opacity-80" />
                <p className="font-bold text-slate-800">Browse Full Catalog</p>
                <p className="text-slate-500 text-xs mt-1">Explore all verified listings from this seller on the discovery page.</p>
                <Link
                  to="/search"
                  className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
                >
                  <span>View Products in Catalog</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )
          ) : (
            <div className="space-y-3">
              {reviews.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center text-slate-500 text-sm">
                  No verified customer reviews published yet.
                </div>
              ) : (
                reviews.map((r) => (
                  <div key={r.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900">{r.buyer?.name || 'Verified Buyer'}</span>
                      <span className="text-[11px] text-slate-400">{formatDate(r.createdAt)}</span>
                    </div>
                    <StarRating rating={r.rating} readOnly size="sm" />
                    <p className="text-xs text-slate-700 leading-relaxed">{r.comment}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
