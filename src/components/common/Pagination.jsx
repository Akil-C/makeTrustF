import { ChevronLeft, ChevronRight } from 'lucide-react'
import clsx from 'clsx'

/**
 * Pagination component.
 *
 * @param {{
 *   currentPage: number,   // 0-based
 *   totalPages: number,
 *   onPageChange: (page: number) => void,
 *   className?: string,
 *   showInfo?: boolean,
 *   totalItems?: number,
 *   pageSize?: number,
 * }} props
 */
export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className  = '',
  showInfo   = false,
  totalItems,
  pageSize,
}) {
  if (totalPages <= 1) return null

  const pages = buildPageArray(currentPage, totalPages)

  const from = showInfo ? currentPage * pageSize + 1 : null
  const to   = showInfo ? Math.min((currentPage + 1) * pageSize, totalItems) : null

  return (
    <nav
      aria-label="Pagination"
      className={clsx('flex items-center justify-between gap-2', className)}
    >
      {showInfo && totalItems != null && (
        <p className="text-sm text-gray-500 hidden sm:block">
          Showing <span className="font-medium">{from}</span>–
          <span className="font-medium">{to}</span> of{' '}
          <span className="font-medium">{totalItems.toLocaleString()}</span> results
        </p>
      )}

      <div className="flex items-center gap-1 ml-auto">
        {/* Prev */}
        <PageBtn
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0}
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </PageBtn>

        {/* Number buttons */}
        {pages.map((p, i) =>
          p === '…' ? (
            <span key={`ellipsis-${i}`} className="w-9 text-center text-gray-400 select-none">
              …
            </span>
          ) : (
            <PageBtn
              key={p}
              onClick={() => onPageChange(p)}
              active={p === currentPage}
              aria-current={p === currentPage ? 'page' : undefined}
            >
              {p + 1}
            </PageBtn>
          ),
        )}

        {/* Next */}
        <PageBtn
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages - 1}
          aria-label="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </PageBtn>
      </div>
    </nav>
  )
}

function PageBtn({ children, active, disabled, onClick, ...rest }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        'w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors',
        active
          ? 'bg-primary-600 text-white'
          : 'text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed',
      )}
      {...rest}
    >
      {children}
    </button>
  )
}

/** Build an array of page indices (numbers) with "…" ellipsis markers */
function buildPageArray(current, total, wing = 2) {
  const pages = []
  const lo = Math.max(0, current - wing)
  const hi = Math.min(total - 1, current + wing)

  if (lo > 0) {
    pages.push(0)
    if (lo > 1) pages.push('…')
  }
  for (let i = lo; i <= hi; i++) pages.push(i)
  if (hi < total - 1) {
    if (hi < total - 2) pages.push('…')
    pages.push(total - 1)
  }
  return pages
}
