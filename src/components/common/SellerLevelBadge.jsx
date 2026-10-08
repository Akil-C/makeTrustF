import clsx from 'clsx'
import { getSellerLevelColor, getSellerLevelIcon } from '../../utils/formatters'

/**
 * Seller level badge (Bronze / Silver / Gold / Platinum).
 *
 * @param {{
 *   level: 'BRONZE'|'SILVER'|'GOLD'|'PLATINUM',
 *   size?: 'xs'|'sm'|'md',
 *   showIcon?: boolean,
 *   className?: string,
 * }} props
 */
export default function SellerLevelBadge({
  level,
  size      = 'sm',
  showIcon  = true,
  className = '',
}) {
  if (!level) return null

  const label = level.charAt(0).toUpperCase() + level.slice(1).toLowerCase()
  const icon  = getSellerLevelIcon(level)
  const color = getSellerLevelColor(level)

  const sizes = {
    xs: 'text-xs px-1.5 py-0.5 gap-0.5',
    sm: 'text-xs px-2   py-0.5 gap-1',
    md: 'text-sm px-2.5 py-1   gap-1',
  }

  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full font-medium border',
        color,
        sizes[size],
        className,
      )}
      title={`${label} Seller`}
    >
      {showIcon && <span aria-hidden>{icon}</span>}
      {label}
    </span>
  )
}
