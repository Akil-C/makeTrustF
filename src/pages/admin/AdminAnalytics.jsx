import { useState } from 'react'
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import { BarChart2 } from 'lucide-react'
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
    <div className="min-h-screen bg-[#F7F7F4] text-[#070707] pb-16">
      <DemoDisclaimer />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="border-b border-[#070707]/10 pb-6">
          <span className="furniture-subtitle text-xs text-[#EF6F79]">FINANCIAL METRICS</span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#070707] mt-1 flex items-center gap-3">
            <BarChart2 className="w-7 h-7 text-[#EF6F79]" /> Platform Financial Analytics
          </h1>
          <p className="text-xs text-[#070707]/60 mt-1">
            Track gross escrow transaction volume and platform fee revenue across all marketplace categories.
          </p>
        </div>

        <div className="bg-white p-6 border border-[#070707]/10 space-y-4">
          <h3 className="font-serif font-bold text-[#070707] text-base">Total Escrow Transaction Volume (MC)</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={PLATFORM_DATA}>
                <defs>
                  <linearGradient id="adminVol" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF6F79" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#EF6F79" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E4E5E0" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#070707' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#070707' }} />
                <Tooltip />
                <Area type="monotone" dataKey="volume" stroke="#EF6F79" fill="url(#adminVol)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
