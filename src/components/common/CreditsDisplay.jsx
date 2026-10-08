import { Coins } from 'lucide-react'
import clsx from 'clsx'
import { formatCredits } from '../../utils/formatters'

/**
 * Credits display — shows MC amount with coin icon.
 *
 * @param {{
 *   amount: number,
 *   size?: 'xs'|'sm'|'md'|'lg',
 *   showIcon?: boolean,
 *   className?: string,
 *   highlight?: boolean,   // bold + primary color
 * }} props
 */
export default function CreditsDisplay({
  amount,
  size      = 'md',
  showIcon  = true,
  className = '',
  highlight = false,
}) {
  const sizes = {
    xs: 'text-xs gap-0.5',
    sm: 'text-sm gap-1',
    md: 'text-base gap-1',
    lg: 'text-lg gap-1.5',
  }
  const iconSizes = {
    xs: 'w-3 h-3',
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  }

  return (
    <span
      className={clsx(
        'inline-flex items-center font-medium',
        sizes[size],
        highlight ? 'text-primary-600 font-semibold' : 'text-gray-800',
        className,
      )}
      title="MarketTrust Credits (demo only)"
    >
      {showIcon && (
        <Coins className={clsx('text-trust-gold shrink-0', iconSizes[size])} />
      )}
      {formatCredits(amount)}
    </span>
  )
}
