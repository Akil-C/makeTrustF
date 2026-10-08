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
} from 'lucide-react'
import sellerService from '../../services/sellerService'
import reviewService from '../../services/reviewService'
import { formatCredits, formatDate } from '../../utils/formatters'
import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'
import SellerLevelBadge from '../../components/common/SellerLevelBadge'
import VerifiedBadge from '../../components/common/VerifiedBadge'
import StarRating from '../../components/common/StarRating'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import DemoDisclaimer from '../../components/common/DemoDisclaimer'

const MOCK_PROFILE = {
  id: 101,
  displayName: 'TechHub Deals',
  bio: 'Specializing in certified pre-owned tech, Apple hardware, and high-end audio gear. Fast local dispatch & 100% escrow guaranteed.',
  profileImageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop',
  sellerLevel: 'PLATINUM',
  trustScore: 99,
  averageRating: 4.9,
  reviewCount: 88,
  completedOrders: 142,
  responseRate: 98,
  isVerified: true,
}

const MOCK_PRODUCTS = [
  {
    id: 1,
    title: 'iPhone 15 Pro Max 256GB — Natural Titanium',
    priceInCredits: 950,
    category: 'Electronics',
    condition: 'LIKE_NEW',
    primaryImageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop',
  },
  {
    id: 3,
    title: 'MacBook Air M2 16GB / 512GB Space Gray',
    priceInCredits: 1100,
    category: 'Electronics',
    condition: 'LIKE_NEW',
    primaryImageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop',
  },
]

const MOCK_REVIEWS = [
  {
    id: 'r1',
    buyerName: 'David K.',
    rating: 5,
    createdAt: '2026-09-28',
    comment: 'Super fast delivery and device was in immaculate condition. Will definitely buy from TechHub again!',
  },
  {
    id: 'r2',
    buyerName: 'Elena R.',
    rating: 5,
    createdAt: '2026-09-15',
    comment: 'Great communication. Escrow process was smooth and item matched description perfectly.',
  },
]

export default function SellerProfilePage() {
  const { id } = useParams()
  const [profile, setProfile] = useState(null)
  const [products, setProducts] = useState(MOCK_PRODUCTS)
  const [reviews, setReviews] = useState(MOCK_REVIEWS)
  const [activeTab, setActiveTab] = useState('products')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      try {
        const [profRes, prodRes, revRes] = await Promise.allSettled([
          sellerService.getSellerProfile(id),
          sellerService.getSellerPublicProducts(id),
          reviewService.getSellerReviews(id),
        ])

        if (profRes.status === 'fulfilled' && profRes.value.data) setProfile(profRes.value.data)
        else setProfile(MOCK_PROFILE)

        if (prodRes.status === 'fulfilled' && prodRes.value.data?.content) setProducts(prodRes.value.data.content)

        if (revRes.status === 'fulfilled' && revRes.value.data?.content) setReviews(revRes.value.data.content)
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
      <div className="min-h-screen bg-plaster flex flex-col justify-between">
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
    <div className="min-h-screen bg-plaster text-near-black flex flex-col justify-between">
      <Navbar />

      <main className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-10">
        <DemoDisclaimer />

        {/* Seller Editorial Profile Header */}
        <div className="bg-paper p-8 md:p-10 hairline-all space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 hairline-b border-near-black/15 pb-8">
            <div className="flex items-center gap-5">
              <img
                src={p.profileImageUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop'}
                alt=""
                className="w-20 h-20 object-cover hairline-all shrink-0"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="font-bodoni font-bold text-2xl sm:text-3xl text-near-black uppercase">
                    {p.displayName || p.name || 'Verified Merchant'}
                  </h1>
                  <VerifiedBadge />
                </div>
                <div className="furniture-text text-accent text-xs">
                  VERIFIED NEXORA MERCHANT
                </div>
              </div>
            </div>

            <SellerLevelBadge level={p.sellerLevel || 'PLATINUM'} />
          </div>

          <p className="text-sm text-near-black/75 font-light leading-relaxed max-w-3xl">
            {p.bio}
          </p>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-plaster hairline-all">
              <div className="furniture-text text-[9px] text-near-black/50">TRUST SCORE</div>
              <div className="font-bodoni text-2xl font-bold text-accent">{p.trustScore || 99} / 100</div>
            </div>
            <div className="p-4 bg-plaster hairline-all">
              <div className="furniture-text text-[9px] text-near-black/50">AVERAGE RATING</div>
              <div className="font-bodoni text-2xl font-bold text-near-black">{p.averageRating || 4.9} ★</div>
            </div>
            <div className="p-4 bg-plaster hairline-all">
              <div className="furniture-text text-[9px] text-near-black/50">COMPLETED ORDERS</div>
              <div className="font-bodoni text-2xl font-bold text-near-black">{p.completedOrders || 142}</div>
            </div>
            <div className="p-4 bg-plaster hairline-all">
              <div className="furniture-text text-[9px] text-near-black/50">RESPONSE RATE</div>
              <div className="font-bodoni text-2xl font-bold text-green-700">{p.responseRate || 98}%</div>
            </div>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-4 hairline-b border-near-black/15 pb-2">
          <button
            onClick={() => setActiveTab('products')}
            className={`furniture-text pb-2 px-1 text-sm border-b-2 transition-colors ${
              activeTab === 'products' ? 'border-accent text-accent font-bold' : 'border-transparent text-near-black/60 hover:text-near-black'
            }`}
          >
            ACTIVE LISTINGS ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`furniture-text pb-2 px-1 text-sm border-b-2 transition-colors ${
              activeTab === 'reviews' ? 'border-accent text-accent font-bold' : 'border-transparent text-near-black/60 hover:text-near-black'
            }`}
          >
            VERIFIED REVIEWS ({reviews.length})
          </button>
        </div>

        {/* Tab Contents */}
        {activeTab === 'products' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((prod) => (
              <div key={prod.id} className="group bg-paper hairline-all flex flex-col justify-between">
                <div className="aspect-square bg-plaster overflow-hidden">
                  <img
                    src={prod.primaryImageUrl || prod.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop'}
                    alt={prod.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5 space-y-3">
                  <h3 className="font-bodoni font-medium text-base text-near-black line-clamp-1 group-hover:text-accent transition-colors">
                    {prod.title}
                  </h3>
                  <div className="flex items-center justify-between pt-2 hairline-t border-near-black/10">
                    <span className="font-bodoni font-bold text-accent text-lg">
                      {formatCredits(prod.priceInCredits || prod.price)}
                    </span>
                    <Link to={`/products/${prod.id}`} className="furniture-text text-xs text-near-black hover:text-accent underline flex items-center gap-1">
                      <span>VIEW</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((rev) => (
              <div key={rev.id} className="p-6 bg-paper hairline-all space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bodoni font-bold text-near-black">{rev.buyerName}</span>
                  <span className="furniture-text text-[10px] text-near-black/50">{rev.createdAt}</span>
                </div>
                <StarRating rating={rev.rating} />
                <p className="font-light text-sm text-near-black/80 italic">“{rev.comment}”</p>
              </div>
            ))}
          </div>
        )}

      </main>

      <Footer />
    </div>
  )
}
