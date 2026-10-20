import { useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import {
  Eye,
  MessageSquare,
  DollarSign,
  BarChart2,
  TrendingUp,
  ShoppingBag,
} from 'lucide-react'
import { formatCredits } from '../../utils/formatters'
import DemoDisclaimer from '../../components/common/DemoDisclaimer'

const ANALYTICS_SERIES_30D = [
  { date: 'Oct 1', views: 240, inquiries: 12, revenue: 14500 },
  { date: 'Oct 4', views: 380, inquiries: 18, revenue: 27800 },
  { date: 'Oct 8', views: 290, inquiries: 14, revenue: 16000 },
  { date: 'Oct 12', views: 520, inquiries: 28, revenue: 42000 },
  { date: 'Oct 16', views: 410, inquiries: 22, revenue: 29500 },
  { date: 'Oct 20', views: 680, inquiries: 35, revenue: 56000 },
]

export default function SellerAnalytics() {
  const [period, setPeriod] = useState('30d')
  const [data] = useState(ANALYTICS_SERIES_30D)

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16 font-sans">
      <DemoDisclaimer />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Merchant Intelligence</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1 flex items-center gap-2.5">
              <BarChart2 className="w-7 h-7 text-emerald-600" />
              <span>Store Performance & Sales Velocity</span>
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Real-time telemetry measuring item impression velocity, customer dialogue conversion rates, and gross settlement revenue.
            </p>
          </div>

          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 self-start sm:self-auto">
            {['7d', '30d', '90d', '1y'].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  period === p ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {p.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* 4 Core Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Listing Impressions</span>
            <span className="text-2xl font-mono font-extrabold text-slate-900 mt-1 block">2,520</span>
            <span className="text-xs text-emerald-600 font-bold mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> +16.2% vs prev window
            </span>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Buyer Inquiries</span>
            <span className="text-2xl font-mono font-extrabold text-slate-900 mt-1 block">129</span>
            <span className="text-xs text-emerald-600 font-bold mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> +22.4% inquiry rate
            </span>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Escrow Orders</span>
            <span className="text-2xl font-mono font-extrabold text-slate-900 mt-1 block">42</span>
            <span className="text-xs text-slate-500 font-medium mt-1">98.2% fulfillment rate</span>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Settled Gross Revenue</span>
            <span className="text-2xl font-mono font-extrabold text-slate-900 mt-1 block">185,800 MC</span>
            <span className="text-xs text-emerald-600 font-bold mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> +31.8% month-over-month
            </span>
          </div>
        </div>

        {/* Bar Chart Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-extrabold text-slate-900 text-base">Escrow Sales Volume & Revenue (MC)</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip
                  formatter={(val) => [`${formatCredits(val)}`, 'Gross Sales']}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="revenue" fill="#0f172a" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
