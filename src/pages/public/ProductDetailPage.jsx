import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  Heart,
  ShieldCheck,
  MessageSquare,
  ShoppingBag,
  MapPin,
  Eye,
  Clock,
  Share2,
  CheckCircle,
  ArrowUpRight,
  ChevronRight,
  ArrowLeft,
  Coins,
} from 'lucide-react'
import productService from '../../services/productService'
import wishlistService from '../../services/wishlistService'
import chatService from '../../services/chatService'
import { formatCredits, formatDate, formatRelativeTime } from '../../utils/formatters'
import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'
import SellerLevelBadge from '../../components/common/SellerLevelBadge'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import DemoDisclaimer from '../../components/common/DemoDisclaimer'
import toast from 'react-hot-toast'

const MOCK_PRODUCT = {
  id: '30002',
  title: 'MacBook Air 15-inch M3 (16GB RAM, 512GB SSD) Midnight',
  priceInCredits: 118000,
  category: 'Electronics',
  condition: 'LIKE_NEW',
  description: `Apple M3 chip with 8-core CPU and 10-core GPU. Liquid Retina display, MagSafe 3 charging port, 1080p FaceTime HD camera. Like new condition with AppleCare+ until 2027.

Includes:
- Original box and MagSafe 3 braided cable
- 35W Dual USB-C Port Compact Power Adapter
- Leather protective carrying sleeve
- 1-Year AppleCare+ warranty remaining

Available for immediate local pickup or escrow delivery with buyer verification protection.`,
  images: [
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=1000&q=80',
  ],
  views: 184,
  createdAt: '2026-10-18T14:30:00Z',
  city: 'Bengaluru',
  seller: {
    id: 2,
    displayName: 'TechHub Electronics',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop',
    sellerLevel: 'PLATINUM',
    averageRating: 5.0,
    trustScore: 99,
    completedOrders: 126,
    memberSince: '2024-01-15',
    isVerified: true,
  },
}

export default function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [product, setProduct] = useState(null)
  const [activeImageIdx, setActiveImageIdx] = useState(0)
  const [loading, setLoading] = useState(true)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    async function loadProduct() {
      setLoading(true)
      try {
        const res = await productService.getProductById(id)
        if (res.data) {
          setProduct(res.data)
        } else {
          setProduct(MOCK_PRODUCT)
        }
      } catch {
        setProduct(MOCK_PRODUCT)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      loadProduct()
    }
  }, [id])

  const handleWishlistToggle = async () => {
    try {
      if (isWishlisted) {
        await wishlistService.removeFromWishlist(id)
        setIsWishlisted(false)
        toast.success('Removed from wishlist')
      } else {
        await wishlistService.addToWishlist(id)
        setIsWishlisted(true)
        toast.success('Added to wishlist')
      }
    } catch {
      setIsWishlisted(!isWishlisted)
      toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist')
    }
  }

  const handleStartChat = async () => {
    if (!product?.seller) return
    setActionLoading(true)
    try {
      await chatService.getOrCreateConversation(product.seller.id, product.id)
      navigate('/buyer/chat')
    } catch {
      navigate('/buyer/chat')
    } finally {
      setActionLoading(false)
    }
  }

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Product link copied to clipboard!')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F7F4] flex flex-col justify-between font-sans">
        <Navbar />
        <div className="py-24 flex justify-center my-auto">
          <LoadingSpinner size="lg" />
        </div>
        <Footer />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#F7F7F4] text-slate-900 flex flex-col justify-between font-sans">
        <Navbar />
        <main className="py-24 px-4 text-center space-y-4 my-auto">
          <h2 className="font-sans font-black text-3xl text-slate-900">Product Not Found</h2>
          <p className="text-sm text-slate-600 max-w-sm mx-auto">The requested listing does not exist or has been removed.</p>
          <Link to="/search" className="inline-block bg-slate-900 text-white font-semibold text-xs px-6 py-3 rounded-xl hover:bg-rose-600 transition-colors">
            Browse All Listings
          </Link>
        </main>
        <Footer />
      </div>
    )
  }

  const images = product.images?.length
    ? product.images.map((img) => (typeof img === 'string' ? img : img.url))
    : [product.primaryImageUrl || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800']

  return (
    <div className="min-h-screen bg-[#F7F7F4] text-slate-900 flex flex-col justify-between font-sans">
      <Navbar />

      <main className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
        <DemoDisclaimer />

        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <Link to="/" className="hover:text-slate-900 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link to="/search" className="hover:text-slate-900 transition-colors">Discover</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 font-bold truncate max-w-xs">{product.title}</span>
        </div>

        {/* Main Product Stage: 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Left Column: Photo Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs group">
              <img
                src={images[activeImageIdx] || images[0]}
                alt={product.title}
                className="w-full h-full object-cover"
              />
              <button
                onClick={handleShare}
                className="absolute top-4 right-4 p-2.5 rounded-xl bg-white/90 hover:bg-white text-slate-700 hover:text-rose-600 transition-colors shadow-xs"
                title="Share link"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`aspect-square rounded-xl bg-white border overflow-hidden transition-all shadow-xs ${
                      activeImageIdx === idx ? 'border-2 border-slate-900 ring-2 ring-slate-900/10' : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Details & Buying Panel */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-5">
              <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                <span className="uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                  {product.categoryName || product.category || 'ELECTRONICS'}
                </span>
                {product.city && (
                  <span className="flex items-center gap-1 text-slate-600">
                    <MapPin className="w-3.5 h-3.5 text-rose-600" />
                    {product.city}
                  </span>
                )}
              </div>

              <h1 className="font-sans font-black text-2xl sm:text-3xl text-slate-900 leading-snug tracking-tight">
                {product.title}
              </h1>

              {/* Price & Escrow Tag */}
              <div className="pt-2 flex flex-wrap items-baseline gap-4">
                <div className="text-3xl sm:text-4xl font-mono font-black text-rose-600">
                  {formatCredits(product.priceInCredits || product.price)}
                </div>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1 flex items-center gap-1.5 shadow-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Escrow Protected Purchase</span>
                </span>
              </div>

              {/* Key Spec Badges */}
              <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200/80 text-center">
                <div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase">Condition</div>
                  <div className="font-bold text-slate-900 text-sm mt-0.5">
                    {product.condition?.replace('_', ' ') || 'LIKE NEW'}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase">Traffic</div>
                  <div className="font-bold text-slate-900 text-sm mt-0.5">
                    {product.views || 184} Views
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase">Listed</div>
                  <div className="font-bold text-slate-900 text-sm mt-0.5">
                    {formatRelativeTime(product.createdAt)}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <Link
                  to={`/checkout/${product.id}`}
                  className="w-full bg-slate-900 hover:bg-rose-600 text-white rounded-xl font-bold py-4 transition-all flex items-center justify-center gap-2 text-sm shadow-md"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Buy with Marketplace Credits</span>
                </Link>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleStartChat}
                    disabled={actionLoading}
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 text-xs shadow-xs"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Chat with Seller</span>
                  </button>

                  <button
                    onClick={handleWishlistToggle}
                    className="w-full bg-white border border-slate-300 hover:border-slate-800 rounded-xl font-semibold py-3 transition-colors flex items-center justify-center gap-2 text-xs text-slate-800 shadow-xs"
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-600 text-rose-600' : ''}`} />
                    <span>{isWishlisted ? 'Saved' : 'Save to Wishlist'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Seller Trust Card */}
            {product.seller && (
              <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  VERIFIED MERCHANT CREDENTIALS
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={product.seller.avatar || product.seller.profileImageUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop'}
                      alt=""
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                    />
                    <div>
                      <Link to={`/sellers/${product.seller.id}`} className="font-bold text-base text-slate-900 hover:text-rose-600 transition-colors">
                        {product.seller.displayName || product.seller.name || 'Verified Merchant'}
                      </Link>
                      <div className="text-xs text-slate-500 font-medium">
                        Trust Rating: <strong className="text-slate-800">{product.seller.trustScore || 99} / 100</strong>
                      </div>
                    </div>
                  </div>

                  <SellerLevelBadge level={product.seller.sellerLevel || product.seller.level || 'PLATINUM'} />
                </div>
              </div>
            )}

            {/* Description & Specifications */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-3">
              <h3 className="font-bold text-base text-slate-900 uppercase tracking-wide">
                Description & Specifications
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
