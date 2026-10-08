import { CheckCircle } from 'lucide-react'
import clsx from 'clsx'

/**
 * Verified seller / listing badge.
 *
 * @param {{
 *   label?: string,
 *   size?: 'xs'|'sm'|'md',
 *   className?: string,
 * }} props
 */
export default function VerifiedBadge({
  label     = 'Verified',
  size      = 'sm',
  className = '',
}) {
  const sizes = {
    xs: 'text-xs gap-0.5',
    sm: 'text-xs gap-1',
    md: 'text-sm gap-1',
  }
  const iconSizes = { xs: 'w-3 h-3', sm: 'w-3.5 h-3.5', md: 'w-4 h-4' }

  return (
    <span
      className={clsx(
        'inline-flex items-center font-medium text-trust-green',
        sizes[size],
        className,
      )}
      title="Verified account"
    >
      <CheckCircle className={clsx('shrink-0', iconSizes[size])} />
      {label}
    </span>
  )
}
