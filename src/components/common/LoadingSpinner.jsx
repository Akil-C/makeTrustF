import clsx from 'clsx'

/**
 * Centered loading spinner.
 *
 * @param {{ size?: 'sm'|'md'|'lg'|'xl', className?: string, color?: string }} props
 */
export default function LoadingSpinner({
  size = 'md',
  className = '',
  color = 'text-primary-600',
}) {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-3',
    xl: 'w-16 h-16 border-4',
  }

  return (
    <div className={clsx('flex items-center justify-center', className)}>
      <div
        className={clsx(
          'rounded-full border-solid border-current border-r-transparent animate-spin',
          sizes[size],
          color,
        )}
        role="status"
        aria-label="Loading"
      />
    </div>
  )
}
