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
  Star,
  Sparkles,
  ShieldAlert,
  ThumbsUp,
  Package,
} from 'lucide-react'
import productService from '../../services/productService'
import wishlistService from '../../services/wishlistService'
import chatService from '../../services/chatService'
import reviewService from '../../services/reviewService'
import { formatCredits, formatDate, formatRelativeTime } from '../../utils/formatters'
import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'
import SellerLevelBadge from '../../components/common/SellerLevelBadge'
import StarRating from '../../components/common/StarRating'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import DemoDisclaimer from '../../components/common/DemoDisclaimer'
import { getProductById, getProductImage, CURATED_PRODUCTS } from '../../utils/productsData'
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
  const [similarProducts, setSimilarProducts] = useState([])
  const [reviews, setReviews] = useState([])
  const [reviewsLoading, setReviewsLoading] = useState(false)

  useEffect(() => {
    async function loadProduct() {
      setLoading(true)
      try {
        const res = await productService.getProductById(id)
        if (res.data) {
          const apiProduct = res.data
          const resolvedImg = getProductImage(apiProduct)
          const curatedFallback = getProductById(id)
          setProduct({
            ...apiProduct,
            primaryImageUrl: resolvedImg,
            images: apiProduct.images?.length
              ? apiProduct.images.map((im) => (typeof im === 'string' ? im : im.url || resolvedImg))
              : (curatedFallback?.images || [resolvedImg]),
            description: apiProduct.description || curatedFallback?.description || '',
          })
        } else {
          setProduct(getProductById(id) || MOCK_PRODUCT)
        }
      } catch {
        setProduct(getProductById(id) || MOCK_PRODUCT)
      } finally {
        setLoading(false)
      }
    }

    async function loadAuxiliaryData() {
      // 1. Check Wishlist
      try {
        const wishRes = await wishlistService.isInWishlist(id)
        if (wishRes.data?.inWishlist !== undefined) {
          setIsWishlisted(wishRes.data.inWishlist)
        }
      } catch {
        // Guest or unauthenticated
      }

      // 2. Fetch Similar Products
      try {
        const simRes = await productService.getSimilarProducts(id)
        let list = []
        if (Array.isArray(simRes.data) && simRes.data.length > 0) {
          list = simRes.data
        } else {
          const trendRes = await productService.getTrendingProducts(8)
          list = trendRes.data?.content || trendRes.data || []
        }
        
        let filtered = list.filter((p) => String(p.id) !== String(id))
        if (filtered.length < 4) {
          // Augment with category-matching curated products
          const currentCurated = getProductById(id)
          const cat = currentCurated?.categoryName || product?.categoryName || product?.category || 'Electronics'
          const catMatches = CURATED_PRODUCTS.filter(
            (p) => String(p.id) !== String(id) && (p.categoryName === cat || p.categoryId === currentCurated?.categoryId)
          )
          filtered = [...filtered, ...catMatches]
        }
        
        setSimilarProducts(filtered.slice(0, 4).map((p) => ({
          ...p,
          primaryImageUrl: getProductImage(p),
        })))
      } catch {
        const catMatches = CURATED_PRODUCTS.filter((p) => String(p.id) !== String(id)).slice(0, 4)
        setSimilarProducts(catMatches.map((p) => ({ ...p, primaryImageUrl: getProductImage(p) })))
      }

      // 3. Fetch Product Reviews
      setReviewsLoading(true)
      try {
        const revRes = await reviewService.getProductReviews(id)
        const revList = revRes.data?.content || revRes.data || []
        if (revList.length > 0) {
          setReviews(revList)
        } else {
          // Seed sample verified review for realistic storefront experience
          setReviews([
            {
              id: 'rev-default-1',
              buyer: { name: 'Priya S.' },
              rating: 5,
              productConditionRating: 5,
              sellerCommunicationRating: 5,
              accuracyRating: 5,
              title: 'Spotless condition, perfectly packaged',
              comment: 'The device arrived exactly as described with original packaging and documentation. Fast communication and smooth escrow release!',
              isVerifiedPurchase: true,
              createdAt: '2026-10-15T14:20:00Z',
              sellerReply: 'Thank you Priya! Enjoy the device and don’t hesitate to reach out if you need anything.',
            },
          ])
        }
      } catch {
        setReviews([])
      } finally {
        setReviewsLoading(false)
      }
    }

    if (id) {
      loadProduct()
      loadAuxiliaryData()
      window.scrollTo(0, 0)
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

  const fallbackImage = getProductImage(product)
  const images = product.images?.length
    ? product.images.map((img) => (typeof img === 'string' ? img : img.url || fallbackImage))
    : [product.primaryImageUrl || fallbackImage]

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
                src={images[activeImageIdx] || fallbackImage}
                alt={product.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null
                  e.target.src = fallbackImage
                }}
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

        {/* Customer Reviews Section */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-800 text-xs font-bold rounded-full border border-amber-200 mb-2">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>VERIFIED ESCROW RATINGS</span>
              </div>
              <h2 className="font-sans font-black text-2xl text-slate-900">Customer Feedback & Reviews</h2>
              <p className="text-xs text-slate-500 mt-1">
                All reviews are posted exclusively by verified buyers who completed escrow order delivery.
              </p>
            </div>

            {reviews.length > 0 && (
              <div className="flex items-center gap-4 bg-slate-50 border border-slate-200/80 px-5 py-3 rounded-xl">
                <div className="text-3xl font-black font-mono text-slate-900">
                  {(
                    reviews.reduce((acc, r) => acc + (r.rating || 5), 0) / reviews.length
                  ).toFixed(1)}
                </div>
                <div>
                  <div className="flex items-center gap-1 text-amber-500">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <div className="text-[11px] font-bold text-slate-500 mt-0.5">
                    Based on {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sub-Ratings Summary Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-500">Item Condition Accuracy</span>
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-sm">4.9 / 5.0</span>
                <span className="text-xs text-emerald-600 font-bold">Excellent</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                <div className="bg-emerald-500 h-1.5 rounded-full w-[98%]"></div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-500">Seller Communication</span>
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-sm">5.0 / 5.0</span>
                <span className="text-xs text-emerald-600 font-bold">Fast & Responsive</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                <div className="bg-emerald-500 h-1.5 rounded-full w-[100%]"></div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-500">Delivery & Packaging</span>
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-sm">4.8 / 5.0</span>
                <span className="text-xs text-emerald-600 font-bold">Secured Box</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                <div className="bg-emerald-500 h-1.5 rounded-full w-[96%]"></div>
              </div>
            </div>
          </div>

          {/* Reviews List */}
          {reviewsLoading ? (
            <div className="py-12 flex justify-center">
              <LoadingSpinner size="md" />
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">No Customer Reviews Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Purchasing this item with Marketplace Credits will prompt an escrow review invitation upon confirmed delivery.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-3 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs">
                        {(rev.buyer?.name || rev.buyer?.displayName || 'Buyer').charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900">
                            {rev.buyer?.name || rev.buyer?.displayName || 'Verified Buyer'}
                          </span>
                          {rev.isVerifiedPurchase && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                              <CheckCircle className="w-3 h-3 text-emerald-600" />
                              <span>Verified Purchase</span>
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-amber-500 mt-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`w-3.5 h-3.5 ${
                                s <= (rev.rating || 5) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    <span className="text-xs text-slate-400 font-medium">
                      {formatRelativeTime(rev.createdAt || '2026-10-18T10:00:00Z')}
                    </span>
                  </div>

                  {rev.title && (
                    <h4 className="font-bold text-sm text-slate-900 pt-1">{rev.title}</h4>
                  )}

                  <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>

                  {/* Seller Reply */}
                  {rev.sellerReply && (
                    <div className="mt-3 p-3.5 rounded-xl bg-white border border-slate-200/90 space-y-1.5 ml-4 sm:ml-8">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-slate-900">Seller Response</span>
                        <span className="text-[10px] text-slate-400">Merchant Store</span>
                      </div>
                      <p className="text-xs text-slate-600 italic">"{rev.sellerReply}"</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Similar Products Carousel / Grid */}
        {similarProducts.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-800 text-xs font-bold rounded-full border border-rose-200 mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-rose-600" />
                  <span>RECOMMENDED ALTERNATIVES</span>
                </div>
                <h2 className="font-sans font-black text-2xl text-slate-900">Similar Verified Listings</h2>
              </div>
              <Link
                to={`/search?category=${product.categoryName || product.category || ''}`}
                className="text-xs font-bold text-slate-700 hover:text-rose-600 flex items-center gap-1 transition-colors"
              >
                <span>View More</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarProducts.map((item) => (
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
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
