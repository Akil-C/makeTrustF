import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import {
  Sparkles,
  Plus,
  ArrowUpRight,
  TrendingUp,
  ShieldCheck,
  Clock,
  Package,
} from 'lucide-react'
import sellerService from '../../services/sellerService'
import orderService from '../../services/orderService'
import aiService from '../../services/aiService'
import { formatCredits, formatDate, getOrderStatusColor, formatOrderStatus } from '../../utils/formatters'
import DemoDisclaimer from '../../components/common/DemoDisclaimer'

const REVENUE_DATA = [
  { day: 'Mon', revenue: 450, orders: 2 },
  { day: 'Tue', revenue: 780, orders: 4 },
  { day: 'Wed', revenue: 600, orders: 3 },
  { day: 'Thu', revenue: 1200, orders: 6 },
  { day: 'Fri', revenue: 950, orders: 4 },
  { day: 'Sat', revenue: 1600, orders: 8 },
  { day: 'Sun', revenue: 1400, orders: 7 },
]

const MOCK_PENDING_ORDERS = [
  {
    id: 'ord-101',
    productTitle: 'iPhone 15 Pro Max 256GB',
    price: 950,
    buyerName: 'David K.',
    status: 'CONFIRMED',
    createdAt: '2026-10-04T12:00:00Z',
  },
  {
    id: 'ord-104',
    productTitle: 'Sony WH-1000XM5 Headphones',
    price: 280,
    buyerName: 'Sarah M.',
    status: 'PENDING',
    createdAt: '2026-10-05T16:45:00Z',
  },
]

export default function SellerDashboard() {
  const [stats, setStats] = useState({
    totalRevenue: 6980,
    activeListings: 12,
    pendingOrdersCount: 2,
    completedSales: 48,
  })
  const [pendingOrders, setPendingOrders] = useState(MOCK_PENDING_ORDERS)
  const [aiTip, setAiTip] = useState(
    'Pricing suggestion: Audio category demand is up 18% in your area. Consider featuring your Sony Headphones listing for +25% faster sales.'
  )

  const navigate = useNavigate()

  useEffect(() => {
    async function loadData() {
      try {
        const [analyticsRes, ordersRes] = await Promise.allSettled([
          sellerService.getAnalytics(),
          orderService.getSellerOrders({ status: 'PENDING' }),
        ])
        if (ordersRes.status === 'fulfilled' && ordersRes.value.data?.content) {
          setPendingOrders(ordersRes.value.data.content)
        }
      } catch {
        // Fallback
      }
    }
    loadData()
  }, [])

  return (
    <div className="min-h-screen bg-[#F7F7F4] text-[#070707] pb-16">
      <DemoDisclaimer />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Dashboard Top Header */}
        <div className="bg-white p-6 sm:p-8 border border-[#070707]/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F1F1ED] text-[#070707] text-[10px] font-mono uppercase tracking-wider mb-2 border border-[#070707]/10">
              <ShieldCheck className="w-3.5 h-3.5 text-[#EF6F79]" /> GOLD VERIFIED SELLER
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#070707]">Seller Merchant Dashboard</h1>
            <p className="text-xs text-[#070707]/60 mt-1 max-w-xl">
              Manage store inventory, monitor real-time escrow revenue in MC, and process incoming buyer transactions.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              to="/seller/products/create"
              className="px-6 py-3.5 bg-[#070707] hover:bg-[#EF6F79] text-white furniture-subtitle text-xs transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>CREATE NEW LISTING</span>
            </Link>
          </div>
        </div>

        {/* AI Assistant Banner */}
        <div className="bg-[#070707] text-white p-6 border border-[#070707] flex items-start gap-4">
          <div className="p-3 bg-[#EF6F79]/20 text-[#EF6F79] shrink-0 border border-[#EF6F79]/30">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div className="flex-1">
            <span className="furniture-subtitle text-[10px] text-[#EF6F79] block">
              GEMINI AI SELLER INTELLIGENCE RECOMMENDATION
            </span>
            <p className="text-xs font-sans mt-1 text-[#F1F1ED]/90 leading-relaxed">{aiTip}</p>
          </div>
          <Link
            to="/seller/ai-insights"
            className="hidden sm:flex px-4 py-2 bg-white text-[#070707] hover:bg-[#EF6F79] hover:text-white furniture-subtitle text-[11px] transition-colors shrink-0"
          >
            FULL AI REPORT
          </Link>
        </div>

        {/* Metrics Grid Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 border border-[#070707]/10 space-y-2">
            <span className="furniture-subtitle text-[10px] text-[#070707]/50 block">TOTAL REVENUE (MC)</span>
            <p className="text-3xl font-mono font-bold text-[#EF6F79]">{formatCredits(stats.totalRevenue)}</p>
            <span className="text-[11px] font-mono text-emerald-600 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> +14.2% from last week
            </span>
          </div>

          <div className="bg-white p-6 border border-[#070707]/10 space-y-2">
            <span className="furniture-subtitle text-[10px] text-[#070707]/50 block">ACTIVE LISTINGS</span>
            <p className="text-3xl font-mono font-bold text-[#070707]">{stats.activeListings}</p>
            <Link to="/seller/products" className="furniture-subtitle text-[10px] text-[#EF6F79] hover:underline block">
              MANAGE LISTINGS →
            </Link>
          </div>

          <div className="bg-white p-6 border border-[#070707]/10 space-y-2">
            <span className="furniture-subtitle text-[10px] text-[#070707]/50 block">PENDING ORDERS</span>
            <p className="text-3xl font-mono font-bold text-[#070707]">{pendingOrders.length}</p>
            <Link to="/seller/orders" className="furniture-subtitle text-[10px] text-[#EF6F79] hover:underline block">
              FULFILL ORDERS →
            </Link>
          </div>

          <div className="bg-white p-6 border border-[#070707]/10 space-y-2">
            <span className="furniture-subtitle text-[10px] text-[#070707]/50 block">COMPLETED SALES</span>
            <p className="text-3xl font-mono font-bold text-[#070707]">{stats.completedSales}</p>
            <span className="text-[11px] text-[#070707]/60 font-mono">100% Escrow payout rate</span>
          </div>
        </div>

        {/* Recharts Analytics & Pending Queue Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Revenue Chart (8 cols) */}
          <div className="lg:col-span-8 bg-white p-6 border border-[#070707]/10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#070707]/10">
              <h3 className="font-serif font-bold text-[#070707] text-base">Weekly Revenue Performance (MC)</h3>
              <span className="furniture-subtitle text-[10px] text-[#070707]/50">LAST 7 DAYS</span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={REVENUE_DATA}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EF6F79" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#EF6F79" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E4E5E0" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#070707' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#070707' }} />
                  <Tooltip formatter={(value) => [`${value} MC`, 'Revenue']} />
                  <Area type="monotone" dataKey="revenue" stroke="#EF6F79" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pending Orders Queue Sidebar (4 cols) */}
          <div className="lg:col-span-4 bg-white p-6 border border-[#070707]/10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#070707]/10">
              <h3 className="font-serif font-bold text-[#070707] text-base flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#EF6F79]" /> Action Required
              </h3>
              <Link to="/seller/orders" className="furniture-subtitle text-[10px] text-[#EF6F79] hover:underline">
                ALL ORDERS
              </Link>
            </div>

            <div className="space-y-3">
              {pendingOrders.map((ord) => (
                <div key={ord.id} className="p-4 bg-[#F1F1ED] border border-[#070707]/10 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-[#070707]">{ord.productTitle}</span>
                    <span className="font-mono font-bold text-[#EF6F79]">{formatCredits(ord.price)}</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-[#070707]/60">
                    <span>Buyer: {ord.buyerName}</span>
                    <span className={`px-2 py-0.5 font-mono text-[10px] uppercase border ${getOrderStatusColor(ord.status)}`}>
                      {formatOrderStatus(ord.status)}
                    </span>
                  </div>
                  <Link
                    to="/seller/orders"
                    className="w-full py-2 bg-[#070707] hover:bg-[#EF6F79] text-white furniture-subtitle text-[10px] transition-colors flex items-center justify-center gap-1"
                  >
                    <span>FULFILL ORDER</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
