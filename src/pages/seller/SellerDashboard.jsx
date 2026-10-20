import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  TrendingUp,
  Package,
  ShoppingBag,
  Clock,
  ArrowUpRight,
  Sparkles,
  ShieldCheck,
  Plus,
  Coins,
  DollarSign,
  Layers,
  ChevronRight,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import orderService from '../../services/orderService'
import sellerService from '../../services/sellerService'
import { formatCredits, formatDate, getOrderStatusColor, formatOrderStatus } from '../../utils/formatters'
import DemoDisclaimer from '../../components/common/DemoDisclaimer'

const REVENUE_DATA = [
  { day: 'Mon', revenue: 420, orders: 2 },
  { day: 'Tue', revenue: 850, orders: 4 },
  { day: 'Wed', revenue: 600, orders: 3 },
  { day: 'Thu', revenue: 1200, orders: 6 },
  { day: 'Fri', revenue: 950, orders: 4 },
  { day: 'Sat', revenue: 1600, orders: 8 },
  { day: 'Sun', revenue: 1400, orders: 7 },
]

const MOCK_PENDING_ORDERS = [
  {
    id: 'ord-101',
    productTitle: 'MacBook Air 15-inch M3',
    price: 118000,
    buyerName: 'David K.',
    status: 'CONFIRMED',
    createdAt: '2026-10-18T12:00:00Z',
  },
  {
    id: 'ord-104',
    productTitle: 'Sony WH-1000XM5 Headphones',
    price: 24500,
    buyerName: 'Sarah M.',
    status: 'PENDING',
    createdAt: '2026-10-19T16:45:00Z',
  },
]

export default function SellerDashboard() {
  const [stats, setStats] = useState({
    totalRevenue: 284000,
    activeListings: 18,
    pendingOrdersCount: 2,
    completedSales: 48,
  })
  const [pendingOrders, setPendingOrders] = useState(MOCK_PENDING_ORDERS)
  const [aiTip, setAiTip] = useState(
    'Pricing intelligence: Electronics and Audio demand is up 22% in your regional corridor. Consider featuring your Sony Headphones and MacBook Air listings for 35% higher inquiry rates.'
  )

  const navigate = useNavigate()

  useEffect(() => {
    async function loadData() {
      try {
        const [analyticsRes, ordersRes, prodsRes] = await Promise.allSettled([
          sellerService.getAnalytics(),
          orderService.getSellerOrders({ status: 'PENDING' }),
          sellerService.getMyProducts({ page: 0, size: 50 }),
        ])
        if (ordersRes.status === 'fulfilled' && ordersRes.value.data?.content) {
          setPendingOrders(ordersRes.value.data.content)
        }
        if (prodsRes.status === 'fulfilled' && prodsRes.value.data?.totalElements) {
          setStats(prev => ({ ...prev, activeListings: prodsRes.value.data.totalElements }))
        }
      } catch {
        // Fallback
      }
    }
    loadData()
  }, [])

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8 font-sans">
      <DemoDisclaimer />

      {/* Top Header Section */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>VERIFIED SELLER MERCHANT PORTAL</span>
          </div>
          <h1 className="font-sans font-black text-2xl sm:text-3xl lg:text-4xl tracking-tight text-slate-900">
            Seller Merchant Dashboard
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl">
            Oversee active catalog inventory, dispatch incoming buyer orders, monitor protected escrow revenues, and optimize pricing with AI intelligence.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/seller/products"
            className="px-4 py-2.5 rounded-xl border border-slate-300 hover:border-slate-800 bg-white text-slate-800 font-semibold text-xs sm:text-sm transition-all shadow-xs flex items-center gap-2"
          >
            <Layers className="w-4 h-4 text-slate-500" />
            <span>My Listings ({stats.activeListings})</span>
          </Link>
          <Link
            to="/seller/products/create"
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm transition-all shadow-xs flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Listing</span>
          </Link>
        </div>
      </div>

      {/* AI Intelligence Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-rose-500/20 text-rose-400 rounded-xl border border-rose-500/30 shrink-0">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div className="space-y-1">
            <div className="text-xs font-bold tracking-wider text-rose-400 uppercase">
              GEMINI AI SELLER INTELLIGENCE RECOMMENDATION
            </div>
            <p className="text-sm text-slate-200 leading-relaxed max-w-3xl font-medium">
              {aiTip}
            </p>
          </div>
        </div>
        <Link
          to="/seller/ai-insights"
          className="px-4 py-2 bg-white/10 hover:bg-white text-white hover:text-slate-950 font-bold text-xs rounded-xl border border-white/20 transition-all shrink-0 flex items-center gap-1.5"
        >
          <span>Full AI Analysis</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* 4 Financial & Operational Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            TOTAL REVENUE (MC)
          </span>
          <p className="text-3xl font-mono font-black text-rose-600">
            {formatCredits(stats.totalRevenue)}
          </p>
          <div className="text-xs font-semibold text-emerald-600 flex items-center gap-1 pt-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+14.2% growth this cycle</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            ACTIVE CATALOG LISTINGS
          </span>
          <p className="text-3xl font-mono font-black text-slate-900">
            {stats.activeListings}
          </p>
          <Link
            to="/seller/products"
            className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 pt-1"
          >
            <span>Manage Products</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            PENDING ORDERS
          </span>
          <p className="text-3xl font-mono font-black text-amber-600">
            {pendingOrders.length}
          </p>
          <Link
            to="/seller/orders"
            className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 pt-1"
          >
            <span>Fulfill Deliveries</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            COMPLETED SALES
          </span>
          <p className="text-3xl font-mono font-black text-slate-900">
            {stats.completedSales}
          </p>
          <div className="text-xs text-slate-500 font-medium pt-1">
            100% Escrow release clearance
          </div>
        </div>
      </div>

      {/* Analytics Chart & Pending Action Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Revenue Chart (8 cols) */}
        <div className="lg:col-span-8 bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-sans font-bold text-lg text-slate-900">
                Weekly Revenue Performance (MC)
              </h3>
              <p className="text-xs text-slate-500">Real-time marketplace credit flow over the past 7 days</p>
            </div>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              LAST 7 DAYS
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE_DATA}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#e11d48" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#e11d48" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip
                  formatter={(value) => [`${Number(value).toLocaleString()} MC`, 'Revenue']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#e11d48" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Action Required Queue (4 cols) */}
        <div className="lg:col-span-4 bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h3 className="font-sans font-bold text-lg text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-rose-600" />
              <span>Pending Orders</span>
            </h3>
            <Link to="/seller/orders" className="text-xs font-bold text-rose-600 hover:text-rose-700">
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {pendingOrders.map((ord) => (
              <div
                key={ord.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors space-y-3"
              >
                <div className="flex justify-between items-start gap-2">
                  <span className="font-bold text-sm text-slate-900 line-clamp-1">{ord.productTitle}</span>
                  <span className="font-mono font-bold text-sm text-rose-600 shrink-0">
                    {formatCredits(ord.price)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs text-slate-600">
                  <span>Buyer: <strong className="text-slate-800">{ord.buyerName}</strong></span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                    {ord.status}
                  </span>
                </div>
                <Link
                  to="/seller/orders"
                  className="w-full py-2 bg-slate-900 hover:bg-rose-600 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <span>Fulfill Delivery</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
