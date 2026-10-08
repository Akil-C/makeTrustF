import clsx from 'clsx'

const VARIANTS = {
  default:   'bg-gray-100  text-gray-700',
  primary:   'bg-primary-100 text-primary-700',
  success:   'bg-green-100 text-green-700',
  warning:   'bg-yellow-100 text-yellow-700',
  danger:    'bg-red-100   text-red-700',
  info:      'bg-blue-100  text-blue-700',
  outline:   'border border-gray-300 text-gray-600 bg-transparent',
}

const SIZES = {
  xs: 'text-xs px-1.5 py-0.5',
  sm: 'text-xs px-2   py-0.5',
  md: 'text-sm px-2.5 py-1',
}

/**
 * Status / label badge.
 *
 * @param {{
 *   children: React.ReactNode,
 *   variant?: keyof VARIANTS,
 *   size?: 'xs'|'sm'|'md',
 *   dot?: boolean,
 *   className?: string,
 * }} props
 */
export default function Badge({
  children,
  variant   = 'default',
  size      = 'sm',
  dot       = false,
  className = '',
}) {
  const dotColors = {
    default: 'bg-gray-500',
    primary: 'bg-primary-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    danger:  'bg-red-500',
    info:    'bg-blue-500',
    outline: 'bg-gray-500',
  }

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 rounded-full font-medium',
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
    >
      {dot && (
        <span
          className={clsx('w-1.5 h-1.5 rounded-full', dotColors[variant])}
        />
      )}
      {children}
    </span>
  )
}
