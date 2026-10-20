import { Coins } from 'lucide-react'
import clsx from 'clsx'
import { formatCredits } from '../../utils/formatters'

/**
 * Credits display — shows Indian Rupee amount and equivalent Credits (100 Credits = ₹100).
 *
 * @param {{
 *   amount: number,
 *   size?: 'xs'|'sm'|'md'|'lg',
 *   showIcon?: boolean,
 *   className?: string,
 *   highlight?: boolean,   // bold + primary color
 *   compact?: boolean,     // show only ₹
 * }} props
 */
export default function CreditsDisplay({
  amount,
  size      = 'md',
  showIcon  = true,
  className = '',
  highlight = false,
  compact   = false,
}) {
  const sizes = {
    xs: 'text-xs gap-1',
    sm: 'text-sm gap-1',
    md: 'text-base gap-1.5',
    lg: 'text-lg gap-2',
  }
  const iconSizes = {
    xs: 'w-3 h-3',
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  }

  const num = Number(amount || 0)
  const formatted = num.toLocaleString('en-IN')

  return (
    <span
      className={clsx(
        'inline-flex items-center font-medium',
        sizes[size],
        highlight ? 'text-rose-600 font-semibold' : 'text-slate-800',
        className,
      )}
      title="100 Credits = ₹100 (1 Credit = ₹1 INR)"
    >
      {showIcon && (
        <Coins className={clsx('text-amber-500 shrink-0', iconSizes[size])} />
      )}
      <span className="font-bold">₹{formatted}</span>
      {!compact && (
        <span className="text-[11px] font-normal text-slate-500 font-mono">
          ({formatted} Credits)
        </span>
      )}
    </span>
  )
}
