import { useState } from 'react'
import clsx from 'clsx'

/**
 * Star rating display or interactive input.
 *
 * @param {{
 *   value: number,
 *   max?: number,
 *   onChange?: (rating: number) => void,
 *   size?: 'sm'|'md'|'lg',
 *   showValue?: boolean,
 *   className?: string,
 *   readOnly?: boolean,
 * }} props
 */
export default function StarRating({
  value     = 0,
  max       = 5,
  onChange,
  size      = 'md',
  showValue = false,
  className = '',
  readOnly  = false,
}) {
  const [hovered, setHovered] = useState(0)
  const interactive = !readOnly && !!onChange

  const display = interactive && hovered ? hovered : value

  const sizes = {
    sm: 'w-4 h-4 text-base',
    md: 'w-5 h-5 text-xl',
    lg: 'w-6 h-6 text-2xl',
  }

  return (
    <div className={clsx('flex items-center gap-0.5', className)}>
      {Array.from({ length: max }, (_, i) => {
        const star    = i + 1
        const filled  = star <= Math.floor(display)
        const partial = !filled && star - 1 < display && display < star

        return (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onChange(star)}
            onMouseEnter={() => interactive && setHovered(star)}
            onMouseLeave={() => interactive && setHovered(0)}
            className={clsx(
              'leading-none transition-transform',
              interactive && 'hover:scale-110 cursor-pointer',
              !interactive && 'cursor-default',
              sizes[size],
            )}
            aria-label={`${star} star${star > 1 ? 's' : ''}`}
          >
            <span
              className={clsx(
                filled  ? 'text-yellow-400' :
                partial ? 'text-yellow-300' :
                          'text-gray-200',
              )}
            >
              ★
            </span>
          </button>
        )
      })}

      {showValue && (
        <span className="ml-1 text-sm text-gray-600 font-medium">
          {Number(value).toFixed(1)}
        </span>
      )}
    </div>
  )
}
