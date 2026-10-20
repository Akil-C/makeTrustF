import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Wallet,
  ShoppingBag,
  Heart,
  MessageSquare,
  ArrowUpRight,
  TrendingUp,
  ShieldCheck,
  Package,
  Clock,
  Sparkles,
  Coins,
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import orderService from '../../services/orderService'
import wishlistService from '../../services/wishlistService'
import walletService from '../../services/walletService'
import { formatCredits, formatDate } from '../../utils/formatters'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import DemoDisclaimer from '../../components/common/DemoDisclaimer'

export default function BuyerDashboard() {
  const { user, walletBalance } = useAuth()
  const [wallet, setWallet] = useState(null)
  const [orders, setOrders] = useState([])
  const [wishlist, setWishlist] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadBuyerData() {
      try {
        const [wallRes, ordRes, wishRes] = await Promise.allSettled([
          walletService.getMyWallet(),
          orderService.getBuyerOrders({ page: 0, size: 5 }),
          wishlistService.getWishlist(),
        ])

        if (wallRes.status === 'fulfilled' && wallRes.value.data) setWallet(wallRes.value.data)
        if (ordRes.status === 'fulfilled' && ordRes.value.data?.content) setOrders(ordRes.value.data.content)
        if (wishRes.status === 'fulfilled' && wishRes.value.data) setWishlist(wishRes.value.data)
      } catch {
        // Fallback
      } finally {
        setLoading(false)
      }
    }
    loadBuyerData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  const availableBal = wallet?.availableCredits ?? walletBalance ?? 0
  const heldBal = wallet?.heldCredits ?? 0
  const spentBal = wallet?.totalSpent ?? 0

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8 font-sans">
      <DemoDisclaimer />

      {/* Top Header Section */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
            BUYER PORTAL
          </div>
          <h1 className="font-sans font-black text-2xl sm:text-3xl lg:text-4xl tracking-tight text-slate-900">
            Welcome back, {user?.name || user?.displayName || 'Valued Buyer'}
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl">
            Track your active orders, monitor escrow balances, manage your saved wishlist items, and communicate with verified sellers.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/buyer/orders"
            className="px-4 py-2.5 rounded-xl border border-slate-300 hover:border-slate-800 bg-white text-slate-800 font-semibold text-xs sm:text-sm transition-all shadow-xs flex items-center gap-2"
          >
            <Package className="w-4 h-4 text-slate-500" />
            <span>My Orders ({orders.length})</span>
          </Link>
          <Link
            to="/search"
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-rose-600 text-white font-semibold text-xs sm:text-sm transition-all shadow-xs flex items-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Explore Market</span>
          </Link>
        </div>
      </div>

      {/* Escrow Wallet Card */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-md space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold tracking-wider text-amber-400 uppercase">
                GUARANTEED ESCROW WALLET
              </span>
              <h2 className="font-sans font-bold text-xl sm:text-2xl text-white">
                Marketplace Credits (MC)
              </h2>
            </div>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full text-xs font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>Escrow Protection Active</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div className="p-5 bg-white/5 rounded-xl border border-white/10 space-y-1">
            <div className="text-xs font-semibold text-slate-400">AVAILABLE BALANCE</div>
            <div className="text-3xl font-mono font-black text-amber-400">
              {formatCredits(availableBal)}
            </div>
            <p className="text-[11px] text-slate-400">Ready for instant checkout</p>
          </div>

          <div className="p-5 bg-white/5 rounded-xl border border-white/10 space-y-1">
            <div className="text-xs font-semibold text-slate-400">LOCKED IN ESCROW</div>
            <div className="text-3xl font-mono font-black text-white">
              {formatCredits(heldBal)}
            </div>
            <p className="text-[11px] text-slate-400">Protected until delivery confirmation</p>
          </div>

          <div className="p-5 bg-white/5 rounded-xl border border-white/10 space-y-1">
            <div className="text-xs font-semibold text-slate-400">LIFETIME PURCHASES</div>
            <div className="text-3xl font-mono font-black text-slate-300">
              {formatCredits(spentBal)}
            </div>
            <p className="text-[11px] text-slate-400">Total volume traded safely</p>
          </div>
        </div>
      </div>

      {/* Quick Access Action Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Link
          to="/buyer/orders"
          className="bg-white p-6 rounded-2xl border border-slate-200/90 hover:border-slate-800 transition-all shadow-xs flex items-center justify-between group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-slate-900 text-base">Purchase History</div>
              <div className="text-xs text-slate-500">Track shipments & confirm delivery</div>
            </div>
          </div>
          <ArrowUpRight className="w-5 h-5 text-slate-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>

        <Link
          to="/buyer/wishlist"
          className="bg-white p-6 rounded-2xl border border-slate-200/90 hover:border-slate-800 transition-all shadow-xs flex items-center justify-between group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:bg-rose-600 group-hover:text-white transition-colors">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-slate-900 text-base">Saved Wishlist</div>
              <div className="text-xs text-slate-500">{wishlist.length} saved products</div>
            </div>
          </div>
          <ArrowUpRight className="w-5 h-5 text-slate-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>

        <Link
          to="/buyer/chat"
          className="bg-white p-6 rounded-2xl border border-slate-200/90 hover:border-slate-800 transition-all shadow-xs flex items-center justify-between group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-slate-900 text-base">Direct Inquiries</div>
              <div className="text-xs text-slate-500">Live chat with sellers</div>
            </div>
          </div>
          <ArrowUpRight className="w-5 h-5 text-slate-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      </div>

      {/* Recent Orders Table / Card List */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-200/80 flex items-center justify-between">
          <div>
            <h3 className="font-sans font-bold text-lg text-slate-900">Recent Order Activity</h3>
            <p className="text-xs text-slate-500">Live escrow payments and dispatch updates</p>
          </div>
          <Link
            to="/buyer/orders"
            className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
          >
            <span>View All Orders</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div className="font-bold text-slate-800 text-base">No Orders Yet</div>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Browse thousands of certified peer-to-peer listings protected by Nexora Escrow.
            </p>
            <Link
              to="/search"
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-rose-600 transition-colors"
            >
              Start Exploring Products
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {orders.map((ord) => (
              <div
                key={ord.id}
                className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-500">
                      ORDER #{ord.id}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs text-slate-500">{formatDate(ord.createdAt)}</span>
                  </div>
                  <div className="font-sans font-bold text-base text-slate-900">
                    {ord.productTitle || ord.product?.title || 'Marketplace Item'}
                  </div>
                  <div className="text-xs text-slate-600">
                    Seller: <span className="font-medium text-slate-800">{ord.sellerName || ord.seller?.displayName || 'Merchant'}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6">
                  <div className="text-left sm:text-right">
                    <div className="font-mono font-bold text-rose-600 text-lg">
                      {formatCredits(ord.price || ord.totalPrice)}
                    </div>
                    <span className="inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-200">
                      {ord.status}
                    </span>
                  </div>

                  <Link
                    to="/buyer/orders"
                    className="p-2.5 rounded-xl border border-slate-200 hover:border-slate-800 bg-white text-slate-700 hover:text-slate-950 transition-all shadow-xs"
                    title="View Order Details"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
