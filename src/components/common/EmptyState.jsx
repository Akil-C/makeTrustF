import { PackageOpen } from 'lucide-react'

/**
 * Empty list / zero-results state.
 *
 * @param {{
 *   icon?: React.ReactNode,
 *   title?: string,
 *   message?: string,
 *   action?: React.ReactNode,
 *   className?: string,
 * }} props
 */
export default function EmptyState({
  icon,
  title   = 'Nothing here yet',
  message = 'There are no items to display.',
  action,
  className = '',
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center py-16 px-4 text-center ${className}`}
    >
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        {icon ?? <PackageOpen className="w-8 h-8 text-gray-400" />}
      </div>

      <h3 className="text-lg font-semibold text-gray-700 mb-1">{title}</h3>
      <p className="text-sm text-gray-400 max-w-xs mb-6">{message}</p>

      {action && <div>{action}</div>}
    </div>
  )
}
