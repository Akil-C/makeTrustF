/**
 * Loading skeleton card for product / list placeholders.
 *
 * @param {{ className?: string, lines?: number }} props
 */
export default function SkeletonCard({ className = '', lines = 2 }) {
  return (
    <div
      className={`bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse ${className}`}
    >
      {/* Image placeholder */}
      <div className="w-full aspect-square bg-gray-200" />

      {/* Content */}
      <div className="p-3 space-y-2">
        {/* Title lines */}
        {Array.from({ length: lines }, (_, i) => (
          <div
            key={i}
            className={`h-3 bg-gray-200 rounded-full ${i === lines - 1 ? 'w-3/5' : 'w-full'}`}
          />
        ))}

        {/* Price */}
        <div className="h-4 w-1/3 bg-gray-300 rounded-full mt-1" />

        {/* Badge row */}
        <div className="flex gap-2 mt-2">
          <div className="h-5 w-14 bg-gray-200 rounded-full" />
          <div className="h-5 w-16 bg-gray-200 rounded-full" />
        </div>
      </div>
    </div>
  )
}

/**
 * Inline text skeleton (single line placeholder).
 *
 * @param {{ width?: string, height?: string, className?: string }} props
 */
export function SkeletonLine({ width = 'w-full', height = 'h-4', className = '' }) {
  return (
    <div className={`bg-gray-200 rounded-full animate-pulse ${width} ${height} ${className}`} />
  )
}
