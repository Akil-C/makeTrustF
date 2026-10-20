import { useState, useEffect } from 'react'
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import { BarChart2, TrendingUp, DollarSign, Activity, Coins, ShieldCheck, CheckCircle2 } from 'lucide-react'
import adminService from '../../services/adminService'
import { formatCredits } from '../../utils/formatters'
import DemoDisclaimer from '../../components/common/DemoDisclaimer'

const PLATFORM_DATA = [
  { day: 'Mon', volume: 12000, feeRevenue: 600 },
  { day: 'Tue', volume: 18500, feeRevenue: 925 },
  { day: 'Wed', volume: 14200, feeRevenue: 710 },
  { day: 'Thu', volume: 24000, feeRevenue: 1200 },
  { day: 'Fri', volume: 29000, feeRevenue: 1450 },
  { day: 'Sat', volume: 38000, feeRevenue: 1900 },
  { day: 'Sun', volume: 32000, feeRevenue: 1600 },
]

export default function AdminAnalytics() {
  const [stats, setStats] = useState({
    totalCreditsInCirculation: 4500000,
    platformFeeCollected: 225000,
    completedOrders: 142,
    totalOrders: 168,
  })

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await adminService.getDashboardStats()
        if (res.data) {
          setStats((prev) => ({
            ...prev,
            totalCreditsInCirculation: res.data.totalCreditsInCirculation || prev.totalCreditsInCirculation,
            platformFeeCollected: res.data.platformFeeCollected || prev.platformFeeCollected,
            completedOrders: res.data.completedOrders || prev.completedOrders,
            totalOrders: res.data.totalOrders || prev.totalOrders,
          }))
        }
      } catch {
        // quiet
      }
    }
    loadStats()
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16 font-sans">
      <DemoDisclaimer />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Live Platform Telemetry</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1 flex items-center gap-2.5">
              <BarChart2 className="w-7 h-7 text-slate-900" />
              <span>Platform Financial Analytics</span>
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Track gross escrow settlement throughput, platform protocol revenue, and liquidity distribution across merchant stores.
            </p>
          </div>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-amber-500" />
              Credits in Active Circulation
            </span>
            <span className="text-2xl font-mono font-extrabold text-slate-900 mt-1 block">
              {formatCredits(stats.totalCreditsInCirculation)}
            </span>
            <span className="text-xs text-emerald-600 font-bold mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> 100% 1:1 Escrow Collateralized
            </span>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Protocol Escrow Revenue
            </span>
            <span className="text-2xl font-mono font-extrabold text-slate-900 mt-1 block">
              {formatCredits(stats.platformFeeCollected)}
            </span>
            <span className="text-xs text-emerald-600 font-bold mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> Flat platform escrow take-rate
            </span>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              Settled Escrow Orders
            </span>
            <span className="text-2xl font-mono font-extrabold text-slate-900 mt-1 block">
              {stats.completedOrders} / {stats.totalOrders}
            </span>
            <span className="text-xs text-slate-500 font-medium mt-1">
              {((stats.completedOrders / (stats.totalOrders || 1)) * 100).toFixed(0)}% Completion Success Rate
            </span>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-extrabold text-slate-900 text-base">Weekly Escrow Volume Velocity (MC)</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={PLATFORM_DATA}>
                <defs>
                  <linearGradient id="adminVol" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0f172a" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#0f172a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="volume" stroke="#0f172a" fill="url(#adminVol)" strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
