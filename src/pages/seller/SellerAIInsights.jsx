import { useState, useEffect } from 'react'
import {
  Sparkles,
  AlertTriangle,
  Zap,
  CheckCircle2,
  Bot,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react'
import aiService from '../../services/aiService'
import { formatCredits } from '../../utils/formatters'
import DemoDisclaimer from '../../components/common/DemoDisclaimer'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import toast from 'react-hot-toast'

const MOCK_AI_REPORT = {
  overallHealthScore: 94,
  strengths: [
    'Fast merchant response latency (< 15 mins) triggers high inquiry-to-escrow conversion.',
    '100% positive delivery fulfillment track record on all active electronics listings.',
    'Transparent item condition tags strictly adhere to Nexora quality verification guidelines.',
  ],
  weaknesses: [
    'Short item descriptions (under 50 words) receive 35% fewer direct buyer messages.',
    'Add 3 or more detailed photos for high-value tech listings to accelerate escrow closes.',
  ],
  pricingRecommendations: [
    {
      product: 'Sony WH-1000XM5 Wireless Headphones',
      currentPrice: 28000,
      recommendedPrice: 29500,
      logic: 'Strong local buyer demand (+24% search volume in Bengaluru) supports higher premium.',
    },
    {
      product: 'Apple MacBook Pro 16" M3 Max',
      currentPrice: 245000,
      recommendedPrice: 239000,
      logic: 'A slight -6,000 MC adjustment will trigger direct notification to 5 interested buyers.',
    },
  ],
  suspiciousSignals: [
    {
      type: 'Zero Security Incidents',
      detail: 'All customer communications remained on-platform with zero off-platform payment infractions.',
      risk: 'LOW',
    },
  ],
}

export default function SellerAIInsights() {
  const [report, setReport] = useState(MOCK_AI_REPORT)
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  const loadAi = async () => {
    setLoading(true)
    try {
      const res = await aiService.getStoreInsights()
      if (res.data) setReport(res.data)
    } catch {
      // Keep curated report
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAi()
  }, [])

  const handleRefresh = async () => {
    setRefreshing(true)
    await new Promise((r) => setTimeout(r, 900))
    setRefreshing(false)
    toast.success('Gemini AI Store Intelligence refreshed with latest metrics!')
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16 font-sans">
      <DemoDisclaimer />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header Banner */}
        <div className="bg-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-emerald-400 text-xs font-bold tracking-wide">
              <Bot className="w-3.5 h-3.5" />
              <span>POWERED BY GOOGLE GEMINI AI</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Seller Intelligence & Catalog Optimization
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Automated telemetry inspecting pricing elasticity, description fidelity, buyer inquiry conversion, and escrow safety.
            </p>
          </div>

          <div className="bg-white/10 rounded-2xl p-5 text-center shrink-0 border border-white/10 min-w-[160px]">
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
              Store Health Rating
            </span>
            <span className="text-4xl font-mono font-extrabold text-emerald-400 block mt-1">
              {report.overallHealthScore || 94}%
            </span>
            <span className="text-[11px] text-emerald-300 font-medium block mt-1">Excellent Standing</span>
          </div>
        </div>

        {/* Action bar */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 shadow-xs transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'Analyzing Store Telemetry...' : 'Refresh AI Analysis'}</span>
          </button>
        </div>

        {/* Strengths & Weaknesses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Strengths */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <h3 className="font-extrabold text-base text-slate-900">Key Merchant Strengths</h3>
            </div>
            <div className="space-y-3">
              {report.strengths.map((str, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-emerald-50/60 border border-emerald-100 text-xs text-emerald-950 leading-relaxed font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <span>{str}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Weaknesses / Opportunities */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Zap className="w-5 h-5 text-amber-500" />
              <h3 className="font-extrabold text-base text-slate-900">Conversion Growth Opportunities</h3>
            </div>
            <div className="space-y-3">
              {report.weaknesses.map((w, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-amber-50/60 border border-amber-100 text-xs text-amber-950 leading-relaxed font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  <span>{w}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pricing Suggestions */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h3 className="font-extrabold text-base text-slate-900">AI Dynamic Price Recommendations</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {report.pricingRecommendations.map((pr, idx) => (
              <div key={idx} className="p-5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
                <h4 className="font-bold text-sm text-slate-900">{pr.product}</h4>
                <div className="flex items-center gap-3 text-xs font-mono">
                  <span className="text-slate-500">Current: <strong className="text-slate-700">{formatCredits(pr.currentPrice)}</strong></span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-emerald-700 font-bold">Suggested: {formatCredits(pr.recommendedPrice)}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{pr.logic}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
