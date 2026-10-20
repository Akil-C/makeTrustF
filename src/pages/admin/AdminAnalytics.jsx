import { useState } from 'react'
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import { BarChart2, TrendingUp, DollarSign, Activity } from 'lucide-react'
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
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16 font-sans">
      <DemoDisclaimer />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Telemetry & Volume</span>
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
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">7-Day Gross Settlement</span>
            <span className="text-2xl font-mono font-extrabold text-slate-900 mt-1 block">167,700 MC</span>
            <span className="text-xs text-emerald-600 font-bold mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> +18.4% vs last week
            </span>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Platform Protocol Fee Revenue</span>
            <span className="text-2xl font-mono font-extrabold text-slate-900 mt-1 block">8,385 MC</span>
            <span className="text-xs text-emerald-600 font-bold mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> 5.0% flat escrow take-rate
            </span>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Average Settlement Velocity</span>
            <span className="text-2xl font-mono font-extrabold text-slate-900 mt-1 block">18.4 hrs</span>
            <span className="text-xs text-slate-500 font-medium mt-1">From delivery inspection to unlock</span>
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
