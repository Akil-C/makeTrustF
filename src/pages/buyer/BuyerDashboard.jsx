import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Wallet,
  ShoppingBag,
  Heart,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Package,
  MessageSquare,
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import orderService from '../../services/orderService'
import wishlistService from '../../services/wishlistService'
import walletService from '../../services/walletService'
import { formatCredits, formatDate, getOrderStatusColor, formatOrderStatus } from '../../utils/formatters'
import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'
import DemoDisclaimer from '../../components/common/DemoDisclaimer'

const MOCK_ORDERS = [
  {
    id: 'ord-101',
    productTitle: 'iPhone 15 Pro Max 256GB',
    price: 950,
    status: 'SHIPPED',
    createdAt: '2026-10-04T12:00:00Z',
    sellerName: 'TechHub Deals',
  },
  {
    id: 'ord-102',
    productTitle: 'Sony WH-1000XM5 Headphones',
    price: 280,
    status: 'DELIVERED',
    createdAt: '2026-09-28T14:20:00Z',
    sellerName: 'AudioFile Studio',
  },
]

const MOCK_WISHLIST = [
  {
    id: 'w1',
    productId: '3',
    title: 'MacBook Air M2 16GB / 512GB Space Gray',
    price: 1100,
    oldPrice: 1250,
    priceDropped: true,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop',
  },
]

export default function BuyerDashboard() {
  const { user } = useAuth()
  const [wallet, setWallet] = useState(null)
  const [orders, setOrders] = useState(MOCK_ORDERS)
  const [wishlist, setWishlist] = useState(MOCK_WISHLIST)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadBuyerData() {
      setLoading(true)
      try {
        const [wallRes, ordRes, wishRes] = await Promise.allSettled([
          walletService.getMyWallet(),
          orderService.getMyOrdersAsBuyer({ size: 5 }),
          wishlistService.getWishlist(),
        ])

        if (wallRes.status === 'fulfilled' && wallRes.value.data) setWallet(wallRes.value.data)
        if (ordRes.status === 'fulfilled' && ordRes.value.data?.content) setOrders(ordRes.value.data.content)
        if (wishRes.status === 'fulfilled' && wishRes.value.data) setWishlist(wishRes.value.data)
      } catch {
        // Fallback mock
      } finally {
        setLoading(false)
      }
    }
    loadBuyerData()
  }, [])

  return (
    <div className="min-h-screen bg-plaster text-near-black flex flex-col justify-between">
      <Navbar />

      <main className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-10">
        <DemoDisclaimer />

        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 hairline-b border-near-black/15 pb-6">
          <div className="space-y-1">
            <div className="furniture-text text-accent">BUYER PORTAL</div>
            <h1 className="font-bodoni font-bold text-3xl sm:text-4xl text-near-black uppercase">
              WELCOME, {user?.name?.toUpperCase() || 'BUYER'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/buyer/orders" className="furniture-text px-4 py-2 border border-near-black/20 hover:border-near-black text-xs">
              MY ORDERS
            </Link>
            <Link to="/buyer/chat" className="furniture-text px-4 py-2 bg-near-black text-plaster hover:bg-accent text-xs">
              MESSAGES
            </Link>
          </div>
        </div>

        {/* Marketplace Credit Wallet Card */}
        <div className="bg-near-black text-plaster p-8 hairline-all space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 hairline-b border-plaster/15 pb-4">
            <div>
              <div className="furniture-text text-accent text-[10px]">ESCROW WALLET</div>
              <h2 className="font-bodoni text-2xl font-bold text-plaster uppercase">MARKETPLACE CREDITS</h2>
            </div>
            <div className="furniture-text text-xs text-green-400 bg-green-500/10 border border-green-500/30 px-3 py-1">
              ESCROW ACTIVE
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-4 bg-plaster/5 hairline-all border-plaster/10 space-y-1">
              <div className="furniture-text text-plaster/50 text-[9px]">AVAILABLE BALANCE</div>
              <div className="font-bodoni text-3xl font-bold text-accent">
                {formatCredits(wallet?.availableCredits || wallet?.balance || 12500)}
              </div>
            </div>

            <div className="p-4 bg-plaster/5 hairline-all border-plaster/10 space-y-1">
              <div className="furniture-text text-plaster/50 text-[9px]">HELD IN ESCROW</div>
              <div className="font-bodoni text-3xl font-bold text-plaster">
                {formatCredits(wallet?.heldCredits || 2400)}
              </div>
            </div>

            <div className="p-4 bg-plaster/5 hairline-all border-plaster/10 space-y-1">
              <div className="furniture-text text-plaster/50 text-[9px]">TOTAL SPENT</div>
              <div className="font-bodoni text-3xl font-bold text-plaster/70">
                {formatCredits(wallet?.totalSpent || 4850)}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between hairline-b border-near-black/15 pb-4">
            <h3 className="font-bodoni font-bold text-xl uppercase">RECENT ORDERS</h3>
            <Link to="/buyer/orders" className="furniture-text text-xs text-accent hover:underline">
              VIEW ALL ORDERS →
            </Link>
          </div>

          <div className="bg-paper hairline-all divide-y divide-near-black/10">
            {orders.map((ord) => (
              <div key={ord.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="furniture-text text-[10px] text-near-black/50">ORDER #{ord.id}</div>
                  <div className="font-bodoni font-medium text-lg text-near-black">
                    {ord.productTitle || ord.product?.title || 'Marketplace Item'}
                  </div>
                  <div className="text-xs text-near-black/60 font-light">
                    Seller: {ord.sellerName || ord.seller?.displayName || 'Merchant'} • {formatDate(ord.createdAt)}
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="font-bodoni font-bold text-accent text-lg">
                      {formatCredits(ord.price || ord.totalPrice)}
                    </div>
                    <span className="furniture-text text-[9px] px-2 py-0.5 bg-near-black text-white">
                      {ord.status}
                    </span>
                  </div>

                  <Link
                    to="/buyer/orders"
                    className="p-2 border border-near-black/20 hover:border-near-black text-near-black"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>

      <Footer />
    </div>
  )
}
