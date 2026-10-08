import { useState, useEffect } from 'react'
import {
  Sparkles,
  AlertTriangle,
  Zap,
  CheckCircle2,
  Bot,
} from 'lucide-react'
import aiService from '../../services/aiService'
import { formatCredits } from '../../utils/formatters'
import DemoDisclaimer from '../../components/common/DemoDisclaimer'

const MOCK_AI_REPORT = {
  overallHealthScore: 94,
  strengths: [
    'Excellent response time (< 15 mins) builds high buyer conversion.',
    '100% positive escrow delivery rating on all electronics listings.',
    'Competitive pricing on Apple devices matches current Bay Area market averages.',
  ],
  weaknesses: [
    'Item descriptions under 50 words have 35% lower view-to-inquiry ratios.',
    'Only 1 primary photo uploaded for Sony Headphones listing (recommend 3+ angles).',
  ],
  pricingRecommendations: [
    { product: 'Sony WH-1000XM5 Headphones', currentPrice: 280, recommendedPrice: 310, logic: 'High demand surge (+22%) in local zip code.' },
    { product: 'MacBook Air M2', currentPrice: 1100, recommendedPrice: 1080, logic: 'Adjusting -20 MC will trigger 4 wishlist conversion alerts.' },
  ],
  suspiciousSignals: [
    { type: 'Off-Platform Attempt Blocked', detail: 'Buyer requested Telegram chat on iPhone 15 listing. Escrow warning trigger fired.', risk: 'LOW' },
  ],
}

export default function SellerAIInsights() {
  const [report, setReport] = useState(MOCK_AI_REPORT)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function loadAi() {
      setLoading(true)
      try {
        const res = await aiService.getStoreInsights()
        if (res.data) setReport(res.data)
      } catch {
        // Fallback mock
      } finally {
        setLoading(false)
      }
    }
    loadAi()
  }, [])

  return (
    <div className="min-h-screen bg-[#F7F7F4] text-[#070707] pb-16">
      <DemoDisclaimer />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Top Header */}
        <div className="bg-[#070707] text-white p-8 border border-[#070707] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#EF6F79]/20 text-[#EF6F79] text-[10px] font-mono uppercase tracking-wider mb-3 border border-[#EF6F79]/30">
              <Bot className="w-4 h-4" /> POWERED BY GEMINI AI ENGINE
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl">Gemini AI Store Intelligence</h1>
            <p className="text-xs text-[#F1F1ED]/80 mt-1 max-w-2xl">
              Automated audit analyzing market competitiveness, description completeness, pricing optimization, and transaction security.
            </p>
          </div>

          <div className="bg-[#F1F1ED]/10 p-6 border border-white/10 text-center shrink-0">
            <span className="furniture-subtitle text-[10px] text-[#EF6F79] block">AI STORE HEALTH SCORE</span>
            <span className="text-4xl font-mono font-bold text-white">{report.overallHealthScore}/100</span>
          </div>
        </div>

        {/* Strengths & Weaknesses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Strengths Card */}
          <div className="bg-white p-6 border border-[#070707]/10 space-y-4">
            <h3 className="font-serif font-bold text-[#070707] text-lg flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Store Strengths & Competitive Edges
            </h3>
            <ul className="space-y-3">
              {report.strengths.map((str, idx) => (
                <li key={idx} className="p-3 bg-[#F1F1ED] text-xs text-[#070707] border border-[#070707]/10 flex items-start gap-2">
                  <span className="font-bold text-[#EF6F79] shrink-0">•</span>
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Weaknesses Card */}
          <div className="bg-white p-6 border border-[#070707]/10 space-y-4">
            <h3 className="font-serif font-bold text-[#070707] text-lg flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-[#EF6F79]" /> Actionable Improvement Gaps
            </h3>
            <ul className="space-y-3">
              {report.weaknesses.map((weak, idx) => (
                <li key={idx} className="p-3 bg-[#F3D6DC]/40 text-xs text-[#070707] border border-[#EF6F79]/30 flex items-start gap-2">
                  <span className="font-bold text-[#EF6F79] shrink-0">•</span>
                  <span>{weak}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Pricing Recommendations Table */}
        <div className="bg-white p-6 border border-[#070707]/10 space-y-4">
          <h3 className="font-serif font-bold text-[#070707] text-lg flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#EF6F79]" /> AI Dynamic Pricing Recommendations
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F1F1ED] furniture-subtitle text-[10px] text-[#070707]/60 border-b border-[#070707]/10">
                <tr>
                  <th className="py-3 px-4">LISTING PRODUCT</th>
                  <th className="py-3 px-4">CURRENT PRICE</th>
                  <th className="py-3 px-4">AI OPTIMAL PRICE</th>
                  <th className="py-3 px-4">AI MARKET RATIONALE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#070707]/10">
                {report.pricingRecommendations.map((rec, idx) => (
                  <tr key={idx} className="hover:bg-[#F7F7F4]">
                    <td className="py-3.5 px-4 font-serif font-bold text-[#070707]">{rec.product}</td>
                    <td className="py-3.5 px-4 font-mono text-[#070707]/70">{formatCredits(rec.currentPrice)}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-[#EF6F79] text-sm">{formatCredits(rec.recommendedPrice)}</td>
                    <td className="py-3.5 px-4 text-[#070707]/80">{rec.logic}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
