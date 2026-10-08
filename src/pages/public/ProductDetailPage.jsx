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
  ChevronLeft,
  ChevronRight,
  Share2,
  AlertTriangle,
  Star,
  CheckCircle,
  Tag,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react'
import productService from '../../services/productService'
import wishlistService from '../../services/wishlistService'
import chatService from '../../services/chatService'
import { formatCredits, formatDate, formatRelativeTime } from '../../utils/formatters'
import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'
import SellerLevelBadge from '../../components/common/SellerLevelBadge'
import StarRating from '../../components/common/StarRating'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import DemoDisclaimer from '../../components/common/DemoDisclaimer'
import toast from 'react-hot-toast'

const MOCK_PRODUCT = {
  id: '1',
  title: 'iPhone 15 Pro Max 256GB — Natural Titanium',
  priceInCredits: 950,
  category: 'Electronics',
  condition: 'LIKE_NEW',
  description: `Purchased directly from Apple Store 3 months ago. Always protected in a Spigen MagSafe case with ceramic screen guard. Battery health is at 99% with only 45 total charge cycles. 

Includes:
- Original box and paperwork
- USB-C braided charging cable
- MagSafe protective case
- 1-Year AppleCare warranty remaining

Reason for sale: Upgraded to company device. Available for immediate local pickup or escrow delivery!`,
  images: [
    'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=1000&auto=format&fit=crop',
  ],
  views: 342,
  createdAt: '2026-10-04T14:30:00Z',
  city: 'Downtown',
  distanceKm: 1.2,
  seller: {
    id: 101,
    displayName: 'TechHub Deals',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop',
    sellerLevel: 'PLATINUM',
    averageRating: 4.9,
    trustScore: 99,
    completedOrders: 142,
    memberSince: '2024-01-15',
    isVerified: true,
  },
}

const MOCK_SIMILAR = [
  {
    id: 2,
    title: 'Sony WH-1000XM5 Headphones',
    priceInCredits: 280,
    category: 'Electronics',
    condition: 'NEW',
    primaryImageUrl: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&auto=format&fit=crop',
    distance: 3.5,
  },
  {
    id: 3,
    title: 'MacBook Air M2 16GB / 512GB Space Gray',
    priceInCredits: 1100,
    category: 'Electronics',
    condition: 'LIKE_NEW',
    primaryImageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop',
    distance: 2.1,
  },
]

export default function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [product, setProduct] = useState(null)
  const [activeImageIdx, setActiveImageIdx] = useState(0)
  const [loading, setLoading] = useState(true)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [similarProducts, setSimilarProducts] = useState(MOCK_SIMILAR)
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
      <div className="min-h-screen bg-plaster flex flex-col justify-between">
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
      <div className="min-h-screen bg-plaster text-near-black flex flex-col justify-between">
        <Navbar />
        <main className="py-24 px-4 text-center space-y-4 my-auto">
          <h2 className="font-bodoni text-3xl font-bold uppercase">PRODUCT NOT FOUND</h2>
          <p className="text-sm text-near-black/60 font-light">The requested listing does not exist or has been removed.</p>
          <Link to="/search" className="inline-block bg-near-black text-plaster furniture-text px-6 py-3">
            BROWSE ALL LISTINGS
          </Link>
        </main>
        <Footer />
      </div>
    )
  }

  const images = product.images?.length
    ? product.images.map((img) => (typeof img === 'string' ? img : img.url))
    : MOCK_PRODUCT.images

  return (
    <div className="min-h-screen bg-plaster text-near-black flex flex-col justify-between">
      <Navbar />

      <main className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-12">
        <DemoDisclaimer />

        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 furniture-text text-[10px] text-near-black/60 hairline-b border-near-black/10 pb-4">
          <Link to="/" className="hover:text-near-black">HOME</Link>
          <span>/</span>
          <Link to="/search" className="hover:text-near-black">DISCOVER</Link>
          <span>/</span>
          <span className="text-accent font-semibold truncate max-w-xs">{product.title}</span>
        </div>

        {/* Main Product Stage: 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Left Column: Photo Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-paper hairline-all overflow-hidden group">
              <img
                src={images[activeImageIdx] || images[0]}
                alt={product.title}
                className="w-full h-full object-cover transition-transform duration-500"
              />
              
              <button
                onClick={handleShare}
                className="absolute top-4 right-4 p-2 bg-plaster/90 hover:bg-white hairline-all text-near-black hover:text-accent transition-colors"
                title="Share link"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="grid grid-cols-5 gap-3">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`aspect-square bg-paper hairline-all overflow-hidden transition-all ${
                      activeImageIdx === idx ? 'border-2 border-accent' : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Details & Buying Panel */}
          <div className="space-y-8">
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-near-black/60 furniture-text">
                <span>{product.category || 'ELECTRONICS'}</span>
                {product.city && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-accent" />
                    {product.city}
                  </span>
                )}
              </div>

              <h1 className="font-bodoni font-bold text-3xl sm:text-4xl text-near-black uppercase tracking-tight leading-tight">
                {product.title}
              </h1>

              {/* Price & Escrow Tag */}
              <div className="pt-2 flex items-baseline gap-4">
                <div className="font-bodoni text-4xl font-bold text-accent">
                  {formatCredits(product.priceInCredits || product.price)}
                </div>
                <span className="furniture-text text-[10px] text-green-700 bg-green-100 px-2 py-1">
                  ESCROW PROTECTED
                </span>
              </div>
            </div>

            {/* Key Spec Badges */}
            <div className="grid grid-cols-3 gap-3 p-4 bg-paper hairline-all text-center">
              <div>
                <div className="furniture-text text-[9px] text-near-black/50">CONDITION</div>
                <div className="font-bodoni font-bold text-near-black text-sm mt-0.5">
                  {product.condition?.replace('_', ' ') || 'LIKE NEW'}
                </div>
              </div>
              <div>
                <div className="furniture-text text-[9px] text-near-black/50">VIEWS</div>
                <div className="font-bodoni font-bold text-near-black text-sm mt-0.5">
                  {product.views || 142}
                </div>
              </div>
              <div>
                <div className="furniture-text text-[9px] text-near-black/50">LISTED</div>
                <div className="font-bodoni font-bold text-near-black text-sm mt-0.5">
                  {formatRelativeTime(product.createdAt)}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <Link
                to={`/checkout/${product.id}`}
                className="w-full bg-accent text-white hover:bg-near-black furniture-text py-4 transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>BUY WITH MARKETPLACE CREDITS</span>
              </Link>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleStartChat}
                  disabled={actionLoading}
                  className="w-full bg-near-black text-plaster hover:bg-accent hover:text-white furniture-text py-3.5 transition-colors flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>CHAT WITH SELLER</span>
                </button>

                <button
                  onClick={handleWishlistToggle}
                  className="w-full bg-paper border border-near-black/20 hover:border-near-black furniture-text py-3.5 transition-colors flex items-center justify-center gap-2 text-near-black"
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-accent text-accent' : ''}`} />
                  <span>{isWishlisted ? 'WISHLISTED' : 'SAVE TO WISHLIST'}</span>
                </button>
              </div>
            </div>

            {/* Seller Trust Card */}
            {product.seller && (
              <div className="bg-paper p-6 hairline-all space-y-4">
                <div className="furniture-text text-accent text-[10px]">MERCHANT CREDENTIALS</div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={product.seller.avatar || product.seller.profileImageUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop'}
                      alt=""
                      className="w-10 h-10 object-cover hairline-all"
                    />
                    <div>
                      <Link to={`/sellers/${product.seller.id}`} className="font-bodoni font-bold text-base text-near-black hover:text-accent transition-colors">
                        {product.seller.displayName || product.seller.name || 'Verified Merchant'}
                      </Link>
                      <div className="text-[10px] text-near-black/50 furniture-text">
                        TRUST SCORE: {product.seller.trustScore || 98} / 100
                      </div>
                    </div>
                  </div>

                  <SellerLevelBadge level={product.seller.sellerLevel || product.seller.level || 'GOLD'} />
                </div>
              </div>
            )}

            {/* Description */}
            <div className="space-y-3 pt-4 hairline-t border-near-black/15">
              <div className="furniture-text text-near-black font-semibold">DESCRIPTION & SPECIFICATIONS</div>
              <p className="text-sm text-near-black/80 font-light leading-relaxed whitespace-pre-line">
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
