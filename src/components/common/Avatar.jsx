import clsx from 'clsx'
import { User } from 'lucide-react'

const SIZES = {
  xs:  'w-6  h-6  text-xs',
  sm:  'w-8  h-8  text-sm',
  md:  'w-10 h-10 text-base',
  lg:  'w-12 h-12 text-lg',
  xl:  'w-16 h-16 text-xl',
  '2xl': 'w-20 h-20 text-2xl',
}

/**
 * User avatar with image, initials fallback, or icon fallback.
 *
 * @param {{
 *   src?: string,
 *   name?: string,
 *   size?: keyof SIZES,
 *   className?: string,
 *   onClick?: () => void,
 * }} props
 */
export default function Avatar({
  src,
  name,
  size      = 'md',
  className = '',
  onClick,
}) {
  const initials = name
    ? name
        .split(' ')
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase())
        .join('')
    : null

  const base = clsx(
    'rounded-full flex items-center justify-center overflow-hidden shrink-0 select-none',
    SIZES[size],
    onClick && 'cursor-pointer',
    className,
  )

  if (src) {
    return (
      <div className={base} onClick={onClick}>
        <img
          src={src}
          alt={name ?? 'Avatar'}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Swap to initials fallback on broken image
            e.currentTarget.style.display = 'none'
            e.currentTarget.nextSibling && (e.currentTarget.nextSibling.style.display = 'flex')
          }}
        />
        <span className="hidden w-full h-full bg-primary-100 text-primary-700 font-semibold items-center justify-center">
          {initials ?? <User className="w-1/2 h-1/2 text-primary-400" />}
        </span>
      </div>
    )
  }

  if (initials) {
    return (
      <div
        className={clsx(base, 'bg-primary-100 text-primary-700 font-semibold')}
        onClick={onClick}
      >
        {initials}
      </div>
    )
  }

  return (
    <div
      className={clsx(base, 'bg-gray-100 text-gray-400')}
      onClick={onClick}
    >
      <User className="w-1/2 h-1/2" />
    </div>
  )
}
