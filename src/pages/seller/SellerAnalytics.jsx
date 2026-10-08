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
} from 'lucide-react'
import { formatCredits } from '../../utils/formatters'
import DemoDisclaimer from '../../components/common/DemoDisclaimer'

const ANALYTICS_SERIES = [
  { date: 'Oct 1', views: 240, chatInquiries: 12, revenue: 450 },
  { date: 'Oct 2', views: 380, chatInquiries: 18, revenue: 780 },
  { date: 'Oct 3', views: 290, chatInquiries: 14, revenue: 600 },
  { date: 'Oct 4', views: 520, chatInquiries: 28, revenue: 1200 },
  { date: 'Oct 5', views: 410, chatInquiries: 22, revenue: 950 },
  { date: 'Oct 6', views: 680, chatInquiries: 35, revenue: 1600 },
]

export default function SellerAnalytics() {
  const [period, setPeriod] = useState('30d')
  const [data] = useState(ANALYTICS_SERIES)

  return (
    <div className="min-h-screen bg-[#F7F7F4] text-[#070707] pb-16">
      <DemoDisclaimer />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#070707]/10 pb-6 gap-4">
          <div>
            <span className="furniture-subtitle text-xs text-[#EF6F79]">STORE METRICS</span>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#070707] mt-1 flex items-center gap-3">
              <BarChart2 className="w-7 h-7 text-[#EF6F79]" /> Performance Analytics
            </h1>
            <p className="text-xs text-[#070707]/60 mt-1">
              Track item view impression velocity, buyer dialogue conversion rate, and gross escrow earnings.
            </p>
          </div>

          <div className="flex bg-[#F1F1ED] p-1 border border-[#070707]/10">
            {['7d', '30d', '90d', '1y'].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3.5 py-1.5 font-mono text-[11px] font-bold transition-all ${
                  period === p ? 'bg-[#070707] text-white' : 'text-[#070707]/60 hover:text-[#070707]'
                }`}
              >
                {p.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Metrics Summary Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-6 border border-[#070707]/10">
            <span className="furniture-subtitle text-[10px] text-[#070707]/50 flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-[#EF6F79]" /> LISTING VIEWS
            </span>
            <p className="text-3xl font-mono font-bold text-[#070707] mt-2">2,520</p>
            <span className="text-[11px] font-mono text-emerald-600 font-semibold mt-1 block">+18.5% this month</span>
          </div>

          <div className="bg-white p-6 border border-[#070707]/10">
            <span className="furniture-subtitle text-[10px] text-[#070707]/50 flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-[#070707]" /> BUYER INQUIRIES
            </span>
            <p className="text-3xl font-mono font-bold text-[#070707] mt-2">129</p>
            <span className="text-[11px] font-mono text-emerald-600 font-semibold mt-1 block">94% lead conversion rate</span>
          </div>

          <div className="bg-white p-6 border border-[#070707]/10">
            <span className="furniture-subtitle text-[10px] text-[#070707]/50 flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-[#EF6F79]" /> GROSS ESCROW PAYOUTS
            </span>
            <p className="text-3xl font-mono font-bold text-[#EF6F79] mt-2">{formatCredits(5580)}</p>
            <span className="text-[11px] font-mono text-emerald-600 font-semibold mt-1 block">Zero payout disputes</span>
          </div>
        </div>

        {/* Views & Inquiries Chart */}
        <div className="bg-white p-6 border border-[#070707]/10 space-y-4">
          <h3 className="font-serif font-bold text-[#070707] text-base">Listing Engagement Velocity</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E4E5E0" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#070707' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#070707' }} />
                <Tooltip />
                <Bar dataKey="views" fill="#070707" name="Views" />
                <Bar dataKey="chatInquiries" fill="#EF6F79" name="Chat Inquiries" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
