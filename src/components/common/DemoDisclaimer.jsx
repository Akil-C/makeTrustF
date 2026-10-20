import { Coins } from 'lucide-react'
import { DEMO_DISCLAIMER } from '../../utils/constants'

/**
 * Disclaimer banner explaining demo virtual credits and the 100 Credits = 100 Rs conversion.
 *
 * @param {{ className?: string, compact?: boolean }} props
 */
export default function DemoDisclaimer({ className = '', compact = false }) {
  if (compact) {
    return (
      <div className={`flex items-center gap-1.5 text-xs text-amber-700 font-medium ${className}`}>
        <Coins className="w-3.5 h-3.5 text-amber-500 shrink-0" />
        <span>100 Credits = ₹100 • {DEMO_DISCLAIMER}</span>
      </div>
    )
  }

  return (
    <div
      className={`flex items-center justify-between gap-3 rounded-xl bg-amber-50/80 border border-amber-200/90 px-4 py-2.5 text-xs shadow-xs ${className}`}
    >
      <div className="flex items-center gap-2.5 text-amber-950">
        <div className="w-6 h-6 rounded-lg bg-amber-100 flex items-center justify-center shrink-0 text-amber-700">
          <Coins className="w-3.5 h-3.5" />
        </div>
        <p className="leading-relaxed">
          <strong className="font-bold text-amber-900">Exchange Rate: 100 Credits = ₹100 (1 Credit = ₹1 INR).</strong>{' '}
          <span className="text-amber-800/90">{DEMO_DISCLAIMER}</span>
        </p>
      </div>
      <span className="shrink-0 hidden sm:inline-flex px-2 py-0.5 bg-amber-200/70 text-amber-900 rounded font-mono font-bold text-[11px] border border-amber-300/60">
        100 Cr = ₹100
      </span>
    </div>
  )
}
