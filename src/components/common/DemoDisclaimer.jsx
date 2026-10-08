import { Info } from 'lucide-react'
import { DEMO_DISCLAIMER } from '../../utils/constants'

/**
 * Disclaimer banner explaining demo virtual credits.
 *
 * @param {{ className?: string, compact?: boolean }} props
 */
export default function DemoDisclaimer({ className = '', compact = false }) {
  if (compact) {
    return (
      <p className={`text-xs text-gray-400 italic ${className}`}>
        {DEMO_DISCLAIMER}
      </p>
    )
  }

  return (
    <div
      className={`flex items-start gap-3 rounded-xl bg-blue-50 border border-blue-100 px-4 py-3 ${className}`}
    >
      <Info className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
      <p className="text-xs text-blue-700 leading-relaxed">{DEMO_DISCLAIMER}</p>
    </div>
  )
}
